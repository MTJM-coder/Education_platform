import { useEffect, useMemo, useState } from "react";
import {
  Search,
  BookOpen,
  FileText,
  Clock3,
  ChevronRight,
  GraduationCap,
  X,
  Sparkles,
  Library,
  CalendarDays,
  UserRound,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import ParentSidebar from "../components/parent/ParentSidebar";
import { apiFetch } from "../lib/apiClient";

/* -------------------------------------------------- */
/* Helpers */
/* -------------------------------------------------- */

// Accepte [..], { data: [..] } ou { data: { data: [..] } } selon apiFetch.
function toList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  return [];
}

function getUserName(user) {
  if (!user) return null;
  if (user.name) return user.name;
  const full = [user.first_name, user.last_name].filter(Boolean).join(" ");
  return full || null;
}

function getLearnerName(learner) {
  if (!learner) return "Student";
  const own = [learner.first_name, learner.last_name].filter(Boolean).join(" ");
  if (own) return own;
  return getUserName(learner.user) ?? "Student";
}

// Après le correctif de GET /lecture-notes : `teacher_name`.
// Avant : ancien format (teacher.user), conservé en repli.
function getTeacherName(note) {
  return note.teacher_name || getUserName(note.teacher?.user) || "Teacher";
}

// Les fichiers sont sur le disque public : /storage/{chemin}.
function buildFileUrl(fileUrl) {
  if (!fileUrl) return null;
  const base = (import.meta.env.VITE_API_URL ?? "").replace(/\/api\/?$/, "");
  return `${base}/storage/${fileUrl}`;
}

function fileKind(fileUrl) {
  const extension = String(fileUrl ?? "").split(".").pop().toLowerCase();
  if (extension === "pdf") return "pdf";
  if (extension === "doc" || extension === "docx") return "word";
  return "other";
}

const KIND_LABEL = { pdf: "PDF", word: "Word", other: "File" };

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isThisMonth(value) {
  const date = new Date(value);
  const now = new Date();
  return (
    !Number.isNaN(date.getTime()) &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

/* -------------------------------------------------- */
/* Page */
/* -------------------------------------------------- */

export default function LearningPlatformPage() {
  const [children, setChildren] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedChild, setSelectedChild] = useState("");
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [onlyChildLevel, setOnlyChildLevel] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [childrenRes, notesRes] = await Promise.all([
          apiFetch("/me/children"),
          apiFetch("/lecture-notes"),
        ]);

        if (cancelled) return;

        const childList = toList(childrenRes);
        setChildren(childList);
        setNotes(toList(notesRes));
        if (childList.length > 0) setSelectedChild(childList[0].id);
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Unable to load the learning resources.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const child = children.find((item) => item.id === selectedChild) ?? null;
  const childName = child ? getLearnerName(child) : "your child";
  const childLevelId = child?.level_id ?? child?.level?.id ?? null;
  const childLevelName = child?.level?.name ?? null;

  // Notes du niveau de l'enfant (ou toutes, si la case est décochée).
  const levelNotes = useMemo(() => {
    if (!onlyChildLevel || !childLevelId) return notes;

    return notes.filter((note) =>
      (note.subject?.levels ?? []).some((level) => level.id === childLevelId)
    );
  }, [notes, onlyChildLevel, childLevelId]);

  const subjects = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(levelNotes.map((note) => note.subject?.name).filter(Boolean))
      ).sort(),
    ],
    [levelNotes]
  );

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase();

    return levelNotes.filter((note) => {
      const matchesSearch =
        !query ||
        (note.title ?? "").toLowerCase().includes(query) ||
        (note.subject?.name ?? "").toLowerCase().includes(query) ||
        getTeacherName(note).toLowerCase().includes(query);

      const matchesSubject =
        subjectFilter === "All" || note.subject?.name === subjectFilter;

      return matchesSearch && matchesSubject;
    });
  }, [levelNotes, search, subjectFilter]);

  const stats = useMemo(
    () => ({
      resources: levelNotes.length,
      subjects: new Set(levelNotes.map((note) => note.subject?.name).filter(Boolean)).size,
      recent: levelNotes.filter((note) => isThisMonth(note.created_at)).length,
    }),
    [levelNotes]
  );

  const changeChild = (id) => {
    setSelectedChild(id);
    setSubjectFilter("All");
    setSearch("");
  };

  const scrollToResources = () => {
    document.getElementById("resources")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F8F8FA]">
      <ParentSidebar />

      <main className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div>
              <div className="hidden text-sm text-gray-500 sm:block">
                Dashboard / Learning Platform
              </div>

              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Learning Platform
              </h1>
            </div>

            {children.length > 0 && (
              <div className="flex items-center gap-3">
                <label
                  htmlFor="learning-child"
                  className="hidden text-sm font-medium text-gray-600 sm:block"
                >
                  Learning for
                </label>

                <select
                  id="learning-child"
                  value={selectedChild}
                  onChange={(e) => changeChild(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium outline-none focus:border-[#6D4AFF]"
                >
                  {children.map((item) => (
                    <option key={item.id} value={item.id}>
                      {getLearnerName(item)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </header>

        <div className="space-y-8 p-4 sm:p-6 lg:p-8">
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600"
            >
              {error}
            </div>
          )}

          {/* Hero */}
          <section className="overflow-hidden rounded-3xl bg-[#6D4AFF] p-6 text-white shadow-sm sm:p-8">
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <div className="mb-3 flex items-center gap-2 text-purple-100">
                  <Sparkles size={18} />
                  <span className="text-sm font-medium">Learning resources</span>
                </div>

                <h2 className="text-2xl font-bold sm:text-3xl">
                  Help {childName} learn better.
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-purple-100 sm:text-base">
                  Course notes written by our validated teachers
                  {childLevelName ? `, for ${childLevelName}` : ""}. Open them,
                  read them and revise at your own pace.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={scrollToResources}
                    className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#6D4AFF] transition hover:bg-purple-50"
                  >
                    Browse resources
                  </button>
                </div>
              </div>

              <div className="hidden h-36 w-36 items-center justify-center rounded-full bg-white/10 lg:flex">
                <GraduationCap size={72} strokeWidth={1.5} />
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              icon={Library}
              label="Resources available"
              value={loading ? "—" : stats.resources}
            />

            <StatCard
              icon={BookOpen}
              label="Subjects covered"
              value={loading ? "—" : stats.subjects}
            />

            <StatCard
              icon={Clock3}
              label="Added this month"
              value={loading ? "—" : stats.recent}
            />
          </section>

          {/* Resources */}
          <section id="resources" className="scroll-mt-24">
            <SectionTitle
              title="Learning Resources"
              subtitle={
                onlyChildLevel && childLevelName
                  ? `Course notes for ${childLevelName}.`
                  : "Course notes for all levels."
              }
            />

            {/* Filters */}
            <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 xl:flex-row">
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by title, subject or teacher..."
                    className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#6D4AFF]"
                  />
                </div>

                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  aria-label="Subject"
                  className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#6D4AFF]"
                >
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject === "All" ? "All subjects" : subject}
                    </option>
                  ))}
                </select>
              </div>

              {childLevelId && (
                <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={onlyChildLevel}
                    onChange={(e) => {
                      setOnlyChildLevel(e.target.checked);
                      setSubjectFilter("All");
                    }}
                    className="h-4 w-4 rounded border-gray-300 accent-purple-600"
                  />
                  Only show resources for {childLevelName ?? "my child's level"}
                </label>
              )}
            </div>

            {/* Grid */}
            {loading ? (
              <p className="py-16 text-center text-sm text-gray-400">
                Loading resources…
              </p>
            ) : filteredNotes.length > 0 ? (
              <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredNotes.map((note) => (
                  <ResourceCard
                    key={note.id}
                    note={note}
                    onOpen={() => setSelectedNote(note)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title={notes.length === 0 ? "No resources yet" : "No resources found"}
                text={
                  notes.length === 0
                    ? "Teachers' course notes will appear here once they are validated."
                    : "Try another search, another subject, or show all levels."
                }
              />
            )}

            {!loading && children.length === 0 && (
              <p className="mt-4 text-center text-sm text-gray-500">
                Add a child in{" "}
                <Link to="/parent-children" className="font-medium text-[#6D4AFF] hover:underline">
                  My Children
                </Link>{" "}
                to see the resources for their level.
              </p>
            )}
          </section>
        </div>
      </main>

      {selectedNote && (
        <ResourceModal note={selectedNote} onClose={() => setSelectedNote(null)} />
      )}
    </div>
  );
}

/* -------------------------------------------------- */
/* Components */
/* -------------------------------------------------- */

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-[#6D4AFF]">
          <Icon size={21} />
        </div>

        <span className="text-2xl font-bold text-gray-900">{value}</span>
      </div>

      <p className="mt-4 text-sm text-gray-500">{label}</p>
    </div>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
    </div>
  );
}

function ResourceCard({ note, onOpen }) {
  const kind = fileKind(note.file_url);
  const levels = (note.subject?.levels ?? []).map((level) => level.name).filter(Boolean);

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="h-2 bg-purple-50" />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-[#6D4AFF]">
            <FileText size={23} />
          </div>

          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
            {KIND_LABEL[kind]}
          </span>
        </div>

        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[#6D4AFF]">
          {note.subject?.name ?? "General"}
        </p>

        <h3 className="mt-1 min-h-[48px] text-lg font-bold text-gray-900">
          {note.title}
        </h3>

        <div className="mt-3 space-y-1.5 text-sm text-gray-500">
          <p className="flex items-center gap-2">
            <UserRound size={14} />
            {getTeacherName(note)}
          </p>

          <p className="flex items-center gap-2">
            <CalendarDays size={14} />
            {formatDate(note.created_at)}
          </p>
        </div>

        {levels.length > 0 && (
          <p className="mt-3 line-clamp-1 text-xs text-gray-400">
            {levels.join(" · ")}
          </p>
        )}

        <button
          type="button"
          onClick={onOpen}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#6D4AFF] hover:text-[#6D4AFF]"
        >
          Open resource
          <ChevronRight size={17} />
        </button>
      </div>
    </div>
  );
}

function EmptyState({ title, text }) {
  return (
    <div className="mt-5 rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
      <BookOpen className="mx-auto text-gray-300" size={42} />

      <h3 className="mt-4 font-semibold text-gray-900">{title}</h3>

      <p className="mt-1 text-sm text-gray-500">{text}</p>
    </div>
  );
}

function ResourceModal({ note, onClose }) {
  const kind = fileKind(note.file_url);
  const url = buildFileUrl(note.file_url);
  const levels = (note.subject?.levels ?? []).map((level) => level.name).filter(Boolean);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={note.title}
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-[#6D4AFF]">
              <FileText size={23} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#6D4AFF]">
                {note.subject?.name ?? "General"} · {KIND_LABEL[kind]}
              </p>

              <h2 className="mt-1 text-xl font-bold text-gray-900">{note.title}</h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <InfoItem label="Teacher" value={getTeacherName(note)} />
            <InfoItem label="Added" value={formatDate(note.created_at)} />
            <InfoItem label="Levels" value={levels.length ? levels.join(", ") : "—"} />
          </div>

          {!url ? (
            <p className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-400">
              No file available for this resource.
            </p>
          ) : kind === "pdf" ? (
            <>
              <iframe
                src={url}
                title={note.title}
                className="h-[60vh] w-full rounded-xl border border-gray-200 bg-white"
              />

              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#6D4AFF] hover:underline"
              >
                <ExternalLink size={15} />
                Open in a new tab
              </a>
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center">
              <FileText className="mx-auto h-8 w-8 text-gray-300" />

              <p className="mt-3 text-sm text-gray-500">
                This document cannot be previewed in the browser. Open it to
                read it.
              </p>

              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#6D4AFF] px-5 py-3 text-sm font-semibold text-white hover:bg-[#5d3de0]"
              >
                <ExternalLink size={16} />
                Open / download
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="rounded-xl bg-[#F8F8FA] p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}