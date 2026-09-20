import {
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Eye,
  FileText,
  Filter,
  Search,
  UsersRound,
  X,
} from "lucide-react";
import { useState } from "react";
import TeacherSidebar from "../components/teacher/TeacherSidebar";

const assessments = [
  {
    id: 1,
    title: "Mathematics Progress Assessment",
    subject: "Mathematics",
    className: "Form 4",
    students: 18,
    completed: 16,
    date: "Sep 18, 2026",
    status: "Completed",
  },
  {
    id: 2,
    title: "Physics Mid-Term Assessment",
    subject: "Physics",
    className: "Form 5",
    students: 14,
    completed: 9,
    date: "Sep 20, 2026",
    status: "In Progress",
  },
  {
    id: 3,
    title: "Algebra Assessment",
    subject: "Mathematics",
    className: "Form 3",
    students: 16,
    completed: 16,
    date: "Sep 12, 2026",
    status: "Completed",
  },
  {
    id: 4,
    title: "Chemistry Basics",
    subject: "Chemistry",
    className: "Form 4",
    students: 12,
    completed: 0,
    date: "Sep 25, 2026",
    status: "Upcoming",
  },
];

const students = [
  {
    id: 1,
    name: "Student A",
    subject: "Mathematics",
    assessment: "Mathematics Progress Assessment",
    score: 82,
    grade: "A",
    date: "Sep 18, 2026",
  },
  {
    id: 2,
    name: "Student B",
    subject: "Mathematics",
    assessment: "Mathematics Progress Assessment",
    score: 74,
    grade: "B",
    date: "Sep 18, 2026",
  },
  {
    id: 3,
    name: "Student C",
    subject: "Mathematics",
    assessment: "Algebra Assessment",
    score: 91,
    grade: "A+",
    date: "Sep 12, 2026",
  },
  {
    id: 4,
    name: "Student D",
    subject: "Physics",
    assessment: "Physics Mid-Term Assessment",
    score: 68,
    grade: "B",
    date: "Sep 20, 2026",
  },
];

const filters = ["All", "Completed", "In Progress", "Upcoming"];

export default function TeacherAssessmentsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("assessments");
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  const filteredAssessments = assessments.filter((item) => {
    const matchesFilter =
      activeFilter === "All" ||
      item.status === activeFilter;

    const query = search.toLowerCase();

    const matchesSearch =
      item.title.toLowerCase().includes(query) ||
      item.subject.toLowerCase().includes(query) ||
      item.className.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  const filteredResults = students.filter((student) => {
    const query = search.toLowerCase();

    return (
      student.name.toLowerCase().includes(query) ||
      student.subject.toLowerCase().includes(query) ||
      student.assessment.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-[#FAFAFC]">
      <TeacherSidebar activeItem="Assessments & Results" />

      <main className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-100 bg-white/95 px-6 backdrop-blur lg:px-8">
          <div className="ml-12 lg:ml-0">
            <p className="text-xs text-gray-400">
              Teacher Portal
            </p>

            <h1 className="text-lg font-semibold text-pf-purple-dark">
              Assessments & Results
            </h1>
          </div>
        </header>

        <div className="p-6 lg:p-8">
          {/* Intro */}
          <section className="mb-7">
            <h2 className="font-serif text-2xl font-semibold text-pf-purple-dark">
              Assessments & Results
            </h2>

            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Follow your students' academic assessments, record
              results and monitor their progress across subjects.
            </p>
          </section>

          {/* Statistics */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={ClipboardCheck}
              label="Assessments"
              value="4"
              description="Total assessments"
            />

            <StatCard
              icon={CheckCircle2}
              label="Completed"
              value="2"
              description="Assessments completed"
            />

            <StatCard
              icon={Clock3}
              label="In Progress"
              value="1"
              description="Currently active"
            />

            <StatCard
              icon={BarChart3}
              label="Average Score"
              value="79%"
              description="Across recorded results"
            />
          </section>

          {/* Tabs */}
          <section className="mt-6 rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="flex border-b border-gray-100">
              <button
                type="button"
                onClick={() => setActiveTab("assessments")}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-medium ${
                  activeTab === "assessments"
                    ? "border-b-2 border-pf-purple text-pf-purple"
                    : "text-gray-400"
                }`}
              >
                <ClipboardCheck className="h-4 w-4" />
                Assessments
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("results")}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-medium ${
                  activeTab === "results"
                    ? "border-b-2 border-pf-purple text-pf-purple"
                    : "text-gray-400"
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                Student Results
              </button>
            </div>

            {/* Search */}
            <div className="border-b border-gray-100 p-4">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={
                    activeTab === "assessments"
                      ? "Search assessments..."
                      : "Search students or results..."
                  }
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-pf-purple focus:bg-white"
                />
              </div>
            </div>

            {activeTab === "assessments" ? (
              <>
                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 p-4">
                  <Filter className="mr-1 h-4 w-4 text-gray-400" />

                  {filters.map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setActiveFilter(filter)}
                      className={`rounded-lg px-3 py-2 text-xs font-medium ${
                        activeFilter === filter
                          ? "bg-pf-purple text-white"
                          : "bg-gray-50 text-gray-500 hover:bg-pf-purple-light hover:text-pf-purple"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                {/* Assessment list */}
                <div className="divide-y divide-gray-100">
                  {filteredAssessments.map((assessment) => (
                    <AssessmentRow
                      key={assessment.id}
                      assessment={assessment}
                      onView={() =>
                        setSelectedAssessment(assessment)
                      }
                    />
                  ))}

                  {filteredAssessments.length === 0 && (
                    <EmptyState message="No assessments found." />
                  )}
                </div>
              </>
            ) : (
              <ResultsTable results={filteredResults} />
            )}
          </section>
        </div>
      </main>

      {selectedAssessment && (
        <AssessmentModal
          assessment={selectedAssessment}
          onClose={() => setSelectedAssessment(null)}
        />
      )}
    </div>
  );
}

/* ========================================================= */
/* STAT CARD                                                  */
/* ========================================================= */

function StatCard({
  icon: Icon,
  label,
  value,
  description,
}) {
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

          <p className="mt-1 text-xs text-gray-400">
            {description}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pf-purple-light text-pf-purple">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

/* ========================================================= */
/* ASSESSMENT ROW                                            */
/* ========================================================= */

function AssessmentRow({ assessment, onView }) {
  const percentage =
    assessment.students === 0
      ? 0
      : Math.round(
          (assessment.completed / assessment.students) * 100
        );

  return (
    <div className="px-5 py-5 hover:bg-gray-50/60">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-pf-purple-light text-pf-purple">
            <ClipboardCheck className="h-5 w-5" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-medium text-pf-purple-dark">
                {assessment.title}
              </h3>

              <StatusBadge status={assessment.status} />
            </div>

            <p className="mt-1 text-sm text-gray-500">
              {assessment.subject} · {assessment.className}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Date: {assessment.date}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-5">
          <div className="min-w-[130px]">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">
                Completion
              </span>

              <span className="font-medium text-pf-purple-dark">
                {assessment.completed}/{assessment.students}
              </span>
            </div>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-pf-purple"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={onView}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-pf-purple hover:bg-pf-purple-light"
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
/* RESULTS TABLE                                             */
/* ========================================================= */

function ResultsTable({ results }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/60">
            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
              Student
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
              Subject
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
              Assessment
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
              Score
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
              Grade
            </th>

            <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
              Date
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {results.map((student) => (
            <tr
              key={student.id}
              className="transition hover:bg-gray-50/60"
            >
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pf-purple-light text-pf-purple">
                    <UsersRound className="h-4 w-4" />
                  </div>

                  <span className="text-sm font-medium text-pf-purple-dark">
                    {student.name}
                  </span>
                </div>
              </td>

              <td className="px-5 py-4 text-sm text-gray-500">
                {student.subject}
              </td>

              <td className="px-5 py-4 text-sm text-gray-500">
                {student.assessment}
              </td>

              <td className="px-5 py-4">
                <span className="text-sm font-semibold text-pf-purple-dark">
                  {student.score}%
                </span>
              </td>

              <td className="px-5 py-4">
                <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                  {student.grade}
                </span>
              </td>

              <td className="px-5 py-4 text-sm text-gray-400">
                {student.date}
              </td>
            </tr>
          ))}

          {results.length === 0 && (
            <tr>
              <td colSpan="6">
                <EmptyState message="No results found." />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ========================================================= */
/* STATUS BADGE                                               */
/* ========================================================= */

function StatusBadge({ status }) {
  const config = {
    Completed: "bg-green-50 text-green-700",
    "In Progress": "bg-amber-50 text-amber-700",
    Upcoming: "bg-blue-50 text-blue-700",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
        config[status] || "bg-gray-100 text-gray-500"
      }`}
    >
      {status}
    </span>
  );
}

/* ========================================================= */
/* ASSESSMENT MODAL                                           */
/* ========================================================= */

function AssessmentModal({ assessment, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <p className="text-xs text-gray-400">
              Assessment Details
            </p>

            <h2 className="mt-1 font-semibold text-pf-purple-dark">
              {assessment.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <Detail
              label="Subject"
              value={assessment.subject}
            />

            <Detail
              label="Class"
              value={assessment.className}
            />

            <Detail
              label="Date"
              value={assessment.date}
            />

            <Detail
              label="Status"
              value={assessment.status}
            />

            <Detail
              label="Students"
              value={assessment.students}
            />

            <Detail
              label="Completed"
              value={assessment.completed}
            />
          </div>

          <div className="mt-6 rounded-xl bg-pf-purple-light p-5">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-pf-purple" />

              <div>
                <p className="text-sm font-semibold text-pf-purple-dark">
                  Academic Evaluation
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Questions for this assessment are prepared
                  and managed by the Head of Department.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600"
            >
              Close
            </button>

            {assessment.status !== "Upcoming" && (
              <button
                type="button"
                className="rounded-lg bg-pf-purple px-4 py-2.5 text-sm font-medium text-white"
              >
                View Results
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================================================= */
/* EMPTY STATE                                                */
/* ========================================================= */

function EmptyState({ message }) {
  return (
    <div className="px-6 py-14 text-center">
      <ClipboardCheck className="mx-auto h-8 w-8 text-gray-300" />

      <p className="mt-3 text-sm text-gray-400">
        {message}
      </p>
    </div>
  );
}

/* ========================================================= */
/* DETAIL                                                     */
/* ========================================================= */

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-pf-purple-dark">
        {value}
      </p>
    </div>
  );
}