import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ParentSidebar from "../components/parent/ParentSidebar";
import { apiFetch } from "../lib/apiClient";

import {
  AlertCircle,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  GraduationCap,
  MapPin,
  Search,
  UserRound,
  X,
  XCircle,
} from "lucide-react";

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

// Accepte { ... }, { data: { ... } } ou { data: { data: { ... } } }.
function toObject(response) {
  return response?.data?.data ?? response?.data ?? response ?? null;
}

function getUserName(user) {
  if (!user) return null;
  if (user.name) return user.name;
  const full = [user.first_name, user.last_name].filter(Boolean).join(" ");
  return full || null;
}

function getLearnerName(learner) {
  if (!learner) return "Student";
  const own = [learner.first_name, learner.last_name].filter(Boolean).join(" ");
  if (own) return own;
  return getUserName(learner.user) ?? "Student";
}

// Dates toujours en heure LOCALE (toISOString décalerait le jour près de minuit).
function toKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function atNoon(key) {
  return new Date(`${key}T12:00:00`);
}

function formatDate(key) {
  return atNoon(key).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getDayNumber(key) {
  return atNoon(key).getDate();
}

// État affiché, déduit du statut et des confirmations (parent / enseignant).
function deriveState(raw) {
  if (raw.status === "completed") return "completed";
  if (raw.status === "scheduled") {
    if (raw.confirmed_by_parent_at) return "confirmed";
    if (raw.confirmed_by_teacher_at) return "awaiting";
    return "scheduled";
  }
  return raw.status;
}

const statusConfig = {
  scheduled: {
    label: "Scheduled",
    className: "bg-blue-50 text-blue-700",
    icon: CalendarDays,
  },
  awaiting: {
    label: "Awaiting your confirmation",
    className: "bg-amber-50 text-amber-700",
    icon: AlertCircle,
  },
  confirmed: {
    label: "Confirmed by you",
    className: "bg-green-50 text-green-700",
    icon: CheckCircle2,
  },
  completed: {
    label: "Completed",
    className: "bg-gray-100 text-gray-600",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-50 text-red-700",
    icon: XCircle,
  },
};

function toSession(raw) {
  const assignment = raw.assignment;
  const request = assignment?.tutoring_request;
  const learner = request?.learner;
  const date = String(raw.session_date ?? "").slice(0, 10);
  const startTime = String(raw.start_time ?? "").slice(0, 5);

  return {
    id: raw.id,
    date,
    startTime,
    endTime: String(raw.end_time ?? "").slice(0, 5),
    start: new Date(`${date}T${startTime || "00:00"}:00`),
    subject: request?.subject?.name ?? "—",
    teacher: getUserName(assignment?.teacher?.user) ?? "Teacher",
    childId: learner?.id ?? request?.learner_id ?? null,
    child: getLearnerName(learner),
    location: raw.location ?? request?.location ?? learner?.location ?? "—",
    state: deriveState(raw),
    confirmedByParent: Boolean(raw.confirmed_by_parent_at),
    confirmedByTeacher: Boolean(raw.confirmed_by_teacher_at),
  };
}

const OPEN_STATES = ["scheduled", "awaiting", "confirmed"];

/* ========================================================= */
/* PAGE                                                        */
/* ========================================================= */

export default function ParentSchedulePage() {
  const [searchParams] = useSearchParams();
  const learnerParam = searchParams.get("learner");

  const [rawSessions, setRawSessions] = useState([]);
  const [children, setChildren] = useState([]);
  const [activeTeachers, setActiveTeachers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedDate, setSelectedDate] = useState(() => toKey(new Date()));
  const [selectedChild, setSelectedChild] = useState(learnerParam || "all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  const [confirming, setConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState("");

  const todayKey = toKey(new Date());

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [sessionsRes, childrenRes, requestsRes] = await Promise.all([
          apiFetch("/me/sessions"),
          apiFetch("/me/children"),
          apiFetch("/me/tutoring-requests"),
        ]);

        if (cancelled) return;

        const sessions = toList(sessionsRes);
        setRawSessions(sessions);
        setChildren(toList(childrenRes));

        const teacherIds = new Set(
          toList(requestsRes)
            .flatMap((request) => request.assignments ?? [])
            .filter((assignment) => assignment.status === "active")
            .map((assignment) => assignment.teacher_id)
        );
        setActiveTeachers(teacherIds.size);

        // Ouvre directement sur la prochaine séance, sinon sur aujourd'hui.
        const next = sessions
          .map((raw) => String(raw.session_date ?? "").slice(0, 10))
          .filter((date) => date >= toKey(new Date()))
          .sort()[0];
        if (next) setSelectedDate(next);
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Unable to load your schedule.");
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

  const sessions = useMemo(() => rawSessions.map(toSession), [rawSessions]);

  const childOptions = useMemo(
    () => [
      { id: "all", name: "All children" },
      ...children.map((child) => ({ id: child.id, name: getLearnerName(child) })),
    ],
    [children]
  );

  const filteredSessions = useMemo(() => {
    const text = search.trim().toLowerCase();

    return sessions.filter((session) => {
      const matchesChild =
        selectedChild === "all" || session.childId === selectedChild;
      const matchesStatus =
        statusFilter === "all" || session.state === statusFilter;
      const matchesSearch =
        !text ||
        session.subject.toLowerCase().includes(text) ||
        session.teacher.toLowerCase().includes(text) ||
        session.child.toLowerCase().includes(text);

      return matchesChild && matchesStatus && matchesSearch;
    });
  }, [sessions, selectedChild, statusFilter, search]);

  const selectedDaySessions = useMemo(
    () =>
      filteredSessions
        .filter((session) => session.date === selectedDate)
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [filteredSessions, selectedDate]
  );

  const upcomingSessions = useMemo(
    () =>
      filteredSessions
        .filter(
          (session) =>
            OPEN_STATES.includes(session.state) && session.date >= todayKey
        )
        .sort((a, b) => a.start - b.start),
    [filteredSessions, todayKey]
  );

  const stats = useMemo(
    () => ({
      upcoming: sessions.filter(
        (s) => OPEN_STATES.includes(s.state) && s.date >= todayKey
      ).length,
      completed: sessions.filter((s) => s.state === "completed").length,
      today: sessions.filter(
        (s) => s.date === todayKey && s.state !== "cancelled"
      ).length,
    }),
    [sessions, todayKey]
  );

  // Bande de dates : jours avec séances (depuis 7 jours) + aujourd'hui.
  const stripDates = useMemo(() => {
    const limit = new Date();
    limit.setDate(limit.getDate() - 7);
    const minKey = toKey(limit);

    return Array.from(
      new Set([todayKey, ...sessions.map((session) => session.date)])
    )
      .filter((date) => date >= minKey)
      .sort();
  }, [sessions, todayKey]);

  const selectedSession =
    sessions.find((session) => session.id === selectedSessionId) ?? null;

  const changeDay = (amount) => {
    const date = atNoon(selectedDate);
    date.setDate(date.getDate() + amount);
    setSelectedDate(toKey(date));
  };

  const openSession = (session) => {
    setConfirmError("");
    setSelectedSessionId(session.id);
  };

  const handleConfirm = async (session) => {
    setConfirming(true);
    setConfirmError("");

    try {
      const response = await apiFetch(`/sessions/${session.id}/confirm`, {
        method: "PATCH",
      });
      const updated = toObject(response);

      // La réponse n'embarque pas les relations : on fusionne avec l'existant.
      setRawSessions((current) =>
        current.map((raw) =>
          raw.id === session.id ? { ...raw, ...updated } : raw
        )
      );
    } catch (err) {
      setConfirmError(err?.message || "Unable to confirm this session.");
    } finally {
      setConfirming(false);
    }
  };

  const hasFilters = search || selectedChild !== "all" || statusFilter !== "all";

  return (
    <div className="min-h-screen bg-[#F8F8FA]">
      <ParentSidebar />

      <main className="lg:ml-[260px]">
        {/* Header */}
        <div className="border-b border-gray-100 bg-white">
          <div className="px-5 py-6 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                  <Link to="/parent-dashboard" className="hover:text-[#6D4AFF]">
                    Dashboard
                  </Link>
                  <span>/</span>
                  <span className="text-gray-700">Schedule</span>
                </div>

                <h1 className="text-2xl font-bold text-gray-900">My Schedule</h1>

                <p className="mt-1 text-sm text-gray-500">
                  Follow all tutoring sessions for your children.
                </p>
              </div>

              <Link
                to="/search"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D4AFF] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5D3DE0]"
              >
                <GraduationCap size={18} />
                Find a Teacher
              </Link>
            </div>
          </div>
        </div>

        <div className="px-5 py-6 sm:px-8 lg:px-10">
          {error && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600"
            >
              {error}
            </div>
          )}

          {/* Stats */}
          <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              icon={CalendarDays}
              label="Upcoming sessions"
              value={loading ? "—" : stats.upcoming}
            />
            <StatCard
              icon={CheckCircle2}
              label="Completed"
              value={loading ? "—" : stats.completed}
            />
            <StatCard
              icon={Clock3}
              label="Today's sessions"
              value={loading ? "—" : stats.today}
            />
            <StatCard
              icon={UserRound}
              label="Active teachers"
              value={loading ? "—" : activeTeachers}
            />
          </div>

          {/* Filters */}
          <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by subject, teacher or child..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#6D4AFF] focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <select
                  value={selectedChild}
                  onChange={(e) => setSelectedChild(e.target.value)}
                  aria-label="Child"
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#6D4AFF]"
                >
                  {childOptions.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.name}
                    </option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  aria-label="Status"
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#6D4AFF]"
                >
                  <option value="all">All statuses</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="awaiting">Awaiting your confirmation</option>
                  <option value="confirmed">Confirmed by you</option>
                  <option value="completed">Completed</option>
                </select>

                {hasFilters && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setSelectedChild("all");
                      setStatusFilter("all");
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    <X size={16} />
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main layout */}
          <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
            {/* Calendar / day schedule */}
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[#F0ECFF] p-2.5">
                    <CalendarDays size={21} className="text-[#6D4AFF]" />
                  </div>

                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {formatDate(selectedDate)}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {selectedDaySessions.length} session
                      {selectedDaySessions.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => changeDay(-1)}
                    className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
                    title="Previous day"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedDate(todayKey)}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Today
                  </button>

                  <button
                    type="button"
                    onClick={() => changeDay(1)}
                    className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
                    title="Next day"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              {/* Mini date strip */}
              <div className="overflow-x-auto border-b border-gray-100">
                <div className="flex min-w-max gap-2 p-4">
                  {stripDates.map((date) => {
                    const active = date === selectedDate;

                    return (
                      <button
                        type="button"
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`min-w-[72px] rounded-xl border px-3 py-2 text-center transition ${
                          active
                            ? "border-[#6D4AFF] bg-[#6D4AFF] text-white"
                            : "border-gray-200 bg-white text-gray-700 hover:border-[#BDB0FF]"
                        }`}
                      >
                        <div className="text-xs opacity-75">
                          {atNoon(date).toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </div>

                        <div className="mt-1 text-lg font-bold">
                          {getDayNumber(date)}
                        </div>

                        {filteredSessions.some((s) => s.date === date) && (
                          <div
                            className={`mx-auto mt-1 h-1.5 w-1.5 rounded-full ${
                              active ? "bg-white" : "bg-[#6D4AFF]"
                            }`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sessions */}
              <div className="p-5">
                {loading ? (
                  <p className="py-16 text-center text-sm text-gray-400">
                    Loading your sessions…
                  </p>
                ) : selectedDaySessions.length > 0 ? (
                  <div className="space-y-4">
                    {selectedDaySessions.map((session) => (
                      <SessionCard
                        key={session.id}
                        session={session}
                        onDetails={() => openSession(session)}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyDay />
                )}
              </div>
            </div>

            {/* Upcoming */}
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 p-5">
                <h2 className="font-semibold text-gray-900">Upcoming Sessions</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Your next tutoring sessions
                </p>
              </div>

              <div className="p-4">
                {upcomingSessions.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingSessions.slice(0, 5).map((session) => (
                      <button
                        type="button"
                        key={session.id}
                        onClick={() => {
                          setSelectedDate(session.date);
                          openSession(session);
                        }}
                        className="w-full rounded-xl border border-gray-100 p-4 text-left transition hover:border-[#CFC6FF] hover:bg-[#FAF9FF]"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-[#F0ECFF] text-[#6D4AFF]">
                            <span className="text-[10px] font-medium uppercase">
                              {atNoon(session.date).toLocaleDateString("en-US", {
                                month: "short",
                              })}
                            </span>
                            <span className="text-base font-bold">
                              {getDayNumber(session.date)}
                            </span>
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-semibold text-gray-900">
                              {session.subject}
                            </div>

                            <div className="mt-1 text-xs text-gray-500">
                              {session.child}
                            </div>

                            <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                              <Clock3 size={13} />
                              {session.startTime} - {session.endTime}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 text-center text-sm text-gray-500">
                    No upcoming sessions.
                  </div>
                )}

                <Link
                  to="/suivi-demande"
                  className="mt-4 flex w-full items-center justify-center rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  View Tutoring Requests
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {selectedSession && (
        <SessionDetailsModal
          session={selectedSession}
          confirming={confirming}
          error={confirmError}
          onConfirm={() => handleConfirm(selectedSession)}
          onClose={() => setSelectedSessionId(null)}
        />
      )}
    </div>
  );
}

/* ========================================================= */
/* SMALL COMPONENTS                                            */
/* ========================================================= */

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-[#F0ECFF] p-2.5">
          <Icon size={20} className="text-[#6D4AFF]" />
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500">{label}</p>
          <p className="mt-0.5 text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function SessionCard({ session, onDetails }) {
  const config = statusConfig[session.state] || statusConfig.scheduled;
  const StatusIcon = config.icon;

  return (
    <div className="rounded-2xl border border-gray-100 p-4 transition hover:border-[#D9D2FF] hover:shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* Time */}
        <div className="w-full shrink-0 md:w-28">
          <div className="text-lg font-bold text-gray-900">
            {session.startTime}
          </div>
          <div className="text-xs text-gray-500">until {session.endTime}</div>
        </div>

        {/* Main info */}
        <div className="min-w-0 flex-1 border-l-0 md:border-l md:border-gray-100 md:pl-4">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-gray-900">{session.subject}</h3>

            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
            >
              <StatusIcon size={12} />
              {config.label}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1.5">
              <UserRound size={15} />
              {session.teacher}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <GraduationCap size={15} />
              {session.child}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <MapPin size={15} />
              {session.location}
            </span>
          </div>
        </div>

        {/* Action */}
        <button
          type="button"
          onClick={onDetails}
          className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Details
        </button>
      </div>
    </div>
  );
}

function EmptyDay() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-gray-100 p-4">
        <CalendarDays size={28} className="text-gray-400" />
      </div>

      <h3 className="mt-4 font-semibold text-gray-900">No session scheduled</h3>

      <p className="mt-1 max-w-sm text-sm text-gray-500">
        There are no tutoring sessions matching your filters for this day.
      </p>

      <Link
        to="/search"
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#6D4AFF] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#5D3DE0]"
      >
        <GraduationCap size={17} />
        Find a Teacher
      </Link>
    </div>
  );
}

function SessionDetailsModal({ session, confirming, error, onConfirm, onClose }) {
  const config = statusConfig[session.state] || statusConfig.scheduled;
  const StatusIcon = config.icon;

  // On ne propose la confirmation qu'une fois la séance commencée.
  const hasStarted = session.start <= new Date();
  const canConfirm =
    (session.state === "scheduled" || session.state === "awaiting") &&
    !session.confirmedByParent;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <div>
            <p className="text-xs font-medium text-gray-500">Session details</p>
            <h2 className="mt-1 text-xl font-bold text-gray-900">
              {session.subject}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <div
            className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ${config.className}`}
          >
            <StatusIcon size={17} />
            {config.label}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <InfoItem
              icon={CalendarDays}
              label="Date"
              value={formatDate(session.date)}
            />

            <InfoItem
              icon={Clock3}
              label="Time"
              value={`${session.startTime} - ${session.endTime}`}
            />

            <InfoItem icon={UserRound} label="Teacher" value={session.teacher} />

            <InfoItem icon={GraduationCap} label="Child" value={session.child} />

            <InfoItem icon={BookOpen} label="Subject" value={session.subject} />

            <InfoItem icon={MapPin} label="Location" value={session.location} />
          </div>

          <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Confirmations
            </p>
            <p className="mt-2">
              Teacher: {session.confirmedByTeacher ? "confirmed" : "not yet"} ·
              You: {session.confirmedByParent ? "confirmed" : "not yet"}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              A session is completed once both of you have confirmed it.
            </p>
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          {canConfirm && (
            <div>
              <button
                type="button"
                onClick={onConfirm}
                disabled={!hasStarted || confirming}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#6D4AFF] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#5D3DE0] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CheckCircle2 size={17} />
                {confirming ? "Confirming…" : "Confirm the session took place"}
              </button>

              {!hasStarted && (
                <p className="mt-2 text-center text-xs text-gray-400">
                  You can confirm once the session has started.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 rounded-lg bg-[#F0ECFF] p-2">
        <Icon size={16} className="text-[#6D4AFF]" />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="mt-0.5 break-words text-sm font-medium text-gray-800">
          {value}
        </p>
      </div>
    </div>
  );
}