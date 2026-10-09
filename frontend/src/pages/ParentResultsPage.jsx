import React, { useMemo, useState } from "react";
import {
  Award,
  BarChart3,
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileText,
  GraduationCap,
  Medal,
  Search,
  SlidersHorizontal,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  UserRound,
  X,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ParentSidebar from "../components/parent/ParentSidebar";

const childrenData = [
  {
    id: "1",
    name: "Doly Junior",
    className: "Form 4",
    section: "Secondary",
    average: 78,
    previousAverage: 74,
    photo: null,
  },
  {
    id: "2",
    name: "Mireille Djoumesse",
    className: "Class 6",
    section: "Primary",
    average: 81,
    previousAverage: 79,
    photo: null,
  },
];

const resultsData = [
  {
    id: "RES-001",
    learnerId: "1",
    learner: "Doly Junior",
    subject: "Mathematics",
    teacher: "Xavier Ndi",
    assessment: "Class Test 1",
    term: "Term 1",
    score: 78,
    total: 100,
    date: "2026-09-15",
    rank: 6,
    classSize: 32,
    comment: "Good progress. Continue practising problem-solving exercises.",
  },
  {
    id: "RES-002",
    learnerId: "1",
    learner: "Doly Junior",
    subject: "Physics",
    teacher: "Nfor Grace",
    assessment: "Chapter Assessment",
    term: "Term 1",
    score: 64,
    total: 100,
    date: "2026-09-17",
    rank: 14,
    classSize: 32,
    comment: "Review the main concepts and practise more numerical exercises.",
  },
  {
    id: "RES-003",
    learnerId: "1",
    learner: "Doly Junior",
    subject: "English",
    teacher: "Acha Mireille",
    assessment: "Grammar Test",
    term: "Term 1",
    score: 85,
    total: 100,
    date: "2026-09-19",
    rank: 4,
    classSize: 32,
    comment: "Very good work. Keep improving vocabulary and writing skills.",
  },
  {
    id: "RES-004",
    learnerId: "1",
    learner: "Doly Junior",
    subject: "Computer Science",
    teacher: "Bih Patrick",
    assessment: "Practical Assessment",
    term: "Term 1",
    score: 72,
    total: 100,
    date: "2026-09-21",
    rank: 8,
    classSize: 32,
    comment: "Good understanding of the practical concepts.",
  },
  {
    id: "RES-005",
    learnerId: "1",
    learner: "Doly Junior",
    subject: "French",
    teacher: "Ngoe Laure",
    assessment: "Written Test",
    term: "Term 1",
    score: 76,
    total: 100,
    date: "2026-09-22",
    rank: 7,
    classSize: 32,
    comment: "Good effort. Work more on grammar and written expression.",
  },
  {
    id: "RES-006",
    learnerId: "2",
    learner: "Mireille Djoumesse",
    subject: "Mathematics",
    teacher: "Xavier Ndi",
    assessment: "Class Test 1",
    term: "Term 1",
    score: 82,
    total: 100,
    date: "2026-09-15",
    rank: 4,
    classSize: 28,
    comment: "Very good understanding of the exercises.",
  },
  {
    id: "RES-007",
    learnerId: "2",
    learner: "Mireille Djoumesse",
    subject: "English",
    teacher: "Acha Mireille",
    assessment: "Reading Comprehension",
    term: "Term 1",
    score: 88,
    total: 100,
    date: "2026-09-18",
    rank: 2,
    classSize: 28,
    comment: "Excellent reading comprehension and vocabulary.",
  },
  {
    id: "RES-008",
    learnerId: "2",
    learner: "Mireille Djoumesse",
    subject: "French",
    teacher: "Ngoe Laure",
    assessment: "Grammar Test",
    term: "Term 1",
    score: 75,
    total: 100,
    date: "2026-09-20",
    rank: 8,
    classSize: 28,
    comment: "Good work. Continue practising grammar rules.",
  },
  {
    id: "RES-009",
    learnerId: "2",
    learner: "Mireille Djoumesse",
    subject: "Science",
    teacher: "Talla Eric",
    assessment: "Science Assessment",
    term: "Term 1",
    score: 79,
    total: 100,
    date: "2026-09-23",
    rank: 5,
    classSize: 28,
    comment: "Good understanding of the lessons covered.",
  },
];

const awardsData = [
  {
    id: "AWD-001",
    learnerId: "1",
    learner: "Doly Junior",
    title: "Most Progressive Student",
    category: "Progress",
    date: "2026-09-25",
    description:
      "Recognised for consistent improvement and commitment to learning.",
    reward: "School supplies",
  },
  {
    id: "AWD-002",
    learnerId: "2",
    learner: "Mireille Djoumesse",
    title: "Excellent Attendance",
    category: "Commitment",
    date: "2026-09-26",
    description:
      "Recognised for regular attendance and participation in learning sessions.",
    reward: "Certificate of recognition",
  },
];

const terms = ["All Terms", "Term 1", "Term 2", "Term 3"];

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

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(`${date}T12:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const StatCard = ({ icon: Icon, label, value, subtitle, color }) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
        {subtitle && (
          <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
        )}
      </div>

      <div className={`rounded-xl p-3 ${color}`}>
        <Icon size={21} />
      </div>
    </div>
  </div>
);

export default function ParentResultsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialLearner = searchParams.get("learner") || "all";

  const [selectedChild, setSelectedChild] = useState(initialLearner);
  const [selectedTerm, setSelectedTerm] = useState("All Terms");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResult, setSelectedResult] = useState(null);
  const [showAwards, setShowAwards] = useState(false);
  const [selectedAward, setSelectedAward] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return resultsData.filter((result) => {
      const matchesChild =
        selectedChild === "all" || result.learnerId === selectedChild;

      const matchesTerm =
        selectedTerm === "All Terms" || result.term === selectedTerm;

      const matchesSearch =
        !query ||
        result.subject.toLowerCase().includes(query) ||
        result.teacher.toLowerCase().includes(query) ||
        result.assessment.toLowerCase().includes(query) ||
        result.learner.toLowerCase().includes(query);

      return matchesChild && matchesTerm && matchesSearch;
    });
  }, [selectedChild, selectedTerm, searchQuery]);

  const filteredAwards = useMemo(() => {
    return awardsData.filter(
      (award) =>
        selectedChild === "all" || award.learnerId === selectedChild
    );
  }, [selectedChild]);

  const average =
    filteredResults.length > 0
      ? Math.round(
          filteredResults.reduce(
            (total, result) => total + (result.score / result.total) * 100,
            0
          ) / filteredResults.length
        )
      : 0;

  const bestResult =
    filteredResults.length > 0
      ? filteredResults.reduce((best, current) =>
          current.score / current.total > best.score / best.total
            ? current
            : best
        )
      : null;

  const attentionCount = filteredResults.filter(
    (result) => (result.score / result.total) * 100 < 70
  ).length;

  const resetFilters = () => {
    setSelectedChild("all");
    setSelectedTerm("All Terms");
    setSearchQuery("");
  };

  const handleChildChange = (value) => {
    setSelectedChild(value);

    if (value === "all") {
      navigate("/resultats-scolaires");
    } else {
      navigate(`/resultats-scolaires?learner=${value}`);
    }
  };

  const handleExport = () => {
    const headers = [
      "Learner",
      "Subject",
      "Assessment",
      "Teacher",
      "Term",
      "Score",
      "Total",
      "Date",
      "Rank",
    ];

    const rows = filteredResults.map((result) => [
      result.learner,
      result.subject,
      result.assessment,
      result.teacher,
      result.term,
      result.score,
      result.total,
      result.date,
      `${result.rank}/${result.classSize}`,
    ]);

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

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
      {/* Sidebar */}
      <ParentSidebar />

      {/* Main content */}
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
                Follow your children’s academic performance and achievements.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowAwards(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                <Trophy size={18} className="text-amber-500" />
                Awards
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                  {filteredAwards.length}
                </span>
              </button>

              <button
                onClick={handleExport}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D4AFF] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#5b3ce0]"
              >
                <Download size={18} />
                Export results
              </button>
            </div>
          </div>

          {/* Child selector */}
          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-purple-50 p-3 text-[#6D4AFF]">
                  <UserRound size={22} />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Select a child
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    View results for one child or compare all children.
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
                    onChange={(event) =>
                      handleChildChange(event.target.value)
                    }
                    className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 text-sm outline-none transition focus:border-[#6D4AFF] focus:ring-2 focus:ring-purple-100"
                  >
                    <option value="all">All children</option>
                    {childrenData.map((child) => (
                      <option key={child.id} value={child.id}>
                        {child.name} — {child.className}
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

            {selectedChild !== "all" && (
              <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4">
                {childrenData
                  .filter((child) => child.id === selectedChild)
                  .map((child) => (
                    <React.Fragment key={child.id}>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 font-bold text-[#6D4AFF]">
                        {child.name
                          .split(" ")
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join("")}
                      </div>

                      <div>
                        <p className="font-semibold text-gray-900">
                          {child.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {child.section} · {child.className}
                        </p>
                      </div>
                    </React.Fragment>
                  ))}
              </div>
            )}
          </section>

          {/* Statistics */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={BarChart3}
              label="Average score"
              value={`${average}%`}
              subtitle={`${filteredResults.length} assessments`}
              color="bg-purple-50 text-[#6D4AFF]"
            />

            <StatCard
              icon={TrendingUp}
              label="Best performance"
              value={bestResult ? `${bestResult.score}%` : "—"}
              subtitle={bestResult ? bestResult.subject : "No results available"}
              color="bg-emerald-50 text-emerald-600"
            />

            <StatCard
              icon={Target}
              label="Needs attention"
              value={attentionCount}
              subtitle="Assessments below 70%"
              color="bg-amber-50 text-amber-600"
            />

            <StatCard
              icon={Award}
              label="Awards received"
              value={filteredAwards.length}
              subtitle="Recognitions and achievements"
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
                  <h2 className="text-lg font-bold">
                    Academic performance overview
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/85">
                    Review assessment results regularly to identify strengths
                    and subjects where your child may need additional support.
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate("/child-progress")}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#6D4AFF] transition hover:bg-purple-50"
              >
                View progress
                <ChevronRight size={17} />
              </button>
            </div>
          </section>

          {/* Results section */}
          <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 p-5 sm:p-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Assessment results
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Scores, subjects, teacher feedback and class rankings.
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
                      {terms.map((term) => (
                        <option key={term} value={term}>
                          {term}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
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
                <span className="font-semibold text-gray-900">
                  {filteredResults.length}
                </span>{" "}
                result{filteredResults.length !== 1 ? "s" : ""}
              </p>

              {(selectedChild !== "all" ||
                selectedTerm !== "All Terms" ||
                searchQuery) && (
                <button
                  onClick={resetFilters}
                  className="text-sm font-semibold text-[#6D4AFF] hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>

            {filteredResults.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                  <FileText size={25} />
                </div>

                <h3 className="mt-4 font-semibold text-gray-900">
                  No results found
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Try changing your search or filter criteria.
                </p>

                <button
                  onClick={resetFilters}
                  className="mt-5 rounded-xl bg-[#6D4AFF] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#5b3ce0]"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Student</th>
                      <th className="px-6 py-4 font-semibold">Assessment</th>
                      <th className="px-6 py-4 font-semibold">Subject</th>
                      <th className="px-6 py-4 font-semibold">Score</th>
                      <th className="px-6 py-4 font-semibold">Grade</th>
                      <th className="px-6 py-4 font-semibold">Class rank</th>
                      <th className="px-6 py-4 font-semibold">Date</th>
                      <th className="px-6 py-4 text-right font-semibold">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredResults.map((result) => {
                      const percentage = Math.round(
                        (result.score / result.total) * 100
                      );

                      return (
                        <tr
                          key={result.id}
                          className="transition hover:bg-gray-50/70"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-[#6D4AFF]">
                                {result.learner
                                  .split(" ")
                                  .map((part) => part[0])
                                  .slice(0, 2)
                                  .join("")}
                              </div>

                              <div>
                                <p className="whitespace-nowrap text-sm font-semibold text-gray-900">
                                  {result.learner}
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                  {result.term}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <p className="whitespace-nowrap text-sm font-medium text-gray-800">
                              {result.assessment}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {result.teacher}
                            </p>
                          </td>

                          <td className="px-6 py-4">
                            <span className="whitespace-nowrap rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">
                              {result.subject}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <span className="whitespace-nowrap text-sm font-bold text-gray-900">
                                {result.score}/{result.total}
                              </span>

                              <div className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-gray-100 sm:block">
                                <div
                                  className={`h-full rounded-full ${
                                    percentage >= 80
                                      ? "bg-emerald-500"
                                      : percentage >= 70
                                        ? "bg-blue-500"
                                        : percentage >= 60
                                          ? "bg-amber-500"
                                          : "bg-red-500"
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold ${getScoreColor(
                                percentage
                              )}`}
                            >
                              {getGrade(percentage)}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <span className="whitespace-nowrap text-sm text-gray-700">
                              {result.rank}/{result.classSize}
                            </span>
                          </td>

                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {formatDate(result.date)}
                          </td>

                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => setSelectedResult(result)}
                              title="View result details"
                              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-purple-200 hover:bg-purple-50 hover:text-[#6D4AFF]"
                            >
                              <Eye size={16} />
                              Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-xs text-gray-500">
                Results displayed are based on the currently selected filters.
              </p>

              <button
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
          {selectedChild === "all" && (
            <section>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Children’s overview
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Quick access to each child’s learning progress.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {childrenData.map((child) => {
                  const improvement =
                    child.average - child.previousAverage;

                  return (
                    <div
                      key={child.id}
                      className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 font-bold text-[#6D4AFF]">
                            {child.name
                              .split(" ")
                              .map((part) => part[0])
                              .slice(0, 2)
                              .join("")}
                          </div>

                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {child.name}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {child.section} · {child.className}
                            </p>
                          </div>
                        </div>

                        <span className="text-xl font-bold text-gray-900">
                          {child.average}%
                        </span>
                      </div>

                      <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-[#6D4AFF]"
                          style={{
                            width: `${Math.min(child.average, 100)}%`,
                          }}
                        />
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-2">
                        <span
                          className={`inline-flex items-center gap-1 text-sm ${
                            improvement >= 0
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        >
                          <TrendingUp size={15} />
                          {improvement >= 0 ? "+" : ""}
                          {improvement}% vs previous average
                        </span>

                        <button
                          onClick={() => handleChildChange(child.id)}
                          className="text-sm font-semibold text-[#6D4AFF] hover:underline"
                        >
                          View results
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Quick actions */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <button
              onClick={() => navigate("/child-progress")}
              className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:border-purple-200 hover:shadow-md"
            >
              <div className="rounded-xl bg-purple-50 p-3 text-[#6D4AFF]">
                <BarChart3 size={22} />
              </div>

              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  Learning progress
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Track improvement over time.
                </p>
              </div>

              <ChevronRight size={18} className="text-gray-400" />
            </button>

            <button
              onClick={() => navigate("/learning-platform")}
              className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:border-purple-200 hover:shadow-md"
            >
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <BookOpen size={22} />
              </div>

              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  Learning platform
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Access courses and resources.
                </p>
              </div>

              <ChevronRight size={18} className="text-gray-400" />
            </button>

            <button
              onClick={() => navigate("/search")}
              className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:border-purple-200 hover:shadow-md"
            >
              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <GraduationCap size={22} />
              </div>

              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  Find a teacher
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Get additional learning support.
                </p>
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
            if (event.target === event.currentTarget) {
              setSelectedResult(null);
            }
          }}
        >
          <div className="my-auto w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 p-5 sm:p-6">
              <div>
                <p className="text-sm font-medium text-[#6D4AFF]">
                  Result details
                </p>
                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  {selectedResult.subject}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {selectedResult.assessment}
                </p>
              </div>

              <button
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
                  <span className="text-xl text-gray-400">
                    /{selectedResult.total}
                  </span>
                </p>

                <div className="mt-3 flex items-center justify-center gap-2">
                  <span
                    className={`rounded-lg px-3 py-1 text-sm font-bold ${getScoreColor(
                      Math.round(
                        (selectedResult.score / selectedResult.total) * 100
                      )
                    )}`}
                  >
                    Grade{" "}
                    {getGrade(
                      Math.round(
                        (selectedResult.score / selectedResult.total) * 100
                      )
                    )}
                  </span>

                  <span className="rounded-lg bg-white px-3 py-1 text-sm font-medium text-gray-700">
                    {Math.round(
                      (selectedResult.score / selectedResult.total) * 100
                    )}
                    %
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="text-xs text-gray-500">Student</p>
                  <p className="mt-2 font-semibold text-gray-900">
                    {selectedResult.learner}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="text-xs text-gray-500">Teacher</p>
                  <p className="mt-2 font-semibold text-gray-900">
                    {selectedResult.teacher}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="text-xs text-gray-500">Academic term</p>
                  <p className="mt-2 font-semibold text-gray-900">
                    {selectedResult.term}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 p-4">
                  <p className="text-xs text-gray-500">Assessment date</p>
                  <p className="mt-2 font-semibold text-gray-900">
                    {formatDate(selectedResult.date)}
                  </p>
                </div>

                <div className="col-span-2 rounded-xl border border-gray-100 p-4">
                  <p className="text-xs text-gray-500">Class ranking</p>
                  <p className="mt-2 font-semibold text-gray-900">
                    {selectedResult.rank} out of {selectedResult.classSize}{" "}
                    students
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  Teacher’s feedback
                </h3>

                <p className="mt-2 rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-600">
                  {selectedResult.comment}
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 p-5 sm:flex-row sm:justify-end sm:p-6">
              <button
                onClick={() => setSelectedResult(null)}
                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>

              <button
                onClick={() => {
                  const learnerId = selectedResult.learnerId;
                  setSelectedResult(null);
                  navigate(`/child-progress?learner=${learnerId}`);
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

      {/* Awards modal */}
      {showAwards && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowAwards(false);
              setSelectedAward(null);
            }
          }}
        >
          <div className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between gap-4 border-b border-gray-100 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                  <Trophy size={23} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Awards and achievements
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Recognition earned by your children.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowAwards(false);
                  setSelectedAward(null);
                }}
                aria-label="Close awards"
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[65vh] space-y-3 overflow-y-auto p-5 sm:p-6">
              {filteredAwards.length === 0 ? (
                <div className="py-10 text-center">
                  <Award size={35} className="mx-auto text-gray-300" />
                  <p className="mt-3 font-semibold text-gray-900">
                    No awards yet
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Achievements will appear here when they are recorded.
                  </p>
                </div>
              ) : (
                filteredAwards.map((award) => (
                  <button
                    key={award.id}
                    onClick={() =>
                      setSelectedAward(
                        selectedAward?.id === award.id ? null : award
                      )
                    }
                    className="w-full rounded-2xl border border-gray-100 p-4 text-left transition hover:border-amber-200 hover:bg-amber-50/30"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                        <Medal size={22} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <h3 className="font-semibold text-gray-900">
                            {award.title}
                          </h3>

                          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                            {award.category}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-gray-600">
                          {award.learner}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          Awarded on {formatDate(award.date)}
                        </p>

                        {selectedAward?.id === award.id && (
                          <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
                            <p className="text-sm leading-6 text-gray-600">
                              {award.description}
                            </p>

                            <div className="rounded-xl bg-white p-3">
                              <p className="text-xs text-gray-500">
                                Recognition / reward
                              </p>
                              <p className="mt-1 text-sm font-semibold text-gray-900">
                                {award.reward}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <ChevronDown
                        size={18}
                        className={`shrink-0 text-gray-400 transition ${
                          selectedAward?.id === award.id ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="border-t border-gray-100 p-5 sm:px-6">
              <button
                onClick={() => {
                  setShowAwards(false);
                  setSelectedAward(null);
                  navigate("/awards");
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#6D4AFF] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5b3ce0]"
              >
                <Award size={17} />
                View all awards
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}