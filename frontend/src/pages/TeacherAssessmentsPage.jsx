import { useMemo, useState } from "react";
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ClipboardCheck,
  GraduationCap,
  Search,
  Target,
  XCircle,
} from "lucide-react";
import SidebarStudent from "../components/student/SidebarStudent";

const assessments = [
  {
    id: 1,
    title: "Algebra — Chapter 3",
    subject: "Mathematics",
    teacher: "Mr. Xavier Ndi",
    type: "Quiz",
    questions: 10,
    duration: "20 min",
    date: "2026-09-22",
    deadline: "Tomorrow",
    status: "Upcoming",
  },
  {
    id: 2,
    title: "Electricity Fundamentals",
    subject: "Physics",
    teacher: "Mrs. Nfor",
    type: "Assessment",
    questions: 15,
    duration: "30 min",
    date: "2026-09-24",
    deadline: "Thursday",
    status: "Upcoming",
  },
  {
    id: 3,
    title: "Essay Writing",
    subject: "English",
    teacher: "Mrs. Acha",
    type: "Assignment",
    questions: 3,
    duration: "45 min",
    date: "2026-09-26",
    deadline: "Saturday",
    status: "Upcoming",
  },
  {
    id: 4,
    title: "Linear Equations",
    subject: "Mathematics",
    teacher: "Mr. Xavier Ndi",
    type: "Quiz",
    questions: 12,
    duration: "20 min",
    date: "2026-09-18",
    deadline: "Completed",
    status: "Completed",
    score: 86,
    grade: "A",
  },
  {
    id: 5,
    title: "Motion and Forces",
    subject: "Physics",
    teacher: "Mrs. Nfor",
    type: "Assessment",
    questions: 20,
    duration: "40 min",
    date: "2026-09-16",
    deadline: "Completed",
    status: "Completed",
    score: 74,
    grade: "B",
  },
  {
    id: 6,
    title: "HTML Basics",
    subject: "Computer Science",
    teacher: "Mr. Bih",
    type: "Quiz",
    questions: 10,
    duration: "15 min",
    date: "2026-09-12",
    deadline: "Completed",
    status: "Completed",
    score: 92,
    grade: "A",
  },
  {
    id: 7,
    title: "Fractions & Percentages",
    subject: "Mathematics",
    teacher: "Mr. Xavier Ndi",
    type: "Quiz",
    questions: 10,
    duration: "20 min",
    date: "2026-09-10",
    deadline: "Completed",
    status: "Missed",
  },
];

const filters = [
  "All",
  "Upcoming",
  "Completed",
  "Missed",
];

export default function StudentAssessmentsPage() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filteredAssessments = useMemo(() => {
    return assessments.filter((assessment) => {
      const matchesFilter =
        filter === "All" || assessment.status === filter;

      const searchText = search.toLowerCase();

      const matchesSearch =
        assessment.title.toLowerCase().includes(searchText) ||
        assessment.subject.toLowerCase().includes(searchText) ||
        assessment.teacher.toLowerCase().includes(searchText);

      return matchesFilter && matchesSearch;
    });
  }, [filter, search]);

  const upcoming = assessments.filter(
    (item) => item.status === "Upcoming"
  ).length;

  const completed = assessments.filter(
    (item) => item.status === "Completed"
  ).length;

  const missed = assessments.filter(
    (item) => item.status === "Missed"
  ).length;

  const averageScore =
    assessments
      .filter((item) => item.status === "Completed")
      .reduce((sum, item) => sum + item.score, 0) /
    completed;

  return (
    <div className="min-h-screen bg-[#FAF9FB] font-sans text-[#302C38]">
      <SidebarStudent activeItem="Assessments" />

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
            Assessments
          </p>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pf-purple-light text-xs font-semibold text-pf-purple">
            JM
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8">
          {/* Page introduction */}
          <section className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-pf-purple">
                ASSESSMENTS
              </p>

              <h1 className="mt-1 font-serif text-2xl font-medium text-pf-purple-dark sm:text-3xl">
                My Assessments
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Complete your assessments and keep track of your
                academic performance.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-pf-purple-light px-3 py-2 text-xs font-medium text-pf-purple">
              <ClipboardCheck className="h-4 w-4" />
              {upcoming} upcoming
            </div>
          </section>

          {/* Statistics */}
          <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={Target}
              label="Upcoming"
              value={upcoming}
              description="Need your attention"
            />

            <StatCard
              icon={CheckCircle2}
              label="Completed"
              value={completed}
              description="Assessments finished"
            />

            <StatCard
              icon={XCircle}
              label="Missed"
              value={missed}
              description="Need attention"
            />

            <StatCard
              icon={BarChart3}
              label="Average Score"
              value={`${Math.round(averageScore)}%`}
              description="Completed assessments"
            />
          </section>

          {/* Main content */}
          <section className="mt-7 grid gap-5 xl:grid-cols-[1.55fr_0.75fr]">
            {/* Assessment list */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-serif text-xl text-pf-purple-dark">
                    Assessments
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Your quizzes, assignments and academic evaluations.
                  </p>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search..."
                    className="w-48 rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-xs outline-none transition focus:border-pf-purple"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
                {filters.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFilter(item)}
                    className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      filter === item
                        ? "bg-pf-purple text-white"
                        : "bg-[#FAF9FB] text-gray-500 hover:bg-pf-purple-light hover:text-pf-purple"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {/* List */}
              <div className="mt-4 divide-y divide-gray-100">
                {filteredAssessments.map((assessment) => (
                  <AssessmentCard
                    key={assessment.id}
                    assessment={assessment}
                  />
                ))}

                {filteredAssessments.length === 0 && (
                  <div className="py-12 text-center">
                    <ClipboardCheck className="mx-auto h-8 w-8 text-gray-300" />

                    <p className="mt-3 text-sm text-gray-500">
                      No assessments found.
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Try another search or filter.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right column */}
            <aside className="space-y-5">
              {/* Next assessment */}
              <section className="rounded-2xl bg-pf-purple p-5 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-medium tracking-[0.12em] text-purple-200">
                      NEXT ASSESSMENT
                    </p>

                    <h2 className="mt-2 font-serif text-xl">
                      {assessments.find(
                        (item) => item.status === "Upcoming"
                      )?.title}
                    </h2>
                  </div>

                  <div className="rounded-lg bg-white/15 p-2.5">
                    <ClipboardCheck className="h-5 w-5" />
                  </div>
                </div>

                <p className="mt-2 text-xs text-purple-100">
                  Mathematics · Algebra
                </p>

                <div className="mt-5 space-y-2.5">
                  <InfoRow
                    icon={Clock3}
                    text="Tomorrow · 20 minutes"
                  />

                  <InfoRow
                    icon={BookOpen}
                    text="10 questions"
                  />
                </div>

                <button
                  type="button"
                  className="mt-5 w-full rounded-lg bg-white px-4 py-2.5 text-xs font-semibold text-pf-purple transition hover:bg-purple-50"
                >
                  View assessment
                </button>
              </section>

              {/* Performance */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-lg text-pf-purple-dark">
                      Recent Performance
                    </h2>

                    <p className="mt-1 text-xs text-gray-400">
                      Your latest assessment results
                    </p>
                  </div>

                  <BarChart3 className="h-5 w-5 text-pf-purple" />
                </div>

                <div className="mt-5 space-y-4">
                  {assessments
                    .filter(
                      (item) => item.status === "Completed"
                    )
                    .slice(0, 3)
                    .map((item) => (
                      <div key={item.id}>
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
                      </div>
                    ))}
                </div>

                <a
                  href="/student-results"
                  className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 text-xs font-semibold text-pf-purple"
                >
                  View all results
                  <ChevronRight className="h-4 w-4" />
                </a>
              </section>
            </aside>
          </section>
        </div>
      </main>
    </div>
  );
}

/* ========================================================= */
/* STAT CARD                                                   */
/* ========================================================= */

function StatCard({
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
/* ASSESSMENT CARD                                             */
/* ========================================================= */

function AssessmentCard({ assessment }) {
  const isCompleted = assessment.status === "Completed";
  const isMissed = assessment.status === "Missed";

  return (
    <article className="group flex gap-4 py-4">
      {/* Icon */}
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
          isCompleted
            ? "bg-green-50"
            : isMissed
            ? "bg-red-50"
            : "bg-pf-purple-light"
        }`}
      >
        {isCompleted ? (
          <CheckCircle2 className="h-5 w-5 text-pf-green" />
        ) : isMissed ? (
          <XCircle className="h-5 w-5 text-red-500" />
        ) : (
          <ClipboardCheck className="h-5 w-5 text-pf-purple" />
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-pf-purple-dark">
                {assessment.title}
              </h3>

              <span
                className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                  isCompleted
                    ? "bg-green-50 text-green-600"
                    : isMissed
                    ? "bg-red-50 text-red-500"
                    : "bg-pf-purple-light text-pf-purple"
                }`}
              >
                {assessment.status}
              </span>
            </div>

            <p className="mt-1 text-xs text-gray-500">
              {assessment.subject} · {assessment.teacher}
            </p>
          </div>

          {isCompleted && (
            <div className="text-right">
              <p className="text-lg font-semibold text-pf-purple">
                {assessment.score}%
              </p>

              <p className="text-[10px] text-gray-400">
                Grade {assessment.grade}
              </p>
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-gray-500">
          <span className="inline-flex items-center gap-1.5">
            <ClipboardCheck className="h-3.5 w-3.5 text-gray-400" />
            {assessment.type}
          </span>

          <span className="inline-flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5 text-gray-400" />
            {assessment.questions} questions
          </span>

          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5 text-gray-400" />
            {assessment.duration}
          </span>

          {!isCompleted && !isMissed && (
            <span className="font-medium text-pf-purple">
              Due {assessment.deadline}
            </span>
          )}
        </div>
      </div>

      {/* Action */}
      {!isMissed && (
        <button
          type="button"
          className="self-center rounded-lg p-2 text-gray-400 transition hover:bg-pf-purple-light hover:text-pf-purple"
          aria-label={`Open ${assessment.title}`}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </article>
  );
}

/* ========================================================= */
/* INFO ROW                                                    */
/* ========================================================= */

function InfoRow({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-2 text-xs text-purple-100">
      <Icon className="h-3.5 w-3.5" />
      <span>{text}</span>
    </div>
  );
}