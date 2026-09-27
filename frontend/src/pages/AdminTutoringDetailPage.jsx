import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Coins,
  GraduationCap,
  MapPin,
  MessageSquare,
  UserRound,
  UsersRound,
  XCircle,
} from "lucide-react";
import SidebarAdmin from "../components/admin/SidebarAdmin";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../lib/apiClient";

export default function AdminTutoringDetailsPage() {
  const [tutoring, setTutoring] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    async function fetchTutoring() {
      setLoading(true);
      setError("");
      try {
        const response = await apiFetch(`/assignments/${id}`);
        setTutoring(response?.data ?? response);
      } catch (fetchError) {
        setError(fetchError.message || "Unable to load this tutoring assignment.");
      } finally {
        setLoading(false);
      }
    }

    fetchTutoring();
  }, [id]);

  const request = tutoring?.tutoringRequest ?? tutoring?.tutoring_request;
  const learner = request?.learner;
  const teacher = tutoring?.teacher;
  const sessions = tutoring?.sessions ?? [];
  const payments = tutoring?.payments ?? [];
  const completedSessions = sessions.filter((session) => session.status?.toLowerCase() === "completed").length;
  const confirmedSessions = sessions.filter((session) => session.confirmed_by_teacher_at && session.confirmed_by_parent_at).length;
  const paidPayments = payments.filter((payment) => payment.status?.toLowerCase() === "paid");
  const totalPaid = paidPayments.reduce((total, payment) => total + Number(payment.amount ?? 0), 0);
  const totalCommission = paidPayments.reduce((total, payment) => total + Number(payment.commission_amount ?? 0), 0);
  const totalTeacherEarnings = paidPayments.reduce((total, payment) => total + Number(payment.teacher_amount ?? 0), 0);
  const latestPayment = [...payments].sort((a, b) => new Date(b.created_at ?? 0) - new Date(a.created_at ?? 0))[0];
  const nextSession = [...sessions]
    .filter((session) => new Date(`${session.session_date}T${session.start_time ?? "00:00"}`) >= new Date())
    .sort((a, b) => new Date(a.session_date) - new Date(b.session_date))[0];

  async function cancelTutoring() {
    if (!window.confirm("Cancel this tutoring assignment?")) return;
    setSaving(true);
    setError("");
    try {
      const response = await apiFetch(`/assignments/${id}/cancel`, { method: "PATCH" });
      setTutoring((current) => ({ ...current, ...(response?.data ?? response) }));
    } catch (cancelError) {
      setError(cancelError.message || "Unable to cancel this assignment.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <DetailPageState message="Loading tutoring assignment..." />;
  }

  if (error && !tutoring) {
    return <DetailPageState message={error} isError />;
  }

  if (!tutoring) {
    return <DetailPageState message="Tutoring assignment not found." isError />;
  }
  return (
    <div className="min-h-screen bg-[#FAF9FB] font-sans text-[#302C38]">
      <SidebarAdmin activeItem="Tutoring" />

      <main className="lg:ml-64">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <a
              href="/admin-tutoring"
              className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-pf-purple"
            >
              <ArrowLeft className="h-5 w-5" />
            </a>

            <p className="hidden text-sm text-gray-500 lg:block">
              Tutoring Management / {tutoring.id}
            </p>
          </div>

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
          {error && <p role="alert" className="mb-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          {/* PAGE HEADER */}
          <section>
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-pf-purple">
                    TUTORING DETAILS
                  </p>

                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${tutoring.status?.toLowerCase() === "active" ? "bg-green-50 text-green-600" : tutoring.status?.toLowerCase() === "pending" ? "bg-amber-50 text-amber-600" : "bg-gray-100 text-gray-600"}`}>
                    {tutoring.status ?? "Unknown"}
                  </span>
                </div>

                <h1 className="mt-1 font-serif text-2xl font-medium text-pf-purple-dark sm:text-3xl">
                  {request?.subject?.name ?? "Tutoring"}
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                  Tutoring ID:{" "}
                  <span className="font-medium text-gray-700">
                    {tutoring.id}
                  </span>
                </p>
              </div>

              {teacher?.user?.email && (
                <a href={`tel:${teacher.user?.phone}`} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50">
                  <MessageSquare className="h-4 w-4" /> Contact teacher
                </a>
              )}
            </div>
          </section>

          {/* SUMMARY CARDS */}
          <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard icon={GraduationCap} label="Subject" value={request?.subject?.name ?? "—"} detail={`${learner?.level?.name ?? "Level unavailable"} · ${learner?.classroom?.name ?? "Class unavailable"}`} />
            <SummaryCard icon={CalendarDays} label="Sessions" value={`${completedSessions}/${sessions.length}`} detail="Completed sessions" />
            <SummaryCard icon={Coins} label="Payments received" value={`${formatMoney(totalPaid)} FCFA`} detail={`${paidPayments.length} paid payment${paidPayments.length === 1 ? "" : "s"}`} />
            <SummaryCard icon={CheckCircle2} label="Confirmed attendance" value={`${confirmedSessions}/${sessions.length}`} detail="Confirmed by both participants" />
          </section>

          {/* MAIN GRID */}
          <section className="mt-7 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
            {/* LEFT */}
            <div className="space-y-6">
              {/* PARTICIPANTS */}
              <SectionCard
                title="Participants"
                description="People involved in this tutoring arrangement."
              >
                <div className="grid gap-4 md:grid-cols-3">
                  <PersonCard
                    icon={GraduationCap}
                    role="Teacher"
                    name={personName(teacher?.user)}
                    detail={`${teacher?.user?.email ?? "Email unavailable"} · ${teacher?.stars ?? "—"} stars`}
                    href={teacher?.user?.id ? `/admin-teachers/${teacher.user.id}` : undefined}
                  />

                  <PersonCard
                    icon={UserRound}
                    role="Learner"
                    name={personName(learner?.user)}
                    detail={`${learner?.level?.name ?? "Level unavailable"} · ${learner?.classroom?.name ?? "Class unavailable"}`}
                  />

                  <PersonCard
                    icon={UsersRound}
                    role="Parent"
                    name={personName(learner?.parentProfile?.user)}
                    detail={learner?.parentProfile?.user?.phone ?? learner?.parentProfile?.address ?? "Contact unavailable"}
                  />
                </div>
              </SectionCard>

              {/* ACADEMIC */}
              <SectionCard
                title="Academic information"
                description="Details about what is being taught."
              >
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <InfoBox
                    label="Subject"
                    value={request?.subject?.name ?? "—"}
                  />

                  <InfoBox
                    label="Level"
                    value={learner?.level?.name ?? "—"}
                  />

                  <InfoBox
                    label="Class"
                    value={learner?.classroom?.name ?? "—"}
                  />

                  <InfoBox
                    label="School"
                    value={learner?.school_name ?? "—"}
                  />

                  <InfoBox
                    label="Teacher rating"
                    value={teacher?.expected_rate != null ? `${teacher.expected_rate} FCFA/session` : "—"}
                  />

                  <InfoBox
                    label="Teacher stars"
                    value={teacher?.stars != null ? `${teacher.stars} stars` : "—"}
                  />
                </div>
              </SectionCard>

              {/* SCHEDULE */}
              <SectionCard
                title="Schedule"
                description="Current tutoring timetable."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoBox
                    icon={CalendarDays}
                    label="Days"
                    value={request?.preferred_day ?? "Not specified"}
                  />

                  <InfoBox
                    icon={Clock3}
                    label="Time"
                    value={[request?.preferred_start_time, request?.preferred_end_time].filter(Boolean).join(" – ") || "Not specified"}
                  />

                  <InfoBox
                    label="Start date"
                    value={formatDate(tutoring.created_at)}
                  />

                  <InfoBox
                    label="Next session"
                    value={nextSession ? `${formatDate(nextSession.session_date)} · ${nextSession.start_time ?? ""}` : "No upcoming session"}
                  />
                </div>
              </SectionCard>

              {/* LOCATION */}
              <SectionCard
                title="Tutoring location"
                description="Where the sessions take place."
              >
                <div className="flex items-start gap-4 rounded-xl bg-[#FAF9FB] p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pf-purple-light">
                    <MapPin className="h-5 w-5 text-pf-purple" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-pf-purple-dark">
                      {request?.location ?? "Location not specified"}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {learner?.parentProfile?.address ?? ""}
                    </p>
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* RIGHT */}
            <div className="space-y-6">
              <SectionCard
                title="Tutoring progress"
                description="Session completion and mutual confirmations."
              >
                <div className="space-y-5">
                  <ProgressItem
                    label="Sessions completed"
                    value={completedSessions}
                    total={sessions.length}
                  />

                  <ProgressItem
                    label="Sessions confirmed by both"
                    value={confirmedSessions}
                    total={sessions.length}
                  />
                </div>
              </SectionCard>

              {/* PAYMENT */}
              <SectionCard
                title="Payment"
                description="Financial information for this tutoring."
              >
                <div className="space-y-4">
                  <PaymentRow label="Payment periods" value={payments.map((payment) => payment.period).filter(Boolean).join(", ") || "No payments"} />

                  <PaymentRow
                    label="Parent paid"
                    value={`${formatMoney(
                      totalPaid
                    )} FCFA`}
                  />

                  <PaymentRow
                    label="Platform commission"
                    value={`${formatMoney(
                      totalCommission
                    )} FCFA`}
                  />

                  <PaymentRow
                    label="Teacher earnings"
                    value={`${formatMoney(
                      totalTeacherEarnings
                    )} FCFA`}
                  />

                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <span className="text-xs text-gray-500">
                      Payment status
                    </span>

                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${latestPayment?.status?.toLowerCase() === "paid" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"}`}>
                      {latestPayment?.status?.toLowerCase() === "paid" ? <CheckCircle2 className="h-3 w-3" /> : <Clock3 className="h-3 w-3" />}
                      {latestPayment?.status ?? "No payment"}
                    </span>
                  </div>

                  <p className="text-[10px] text-gray-400">
                    Last payment: {formatDate(latestPayment?.created_at)}
                  </p>
                </div>
              </SectionCard>

              {/* ADMIN ACTIONS */}
              <SectionCard
                title="Administrative actions"
                description="Actions available to platform administrators."
              >
                <div className="space-y-2">
                  <a href="/admin-finance" className="flex w-full items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-xs font-medium text-gray-600 hover:bg-gray-50">
                    <Coins className="h-4 w-4 text-pf-purple" />
                    View payment history
                  </a>

                  <button type="button" onClick={cancelTutoring} disabled={saving || tutoring.status?.toLowerCase() === "cancelled"} className="flex w-full items-center gap-3 rounded-xl border border-red-100 px-4 py-3 text-left text-xs font-medium text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50">
                    <XCircle className="h-4 w-4" />
                    {saving ? "Cancelling..." : tutoring.status?.toLowerCase() === "cancelled" ? "Tutoring cancelled" : "Cancel tutoring"}
                  </button>
                </div>
              </SectionCard>

              {/* WARNING */}
              <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />

                  <div>
                    <p className="text-sm font-semibold text-amber-800">
                      Administrator note
                    </p>

                    <p className="mt-1 text-xs leading-5 text-amber-700">
                      Changes to the teacher, schedule or payment
                      information should be recorded in the tutoring
                      history.
                    </p>
                  </div>
                </div>
              </div>

              {/* CREATED */}
              <div className="px-1">
                <p className="text-[10px] text-gray-400">
                  Tutoring created on {formatDate(tutoring.created_at)}
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* ========================================================= */
/* SUMMARY CARD                                                */
/* ========================================================= */

function SummaryCard({
  icon: Icon,
  label,
  value,
  detail,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pf-purple-light">
          <Icon className="h-5 w-5 text-pf-purple" />
        </div>
      </div>

      <p className="mt-4 text-[11px] text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-lg font-semibold text-pf-purple-dark">
        {value}
      </p>

      <p className="mt-1 text-[11px] text-gray-500">
        {detail}
      </p>
    </div>
  );
}

/* ========================================================= */
/* SECTION CARD                                                */
/* ========================================================= */

function SectionCard({
  title,
  description,
  children,
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
        <h2 className="font-serif text-lg text-pf-purple-dark">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-xs text-gray-500">
            {description}
          </p>
        )}
      </div>

      <div className="p-5 sm:p-6">
        {children}
      </div>
    </section>
  );
}

/* ========================================================= */
/* PERSON CARD                                                 */
/* ========================================================= */

function PersonCard({
  icon: Icon,
  role,
  name,
  detail,
  href,
}) {
  const content = (
    <>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pf-purple-light">
        <Icon className="h-5 w-5 text-pf-purple" />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wide text-gray-400">
          {role}
        </p>

        <p className="mt-1 truncate text-sm font-semibold text-pf-purple-dark">
          {name}
        </p>

        <p className="mt-1 truncate text-[10px] text-gray-500">
          {detail}
        </p>
      </div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="flex items-start gap-3 rounded-xl border border-gray-200 p-4 transition hover:border-pf-purple/30 hover:bg-[#FCFBFD]"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-200 p-4">
      {content}
    </div>
  );
}

/* ========================================================= */
/* INFO BOX                                                     */
/* ========================================================= */

function InfoBox({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-[#FAF9FB] p-4">
      <div className="flex items-center gap-2">
        {Icon && (
          <Icon className="h-4 w-4 text-pf-purple" />
        )}

        <p className="text-[10px] uppercase tracking-wide text-gray-400">
          {label}
        </p>
      </div>

      <p className="mt-2 text-sm font-medium text-pf-purple-dark">
        {value}
      </p>
    </div>
  );
}

/* ========================================================= */
/* PROGRESS                                                     */
/* ========================================================= */

function ProgressItem({
  label,
  value,
  total,
}) {
  const percentage = total
    ? Math.round((value / total) * 100)
    : value;

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">
          {label}
        </p>

        <p className="text-xs font-semibold text-pf-purple-dark">
          {value}
          {total ? ` / ${total}` : ""}
        </p>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-pf-purple"
          style={{
            width: `${Math.min(percentage, 100)}%`,
          }}
        />
      </div>
    </div>
  );
}

/* ========================================================= */
/* PAYMENT ROW                                                  */
/* ========================================================= */

function PaymentRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-gray-500">
        {label}
      </span>

      <span className="text-xs font-semibold text-pf-purple-dark">
        {value}
      </span>
    </div>
  );
}

/* ========================================================= */
/* HELPERS                                                      */
/* ========================================================= */

function formatMoney(amount) {
  return new Intl.NumberFormat("fr-FR").format(Number(amount ?? 0));
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("fr-FR");
}

function personName(user) {
  return [user?.first_name, user?.last_name].filter(Boolean).join(" ") || "Name unavailable";
}

function DetailPageState({ message, isError = false }) {
  return (
    <div className="min-h-screen bg-[#FAF9FB] font-sans text-[#302C38]">
      <SidebarAdmin activeItem="Tutoring" />
      <main className="lg:ml-64">
        <header className="flex h-16 items-center border-b border-gray-100 bg-white px-5 sm:px-8">
          <a href="/admin-tutoring" className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-pf-purple" aria-label="Back to tutoring">
            <ArrowLeft className="h-5 w-5" />
          </a>
        </header>
        <div className={`mx-auto max-w-7xl px-5 py-12 text-sm ${isError ? "text-red-600" : "text-gray-400"}`} role={isError ? "alert" : "status"}>
          {message}
        </div>
      </main>
    </div>
  );
}