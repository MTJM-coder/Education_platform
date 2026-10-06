import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  Filter,
  GraduationCap,
  MapPin,
  MessageSquare,
  Plus,
  Search,
  X,
  XCircle,
} from "lucide-react";
import ParentSidebar from "../components/parent/ParentSidebar";

const initialRequests = [
  {
    id: "REQ-001",
    child: "Doly Junior",
    teacher: "Xavier Ndi",
    subject: "Mathematics",
    level: "Secondary",
    frequency: "Weekly",
    location: "Bonamoussadi, Douala",
    date: "20 Sep 2026",
    status: "Accepted",
    message: "Support needed with algebra and equations.",
  },
  {
    id: "REQ-002",
    child: "Mireille Djoumesse",
    teacher: "Nfor Grace",
    subject: "Physics",
    level: "Secondary",
    frequency: "Twice a week",
    location: "Makepe, Douala",
    date: "19 Sep 2026",
    status: "Pending",
    message: "Preparation for the next physics assessment.",
  },
  {
    id: "REQ-003",
    child: "Doly Junior",
    teacher: "Acha Mireille",
    subject: "English",
    level: "Secondary",
    frequency: "Weekly",
    location: "Akwa, Douala",
    date: "17 Sep 2026",
    status: "Completed",
    message: "Improve grammar and written expression.",
  },
  {
    id: "REQ-004",
    child: "Mireille Djoumesse",
    teacher: "Ngoe Laure",
    subject: "French",
    level: "Primary",
    frequency: "Weekly",
    location: "Bépanda, Douala",
    date: "15 Sep 2026",
    status: "Declined",
    message: "French reading and comprehension support.",
  },
];

const statusConfig = {
  Pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700",
    icon: Clock3,
  },
  Accepted: {
    label: "Accepted",
    className: "bg-green-50 text-green-700",
    icon: CheckCircle2,
  },
  Declined: {
    label: "Declined",
    className: "bg-red-50 text-red-700",
    icon: XCircle,
  },
  Completed: {
    label: "Completed",
    className: "bg-blue-50 text-blue-700",
    icon: CheckCircle2,
  },
};

function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.Pending;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
    >
      <Icon size={13} />
      {config.label}
    </span>
  );
}

function RequestDetailsModal({ request, onClose }) {
  if (!request) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-pf-purple">
              Tutoring request
            </p>

            <h2 className="mt-1 text-lg font-semibold text-gray-900">
              {request.id}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
            <div>
              <p className="text-xs text-gray-400">Status</p>
              <div className="mt-1">
                <StatusBadge status={request.status} />
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-gray-400">Request date</p>
              <p className="mt-1 text-sm font-medium text-gray-800">
                {request.date}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <InfoItem
              icon={GraduationCap}
              label="Child"
              value={request.child}
            />

            <InfoItem
              icon={GraduationCap}
              label="Teacher"
              value={request.teacher}
            />

            <InfoItem
              icon={MessageSquare}
              label="Subject"
              value={request.subject}
            />

            <InfoItem
              icon={CalendarDays}
              label="Frequency"
              value={request.frequency}
            />

            <InfoItem
              icon={MapPin}
              label="Location"
              value={request.location}
            />

            <InfoItem
              icon={Clock3}
              label="Level"
              value={request.level}
            />
          </div>

          <div className="rounded-xl border border-gray-100 p-4">
            <p className="text-xs font-medium text-gray-500">Message</p>
            <p className="mt-2 text-sm leading-6 text-gray-700">
              {request.message || "No message provided."}
            </p>
          </div>

          {request.status === "Accepted" && (
            <Link
              to={`/parent-schedule?request=${request.id}`}
              onClick={onClose}
              className="flex items-center justify-center gap-2 rounded-lg bg-pf-purple px-4 py-2.5 text-sm font-medium text-white hover:bg-pf-purple-dark"
            >
              View schedule
              <ArrowRight size={16} />
            </Link>
          )}

          {request.status === "Pending" && (
            <p className="rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
              The teacher has not responded to this request yet. You can
              continue checking its status from this page.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-gray-100 p-3">
      <div className="flex items-center gap-2 text-gray-400">
        <Icon size={15} />
        <span className="text-xs">{label}</span>
      </div>

      <p className="mt-2 text-sm font-medium text-gray-800">{value}</p>
    </div>
  );
}

function RequestRow({ request, onView }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 transition hover:border-purple-100">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pf-purple-light text-pf-purple">
            <GraduationCap size={19} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-medium text-gray-900">
                {request.subject}
              </h3>

              <span className="text-xs text-gray-400">
                {request.id}
              </span>
            </div>

            <p className="mt-1 text-sm text-gray-500">
              {request.teacher} · {request.child}
            </p>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <CalendarDays size={13} />
                {request.date}
              </span>

              <span className="flex items-center gap-1">
                <Clock3 size={13} />
                {request.frequency}
              </span>

              <span className="flex items-center gap-1">
                <MapPin size={13} />
                {request.location}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-3 lg:border-t-0 lg:pt-0">
          <StatusBadge status={request.status} />

          <button
            type="button"
            onClick={() => onView(request)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            <Eye size={15} />
            Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ParentTutoringRequestsPage() {
  const [requests, setRequests] = useState(initialRequests);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [childFilter, setChildFilter] = useState("All");
  const [selectedRequest, setSelectedRequest] = useState(null);

  const children = useMemo(() => {
    return ["All", ...new Set(requests.map((request) => request.child))];
  }, [requests]);

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesSearch =
        !query ||
        request.id.toLowerCase().includes(query) ||
        request.teacher.toLowerCase().includes(query) ||
        request.subject.toLowerCase().includes(query) ||
        request.child.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || request.status === statusFilter;

      const matchesChild =
        childFilter === "All" || request.child === childFilter;

      return matchesSearch && matchesStatus && matchesChild;
    });
  }, [requests, search, statusFilter, childFilter]);

  const stats = useMemo(
    () => ({
      total: requests.length,
      pending: requests.filter((item) => item.status === "Pending").length,
      accepted: requests.filter((item) => item.status === "Accepted").length,
      completed: requests.filter((item) => item.status === "Completed").length,
    }),
    [requests]
  );

  function clearFilters() {
    setSearch("");
    setStatusFilter("All");
    setChildFilter("All");
  }

  function cancelRequest(id) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this tutoring request?"
    );

    if (!confirmed) return;

    setRequests((current) =>
      current.map((request) =>
        request.id === id
          ? { ...request, status: "Declined" }
          : request
      )
    );

    setSelectedRequest(null);
  }

  return (
    <div className="min-h-screen bg-[#F8F8FA]">
      <ParentSidebar />

      <main className="min-h-screen lg:ml-64">
        <div className="mx-auto max-w-[1500px] px-5 py-6 sm:px-7 lg:px-10 lg:py-8">
          {/* HEADER */}
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Parent Portal / Tutoring Requests
              </p>

              <h1 className="mt-2 text-2xl font-semibold text-gray-900">
                Tutoring Requests
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Track the requests you have sent to teachers.
              </p>
            </div>

            <Link
              to="/search"
              className="flex w-fit items-center gap-2 rounded-lg bg-pf-purple px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-pf-purple-dark"
            >
              <Plus size={17} />
              Find a Teacher
            </Link>
          </header>

          {/* STATS */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total Requests"
              value={stats.total}
              description="All tutoring requests"
            />

            <StatCard
              label="Pending"
              value={stats.pending}
              description="Waiting for teacher response"
              icon={Clock3}
            />

            <StatCard
              label="Accepted"
              value={stats.accepted}
              description="Active tutoring requests"
              icon={CheckCircle2}
            />

            <StatCard
              label="Completed"
              value={stats.completed}
              description="Successfully completed"
              icon={CheckCircle2}
            />
          </section>

          {/* FILTERS */}
          <section className="mt-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Filter size={17} className="text-pf-purple" />
              <h2 className="text-sm font-semibold text-gray-800">
                Filter requests
              </h2>
            </div>

            <div className="grid gap-3 lg:grid-cols-[1fr_190px_210px_auto]">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by teacher, child, subject or ID..."
                  className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-10 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm text-gray-700 outline-none focus:border-purple-400"
              >
                <option value="All">All statuses</option>
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Completed">Completed</option>
                <option value="Declined">Declined</option>
              </select>

              <select
                value={childFilter}
                onChange={(event) => setChildFilter(event.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm text-gray-700 outline-none focus:border-purple-400"
              >
                {children.map((child) => (
                  <option key={child} value={child}>
                    {child === "All" ? "All children" : child}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={clearFilters}
                className="rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Reset
              </button>
            </div>
          </section>

          {/* RESULTS */}
          <section className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Your Requests
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  {filteredRequests.length} request
                  {filteredRequests.length !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>

            {filteredRequests.length > 0 ? (
              <div className="space-y-3">
                {filteredRequests.map((request) => (
                  <RequestRow
                    key={request.id}
                    request={request}
                    onView={setSelectedRequest}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
                <MessageSquare
                  size={40}
                  className="mx-auto text-gray-300"
                />

                <h2 className="mt-4 font-semibold text-gray-900">
                  No requests found
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                  No tutoring request matches your current filters.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Clear filters
                </button>
              </div>
            )}
          </section>

          {/* HELP CARD */}
          <section className="mt-6 rounded-xl border border-pf-purple-light bg-pf-purple-light/30 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  Need another teacher?
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Search our teacher network and send a new tutoring request.
                </p>
              </div>

              <Link
                to="/search"
                className="flex w-fit items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-semibold text-pf-purple shadow-sm hover:bg-gray-50"
              >
                Find a Teacher
                <ArrowRight size={14} />
              </Link>
            </div>
          </section>
        </div>
      </main>

      {selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  description,
  icon: Icon = MessageSquare,
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pf-purple-light text-pf-purple">
        <Icon size={19} />
      </div>

      <p className="mt-4 text-2xl font-semibold text-gray-900">{value}</p>

      <p className="mt-1 text-sm font-medium text-gray-700">{label}</p>

      <p className="mt-1 text-xs text-gray-400">{description}</p>
    </div>
  );
}