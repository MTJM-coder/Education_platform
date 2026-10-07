import React, { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import ParentSidebar from "../components/parent/ParentSidebar";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  UserRound,
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  X,
  Video,
  GraduationCap,
} from "lucide-react";

const sessionsData = [
  {
    id: "SES-001",
    date: "2026-10-08",
    startTime: "15:00",
    endTime: "16:30",
    subject: "Mathematics",
    teacher: "Xavier Ndi",
    teacherId: 1,
    child: "Doly Junior",
    childId: 1,
    level: "Secondary",
    location: "Home",
    address: "Bonamoussadi",
    status: "scheduled",
    type: "home",
    notes: "Algebra revision and exercises.",
  },
  {
    id: "SES-002",
    date: "2026-10-09",
    startTime: "16:00",
    endTime: "17:30",
    subject: "Physics",
    teacher: "Nfor Grace",
    teacherId: 2,
    child: "Mireille Djoumesse",
    childId: 2,
    level: "Secondary",
    location: "Online",
    address: "Online session",
    status: "scheduled",
    type: "online",
    notes: "Mechanics and problem solving.",
  },
  {
    id: "SES-003",
    date: "2026-10-10",
    startTime: "10:00",
    endTime: "11:30",
    subject: "English",
    teacher: "Acha Mireille",
    teacherId: 3,
    child: "Doly Junior",
    childId: 1,
    level: "Secondary",
    location: "Home",
    address: "Akwa",
    status: "confirmed",
    type: "home",
    notes: "Grammar and speaking practice.",
  },
  {
    id: "SES-004",
    date: "2026-10-12",
    startTime: "15:30",
    endTime: "17:00",
    subject: "Mathematics",
    teacher: "Xavier Ndi",
    teacherId: 1,
    child: "Doly Junior",
    childId: 1,
    level: "Secondary",
    location: "Home",
    address: "Bonamoussadi",
    status: "scheduled",
    type: "home",
    notes: "Geometry exercises.",
  },
  {
    id: "SES-005",
    date: "2026-10-13",
    startTime: "16:00",
    endTime: "17:30",
    subject: "Physics",
    teacher: "Nfor Grace",
    teacherId: 2,
    child: "Mireille Djoumesse",
    childId: 2,
    level: "Secondary",
    location: "Online",
    address: "Online session",
    status: "scheduled",
    type: "online",
    notes: "Electricity chapter.",
  },
  {
    id: "SES-006",
    date: "2026-10-06",
    startTime: "15:00",
    endTime: "16:30",
    subject: "Mathematics",
    teacher: "Xavier Ndi",
    teacherId: 1,
    child: "Doly Junior",
    childId: 1,
    level: "Secondary",
    location: "Home",
    address: "Bonamoussadi",
    status: "completed",
    type: "home",
    notes: "Revision session completed.",
  },
];

const children = [
  { id: "all", name: "All children" },
  { id: 1, name: "Doly Junior" },
  { id: 2, name: "Mireille Djoumesse" },
];

const statusConfig = {
  scheduled: {
    label: "Scheduled",
    className: "bg-blue-50 text-blue-700",
    icon: CalendarDays,
  },
  confirmed: {
    label: "Confirmed",
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

function formatDate(dateString) {
  return new Date(`${dateString}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function shortDate(dateString) {
  return new Date(`${dateString}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getDayNumber(dateString) {
  return new Date(`${dateString}T12:00:00`).getDate();
}

function isToday(dateString) {
  const today = new Date().toISOString().split("T")[0];
  return dateString === today;
}

export default function ParentSchedulePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const requestId = searchParams.get("request");
  const learnerId = searchParams.get("learner");

  const [selectedDate, setSelectedDate] = useState("2026-10-08");
  const [selectedChild, setSelectedChild] = useState(
    learnerId ? Number(learnerId) : "all"
  );
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedSession, setSelectedSession] = useState(null);
  const [view, setView] = useState("week");

  const filteredSessions = useMemo(() => {
    return sessionsData.filter((session) => {
      const matchesChild =
        selectedChild === "all" || session.childId === Number(selectedChild);

      const matchesStatus =
        statusFilter === "all" || session.status === statusFilter;

      const searchText = search.toLowerCase();

      const matchesSearch =
        !search ||
        session.subject.toLowerCase().includes(searchText) ||
        session.teacher.toLowerCase().includes(searchText) ||
        session.child.toLowerCase().includes(searchText);

      return matchesChild && matchesStatus && matchesSearch;
    });
  }, [selectedChild, statusFilter, search]);

  const selectedDaySessions = filteredSessions.filter(
    (session) => session.date === selectedDate
  );

  const upcomingSessions = filteredSessions
    .filter(
      (session) =>
        session.status === "scheduled" || session.status === "confirmed"
    )
    .sort((a, b) => a.date.localeCompare(b.date));

  const completedCount = sessionsData.filter(
    (session) => session.status === "completed"
  ).length;

  const scheduledCount = sessionsData.filter(
    (session) =>
      session.status === "scheduled" || session.status === "confirmed"
  ).length;

  const changeDay = (amount) => {
    const date = new Date(`${selectedDate}T12:00:00`);
    date.setDate(date.getDate() + amount);

    setSelectedDate(date.toISOString().split("T")[0]);
  };

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
                  <Link
                    to="/parent-dashboard"
                    className="hover:text-[#6D4AFF]"
                  >
                    Dashboard
                  </Link>
                  <span>/</span>
                  <span className="text-gray-700">Schedule</span>
                </div>

                <h1 className="text-2xl font-bold text-gray-900">
                  My Schedule
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Manage and follow all tutoring sessions for your children.
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
          {/* Stats */}
          <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              icon={CalendarDays}
              label="Upcoming sessions"
              value={scheduledCount}
            />

            <StatCard
              icon={CheckCircle2}
              label="Completed"
              value={completedCount}
            />

            <StatCard
              icon={Clock3}
              label="Today's sessions"
              value={
                sessionsData.filter(
                  (session) =>
                    isToday(session.date) &&
                    session.status !== "cancelled"
                ).length
              }
            />

            <StatCard
              icon={UserRound}
              label="Active teachers"
              value={3}
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
                  onChange={(e) =>
                    setSelectedChild(
                      e.target.value === "all"
                        ? "all"
                        : Number(e.target.value)
                    )
                  }
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#6D4AFF]"
                >
                  {children.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.name}
                    </option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#6D4AFF]"
                >
                  <option value="all">All statuses</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                {(search ||
                  selectedChild !== "all" ||
                  statusFilter !== "all") && (
                  <button
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
                    <CalendarDays
                      size={21}
                      className="text-[#6D4AFF]"
                    />
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
                    onClick={() => changeDay(-1)}
                    className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
                    title="Previous day"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <button
                    onClick={() =>
                      setSelectedDate(
                        new Date().toISOString().split("T")[0]
                      )
                    }
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Today
                  </button>

                  <button
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
                  {sessionsData
                    .map((session) => session.date)
                    .filter(
                      (date, index, arr) => arr.indexOf(date) === index
                    )
                    .sort()
                    .map((date) => {
                      const active = date === selectedDate;

                      return (
                        <button
                          key={date}
                          onClick={() => setSelectedDate(date)}
                          className={`min-w-[72px] rounded-xl border px-3 py-2 text-center transition ${
                            active
                              ? "border-[#6D4AFF] bg-[#6D4AFF] text-white"
                              : "border-gray-200 bg-white text-gray-700 hover:border-[#BDB0FF]"
                          }`}
                        >
                          <div className="text-xs opacity-75">
                            {new Date(
                              `${date}T12:00:00`
                            ).toLocaleDateString("en-US", {
                              weekday: "short",
                            })}
                          </div>

                          <div className="mt-1 text-lg font-bold">
                            {getDayNumber(date)}
                          </div>

                          {filteredSessions.some(
                            (session) => session.date === date
                          ) && (
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
                {selectedDaySessions.length > 0 ? (
                  <div className="space-y-4">
                    {selectedDaySessions.map((session) => (
                      <SessionCard
                        key={session.id}
                        session={session}
                        onDetails={() => setSelectedSession(session)}
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
                <h2 className="font-semibold text-gray-900">
                  Upcoming Sessions
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Your next tutoring sessions
                </p>
              </div>

              <div className="p-4">
                {upcomingSessions.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingSessions.slice(0, 5).map((session) => (
                      <button
                        key={session.id}
                        onClick={() => {
                          setSelectedDate(session.date);
                          setSelectedSession(session);
                        }}
                        className="w-full rounded-xl border border-gray-100 p-4 text-left transition hover:border-[#CFC6FF] hover:bg-[#FAF9FF]"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-[#F0ECFF] text-[#6D4AFF]">
                            <span className="text-[10px] font-medium uppercase">
                              {new Date(
                                `${session.date}T12:00:00`
                              ).toLocaleDateString("en-US", {
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

      {/* Details Modal */}
      {selectedSession && (
        <SessionDetailsModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onProfile={() =>
            navigate(`/teacher-profile/${selectedSession.teacherId}`)
          }
        />
      )}
    </div>
  );
}

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
  const config = statusConfig[session.status] || statusConfig.scheduled;
  const StatusIcon = config.icon;

  return (
    <div className="rounded-2xl border border-gray-100 p-4 transition hover:border-[#D9D2FF] hover:shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* Time */}
        <div className="w-full shrink-0 md:w-28">
          <div className="text-lg font-bold text-gray-900">
            {session.startTime}
          </div>
          <div className="text-xs text-gray-500">
            until {session.endTime}
          </div>
        </div>

        {/* Main info */}
        <div className="min-w-0 flex-1 border-l-0 md:border-l md:border-gray-100 md:pl-4">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-gray-900">
              {session.subject}
            </h3>

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
              {session.type === "online" ? (
                <Video size={15} />
              ) : (
                <MapPin size={15} />
              )}
              {session.location}
            </span>
          </div>
        </div>

        {/* Action */}
        <button
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

      <h3 className="mt-4 font-semibold text-gray-900">
        No session scheduled
      </h3>

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

function SessionDetailsModal({ session, onClose, onProfile }) {
  const config = statusConfig[session.status] || statusConfig.scheduled;
  const StatusIcon = config.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <div>
            <p className="text-xs font-medium text-gray-500">
              Session {session.id}
            </p>
            <h2 className="mt-1 text-xl font-bold text-gray-900">
              {session.subject}
            </h2>
          </div>

          <button
            onClick={onClose}
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

            <InfoItem
              icon={UserRound}
              label="Teacher"
              value={session.teacher}
            />

            <InfoItem
              icon={GraduationCap}
              label="Child"
              value={session.child}
            />

            <InfoItem
              icon={BookOpen}
              label="Level"
              value={session.level}
            />

            <InfoItem
              icon={session.type === "online" ? Video : MapPin}
              label="Location"
              value={session.address}
            />
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Session notes
            </p>
            <p className="mt-2 text-sm leading-6 text-gray-700">
              {session.notes}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={onProfile}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              View Teacher Profile
            </button>

            {session.type === "online" &&
              (session.status === "scheduled" ||
                session.status === "confirmed") && (
                <button
                  onClick={() => {
                    alert(
                      "The online meeting link will be available when the session is connected to the backend."
                    );
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D4AFF] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#5D3DE0]"
                >
                  <Video size={17} />
                  Join Session
                </button>
              )}
          </div>
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