import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Eye,
  FileWarning,
  MessageSquare,
  Search,
  ShieldAlert,
  UserRound,
  XCircle,
} from "lucide-react";
import SidebarAdmin from "../components/admin/SidebarAdmin";

const disputes = [
  {
    id: "DSP-001",
    type: "Tutoring session",
    title: "Teacher did not attend the scheduled session",
    reportedBy: "Marie N.",
    against: "Mr. Xavier N.",
    role: "Parent",
    date: "18 Sept. 2026",
    priority: "High",
    status: "Open",
    description:
      "The teacher did not attend the scheduled mathematics session and did not notify the parent.",
    evidence: 2,
  },
  {
    id: "DSP-002",
    type: "Payment",
    title: "Payment charged but session was cancelled",
    reportedBy: "Jean M.",
    against: "Platform",
    role: "Parent",
    date: "17 Sept. 2026",
    priority: "High",
    status: "Under Review",
    description:
      "The parent reports that a payment was made for a session that was later cancelled.",
    evidence: 3,
  },
  {
    id: "DSP-003",
    type: "Tutoring quality",
    title: "Parent reports poor teaching quality",
    reportedBy: "Pauline T.",
    against: "Mrs. Nfor",
    role: "Parent",
    date: "16 Sept. 2026",
    priority: "Medium",
    status: "Under Review",
    description:
      "The parent believes the teaching quality during recent sessions did not meet expectations.",
    evidence: 1,
  },
  {
    id: "DSP-004",
    type: "Attendance",
    title: "Student repeatedly absent from sessions",
    reportedBy: "Mr. Bih",
    against: "David K.",
    role: "Teacher",
    date: "15 Sept. 2026",
    priority: "Medium",
    status: "Open",
    description:
      "The teacher reported several unexplained student absences.",
    evidence: 2,
  },
  {
    id: "DSP-005",
    type: "Payment",
    title: "Teacher payout amount disputed",
    reportedBy: "Mrs. Acha",
    against: "Platform",
    role: "Teacher",
    date: "13 Sept. 2026",
    priority: "Low",
    status: "Resolved",
    description:
      "The teacher requested clarification regarding the amount received after platform commission.",
    evidence: 4,
  },
  {
    id: "DSP-006",
    type: "Behaviour",
    title: "Inappropriate communication reported",
    reportedBy: "Kevin S.",
    against: "Teacher account",
    role: "Student",
    date: "11 Sept. 2026",
    priority: "High",
    status: "Resolved",
    description:
      "A student reported inappropriate communication during a tutoring interaction.",
    evidence: 5,
  },
  {
    id: "DSP-007",
    type: "Tutoring session",
    title: "Session marked completed incorrectly",
    reportedBy: "Sarah M.",
    against: "Mr. Tchana",
    role: "Parent",
    date: "09 Sept. 2026",
    priority: "Low",
    status: "Closed",
    description:
      "The parent disputes the completion status of a tutoring session.",
    evidence: 1,
  },
];

const disputeTypes = [
  "All types",
  "Tutoring session",
  "Payment",
  "Tutoring quality",
  "Attendance",
  "Behaviour",
];

const statuses = [
  "All statuses",
  "Open",
  "Under Review",
  "Resolved",
  "Closed",
];

const priorities = [
  "All priorities",
  "High",
  "Medium",
  "Low",
];

export default function AdminDisputesPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All types");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [priorityFilter, setPriorityFilter] =
    useState("All priorities");
  const [openMenu, setOpenMenu] = useState(null);

  const filteredDisputes = useMemo(() => {
    const query = search.toLowerCase().trim();

    return disputes.filter((dispute) => {
      const matchesSearch =
        !query ||
        dispute.id.toLowerCase().includes(query) ||
        dispute.title.toLowerCase().includes(query) ||
        dispute.reportedBy.toLowerCase().includes(query) ||
        dispute.against.toLowerCase().includes(query);

      const matchesType =
        typeFilter === "All types" ||
        dispute.type === typeFilter;

      const matchesStatus =
        statusFilter === "All statuses" ||
        dispute.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All priorities" ||
        dispute.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [
    search,
    typeFilter,
    statusFilter,
    priorityFilter,
  ]);

  const openDisputes = disputes.filter(
    (item) => item.status === "Open"
  ).length;

  const underReview = disputes.filter(
    (item) => item.status === "Under Review"
  ).length;

  const resolvedDisputes = disputes.filter(
    (item) =>
      item.status === "Resolved" ||
      item.status === "Closed"
  ).length;

  const highPriority = disputes.filter(
    (item) => item.priority === "High"
  ).length;

  return (
    <div className="min-h-screen bg-[#FAF9FB] font-sans text-[#302C38]">
      <SidebarAdmin activeItem="Disputes" />

      <main className="lg:ml-64">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-5 sm:px-8">
          <p className="hidden text-sm text-gray-500 lg:block">
            Disputes
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
                  PLATFORM RESOLUTION
                </p>

                <h1 className="mt-1 font-serif text-2xl font-medium text-pf-purple-dark sm:text-3xl">
                  Disputes
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-gray-500">
                  Review, investigate and resolve disputes between
                  learners, parents, teachers and the platform.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
                <ShieldAlert className="h-4 w-4 text-pf-purple" />

                <span className="text-xs font-medium text-gray-600">
                  {highPriority} high priority
                </span>
              </div>
            </div>
          </section>

          {/* Statistics */}
          <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={AlertTriangle}
              label="Open disputes"
              value={openDisputes}
              tone="warning"
            />

            <StatCard
              icon={Clock3}
              label="Under review"
              value={underReview}
              tone="purple"
            />

            <StatCard
              icon={CheckCircle2}
              label="Resolved"
              value={resolvedDisputes}
              tone="green"
            />

            <StatCard
              icon={FileWarning}
              label="High priority"
              value={highPriority}
              tone="red"
            />
          </section>

          {/* Main panel */}
          <section className="mt-7 rounded-2xl border border-gray-200 bg-white">
            {/* Toolbar */}
            <div className="border-b border-gray-100 p-5 sm:p-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <h2 className="font-serif text-xl text-pf-purple-dark">
                    Dispute cases
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {filteredDisputes.length} dispute
                    {filteredDisputes.length !== 1
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
                    placeholder="Search disputes..."
                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-pf-purple focus:ring-2 focus:ring-pf-purple/10"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="mt-5 flex flex-wrap gap-2">
                <FilterSelect
                  value={typeFilter}
                  onChange={setTypeFilter}
                  options={disputeTypes}
                />

                <FilterSelect
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={statuses}
                />

                <FilterSelect
                  value={priorityFilter}
                  onChange={setPriorityFilter}
                  options={priorities}
                />
              </div>
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[1050px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#FCFBFD] text-left">
                    <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Dispute
                    </th>

                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Reported by
                    </th>

                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Against
                    </th>

                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Date
                    </th>

                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Priority
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
                  {filteredDisputes.map((dispute) => (
                    <DisputeRow
                      key={dispute.id}
                      dispute={dispute}
                      openMenu={openMenu}
                      setOpenMenu={setOpenMenu}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="divide-y divide-gray-100 md:hidden">
              {filteredDisputes.map((dispute) => (
                <DisputeMobileCard
                  key={dispute.id}
                  dispute={dispute}
                  openMenu={openMenu}
                  setOpenMenu={setOpenMenu}
                />
              ))}
            </div>

            {/* Empty */}
            {filteredDisputes.length === 0 && (
              <div className="py-16 text-center">
                <AlertTriangle className="mx-auto h-8 w-8 text-gray-300" />

                <h3 className="mt-4 font-serif text-lg text-pf-purple-dark">
                  No disputes found
                </h3>

                <p className="mt-1 text-sm text-gray-400">
                  Try changing your search or filters.
                </p>
              </div>
            )}

            {/* Footer */}
            {filteredDisputes.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-5 py-4 sm:px-6">
                <p className="text-xs text-gray-400">
                  Showing {filteredDisputes.length} of{" "}
                  {disputes.length} disputes
                </p>

                <p className="text-xs text-gray-400">
                  Review cases carefully before taking action.
                </p>
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

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}) {
  const tones = {
    warning: "bg-amber-50 text-amber-600",
    purple: "bg-pf-purple-light text-pf-purple",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-500",
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            tones[tone]
          }`}
        >
          <Icon className="h-5 w-5" />
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
/* FILTER SELECT                                               */
/* ========================================================= */

function FilterSelect({
  value,
  onChange,
  options,
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-9 text-xs text-gray-600 outline-none transition focus:border-pf-purple"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
    </div>
  );
}

/* ========================================================= */
/* DESKTOP ROW                                                 */
/* ========================================================= */

function DisputeRow({
  dispute,
  openMenu,
  setOpenMenu,
}) {
  return (
    <tr className="border-b border-gray-100 last:border-0 hover:bg-[#FCFBFD]">
      <td className="px-6 py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>

          <div className="max-w-[310px]">
            <p className="text-sm font-medium text-pf-purple-dark">
              {dispute.title}
            </p>

            <div className="mt-1 flex items-center gap-2">
              <span className="text-[10px] font-semibold text-pf-purple">
                {dispute.id}
              </span>

              <span className="text-[10px] text-gray-400">
                {dispute.type}
              </span>
            </div>
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <PersonCell
          name={dispute.reportedBy}
          role={dispute.role}
        />
      </td>

      <td className="px-4 py-4">
        <p className="text-xs font-medium text-pf-purple-dark">
          {dispute.against}
        </p>
      </td>

      <td className="px-4 py-4">
        <p className="text-xs text-gray-500">
          {dispute.date}
        </p>
      </td>

      <td className="px-4 py-4">
        <PriorityBadge priority={dispute.priority} />
      </td>

      <td className="px-4 py-4">
        <StatusBadge status={dispute.status} />
      </td>

      <td className="relative px-6 py-4 text-right">
        <button
          type="button"
          onClick={() =>
            setOpenMenu(
              openMenu === dispute.id
                ? null
                : dispute.id
            )
          }
          className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-pf-purple"
        >
          <MoreIcon />
        </button>

        {openMenu === dispute.id && (
          <ActionMenu dispute={dispute} />
        )}
      </td>
    </tr>
  );
}

/* ========================================================= */
/* MOBILE CARD                                                 */
/* ========================================================= */

function DisputeMobileCard({
  dispute,
  openMenu,
  setOpenMenu,
}) {
  return (
    <div className="relative p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50">
          <AlertTriangle className="h-5 w-5 text-red-500" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-pf-purple-dark">
                {dispute.title}
              </p>

              <p className="mt-1 text-[10px] text-gray-400">
                {dispute.id} · {dispute.type}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setOpenMenu(
                  openMenu === dispute.id
                    ? null
                    : dispute.id
                )
              }
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
            >
              <MoreIcon />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <InfoBox
              label="Reported by"
              value={dispute.reportedBy}
            />

            <InfoBox
              label="Against"
              value={dispute.against}
            />

            <InfoBox
              label="Date"
              value={dispute.date}
            />

            <div className="rounded-lg bg-[#FAF9FB] p-2.5">
              <p className="text-[10px] text-gray-400">
                Priority
              </p>

              <div className="mt-1">
                <PriorityBadge
                  priority={dispute.priority}
                />
              </div>
            </div>
          </div>

          <div className="mt-3">
            <StatusBadge status={dispute.status} />
          </div>
        </div>
      </div>

      {openMenu === dispute.id && (
        <ActionMenu
          dispute={dispute}
          mobile
        />
      )}
    </div>
  );
}

/* ========================================================= */
/* PERSON                                                      */
/* ========================================================= */

function PersonCell({ name, role }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pf-purple-light">
        <UserRound className="h-4 w-4 text-pf-purple" />
      </div>

      <div>
        <p className="text-xs font-medium text-pf-purple-dark">
          {name}
        </p>

        <p className="text-[10px] text-gray-400">
          {role}
        </p>
      </div>
    </div>
  );
}

/* ========================================================= */
/* INFO BOX                                                     */
/* ========================================================= */

function InfoBox({ label, value }) {
  return (
    <div className="rounded-lg bg-[#FAF9FB] p-2.5">
      <p className="text-[10px] text-gray-400">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-medium text-pf-purple-dark">
        {value}
      </p>
    </div>
  );
}

/* ========================================================= */
/* PRIORITY                                                     */
/* ========================================================= */

function PriorityBadge({ priority }) {
  const styles = {
    High: "bg-red-50 text-red-500",
    Medium: "bg-amber-50 text-amber-600",
    Low: "bg-gray-100 text-gray-500",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${
        styles[priority]
      }`}
    >
      {priority}
    </span>
  );
}

/* ========================================================= */
/* STATUS                                                       */
/* ========================================================= */

function StatusBadge({ status }) {
  const config = {
    Open: {
      className: "bg-red-50 text-red-500",
      icon: AlertTriangle,
    },

    "Under Review": {
      className: "bg-amber-50 text-amber-600",
      icon: Clock3,
    },

    Resolved: {
      className: "bg-green-50 text-green-600",
      icon: CheckCircle2,
    },

    Closed: {
      className: "bg-gray-100 text-gray-500",
      icon: XCircle,
    },
  };

  const current = config[status] || config.Closed;
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
/* ACTION MENU                                                 */
/* ========================================================= */

function ActionMenu({
  dispute,
  mobile = false,
}) {
  return (
    <div
      className={`absolute z-30 w-52 rounded-xl border border-gray-200 bg-white p-1.5 text-left shadow-lg ${
        mobile
          ? "right-5 top-20"
          : "right-6 top-12"
      }`}
    >
      <a
        href={`/admin-disputes/${dispute.id}`}
        className="flex items-center justify-between rounded-lg px-3 py-2 text-xs text-gray-600 hover:bg-pf-purple-light hover:text-pf-purple"
      >
        View dispute
        <ChevronRight className="h-3.5 w-3.5" />
      </a>

      <button
        type="button"
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-gray-600 hover:bg-gray-50"
      >
        <Eye className="h-3.5 w-3.5" />
        Review case
      </button>

      <button
        type="button"
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-gray-600 hover:bg-gray-50"
      >
        <MessageSquare className="h-3.5 w-3.5" />
        Contact parties
      </button>

      {dispute.status !== "Resolved" &&
        dispute.status !== "Closed" && (
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-green-600 hover:bg-green-50"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Resolve dispute
          </button>
        )}
    </div>
  );
}

/* ========================================================= */
/* MORE ICON                                                    */
/* ========================================================= */

function MoreIcon() {
  return (
    <span className="flex gap-0.5">
      <span className="h-1 w-1 rounded-full bg-current" />
      <span className="h-1 w-1 rounded-full bg-current" />
      <span className="h-1 w-1 rounded-full bg-current" />
    </span>
  );
}