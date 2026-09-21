import { useMemo, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Filter,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  UserRound,
  UsersRound,
  XCircle,
} from "lucide-react";
import SidebarAdmin from "../components/admin/SidebarAdmin";

const tutoringAssignments = [
  {
    id: "TUT-001",
    teacher: "Xavier Ndi",
    student: "Junior Mbarga",
    parent: "Marie Mbarga",
    subject: "Mathematics",
    level: "Form 3",
    location: "Bonamoussadi",
    frequency: "3 sessions / week",
    rate: "4,000 FCFA / session",
    sessions: 12,
    completed: 9,
    startDate: "02 Sept. 2026",
    status: "Active",
  },
  {
    id: "TUT-002",
    teacher: "Marie Acha",
    student: "Sarah Ngo",
    parent: "Paul Ngo",
    subject: "English",
    level: "Class 6",
    location: "Akwa",
    frequency: "2 sessions / week",
    rate: "3,500 FCFA / session",
    sessions: 8,
    completed: 6,
    startDate: "05 Sept. 2026",
    status: "Active",
  },
  {
    id: "TUT-003",
    teacher: "Patrick Bih",
    student: "Kevin Tamba",
    parent: "Jean Tamba",
    subject: "Computer Science",
    level: "Form 2",
    location: "Makepe",
    frequency: "2 sessions / week",
    rate: "4,500 FCFA / session",
    sessions: 10,
    completed: 4,
    startDate: "09 Sept. 2026",
    status: "Active",
  },
  {
    id: "TUT-004",
    teacher: "Daniel Nfor",
    student: "Ashley Fom",
    parent: "Grace Fom",
    subject: "Physics",
    level: "Form 5",
    location: "Deido",
    frequency: "3 sessions / week",
    rate: "5,000 FCFA / session",
    sessions: 12,
    completed: 0,
    startDate: "20 Sept. 2026",
    status: "Pending",
  },
  {
    id: "TUT-005",
    teacher: "Claudine Ngo",
    student: "David Ekane",
    parent: "Paul Ekane",
    subject: "Mathematics",
    level: "Class 5",
    location: "Bali",
    frequency: "2 sessions / week",
    rate: "3,000 FCFA / session",
    sessions: 8,
    completed: 0,
    startDate: "19 Sept. 2026",
    status: "Pending",
  },
  {
    id: "TUT-006",
    teacher: "Jean Tamba",
    student: "Melissa Etoa",
    parent: "Rose Etoa",
    subject: "Biology",
    level: "Form 4",
    location: "Bonapriso",
    frequency: "2 sessions / week",
    rate: "4,500 FCFA / session",
    sessions: 8,
    completed: 7,
    startDate: "25 Aug. 2026",
    status: "Completed",
  },
  {
    id: "TUT-007",
    teacher: "Xavier Ndi",
    student: "Brenda Fokam",
    parent: "Alice Fokam",
    subject: "Mathematics",
    level: "Form 2",
    location: "Logpom",
    frequency: "2 sessions / week",
    rate: "4,000 FCFA / session",
    sessions: 10,
    completed: 3,
    startDate: "15 Aug. 2026",
    status: "Cancelled",
  },
];

const statusFilters = [
  "All",
  "Active",
  "Pending",
  "Completed",
  "Cancelled",
];

const subjects = [
  "All subjects",
  "Mathematics",
  "Physics",
  "English",
  "Computer Science",
  "Biology",
];

export default function AdminTutoringPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [subjectFilter, setSubjectFilter] =
    useState("All subjects");
  const [openMenu, setOpenMenu] = useState(null);

  const filteredTutoring = useMemo(() => {
    const query = search.toLowerCase().trim();

    return tutoringAssignments.filter((tutoring) => {
      const matchesSearch =
        !query ||
        tutoring.id.toLowerCase().includes(query) ||
        tutoring.teacher.toLowerCase().includes(query) ||
        tutoring.student.toLowerCase().includes(query) ||
        tutoring.parent.toLowerCase().includes(query) ||
        tutoring.subject.toLowerCase().includes(query) ||
        tutoring.location.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        tutoring.status === statusFilter;

      const matchesSubject =
        subjectFilter === "All subjects" ||
        tutoring.subject === subjectFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesSubject
      );
    });
  }, [search, statusFilter, subjectFilter]);

  const activeCount = tutoringAssignments.filter(
    (item) => item.status === "Active"
  ).length;

  const pendingCount = tutoringAssignments.filter(
    (item) => item.status === "Pending"
  ).length;

  const completedCount = tutoringAssignments.filter(
    (item) => item.status === "Completed"
  ).length;

  const totalSessions = tutoringAssignments.reduce(
    (total, item) => total + item.sessions,
    0
  );

  const completedSessions = tutoringAssignments.reduce(
    (total, item) => total + item.completed,
    0
  );

  return (
    <div className="min-h-screen bg-[#FAF9FB] font-sans text-[#302C38]">
      <SidebarAdmin activeItem="Tutoring" />

      <main className="lg:ml-64">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-5 sm:px-8">
          <p className="hidden text-sm text-gray-500 lg:block">
            Tutoring
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
          <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-pf-purple">
                TUTORING MANAGEMENT
              </p>

              <h1 className="mt-1 font-serif text-2xl font-medium text-pf-purple-dark sm:text-3xl">
                Tutoring
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-gray-500">
                Manage teacher-student assignments, tutoring
                requests and the progress of active tutoring
                relationships.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-pf-purple px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-pf-purple-dark"
            >
              <Plus className="h-4 w-4" />
              Create assignment
            </button>
          </section>

          {/* Statistics */}
          <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={UsersRound}
              label="Active tutoring"
              value={activeCount}
            />

            <StatCard
              icon={Clock3}
              label="Pending requests"
              value={pendingCount}
            />

            <StatCard
              icon={CheckCircle2}
              label="Completed"
              value={completedCount}
            />

            <StatCard
              icon={CalendarDays}
              label="Sessions completed"
              value={`${completedSessions}/${totalSessions}`}
            />
          </section>

          {/* Pending requests */}
          {pendingCount > 0 && (
            <section className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
                    <Clock3 className="h-5 w-5 text-amber-600" />
                  </div>

                  <div>
                    <h2 className="font-serif text-lg text-pf-purple-dark">
                      Tutoring requests awaiting action
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-gray-600">
                      {pendingCount} tutoring request
                      {pendingCount > 1 ? "s" : ""} need
                      review or teacher assignment.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStatusFilter("Pending")}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-amber-700 hover:underline"
                >
                  Review requests
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </section>
          )}

          {/* Tutoring directory */}
          <section className="mt-7 rounded-2xl border border-gray-200 bg-white">
            {/* Toolbar */}
            <div className="border-b border-gray-100 p-5 sm:p-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <h2 className="font-serif text-xl text-pf-purple-dark">
                    Tutoring assignments
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {filteredTutoring.length} assignment
                    {filteredTutoring.length !== 1
                      ? "s"
                      : ""}{" "}
                    displayed
                  </p>
                </div>

                {/* Search */}
                <div className="relative w-full xl:w-80">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search teacher, student..."
                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-pf-purple focus:ring-2 focus:ring-pf-purple/10"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="mt-5 flex flex-wrap items-center gap-2">
                {statusFilters.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      statusFilter === status
                        ? "bg-pf-purple text-white"
                        : "bg-[#FAF9FB] text-gray-500 hover:bg-pf-purple-light hover:text-pf-purple"
                    }`}
                  >
                    {status}
                  </button>
                ))}

                <div className="ml-auto flex items-center gap-2">
                  <Filter className="hidden h-3.5 w-3.5 text-gray-400 sm:block" />

                  <select
                    value={subjectFilter}
                    onChange={(event) =>
                      setSubjectFilter(event.target.value)
                    }
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600 outline-none focus:border-pf-purple"
                  >
                    {subjects.map((subject) => (
                      <option
                        key={subject}
                        value={subject}
                      >
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[1150px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#FCFBFD] text-left">
                    <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Student
                    </th>

                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Teacher
                    </th>

                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Subject
                    </th>

                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Location
                    </th>

                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Schedule
                    </th>

                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Progress
                    </th>

                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Status
                    </th>

                    <th className="px-6 py-3 text-right text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTutoring.map((item) => (
                    <TutoringRow
                      key={item.id}
                      item={item}
                      openMenu={openMenu}
                      setOpenMenu={setOpenMenu}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="divide-y divide-gray-100 md:hidden">
              {filteredTutoring.map((item) => (
                <TutoringMobileCard
                  key={item.id}
                  item={item}
                  openMenu={openMenu}
                  setOpenMenu={setOpenMenu}
                />
              ))}
            </div>

            {/* Empty state */}
            {filteredTutoring.length === 0 && (
              <div className="py-16 text-center">
                <BookOpen className="mx-auto h-8 w-8 text-gray-300" />

                <h3 className="mt-4 font-serif text-lg text-pf-purple-dark">
                  No tutoring assignments found
                </h3>

                <p className="mt-1 text-sm text-gray-400">
                  Try changing your search or filters.
                </p>
              </div>
            )}

            {/* Footer */}
            {filteredTutoring.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-5 py-4 sm:px-6">
                <p className="text-xs text-gray-400">
                  Showing {filteredTutoring.length} of{" "}
                  {tutoringAssignments.length} assignments
                </p>

                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-pf-purple hover:underline"
                >
                  View tutoring history
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </section>
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
/* DESKTOP ROW                                                 */
/* ========================================================= */

function TutoringRow({
  item,
  openMenu,
  setOpenMenu,
}) {
  const progress =
    item.sessions > 0
      ? Math.round(
          (item.completed / item.sessions) * 100
        )
      : 0;

  return (
    <tr className="border-b border-gray-100 last:border-0 hover:bg-[#FCFBFD]">
      {/* Student */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar
            name={item.student}
            variant="student"
          />

          <div>
            <p className="text-xs font-semibold text-pf-purple-dark">
              {item.student}
            </p>

            <p className="mt-1 text-[10px] text-gray-400">
              {item.id} · {item.level}
            </p>
          </div>
        </div>
      </td>

      {/* Teacher */}
      <td className="px-4 py-4">
        <p className="text-xs font-medium text-gray-600">
          {item.teacher}
        </p>

        <p className="mt-1 text-[10px] text-gray-400">
          Parent: {item.parent}
        </p>
      </td>

      {/* Subject */}
      <td className="px-4 py-4">
        <span className="rounded-full bg-pf-purple-light px-2.5 py-1 text-[10px] text-pf-purple">
          {item.subject}
        </span>
      </td>

      {/* Location */}
      <td className="px-4 py-4">
        <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
          <MapPin className="h-3.5 w-3.5" />
          {item.location}
        </span>
      </td>

      {/* Schedule */}
      <td className="px-4 py-4">
        <p className="text-xs text-gray-600">
          {item.frequency}
        </p>

        <p className="mt-1 text-[10px] text-gray-400">
          From {item.startDate}
        </p>
      </td>

      {/* Progress */}
      <td className="px-4 py-4">
        <div className="w-28">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400">
              {item.completed}/{item.sessions}
            </span>

            <span className="text-[10px] font-semibold text-pf-purple">
              {progress}%
            </span>
          </div>

          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-pf-purple"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-4">
        <StatusBadge status={item.status} />
      </td>

      {/* Action */}
      <td className="relative px-6 py-4 text-right">
        <button
          type="button"
          onClick={() =>
            setOpenMenu(
              openMenu === item.id
                ? null
                : item.id
            )
          }
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-pf-purple"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>

        {openMenu === item.id && (
          <ActionMenu item={item} />
        )}
      </td>
    </tr>
  );
}

/* ========================================================= */
/* MOBILE CARD                                                 */
/* ========================================================= */

function TutoringMobileCard({
  item,
  openMenu,
  setOpenMenu,
}) {
  const progress =
    item.sessions > 0
      ? Math.round(
          (item.completed / item.sessions) * 100
        )
      : 0;

  return (
    <div className="relative p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar
            name={item.student}
            variant="student"
          />

          <div>
            <p className="text-xs font-semibold text-pf-purple-dark">
              {item.student}
            </p>

            <p className="mt-1 text-[10px] text-gray-400">
              {item.id} · {item.level}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            setOpenMenu(
              openMenu === item.id
                ? null
                : item.id
            )
          }
          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4">
        <span className="rounded-full bg-pf-purple-light px-2.5 py-1 text-[10px] text-pf-purple">
          {item.subject}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <MiniInfo
          icon={UserRound}
          label="Teacher"
          value={item.teacher}
        />

        <MiniInfo
          icon={MapPin}
          label="Location"
          value={item.location}
        />

        <MiniInfo
          icon={CalendarDays}
          label="Schedule"
          value={item.frequency}
        />

        <MiniInfo
          icon={BookOpen}
          label="Rate"
          value={item.rate}
        />
      </div>

      <div className="mt-4 rounded-xl bg-[#FAF9FB] p-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-gray-400">
            Session progress
          </span>

          <span className="text-xs font-semibold text-pf-purple">
            {item.completed}/{item.sessions}
          </span>
        </div>

        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-pf-purple"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <StatusBadge status={item.status} />

        <span className="text-[10px] text-gray-400">
          From {item.startDate}
        </span>
      </div>

      {openMenu === item.id && (
        <ActionMenu item={item} mobile />
      )}
    </div>
  );
}

/* ========================================================= */
/* MINI INFO                                                    */
/* ========================================================= */

function MiniInfo({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-lg bg-[#FAF9FB] p-2.5">
      <div className="flex items-center gap-1.5">
        <Icon className="h-3 w-3 text-pf-purple" />

        <p className="text-[10px] text-gray-400">
          {label}
        </p>
      </div>

      <p className="mt-1 truncate text-xs font-medium text-gray-600">
        {value}
      </p>
    </div>
  );
}

/* ========================================================= */
/* AVATAR                                                       */
/* ========================================================= */

function Avatar({ name }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pf-purple-light text-xs font-semibold text-pf-purple">
      {initials}
    </div>
  );
}

/* ========================================================= */
/* STATUS                                                       */
/* ========================================================= */

function StatusBadge({ status }) {
  const config = {
    Active: {
      icon: CheckCircle2,
      className: "bg-green-50 text-green-600",
    },

    Pending: {
      icon: Clock3,
      className: "bg-amber-50 text-amber-600",
    },

    Completed: {
      icon: CheckCircle2,
      className: "bg-blue-50 text-blue-600",
    },

    Cancelled: {
      icon: XCircle,
      className: "bg-red-50 text-red-600",
    },
  };

  const current =
    config[status] || config.Pending;

  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${current.className}`}
    >
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}

/* ========================================================= */
/* ACTION MENU                                                  */
/* ========================================================= */

function ActionMenu({
  item,
  mobile = false,
}) {
  return (
    <div
      className={`absolute z-30 w-52 rounded-xl border border-gray-200 bg-white p-1.5 text-left shadow-lg ${
        mobile
          ? "right-5 top-16"
          : "right-6 top-12"
      }`}
    >
      <a
        href={`/admin-tutoring/${item.id}`}
        className="flex items-center justify-between rounded-lg px-3 py-2 text-xs text-gray-600 hover:bg-pf-purple-light hover:text-pf-purple"
      >
        View tutoring
        <ChevronRight className="h-3.5 w-3.5" />
      </a>

      <button
        type="button"
        className="w-full rounded-lg px-3 py-2 text-left text-xs text-gray-600 hover:bg-gray-50"
      >
        View student
      </button>

      <button
        type="button"
        className="w-full rounded-lg px-3 py-2 text-left text-xs text-gray-600 hover:bg-gray-50"
      >
        View teacher
      </button>

      {item.status === "Pending" && (
        <>
          <button
            type="button"
            className="w-full rounded-lg px-3 py-2 text-left text-xs text-green-600 hover:bg-green-50"
          >
            Approve assignment
          </button>

          <button
            type="button"
            className="w-full rounded-lg px-3 py-2 text-left text-xs text-red-500 hover:bg-red-50"
          >
            Reject request
          </button>
        </>
      )}

      {item.status === "Active" && (
        <button
          type="button"
          className="w-full rounded-lg px-3 py-2 text-left text-xs text-red-500 hover:bg-red-50"
        >
          Cancel tutoring
        </button>
      )}
    </div>
  );
}