import {
  BookOpen,
  CalendarDays,
  ChevronRight,
  GraduationCap,
  MapPin,
  Search,
  Star,
  TrendingUp,
  UserRound,
  UsersRound,
} from "lucide-react";
import { useState } from "react";
import TeacherSidebar from "../components/teacher/TeacherSidebar";

const students = [
  {
    id: 1,
    name: "Junior D.",
    className: "Form 4",
    school: "Government Bilingual High School",
    location: "Bonamoussadi",
    subjects: ["Mathematics", "Physics"],
    progress: 78,
    nextLesson: "Today, 16:00",
    status: "Active",
  },
  {
    id: 2,
    name: "Sarah M.",
    className: "Class 6",
    school: "Greenfield School",
    location: "Makepe",
    subjects: ["English", "Mathematics"],
    progress: 85,
    nextLesson: "Tomorrow, 14:00",
    status: "Active",
  },
  {
    id: 3,
    name: "David N.",
    className: "Lower Sixth",
    school: "Lycée Bilingue de Douala",
    location: "Deido",
    subjects: ["Physics"],
    progress: 64,
    nextLesson: "Sep 23, 17:00",
    status: "Active",
  },
  {
    id: 4,
    name: "Grace T.",
    className: "Form 3",
    school: "Cambridge College",
    location: "Akwa",
    subjects: ["Mathematics"],
    progress: 91,
    nextLesson: "Sep 24, 15:00",
    status: "Active",
  },
  {
    id: 5,
    name: "Michael E.",
    className: "Upper Sixth",
    school: "Bilingual High School",
    location: "Bonapriso",
    subjects: ["Mathematics", "Physics"],
    progress: 72,
    nextLesson: "Sep 25, 16:30",
    status: "Active",
  },
  {
    id: 6,
    name: "Emma K.",
    className: "Class 5",
    school: "The Learning Center",
    location: "Bépanda",
    subjects: ["English"],
    progress: 88,
    nextLesson: "Sep 26, 10:00",
    status: "Active",
  },
];

const filters = ["All", "Active", "Needs Attention"];

export default function TeacherStudentsPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.className.toLowerCase().includes(search.toLowerCase()) ||
      student.subjects.some((subject) =>
        subject.toLowerCase().includes(search.toLowerCase())
      );

    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "Active" && student.status === "Active") ||
      (activeFilter === "Needs Attention" && student.progress < 70);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#FAFAFC]">
      <TeacherSidebar activeItem="My Students" />

      <main className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-100 bg-white/95 px-6 backdrop-blur lg:px-8">
          <div className="ml-12 lg:ml-0">
            <p className="text-xs text-gray-400">Teacher Portal</p>

            <h1 className="text-lg font-semibold text-pf-purple-dark">
              My Students
            </h1>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pf-purple-light">
            <UsersRound className="h-4 w-4 text-pf-purple" />
          </div>
        </header>

        <div className="p-6 lg:p-8">
          {/* Intro */}
          <section className="mb-7">
            <h2 className="font-serif text-2xl font-semibold text-pf-purple-dark">
              Your Students
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Monitor your assigned students and their learning progress.
            </p>
          </section>

          {/* Summary cards */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              icon={UsersRound}
              label="Total Students"
              value="8"
              description="Currently assigned"
            />

            <SummaryCard
              icon={TrendingUp}
              label="Average Progress"
              value="79%"
              description="Across all students"
            />

            <SummaryCard
              icon={BookOpen}
              label="Subjects"
              value="4"
              description="Currently teaching"
            />

            <SummaryCard
              icon={CalendarDays}
              label="Lessons This Week"
              value="14"
              description="Scheduled sessions"
            />
          </section>

          {/* Search + filters */}
          <section className="mt-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Search */}
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  placeholder="Search student, class or subject..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-pf-purple focus:bg-white"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                      activeFilter === filter
                        ? "bg-pf-purple text-white"
                        : "bg-gray-50 text-gray-500 hover:bg-pf-purple-light hover:text-pf-purple"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Students */}
          <section className="mt-6 rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <h3 className="font-semibold text-pf-purple-dark">
                  Assigned Students
                </h3>

                <p className="mt-0.5 text-xs text-gray-400">
                  {filteredStudents.length} student
                  {filteredStudents.length !== 1 ? "s" : ""} displayed
                </p>
              </div>
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 text-left">
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Student
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Subjects
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Progress
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Next Lesson
                    </th>

                    <th className="px-5 py-3" />
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="transition hover:bg-gray-50/70"
                    >
                      {/* Student */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pf-purple-light">
                            <UserRound className="h-5 w-5 text-pf-purple" />
                          </div>

                          <div>
                            <p className="font-medium text-pf-purple-dark">
                              {student.name}
                            </p>

                            <p className="mt-0.5 text-xs text-gray-400">
                              {student.className}
                            </p>

                            <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                              <MapPin className="h-3 w-3" />
                              {student.location}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Subjects */}
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {student.subjects.map((subject) => (
                            <span
                              key={subject}
                              className="rounded-full bg-pf-purple-light px-2.5 py-1 text-xs font-medium text-pf-purple"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Progress */}
                      <td className="px-5 py-4">
                        <div className="w-32">
                          <div className="mb-1.5 flex items-center justify-between">
                            <span className="text-xs text-gray-400">
                              Progress
                            </span>

                            <span className="text-xs font-semibold text-pf-purple-dark">
                              {student.progress}%
                            </span>
                          </div>

                          <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className="h-full rounded-full bg-pf-purple"
                              style={{ width: `${student.progress}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Next lesson */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CalendarDays className="h-4 w-4 text-pf-purple" />
                          {student.nextLesson}
                        </div>
                      </td>

                      {/* Details */}
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-pf-purple-light hover:text-pf-purple"
                          aria-label={`View ${student.name}`}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-gray-100 md:hidden">
              {filteredStudents.map((student) => (
                <div key={student.id} className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-pf-purple-light">
                        <UserRound className="h-5 w-5 text-pf-purple" />
                      </div>

                      <div>
                        <p className="font-medium text-pf-purple-dark">
                          {student.name}
                        </p>

                        <p className="text-xs text-gray-400">
                          {student.className}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="rounded-lg p-2 text-gray-400 hover:bg-pf-purple-light hover:text-pf-purple"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {student.subjects.map((subject) => (
                      <span
                        key={subject}
                        className="rounded-full bg-pf-purple-light px-2.5 py-1 text-xs font-medium text-pf-purple"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4">
                    <div className="mb-1.5 flex justify-between text-xs">
                      <span className="text-gray-400">Learning progress</span>

                      <span className="font-semibold text-pf-purple-dark">
                        {student.progress}%
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-pf-purple"
                        style={{ width: `${student.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 text-xs text-gray-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-pf-purple" />
                      {student.location}
                    </div>

                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-3.5 w-3.5 text-pf-purple" />
                      Next lesson: {student.nextLesson}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty state */}
            {filteredStudents.length === 0 && (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-pf-purple-light">
                  <UsersRound className="h-5 w-5 text-pf-purple" />
                </div>

                <h3 className="mt-4 font-semibold text-pf-purple-dark">
                  No students found
                </h3>

                <p className="mt-1 text-sm text-gray-400">
                  Try changing your search or filter.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

/* ---------------------------------- */
/* Reusable components                */
/* ---------------------------------- */

function SummaryCard({
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