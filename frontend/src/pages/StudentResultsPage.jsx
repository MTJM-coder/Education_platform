import { useMemo, useState } from "react";
import {
  Award,
  BarChart3,
  BookOpen,
  CalendarDays,
  ChevronRight,
  GraduationCap,
  TrendingUp,
  UserRound,
} from "lucide-react";
import SidebarStudent from "../components/student/SidebarStudent";

const results = [
  {
    id: 1,
    subject: "Mathematics",
    teacher: "Mr. Xavier Ndi",
    assessment: "Linear Equations",
    term: "Term 1",
    year: "2026/2027",
    score: 86,
    grade: "A",
    date: "18 Sept. 2026",
    comment: "Very good understanding of the topic.",
  },
  {
    id: 2,
    subject: "Physics",
    teacher: "Mrs. Nfor",
    assessment: "Motion and Forces",
    term: "Term 1",
    year: "2026/2027",
    score: 74,
    grade: "B",
    date: "16 Sept. 2026",
    comment: "Good work. More practice is recommended.",
  },
  {
    id: 3,
    subject: "English",
    teacher: "Mrs. Acha",
    assessment: "Essay Writing",
    term: "Term 1",
    year: "2026/2027",
    score: 91,
    grade: "A",
    date: "14 Sept. 2026",
    comment: "Excellent writing and organization.",
  },
  {
    id: 4,
    subject: "Computer Science",
    teacher: "Mr. Bih",
    assessment: "HTML Basics",
    term: "Term 1",
    year: "2026/2027",
    score: 92,
    grade: "A",
    date: "12 Sept. 2026",
    comment: "Excellent understanding of the concepts.",
  },
  {
    id: 5,
    subject: "Mathematics",
    teacher: "Mr. Xavier Ndi",
    assessment: "Fractions & Percentages",
    term: "Term 1",
    year: "2026/2027",
    score: 78,
    grade: "B",
    date: "10 Sept. 2026",
    comment: "Good progress. Continue practicing.",
  },
  {
    id: 6,
    subject: "Physics",
    teacher: "Mrs. Nfor",
    assessment: "Introduction to Physics",
    term: "Term 1",
    year: "2026/2027",
    score: 69,
    grade: "C",
    date: "06 Sept. 2026",
    comment: "Needs more revision of the fundamentals.",
  },
];

const subjectPerformance = [
  {
    subject: "Mathematics",
    score: 82,
    progress: 8,
    teacher: "Mr. Xavier Ndi",
  },
  {
    subject: "Physics",
    score: 72,
    progress: 5,
    teacher: "Mrs. Nfor",
  },
  {
    subject: "English",
    score: 91,
    progress: 12,
    teacher: "Mrs. Acha",
  },
  {
    subject: "Computer Science",
    score: 92,
    progress: 15,
    teacher: "Mr. Bih",
  },
];

const terms = ["All Terms", "Term 1", "Term 2", "Term 3"];

export default function StudentResultsPage() {
  const [selectedTerm, setSelectedTerm] =
    useState("All Terms");

  const filteredResults = useMemo(() => {
    if (selectedTerm === "All Terms") {
      return results;
    }

    return results.filter(
      (result) => result.term === selectedTerm
    );
  }, [selectedTerm]);

  const average =
    filteredResults.length > 0
      ? filteredResults.reduce(
          (sum, result) => sum + result.score,
          0
        ) / filteredResults.length
      : 0;

  const highestScore =
    filteredResults.length > 0
      ? Math.max(
          ...filteredResults.map((result) => result.score)
        )
      : 0;

  const lowestScore =
    filteredResults.length > 0
      ? Math.min(
          ...filteredResults.map((result) => result.score)
        )
      : 0;

  return (
    <div className="min-h-screen bg-[#FAF9FB] font-sans text-[#302C38]">
      <SidebarStudent activeItem="My Results" />

      <main className="lg:ml-64">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-5 sm:px-8">
          <div className="flex items-center gap-2 lg:hidden">
            <GraduationCap className="h-6 w-6 text-pf-purple" />

            <span className="font-serif text-sm text-pf-purple-dark">
              Student Portal
            </span>
          </div>

          <p className="hidden text-sm text-gray-500 lg:block">
            My Results
          </p>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pf-purple-light text-xs font-semibold text-pf-purple">
            JM
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8">
          {/* Introduction */}
          <section className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-pf-purple">
                ACADEMIC PERFORMANCE
              </p>

              <h1 className="mt-1 font-serif text-2xl font-medium text-pf-purple-dark sm:text-3xl">
                My Results
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Review your academic results and track your
                progress over time.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-pf-purple-light px-3 py-2 text-xs font-medium text-pf-purple">
              <CalendarDays className="h-4 w-4" />
              2026/2027
            </div>
          </section>

          {/* Performance summary */}
          <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              icon={BarChart3}
              label="Overall Average"
              value={`${Math.round(average)}%`}
              description="Current academic average"
            />

            <SummaryCard
              icon={Award}
              label="Highest Score"
              value={`${highestScore}%`}
              description="Best assessment result"
            />

            <SummaryCard
              icon={TrendingUp}
              label="Progress"
              value="+10%"
              description="Compared with previous period"
            />

            <SummaryCard
              icon={BookOpen}
              label="Assessments"
              value={filteredResults.length}
              description="Results recorded"
            />
          </section>

          {/* Main content */}
          <section className="mt-7 grid gap-5 xl:grid-cols-[1.5fr_0.8fr]">
            {/* Results */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-xl text-pf-purple-dark">
                    Assessment Results
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Your latest academic results.
                  </p>
                </div>

                {/* Term filter */}
                <select
                  value={selectedTerm}
                  onChange={(e) =>
                    setSelectedTerm(e.target.value)
                  }
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600 outline-none focus:border-pf-purple"
                >
                  {terms.map((term) => (
                    <option key={term}>{term}</option>
                  ))}
                </select>
              </div>

              {/* Result list */}
              <div className="mt-5 divide-y divide-gray-100">
                {filteredResults.map((result) => (
                  <ResultCard
                    key={result.id}
                    result={result}
                  />
                ))}

                {filteredResults.length === 0 && (
                  <div className="py-12 text-center">
                    <BookOpen className="mx-auto h-8 w-8 text-gray-300" />

                    <p className="mt-3 text-sm text-gray-500">
                      No results available.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right side */}
            <aside className="space-y-5">
              {/* Current average */}
              <section className="rounded-2xl bg-pf-purple p-5 text-white">
                <p className="text-[10px] font-medium tracking-[0.12em] text-purple-200">
                  CURRENT AVERAGE
                </p>

                <div className="mt-3 flex items-end gap-2">
                  <span className="font-serif text-4xl">
                    {Math.round(average)}%
                  </span>

                  <span className="mb-1 rounded-full bg-white/15 px-2 py-1 text-[10px]">
                    Good progress
                  </span>
                </div>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-white"
                    style={{
                      width: `${Math.min(average, 100)}%`,
                    }}
                  />
                </div>

                <p className="mt-3 text-xs text-purple-100">
                  Keep working consistently to improve your
                  overall performance.
                </p>
              </section>

              {/* Subject performance */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-lg text-pf-purple-dark">
                      Subject Performance
                    </h2>

                    <p className="mt-1 text-xs text-gray-400">
                      Average by subject
                    </p>
                  </div>

                  <BarChart3 className="h-5 w-5 text-pf-purple" />
                </div>

                <div className="mt-5 space-y-5">
                  {subjectPerformance.map((item) => (
                    <div key={item.subject}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-600">
                          {item.subject}
                        </span>

                        <span className="text-xs font-semibold text-pf-purple">
                          {item.score}%
                        </span>
                      </div>

                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-pf-purple"
                          style={{
                            width: `${item.score}%`,
                          }}
                        />
                      </div>

                      <div className="mt-1 flex justify-between">
                        <span className="text-[10px] text-gray-400">
                          {item.teacher}
                        </span>

                        <span className="text-[10px] font-medium text-pf-green">
                          +{item.progress}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Performance insight */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-pf-green" />

                  <h2 className="font-serif text-lg text-pf-purple-dark">
                    Performance Insight
                  </h2>
                </div>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Your strongest subjects are{" "}
                  <span className="font-semibold text-pf-purple">
                    Computer Science
                  </span>{" "}
                  and{" "}
                  <span className="font-semibold text-pf-purple">
                    English
                  </span>
                  . Keep practicing Mathematics and Physics
                  to improve your overall average.
                </p>
              </section>
            </aside>
          </section>

          {/* Academic overview */}
          <section className="mt-7 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-xl text-pf-purple-dark">
                  Academic Overview
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Your current academic information.
                </p>
              </div>

              <a
                href="/student-achievements"
                className="flex items-center gap-1 text-xs font-semibold text-pf-purple hover:underline"
              >
                View achievements
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <OverviewItem
                label="Class"
                value="Form 5"
                icon={GraduationCap}
              />

              <OverviewItem
                label="Academic Year"
                value="2026/2027"
                icon={CalendarDays}
              />

              <OverviewItem
                label="Class Teacher"
                value="Mrs. Nfor"
                icon={UserRound}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* ========================================================= */
/* SUMMARY CARD                                                */
/* ========================================================= */

function SummaryCard({
  icon: Icon,
  label,
  value,
  description,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pf-purple-light">
          <Icon className="h-5 w-5 text-pf-purple" />
        </div>

        <span className="font-serif text-2xl text-pf-purple-dark">
          {value}
        </span>
      </div>

      <p className="mt-4 text-sm font-medium text-gray-700">
        {label}
      </p>

      <p className="mt-1 text-xs text-gray-400">
        {description}
      </p>
    </div>
  );
}

/* ========================================================= */
/* RESULT CARD                                                 */
/* ========================================================= */

function ResultCard({ result }) {
  const scoreClass =
    result.score >= 80
      ? "text-pf-green"
      : result.score >= 60
      ? "text-pf-purple"
      : "text-red-500";

  return (
    <article className="group flex gap-4 py-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pf-purple-light">
        <BookOpen className="h-5 w-5 text-pf-purple" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-pf-purple-dark">
                {result.assessment}
              </h3>

              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[9px] font-medium text-gray-500">
                {result.subject}
              </span>
            </div>

            <p className="mt-1 text-xs text-gray-500">
              {result.teacher} · {result.date}
            </p>
          </div>

          <div className="text-right">
            <p
              className={`text-lg font-semibold ${scoreClass}`}
            >
              {result.score}%
            </p>

            <p className="text-[10px] font-medium text-gray-400">
              Grade {result.grade}
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            {result.comment}
          </p>

          <span className="text-[10px] text-gray-400">
            {result.term} · {result.year}
          </span>
        </div>
      </div>

      <button
        type="button"
        className="self-center rounded-lg p-2 text-gray-300 transition hover:bg-pf-purple-light hover:text-pf-purple"
        aria-label={`View ${result.assessment}`}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </article>
  );
}

/* ========================================================= */
/* OVERVIEW ITEM                                               */
/* ========================================================= */

function OverviewItem({
  label,
  value,
  icon: Icon,
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-[#FAF9FB] p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pf-purple-light">
        <Icon className="h-4 w-4 text-pf-purple" />
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-wide text-gray-400">
          {label}
        </p>

        <p className="mt-1 text-sm font-medium text-pf-purple-dark">
          {value}
        </p>
      </div>
    </div>
  );
}