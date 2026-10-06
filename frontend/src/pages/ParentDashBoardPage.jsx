import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  GraduationCap,
  Search,
  UsersRound,
} from "lucide-react";
import ParentSidebar from "../components/parent/ParentSidebar";
import { apiFetch } from "../lib/apiClient";


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

// Enfant : first_name / last_name sur le learner. Élève auto-inscrit : nom du compte.
function getLearnerName(learner) {
  if (!learner) return "Student";
  const own = [learner.first_name, learner.last_name].filter(Boolean).join(" ");
  if (own) return own;
  return getUserName(learner.user) ?? "Student";
}

function formatMoney(amount) {
  const number = Number(amount);
  if (!Number.isFinite(number)) return "—";
  return `${number.toLocaleString("fr-FR")} FCFA`;
}

function sessionStart(session) {
  const date = String(session.session_date ?? "").slice(0, 10);
  const time = String(session.start_time ?? "00:00:00").slice(0, 8);
  const value = new Date(`${date}T${time}`);
  return Number.isNaN(value.getTime()) ? null : value;
}

function dayLabel(date) {
  if (!date) return "—";
  const startOfDay = (d) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diff = Math.round((startOfDay(date) - startOfDay(new Date())) / 86400000);

  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function roundScore(value) {
  return Math.round(value * 10) / 10;
}

// État d'une demande : on privilégie l'affectation la plus avancée.
function requestState(request) {
  const assignments = request.assignments ?? [];

  if (assignments.some((a) => a.status === "active")) return "Active";
  if (assignments.some((a) => a.status === "pending")) return "Awaiting validation";
  if (request.status === "cancelled") return "Cancelled";
  return "Searching";
}

function pickAssignment(request) {
  const assignments = request.assignments ?? [];
  return (
    assignments.find((a) => a.status === "active") ??
    assignments.find((a) => a.status === "pending") ??
    null
  );
}

const CHILD_COLORS = ["bg-pf-purple", "bg-pf-purple-dark"];

/* ========================================================= */
/* SMALL COMPONENTS                                            */
/* ========================================================= */

function StatCard({ icon: Icon, label, value, description }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pf-purple-light text-pf-purple">
          <Icon className="h-5 w-5" />
        </div>

        <ChevronRight className="h-4 w-4 text-gray-300" />
      </div>

      <div className="mt-4">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <p className="mt-1 text-sm font-medium text-gray-700">{label}</p>
        <p className="mt-1 text-xs text-gray-400">{description}</p>
      </div>
    </div>
  );
}

function ProgressBar({ value }) {
  const width = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
      <div
        className="h-full rounded-full bg-pf-purple transition-all"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Active: "bg-green-50 text-green-700",
    Completed: "bg-green-50 text-green-700",
    Scheduled: "bg-pf-purple-light text-pf-purple",
    "Awaiting validation": "bg-amber-50 text-amber-700",
    Searching: "bg-amber-50 text-amber-700",
    Cancelled: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
        styles[status] || "bg-gray-50 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

/* ========================================================= */
/* PAGE                                                        */
/* ========================================================= */

export default function ParentDashboardPage() {
  const [firstName, setFirstName] = useState("");
  const [children, setChildren] = useState([]);
  const [requests, setRequests] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [resultsByChild, setResultsByChild] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAll = useCallback(async () => {
    const [meRes, childrenRes, requestsRes, sessionsRes, paymentsRes] =
      await Promise.all([
        apiFetch("/auth/me"),
        apiFetch("/me/children"),
        apiFetch("/me/tutoring-requests"),
        apiFetch("/me/sessions?upcoming=1"),
        apiFetch("/me/payments"),
      ]);

    const childList = toList(childrenRes);

    // Résultats de chaque enfant : un échec n'empêche pas d'afficher le reste.
    const settled = await Promise.allSettled(
      childList.map((child) => apiFetch(`/learners/${child.id}/results`))
    );

    const results = {};
    childList.forEach((child, index) => {
      const outcome = settled[index];
      results[child.id] =
        outcome.status === "fulfilled" ? toList(outcome.value) : [];
    });

    const user = meRes?.user ?? meRes?.data?.user ?? null;

    setFirstName(user?.first_name ?? "");
    setChildren(childList);
    setRequests(toList(requestsRes));
    setSessions(toList(sessionsRes));
    setPayments(toList(paymentsRes));
    setResultsByChild(results);
  }, []);

  useEffect(() => {
    loadAll()
      .catch((err) =>
        setError(err?.message || "Unable to load your dashboard.")
      )
      .finally(() => setLoading(false));
  }, [loadAll]);

  /* ----- Données dérivées ----- */

  const activeAssignments = useMemo(
    () =>
      requests.flatMap((request) =>
        (request.assignments ?? [])
          .filter((assignment) => assignment.status === "active")
          .map((assignment) => ({ assignment, request }))
      ),
    [requests]
  );

  const activeTeachers = useMemo(
    () => new Set(activeAssignments.map(({ assignment }) => assignment.teacher_id)).size,
    [activeAssignments]
  );

  const upcomingSessions = useMemo(
    () =>
      sessions
        .map((session) => ({ session, start: sessionStart(session) }))
        .filter((item) => item.start)
        .sort((a, b) => a.start - b.start),
    [sessions]
  );

  const sessionsNext7Days = useMemo(() => {
    const limit = new Date();
    limit.setDate(limit.getDate() + 7);
    return upcomingSessions.filter((item) => item.start <= limit).length;
  }, [upcomingSessions]);

  const pendingAmount = useMemo(
    () =>
      payments
        .filter((payment) => payment.status === "pending")
        .reduce((total, payment) => total + Number(payment.amount || 0), 0),
    [payments]
  );

  const childCards = useMemo(
    () =>
      children.map((child, index) => {
        const results = resultsByChild[child.id] ?? [];
        const scores = results
          .map((result) => Number(result.score))
          .filter(Number.isFinite);

        const subjects = new Set(
          activeAssignments
            .filter(({ request }) => request.learner_id === child.id)
            .map(({ request }) => request.subject_id)
        );

        const latest = [...results].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        )[0];

        return {
          id: child.id,
          name: getLearnerName(child),
          className: child.classroom?.name ?? child.level?.name ?? null,
          school: child.school_name ?? null,
          color: CHILD_COLORS[index % CHILD_COLORS.length],
          activeSubjects: subjects.size,
          resultsCount: scores.length,
          average: scores.length
            ? scores.reduce((sum, score) => sum + score, 0) / scores.length
            : null,
          latest,
        };
      }),
    [children, resultsByChild, activeAssignments]
  );

  const recentRequests = requests.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F8F8FA]">
      <ParentSidebar />

      <main className="min-h-screen lg:ml-64">
        <div className="mx-auto max-w-[1500px] px-5 py-6 sm:px-7 lg:px-10 lg:py-8">
          {/* HEADER */}
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">Parent Portal</p>

              <h1 className="mt-1 text-2xl font-semibold text-gray-900">
                Welcome back{firstName ? `, ${firstName}` : ""}
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Here's what's happening with your children's learning.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="relative rounded-lg border border-gray-200 bg-white p-2.5 text-gray-600 shadow-sm hover:bg-gray-50"
              >
                <span className="sr-only">Notifications</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 17h5l-1.5-1.7A2 2 0 0 1 18 14V10a6 6 0 0 0-12 0v4a2 2 0 0 1-.5 1.3L4 17h5m6 0a3 3 0 0 1-6 0"
                  />
                </svg>
              </button>
            </div>
          </header>

          {error && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600"
            >
              {error}
            </div>
          )}

          {/* STATS */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={UsersRound}
              label="My Children"
              value={loading ? "—" : children.length}
              description="Currently enrolled"
            />

            <StatCard
              icon={GraduationCap}
              label="Active Teachers"
              value={loading ? "—" : activeTeachers}
              description="Currently teaching"
            />

            <StatCard
              icon={CalendarDays}
              label="Upcoming Sessions"
              value={loading ? "—" : sessionsNext7Days}
              description="Next 7 days"
            />

            <StatCard
              icon={CreditCard}
              label="Pending Payments"
              value={loading ? "—" : formatMoney(pendingAmount)}
              description="Awaiting payment"
            />
          </section>

          {/* MAIN GRID */}
          <div className="mt-6 grid gap-6 xl:grid-cols-3">
            {/* CHILDREN */}
            <section
              id="children"
              className="xl:col-span-2 rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    My Children
                  </h2>
                  <p className="mt-1 text-xs text-gray-400">
                    Overview of your children's learning
                  </p>
                </div>
              </div>

              {loading ? (
                <p className="py-10 text-center text-sm text-gray-400">
                  Loading your children…
                </p>
              ) : childCards.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-sm text-gray-500">
                    You have not added any child yet.
                  </p>

                 
                </div>
              ) : (
                <div className="mt-5 space-y-4">
                  {childCards.map((child) => (
                    <div
                      key={child.id}
                      className="rounded-xl border border-gray-100 p-4 transition hover:border-pf-purple-light"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${child.color}`}
                          >
                            {child.name
                              .split(" ")
                              .map((word) => word[0])
                              .slice(0, 2)
                              .join("")}
                          </div>

                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">
                              {child.name}
                            </h3>
                            <p className="mt-0.5 text-xs text-gray-500">
                              {[child.className, child.school]
                                .filter(Boolean)
                                .join(" · ") || "—"}
                            </p>
                          </div>
                        </div>

                        <div className="min-w-[180px] sm:w-48">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              Average score
                            </span>
                            <span className="text-xs font-semibold text-pf-purple">
                              {child.average === null
                                ? "—"
                                : `${roundScore(child.average)}/100`}
                            </span>
                          </div>

                          <ProgressBar value={child.average ?? 0} />

                          <p className="mt-2 text-[11px] text-gray-400">
                            {child.activeSubjects} active subject
                            {child.activeSubjects !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* QUICK ACTIONS */}
            <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Quick Actions
                </h2>
                <p className="mt-1 text-xs text-gray-400">
                  Common parent actions
                </p>
              </div>

              <div className="mt-5 space-y-2">
                <a
                  href="/search"
                  className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 transition hover:border-pf-purple-light hover:bg-pf-purple-light/30"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-pf-purple-light text-pf-purple">
                    <Search className="h-4 w-4" />
                  </span>

                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      Find a Teacher
                    </p>
                    <p className="text-[11px] text-gray-400">
                      Find the right teacher
                    </p>
                  </div>

                  <ChevronRight className="h-4 w-4 text-gray-300" />
                </a>

                <a
                  href="/suivi-demande"
                  className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 transition hover:border-pf-purple-light hover:bg-pf-purple-light/30"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      Tutoring Requests
                    </p>
                    <p className="text-[11px] text-gray-400">
                      Track your requests
                    </p>
                  </div>

                  <ChevronRight className="h-4 w-4 text-gray-300" />
                </a>

                <a
                  href="/parent-schedule"
                  className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 transition hover:border-pf-purple-light hover:bg-pf-purple-light/30"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-pf-purple-light text-pf-purple">
                    <CalendarDays className="h-4 w-4" />
                  </span>

                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      View Schedule
                    </p>
                    <p className="text-[11px] text-gray-400">
                      Check upcoming sessions
                    </p>
                  </div>

                  <ChevronRight className="h-4 w-4 text-gray-300" />
                </a>

                <a
                  href="/paiements"
                  className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 transition hover:border-pf-purple-light hover:bg-pf-purple-light/30"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-pf-purple-light text-pf-purple">
                    <CreditCard className="h-4 w-4" />
                  </span>

                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      Make a Payment
                    </p>
                    <p className="text-[11px] text-gray-400">
                      Manage your payments
                    </p>
                  </div>

                  <ChevronRight className="h-4 w-4 text-gray-300" />
                </a>
              </div>
            </section>
          </div>

          {/* LOWER GRID */}
          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            {/* UPCOMING SESSIONS */}
            <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    Upcoming Sessions
                  </h2>
                  <p className="mt-1 text-xs text-gray-400">
                    Your children's next tutoring sessions
                  </p>
                </div>

                <a
                  href="/parent-schedule"
                  className="text-xs font-medium text-pf-purple hover:text-pf-purple-dark"
                >
                  View schedule
                </a>
              </div>

              {loading ? (
                <p className="py-10 text-center text-sm text-gray-400">
                  Loading sessions…
                </p>
              ) : upcomingSessions.length === 0 ? (
                <p className="py-10 text-center text-sm text-gray-400">
                  No session planned yet.
                </p>
              ) : (
                <div className="mt-5 divide-y divide-gray-100">
                  {upcomingSessions.slice(0, 3).map(({ session, start }) => {
                    const request = session.assignment?.tutoring_request;
                    const teacher = getUserName(session.assignment?.teacher?.user);

                    return (
                      <div
                        key={session.id}
                        className="flex gap-4 py-4 first:pt-0 last:pb-0"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pf-purple-light text-pf-purple">
                          <CalendarDays className="h-4 w-4" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">
                                {request?.subject?.name ?? "—"}
                              </h3>

                              <p className="mt-0.5 text-xs text-gray-500">
                                {[teacher, getLearnerName(request?.learner)]
                                  .filter(Boolean)
                                  .join(" · ")}
                              </p>
                            </div>

                            <StatusBadge status="Scheduled" />
                          </div>

                          <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-gray-400">
                            <span className="flex items-center gap-1">
                              <CalendarDays className="h-3.5 w-3.5" />
                              {dayLabel(start)}
                            </span>

                            <span className="flex items-center gap-1">
                              <Clock3 className="h-3.5 w-3.5" />
                              {String(session.start_time).slice(0, 5)} -{" "}
                              {String(session.end_time).slice(0, 5)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* REQUESTS */}
            <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    Recent Tutoring Requests
                  </h2>
                  <p className="mt-1 text-xs text-gray-400">
                    Latest teacher requests
                  </p>
                </div>

                <a
                  href="/suivi-demande"
                  className="text-xs font-medium text-pf-purple hover:text-pf-purple-dark"
                >
                  View all
                </a>
              </div>

              {loading ? (
                <p className="py-10 text-center text-sm text-gray-400">
                  Loading requests…
                </p>
              ) : recentRequests.length === 0 ? (
                <p className="py-10 text-center text-sm text-gray-400">
                  You have not made any request yet.
                </p>
              ) : (
                <div className="mt-5 space-y-3">
                  {recentRequests.map((request) => {
                    const assignment = pickAssignment(request);
                    const teacher = getUserName(assignment?.teacher?.user);

                    return (
                      <div
                        key={request.id}
                        className="rounded-lg border border-gray-100 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">
                              {request.subject?.name ?? "—"}
                            </h3>

                            <p className="mt-1 text-xs text-gray-500">
                              {[getLearnerName(request.learner), teacher]
                                .filter(Boolean)
                                .join(" · ")}
                            </p>
                          </div>

                          <StatusBadge status={requestState(request)} />
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-[11px] text-gray-400">
                            {formatDate(request.created_at)}
                          </span>

                          <a
                            href="/suivi-demande"
                            className="flex items-center gap-1 text-[11px] font-medium text-pf-purple"
                          >
                            View request
                            <ArrowRight className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* PROGRESS */}
          <section className="mt-6 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Children's Progress
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Based on the scores recorded by their teachers
                </p>
              </div>

              <a
                href="/child-progress"
                className="flex items-center gap-1 text-xs font-medium text-pf-purple hover:text-pf-purple-dark"
              >
                Detailed progress
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>

            {childCards.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-400">
                Add a child to follow their results.
              </p>
            ) : (
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {childCards.map((child) => (
                  <div key={child.id} className="rounded-xl bg-[#FAFAFC] p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                          {child.name}
                        </h3>
                        <p className="mt-0.5 text-xs text-gray-400">
                          {child.className ?? "—"}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 text-pf-purple">
                        <BarChart3 className="h-4 w-4" />
                        <span className="text-sm font-semibold">
                          {child.average === null
                            ? "—"
                            : `${roundScore(child.average)}/100`}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <ProgressBar value={child.average ?? 0} />
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-gray-400">
                      <span>
                        {child.resultsCount} result
                        {child.resultsCount !== 1 ? "s" : ""}
                      </span>

                      {child.latest && (
                        <span className="truncate text-right">
                          Latest: {child.latest.evaluation?.title ?? "Assessment"}{" "}
                          · {roundScore(Number(child.latest.score))}/100
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* FOOTER SUMMARY */}
          <div className="mt-6 flex flex-col gap-3 rounded-xl border border-pf-purple-light bg-pf-purple-light/30 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-pf-purple">
                <CheckCircle2 className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-800">
                  School results
                </p>
                <p className="text-xs text-gray-500">
                  See the detailed results of your children.
                </p>
              </div>
            </div>

            <a
              href="/resultats-scolaires"
              className="text-xs font-semibold text-pf-purple hover:text-pf-purple-dark"
            >
              View results →
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

