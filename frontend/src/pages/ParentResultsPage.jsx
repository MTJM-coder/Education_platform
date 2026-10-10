import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Download,
  Eye,
  FileText,
  GraduationCap,
  Search,
  SlidersHorizontal,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  X,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
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

// Les notes sont sur 100 : le score est directement le pourcentage.
const TOTAL = 100;

// Barème de la maquette, utilisé seulement si l'enseignant n'a pas saisi de grade.
const getGrade = (score) => {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  if (score >= 50) return "E";
  return "F";
};

const getScoreColor = (score) => {
  if (score >= 80) return "text-emerald-600 bg-emerald-50";
  if (score >= 70) return "text-blue-600 bg-blue-50";
  if (score >= 60) return "text-amber-600 bg-amber-50";
  return "text-red-600 bg-red-50";
};

const getBarColor = (score) => {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 70) return "bg-blue-500";
  if (score >= 60) return "bg-amber-500";
  return "bg-red-500";
};

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(
    String(value).length === 10 ? `${value}T12:00:00` : value
  );
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const initialsOf = (name) =>
  String(name)
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

function toRow(result, learnerName) {
  const evaluation = result.evaluation;
  const score = Number(result.score);

  return {
    id: result.id,
    learnerId: result.learner_id,
    learner: learnerName,
    subject: evaluation?.subject?.name ?? "—",
    teacher: getUserName(result.teacher?.user) ?? "—",
    assessment: evaluation?.title ?? "Assessment",
    term: result.term ?? null,
    score: Number.isFinite(score) ? score : null,
    grade: result.grade ?? null,
    date: String(evaluation?.eval_date ?? result.created_at ?? "").slice(0, 10) || null,
    comment: result.comments ?? "",
  };
}

const StatCard = ({ icon: Icon, label, value, subtitle, color }) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
        {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
      </div>

      <div className={`rounded-xl p-3 ${color}`}>
        <Icon size={21} />
      </div>
    </div>
  </div>
);

/* -------------------------------------------------- */
/* Page */
/* -------------------------------------------------- */

export default function ParentResultsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialLearner = searchParams.get("learner") || "all";

  const [children, setChildren] = useState([]);
  const [resultsByChild, setResultsByChild] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedChild, setSelectedChild] = useState(initialLearner);
  const [selectedTerm, setSelectedTerm] = useState("All Terms");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResult, setSelectedResult] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const childrenRes = await apiFetch("/me/children");
        const childList = toList(childrenRes);

        // Résultats de chaque enfant : un échec n'empêche pas d'afficher le reste.
        const settled = await Promise.allSettled(
          childList.map((child) => apiFetch(`/learners/${child.id}/results`))
        );

        if (cancelled) return;

        const results = {};
        let failures = 0;

        childList.forEach((child, index) => {
          const outcome = settled[index];
          if (outcome.status === "fulfilled") {
            results[child.id] = toList(outcome.value);
          } else {
            results[child.id] = [];
            failures += 1;
          }
        });

        setChildren(childList);
        setResultsByChild(results);

        if (failures > 0) {
          setError("Some results could not be loaded. Please try again later.");
        }
      } catch (err) {
        if (!cancelled) setError(err?.message || "Unable to load the results.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const allRows = useMemo(
    () =>
      children
        .flatMap((child) =>
          (resultsByChild[child.id] ?? []).map((result) =>
            toRow(result, getLearnerName(child))
          )
        )
        .filter((row) => row.score !== null)
        .sort((a, b) => String(b.date ?? "").localeCompare(String(a.date ?? ""))),
    [children, resultsByChild]
  );

  const termOptions = useMemo(
    () => [
      "All Terms",
      ...Array.from(new Set(allRows.map((row) => row.term).filter(Boolean))).sort(),
    ],
    [allRows]
  );

  const filteredResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return allRows.filter((row) => {
      const matchesChild = selectedChild === "all" || row.learnerId === selectedChild;
      const matchesTerm = selectedTerm === "All Terms" || row.term === selectedTerm;
      const matchesSearch =
        !query ||
        row.subject.toLowerCase().includes(query) ||
        row.teacher.toLowerCase().includes(query) ||
        row.assessment.toLowerCase().includes(query) ||
        row.learner.toLowerCase().includes(query);

      return matchesChild && matchesTerm && matchesSearch;
    });
  }, [allRows, selectedChild, selectedTerm, searchQuery]);

  const average =
    filteredResults.length > 0
      ? Math.round(
          filteredResults.reduce((total, row) => total + row.score, 0) /
            filteredResults.length
        )
      : null;

  const bestResult =
    filteredResults.length > 0
      ? filteredResults.reduce((best, current) =>
          current.score > best.score ? current : best
        )
      : null;

  const attentionCount = filteredResults.filter((row) => row.score < 70).length;

  const subjectCount = new Set(
    filteredResults.map((row) => row.subject).filter((name) => name !== "—")
  ).size;

  // Aperçu par enfant : moyenne calculée sur tous ses résultats.
  const childSummaries = useMemo(
    () =>
      children.map((child) => {
        const rows = allRows.filter((row) => row.learnerId === child.id);

        return {
          id: child.id,
          name: getLearnerName(child),
          className: child.classroom?.name ?? null,
          levelName: child.level?.name ?? null,
          count: rows.length,
          average: rows.length
            ? Math.round(rows.reduce((total, row) => total + row.score, 0) / rows.length)
            : null,
          lastDate: rows[0]?.date ?? null,
        };
      }),
    [children, allRows]
  );

  const selectedChildInfo = childSummaries.find((child) => child.id === selectedChild);

  const resetFilters = () => {
    setSelectedChild("all");
    setSelectedTerm("All Terms");
    setSearchQuery("");
    navigate("/resultats-scolaires");
  };

  const handleChildChange = (value) => {
    setSelectedChild(value);

    if (value === "all") {
      navigate("/resultats-scolaires");
    } else {
      navigate(`/resultats-scolaires?learner=${encodeURIComponent(value)}`);
    }
  };

  const handleExport = () => {
    const headers = [
      "Learner",
      "Subject",
      "Assessment",
      "Teacher",
      "Term",
      "Score (/100)",
      "Grade",
      "Date",
    ];

    const rows = filteredResults.map((row) => [
      row.learner,
      row.subject,
      row.assessment,
      row.teacher,
      row.term ?? "",
      row.score,
      row.grade ?? getGrade(row.score),
      row.date ?? "",
    ]);

    const escapeCSV = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csvContent = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "school-results.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#F8F8FA]">
      <ParentSidebar />

      <div className="min-h-screen lg:ml-64">
        <main className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                <span>Parent Portal</span>
                <ChevronRight size={15} />
                <span className="text-[#6D4AFF]">School Results</span>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Children’s Results
              </h1>

              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                Follow your children’s academic performance.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleExport}
                disabled={filteredResults.length === 0}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D4AFF] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#5b3ce0] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download size={18} />
                Export results
              </button>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600"
            >
              {error}
            </div>
          )}

          {/* Child selector */}
          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-purple-50 p-3 text-[#6D4AFF]">
                  <UserRound size={22} />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">Select a child</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    View results for one child or for all your children.
                  </p>
                </div>
              </div>

              <div className="w-full md:max-w-xs">
                <label
                  htmlFor="child-selector"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Child
                </label>

                <div className="relative">
                  <select
                    id="child-selector"
                    value={selectedChild}
                    onChange={(event) => handleChildChange(event.target.value)}
                    className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 text-sm outline-none transition focus:border-[#6D4AFF] focus:ring-2 focus:ring-purple-100"
                  >
                    <option value="all">All children</option>
                    {childSummaries.map((child) => (
                      <option key={child.id} value={child.id}>
                        {child.name}
                        {child.className ? ` — ${child.className}` : ""}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={17}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>
            </div>

            {selectedChildInfo && (
              <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 font-bold text-[#6D4AFF]">
                  {initialsOf(selectedChildInfo.name)}
                </div>

                <div>
                  <p className="font-semibold text-gray-900">{selectedChildInfo.name}</p>
                  <p className="text-sm text-gray-500">
                    {[selectedChildInfo.levelName, selectedChildInfo.className]
                      .filter(Boolean)
                      .join(" · ") || "—"}
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Statistics */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={BarChart3}
              label="Average score"
              value={loading || average === null ? "—" : `${average}/100`}
              subtitle={`${filteredResults.length} assessment${
                filteredResults.length !== 1 ? "s" : ""
              }`}
              color="bg-purple-50 text-[#6D4AFF]"
            />

            <StatCard
              icon={TrendingUp}
              label="Best performance"
              value={bestResult ? `${bestResult.score}/100` : "—"}
              subtitle={bestResult ? bestResult.subject : "No results available"}
              color="bg-emerald-50 text-emerald-600"
            />

            <StatCard
              icon={Target}
              label="Needs attention"
              value={loading ? "—" : attentionCount}
              subtitle="Assessments below 70"
              color="bg-amber-50 text-amber-600"
            />

            <StatCard
              icon={BookOpen}
              label="Subjects assessed"
              value={loading ? "—" : subjectCount}
              subtitle="With at least one result"
              color="bg-blue-50 text-blue-600"
            />
          </section>

          {/* Performance notice */}
          <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-[#6D4AFF] to-[#9278FF] p-5 text-white sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-white/15 p-3">
                  <Sparkles size={24} />
                </div>

                <div>
                  <h2 className="text-lg font-bold">Academic performance overview</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/85">
                    Review assessment results regularly to identify strengths
                    and subjects where your child may need additional support.
                  </p>
                </div>
              </div>

              {/* <button
                type="button"
                onClick={() => navigate("/child-progress")}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#6D4AFF] transition hover:bg-purple-50"
              >
                View progress
                <ChevronRight size={17} />
              </button> */}
            </div>
          </section>

          {/* Results section */}
          <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 p-5 sm:p-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Assessment results</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Scores, subjects and teacher feedback.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative min-w-0 sm:w-64">
                    <Search
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search subject or teacher..."
                      className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#6D4AFF] focus:ring-2 focus:ring-purple-100"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${
                      showFilters
                        ? "border-purple-200 bg-purple-50 text-[#6D4AFF]"
                        : "border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <SlidersHorizontal size={17} />
                    Filters
                  </button>
                </div>
              </div>

              {showFilters && (
                <div className="mt-5 grid grid-cols-1 gap-4 rounded-xl bg-gray-50 p-4 sm:grid-cols-2">
                  {termOptions.length > 1 ? (
                    <div>
                      <label
                        htmlFor="term-filter"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Academic term
                      </label>

                      <select
                        id="term-filter"
                        value={selectedTerm}
                        onChange={(event) => setSelectedTerm(event.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#6D4AFF]"
                      >
                        {termOptions.map((term) => (
                          <option key={term} value={term}>
                            {term}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <p className="self-center text-sm text-gray-500">
                      No academic term has been recorded on these results yet.
                    </p>
                  )}

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                    >
                      Reset all filters
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-900">{filteredResults.length}</span>{" "}
                result{filteredResults.length !== 1 ? "s" : ""}
              </p>

              {(selectedChild !== "all" || selectedTerm !== "All Terms" || searchQuery) && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-sm font-semibold text-[#6D4AFF] hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>

            {loading ? (
              <p className="px-6 py-16 text-center text-sm text-gray-400">
                Loading the results…
              </p>
            ) : filteredResults.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                  <FileText size={25} />
                </div>

                <h3 className="mt-4 font-semibold text-gray-900">
                  {allRows.length === 0 ? "No result yet" : "No results found"}
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  {allRows.length === 0
                    ? "Results appear here once a teacher has recorded a score."
                    : "Try changing your search or filter criteria."}
                </p>

                {allRows.length > 0 && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-5 rounded-xl bg-[#6D4AFF] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#5b3ce0]"
                  >
                    Reset filters
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] text-left">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Student</th>
                      <th className="px-6 py-4 font-semibold">Assessment</th>
                      <th className="px-6 py-4 font-semibold">Subject</th>
                      <th className="px-6 py-4 font-semibold">Score</th>
                      <th className="px-6 py-4 font-semibold">Grade</th>
                      <th className="px-6 py-4 font-semibold">Date</th>
                      <th className="px-6 py-4 text-right font-semibold">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredResults.map((row) => (
                      <tr key={row.id} className="transition hover:bg-gray-50/70">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-[#6D4AFF]">
                              {initialsOf(row.learner)}
                            </div>

                            <div>
                              <p className="whitespace-nowrap text-sm font-semibold text-gray-900">
                                {row.learner}
                              </p>
                              {row.term && (
                                <p className="mt-1 text-xs text-gray-500">{row.term}</p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <p className="whitespace-nowrap text-sm font-medium text-gray-800">
                            {row.assessment}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">{row.teacher}</p>
                        </td>

                        <td className="px-6 py-4">
                          <span className="whitespace-nowrap rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">
                            {row.subject}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="whitespace-nowrap text-sm font-bold text-gray-900">
                              {row.score}/{TOTAL}
                            </span>

                            <div className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-gray-100 sm:block">
                              <div
                                className={`h-full rounded-full ${getBarColor(row.score)}`}
                                style={{ width: `${Math.min(row.score, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-xl px-2 text-sm font-bold ${getScoreColor(
                              row.score
                            )}`}
                          >
                            {row.grade ?? getGrade(row.score)}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {formatDate(row.date)}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedResult(row)}
                            title="View result details"
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-purple-200 hover:bg-purple-50 hover:text-[#6D4AFF]"
                          >
                            <Eye size={16} />
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-xs text-gray-500">
                Results displayed are based on the currently selected filters.
              </p>

              <button
                type="button"
                onClick={() => navigate("/parent-schedule")}
                className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-[#6D4AFF] hover:underline"
              >
                <CalendarDays size={17} />
                View tutoring schedule
                <ChevronRight size={16} />
              </button>
            </div>
          </section>

          {/* Children overview */}
          {selectedChild === "all" && childSummaries.length > 0 && (
            <section>
              <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-900">Children’s overview</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Average score of each child across all recorded assessments.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {childSummaries.map((child) => (
                  <div
                    key={child.id}
                    className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 font-bold text-[#6D4AFF]">
                          {initialsOf(child.name)}
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-900">{child.name}</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {[child.levelName, child.className].filter(Boolean).join(" · ") || "—"}
                          </p>
                        </div>
                      </div>

                      <span className="text-xl font-bold text-gray-900">
                        {child.average === null ? "—" : `${child.average}/100`}
                      </span>
                    </div>

                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-[#6D4AFF]"
                        style={{ width: `${Math.min(child.average ?? 0, 100)}%` }}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span className="text-sm text-gray-500">
                        {child.count === 0
                          ? "No result yet"
                          : `${child.count} result${child.count !== 1 ? "s" : ""} · last on ${formatDate(
                              child.lastDate
                            )}`}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleChildChange(child.id)}
                        className="text-sm font-semibold text-[#6D4AFF] hover:underline"
                      >
                        View results
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Quick actions */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => navigate("/child-progress")}
              className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:border-purple-200 hover:shadow-md"
            >
              <div className="rounded-xl bg-purple-50 p-3 text-[#6D4AFF]">
                <BarChart3 size={22} />
              </div>

              <div className="flex-1">
                <p className="font-semibold text-gray-900">Learning progress</p>
                <p className="mt-1 text-sm text-gray-500">Track improvement over time.</p>
              </div>

              <ChevronRight size={18} className="text-gray-400" />
            </button>

            <button
              type="button"
              onClick={() => navigate("/learning-platform")}
              className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:border-purple-200 hover:shadow-md"
            >
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <BookOpen size={22} />
              </div>

              <div className="flex-1">
                <p className="font-semibold text-gray-900">Learning platform</p>
                <p className="mt-1 text-sm text-gray-500">Access course notes.</p>
              </div>

              <ChevronRight size={18} className="text-gray-400" />
            </button>

            <button
              type="button"
              onClick={() => navigate("/search")}
              className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:border-purple-200 hover:shadow-md"
            >
              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <GraduationCap size={22} />
              </div>

              <div className="flex-1">
                <p className="font-semibold text-gray-900">Find a teacher</p>
                <p className="mt-1 text-sm text-gray-500">Get additional learning support.</p>
              </div>

              <ChevronRight size={18} className="text-gray-400" />
            </button>
          </section>
        </main>
      </div>

      {/* Result details modal */}
      {selectedResult && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedResult(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="my-auto w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 p-5 sm:p-6">
              <div>
                <p className="text-sm font-medium text-[#6D4AFF]">Result details</p>
                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  {selectedResult.subject}
                </h2>
                <p className="mt-1 text-sm text-gray-500">{selectedResult.assessment}</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedResult(null)}
                aria-label="Close result details"
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div className="rounded-2xl bg-purple-50 p-5 text-center">
                <p className="text-sm text-gray-600">Assessment score</p>

                <p className="mt-2 text-4xl font-bold text-[#6D4AFF]">
                  {selectedResult.score}
                  <span className="text-xl text-gray-400">/{TOTAL}</span>
                </p>

                <div className="mt-3 flex items-center justify-center gap-2">
                  <span
                    className={`rounded-lg px-3 py-1 text-sm font-bold ${getScoreColor(
                      selectedResult.score
                    )}`}
                  >
                    Grade {selectedResult.grade ?? getGrade(selectedResult.score)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="text-xs text-gray-500">Student</p>
                  <p className="mt-2 font-semibold text-gray-900">{selectedResult.learner}</p>
                </div>

                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="text-xs text-gray-500">Teacher</p>
                  <p className="mt-2 font-semibold text-gray-900">{selectedResult.teacher}</p>
                </div>

                {selectedResult.term && (
                  <div className="rounded-xl border border-gray-100 p-4">
                    <p className="text-xs text-gray-500">Academic term</p>
                    <p className="mt-2 font-semibold text-gray-900">{selectedResult.term}</p>
                  </div>
                )}

                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="text-xs text-gray-500">Assessment date</p>
                  <p className="mt-2 font-semibold text-gray-900">
                    {formatDate(selectedResult.date)}
                  </p>
                </div>
              </div>

              {selectedResult.comment && (
                <div>
                  <h3 className="font-semibold text-gray-900">Teacher’s feedback</h3>

                  <p className="mt-2 rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-600">
                    {selectedResult.comment}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 p-5 sm:flex-row sm:justify-end sm:p-6">
              <button
                type="button"
                onClick={() => setSelectedResult(null)}
                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  const learnerId = selectedResult.learnerId;
                  setSelectedResult(null);
                  navigate(`/child-progress?learner=${encodeURIComponent(learnerId)}`);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D4AFF] px-5 py-3 text-sm font-semibold text-white hover:bg-[#5b3ce0]"
              >
                <BarChart3 size={17} />
                View progress
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}