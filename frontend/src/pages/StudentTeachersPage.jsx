import {
  CalendarDays,
  ChevronRight,
  GraduationCap,
  MessageCircle,
  Star,
  UserRound,
  UsersRound,
} from "lucide-react";
import SidebarStudent from "../components/student/SidebarStudent";

const teachers = [
  {
    name: "Mr. Xavier Ndi",
    subject: "Mathematics",
    initials: "XN",
    rating: 4.8,
    students: 12,
    progress: 78,
    nextSession: "Today · 16:00",
    status: "Active",
  },
  {
    name: "Mrs. Nfor",
    subject: "Physics",
    initials: "NF",
    rating: 4.7,
    students: 9,
    progress: 64,
    nextSession: "Thursday · 15:30",
    status: "Active",
  },
  {
    name: "Mrs. Acha",
    subject: "English",
    initials: "AC",
    rating: 4.9,
    students: 15,
    progress: 85,
    nextSession: "Friday · 14:00",
    status: "Active",
  },
  {
    name: "Mr. Bih",
    subject: "Computer Science",
    initials: "BH",
    rating: 4.6,
    students: 8,
    progress: 72,
    nextSession: "Monday · 16:00",
    status: "Active",
  },
];

export default function StudentTeachersPage() {
  return (
    <div className="min-h-screen bg-[#FAF9FB] font-sans text-[#302C38]">
      <SidebarStudent activeItem="My Teachers" />

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
            My Teachers
          </p>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pf-purple-light text-xs font-semibold text-pf-purple">
            JM
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8">
          {/* Introduction */}
          <section>
            <p className="text-sm font-medium text-pf-purple">
              MY TEACHERS
            </p>

            <h1 className="mt-1 font-serif text-2xl font-medium text-pf-purple-dark sm:text-3xl">
              My Teachers
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              View your teachers, track your learning relationship with
              them and see your upcoming sessions.
            </p>
          </section>

          {/* Summary */}
          <section className="mt-7 grid gap-4 sm:grid-cols-3">
            <SummaryCard
              icon={UsersRound}
              label="My Teachers"
              value={teachers.length}
            />

            <SummaryCard
              icon={CalendarDays}
              label="Upcoming Sessions"
              value="4"
            />

            <SummaryCard
              icon={Star}
              label="Average Rating"
              value="4.8"
            />
          </section>

          {/* Teachers */}
          <section className="mt-8">
            <div className="mb-4">
              <h2 className="font-serif text-xl text-pf-purple-dark">
                Your Teachers
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Teachers currently assigned to your subjects.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {teachers.map((teacher) => (
                <TeacherCard
                  key={`${teacher.name}-${teacher.subject}`}
                  teacher={teacher}
                />
              ))}
            </div>
          </section>

          {/* Request teacher */}
          <section className="mt-8 rounded-2xl bg-pf-purple p-5 text-white sm:p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium tracking-wide text-purple-200">
                  NEED ANOTHER TEACHER?
                </p>

                <h2 className="mt-1 font-serif text-xl">
                  Request support for another subject
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-purple-100">
                  Request a teacher for a subject you are not currently
                  studying. The platform will suggest suitable teachers
                  based on your level, subject and availability.
                </p>
              </div>

              <a
                href="/student-teachers/request"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-semibold text-pf-purple transition hover:bg-gray-100"
              >
                Request a Teacher
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* ========================================================= */
/* SUMMARY CARD                                               */
/* ========================================================= */

function SummaryCard({ icon: Icon, label, value }) {
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

      <p className="mt-4 text-xs font-medium text-gray-500">
        {label}
      </p>
    </div>
  );
}

/* ========================================================= */
/* TEACHER CARD                                               */
/* ========================================================= */

function TeacherCard({ teacher }) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-sm">
      {/* Teacher identity */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pf-purple-light text-sm font-semibold text-pf-purple">
            {teacher.initials}
          </div>

          <div>
            <h3 className="font-serif text-lg font-medium text-pf-purple-dark">
              {teacher.name}
            </h3>

            <p className="mt-0.5 text-xs text-gray-500">
              {teacher.subject}
            </p>
          </div>
        </div>

        <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-green-600">
          {teacher.status}
        </span>
      </div>

      {/* Rating */}
      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Star className="h-4 w-4 fill-current text-pf-gold" />

          <span className="text-sm font-semibold text-pf-purple-dark">
            {teacher.rating}
          </span>

          <span className="text-xs text-gray-400">
            rating
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <UsersRound className="h-3.5 w-3.5" />
          {teacher.students} students
        </div>
      </div>

      {/* Learning progress */}
      <div className="mt-5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Subject progress
          </span>

          <span className="text-xs font-semibold text-pf-purple">
            {teacher.progress}%
          </span>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-pf-purple"
            style={{
              width: `${teacher.progress}%`,
            }}
          />
        </div>
      </div>

      {/* Next session */}
      <div className="mt-5 rounded-xl bg-[#FAF9FB] p-3">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-pf-purple" />

          <div>
            <p className="text-[10px] text-gray-400">
              NEXT SESSION
            </p>

            <p className="mt-0.5 text-xs font-semibold text-pf-purple-dark">
              {teacher.nextSession}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <a
          href={`/student-teachers/${teacher.name
            .toLowerCase()
            .replace(/\s+/g, "-")}`}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2.5 text-xs font-semibold text-pf-purple-dark transition hover:bg-gray-50"
        >
          <UserRound className="h-3.5 w-3.5" />
          View Profile
        </a>

        <button
          type="button"
          className="flex items-center justify-center gap-1.5 rounded-lg bg-pf-purple px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-pf-purple-dark"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          Message
        </button>
      </div>
    </article>
  );
}