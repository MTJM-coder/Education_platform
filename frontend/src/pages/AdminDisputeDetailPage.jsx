import { useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  MessageSquare,
  UserRound,
  UsersRound,
  Wallet,
  XCircle,
} from "lucide-react";
import SidebarAdmin from "../components/admin/SidebarAdmin";

const dispute = {
  id: "DSP-006",
  status: "Under review",
  priority: "High",
  reason: "Tutoring session disputed",
  createdAt: "18 Sept. 2026, 14:32",

  student: {
    name: "Junior Mbarga",
    email: "junior.mbarga@gmail.com",
    class: "Form 3",
  },

  teacher: {
    name: "Mr. Xavier Ndi",
    email: "xavier.ndi@gmail.com",
    subject: "Mathematics",
  },

  session: {
    date: "18 Sept. 2026",
    time: "16:00 – 17:30",
    duration: "1h 30min",
    subject: "Mathematics",
    amount: "7,500 FCFA",
  },

  payment: {
    reference: "PAY-2026-1842",
    method: "MTN Mobile Money",
    status: "Held in escrow",
  },

  description:
    "The student reports that the scheduled tutoring session was not completed as expected. The teacher indicates that the session started but was interrupted because of a connection issue.",

  messages: [
    {
      sender: "Junior Mbarga",
      role: "Student",
      time: "18 Sept. 2026 · 14:32",
      message:
        "The session was interrupted after a few minutes and I could not continue the lesson.",
    },
    {
      sender: "Mr. Xavier Ndi",
      role: "Teacher",
      time: "18 Sept. 2026 · 15:04",
      message:
        "I started the lesson normally, but the connection became unstable. I tried to reconnect several times.",
    },
  ],

  evidence: [
    {
      name: "session_screenshot.png",
      type: "Image",
      size: "842 KB",
    },
    {
      name: "chat_history.pdf",
      type: "PDF",
      size: "1.2 MB",
    },
  ],
};

export default function AdminDisputeDetailsPage() {
  const [decision, setDecision] = useState(null);
  const [note, setNote] = useState("");

  return (
    <div className="min-h-screen bg-[#FAF9FB] font-sans text-[#302C38]">
      <SidebarAdmin activeItem="Disputes" />

      <main className="lg:ml-64">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <a
              href="/admin-disputes"
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-pf-purple"
            >
              <ArrowLeft className="h-5 w-5" />
            </a>

            <p className="hidden text-sm text-gray-500 sm:block">
              Disputes / {dispute.id}
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pf-purple text-xs font-semibold text-white">
            SA
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8">
          {/* Heading */}
          <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-pf-purple">
                DISPUTE CASE
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-3">
                <h1 className="font-serif text-2xl font-medium text-pf-purple-dark sm:text-3xl">
                  {dispute.id}
                </h1>

                <StatusBadge status={dispute.status} />
                <PriorityBadge priority={dispute.priority} />
              </div>

              <p className="mt-2 text-sm text-gray-500">
                {dispute.reason} · Created {dispute.createdAt}
              </p>
            </div>

            <a
              href="/admin-disputes"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to disputes
            </a>
          </section>

          {/* Main grid */}
          <div className="mt-7 grid gap-5 xl:grid-cols-[1.45fr_0.75fr]">
            {/* LEFT */}
            <div className="space-y-5">
              {/* Case summary */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                <SectionTitle
                  icon={AlertTriangle}
                  title="Case summary"
                />

                <div className="mt-5 rounded-xl bg-[#FAF9FB] p-4">
                  <p className="text-sm leading-6 text-gray-600">
                    {dispute.description}
                  </p>
                </div>
              </section>

              {/* People involved */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                <SectionTitle
                  icon={UsersRound}
                  title="People involved"
                />

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <PersonCard
                    type="Student"
                    person={dispute.student}
                  />

                  <PersonCard
                    type="Teacher"
                    person={dispute.teacher}
                  />
                </div>
              </section>

              {/* Session */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                <SectionTitle
                  icon={CalendarDays}
                  title="Disputed session"
                />

                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <InfoBox
                    icon={CalendarDays}
                    label="Date"
                    value={dispute.session.date}
                  />

                  <InfoBox
                    icon={Clock}
                    label="Time"
                    value={dispute.session.time}
                  />

                  <InfoBox
                    icon={Clock}
                    label="Duration"
                    value={dispute.session.duration}
                  />

                  <InfoBox
                    icon={FileText}
                    label="Subject"
                    value={dispute.session.subject}
                  />
                </div>
              </section>

              {/* Conversation */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                <SectionTitle
                  icon={MessageSquare}
                  title="Conversation"
                />

                <div className="mt-5 space-y-4">
                  {dispute.messages.map((message, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-gray-100 bg-[#FCFBFD] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pf-purple-light">
                            <UserRound className="h-4 w-4 text-pf-purple" />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-pf-purple-dark">
                              {message.sender}
                            </p>

                            <p className="text-[10px] text-gray-400">
                              {message.role}
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] text-gray-400">
                          {message.time}
                        </span>
                      </div>

                      <p className="mt-3 text-sm leading-6 text-gray-600">
                        {message.message}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Evidence */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                <SectionTitle
                  icon={FileText}
                  title="Evidence"
                />

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {dispute.evidence.map((file) => (
                    <div
                      key={file.name}
                      className="flex items-center gap-3 rounded-xl border border-gray-200 p-3"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pf-purple-light">
                        <FileText className="h-5 w-5 text-pf-purple" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-pf-purple-dark">
                          {file.name}
                        </p>

                        <p className="mt-0.5 text-[10px] text-gray-400">
                          {file.type} · {file.size}
                        </p>
                      </div>

                      <button
                        type="button"
                        className="text-xs font-semibold text-pf-purple hover:underline"
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* RIGHT */}
            <aside className="space-y-5">
              {/* Payment */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5">
                <SectionTitle
                  icon={Wallet}
                  title="Payment"
                />

                <div className="mt-5">
                  <p className="text-2xl font-semibold text-pf-purple-dark">
                    {dispute.session.amount}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Session amount
                  </p>
                </div>

                <div className="mt-5 space-y-3 border-t border-gray-100 pt-4">
                  <DetailRow
                    label="Reference"
                    value={dispute.payment.reference}
                  />

                  <DetailRow
                    label="Method"
                    value={dispute.payment.method}
                  />

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-gray-400">
                      Status
                    </span>

                    <span className="rounded-full bg-yellow-50 px-2.5 py-1 text-[10px] font-medium text-yellow-600">
                      {dispute.payment.status}
                    </span>
                  </div>
                </div>
              </section>

              {/* Decision */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5">
                <SectionTitle
                  icon={CheckCircle2}
                  title="Admin decision"
                />

                <p className="mt-3 text-xs leading-5 text-gray-500">
                  Review the evidence before deciding how the
                  disputed payment should be handled.
                </p>

                <div className="mt-5 space-y-2">
                  <DecisionButton
                    active={decision === "student"}
                    onClick={() => setDecision("student")}
                    icon={CheckCircle2}
                    title="Refund student"
                    description="Return the payment to the student."
                  />

                  <DecisionButton
                    active={decision === "teacher"}
                    onClick={() => setDecision("teacher")}
                    icon={CheckCircle2}
                    title="Release to teacher"
                    description="Release the held payment to the teacher."
                  />

                  <DecisionButton
                    active={decision === "split"}
                    onClick={() => setDecision("split")}
                    icon={UsersRound}
                    title="Split payment"
                    description="Share the amount between both parties."
                  />

                  <DecisionButton
                    active={decision === "dismiss"}
                    onClick={() => setDecision("dismiss")}
                    icon={XCircle}
                    title="Dismiss dispute"
                    description="Close the case without changing payment."
                  />
                </div>

                <div className="mt-5">
                  <label className="text-xs font-medium text-gray-500">
                    Admin note
                  </label>

                  <textarea
                    value={note}
                    onChange={(event) =>
                      setNote(event.target.value)
                    }
                    rows={4}
                    placeholder="Add a reason for your decision..."
                    className="mt-2 w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-xs outline-none focus:border-pf-purple focus:ring-2 focus:ring-pf-purple/10"
                  />
                </div>

                <button
                  type="button"
                  disabled={!decision}
                  className="mt-4 w-full rounded-lg bg-pf-purple px-4 py-2.5 text-sm font-medium text-white transition hover:bg-pf-purple-dark disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Confirm decision
                </button>
              </section>

              {/* Case timeline */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5">
                <SectionTitle
                  icon={Clock}
                  title="Case timeline"
                />

                <div className="mt-5 space-y-4">
                  <TimelineItem
                    title="Dispute created"
                    date="18 Sept. · 14:32"
                    active
                  />

                  <TimelineItem
                    title="Payment placed on hold"
                    date="18 Sept. · 14:35"
                    active
                  />

                  <TimelineItem
                    title="Evidence submitted"
                    date="18 Sept. · 15:10"
                    active
                  />

                  <TimelineItem
                    title="Awaiting admin decision"
                    date="Current"
                  />
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ========================================================= */
/* COMPONENTS                                                 */
/* ========================================================= */

function SectionTitle({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pf-purple-light">
        <Icon className="h-4 w-4 text-pf-purple" />
      </div>

      <h2 className="font-serif text-lg text-pf-purple-dark">
        {title}
      </h2>
    </div>
  );
}

function PersonCard({ type, person }) {
  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
        {type}
      </p>

      <div className="mt-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pf-purple-light">
          <UserRound className="h-5 w-5 text-pf-purple" />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-pf-purple-dark">
            {person.name}
          </p>

          <p className="truncate text-[11px] text-gray-400">
            {person.email}
          </p>
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-500">
        {type === "Student"
          ? person.class
          : person.subject}
      </p>
    </div>
  );
}

function InfoBox({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl bg-[#FAF9FB] p-3">
      <Icon className="h-4 w-4 text-pf-purple" />

      <p className="mt-2 text-[10px] text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-xs font-semibold text-pf-purple-dark">
        {value}
      </p>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-gray-400">
        {label}
      </span>

      <span className="text-right text-xs font-medium text-pf-purple-dark">
        {value}
      </span>
    </div>
  );
}

function DecisionButton({
  active,
  onClick,
  icon: Icon,
  title,
  description,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${
        active
          ? "border-pf-purple bg-pf-purple-light"
          : "border-gray-200 hover:bg-[#FCFBFD]"
      }`}
    >
      <Icon
        className={`mt-0.5 h-4 w-4 shrink-0 ${
          active
            ? "text-pf-purple"
            : "text-gray-400"
        }`}
      />

      <div>
        <p className="text-xs font-semibold text-pf-purple-dark">
          {title}
        </p>

        <p className="mt-0.5 text-[10px] leading-4 text-gray-400">
          {description}
        </p>
      </div>
    </button>
  );
}

function StatusBadge({ status }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-2.5 py-1 text-[10px] font-medium text-yellow-600">
      <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
      {status}
    </span>
  );
}

function PriorityBadge({ priority }) {
  return (
    <span className="inline-flex rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-medium text-red-500">
      {priority} priority
    </span>
  );
}

function TimelineItem({ title, date, active = false }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <span
          className={`mt-1 h-2.5 w-2.5 rounded-full ${
            active
              ? "bg-pf-purple"
              : "bg-gray-300"
          }`}
        />

        <span className="mt-1 h-full w-px bg-gray-200" />
      </div>

      <div className="pb-3">
        <p className="text-xs font-medium text-pf-purple-dark">
          {title}
        </p>

        <p className="mt-1 text-[10px] text-gray-400">
          {date}
        </p>
      </div>
    </div>
  );
}