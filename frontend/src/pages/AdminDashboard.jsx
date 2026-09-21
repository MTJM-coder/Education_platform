import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Coins,
  GraduationCap,
  UserCheck,
  UsersRound,
  BookOpen
} from "lucide-react";
import SidebarAdmin from "../components/admin/SidebarAdmin";

const recentTeachers = [
  {
    name: "Xavier Ndi",
    subject: "Mathematics",
    location: "Douala",
    status: "Pending",
  },
  {
    name: "Acha Marie",
    subject: "English",
    location: "Yaoundé",
    status: "Pending",
  },
  {
    name: "Bih Patrick",
    subject: "Computer Science",
    location: "Douala",
    status: "Validated",
  },
  {
    name: "Nfor Daniel",
    subject: "Physics",
    location: "Buea",
    status: "Pending",
  },
];

const recentActivities = [
  {
    title: "New teacher registration",
    detail: "Xavier Ndi submitted his documents",
    time: "12 min ago",
    type: "teacher",
  },
  {
    title: "Payment received",
    detail: "45,000 FCFA tutoring payment",
    time: "35 min ago",
    type: "payment",
  },
  {
    title: "New tutoring request",
    detail: "A parent requested Mathematics lessons",
    time: "1 hour ago",
    type: "request",
  },
  {
    title: "Dispute opened",
    detail: "Session #1042 requires attention",
    time: "2 hours ago",
    type: "dispute",
  },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#FAF9FB] font-sans text-[#302C38]">
      <SidebarAdmin activeItem="Dashboard" />

      <main className="lg:ml-64">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-5 sm:px-8">
          <div>
            <p className="hidden text-sm text-gray-500 lg:block">
              Admin Dashboard
            </p>
          </div>

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
          <section className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-pf-purple">
                OVERVIEW
              </p>

              <h1 className="mt-1 font-serif text-2xl font-medium text-pf-purple-dark sm:text-3xl">
                Welcome back, Admin
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Here is what is happening across the platform today.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-gray-500">
              September 21, 2026
            </div>
          </section>

          {/* Main statistics */}
          <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={UsersRound}
              label="Total users"
              value="1,284"
              change="+12.5%"
              description="vs last month"
            />

            <StatCard
              icon={UserCheck}
              label="Active teachers"
              value="186"
              change="+8.2%"
              description="vs last month"
            />

            <StatCard
              icon={GraduationCap}
              label="Active learners"
              value="742"
              change="+14.3%"
              description="vs last month"
            />

            <StatCard
              icon={Coins}
              label="Platform revenue"
              value="2.48M"
              suffix=" FCFA"
              change="+18.6%"
              description="this month"
            />
          </section>

          {/* Alerts */}
          <section className="mt-6 grid gap-4 md:grid-cols-3">
            <AlertCard
              icon={Clock3}
              title="Teacher validation"
              value="12"
              description="teachers waiting for validation"
              href="/admin-teachers"
            />

            <AlertCard
              icon={AlertTriangle}
              title="Open disputes"
              value="4"
              description="disputes require attention"
              href="/admin-disputes"
              danger
            />

            <AlertCard
              icon={CheckCircle2}
              title="Tutoring requests"
              value="28"
              description="requests awaiting assignment"
              href="/admin-tutoring"
            />
          </section>

          {/* Main grid */}
          <section className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
            {/* Revenue */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-serif text-xl text-pf-purple-dark">
                    Platform overview
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Activity and revenue for the current month.
                  </p>
                </div>

                <div className="rounded-lg bg-pf-purple-light p-2.5">
                  <BarChart3 className="h-5 w-5 text-pf-purple" />
                </div>
              </div>

              {/* Revenue number */}
              <div className="mt-6 flex items-end gap-2">
                <span className="font-serif text-3xl text-pf-purple-dark">
                  2.48M
                </span>

                <span className="mb-1 text-xs text-gray-400">
                  FCFA
                </span>

                <span className="mb-1 ml-2 rounded-full bg-green-50 px-2 py-1 text-[10px] font-semibold text-green-600">
                  +18.6%
                </span>
              </div>

              {/* Simple chart */}
              <div className="mt-6">
                <div className="flex h-44 items-end gap-2">
                  {[42, 55, 48, 68, 60, 76, 65, 82, 72, 88, 78, 95].map(
                    (height, index) => (
                      <div
                        key={index}
                        className="flex flex-1 items-end"
                      >
                        <div
                          className="w-full rounded-t-md bg-pf-purple/20 transition hover:bg-pf-purple/40"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                    )
                  )}
                </div>

                <div className="mt-2 flex justify-between text-[10px] text-gray-400">
                  <span>Oct</span>
                  <span>Nov</span>
                  <span>Dec</span>
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Aug</span>
                  <span>Sep</span>
                </div>
              </div>
            </section>

            {/* User distribution */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-serif text-xl text-pf-purple-dark">
                    Users
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Platform user distribution.
                  </p>
                </div>

                <UsersRound className="h-5 w-5 text-pf-purple" />
              </div>

              <div className="mt-6 space-y-5">
                <UserDistribution
                  label="Learners"
                  value="742"
                  percentage="58%"
                  width="58%"
                />

                <UserDistribution
                  label="Teachers"
                  value="186"
                  percentage="15%"
                  width="15%"
                />

                <UserDistribution
                  label="Parents"
                  value="324"
                  percentage="25%"
                  width="25%"
                />

                <UserDistribution
                  label="Admin Staff"
                  value="32"
                  percentage="2%"
                  width="2%"
                />
              </div>

              <a
                href="/admin-users"
                className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 text-xs font-semibold text-pf-purple"
              >
                Manage users

                <ChevronRight className="h-4 w-4" />
              </a>
            </section>
          </section>

          {/* Bottom grid */}
          <section className="mt-6 grid gap-6 xl:grid-cols-2">
            {/* Teachers */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-xl text-pf-purple-dark">
                    Recent teacher registrations
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Teachers recently registered on the platform.
                  </p>
                </div>

                <a
                  href="/admin-teachers"
                  className="text-xs font-semibold text-pf-purple hover:underline"
                >
                  View all
                </a>
              </div>

              <div className="mt-5 divide-y divide-gray-100">
                {recentTeachers.map((teacher) => (
                  <div
                    key={teacher.name}
                    className="flex items-center gap-3 py-3.5"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pf-purple-light text-xs font-semibold text-pf-purple">
                      {teacher.name
                        .split(" ")
                        .map((name) => name[0])
                        .join("")}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-pf-purple-dark">
                        {teacher.name}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-500">
                        {teacher.subject} · {teacher.location}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-medium ${
                        teacher.status === "Validated"
                          ? "bg-green-50 text-green-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {teacher.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Activity */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-xl text-pf-purple-dark">
                    Recent activity
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Latest events across the platform.
                  </p>
                </div>

                <a
                  href="/admin-analytics"
                  className="text-xs font-semibold text-pf-purple hover:underline"
                >
                  View reports
                </a>
              </div>

              <div className="mt-5 space-y-4">
                {recentActivities.map((activity, index) => (
                  <ActivityItem
                    key={index}
                    activity={activity}
                  />
                ))}
              </div>
            </section>
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
  suffix = "",
  change,
  description,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pf-purple-light">
          <Icon className="h-5 w-5 text-pf-purple" />
        </div>

        <span className="flex items-center gap-1 text-[10px] font-semibold text-green-600">
          <ArrowUpRight className="h-3 w-3" />
          {change}
        </span>
      </div>

      <p className="mt-5 text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 font-serif text-2xl text-pf-purple-dark">
        {value}
        {suffix && (
          <span className="text-sm text-gray-400">
            {suffix}
          </span>
        )}
      </p>

      <p className="mt-1 text-[10px] text-gray-400">
        {description}
      </p>
    </div>
  );
}

/* ========================================================= */
/* ALERT CARD                                                  */
/* ========================================================= */

function AlertCard({
  icon: Icon,
  title,
  value,
  description,
  href,
  danger = false,
}) {
  return (
    <a
      href={href}
      className="group rounded-2xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            danger ? "bg-red-50" : "bg-pf-purple-light"
          }`}
        >
          <Icon
            className={`h-5 w-5 ${
              danger ? "text-red-500" : "text-pf-purple"
            }`}
          />
        </div>

        <ChevronRight className="h-4 w-4 text-gray-300 transition group-hover:text-pf-purple" />
      </div>

      <p className="mt-4 text-xs text-gray-500">
        {title}
      </p>

      <p className="mt-1 font-serif text-2xl text-pf-purple-dark">
        {value}
      </p>

      <p className="mt-1 text-[11px] text-gray-400">
        {description}
      </p>
    </a>
  );
}

/* ========================================================= */
/* USER DISTRIBUTION                                           */
/* ========================================================= */

function UserDistribution({
  label,
  value,
  percentage,
  width,
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {label}
        </span>

        <span className="text-xs font-semibold text-pf-purple-dark">
          {value}{" "}
          <span className="font-normal text-gray-400">
            ({percentage})
          </span>
        </span>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-pf-purple"
          style={{ width }}
        />
      </div>
    </div>
  );
}

/* ========================================================= */
/* ACTIVITY ITEM                                               */
/* ========================================================= */

function ActivityItem({ activity }) {
  const iconMap = {
    teacher: UserCheck,
    payment: Coins,
    request: BookOpen,
    dispute: AlertTriangle,
  };

  const Icon = iconMap[activity.type] || BarChart3;

  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-pf-purple-light">
        <Icon className="h-4 w-4 text-pf-purple" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-pf-purple-dark">
          {activity.title}
        </p>

        <p className="mt-0.5 text-xs text-gray-500">
          {activity.detail}
        </p>
      </div>

      <span className="shrink-0 text-[10px] text-gray-400">
        {activity.time}
      </span>
    </div>
  );
}