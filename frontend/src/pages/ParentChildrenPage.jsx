import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  ChevronDown,
  GraduationCap,
  Plus,
  Search,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import ParentSidebar from "../components/parent/ParentSidebar";
import AddChildModal from "../components/parent/AddChildModal";
import { apiFetch } from "../lib/apiClient";

/* ========================================================= */
/* HELPERS                                                     */
/* ========================================================= */

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

// Enfant : first_name / last_name sur le learner. Élève auto-inscrit : nom du compte.
function getLearnerName(learner) {
  if (!learner) return "Student";
  const own = [learner.first_name, learner.last_name].filter(Boolean).join(" ");
  if (own) return own;
  return getUserName(learner.user) ?? "Student";
}

function roundScore(value) {
  return Math.round(value * 10) / 10;
}

const CHILD_COLORS = [
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
];

/* ========================================================= */
/* SMALL COMPONENTS                                            */
/* ========================================================= */

function ProgressBar({ value }) {
  const width = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div
      className="h-2 overflow-hidden rounded-full bg-gray-100"
      role="progressbar"
      aria-valuenow={width}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Average score: ${width}/100`}
    >
      <div
        className="h-full rounded-full bg-pf-purple transition-all duration-500"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

function ChildCard({ child, onViewProfile }) {
  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-purple-200 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold ${child.color}`}
        >
          {child.name
            .split(" ")
            .map((part) => part[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-gray-900">{child.name}</h2>
          <p className="mt-1 text-sm text-gray-500">
            {[child.className, child.levelName].filter(Boolean).join(" · ") || "—"}
          </p>
          {child.school && (
            <p className="mt-1 text-xs text-gray-400">{child.school}</p>
          )}
        </div>

        {child.subjects.length > 0 ? (
          <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
            Active
          </span>
        ) : (
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
            No teacher yet
          </span>
        )}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-gray-50 p-3">
          <div className="flex items-center gap-2 text-gray-400">
            <GraduationCap size={16} />
            <span className="text-xs">Teachers</span>
          </div>
          <p className="mt-2 text-lg font-semibold text-gray-900">
            {child.teachers}
          </p>
        </div>

        <div className="rounded-xl bg-gray-50 p-3">
          <div className="flex items-center gap-2 text-gray-400">
            <BookOpen size={16} />
            <span className="text-xs">Subjects</span>
          </div>
          <p className="mt-2 text-lg font-semibold text-gray-900">
            {child.subjects.length}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-gray-500">Average score</span>
          <span className="text-sm font-semibold text-pf-purple">
            {child.average === null ? "—" : `${roundScore(child.average)}/100`}
          </span>
        </div>
        <ProgressBar value={child.average ?? 0} />
        <p className="mt-2 text-[11px] text-gray-400">
          {child.resultsCount === 0
            ? "No result recorded yet"
            : `Based on ${child.resultsCount} result${child.resultsCount !== 1 ? "s" : ""}`}
        </p>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-medium text-gray-500">
          Enrolled subjects
        </p>

        {child.subjects.length === 0 ? (
          <p className="text-xs text-gray-400">No subject yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {child.subjects.map((subject) => (
              <span
                key={subject}
                className="rounded-lg border border-gray-100 px-2.5 py-1 text-xs text-gray-600"
              >
                {subject}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={() => onViewProfile(child)}
          className="flex items-center justify-center gap-2 rounded-lg bg-pf-purple px-3 py-2.5 text-sm font-medium text-white transition hover:bg-pf-purple-dark"
        >
          <UserRound size={16} />
          View profile
        </button>

        <Link
          to={`/resultats-scolaires?learner=${encodeURIComponent(child.id)}`}
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <BarChart3 size={16} />
          Results
        </Link>
      </div>

      <div className="mt-3 flex gap-4">
        <Link
          to={`/child-progress?learner=${encodeURIComponent(child.id)}`}
          className="flex items-center gap-1 text-xs font-medium text-pf-purple hover:underline"
        >
          View progress <ArrowRight size={13} />
        </Link>

        <Link
          to={`/parent-schedule?learner=${encodeURIComponent(child.id)}`}
          className="flex items-center gap-1 text-xs font-medium text-pf-purple hover:underline"
        >
          Schedule <CalendarDays size={13} />
        </Link>
      </div>
    </article>
  );
}

/* ========================================================= */
/* PAGE                                                        */
/* ========================================================= */

export default function ParentChildrenPage() {
  const navigate = useNavigate();

  const [children, setChildren] = useState([]);
  const [requests, setRequests] = useState([]);
  const [resultsByChild, setResultsByChild] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [notice, setNotice] = useState("");

  const loadAll = useCallback(async () => {
    const [childrenRes, requestsRes] = await Promise.all([
      apiFetch("/me/children"),
      apiFetch("/me/tutoring-requests"),
    ]);

    const childList = toList(childrenRes);

    // Résultats de chaque enfant : un échec n'empêche pas d'afficher le reste.
    const settled = await Promise.allSettled(
      childList.map((child) => apiFetch(`/learners/${child.id}/results`))
    );

    const results = {};
    childList.forEach((child, index) => {
      const outcome = settled[index];
      results[child.id] =
        outcome.status === "fulfilled" ? toList(outcome.value) : [];
    });

    setChildren(childList);
    setRequests(toList(requestsRes));
    setResultsByChild(results);
  }, []);

  useEffect(() => {
    loadAll()
      .catch((err) => setError(err?.message || "Unable to load your children."))
      .finally(() => setLoading(false));
  }, [loadAll]);

  // Une carte par enfant : matières et enseignants viennent des affectations ACTIVES.
  const childCards = useMemo(
    () =>
      children.map((child, index) => {
        const active = requests
          .filter((request) => request.learner_id === child.id)
          .flatMap((request) =>
            (request.assignments ?? [])
              .filter((assignment) => assignment.status === "active")
              .map((assignment) => ({ assignment, request }))
          );

        const subjects = Array.from(
          new Set(
            active.map(({ request }) => request.subject?.name).filter(Boolean)
          )
        );

        const teachers = new Set(
          active.map(({ assignment }) => assignment.teacher_id)
        ).size;

        const scores = (resultsByChild[child.id] ?? [])
          .map((result) => Number(result.score))
          .filter(Number.isFinite);

        return {
          id: child.id,
          name: getLearnerName(child),
          className: child.classroom?.name ?? null,
          levelName: child.level?.name ?? null,
          school: child.school_name ?? null,
          subjects,
          teachers,
          resultsCount: scores.length,
          scoreSum: scores.reduce((sum, score) => sum + score, 0),
          average: scores.length
            ? scores.reduce((sum, score) => sum + score, 0) / scores.length
            : null,
          color: CHILD_COLORS[index % CHILD_COLORS.length],
        };
      }),
    [children, requests, resultsByChild]
  );

  const levelOptions = useMemo(
    () =>
      Array.from(new Set(childCards.map((child) => child.levelName).filter(Boolean))),
    [childCards]
  );

  const filteredChildren = useMemo(() => {
    const query = search.trim().toLowerCase();

    return childCards.filter((child) => {
      const matchesSearch =
        !query ||
        child.name.toLowerCase().includes(query) ||
        (child.className ?? "").toLowerCase().includes(query) ||
        (child.school ?? "").toLowerCase().includes(query) ||
        child.subjects.some((subject) => subject.toLowerCase().includes(query));

      const matchesLevel =
        levelFilter === "All" || child.levelName === levelFilter;

      return matchesSearch && matchesLevel;
    });
  }, [childCards, search, levelFilter]);

  const overall = useMemo(() => {
    const count = childCards.reduce((sum, child) => sum + child.resultsCount, 0);
    const total = childCards.reduce((sum, child) => sum + child.scoreSum, 0);
    return count ? total / count : null;
  }, [childCards]);

  function viewProfile(child) {
    navigate(`/parent-child-profile/${encodeURIComponent(child.id)}`);
  }

  return (
    <div className="min-h-screen bg-[#F8F8FA]">
      <ParentSidebar />

      <main className="min-h-screen lg:ml-64">
        <div className="mx-auto max-w-[1500px] px-5 py-6 sm:px-7 lg:px-10 lg:py-8">
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">Parent Portal / My Children</p>
              <h1 className="mt-2 text-2xl font-semibold text-gray-900">
                My Children
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage learner information and follow academic progress.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setNotice("");
                setShowAddModal(true);
              }}
              className="flex items-center justify-center gap-2 rounded-lg bg-pf-purple px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-pf-purple-dark"
            >
              <Plus size={18} />
              Add Child
            </button>
          </header>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600"
            >
              {error}
            </div>
          )}

          {notice && (
            <div className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
              <p>{notice}</p>
              <button
                type="button"
                onClick={() => setNotice("")}
                aria-label="Dismiss message"
                className="shrink-0 rounded p-1 hover:bg-green-100"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <section className="mb-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <UsersRound className="text-pf-purple" size={21} />
              <p className="mt-3 text-2xl font-semibold text-gray-900">
                {loading ? "—" : childCards.length}
              </p>
              <p className="mt-1 text-sm text-gray-500">Total children</p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <GraduationCap className="text-pf-purple" size={21} />
              <p className="mt-3 text-2xl font-semibold text-gray-900">
                {loading
                  ? "—"
                  : childCards.reduce((sum, child) => sum + child.teachers, 0)}
              </p>
              <p className="mt-1 text-sm text-gray-500">Teacher connections</p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <BarChart3 className="text-pf-purple" size={21} />
              <p className="mt-3 text-2xl font-semibold text-gray-900">
                {loading || overall === null ? "—" : `${roundScore(overall)}/100`}
              </p>
              <p className="mt-1 text-sm text-gray-500">Average score</p>
            </div>
          </section>

          <section className="mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by name, class, school or subject..."
                  aria-label="Search children"
                  className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="relative md:w-52">
                <select
                  value={levelFilter}
                  onChange={(event) => setLevelFilter(event.target.value)}
                  aria-label="Filter by school level"
                  className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 pr-9 text-sm text-gray-700 outline-none focus:border-purple-400"
                >
                  <option value="All">All levels</option>
                  {levelOptions.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>
          </section>

          {loading ? (
            <p className="py-16 text-center text-sm text-gray-400">
              Loading your children…
            </p>
          ) : childCards.length === 0 ? (
            <section className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
              <UsersRound className="mx-auto text-gray-300" size={38} />
              <h2 className="mt-4 font-semibold text-gray-900">
                You have not added any child yet
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Add your first child to request a teacher and follow their results.
              </p>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-pf-purple px-4 py-2.5 text-sm font-medium text-white hover:bg-pf-purple-dark"
              >
                <Plus size={16} />
                Add Child
              </button>
            </section>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-semibold text-gray-800">
                    {filteredChildren.length}
                  </span>{" "}
                  {filteredChildren.length === 1 ? "child" : "children"}
                </p>
              </div>

              {filteredChildren.length > 0 ? (
                <section className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
                  {filteredChildren.map((child) => (
                    <ChildCard
                      key={child.id}
                      child={child}
                      onViewProfile={viewProfile}
                    />
                  ))}
                </section>
              ) : (
                <section className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
                  <UsersRound className="mx-auto text-gray-300" size={38} />
                  <h2 className="mt-4 font-semibold text-gray-900">
                    No children found
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    Try another search or change the school-level filter.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setLevelFilter("All");
                    }}
                    className="mt-4 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Clear filters
                  </button>
                </section>
              )}
            </>
          )}
        </div>
      </main>

      {showAddModal && (
        <AddChildModal
          onClose={() => setShowAddModal(false)}
          onAdded={async (fullName) => {
            setShowAddModal(false);
            setSearch("");
            setLevelFilter("All");
            setError("");

            try {
              await loadAll();
              setNotice(`${fullName} was added.`);
            } catch (err) {
              setError(
                err?.message || "Child added, but the page could not be refreshed."
              );
            }
          }}
        />
      )}
    </div>
  );
}