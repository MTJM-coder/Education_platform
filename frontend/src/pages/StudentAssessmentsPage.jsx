import { useMemo, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  GraduationCap,
  Search,
  Target,
} from "lucide-react";
import SidebarStudent from "../components/student/SidebarStudent";

const initialAssessments = [
  {
    id: 1,
    title: "Algebra — Chapter 3",
    subject: "Mathematics",
    teacher: "Mr. Xavier Ndi",
    type: "Quiz",
    questions: 10,
    duration: "20 min",
    due: "Tomorrow",
    status: "Pending",
    score: null,
  },
  {
    id: 2,
    title: "Electricity Fundamentals",
    subject: "Physics",
    teacher: "Mrs. Nfor",
    type: "Assessment",
    questions: 15,
    duration: "30 min",
    due: "24 Sept. 2026",
    status: "Pending",
    score: null,
  },
  {
    id: 3,
    title: "Essay Writing",
    subject: "English",
    teacher: "Mrs. Acha",
    type: "Assignment",
    questions: 3,
    duration: "45 min",
    due: "26 Sept. 2026",
    status: "Pending",
    score: null,
  },
  {
    id: 4,
    title: "HTML & CSS Basics",
    subject: "Computer Science",
    teacher: "Mr. Bih",
    type: "Quiz",
    questions: 12,
    duration: "25 min",
    due: "Completed",
    status: "Completed",
    score: 88,
  },
  {
    id: 5,
    title: "Linear Equations",
    subject: "Mathematics",
    teacher: "Mr. Xavier Ndi",
    type: "Assessment",
    questions: 20,
    duration: "40 min",
    due: "Completed",
    status: "Completed",
    score: 76,
  },
  {
    id: 6,
    title: "Introduction to Cells",
    subject: "Biology",
    teacher: "Mrs. Nfor",
    type: "Quiz",
    questions: 10,
    duration: "15 min",
    due: "Completed",
    status: "Completed",
    score: 92,
  },
];

const filters = ["All", "Pending", "Completed"];

const subjectFilters = [
  "All subjects",
  "Mathematics",
  "Physics",
  "English",
  "Computer Science",
  "Biology",
];

export default function StudentAssessmentsPage() {
  const [assessments, setAssessments] =
    useState(initialAssessments);

  const [filter, setFilter] = useState("All");
  const [subjectFilter, setSubjectFilter] =
    useState("All subjects");
  const [search, setSearch] = useState("");

  const filteredAssessments = useMemo(() => {
    return assessments.filter((assessment) => {
      const matchesStatus =
        filter === "All" || assessment.status === filter;

      const matchesSubject =
        subjectFilter === "All subjects" ||
        assessment.subject === subjectFilter;

      const searchValue = search.toLowerCase();

      const matchesSearch =
        assessment.title.toLowerCase().includes(searchValue) ||
        assessment.subject.toLowerCase().includes(searchValue) ||
        assessment.teacher.toLowerCase().includes(searchValue);

      return (
        matchesStatus &&
        matchesSubject &&
        matchesSearch
      );
    });
  }, [assessments, filter, subjectFilter, search]);

  const pendingCount = assessments.filter(
    (item) => item.status === "Pending"
  ).length;

  const completedCount = assessments.filter(
    (item) => item.status === "Completed"
  ).length;

  const averageScore = Math.round(
    assessments
      .filter((item) => item.score !== null)
      .reduce((total, item) => total + item.score, 0) /
      assessments.filter((item) => item.score !== null).length
  );

  function startAssessment(id) {
    // À remplacer plus tard par la vraie route
    // /student-assessments/:id
    console.log("Start assessment:", id);
  }

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
          {/* Heading */}
          <section>
            <p className="text-sm font-medium text-pf-purple">
              ACADEMIC ASSESSMENTS
            </p>

            <h1 className="mt-1 font-serif text-2xl font-medium text-pf-purple-dark sm:text-3xl">
              Assessments
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-gray-500">
              View your available assessments, complete your
              pending work and keep track of what you have
              already completed.
            </p>
          </section>

          {/* Stats */}
          <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={ClipboardCheck}
              label="Total assessments"
              value={assessments.length}
            />

            <StatCard
              icon={Clock3}
              label="Pending"
              value={pendingCount}
            />

            <StatCard
              icon={CheckCircle2}
              label="Completed"
              value={completedCount}
            />

            <StatCard
              icon={Target}
              label="Average score"
              value={`${averageScore}%`}
            />
          </section>

          {/* Main content */}
          <section className="mt-7 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
            {/* Toolbar */}
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="font-serif text-xl text-pf-purple-dark">
                  My assessments
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Complete your pending academic activities.
                </p>
              </div>

              <div className="relative w-full xl:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search assessments..."
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-xs outline-none transition focus:border-pf-purple focus:ring-2 focus:ring-pf-purple/10"
                />
              </div>
            </div>

            {/* Status filters */}
            <div className="mt-5 flex flex-wrap gap-2">
              {filters.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    filter === item
                      ? "bg-pf-purple text-white"
                      : "bg-[#FAF9FB] text-gray-500 hover:bg-pf-purple-light hover:text-pf-purple"
                  }`}
                >
                  {item}

                  {item === "Pending" &&
                    pendingCount > 0 && (
                      <span className="ml-1.5">
                        {pendingCount}
                      </span>
                    )}
                </button>
              ))}
            </div>

            {/* Subject filters */}
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {subjectFilters.map((subject) => (
                <button
                  key={subject}
                  type="button"
                  onClick={() =>
                    setSubjectFilter(subject)
                  }
                  className={`whitespace-nowrap rounded-lg border px-3 py-2 text-xs font-medium transition ${
                    subjectFilter === subject
                      ? "border-pf-purple bg-pf-purple-light text-pf-purple"
                      : "border-gray-200 bg-white text-gray-500 hover:border-pf-purple-light hover:text-pf-purple"
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>

            {/* Assessment list */}
            <div className="mt-6 space-y-3">
              {filteredAssessments.map((assessment) => (
                <AssessmentCard
                  key={assessment.id}
                  assessment={assessment}
                  onStart={startAssessment}
                />
              ))}

              {filteredAssessments.length === 0 && (
                <div className="py-14 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-pf-purple-light">
                    <ClipboardCheck className="h-5 w-5 text-pf-purple" />
                  </div>

                  <h3 className="mt-4 font-serif text-lg text-pf-purple-dark">
                    No assessments found
                  </h3>

                  <p className="mt-1 text-sm text-gray-400">
                    Try changing your filters or search.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Upcoming reminder */}
          {pendingCount > 0 && (
            <section className="mt-6 rounded-2xl border border-pf-purple-light bg-pf-purple-light p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
                  <AlertCircle className="h-5 w-5 text-pf-purple" />
                </div>

                <div>
                  <h2 className="font-serif text-lg text-pf-purple-dark">
                    You have {pendingCount} assessment
                    {pendingCount > 1 ? "s" : ""} to complete
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Make sure you complete your pending
                    assessments before their deadlines.
                  </p>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

/* ========================================================= */
/* STAT CARD                                                   */
/* ========================================================= */

function StatCard({ icon: Icon, label, value }) {
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

      <p className="mt-4 text-xs text-gray-500">
        {label}
      </p>
    </div>
  );
}

/* ========================================================= */
/* ASSESSMENT CARD                                             */
/* ========================================================= */

function AssessmentCard({ assessment, onStart }) {
  const completed = assessment.status === "Completed";

  return (
    <article className="rounded-xl border border-gray-100 bg-[#FCFBFD] p-4 transition hover:border-pf-purple-light hover:shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Icon */}
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            completed
              ? "bg-green-50"
              : "bg-pf-purple-light"
          }`}
        >
          {completed ? (
            <CheckCircle2 className="h-5 w-5 text-pf-green" />
          ) : (
            <ClipboardCheck className="h-5 w-5 text-pf-purple" />
          )}
        </div>

        {/* Information */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-pf-purple-dark">
              {assessment.title}
            </h3>

            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                completed
                  ? "bg-green-50 text-green-600"
                  : "bg-amber-50 text-amber-600"
              }`}
            >
              {assessment.status}
            </span>
          </div>

          <p className="mt-1 text-xs text-gray-500">
            {assessment.subject} · {assessment.teacher}
          </p>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-gray-500">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {assessment.type}
            </span>

            <span className="flex items-center gap-1">
              <ClipboardCheck className="h-3.5 w-3.5" />
              {assessment.questions} questions
            </span>

            <span className="flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5" />
              {assessment.duration}
            </span>

            <span className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" />
              {completed
                ? "Completed"
                : `Due ${assessment.due}`}
            </span>
          </div>
        </div>

        {/* Score / action */}
        <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-3 sm:border-0 sm:pt-0">
          {completed ? (
            <div>
              <p className="text-[10px] uppercase tracking-wide text-gray-400">
                Score
              </p>

              <p
                className={`mt-1 text-lg font-semibold ${
                  assessment.score >= 80
                    ? "text-pf-green"
                    : "text-pf-purple"
                }`}
              >
                {assessment.score}%
              </p>
            </div>
          ) : (
            <div>
              <p className="text-[10px] uppercase tracking-wide text-gray-400">
                Deadline
              </p>

              <p className="mt-1 text-xs font-semibold text-amber-600">
                {assessment.due}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={() =>
              !completed && onStart(assessment.id)
            }
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
              completed
                ? "border border-gray-200 bg-white text-pf-purple hover:bg-pf-purple-light"
                : "bg-pf-purple text-white hover:bg-pf-purple-dark"
            }`}
          >
            {completed ? "View result" : "Start"}

            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}