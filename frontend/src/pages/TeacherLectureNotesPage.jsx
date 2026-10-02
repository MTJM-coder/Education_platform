import {
  BookOpen,
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  Filter,
  Plus,
  Search,
  Upload,
  X,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import TeacherSidebar from "../components/teacher/TeacherSidebar";
import { apiFetch } from "../lib/apiClient";

/* ========================================================= */
/* CONSTANTS                                                   */
/* ========================================================= */

// À aligner avec CreateLectureNoteRequest (je n'ai pas vu ses règles).
// Le serveur reste l'autorité : ses messages d'erreur s'affichent dans le modal.
const ACCEPTED_FILES = ".pdf,.doc,.docx";
const MAX_FILE_MB = 10;

const STATUS = {
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    className: "bg-green-50 text-green-700",
  },
  pending: {
    label: "Pending Review",
    icon: Clock3,
    className: "bg-amber-50 text-amber-700",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-red-50 text-red-700",
  },
};

const filters = [
  { key: "all", label: "All" },
  { key: "approved", label: "Approved" },
  { key: "pending", label: "Pending Review" },
  { key: "rejected", label: "Rejected" },
];


function toList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  return [];
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function levelNames(note) {
  return (note.subject?.levels ?? [])
    .map((level) => level.name)
    .filter(Boolean)
    .join(", ");
}

// lecture_notes.file_url est un chemin relatif sur le disque 'public'
// (storage/app/public/...), accessible directement via /storage/{path} —
// pas besoin d'accessor backend, ni de route protegee (contrairement aux
// documents d'identite enseignant, qui eux sont sensibles).
function buildFileUrl(fileUrl) {
  if (!fileUrl) return null;
  return `${import.meta.env.VITE_API_URL.replace("/api", "")}/storage/${fileUrl}`;
}

/* ========================================================= */
/* PAGE                                                        */
/* ========================================================= */

export default function TeacherLectureNotesPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showUpload, setShowUpload] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const [teacherId, setTeacherId] = useState(null);
  const [notes, setNotes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotes = useCallback(async (id) => {
    const response = await apiFetch(`/teachers/${id}/lecture-notes`);
    setNotes(toList(response));
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const me = await apiFetch("/auth/me");
        console.log(me)
        const id = me.data.user_id;


        if (!id) throw new Error("Unable to identify the current user.");

        const [notesRes, subjectsRes] = await Promise.all([
          apiFetch(`/teachers/${id}/lecture-notes`),
          apiFetch("/subjects"),
        ]);

        if (cancelled) return;
        setTeacherId(id);
        setNotes(toList(notesRes));
        setSubjects(toList(subjectsRes));
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Unable to load your lecture notes.");
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

  const counts = useMemo(
    () => ({
      total: notes.length,
      approved: notes.filter((n) => n.status === "approved").length,
      pending: notes.filter((n) => n.status === "pending").length,
      rejected: notes.filter((n) => n.status === "rejected").length,
    }),
    [notes]
  );

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase();

    return notes.filter((note) => {
      const matchesSearch =
        !query ||
        (note.title ?? "").toLowerCase().includes(query) ||
        (note.subject?.name ?? "").toLowerCase().includes(query) ||
        levelNames(note).toLowerCase().includes(query);

      const matchesFilter =
        activeFilter === "all" || note.status === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [notes, search, activeFilter]);

  return (
    <div className="min-h-screen bg-[#FAFAFC]">
      <TeacherSidebar activeItem="My Lecture Notes" />

      <main className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-100 bg-white/95 px-6 backdrop-blur lg:px-8">
          <div className="ml-12 lg:ml-0">
            <p className="text-xs text-gray-400">Teacher Portal</p>

            <h1 className="text-lg font-semibold text-pf-purple-dark">
              My Lecture Notes
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setShowUpload(true)}
            disabled={!teacherId}
            className="flex items-center gap-2 rounded-lg bg-pf-purple px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />

            <span className="hidden sm:inline">Upload Note</span>
          </button>
        </header>

        <div className="p-6 lg:p-8">
          {/* Intro */}
          <section className="mb-7">

            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Upload and manage your course materials. Each note is reviewed by
              the administrator before it becomes available on the platform.
            </p>
          </section>

          {error && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600"
            >
              {error}
            </div>
          )}

          {/* Summary */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              icon={FileText}
              label="Total Notes"
              value={loading ? "—" : counts.total}
              description="Uploaded materials"
            />

            <SummaryCard
              icon={CheckCircle2}
              label="Approved"
              value={loading ? "—" : counts.approved}
              description="Available to students"
            />

            <SummaryCard
              icon={Clock3}
              label="Pending"
              value={loading ? "—" : counts.pending}
              description="Waiting for review"
            />

            <SummaryCard
              icon={XCircle}
              label="Rejected"
              value={loading ? "—" : counts.rejected}
              description="Not published"
            />
          </section>

          {/* Search / Filters */}
          <section className="mt-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  placeholder="Search notes, subjects or levels..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-pf-purple focus:bg-white"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="mr-1 flex items-center text-gray-400">
                  <Filter className="h-4 w-4" />
                </div>

                {filters.map((filter) => (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() => setActiveFilter(filter.key)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                      activeFilter === filter.key
                        ? "bg-pf-purple text-white"
                        : "bg-gray-50 text-gray-500 hover:bg-pf-purple-light hover:text-pf-purple"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Notes */}
          <section className="mt-6 rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-4">
              <h3 className="font-semibold text-pf-purple-dark">
                Uploaded Materials
              </h3>

              <p className="mt-0.5 text-xs text-gray-400">
                {filteredNotes.length} note
                {filteredNotes.length !== 1 ? "s" : ""}
              </p>
            </div>

            {loading && (
              <p className="px-6 py-10 text-center text-sm text-gray-400">
                Loading your lecture notes…
              </p>
            )}

            {!loading && filteredNotes.length > 0 && (
              <div className="divide-y divide-gray-100">
                {filteredNotes.map((note) => (
                  <NoteRow
                    key={note.id}
                    note={note}
                    onView={() => setSelectedNote(note)}
                  />
                ))}
              </div>
            )}

            {!loading && filteredNotes.length === 0 && (
              <EmptyState
                filtered={notes.length > 0}
                canUpload={Boolean(teacherId)}
                onUpload={() => setShowUpload(true)}
              />
            )}
          </section>
        </div>
      </main>

      {showUpload && (
        <UploadNoteModal
          teacherId={teacherId}
          subjects={subjects}
          onClose={() => setShowUpload(false)}
          onUploaded={async () => {
            setShowUpload(false);
            setError("");
            try {
              // La réponse du store n'embarque pas la matière : on recharge.
              await loadNotes(teacherId);
            } catch (err) {
              setError(
                err?.message ||
                  "Note submitted, but the list could not be refreshed."
              );
            }
          }}
        />
      )}

      {selectedNote && (
        <NoteDetailsModal
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
        />
      )}
    </div>
  );
}

/* ========================================================= */
/* NOTE ROW                                                    */
/* ========================================================= */

function NoteRow({ note, onView }) {
  const levels = levelNames(note);

  return (
    <div className="px-5 py-5 transition hover:bg-gray-50/60">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-pf-purple-light text-pf-purple">
            <FileText className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="truncate font-medium text-pf-purple-dark">
                {note.title}
              </h4>

              <StatusBadge status={note.status} />
            </div>

            <p className="mt-1 text-sm text-gray-500">
              {[note.subject?.name, levels].filter(Boolean).join(" · ") || "—"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-5 lg:justify-end">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-gray-400">
              Submitted
            </p>

            <p className="mt-1 text-sm font-medium text-pf-purple-dark">
              {formatDate(note.created_at)}
            </p>
          </div>

          <button
            type="button"
            onClick={onView}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-pf-purple transition hover:bg-pf-purple-light"
          >
            <Eye className="h-4 w-4" />
            View
          </button>
        </div>
      </div>
    </div>
  );
}

/* ========================================================= */
/* SMALL COMPONENTS                                            */
/* ========================================================= */

function SummaryCard({ icon: Icon, label, value, description }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-pf-purple-dark">
            {value}
          </p>

          <p className="mt-1 text-xs text-gray-400">{description}</p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pf-purple-light text-pf-purple">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const current = STATUS[status] ?? {
    label: status || "Unknown",
    icon: Clock3,
    className: "bg-gray-100 text-gray-600",
  };
  const Icon = current.icon;

  return (
    <span
      className={`flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${current.className}`}
    >
      <Icon className="h-3 w-3" />
      {current.label}
    </span>
  );
}

function EmptyState({ filtered, canUpload, onUpload }) {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-pf-purple-light">
        <BookOpen className="h-5 w-5 text-pf-purple" />
      </div>

      <h3 className="mt-4 font-semibold text-pf-purple-dark">
        {filtered ? "No notes found" : "No lecture notes yet"}
      </h3>

      <p className="mx-auto mt-1 max-w-sm text-sm text-gray-400">
        {filtered
          ? "Try changing your search or filter."
          : "Upload your first lecture note to share educational material on the platform."}
      </p>

      {!filtered && canUpload && (
        <button
          type="button"
          onClick={onUpload}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-pf-purple px-4 py-2.5 text-sm font-medium text-white"
        >
          <Upload className="h-4 w-4" />
          Upload Note
        </button>
      )}
    </div>
  );
}

/* ========================================================= */
/* UPLOAD MODAL                                                */
/* ========================================================= */

function UploadNoteModal({ teacherId, subjects, onClose, onUploaded }) {
  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleFileChange = (event) => {
    const chosen = event.target.files?.[0] ?? null;
    setFormError("");

    if (chosen && chosen.size > MAX_FILE_MB * 1024 * 1024) {
      setFile(null);
      setFormError(`The file must not exceed ${MAX_FILE_MB} MB.`);
      return;
    }

    setFile(chosen);
  };

  const handleSubmit = async () => {
    setFormError("");

    if (!title.trim() || !subjectId || !file) {
      setFormError("Please enter a title, choose a subject and add a file.");
      return;
    }

    // multipart/form-data : apiFetch ne doit pas imposer Content-Type JSON.
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("subject_id", subjectId);
    formData.append("file", file);

    setSubmitting(true);

    try {
      await apiFetch(`/teachers/${teacherId}/lecture-notes`, {
        method: "POST",
        body: formData,
      });

      await onUploaded();
    } catch (err) {
      setFormError(err?.message || "Unable to submit this note.");
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Upload Lecture Note" onClose={onClose}>
      <p className="text-sm text-gray-500">
        Upload a course note or learning material. The administrator will
        review it before it is published.
      </p>

      <div className="mt-5 space-y-4">
        <FormField label="Title">
          <input
            type="text"
            placeholder="e.g. Quadratic Equations"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormField>

        <FormField label="Subject">
          <select
            className="form-input"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
          >
            <option value="">Select subject</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </FormField>

        <div>
          <span className="mb-1.5 block text-xs font-medium text-gray-500">
            File
          </span>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-8 text-center transition hover:border-pf-purple/30 hover:bg-pf-purple-light/30">
            <Upload className="h-7 w-7 text-pf-purple" />

            <p className="mt-3 text-sm font-medium text-pf-purple-dark">
              {file?.name || "Click to upload your file"}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              PDF, DOC or DOCX · Maximum {MAX_FILE_MB} MB
            </p>

            <input
              type="file"
              accept={ACCEPTED_FILES}
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>

      {formError && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {formError}
        </p>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="flex items-center gap-2 rounded-lg bg-pf-purple px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Upload className="h-4 w-4" />
          {submitting ? "Submitting…" : "Submit Note"}
        </button>
      </div>
    </Modal>
  );
}

/* ========================================================= */
/* NOTE DETAILS MODAL                                          */
/* ========================================================= */

function NoteDetailsModal({ note, onClose }) {
  const levels = levelNames(note);

  const documentUrl = buildFileUrl(note.file_url);
  const isPdf = note.file_url?.toLowerCase().endsWith(".pdf");
  const isImage = /\.(jpg|jpeg|png|webp)$/i.test(note.file_url || "");

  return (
    <Modal title="Lecture Note Details" onClose={onClose}>
      <div className="rounded-xl bg-pf-purple-light p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-pf-purple text-white">
            <FileText className="h-6 w-6" />
          </div>

          <div>
            <h3 className="font-semibold text-pf-purple-dark">{note.title}</h3>

            <p className="mt-1 text-sm text-gray-500">
              {[note.subject?.name, levels].filter(Boolean).join(" · ") || "—"}
            </p>

            <div className="mt-2">
              <StatusBadge status={note.status} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Detail label="Subject" value={note.subject?.name ?? "—"} />
        <Detail label="Submitted" value={formatDate(note.created_at)} />
        {note.validated_at && (
          <Detail label="Reviewed" value={formatDate(note.validated_at)} />
        )}
      </div>

      {note.status === "rejected" && (
        <div className="mt-5 rounded-lg border border-red-100 bg-red-50 p-4">
          <p className="text-xs font-semibold text-red-700">
            Rejected by the administrator
          </p>

          <p className="mt-1 text-sm text-red-600">
            This note was not published. Contact the administrator for details,
            or submit a corrected version.
          </p>
        </div>
      )}

      {/* Apercu du document */}
      <div className="mt-5">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
          Document
        </p>

        {!documentUrl ? (
          <p className="rounded-lg border border-dashed border-gray-200 p-6 text-center text-sm text-gray-400">
            No file available for this note.
          </p>
        ) : isPdf ? (
          <iframe
            src={documentUrl}
            title={note.title}
            className="h-[55vh] w-full rounded-lg border border-gray-200 bg-white"
          />
        ) : isImage ? (
          <img
            src={documentUrl}
            alt={note.title}
            className="max-h-[55vh] w-full rounded-lg border border-gray-200 object-contain bg-[#FAFAFC]"
          />
        ) : (
          // Word (.doc/.docx) : pas de rendu natif possible dans un navigateur
          // sans service de conversion — on propose seulement l'ouverture.
          <div className="rounded-lg border border-dashed border-gray-200 p-8 text-center">
            <FileText className="mx-auto h-8 w-8 text-gray-300" />
            <p className="mt-3 text-sm text-gray-500">
              Preview not available for Word documents in the browser.
            </p>
            <a
              href={documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-pf-purple px-4 py-2 text-xs font-medium text-white"
            >
              <Eye className="h-3.5 w-3.5" />
              Open file
            </a>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end gap-3">
        {documentUrl && (isPdf || isImage) && (
          <a
            href={documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-pf-purple"
          >
            <Eye className="h-4 w-4" />
            Open in new tab
          </a>
        )}

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg bg-pf-purple px-4 py-2.5 text-sm font-medium text-white"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}

/* ========================================================= */
/* MODAL / FORM / DETAIL                                       */
/* ========================================================= */

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <h2 className="font-semibold text-pf-purple-dark">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-50 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-gray-500">
        {label}
      </span>

      {children}
    </label>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>

      <p className="mt-1 text-sm font-medium text-pf-purple-dark">{value}</p>
    </div>
  );
}