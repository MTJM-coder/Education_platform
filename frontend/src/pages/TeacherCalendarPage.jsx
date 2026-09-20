import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Plus,
  UserRound,
  X,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import TeacherSidebar from "../components/teacher/TeacherSidebar";

const weekDays = [
  { day: "Mon", date: 21 },
  { day: "Tue", date: 22 },
  { day: "Wed", date: 23 },
  { day: "Thu", date: 24 },
  { day: "Fri", date: 25 },
  { day: "Sat", date: 26 },
  { day: "Sun", date: 27 },
];

const sessions = [
  {
    id: 1,
    student: "Junior D.",
    subject: "Mathematics",
    date: 21,
    day: "Mon",
    start: "16:00",
    end: "17:30",
    location: "Bonamoussadi",
    status: "Scheduled",
  },
  {
    id: 2,
    student: "Sarah M.",
    subject: "English",
    date: 22,
    day: "Tue",
    start: "14:00",
    end: "15:30",
    location: "Makepe",
    status: "Scheduled",
  },
  {
    id: 3,
    student: "Junior D.",
    subject: "Mathematics",
    date: 23,
    day: "Wed",
    start: "16:00",
    end: "17:30",
    location: "Bonamoussadi",
    status: "Scheduled",
  },
  {
    id: 4,
    student: "David N.",
    subject: "Physics",
    date: 25,
    day: "Fri",
    start: "17:00",
    end: "18:30",
    location: "Deido",
    status: "Scheduled",
  },
  {
    id: 5,
    student: "Grace T.",
    subject: "Mathematics",
    date: 26,
    day: "Sat",
    start: "10:00",
    end: "12:00",
    location: "Akwa",
    status: "Scheduled",
  },
];

const availability = [
  {
    day: "Monday",
    enabled: true,
    start: "14:00",
    end: "19:00",
  },
  {
    day: "Tuesday",
    enabled: true,
    start: "13:00",
    end: "18:00",
  },
  {
    day: "Wednesday",
    enabled: true,
    start: "14:00",
    end: "19:00",
  },
  {
    day: "Thursday",
    enabled: false,
    start: "",
    end: "",
  },
  {
    day: "Friday",
    enabled: true,
    start: "15:00",
    end: "19:00",
  },
  {
    day: "Saturday",
    enabled: true,
    start: "09:00",
    end: "14:00",
  },
  {
    day: "Sunday",
    enabled: false,
    start: "",
    end: "",
  },
];

export default function TeacherCalendarPage() {
  const [currentWeek, setCurrentWeek] = useState("Sep 21 – Sep 27, 2026");
  const [selectedDate, setSelectedDate] = useState(21);
  const [showAvailability, setShowAvailability] = useState(false);
  const [showNewSession, setShowNewSession] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  const selectedSessions = sessions.filter(
    (session) => session.date === selectedDate
  );

  return (
    <div className="min-h-screen bg-[#FAFAFC]">
      <TeacherSidebar activeItem="My Calendar" />

      <main className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-100 bg-white/95 px-6 backdrop-blur lg:px-8">
          <div className="ml-12 lg:ml-0">
            <p className="text-xs text-gray-400">Teacher Portal</p>

            <h1 className="text-lg font-semibold text-pf-purple-dark">
              My Calendar
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setShowNewSession(true)}
            className="flex items-center gap-2 rounded-lg bg-pf-purple px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Plan Session</span>
          </button>
        </header>

        <div className="p-6 lg:p-8">
          {/* Page introduction */}
          <section className="mb-6">
            <h2 className="font-serif text-2xl font-semibold text-pf-purple-dark">
              Your Schedule
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage your teaching sessions and weekly availability.
            </p>
          </section>

          {/* Calendar controls */}
          <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-50"
                  aria-label="Previous week"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-pf-purple-dark"
                >
                  Today
                </button>

                <button
                  type="button"
                  className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-50"
                  aria-label="Next week"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                <span className="ml-2 text-sm font-semibold text-pf-purple-dark">
                  {currentWeek}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowAvailability(true)}
                className="flex items-center justify-center gap-2 rounded-lg border border-pf-purple/20 bg-pf-purple-light px-4 py-2.5 text-sm font-medium text-pf-purple transition hover:bg-pf-purple-light/70"
              >
                <Clock3 className="h-4 w-4" />
                My Availability
              </button>
            </div>

            {/* Week */}
            <div className="grid grid-cols-7 border-b border-gray-100">
              {weekDays.map((day) => {
                const isSelected = selectedDate === day.date;

                const daySessions = sessions.filter(
                  (session) => session.date === day.date
                );

                return (
                  <button
                    key={day.date}
                    type="button"
                    onClick={() => setSelectedDate(day.date)}
                    className={`min-h-[90px] border-r border-gray-100 p-2 text-left transition last:border-r-0 sm:p-4 ${
                      isSelected
                        ? "bg-pf-purple-light"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 sm:text-xs">
                      {day.day}
                    </p>

                    <p
                      className={`mt-1 text-lg font-semibold ${
                        isSelected
                          ? "text-pf-purple"
                          : "text-pf-purple-dark"
                      }`}
                    >
                      {day.date}
                    </p>

                    {daySessions.length > 0 && (
                      <div className="mt-2 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-pf-purple" />

                        <span className="text-[10px] text-gray-500">
                          {daySessions.length} session
                          {daySessions.length > 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected day */}
            <div className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-pf-purple-dark">
                    {getDayName(selectedDate)}, September {selectedDate}
                  </h3>

                  <p className="mt-1 text-xs text-gray-400">
                    {selectedSessions.length} scheduled session
                    {selectedSessions.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowNewSession(true)}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-pf-purple transition hover:bg-pf-purple-light"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>

              {selectedSessions.length > 0 ? (
                <div className="space-y-3">
                  {selectedSessions.map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      onClick={() => setSelectedSession(session)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyDay onAdd={() => setShowNewSession(true)} />
              )}
            </div>
          </section>

          {/* Weekly availability summary */}
          <section className="mt-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold text-pf-purple-dark">
                  Weekly Availability
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Parents and the platform use these hours when matching
                  you with new tutoring requests.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAvailability(true)}
                className="flex w-fit items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-pf-purple transition hover:bg-pf-purple-light"
              >
                Edit Availability
              </button>
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {availability.map((item) => (
                <div
                  key={item.day}
                  className={`rounded-lg border p-3 ${
                    item.enabled
                      ? "border-gray-100 bg-gray-50"
                      : "border-gray-100 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-pf-purple-dark">
                      {item.day}
                    </span>

                    <span
                      className={`h-2 w-2 rounded-full ${
                        item.enabled
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                  </div>

                  <p className="mt-2 text-xs text-gray-400">
                    {item.enabled
                      ? `${item.start} – ${item.end}`
                      : "Unavailable"}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Availability modal */}
      {showAvailability && (
        <AvailabilityModal
          onClose={() => setShowAvailability(false)}
        />
      )}

      {/* New session modal */}
      {showNewSession && (
        <NewSessionModal
          onClose={() => setShowNewSession(false)}
        />
      )}

      {/* Session details modal */}
      {selectedSession && (
        <SessionDetailsModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </div>
  );
}

/* ========================================================= */
/* SESSION CARD                                               */
/* ========================================================= */

function SessionCard({ session, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl border border-gray-100 bg-gray-50 p-4 text-left transition hover:border-pf-purple/20 hover:bg-pf-purple-light/40"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pf-purple text-white">
            <BookIcon />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-medium text-pf-purple-dark">
                {session.subject}
              </h4>

              <span className="rounded-full bg-green-50 px-2 py-1 text-[10px] font-medium text-green-700">
                {session.status}
              </span>
            </div>

            <p className="mt-1 text-sm text-gray-500">
              {session.student}
            </p>

            <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
              <MapPin className="h-3.5 w-3.5" />
              {session.location}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm font-medium text-pf-purple-dark">
          <Clock3 className="h-4 w-4 text-pf-purple" />
          {session.start} – {session.end}
        </div>
      </div>
    </button>
  );
}

/* ========================================================= */
/* EMPTY DAY                                                  */
/* ========================================================= */

function EmptyDay({ onAdd }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 px-6 py-10 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-gray-50">
        <CalendarDays className="h-5 w-5 text-gray-400" />
      </div>

      <h4 className="mt-3 text-sm font-semibold text-pf-purple-dark">
        No sessions scheduled
      </h4>

      <p className="mt-1 text-xs text-gray-400">
        You don't have a session planned for this day.
      </p>

      <button
        type="button"
        onClick={onAdd}
        className="mt-4 text-sm font-medium text-pf-purple hover:underline"
      >
        Schedule a session
      </button>
    </div>
  );
}

/* ========================================================= */
/* AVAILABILITY MODAL                                         */
/* ========================================================= */

function AvailabilityModal({ onClose }) {
  const [days, setDays] = useState(availability);

  const toggleDay = (index) => {
    setDays((current) =>
      current.map((day, i) =>
        i === index
          ? { ...day, enabled: !day.enabled }
          : day
      )
    );
  };

  return (
    <Modal title="My Availability" onClose={onClose}>
      <p className="text-sm text-gray-500">
        Set the hours during which you are available for tutoring.
      </p>

      <div className="mt-5 space-y-3">
        {days.map((day, index) => (
          <div
            key={day.day}
            className="rounded-lg border border-gray-100 p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleDay(index)}
                  className={`relative h-5 w-9 rounded-full transition ${
                    day.enabled
                      ? "bg-pf-purple"
                      : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                      day.enabled
                        ? "left-[18px]"
                        : "left-0.5"
                    }`}
                  />
                </button>

                <span className="text-sm font-medium text-pf-purple-dark">
                  {day.day}
                </span>
              </div>

              {day.enabled && (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    defaultValue={day.start}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-pf-purple"
                  />

                  <span className="text-gray-400">to</span>

                  <input
                    type="time"
                    defaultValue={day.end}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-pf-purple"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg bg-pf-purple px-4 py-2.5 text-sm font-medium text-white"
        >
          Save Availability
        </button>
      </div>
    </Modal>
  );
}

/* ========================================================= */
/* NEW SESSION MODAL                                          */
/* ========================================================= */

function NewSessionModal({ onClose }) {
  return (
    <Modal title="Plan a Session" onClose={onClose}>
      <p className="text-sm text-gray-500">
        Schedule a tutoring session with one of your assigned students.
      </p>

      <div className="mt-5 space-y-4">
        <FormField label="Student">
          <select className="form-input">
            <option>Select student</option>
            <option>Junior D.</option>
            <option>Sarah M.</option>
            <option>David N.</option>
            <option>Grace T.</option>
          </select>
        </FormField>

        <FormField label="Subject">
          <select className="form-input">
            <option>Select subject</option>
            <option>Mathematics</option>
            <option>Physics</option>
            <option>English</option>
          </select>
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Date">
            <input type="date" className="form-input" />
          </FormField>

          <FormField label="Start time">
            <input type="time" className="form-input" />
          </FormField>
        </div>

        <FormField label="Duration">
          <select className="form-input">
            <option>1 hour</option>
            <option>1 hour 30 minutes</option>
            <option>2 hours</option>
          </select>
        </FormField>

        <FormField label="Location">
          <input
            type="text"
            placeholder="Teaching location"
            className="form-input"
          />
        </FormField>

        <FormField label="Notes">
          <textarea
            rows="3"
            placeholder="Optional notes..."
            className="form-input resize-none"
          />
        </FormField>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg bg-pf-purple px-4 py-2.5 text-sm font-medium text-white"
        >
          Schedule Session
        </button>
      </div>
    </Modal>
  );
}

/* ========================================================= */
/* SESSION DETAILS MODAL                                      */
/* ========================================================= */

function SessionDetailsModal({ session, onClose }) {
  return (
    <Modal title="Session Details" onClose={onClose}>
      <div className="rounded-xl bg-pf-purple-light p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-pf-purple text-white">
            <BookIcon />
          </div>

          <div>
            <h3 className="font-semibold text-pf-purple-dark">
              {session.subject}
            </h3>

            <p className="text-sm text-gray-500">
              {session.student}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <DetailRow
          icon={CalendarDays}
          label="Date"
          value={`${session.day}, September ${session.date}, 2026`}
        />

        <DetailRow
          icon={Clock3}
          label="Time"
          value={`${session.start} – ${session.end}`}
        />

        <DetailRow
          icon={MapPin}
          label="Location"
          value={session.location}
        />

        <DetailRow
          icon={CheckCircle2}
          label="Status"
          value={session.status}
        />
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg bg-pf-purple px-4 py-2.5 text-sm font-medium text-white"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}

/* ========================================================= */
/* MODAL                                                      */
/* ========================================================= */

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <h2 className="font-semibold text-pf-purple-dark">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-50 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

/* ========================================================= */
/* FORM FIELD                                                 */
/* ========================================================= */

function FormField({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-gray-500">
        {label}
      </span>

      {children}
    </label>
  );
}

/* ========================================================= */
/* DETAIL ROW                                                 */
/* ========================================================= */

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pf-purple-light text-pf-purple">
        <Icon className="h-4 w-4" />
      </div>

      <div>
        <p className="text-xs text-gray-400">{label}</p>

        <p className="mt-0.5 text-sm font-medium text-pf-purple-dark">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ========================================================= */
/* ICON                                                       */
/* ========================================================= */

function BookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-5 w-5"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </svg>
  );
}

/* ========================================================= */
/* HELPERS                                                    */
/* ========================================================= */

function getDayName(date) {
  const days = {
    21: "Monday",
    22: "Tuesday",
    23: "Wednesday",
    24: "Thursday",
    25: "Friday",
    26: "Saturday",
    27: "Sunday",
  };

  return days[date] || "Day";
}