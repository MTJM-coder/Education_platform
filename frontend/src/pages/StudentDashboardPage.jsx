import {
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  GraduationCap,
  Target,
  TrendingUp,
  UserRound,
} from "lucide-react";
import StudentSidebar from "../components/student/SidebarStudent";

const subjects = [
  {
    name: "Mathematics",
    teacher: "Mr. John Doe",
    average: 78,
    progress: 82,
  },
  {
    name: "Physics",
    teacher: "Mrs. Sarah Smith",
    average: 71,
    progress: 68,
  },
  {
    name: "Chemistry",
    teacher: "Mr. David Brown",
    average: 84,
    progress: 89,
  },
];

const upcomingClasses = [
  {
    subject: "Mathematics",
    teacher: "Mr. John Doe",
    date: "Today",
    time: "16:00 - 18:00",
    type: "Home Lesson",
  },
  {
    subject: "Physics",
    teacher: "Mrs. Sarah Smith",
    date: "Tomorrow",
    time: "14:00 - 16:00",
    type: "Home Lesson",
  },
];

const recentResults = [
  {
    subject: "Mathematics",
    assessment: "Algebra Assessment",
    score: 82,
    grade: "A",
    date: "Sep 18, 2026",
  },
  {
    subject: "Physics",
    assessment: "Mechanics Test",
    score: 74,
    grade: "B+",
    date: "Sep 15, 2026",
  },
  {
    subject: "Chemistry",
    assessment: "Organic Chemistry",
    score: 88,
    grade: "A",
    date: "Sep 12, 2026",
  },
];

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-[#FAFAFC]">
      <StudentSidebar activeItem="Dashboard" />

      <main className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-100 bg-white/95 px-6 backdrop-blur lg:px-8">
          <div className="ml-12 lg:ml-0">
            <p className="text-xs text-gray-400">
              Student Portal
            </p>

            <h1 className="text-lg font-semibold text-pf-purple-dark">
              Dashboard
            </h1>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pf-purple-light text-pf-purple">
            <UserRound className="h-4 w-4" />
          </div>
        </header>

        <div className="p-6 lg:p-8">
          {/* Welcome */}
          <section className="mb-7">
            <p className="text-sm text-gray-400">
              Sunday, September 20, 2026
            </p>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Here is an overview of your learning progress and
              upcoming activities.
            </p>
          </section>

          {/* Main statistics */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={TrendingUp}
              label="Overall Average"
              value="78%"
              description="+4% this term"
            />

            <StatCard
              icon={BookOpen}
              label="Subjects"
              value="3"
              description="Currently studying"
            />

            <StatCard
              icon={CalendarDays}
              label="Upcoming Classes"
              value="2"
              description="This week"
            />

            <StatCard
              icon={Target}
              label="Attendance"
              value="94%"
              description="Excellent attendance"
            />
          </section>

          {/* Progress + next class */}
          <section className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            {/* Overall progress */}
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-pf-purple-dark">
                    My Learning Progress
                  </h3>

                  <p className="mt-1 text-xs text-gray-400">
                    Your current performance by subject
                  </p>
                </div>

                <TrendingUp className="h-5 w-5 text-pf-purple" />
              </div>

              <div className="mt-6 space-y-5">
                {subjects.map((subject) => (
                  <SubjectProgress
                    key={subject.name}
                    subject={subject}
                  />
                ))}
              </div>
            </div>

            {/* Next class */}
            <div className="rounded-xl bg-pf-purple p-6 text-white shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-white/60">
                    Next Class
                  </p>

                  <h3 className="mt-2 text-xl font-semibold">
                    {upcomingClasses[0].subject}
                  </h3>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                  <CalendarDays className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <InfoRow
                  icon={UserRound}
                  text={upcomingClasses[0].teacher}
                />

                <InfoRow
                  icon={CalendarDays}
                  text={upcomingClasses[0].date}
                />

                <InfoRow
                  icon={Clock3}
                  text={upcomingClasses[0].time}
                />
              </div>

              <button
                type="button"
                className="mt-6 w-full rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-pf-purple hover:bg-gray-50"
              >
                View Class Details
              </button>
            </div>
          </section>

          {/* Upcoming classes */}
          <section className="mt-6 rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <h3 className="font-semibold text-pf-purple-dark">
                  Upcoming Classes
                </h3>

                <p className="mt-1 text-xs text-gray-400">
                  Your next scheduled lessons
                </p>
              </div>

              <button
                type="button"
                className="flex items-center gap-1 text-xs font-medium text-pf-purple"
              >
                View Calendar
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {upcomingClasses.map((item, index) => (
                <ClassRow
                  key={index}
                  item={item}
                />
              ))}
            </div>
          </section>

          {/* Recent results */}
          <section className="mt-6 rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <h3 className="font-semibold text-pf-purple-dark">
                  Recent Results
                </h3>

                <p className="mt-1 text-xs text-gray-400">
                  Your latest academic assessments
                </p>
              </div>

              <button
                type="button"
                className="flex items-center gap-1 text-xs font-medium text-pf-purple"
              >
                View All Results
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      Subject
                    </th>

                    <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      Assessment
                    </th>

                    <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      Score
                    </th>

                    <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      Grade
                    </th>

                    <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {recentResults.map((result) => (
                    <ResultRow
                      key={result.assessment}
                      result={result}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Learning resources + award */}
          <section className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* Resources */}
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pf-purple-light text-pf-purple">
                  <FileText className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-semibold text-pf-purple-dark">
                    Learning Resources
                  </h3>

                  <p className="mt-1 text-xs text-gray-400">
                    Continue learning outside your lessons
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <ResourceItem
                  icon={FileText}
                  title="Past Papers"
                  description="Practice with previous exams"
                />

                <ResourceItem
                  icon={BookOpen}
                  title="Lecture Notes"
                  description="Review your course materials"
                />
              </div>
            </div>

            {/* Most progressive student */}
            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Monthly Award
                  </p>

                  <h3 className="mt-2 font-semibold text-pf-purple-dark">
                    Most Progressive Student
                  </h3>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
                  <Award className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-5 flex items-center gap-4 rounded-lg bg-gray-50 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pf-purple-light text-pf-purple">
                  <GraduationCap className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-pf-purple-dark">
                    You are currently ranked
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Keep improving to become the Most Progressive
                    Student of the Month.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="mt-4 flex items-center gap-1 text-xs font-medium text-pf-purple"
              >
                View Ranking
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
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

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pf-purple-light text-pf-purple">
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

/* ========================================================= */
/* SUBJECT PROGRESS                                            */
/* ========================================================= */

function SubjectProgress({ subject }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-700">
            {subject.name}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            {subject.teacher}
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm font-semibold text-pf-purple-dark">
            {subject.average}%
          </p>

          <p className="mt-1 text-[11px] text-gray-400">
            Average
          </p>
        </div>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-pf-purple"
          style={{
            width: `${subject.progress}%`,
          }}
        />
      </div>
    </div>
  );
}

/* ========================================================= */
/* INFO ROW                                                    */
/* ========================================================= */

function InfoRow({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-3 text-sm text-white/80">
      <Icon className="h-4 w-4 text-white/60" />
      <span>{text}</span>
    </div>
  );
}

/* ========================================================= */
/* CLASS ROW                                                   */
/* ========================================================= */

function ClassRow({ item }) {
  return (
    <div className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pf-purple-light text-pf-purple">
          <BookOpen className="h-4 w-4" />
        </div>

        <div>
          <p className="text-sm font-medium text-pf-purple-dark">
            {item.subject}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            {item.teacher} · {item.type}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div>
          <p className="text-xs text-gray-400">
            Date
          </p>

          <p className="mt-1 text-sm font-medium text-gray-600">
            {item.date}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400">
            Time
          </p>

          <p className="mt-1 flex items-center gap-1 text-sm font-medium text-gray-600">
            <Clock3 className="h-3.5 w-3.5" />
            {item.time}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ========================================================= */
/* RESULT ROW                                                  */
/* ========================================================= */

function ResultRow({ result }) {
  return (
    <tr className="transition hover:bg-gray-50/60">
      <td className="px-6 py-4 text-sm font-medium text-pf-purple-dark">
        {result.subject}
      </td>

      <td className="px-6 py-4 text-sm text-gray-600">
        {result.assessment}
      </td>

      <td className="px-6 py-4 text-sm font-semibold text-gray-700">
        {result.score}%
      </td>

      <td className="px-6 py-4">
        <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
          {result.grade}
        </span>
      </td>

      <td className="px-6 py-4 text-xs text-gray-400">
        {result.date}
      </td>
    </tr>
  );
}

/* ========================================================= */
/* RESOURCE ITEM                                               */
/* ========================================================= */

function ResourceItem({
  icon: Icon,
  title,
  description,
}) {
  return (
    <button
      type="button"
      className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 text-left transition hover:border-pf-purple/20 hover:bg-pf-purple-light"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-pf-purple">
        <Icon className="h-4 w-4" />
      </div>

      <div>
        <p className="text-xs font-semibold text-pf-purple-dark">
          {title}
        </p>

        <p className="mt-1 text-[11px] text-gray-400">
          {description}
        </p>
      </div>
    </button>
  );
}