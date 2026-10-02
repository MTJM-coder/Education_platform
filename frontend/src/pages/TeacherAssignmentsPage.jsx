import {
  BookOpen,
  Banknote,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  Search,
  UserRound,
  UsersRound,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import TeacherSidebar from "../components/teacher/TeacherSidebar";
import { apiFetch } from "../lib/apiClient";

/* ========================================================= */
/* HELPERS                                                     */
/* ========================================================= */

// Accepte [..], { data: [..] } ou { data: { data: [..] } } selon apiFetch.
function toList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  return [];
}

function getUserName(user) {
  if (!user) return null;
  if (user.name) return user.name;
  const full = [user.first_name, user.last_name].filter(Boolean).join(" ");
  return full || null;
}

// Un learner "child" n'a peut-être pas de user : repli sur le parent.
function getLearnerName(learner) {
  const own = getUserName(learner?.user);
  if (own) return own;

  const parent = getUserName(learner?.parent_profile?.user);
  if (parent) return `Child of ${parent}`;

  return "Student";
}

function capitalize(value) {
  if (!value) return "";
  const text = String(value);
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatTime(value) {
  return value ? String(value).slice(0, 5) : null;
}

// Créneau SOUHAITÉ dans la demande (pas un planning confirmé).
function formatPreferredSlot(request) {
  const day = capitalize(request?.preferred_day);
  const start = formatTime(request?.preferred_start_time);
  const end = formatTime(request?.preferred_end_time);

  const time = start && end ? `${start} - ${end}` : start ?? "";
  return [day, time].filter(Boolean).join(" · ") || "—";
}

function formatPrice(value) {
  if (value === null || value === undefined || value === "") {
    return "Not set yet";
  }
  const number = Number(value);
  if (!Number.isFinite(number)) return "Not set yet";
  return `${number.toLocaleString("fr-FR")} FCFA`;
}

function formatDate(date) {
  if (!date) return null;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function sessionDay(session) {
  const raw = String(session.session_date ?? "").slice(0, 10);
  const value = new Date(`${raw}T00:00:00`);
  return Number.isNaN(value.getTime()) ? null : value;
}

const STATUS = {
  active: { label: "Active", style: "bg-green-50 text-green-700", icon: CheckCircle2 },
  pending: { label: "Pending", style: "bg-amber-50 text-amber-700", icon: Clock3 },
  cancelled: { label: "Cancelled", style: "bg-gray-100 text-gray-600", icon: XCircle },
};

const STATUS_ORDER = { active: 0, pending: 1, cancelled: 2 };

const filters = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "pending", label: "Pending" },
  { key: "cancelled", label: "Cancelled" },
];

/* ========================================================= */
/* PAGE                                                        */
/* ========================================================= */

export default function TeacherAssignmentsPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [assignments, setAssignments] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [assignmentsRes, sessionsRes] = await Promise.all([
          apiFetch("/me/assignments"),
          apiFetch("/me/sessions"),
        ]);

        if (cancelled) return;
        setAssignments(toList(assignmentsRes));
        setSessions(toList(sessionsRes));
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Unable to load your assignments.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  // Date de la première séance de chaque affectation.
  const firstSessionByAssignment = useMemo(() => {
    const map = new Map();

    sessions.forEach((session) => {
      const day = sessionDay(session);
      if (!day) return;

      const current = map.get(session.assignment_id);
      if (!current || day < current) map.set(session.assignment_id, day);
    });

    return map;
  }, [sessions]);

  const rows = useMemo(
    () =>
      assignments
        .map((assignment) => {
          const request = assignment.tutoring_request;
          const learner = request?.learner;

          return {
            id: assignment.id,
            shortId: String(assignment.id).slice(0, 8),
            status: assignment.status,
            student: getLearnerName(learner),
            className: learner?.classroom?.name ?? learner?.level?.name ?? null,
            subject: request?.subject?.name ?? "—",
            location: request?.location ?? learner?.location ?? "—",
            slot: formatPreferredSlot(request),
            price: formatPrice(assignment.agreed_price),
            firstSession: firstSessionByAssignment.get(assignment.id) ?? null,
          };
        })
        .sort(
          (a, b) =>
            (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9)
        ),
    [assignments, firstSessionByAssignment]
  );

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesSearch =
        !query ||
        row.student.toLowerCase().includes(query) ||
        row.subject.toLowerCase().includes(query) ||
        row.location.toLowerCase().includes(query) ||
        row.shortId.toLowerCase().includes(query);

      const matchesFilter =
        activeFilter === "all" || row.status === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [rows, search, activeFilter]);

  const counts = useMemo(
    () => ({
      total: rows.length,
      active: rows.filter((r) => r.status === "active").length,
      pending: rows.filter((r) => r.status === "pending").length,
      subjects: new Set(
        rows.filter((r) => r.subject !== "—").map((r) => r.subject)
      ).size,
    }),
    [rows]
  );

  const handleCancel = async (row) => {
    const confirmed = window.confirm(
      `Cancel the assignment with ${row.student} (${row.subject})? ` +
        "The request will become available again for other teachers."
    );
    if (!confirmed) return;

    setCancellingId(row.id);
    setError("");

    try {
      await apiFetch(`/assignments/${row.id}/cancel`, { method: "PATCH" });

      setAssignments((current) =>
        current.map((assignment) =>
          assignment.id === row.id
            ? { ...assignment, status: "cancelled" }
            : assignment
        )
      );
    } catch (err) {
      setError(err?.message || "Unable to cancel this assignment.");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC]">
      <TeacherSidebar activeItem="My Assignments" />

      <main className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-100 bg-white/95 px-6 backdrop-blur lg:px-8">
          <div className="ml-12 lg:ml-0">
            <p className="text-xs text-gray-400">Teacher Portal</p>

            <h1 className="text-lg font-semibold text-pf-purple-dark">
              My Assignments
            </h1>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pf-purple-light">
            <FileText className="h-4 w-4 text-pf-purple" />
          </div>
        </header>

        <div className="p-6 lg:p-8">
          {/* Intro */}
          <section className="mb-7">
            <h2 className="font-serif text-2xl font-semibold text-pf-purple-dark">
              Teaching Assignments
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Follow the status, agreed price and requested schedule of each
              assignment.
            </p>
          </section>

          {error && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600"
            >
              {error}
            </div>
          )}

          {/* Summary */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              icon={UsersRound}
              label="Total Assignments"
              value={loading ? "—" : counts.total}
              description="All assignments"
            />

            <SummaryCard
              icon={CheckCircle2}
              label="Active"
              value={loading ? "—" : counts.active}
              description="Currently teaching"
            />

            <SummaryCard
              icon={Clock3}
              label="Pending"
              value={loading ? "—" : counts.pending}
              description="Awaiting admin validation"
            />

            <SummaryCard
              icon={BookOpen}
              label="Subjects"
              value={loading ? "—" : counts.subjects}
              description="Across your assignments"
            />
          </section>

          {/* Search & filters */}
          <section className="mt-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search student, subject or location..."
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-pf-purple focus:bg-white"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() => setActiveFilter(filter.key)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                      activeFilter === filter.key
                        ? "bg-pf-purple text-white"
                        : "bg-gray-50 text-gray-500 hover:bg-pf-purple-light hover:text-pf-purple"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Assignments list */}
          <section className="mt-6 rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-4">
              <h3 className="font-semibold text-pf-purple-dark">
                Assignment List
              </h3>

              <p className="mt-0.5 text-xs text-gray-400">
                {filteredRows.length} assignment
                {filteredRows.length !== 1 ? "s" : ""}
              </p>
            </div>

            {loading && (
              <p className="px-6 py-10 text-center text-sm text-gray-400">
                Loading your assignments…
              </p>
            )}

            {!loading && filteredRows.length > 0 && (
              <div className="divide-y divide-gray-100">
                {filteredRows.map((row) => (
                  <AssignmentRow
                    key={row.id}
                    row={row}
                    cancelling={cancellingId === row.id}
                    onCancel={() => handleCancel(row)}
                  />
                ))}
              </div>
            )}

            {!loading && filteredRows.length === 0 && (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-pf-purple-light">
                  <FileText className="h-5 w-5 text-pf-purple" />
                </div>

                <h3 className="mt-4 font-semibold text-pf-purple-dark">
                  {rows.length === 0
                    ? "No assignments yet"
                    : "No assignments found"}
                </h3>

                <p className="mt-1 text-sm text-gray-400">
                  {rows.length === 0
                    ? "Assignments appear here once a request is matched to you."
                    : "Try changing your search or filter."}
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
/* ASSIGNMENT ROW                                              */
/* ========================================================= */

function AssignmentRow({ row, cancelling, onCancel }) {
  const canCancel = row.status === "active" || row.status === "pending";

  return (
    <div className="px-5 py-5 transition hover:bg-gray-50/60">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        {/* Student + subject */}
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pf-purple-light">
            <UserRound className="h-5 w-5 text-pf-purple" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-medium text-pf-purple-dark">{row.student}</h4>
              <StatusBadge status={row.status} />
            </div>

            <p className="mt-1 text-sm text-gray-500">
              {[row.className, row.subject].filter(Boolean).join(" · ")}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Assignment #{row.shortId}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="grid gap-4 sm:grid-cols-3 xl:min-w-[560px]">
          <Detail icon={MapPin} label="Location" value={row.location} />
          <Detail
            icon={CalendarDays}
            label="Requested slot"
            value={row.slot}
          />
          <Detail icon={Banknote} label="Agreed price" value={row.price} />
        </div>

        {/* Action */}
        {canCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={cancelling}
            className="w-fit rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelling ? "Cancelling…" : "Cancel"}
          </button>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
        <Clock3 className="h-3.5 w-3.5" />
        {row.firstSession
          ? `First lesson ${formatDate(row.firstSession)}`
          : "No lesson scheduled yet"}
      </div>
    </div>
  );
}

/* ========================================================= */
/* SMALL COMPONENTS                                            */
/* ========================================================= */

function SummaryCard({ icon: Icon, label, value, description }) {
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

          <p className="mt-1 text-xs text-gray-400">{description}</p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pf-purple-light text-pf-purple">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div>
      <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-gray-400">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </p>

      <p className="text-sm font-medium text-pf-purple-dark">{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = STATUS[status] ?? {
    label: capitalize(status) || "Unknown",
    style: "bg-gray-100 text-gray-600",
    icon: Clock3,
  };
  const Icon = config.icon;

  return (
    <span
      className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${config.style}`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}