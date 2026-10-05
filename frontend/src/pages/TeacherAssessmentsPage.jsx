import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FilePlus2,
  Search,
  Target,
  UsersRound,
  X,
} from "lucide-react";

import TeacherSidebar from "../components/teacher/TeacherSidebar";
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

// Un learner "child" n'a peut-être pas de user : repli sur le parent.
function getLearnerName(learner) {
  const own = getUserName(learner?.user);
  if (own) return own;

  const parent = getUserName(learner?.parent_profile?.user);
  if (parent) return `Child of ${parent}`;

  return "Student";
}

function formatDate(value) {
  if (!value) return "No date";
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "No date";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Score sur 100. Les agrégats SQL (avg/max/min) peuvent arriver en chaîne.
function formatScore(value) {
  if (value === null || value === undefined || value === "") return "—";
  const number = Number(value);
  if (!Number.isFinite(number)) return "—";
  return `${Math.round(number * 10) / 10}/100`;
}

const FILTERS = [
  { key: "all", label: "All" },
  { key: "with", label: "With results" },
  { key: "without", label: "No results yet" },
];

/* ========================================================= */
/* MAIN PAGE                                                   */
/* ========================================================= */

export default function TeacherAssessmentsPage() {
  const [evaluations, setEvaluations] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [resultsEvaluationId, setResultsEvaluationId] = useState(null);

  const loadEvaluations = useCallback(async () => {
    const response = await apiFetch("/me/evaluations");
    setEvaluations(toList(response));
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [evaluationsRes, assignmentsRes] = await Promise.all([
          apiFetch("/me/evaluations"),
          apiFetch("/me/assignments"),
        ]);

        if (cancelled) return;
        setEvaluations(toList(evaluationsRes));
        setAssignments(toList(assignmentsRes));
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Unable to load your assessments.");
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

  // Matières enseignées et élèves par matière, d'après les affectations ACTIVES.
  const teaching = useMemo(() => {
    const subjects = new Map();
    const roster = new Map(); // subjectId -> Map(learnerId -> name)

    assignments
      .filter((assignment) => assignment.status === "active")
      .forEach((assignment) => {
        const request = assignment.tutoring_request;
        const subject = request?.subject;
        const learner = request?.learner;
        if (!subject) return;

        subjects.set(subject.id, subject.name);

        if (learner) {
          if (!roster.has(subject.id)) roster.set(subject.id, new Map());
          roster.get(subject.id).set(learner.id, getLearnerName(learner));
        }
      });

    return {
      subjects: Array.from(subjects, ([id, name]) => ({ id, name })),
      roster,
    };
  }, [assignments]);

  // Statistiques calculées sur les résultats QUE L'ENSEIGNANT A SAISIS.
  const stats = useMemo(() => {
    const resultsCount = evaluations.reduce(
      (total, e) => total + Number(e.my_results_count || 0),
      0
    );
    const weightedSum = evaluations.reduce(
      (total, e) =>
        total + (Number(e.my_average) || 0) * Number(e.my_results_count || 0),
      0
    );

    return {
      total: evaluations.length,
      results: resultsCount,
      average: resultsCount ? weightedSum / resultsCount : null,
      withoutResults: evaluations.filter((e) => !Number(e.my_results_count))
        .length,
    };
  }, [evaluations]);

  const filteredEvaluations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return evaluations.filter((evaluation) => {
      const hasResults = Number(evaluation.my_results_count) > 0;

      const matchesFilter =
        filter === "all" ||
        (filter === "with" && hasResults) ||
        (filter === "without" && !hasResults);

      const matchesSearch =
        !query ||
        (evaluation.title ?? "").toLowerCase().includes(query) ||
        (evaluation.subject?.name ?? "").toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [evaluations, filter, search]);

  const resultsEvaluation =
    evaluations.find((e) => e.id === resultsEvaluationId) ?? null;

  return (
    <div className="min-h-screen bg-[#FAF9FB] text-[#302C38]">
      <TeacherSidebar activeItem="Assessments & Results" />

      <main className="lg:ml-64">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-5 sm:px-8">
          <div>
            <p className="hidden text-xs text-gray-400 lg:block">
              Teacher Portal
            </p>

            <h1 className="text-sm font-semibold text-pf-purple-dark sm:text-lg">
              Assessments & Results
            </h1>
          </div>

          <ClipboardCheck className="h-5 w-5 text-gray-500" />
        </header>

        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8">
          {/* Intro */}
          <section>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-pf-purple">
                  Academic performance
                </p>

                <p className="mt-2 max-w-2xl text-sm text-gray-500">
                  Create assessments for the subjects you teach and record the
                  scores (out of 100) of your students.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCreate(true)}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-pf-purple px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-pf-purple-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FilePlus2 className="h-4 w-4" />
                Create Assessment
              </button>
            </div>
          </section>

          {error && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600"
            >
              {error}
            </div>
          )}

          {/* Stats */}
          <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={ClipboardCheck}
              label="Assessments"
              value={loading ? "—" : stats.total}
              description="Available to you"
            />

            <StatCard
              icon={UsersRound}
              label="Results recorded"
              value={loading ? "—" : stats.results}
              description="Scores you entered"
            />

            <StatCard
              icon={Target}
              label="Average score"
              value={loading ? "—" : formatScore(stats.average)}
              description="Across your recorded results"
            />

            <StatCard
              icon={CheckCircle2}
              label="Waiting for scores"
              value={loading ? "—" : stats.withoutResults}
              description="No result recorded yet"
            />
          </section>

          {/* Assessments */}
          <section className="mt-7 rounded-2xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 p-5 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="font-serif text-xl text-pf-purple-dark">
                    My Assessments
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Open an assessment to record or review your students'
                    scores.
                  </p>
                </div>

                <div className="relative w-full lg:w-64">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search assessments..."
                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-pf-purple focus:ring-2 focus:ring-pf-purple/10"
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {FILTERS.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setFilter(item.key)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                      filter === item.key
                        ? "bg-pf-purple text-white"
                        : "bg-[#FAF9FB] text-gray-500 hover:bg-pf-purple-light hover:text-pf-purple"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {loading && (
              <p className="py-16 text-center text-sm text-gray-400">
                Loading your assessments…
              </p>
            )}

            {!loading && filteredEvaluations.length > 0 && (
              <div className="divide-y divide-gray-100">
                {filteredEvaluations.map((evaluation) => (
                  <AssessmentRow
                    key={evaluation.id}
                    evaluation={evaluation}
                    onOpen={() => setResultsEvaluationId(evaluation.id)}
                  />
                ))}
              </div>
            )}

            {!loading && filteredEvaluations.length === 0 && (
              <div className="py-16 text-center">
                <ClipboardCheck className="mx-auto h-8 w-8 text-gray-300" />

                <h3 className="mt-3 font-serif text-lg text-pf-purple-dark">
                  {evaluations.length === 0
                    ? "No assessments yet"
                    : "No assessments found"}
                </h3>

                <p className="mt-1 text-sm text-gray-400">
                  {evaluations.length === 0
                    ? "Create your first assessment to start recording scores."
                    : "Try changing your search or filter."}
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      {showCreate && (
        <CreateEvaluationModal
          subjects={teaching.subjects}
          onClose={() => setShowCreate(false)}
          onCreated={async () => {
            setShowCreate(false);
            setError("");
            try {
              await loadEvaluations();
            } catch (err) {
              setError(
                err?.message ||
                  "Assessment created, but the list could not be refreshed."
              );
            }
          }}
        />
      )}

      {resultsEvaluation && (
        <ResultsModal
          evaluation={resultsEvaluation}
          roster={teaching.roster.get(resultsEvaluation.subject_id) ?? new Map()}
          onClose={() => setResultsEvaluationId(null)}
          onChanged={loadEvaluations}
        />
      )}
    </div>
  );
}

/* ========================================================= */
/* ASSESSMENT ROW                                              */
/* ========================================================= */

function AssessmentRow({ evaluation, onOpen }) {
  const count = Number(evaluation.my_results_count || 0);
  const hasResults = count > 0;

  return (
    <div className="p-5 transition hover:bg-[#FCFBFD] sm:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pf-purple-light">
          <ClipboardCheck className="h-5 w-5 text-pf-purple" />
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-pf-purple-dark">
            {evaluation.title}
          </h4>

          <p className="mt-1 text-xs text-gray-500">
            {evaluation.subject?.name ?? "—"}
          </p>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-gray-400">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {Number(evaluation.questions_count || 0)} questions
            </span>

            <span className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(evaluation.eval_date)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-5 border-t border-gray-100 pt-4 xl:border-0 xl:pt-0">
          <Metric label="Results" value={count} />
          <Metric
            label="Average"
            value={hasResults ? formatScore(evaluation.my_average) : "—"}
          />
          <Metric
            label="Highest"
            value={hasResults ? formatScore(evaluation.my_highest) : "—"}
          />
          <Metric
            label="Lowest"
            value={hasResults ? formatScore(evaluation.my_lowest) : "—"}
          />
        </div>

        <button
          type="button"
          onClick={onOpen}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-pf-purple transition hover:border-pf-purple-light hover:bg-pf-purple-light"
        >
          {hasResults ? "View / add results" : "Record results"}
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ========================================================= */
/* CREATE EVALUATION MODAL                                     */
/* ========================================================= */

function CreateEvaluationModal({ subjects, onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [date, setDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async () => {
    setFormError("");

    if (!title.trim() || !subjectId) {
      setFormError("Please enter a title and choose a subject.");
      return;
    }

    setSubmitting(true);

    try {
      await apiFetch(`/subjects/${subjectId}/evaluations`, {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          eval_date: date || undefined,
        }),
      });

      await onCreated();
    } catch (err) {
      setFormError(err?.message || "Unable to create this assessment.");
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Create Assessment" onClose={onClose}>
      {subjects.length === 0 ? (
        <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
          You can only create assessments for subjects you teach. You have no
          active assignment yet.
        </p>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Create an assessment for one of your subjects, then record your
            students' scores.
          </p>

          <FormField label="Title">
            <input
              type="text"
              placeholder="e.g. Algebra — Chapter 3"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
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

            <FormField label="Date (optional)">
              <input
                type="date"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </FormField>
          </div>
        </div>
      )}

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

        {subjects.length > 0 && (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-lg bg-pf-purple px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Creating…" : "Create Assessment"}
          </button>
        )}
      </div>
    </Modal>
  );
}

/* ========================================================= */
/* RESULTS MODAL                                               */
/* ========================================================= */

function ResultsModal({ evaluation, roster, onClose, onChanged }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [scores, setScores] = useState({}); // learnerId -> texte saisi
  const [savingId, setSavingId] = useState(null);

  const loadResults = useCallback(async () => {
    const response = await apiFetch(`/evaluations/${evaluation.id}/results`);
    setResults(toList(response));
  }, [evaluation.id]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await apiFetch(`/evaluations/${evaluation.id}/results`);
        if (!cancelled) setResults(toList(response));
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Unable to load the results.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [evaluation.id]);

  // Élèves de la matière (affectations actives) + élèves déjà notés.
  const rows = useMemo(() => {
    const map = new Map();

    roster.forEach((name, id) => map.set(id, { id, name, result: null }));

    results.forEach((result) => {
      const existing = map.get(result.learner_id);
      if (existing) {
        existing.result = result;
      } else {
        map.set(result.learner_id, {
          id: result.learner_id,
          name: getLearnerName(result.learner),
          result,
        });
      }
    });

    return Array.from(map.values());
  }, [roster, results]);

  const handleSave = async (row) => {
    setError("");

    const raw = (scores[row.id] ?? "").trim();
    const value = Number(raw);

    if (raw === "" || !Number.isFinite(value) || value < 0 || value > 100) {
      setError(`Enter a score between 0 and 100 for ${row.name}.`);
      return;
    }

    setSavingId(row.id);

    try {
      await apiFetch(`/evaluations/${evaluation.id}/results`, {
        method: "POST",
        body: JSON.stringify({ learner_id: row.id, score: value }),
      });

      setScores((current) => {
        const next = { ...current };
        delete next[row.id];
        return next;
      });

      await loadResults();
      await onChanged();
    } catch (err) {
      setError(err?.message || `Unable to save the score for ${row.name}.`);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <Modal title={evaluation.title} onClose={onClose} wide>
      <p className="text-sm text-gray-500">
        {evaluation.subject?.name ?? "—"} · {formatDate(evaluation.eval_date)}.
        You only see the scores you recorded yourself.
      </p>

      {error && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {loading ? (
        <p className="py-12 text-center text-sm text-gray-400">
          Loading results…
        </p>
      ) : rows.length === 0 ? (
        <p className="mt-5 rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
          You have no active student for this subject, so there is nobody to
          score yet.
        </p>
      ) : (
        <div className="mt-5 divide-y divide-gray-100 rounded-xl border border-gray-100">
          {rows.map((row) => (
            <div
              key={row.id}
              className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="text-sm font-medium text-pf-purple-dark">
                {row.name}
              </p>

              {row.result ? (
                <p className="flex items-center gap-2 text-sm font-semibold text-pf-purple-dark">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  {formatScore(row.result.score)}
                </p>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="any"
                    inputMode="decimal"
                    placeholder="0–100"
                    aria-label={`Score for ${row.name}`}
                    value={scores[row.id] ?? ""}
                    onChange={(e) =>
                      setScores((current) => ({
                        ...current,
                        [row.id]: e.target.value,
                      }))
                    }
                    className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-pf-purple"
                  />

                  <span className="text-xs text-gray-400">/ 100</span>

                  <button
                    type="button"
                    onClick={() => handleSave(row)}
                    disabled={savingId === row.id}
                    className="rounded-lg bg-pf-purple px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {savingId === row.id ? "Saving…" : "Save"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="mt-4 text-xs text-gray-400">
        A recorded score cannot be edited from this page.
      </p>

      <div className="mt-6 flex justify-end">
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
/* SMALL COMPONENTS                                            */
/* ========================================================= */

function StatCard({ icon: Icon, label, value, description }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-pf-purple-dark">{value}</p>

          <p className="mt-1 text-xs text-gray-400">{description}</p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pf-purple-light">
          <Icon className="h-5 w-5 text-pf-purple" />
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-pf-purple-dark">{value}</p>
    </div>
  );
}

function Modal({ title, onClose, wide = false, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white shadow-xl ${
          wide ? "max-w-3xl" : "max-w-xl"
        }`}
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