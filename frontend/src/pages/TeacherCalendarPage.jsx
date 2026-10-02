import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Plus,
  UserRound,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
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

// --- Dates (toutes en heure locale) ---

function dateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseKey(key) {
  return new Date(`${key}T00:00:00`);
}

function addDays(date, amount) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + amount);
  return copy;
}

function mondayOf(date) {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const offset = (copy.getDay() + 6) % 7; // lundi = 0
  copy.setDate(copy.getDate() - offset);
  return copy;
}

function formatWeekLabel(monday) {
  const sunday = addDays(monday, 6);
  const fmt = (d) =>
    d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return `${fmt(monday)} – ${fmt(sunday)}, ${sunday.getFullYear()}`;
}

function formatLongDate(key) {
  return parseKey(key).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function formatTime(value) {
  return value ? String(value).slice(0, 5) : "";
}

function addMinutesToTime(time, minutes) {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  if (total >= 24 * 60) return null;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(
    total % 60
  ).padStart(2, "0")}`;
}

// Adapte une séance de l'API au format d'affichage de la page.
function toView(session) {
  const request = session.assignment?.tutoring_request;
  const learner = request?.learner;

  return {
    id: session.id,
    dateKey: String(session.session_date ?? "").slice(0, 10),
    start: formatTime(session.start_time),
    end: formatTime(session.end_time),
    student: getLearnerName(learner),
    subject: request?.subject?.name ?? "—",
    location: session.location ?? request?.location ?? learner?.location ?? "—",
    status: session.status,
    confirmedByTeacher: Boolean(session.confirmed_by_teacher_at),
    confirmedByParent: Boolean(session.confirmed_by_parent_at),
  };
}

const STATUS_STYLE = {
  scheduled: "bg-green-50 text-green-700",
  completed: "bg-gray-100 text-gray-600",
};

// Mêmes valeurs que la contrainte chk_availability_day en base.
const DAYS = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

/* ========================================================= */
/* PAGE                                                        */
/* ========================================================= */

export default function TeacherCalendarPage() {
  const [weekStart, setWeekStart] = useState(() => mondayOf(new Date()));
  const [selectedKey, setSelectedKey] = useState(() => dateKey(new Date()));
  const [rawSessions, setRawSessions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showNewSession, setShowNewSession] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [availability, setAvailability] = useState([]);
  const [showAvailability, setShowAvailability] = useState(false);

  const loadSessions = useCallback(async () => {
    const response = await apiFetch("/me/sessions");
    setRawSessions(toList(response));
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [sessionsRes, assignmentsRes, availabilityRes] =
          await Promise.all([
            apiFetch("/me/sessions"),
            apiFetch("/me/assignments"),
            apiFetch("/me/availability"),
          ]);

        if (cancelled) return;
        setRawSessions(toList(sessionsRes));
        setAssignments(toList(assignmentsRes));
        setAvailability(toList(availabilityRes));
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Unable to load your calendar.");
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

  const sessions = useMemo(() => rawSessions.map(toView), [rawSessions]);

  const activeAssignments = useMemo(
    () =>
      assignments
        .filter((assignment) => assignment.status === "active")
        .map((assignment) => {
          const request = assignment.tutoring_request;
          const learner = request?.learner;

          return {
            id: assignment.id,
            label: `${getLearnerName(learner)} — ${
              request?.subject?.name ?? "—"
            }`,
            location: request?.location ?? learner?.location ?? "",
          };
        }),
    [assignments]
  );

  const weekDays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const date = addDays(weekStart, i);
        return {
          key: dateKey(date),
          day: date.toLocaleDateString("en-GB", { weekday: "short" }),
          date: date.getDate(),
        };
      }),
    [weekStart]
  );

  const sessionsByDay = useMemo(() => {
    const map = new Map();
    sessions.forEach((session) => {
      if (!map.has(session.dateKey)) map.set(session.dateKey, []);
      map.get(session.dateKey).push(session);
    });
    map.forEach((list) => list.sort((a, b) => a.start.localeCompare(b.start)));
    return map;
  }, [sessions]);

  const availabilityByDay = useMemo(() => {
    const map = new Map();
    availability.forEach((slot) => {
      if (!map.has(slot.day_of_week)) map.set(slot.day_of_week, []);
      map.get(slot.day_of_week).push(slot);
    });
    map.forEach((list) =>
      list.sort((a, b) => String(a.start_time).localeCompare(String(b.start_time)))
    );
    return map;
  }, [availability]);

  const selectedSessions = sessionsByDay.get(selectedKey) ?? [];
  const selectedSession =
    sessions.find((session) => session.id === selectedSessionId) ?? null;

  const goToWeek = (monday) => {
    setWeekStart(monday);
    setSelectedKey(dateKey(monday));
  };

  const goToday = () => {
    const today = new Date();
    setWeekStart(mondayOf(today));
    setSelectedKey(dateKey(today));
  };

  const handleConfirm = async (session) => {
    setConfirming(true);
    setError("");

    try {
      const response = await apiFetch(`/sessions/${session.id}/confirm`, {
        method: "PATCH",
      });
      const updated = response?.data ?? response;

      // La réponse n'embarque pas les relations : on fusionne avec l'existant.
      setRawSessions((current) =>
        current.map((item) =>
          item.id === session.id ? { ...item, ...updated } : item
        )
      );
    } catch (err) {
      setError(err?.message || "Unable to confirm this session.");
    } finally {
      setConfirming(false);
    }
  };

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
              Your teaching sessions, week by week.
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

          {/* Calendar */}
          <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 p-5">
              <button
                type="button"
                onClick={() => goToWeek(addDays(weekStart, -7))}
                className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-50"
                aria-label="Previous week"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={goToday}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-pf-purple-dark hover:bg-gray-50"
              >
                Today
              </button>

              <button
                type="button"
                onClick={() => goToWeek(addDays(weekStart, 7))}
                className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-50"
                aria-label="Next week"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <span className="ml-2 text-sm font-semibold text-pf-purple-dark">
                {formatWeekLabel(weekStart)}
              </span>

              <button
                type="button"
                onClick={() => setShowAvailability(true)}
                className="ml-auto flex items-center gap-2 rounded-lg border border-pf-purple/20 bg-pf-purple-light px-4 py-2.5 text-sm font-medium text-pf-purple transition hover:bg-pf-purple-light/70"
              >
                <Clock3 className="h-4 w-4" />
                My Availability
              </button>
            </div>

            {/* Week */}
            <div className="grid grid-cols-7 border-b border-gray-100">
              {weekDays.map((day) => {
                const isSelected = selectedKey === day.key;
                const count = sessionsByDay.get(day.key)?.length ?? 0;

                return (
                  <button
                    key={day.key}
                    type="button"
                    onClick={() => setSelectedKey(day.key)}
                    className={`min-h-[90px] border-r border-gray-100 p-2 text-left transition last:border-r-0 sm:p-4 ${
                      isSelected ? "bg-pf-purple-light" : "hover:bg-gray-50"
                    }`}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 sm:text-xs">
                      {day.day}
                    </p>

                    <p
                      className={`mt-1 text-lg font-semibold ${
                        isSelected ? "text-pf-purple" : "text-pf-purple-dark"
                      }`}
                    >
                      {day.date}
                    </p>

                    {count > 0 && (
                      <div className="mt-2 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-pf-purple" />

                        <span className="text-[10px] text-gray-500">
                          {count} session{count > 1 ? "s" : ""}
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
                    {formatLongDate(selectedKey)}
                  </h3>

                  <p className="mt-1 text-xs text-gray-400">
                    {selectedSessions.length} session
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

              {loading ? (
                <p className="py-8 text-center text-sm text-gray-400">
                  Loading your sessions…
                </p>
              ) : selectedSessions.length > 0 ? (
                <div className="space-y-3">
                  {selectedSessions.map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      onClick={() => setSelectedSessionId(session.id)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyDay onAdd={() => setShowNewSession(true)} />
              )}
            </div>
          </section>

          {/* Weekly availability */}
          <section className="mt-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold text-pf-purple-dark">
                  Weekly Availability
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  The platform uses these hours when matching you with new
                  tutoring requests.
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
              {DAYS.map((day) => {
                const slots = availabilityByDay.get(day.key) ?? [];
                const enabled = slots.length > 0;

                return (
                  <div
                    key={day.key}
                    className={`rounded-lg border border-gray-100 p-3 ${
                      enabled ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-pf-purple-dark">
                        {day.label}
                      </span>

                      <span
                        className={`h-2 w-2 rounded-full ${
                          enabled ? "bg-green-500" : "bg-gray-300"
                        }`}
                      />
                    </div>

                    <p className="mt-2 text-xs text-gray-400">
                      {enabled
                        ? slots
                            .map(
                              (slot) =>
                                `${formatTime(slot.start_time)} – ${formatTime(
                                  slot.end_time
                                )}`
                            )
                            .join(", ")
                        : "Unavailable"}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      {showNewSession && (
        <NewSessionModal
          assignments={activeAssignments}
          defaultDate={selectedKey}
          onClose={() => setShowNewSession(false)}
          onCreated={async (createdDate) => {
            setShowNewSession(false);
            setError("");
            try {
              await loadSessions();
              setWeekStart(mondayOf(parseKey(createdDate)));
              setSelectedKey(createdDate);
            } catch (err) {
              setError(err?.message || "Session created, but the calendar could not refresh.");
            }
          }}
        />
      )}

      {showAvailability && (
        <AvailabilityModal
          availability={availability}
          onClose={() => setShowAvailability(false)}
          onSaved={(list) => {
            setAvailability(list);
            setShowAvailability(false);
          }}
        />
      )}

      {selectedSession && (
        <SessionDetailsModal
          session={selectedSession}
          confirming={confirming}
          onConfirm={() => handleConfirm(selectedSession)}
          onClose={() => setSelectedSessionId(null)}
        />
      )}
    </div>
  );
}

/* ========================================================= */
/* SESSION CARD                                                */
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
            <BookOpen className="h-5 w-5" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-medium text-pf-purple-dark">
                {session.subject}
              </h4>

              <span
                className={`rounded-full px-2 py-1 text-[10px] font-medium ${
                  STATUS_STYLE[session.status] ?? "bg-gray-100 text-gray-600"
                }`}
              >
                {capitalize(session.status)}
              </span>
            </div>

            <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
              <UserRound className="h-3.5 w-3.5" />
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
/* NEW SESSION MODAL                                           */
/* ========================================================= */

const DURATIONS = [
  { value: 60, label: "1 hour" },
  { value: 90, label: "1 hour 30 minutes" },
  { value: 120, label: "2 hours" },
];

function NewSessionModal({ assignments, defaultDate, onClose, onCreated }) {
  const [assignmentId, setAssignmentId] = useState("");
  const [date, setDate] = useState(defaultDate);
  const [start, setStart] = useState("");
  const [duration, setDuration] = useState(60);
  const [location, setLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleAssignmentChange = (id) => {
    setAssignmentId(id);
    const chosen = assignments.find((assignment) => assignment.id === id);
    if (chosen && !location) setLocation(chosen.location);
  };

  const handleSubmit = async () => {
    setFormError("");

    if (!assignmentId || !date || !start) {
      setFormError("Please choose a student, a date and a start time.");
      return;
    }

    const end = addMinutesToTime(start, duration);
    if (!end) {
      setFormError("The session must end before midnight.");
      return;
    }

    setSubmitting(true);

    try {
      await apiFetch(`/assignments/${assignmentId}/sessions`, {
        method: "POST",
        body: JSON.stringify({
          mode: "single",
          session_date: date,
          start_time: start,
          end_time: end,
          location: location.trim() || undefined,
        }),
      });

      await onCreated(date);
    } catch (err) {
      setFormError(err?.message || "Unable to schedule this session.");
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Plan a Session" onClose={onClose}>
      <p className="text-sm text-gray-500">
        Schedule a tutoring session for one of your active assignments.
      </p>

      {assignments.length === 0 ? (
        <p className="mt-5 rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
          You have no active assignment yet. Sessions can only be planned once
          an assignment has been validated.
        </p>
      ) : (
        <div className="mt-5 space-y-4">
          <FormField label="Student and subject">
            <select
              className="form-input"
              value={assignmentId}
              onChange={(e) => handleAssignmentChange(e.target.value)}
            >
              <option value="">Select an assignment</option>
              {assignments.map((assignment) => (
                <option key={assignment.id} value={assignment.id}>
                  {assignment.label}
                </option>
              ))}
            </select>
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Date">
              <input
                type="date"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </FormField>

            <FormField label="Start time">
              <input
                type="time"
                className="form-input"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </FormField>
          </div>

          <FormField label="Duration">
            <select
              className="form-input"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            >
              {DURATIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Location">
            <input
              type="text"
              placeholder="Teaching location"
              className="form-input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </FormField>
        </div>
      )}

      {formError && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {formError}
        </p>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600"
        >
          Cancel
        </button>

        {assignments.length > 0 && (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-lg bg-pf-purple px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Scheduling…" : "Schedule Session"}
          </button>
        )}
      </div>
    </Modal>
  );
}

/* ========================================================= */
/* SESSION DETAILS MODAL                                       */
/* ========================================================= */

function SessionDetailsModal({ session, confirming, onConfirm, onClose }) {
  const canConfirm = session.status === "scheduled" && !session.confirmedByTeacher;

  return (
    <Modal title="Session Details" onClose={onClose}>
      <div className="rounded-xl bg-pf-purple-light p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-pf-purple text-white">
            <BookOpen className="h-5 w-5" />
          </div>

          <div>
            <h3 className="font-semibold text-pf-purple-dark">
              {session.subject}
            </h3>

            <p className="text-sm text-gray-500">{session.student}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <DetailRow
          icon={CalendarDays}
          label="Date"
          value={formatLongDate(session.dateKey)}
        />

        <DetailRow
          icon={Clock3}
          label="Time"
          value={`${session.start} – ${session.end}`}
        />

        <DetailRow icon={MapPin} label="Location" value={session.location} />

        <DetailRow
          icon={CheckCircle2}
          label="Status"
          value={capitalize(session.status)}
        />

        <DetailRow
          icon={CheckCircle2}
          label="Confirmations"
          value={`You: ${session.confirmedByTeacher ? "confirmed" : "not yet"} · Parent: ${
            session.confirmedByParent ? "confirmed" : "not yet"
          }`}
        />
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600"
        >
          Close
        </button>

        {canConfirm && (
          <button
            type="button"
            onClick={onConfirm}
            disabled={confirming}
            className="rounded-lg bg-pf-purple px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {confirming ? "Confirming…" : "Confirm session held"}
          </button>
        )}
      </div>
    </Modal>
  );
}

/* ========================================================= */
/* MODAL + SMALL COMPONENTS                                    */
/* ========================================================= */

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <h2 className="font-semibold text-pf-purple-dark">{title}</h2>

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
/* AVAILABILITY MODAL                                          */
/* ========================================================= */

function AvailabilityModal({ availability, onClose, onSaved }) {
  // Un créneau par jour dans l'interface. Si la base en contient plusieurs
  // pour un même jour, on avertit : l'enregistrement ne garde que le premier.
  const [days, setDays] = useState(() =>
    DAYS.map((day) => {
      const slots = availability
        .filter((slot) => slot.day_of_week === day.key)
        .sort((a, b) =>
          String(a.start_time).localeCompare(String(b.start_time))
        );
      const first = slots[0];

      return {
        key: day.key,
        label: day.label,
        enabled: slots.length > 0,
        start: first ? formatTime(first.start_time) : "",
        end: first ? formatTime(first.end_time) : "",
        hasExtra: slots.length > 1,
      };
    })
  );
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const update = (index, changes) =>
    setDays((current) =>
      current.map((day, i) => (i === index ? { ...day, ...changes } : day))
    );

  const toggle = (index) => {
    const day = days[index];

    if (day.enabled) {
      update(index, { enabled: false });
    } else {
      update(index, {
        enabled: true,
        start: day.start || "14:00",
        end: day.end || "18:00",
      });
    }
  };

  const handleSave = async () => {
    setFormError("");

    const slots = days.filter((day) => day.enabled);
    const invalid = slots.find(
      (day) => !day.start || !day.end || day.end <= day.start
    );

    if (invalid) {
      setFormError(
        `Check the hours for ${invalid.label}: the end time must be after the start time.`
      );
      return;
    }

    setSaving(true);

    try {
      const response = await apiFetch("/me/availability", {
        method: "PUT",
        body: JSON.stringify({
          slots: slots.map((day) => ({
            day_of_week: day.key,
            start_time: day.start,
            end_time: day.end,
          })),
        }),
      });

      onSaved(toList(response));
    } catch (err) {
      setFormError(err?.message || "Unable to save your availability.");
      setSaving(false);
    }
  };

  return (
    <Modal title="My Availability" onClose={onClose}>
      <p className="text-sm text-gray-500">
        Set the hours during which you are available for tutoring.
      </p>

      <div className="mt-5 space-y-3">
        {days.map((day, index) => (
          <div key={day.key} className="rounded-lg border border-gray-100 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={day.enabled}
                  aria-label={`Available on ${day.label}`}
                  onClick={() => toggle(index)}
                  className={`relative h-5 w-9 rounded-full transition ${
                    day.enabled ? "bg-pf-purple" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                      day.enabled ? "left-[18px]" : "left-0.5"
                    }`}
                  />
                </button>

                <span className="text-sm font-medium text-pf-purple-dark">
                  {day.label}
                </span>
              </div>

              {day.enabled && (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={day.start}
                    onChange={(e) => update(index, { start: e.target.value })}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-pf-purple"
                  />

                  <span className="text-gray-400">to</span>

                  <input
                    type="time"
                    value={day.end}
                    onChange={(e) => update(index, { end: e.target.value })}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-pf-purple"
                  />
                </div>
              )}
            </div>

            {day.enabled && day.hasExtra && (
              <p className="mt-2 text-xs text-amber-600">
                You had several time ranges on this day. Saving keeps only the
                first one.
              </p>
            )}
          </div>
        ))}
      </div>

      {formError && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {formError}
        </p>
      )}

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
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-pf-purple px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Availability"}
        </button>
      </div>
    </Modal>
  );
}