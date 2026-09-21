import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  GraduationCap,
  MapPin,
  UserRound,
  Video,
} from "lucide-react";
import SidebarStudent from "../components/student/SidebarStudent";

const sessions = [
  {
    id: 1,
    date: "2026-09-21",
    day: "Monday",
    time: "16:00",
    endTime: "17:30",
    subject: "Mathematics",
    topic: "Algebra",
    teacher: "Mr. Xavier Ndi",
    location: "Home",
    type: "Home",
    status: "Upcoming",
  },
  {
    id: 2,
    date: "2026-09-22",
    day: "Tuesday",
    time: "15:00",
    endTime: "16:30",
    subject: "Physics",
    topic: "Electricity",
    teacher: "Mrs. Nfor",
    location: "Home",
    type: "Home",
    status: "Upcoming",
  },
  {
    id: 3,
    date: "2026-09-24",
    day: "Thursday",
    time: "15:30",
    endTime: "17:00",
    subject: "English",
    topic: "Essay Writing",
    teacher: "Mrs. Acha",
    location: "Online",
    type: "Online",
    status: "Upcoming",
  },
  {
    id: 4,
    date: "2026-09-25",
    day: "Friday",
    time: "14:00",
    endTime: "15:30",
    subject: "Computer Science",
    topic: "HTML & CSS",
    teacher: "Mr. Bih",
    location: "Home",
    type: "Home",
    status: "Upcoming",
  },
  {
    id: 5,
    date: "2026-09-18",
    day: "Friday",
    time: "16:00",
    endTime: "17:30",
    subject: "Mathematics",
    topic: "Linear Equations",
    teacher: "Mr. Xavier Ndi",
    location: "Home",
    type: "Home",
    status: "Completed",
  },
  {
    id: 6,
    date: "2026-09-17",
    day: "Thursday",
    time: "15:00",
    endTime: "16:30",
    subject: "Physics",
    topic: "Motion",
    teacher: "Mrs. Nfor",
    location: "Home",
    type: "Home",
    status: "Completed",
  },
];

const weekDays = [
  {
    short: "Mon",
    date: "21",
    fullDate: "2026-09-21",
  },
  {
    short: "Tue",
    date: "22",
    fullDate: "2026-09-22",
  },
  {
    short: "Wed",
    date: "23",
    fullDate: "2026-09-23",
  },
  {
    short: "Thu",
    date: "24",
    fullDate: "2026-09-24",
  },
  {
    short: "Fri",
    date: "25",
    fullDate: "2026-09-25",
  },
  {
    short: "Sat",
    date: "26",
    fullDate: "2026-09-26",
  },
  {
    short: "Sun",
    date: "27",
    fullDate: "2026-09-27",
  },
];

export default function StudentSchedulePage() {
  const [selectedDate, setSelectedDate] = useState(
    "2026-09-21"
  );

  const selectedSessions = useMemo(() => {
    return sessions.filter(
      (session) => session.date === selectedDate
    );
  }, [selectedDate]);

  const upcomingSessions = sessions.filter(
    (session) => session.status === "Upcoming"
  );

  const completedSessions = sessions.filter(
    (session) => session.status === "Completed"
  );

  return (
    <div className="min-h-screen bg-[#FAF9FB] font-sans text-[#302C38]">
      <SidebarStudent activeItem="My Schedule" />

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
            My Schedule
          </p>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pf-purple-light text-xs font-semibold text-pf-purple">
            JM
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8">
          {/* Introduction */}
          <section className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-pf-purple">
                MY SCHEDULE
              </p>

              <h1 className="mt-1 font-serif text-2xl font-medium text-pf-purple-dark sm:text-3xl">
                My Schedule
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Keep track of your lessons, teachers and upcoming
                sessions.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-pf-purple-light px-3 py-2 text-xs font-medium text-pf-purple">
              <CalendarDays className="h-4 w-4" />
              September 2026
            </div>
          </section>

          {/* Summary */}
          <section className="mt-7 grid gap-4 sm:grid-cols-3">
            <SummaryCard
              icon={CalendarDays}
              label="Upcoming Sessions"
              value={upcomingSessions.length}
            />

            <SummaryCard
              icon={Clock3}
              label="Completed Sessions"
              value={completedSessions.length}
            />

            <SummaryCard
              icon={Clock3}
              label="This Week"
              value="6h 30m"
            />
          </section>

          {/* Week selector */}
          <section className="mt-7 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="text-center">
                <h2 className="font-serif text-lg text-pf-purple-dark">
                  This Week
                </h2>

                <p className="mt-0.5 text-xs text-gray-400">
                  21 - 27 September 2026
                </p>
              </div>

              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-7 gap-1.5 sm:gap-2">
              {weekDays.map((day) => {
                const active =
                  selectedDate === day.fullDate;

                const hasSession = sessions.some(
                  (session) =>
                    session.date === day.fullDate
                );

                return (
                  <button
                    key={day.fullDate}
                    type="button"
                    onClick={() =>
                      setSelectedDate(day.fullDate)
                    }
                    className={`rounded-xl px-1 py-3 text-center transition ${
                      active
                        ? "bg-pf-purple text-white shadow-sm"
                        : "bg-[#FAF9FB] text-gray-500 hover:bg-pf-purple-light"
                    }`}
                  >
                    <p className="text-[10px] font-medium">
                      {day.short}
                    </p>

                    <p className="mt-1 font-serif text-lg">
                      {day.date}
                    </p>

                    <div className="mt-1.5 flex justify-center">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          hasSession
                            ? active
                              ? "bg-white"
                              : "bg-pf-purple"
                            : "bg-transparent"
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Selected day */}
          <section className="mt-7 grid gap-5 xl:grid-cols-[1.5fr_0.8fr]">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-xl text-pf-purple-dark">
                    {getDayName(selectedDate)}
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    {formatDate(selectedDate)}
                  </p>
                </div>

                <span className="rounded-full bg-pf-purple-light px-3 py-1.5 text-xs font-medium text-pf-purple">
                  {selectedSessions.length}{" "}
                  {selectedSessions.length === 1
                    ? "session"
                    : "sessions"}
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {selectedSessions.length > 0 ? (
                  selectedSessions.map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                    />
                  ))
                ) : (
                  <EmptySchedule />
                )}
              </div>
            </div>

            {/* Upcoming */}
            <aside className="space-y-5">
              <section className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-lg text-pf-purple-dark">
                    Next Session
                  </h2>

                  <CalendarDays className="h-5 w-5 text-pf-purple" />
                </div>

                {upcomingSessions.length > 0 && (
                  <div className="mt-5 rounded-xl bg-pf-purple p-4 text-white">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-purple-200">
                      {upcomingSessions[0].day}
                    </p>

                    <h3 className="mt-1 font-serif text-xl">
                      {upcomingSessions[0].subject}
                    </h3>

                    <p className="mt-1 text-xs text-purple-100">
                      {upcomingSessions[0].topic}
                    </p>

                    <div className="mt-4 space-y-2.5">
                      <InfoRow
                        icon={Clock3}
                        text={`${upcomingSessions[0].time} - ${upcomingSessions[0].endTime}`}
                      />

                      <InfoRow
                        icon={UserRound}
                        text={upcomingSessions[0].teacher}
                      />

                      <InfoRow
                        icon={
                          upcomingSessions[0].type ===
                          "Online"
                            ? Video
                            : MapPin
                        }
                        text={upcomingSessions[0].location}
                      />
                    </div>
                  </div>
                )}
              </section>

              {/* Schedule legend */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5">
                <h2 className="font-serif text-lg text-pf-purple-dark">
                  Schedule Overview
                </h2>

                <div className="mt-4 space-y-3">
                  <LegendItem
                    label="Upcoming"
                    className="bg-pf-purple"
                  />

                  <LegendItem
                    label="Completed"
                    className="bg-pf-green"
                  />

                  <LegendItem
                    label="Online session"
                    className="bg-pf-blue"
                  />
                </div>
              </section>
            </aside>
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
/* SESSION CARD                                               */
/* ========================================================= */

function SessionCard({ session }) {
  const completed = session.status === "Completed";

  return (
    <article className="group rounded-xl border border-gray-100 p-4 transition hover:border-pf-purple/20 hover:bg-[#FCFBFD]">
      <div className="flex gap-4">
        {/* Time */}
        <div className="w-16 shrink-0 border-r border-gray-100 pr-4">
          <p className="text-sm font-semibold text-pf-purple-dark">
            {session.time}
          </p>

          <p className="mt-1 text-[10px] text-gray-400">
            {session.endTime}
          </p>
        </div>

        {/* Session information */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-base text-pf-purple-dark">
                  {session.subject}
                </h3>

                <span
                  className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                    completed
                      ? "bg-green-50 text-green-600"
                      : "bg-pf-purple-light text-pf-purple"
                  }`}
                >
                  {session.status}
                </span>
              </div>

              <p className="mt-1 text-xs text-gray-500">
                {session.topic}
              </p>
            </div>

            <ChevronRight className="h-4 w-4 text-gray-300 transition group-hover:text-pf-purple" />
          </div>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-gray-500">
            <span className="inline-flex items-center gap-1.5">
              <UserRound className="h-3.5 w-3.5 text-gray-400" />
              {session.teacher}
            </span>

            <span className="inline-flex items-center gap-1.5">
              {session.type === "Online" ? (
                <Video className="h-3.5 w-3.5 text-gray-400" />
              ) : (
                <MapPin className="h-3.5 w-3.5 text-gray-400" />
              )}

              {session.location}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ========================================================= */
/* INFO ROW                                                    */
/* ========================================================= */

function InfoRow({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-2 text-xs text-purple-100">
      <Icon className="h-3.5 w-3.5" />
      <span>{text}</span>
    </div>
  );
}

/* ========================================================= */
/* LEGEND                                                      */
/* ========================================================= */

function LegendItem({ label, className }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`h-2.5 w-2.5 rounded-full ${className}`}
      />

      <span className="text-xs text-gray-500">
        {label}
      </span>
    </div>
  );
}

/* ========================================================= */
/* EMPTY STATE                                                 */
/* ========================================================= */

function EmptySchedule() {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center">
      <CalendarDays className="mx-auto h-8 w-8 text-gray-300" />

      <h3 className="mt-3 text-sm font-medium text-gray-600">
        No session scheduled
      </h3>

      <p className="mt-1 text-xs text-gray-400">
        You don't have a lesson scheduled for this day.
      </p>
    </div>
  );
}

/* ========================================================= */
/* DATE HELPERS                                                */
/* ========================================================= */

function getDayName(dateString) {
  const date = new Date(`${dateString}T12:00:00`);

  return date.toLocaleDateString("en-US", {
    weekday: "long",
  });
}

function formatDate(dateString) {
  const date = new Date(`${dateString}T12:00:00`);

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}