import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Coins,
  FileText,
  GraduationCap,
  MapPin,
  MessageSquare,
  UserRound,
  UsersRound,
  XCircle,
} from "lucide-react";
import SidebarAdmin from "../components/admin/SidebarAdmin";

const tutoring = {
  id: "TUT-004",
  status: "Active",
  subject: "Mathematics",
  level: "Secondary",
  className: "Form 2",

  teacher: {
    name: "Samuel Mbarga",
    id: "TCH-018",
    phone: "+237 6 90 12 34 56",
    rating: 4.8,
    stars: 4,
  },

  learner: {
    name: "Kevin Junior",
    age: 14,
    className: "Form 2",
    school: "Government Bilingual High School",
  },

  parent: {
    name: "Jean Pierre Mbarga",
    phone: "+237 6 77 45 21 90",
  },

  schedule: {
    frequency: "3 sessions / week",
    days: ["Monday", "Wednesday", "Saturday"],
    time: "16:00 - 18:00",
    startDate: "September 7, 2026",
    nextSession: "Wednesday, September 23, 2026",
  },

  location: {
    type: "Home tutoring",
    address: "Bonamoussadi, Douala",
  },

  payment: {
    plan: "Monthly",
    amount: 45000,
    commission: 4500,
    teacherAmount: 40500,
    status: "Paid",
    lastPayment: "September 7, 2026",
  },

  progress: {
    completedSessions: 8,
    plannedSessions: 12,
    attendance: 92,
    averageScore: 78,
  },

  createdAt: "September 5, 2026",
};

export default function AdminTutoringDetailsPage() {
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
          {/* PAGE HEADER */}
          <section>
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-pf-purple">
                    TUTORING DETAILS
                  </p>

                  <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-green-600">
                    {tutoring.status}
                  </span>
                </div>

                <h1 className="mt-1 font-serif text-2xl font-medium text-pf-purple-dark sm:text-3xl">
                  {tutoring.subject} Tutoring
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                  Tutoring ID:{" "}
                  <span className="font-medium text-gray-700">
                    {tutoring.id}
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  <MessageSquare className="h-4 w-4" />
                  Contact
                </button>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg bg-pf-purple px-4 py-2.5 text-xs font-medium text-white shadow-sm hover:bg-pf-purple-dark"
                >
                  <FileText className="h-4 w-4" />
                  View report
                </button>
              </div>
            </div>
          </section>

          {/* SUMMARY CARDS */}
          <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              icon={GraduationCap}
              label="Subject"
              value={tutoring.subject}
              detail={`${tutoring.level} · ${tutoring.className}`}
            />

            <SummaryCard
              icon={CalendarDays}
              label="Schedule"
              value={tutoring.schedule.frequency}
              detail={tutoring.schedule.time}
            />

            <SummaryCard
              icon={Coins}
              label="Monthly payment"
              value={`${formatMoney(tutoring.payment.amount)} FCFA`}
              detail={tutoring.payment.status}
            />

            <SummaryCard
              icon={CheckCircle2}
              label="Attendance"
              value={`${tutoring.progress.attendance}%`}
              detail={`${tutoring.progress.completedSessions} sessions completed`}
            />
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
                    name={tutoring.teacher.name}
                    detail={`${tutoring.teacher.id} · ${tutoring.teacher.rating} rating`}
                    href={`/admin-teachers/${tutoring.teacher.id.replace(
                      "TCH-",
                      ""
                    )}`}
                  />

                  <PersonCard
                    icon={UserRound}
                    role="Learner"
                    name={tutoring.learner.name}
                    detail={`${tutoring.learner.age} years · ${tutoring.learner.className}`}
                  />

                  <PersonCard
                    icon={UsersRound}
                    role="Parent"
                    name={tutoring.parent.name}
                    detail={tutoring.parent.phone}
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
                    value={tutoring.subject}
                  />

                  <InfoBox
                    label="Level"
                    value={tutoring.level}
                  />

                  <InfoBox
                    label="Class"
                    value={tutoring.className}
                  />

                  <InfoBox
                    label="School"
                    value={tutoring.learner.school}
                  />

                  <InfoBox
                    label="Teacher rating"
                    value={`${tutoring.teacher.rating} / 5`}
                  />

                  <InfoBox
                    label="Teacher stars"
                    value={`${tutoring.teacher.stars} stars`}
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
                    value={tutoring.schedule.days.join(" · ")}
                  />

                  <InfoBox
                    icon={Clock3}
                    label="Time"
                    value={tutoring.schedule.time}
                  />

                  <InfoBox
                    label="Start date"
                    value={tutoring.schedule.startDate}
                  />

                  <InfoBox
                    label="Next session"
                    value={tutoring.schedule.nextSession}
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
                      {tutoring.location.type}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {tutoring.location.address}
                    </p>
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* RIGHT */}
            <div className="space-y-6">
              {/* PROGRESS */}
              <SectionCard
                title="Tutoring progress"
                description="Current academic and attendance progress."
              >
                <div className="space-y-5">
                  <ProgressItem
                    label="Sessions completed"
                    value={tutoring.progress.completedSessions}
                    total={tutoring.progress.plannedSessions}
                  />

                  <ProgressItem
                    label="Attendance"
                    value={tutoring.progress.attendance}
                    suffix="%"
                  />

                  <ProgressItem
                    label="Average assessment score"
                    value={tutoring.progress.averageScore}
                    suffix="%"
                  />
                </div>
              </SectionCard>

              {/* PAYMENT */}
              <SectionCard
                title="Payment"
                description="Financial information for this tutoring."
              >
                <div className="space-y-4">
                  <PaymentRow
                    label="Plan"
                    value={tutoring.payment.plan}
                  />

                  <PaymentRow
                    label="Parent paid"
                    value={`${formatMoney(
                      tutoring.payment.amount
                    )} FCFA`}
                  />

                  <PaymentRow
                    label="Platform commission"
                    value={`${formatMoney(
                      tutoring.payment.commission
                    )} FCFA`}
                  />

                  <PaymentRow
                    label="Teacher earnings"
                    value={`${formatMoney(
                      tutoring.payment.teacherAmount
                    )} FCFA`}
                  />

                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <span className="text-xs text-gray-500">
                      Payment status
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-green-600">
                      <CheckCircle2 className="h-3 w-3" />
                      {tutoring.payment.status}
                    </span>
                  </div>

                  <p className="text-[10px] text-gray-400">
                    Last payment: {tutoring.payment.lastPayment}
                  </p>
                </div>
              </SectionCard>

              {/* ADMIN ACTIONS */}
              <SectionCard
                title="Administrative actions"
                description="Actions available to platform administrators."
              >
                <div className="space-y-2">
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-600 hover:bg-gray-50"
                  >
                    <CalendarDays className="h-4 w-4 text-pf-purple" />
                    Change schedule
                  </button>

                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-600 hover:bg-gray-50"
                  >
                    <UserRound className="h-4 w-4 text-pf-purple" />
                    Change teacher
                  </button>

                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-left text-xs font-medium text-gray-600 hover:bg-gray-50"
                  >
                    <Coins className="h-4 w-4 text-pf-purple" />
                    View payment history
                  </button>

                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-xl border border-red-100 px-4 py-3 text-left text-xs font-medium text-red-500 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4" />
                    Suspend tutoring
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
                  Tutoring created on {tutoring.createdAt}
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
  suffix = "",
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
          {suffix}
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
  return new Intl.NumberFormat("fr-FR").format(amount);
}