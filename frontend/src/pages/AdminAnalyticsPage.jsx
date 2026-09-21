import { useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Coins,
  Download,
  GraduationCap,
  Star,
  TrendingUp,
  UserCheck,
  UsersRound,
} from "lucide-react";
import SidebarAdmin from "../components/admin/SidebarAdmin";

const monthlyData = [
  { month: "Jan", users: 420, sessions: 180, revenue: 420000 },
  { month: "Feb", users: 510, sessions: 210, revenue: 480000 },
  { month: "Mar", users: 590, sessions: 245, revenue: 560000 },
  { month: "Apr", users: 680, sessions: 290, revenue: 640000 },
  { month: "May", users: 760, sessions: 325, revenue: 720000 },
  { month: "Jun", users: 850, sessions: 370, revenue: 810000 },
  { month: "Jul", users: 940, sessions: 415, revenue: 930000 },
  { month: "Aug", users: 1048, sessions: 468, revenue: 1050000 },
];

const subjectPerformance = [
  {
    name: "Mathematics",
    learners: 186,
    average: 82,
    sessions: 248,
  },
  {
    name: "English",
    learners: 163,
    average: 79,
    sessions: 214,
  },
  {
    name: "French",
    learners: 142,
    average: 77,
    sessions: 198,
  },
  {
    name: "Physics",
    learners: 104,
    average: 74,
    sessions: 156,
  },
  {
    name: "Computer Science",
    learners: 96,
    average: 86,
    sessions: 143,
  },
];

const teacherPerformance = [
  {
    name: "Mr. Xavier N.",
    subject: "Mathematics",
    students: 28,
    rating: 4.9,
    sessions: 64,
  },
  {
    name: "Mrs. Acha",
    subject: "English",
    students: 24,
    rating: 4.8,
    sessions: 58,
  },
  {
    name: "Mr. Bih",
    subject: "Computer Science",
    students: 19,
    rating: 4.8,
    sessions: 51,
  },
  {
    name: "Mrs. Nfor",
    subject: "Physics",
    students: 17,
    rating: 4.6,
    sessions: 44,
  },
];

const activityData = [
  {
    label: "Active learners",
    value: "786",
    percentage: 75,
  },
  {
    label: "Active teachers",
    value: "92",
    percentage: 68,
  },
  {
    label: "Completed sessions",
    value: "468",
    percentage: 82,
  },
  {
    label: "Successful assessments",
    value: "84%",
    percentage: 84,
  },
];

const periods = ["Last 7 days", "Last 30 days", "Last 6 months", "This year"];

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState("Last 30 days");

  const currentMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData[monthlyData.length - 2];

  const userGrowth = Math.round(
    ((currentMonth.users - previousMonth.users) /
      previousMonth.users) *
      100
  );

  const sessionGrowth = Math.round(
    ((currentMonth.sessions - previousMonth.sessions) /
      previousMonth.sessions) *
      100
  );

  const revenueGrowth = Math.round(
    ((currentMonth.revenue - previousMonth.revenue) /
      previousMonth.revenue) *
      100
  );

  const maxSessions = useMemo(
    () => Math.max(...monthlyData.map((item) => item.sessions)),
    []
  );

  return (
    <div className="min-h-screen bg-[#FAF9FB] font-sans text-[#302C38]">
      <SidebarAdmin activeItem="Reports & Analytics" />

      <main className="lg:ml-64">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-5 sm:px-8">
          <p className="hidden text-sm text-gray-500 lg:block">
            Reports & Analytics
          </p>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold text-pf-purple-dark">
                Super Admin
              </p>
              <p className="text-[11px] text-gray-400">
                Platform Administrator
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pf-purple text-xs font-semibold text-white">
              SA
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8">
          {/* Heading */}
          <section>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-pf-purple">
                  PLATFORM INSIGHTS
                </p>

                <h1 className="mt-1 font-serif text-2xl font-medium text-pf-purple-dark sm:text-3xl">
                  Reports & Analytics
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-gray-500">
                  Monitor platform activity, academic performance,
                  tutoring activity and financial growth.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <select
                    value={period}
                    onChange={(event) =>
                      setPeriod(event.target.value)
                    }
                    className="appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-3 pr-9 text-xs text-gray-600 outline-none focus:border-pf-purple"
                  >
                    {periods.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-pf-purple-dark transition hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 text-pf-purple" />
                  Export report
                </button>
              </div>
            </div>
          </section>

          {/* KPI Cards */}
          <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AnalyticsCard
              icon={UsersRound}
              label="Total users"
              value="1,248"
              change={`+${userGrowth}%`}
              positive
              description="vs previous month"
            />

            <AnalyticsCard
              icon={CalendarDays}
              label="Tutoring sessions"
              value="468"
              change={`+${sessionGrowth}%`}
              positive
              description="vs previous month"
            />

            <AnalyticsCard
              icon={Coins}
              label="Platform revenue"
              value="1.05M FCFA"
              change={`+${revenueGrowth}%`}
              positive
              description="vs previous month"
            />

            <AnalyticsCard
              icon={Star}
              label="Average rating"
              value="4.7 / 5"
              change="+0.3"
              positive
              description="this month"
            />
          </section>

          {/* Main analytics */}
          <section className="mt-7 grid gap-5 xl:grid-cols-[1.5fr_0.8fr]">
            {/* Activity chart */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="font-serif text-xl text-pf-purple-dark">
                    Platform activity
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    User growth and tutoring activity over time.
                  </p>
                </div>

                <div className="flex items-center gap-4 text-[11px] text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-pf-purple" />
                    Users
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-pf-green" />
                    Sessions
                  </div>
                </div>
              </div>

              <div className="mt-7 flex h-64 items-end gap-2 sm:gap-4">
                {monthlyData.map((item) => {
                  const userHeight =
                    (item.users / 1100) * 100;

                  const sessionHeight =
                    (item.sessions / maxSessions) * 100;

                  return (
                    <div
                      key={item.month}
                      className="flex h-full flex-1 flex-col justify-end"
                    >
                      <div className="flex h-full items-end justify-center gap-1">
                        <div
                          title={`${item.users} users`}
                          className="w-2.5 rounded-t bg-pf-purple transition hover:opacity-80 sm:w-4"
                          style={{
                            height: `${userHeight}%`,
                          }}
                        />

                        <div
                          title={`${item.sessions} sessions`}
                          className="w-2.5 rounded-t bg-pf-green transition hover:opacity-80 sm:w-4"
                          style={{
                            height: `${sessionHeight}%`,
                          }}
                        />
                      </div>

                      <p className="mt-3 text-center text-[10px] text-gray-400">
                        {item.month}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Activity summary */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-pf-purple" />

                <h2 className="font-serif text-xl text-pf-purple-dark">
                  Activity overview
                </h2>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                Current platform performance.
              </p>

              <div className="mt-6 space-y-5">
                {activityData.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        {item.label}
                      </p>

                      <p className="text-sm font-semibold text-pf-purple-dark">
                        {item.value}
                      </p>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-pf-purple"
                        style={{
                          width: `${item.percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-7 rounded-xl bg-pf-purple-light p-4">
                <div className="flex items-start gap-3">
                  <TrendingUp className="mt-0.5 h-5 w-5 text-pf-purple" />

                  <div>
                    <p className="text-xs font-semibold text-pf-purple-dark">
                      Platform is growing
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-gray-500">
                      User activity and tutoring sessions are
                      increasing compared with the previous month.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Financial + Academic */}
          <section className="mt-5 grid gap-5 lg:grid-cols-2">
            {/* Revenue */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-pf-purple">
                    FINANCIAL PERFORMANCE
                  </p>

                  <h2 className="mt-1 font-serif text-xl text-pf-purple-dark">
                    Monthly revenue
                  </h2>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pf-purple-light">
                  <Coins className="h-4 w-4 text-pf-purple" />
                </div>
              </div>

              <div className="mt-6">
                <p className="font-serif text-2xl text-pf-purple-dark">
                  1,050,000 FCFA
                </p>

                <div className="mt-1 flex items-center gap-1 text-xs text-pf-green">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  12.9% compared with July
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {monthlyData.slice(-5).map((item) => (
                  <div
                    key={item.month}
                    className="flex items-center gap-3"
                  >
                    <span className="w-7 text-[10px] text-gray-400">
                      {item.month}
                    </span>

                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-pf-purple"
                        style={{
                          width: `${(item.revenue / 1100000) * 100}%`,
                        }}
                      />
                    </div>

                    <span className="w-20 text-right text-[10px] font-medium text-gray-500">
                      {(item.revenue / 1000).toFixed(0)}K
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Academic */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-pf-purple">
                    ACADEMIC PERFORMANCE
                  </p>

                  <h2 className="mt-1 font-serif text-xl text-pf-purple-dark">
                    Subject performance
                  </h2>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pf-purple-light">
                  <GraduationCap className="h-4 w-4 text-pf-purple" />
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {subjectPerformance.map((subject) => (
                  <div key={subject.name}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <BookOpen className="h-4 w-4 shrink-0 text-gray-400" />

                        <span className="truncate text-xs font-medium text-pf-purple-dark">
                          {subject.name}
                        </span>
                      </div>

                      <span className="text-xs font-semibold text-pf-purple">
                        {subject.average}%
                      </span>
                    </div>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-pf-purple"
                        style={{
                          width: `${subject.average}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Performance tables */}
          <section className="mt-5 grid gap-5 xl:grid-cols-2">
            {/* Teachers */}
            <div className="rounded-2xl border border-gray-200 bg-white">
              <div className="flex items-center justify-between border-b border-gray-100 p-5 sm:p-6">
                <div>
                  <h2 className="font-serif text-xl text-pf-purple-dark">
                    Top teachers
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Teachers with the strongest activity and ratings.
                  </p>
                </div>

                <UserCheck className="h-5 w-5 text-pf-purple" />
              </div>

              <div className="divide-y divide-gray-100">
                {teacherPerformance.map((teacher, index) => (
                  <div
                    key={teacher.name}
                    className="flex items-center gap-3 px-5 py-4 sm:px-6"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pf-purple-light text-xs font-semibold text-pf-purple">
                      {index + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-pf-purple-dark">
                        {teacher.name}
                      </p>

                      <p className="mt-0.5 text-[10px] text-gray-400">
                        {teacher.subject} · {teacher.students} students
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xs font-semibold text-pf-purple-dark">
                        <Star className="h-3.5 w-3.5 fill-current text-pf-gold" />
                        {teacher.rating}
                      </div>

                      <p className="mt-0.5 text-[10px] text-gray-400">
                        {teacher.sessions} sessions
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subjects */}
            <div className="rounded-2xl border border-gray-200 bg-white">
              <div className="flex items-center justify-between border-b border-gray-100 p-5 sm:p-6">
                <div>
                  <h2 className="font-serif text-xl text-pf-purple-dark">
                    Subject activity
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Learners and tutoring sessions by subject.
                  </p>
                </div>

                <BarChart3 className="h-5 w-5 text-pf-purple" />
              </div>

              <div className="divide-y divide-gray-100">
                {subjectPerformance.map((subject) => (
                  <div
                    key={subject.name}
                    className="flex items-center gap-3 px-5 py-4 sm:px-6"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-pf-purple-light">
                      <BookOpen className="h-4 w-4 text-pf-purple" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-pf-purple-dark">
                        {subject.name}
                      </p>

                      <p className="mt-0.5 text-[10px] text-gray-400">
                        {subject.learners} learners
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-semibold text-pf-purple-dark">
                        {subject.sessions}
                      </p>

                      <p className="mt-0.5 text-[10px] text-gray-400">
                        sessions
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Bottom summary */}
          <section className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              icon={UsersRound}
              label="New users"
              value="108"
              change="+14.2%"
            />

            <SummaryCard
              icon={BookOpen}
              label="New sessions"
              value="53"
              change="+11.6%"
            />

            <SummaryCard
              icon={CheckCircle2}
              label="Completed assessments"
              value="312"
              change="+8.4%"
            />

            <SummaryCard
              icon={Star}
              label="New reviews"
              value="147"
              change="+18.1%"
            />
          </section>
        </div>
      </main>
    </div>
  );
}

/* ========================================================= */
/* ANALYTICS CARD                                             */
/* ========================================================= */

function AnalyticsCard({
  icon: Icon,
  label,
  value,
  change,
  positive,
  description,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pf-purple-light">
          <Icon className="h-5 w-5 text-pf-purple" />
        </div>

        <div
          className={`flex items-center gap-1 text-[10px] font-semibold ${
            positive ? "text-pf-green" : "text-red-500"
          }`}
        >
          {positive ? (
            <ArrowUpRight className="h-3 w-3" />
          ) : (
            <ArrowDownRight className="h-3 w-3" />
          )}

          {change}
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-500">{label}</p>

      <p className="mt-1 font-serif text-2xl text-pf-purple-dark">
        {value}
      </p>

      <p className="mt-1 text-[10px] text-gray-400">
        {description}
      </p>
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
  change,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pf-purple-light">
          <Icon className="h-4 w-4 text-pf-purple" />
        </div>

        <span className="text-[10px] font-semibold text-pf-green">
          {change}
        </span>
      </div>

      <p className="mt-4 text-[11px] text-gray-400">
        {label}
      </p>

      <p className="mt-1 font-serif text-xl text-pf-purple-dark">
        {value}
      </p>
    </div>
  );
}