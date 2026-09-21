import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Award,
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Edit3,
  Eye,
  FileText,
  GraduationCap,
  MoreHorizontal,
  PauseCircle,
  PlayCircle,
  Target,
  Trophy,
  UsersRound,
  XCircle,
} from "lucide-react";
import SidebarAdmin from "../components/admin/SidebarAdmin";

const exam = {
  id: 1,
  title: "Mathematics — Algebra Assessment",
  code: "MATH-ALG-03",
  subject: "Mathematics",
  level: "Secondary",
  classes: ["Form 2", "Form 3"],
  teacher: "Mr. Xavier Ndi",
  status: "Published",
  duration: 60,
  questions: 20,
  totalMarks: 40,
  passingScore: 20,
  scheduledDate: "24 September 2026",
  scheduledTime: "16:00",
  participants: 48,
  completed: 39,
  pending: 9,
  averageScore: 27.6,
  highestScore: 39,
  lowestScore: 11,
  reward: {
    enabled: true,
    title: "Most Progressive Student",
    description:
      "Recognition for the learner who shows the strongest improvement.",
    prize: "School supplies",
  },
};

const questions = [
  {
    id: 1,
    number: 1,
    question: "Solve: 2x + 6 = 18.",
    type: "Multiple choice",
    marks: 2,
    status: "Published",
  },
  {
    id: 2,
    number: 2,
    question: "Factorise: x² + 5x + 6.",
    type: "Short answer",
    marks: 2,
    status: "Published",
  },
  {
    id: 3,
    number: 3,
    question: "Solve the quadratic equation x² - 9 = 0.",
    type: "Multiple choice",
    marks: 2,
    status: "Published",
  },
  {
    id: 4,
    number: 4,
    question: "Simplify the algebraic expression.",
    type: "Short answer",
    marks: 2,
    status: "Published",
  },
  {
    id: 5,
    number: 5,
    question: "Which expression represents a quadratic function?",
    type: "Multiple choice",
    marks: 2,
    status: "Published",
  },
];

const participants = [
  {
    name: "Brenda M.",
    className: "Form 2",
    score: 36,
    percentage: 90,
    status: "Completed",
  },
  {
    name: "Daniel N.",
    className: "Form 3",
    score: 34,
    percentage: 85,
    status: "Completed",
  },
  {
    name: "Kevin T.",
    className: "Form 2",
    score: 29,
    percentage: 72.5,
    status: "Completed",
  },
  {
    name: "Esther F.",
    className: "Form 3",
    score: 24,
    percentage: 60,
    status: "Completed",
  },
  {
    name: "Patrick B.",
    className: "Form 2",
    score: null,
    percentage: null,
    status: "Pending",
  },
];

export default function AdminExamRewardDetailPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [examStatus, setExamStatus] = useState(exam.status);

  const completedPercentage = useMemo(() => {
    return Math.round(
      (exam.completed / exam.participants) * 100
    );
  }, []);

  const toggleStatus = () => {
    setExamStatus((current) =>
      current === "Published" ? "Paused" : "Published"
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF9FB] font-sans text-[#302C38]">
      <SidebarAdmin activeItem="Exams & Rewards" />

      <main className="lg:ml-64">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <a
              href="/admin-exams-rewards"
              className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-pf-purple"
            >
              <ArrowLeft className="h-5 w-5" />
            </a>

            <p className="hidden text-sm text-gray-500 lg:block">
              Exams & Rewards / Assessment
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
          {/* Page heading */}
          <section>
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pf-purple-light">
                  <FileText className="h-6 w-6 text-pf-purple" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-pf-purple">
                      ASSESSMENT DETAILS
                    </p>

                    <StatusBadge status={examStatus} />
                  </div>

                  <h1 className="mt-1 font-serif text-2xl font-medium text-pf-purple-dark sm:text-3xl">
                    {exam.title}
                  </h1>

                  <p className="mt-2 text-sm text-gray-500">
                    {exam.code} · {exam.subject} · {exam.level}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-pf-purple-dark hover:bg-gray-50"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={toggleStatus}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  {examStatus === "Published" ? (
                    <>
                      <PauseCircle className="h-4 w-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <PlayCircle className="h-4 w-4" />
                      Publish
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* Main stats */}
          <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={UsersRound}
              label="Participants"
              value={exam.participants}
              detail={`${exam.completed} completed`}
            />

            <StatCard
              icon={Target}
              label="Average score"
              value={`${exam.averageScore}/${exam.totalMarks}`}
              detail={`${Math.round(
                (exam.averageScore / exam.totalMarks) * 100
              )}% average`}
            />

            <StatCard
              icon={Trophy}
              label="Highest score"
              value={`${exam.highestScore}/${exam.totalMarks}`}
              detail="Best performance"
            />

            <StatCard
              icon={Clock3}
              label="Duration"
              value={`${exam.duration} min`}
              detail={`${exam.questions} questions`}
            />
          </section>

          {/* Tabs */}
          <div className="mt-7 flex gap-1 overflow-x-auto border-b border-gray-200">
            {["Overview", "Questions", "Participants", "Reward"].map(
              (tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition ${
                    activeTab === tab
                      ? "border-pf-purple text-pf-purple"
                      : "border-transparent text-gray-500 hover:text-pf-purple"
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </div>

          {/* Tab content */}
          <div className="mt-6">
            {activeTab === "Overview" && (
              <OverviewTab
                exam={exam}
                completedPercentage={completedPercentage}
              />
            )}

            {activeTab === "Questions" && (
              <QuestionsTab questions={questions} />
            )}

            {activeTab === "Participants" && (
              <ParticipantsTab participants={participants} />
            )}

            {activeTab === "Reward" && (
              <RewardTab reward={exam.reward} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

/* ========================================================= */
/* OVERVIEW                                                    */
/* ========================================================= */

function OverviewTab({
  exam,
  completedPercentage,
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
      <div className="space-y-5">
        {/* Exam information */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-pf-purple" />

            <h2 className="font-serif text-xl text-pf-purple-dark">
              Assessment information
            </h2>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <InfoItem
              label="Subject"
              value={exam.subject}
            />

            <InfoItem
              label="Level"
              value={exam.level}
            />

            <InfoItem
              label="Classes"
              value={exam.classes.join(", ")}
            />

            <InfoItem
              label="Teacher"
              value={exam.teacher}
            />

            <InfoItem
              label="Date"
              value={exam.scheduledDate}
            />

            <InfoItem
              label="Time"
              value={exam.scheduledTime}
            />

            <InfoItem
              label="Duration"
              value={`${exam.duration} minutes`}
            />

            <InfoItem
              label="Total marks"
              value={`${exam.totalMarks} marks`}
            />

            <InfoItem
              label="Passing score"
              value={`${exam.passingScore}/${exam.totalMarks}`}
            />

            <InfoItem
              label="Questions"
              value={`${exam.questions} questions`}
            />
          </div>
        </section>

        {/* Progress */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-xl text-pf-purple-dark">
                Participation
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Learner completion progress.
              </p>
            </div>

            <UsersRound className="h-5 w-5 text-pf-purple" />
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">
                Completed
              </span>

              <span className="font-semibold text-pf-purple-dark">
                {exam.completed}/{exam.participants}
              </span>
            </div>

            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-pf-purple"
                style={{
                  width: `${completedPercentage}%`,
                }}
              />
            </div>

            <div className="mt-3 flex justify-between text-xs text-gray-400">
              <span>
                {completedPercentage}% completed
              </span>

              <span>
                {exam.pending} pending
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Right column */}
      <div className="space-y-5">
        {/* Performance */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-pf-purple" />

            <h2 className="font-serif text-lg text-pf-purple-dark">
              Performance
            </h2>
          </div>

          <div className="mt-5 space-y-4">
            <PerformanceRow
              label="Average"
              value={`${exam.averageScore}/${exam.totalMarks}`}
            />

            <PerformanceRow
              label="Highest"
              value={`${exam.highestScore}/${exam.totalMarks}`}
            />

            <PerformanceRow
              label="Lowest"
              value={`${exam.lowestScore}/${exam.totalMarks}`}
            />
          </div>
        </section>

        {/* Reward preview */}
        <section className="rounded-2xl bg-pf-purple p-5 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium tracking-wide text-purple-200">
                REWARD
              </p>

              <h2 className="mt-2 font-serif text-xl">
                {exam.reward.title}
              </h2>
            </div>

            <div className="rounded-lg bg-white/15 p-2.5">
              <Award className="h-5 w-5" />
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-purple-100">
            {exam.reward.description}
          </p>

          <div className="mt-4 rounded-lg bg-white/10 p-3">
            <p className="text-[10px] uppercase tracking-wide text-purple-200">
              Prize
            </p>

            <p className="mt-1 text-sm font-semibold">
              {exam.reward.prize}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ========================================================= */
/* QUESTIONS                                                   */
/* ========================================================= */

function QuestionsTab({ questions }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="font-serif text-xl text-pf-purple-dark">
            Questions
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Questions included in this assessment.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3.5 py-2 text-xs font-semibold text-pf-purple hover:bg-pf-purple-light"
        >
          <Edit3 className="h-4 w-4" />
          Edit questions
        </button>
      </div>

      <div className="divide-y divide-gray-100">
        {questions.map((question) => (
          <div
            key={question.id}
            className="flex items-start gap-4 p-5"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-pf-purple-light text-xs font-semibold text-pf-purple">
              {question.number}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-pf-purple-dark">
                {question.question}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] text-gray-500">
                  {question.type}
                </span>

                <span className="text-[10px] text-gray-400">
                  {question.marks} marks
                </span>
              </div>
            </div>

            <CheckCircle2 className="h-4 w-4 shrink-0 text-pf-green" />
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 px-5 py-4 sm:px-6">
        <button
          type="button"
          className="text-xs font-semibold text-pf-purple hover:underline"
        >
          View all questions →
        </button>
      </div>
    </section>
  );
}

/* ========================================================= */
/* PARTICIPANTS                                                */
/* ========================================================= */

function ParticipantsTab({ participants }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-100 p-5 sm:p-6">
        <h2 className="font-serif text-xl text-pf-purple-dark">
          Participants
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Learners registered for this assessment.
        </p>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-100 bg-[#FCFBFD] text-left">
              <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                Learner
              </th>

              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                Class
              </th>

              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                Score
              </th>

              <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                Percentage
              </th>

              <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                Status
              </th>

              <th className="px-6 py-3" />
            </tr>
          </thead>

          <tbody>
            {participants.map((participant) => (
              <ParticipantRow
                key={participant.name}
                participant={participant}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-gray-100 md:hidden">
        {participants.map((participant) => (
          <ParticipantMobileCard
            key={participant.name}
            participant={participant}
          />
        ))}
      </div>
    </section>
  );
}

function ParticipantRow({ participant }) {
  return (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pf-purple-light text-xs font-semibold text-pf-purple">
            {participant.name
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)}
          </div>

          <span className="text-sm font-medium text-pf-purple-dark">
            {participant.name}
          </span>
        </div>
      </td>

      <td className="px-4 py-4 text-xs text-gray-500">
        {participant.className}
      </td>

      <td className="px-4 py-4 text-xs font-semibold text-pf-purple-dark">
        {participant.score !== null
          ? `${participant.score}/40`
          : "—"}
      </td>

      <td className="px-4 py-4 text-xs text-gray-500">
        {participant.percentage !== null
          ? `${participant.percentage}%`
          : "—"}
      </td>

      <td className="px-6 py-4">
        <ParticipantStatus
          status={participant.status}
        />
      </td>

      <td className="px-6 py-4 text-right">
        <button
          type="button"
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-pf-purple"
        >
          <Eye className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}

function ParticipantMobileCard({ participant }) {
  return (
    <div className="flex items-center gap-3 p-5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pf-purple-light text-xs font-semibold text-pf-purple">
        {participant.name
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-pf-purple-dark">
          {participant.name}
        </p>

        <p className="mt-1 text-xs text-gray-400">
          {participant.className}
        </p>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs font-semibold text-pf-purple-dark">
            {participant.score !== null
              ? `${participant.score}/40`
              : "Pending"}
          </span>

          {participant.percentage !== null && (
            <span className="text-[10px] text-gray-400">
              {participant.percentage}%
            </span>
          )}
        </div>
      </div>

      <ParticipantStatus
        status={participant.status}
      />
    </div>
  );
}

/* ========================================================= */
/* REWARD                                                      */
/* ========================================================= */

function RewardTab({ reward }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_0.7fr]">
      <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-pf-purple">
              REWARD CONFIGURATION
            </p>

            <h2 className="mt-1 font-serif text-2xl text-pf-purple-dark">
              {reward.title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              {reward.description}
            </p>
          </div>

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pf-purple-light">
            <Award className="h-5 w-5 text-pf-purple" />
          </div>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-[#FAF9FB] p-4">
            <p className="text-[10px] uppercase tracking-wide text-gray-400">
              Reward type
            </p>

            <p className="mt-2 text-sm font-semibold text-pf-purple-dark">
              Most Progressive Student
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-[#FAF9FB] p-4">
            <p className="text-[10px] uppercase tracking-wide text-gray-400">
              Prize
            </p>

            <p className="mt-2 text-sm font-semibold text-pf-purple-dark">
              {reward.prize}
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-green-100 bg-green-50 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />

            <div>
              <p className="text-sm font-medium text-green-700">
                Reward enabled
              </p>

              <p className="mt-1 text-xs leading-5 text-green-600">
                The reward will be considered when reviewing
                learner progress and performance.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="mt-6 inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-xs font-semibold text-pf-purple-dark hover:bg-gray-50"
        >
          <Edit3 className="h-4 w-4" />
          Edit reward
        </button>
      </section>

      <section className="rounded-2xl bg-pf-purple p-6 text-white">
        <Trophy className="h-7 w-7" />

        <h2 className="mt-5 font-serif text-xl">
          Reward criteria
        </h2>

        <ul className="mt-4 space-y-3 text-sm text-purple-100">
          <li className="flex gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            Improvement compared with previous performance.
          </li>

          <li className="flex gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            Assessment participation and completion.
          </li>

          <li className="flex gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            Consistency of learning progress.
          </li>
        </ul>
      </section>
    </div>
  );
}

/* ========================================================= */
/* COMPONENTS                                                  */
/* ========================================================= */

function StatCard({
  icon: Icon,
  label,
  value,
  detail,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pf-purple-light">
          <Icon className="h-5 w-5 text-pf-purple" />
        </div>

        <span className="font-serif text-xl text-pf-purple-dark">
          {value}
        </span>
      </div>

      <p className="mt-4 text-xs font-medium text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-[10px] text-gray-400">
        {detail}
      </p>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-pf-purple-dark">
        {value}
      </p>
    </div>
  );
}

function PerformanceRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
      <span className="text-xs text-gray-500">
        {label}
      </span>

      <span className="text-sm font-semibold text-pf-purple-dark">
        {value}
      </span>
    </div>
  );
}

function StatusBadge({ status }) {
  const published = status === "Published";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${
        published
          ? "bg-green-50 text-green-600"
          : "bg-orange-50 text-orange-600"
      }`}
    >
      {published ? (
        <CheckCircle2 className="h-3 w-3" />
      ) : (
        <PauseCircle className="h-3 w-3" />
      )}

      {status}
    </span>
  );
}

function ParticipantStatus({ status }) {
  const completed = status === "Completed";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${
        completed
          ? "bg-green-50 text-green-600"
          : "bg-orange-50 text-orange-600"
      }`}
    >
      {completed ? (
        <CheckCircle2 className="h-3 w-3" />
      ) : (
        <Clock3 className="h-3 w-3" />
      )}

      {status}
    </span>
  );
}