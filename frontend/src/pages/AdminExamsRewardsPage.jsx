import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  MoreHorizontal,
  Plus,
  Search,
  Target,
  UsersRound,
  XCircle,
} from "lucide-react";
import SidebarAdmin from "../components/admin/SidebarAdmin";
import { apiFetch } from "../lib/apiClient";

/* V2: progressive-student and reward data
const progressiveStudents = [
  {
    id: 1,
    name: "Sarah Mbarga",
    className: "Form 3",
    subjects: 5,
    previousAverage: 61,
    currentAverage: 78,
    progress: 17,
    reason: "Strong improvement in Mathematics and Physics",
  },
  {
    id: 2,
    name: "Junior Tchoumi",
    className: "Form 2",
    subjects: 4,
    previousAverage: 58,
    currentAverage: 73,
    progress: 15,
    reason: "Consistent improvement across assessments",
  },
  {
    id: 3,
    name: "Grace Nfor",
    className: "Class 6",
    subjects: 6,
    previousAverage: 67,
    currentAverage: 80,
    progress: 13,
    reason: "Excellent progress in English and French",
  },
];

const rewards = [
  {
    id: 1,
    title: "School Supplies Kit",
    description: "Notebook, pens and learning materials",
    recipient: "Sarah Mbarga",
    period: "September 2026",
    status: "Pending",
  },
  {
    id: 2,
    title: "School Bag",
    description: "Educational school bag",
    recipient: "Junior Tchoumi",
    period: "August 2026",
    status: "Awarded",
  },
  {
    id: 3,
    title: "Textbook",
    description: "Subject-specific educational textbook",
    recipient: "Grace Nfor",
    period: "July 2026",
    status: "Awarded",
  },
];
*/

const examFilters = ["All", "Scheduled", "Completed", "Draft"];

const parseExamData = (exam) => {
  const subject = exam?.subject ?? {};
  const levels = Array.isArray(subject.levels)
    ? subject.levels
    : subject.level
      ? [subject.level]
      : [];
  const levelNames = [...new Set(levels.map((level) => level?.name).filter(Boolean))];
  const classNames = [...new Set(
    levels.flatMap((level) => level?.classrooms ?? [])
      .map((classroom) => classroom?.name)
      .filter(Boolean)
  )];
  const results = Array.isArray(exam?.results) ? exam.results : [];
  const scoredResults = results.filter((result) => result?.score !== null && result?.score !== undefined && Number.isFinite(Number(result.score)));
  const scores = scoredResults.map((result) => Number(result.score));
  const learners = new Set(results.map((result) => result?.learner_id).filter(Boolean));
  const participants = learners.size || results.length;
  const average = scores.length
    ? Math.round(scores.reduce((total, score) => total + score, 0) / scores.length * 10) / 10
    : 0;
  const evalDate = parseApiDate(exam?.eval_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const status = participants > 0
    ? "Completed"
    : evalDate && !Number.isNaN(evalDate.getTime()) && evalDate >= today
      ? "Scheduled"
      : "Draft";

  return {
    ...exam,
    subjectName: subject.name || "N/A",
    levelName: levelNames.join(", ") || "N/A",
    className: classNames.join(", ") || "N/A",
    participants,
    average,
    status,
    formattedDate: evalDate && !Number.isNaN(evalDate.getTime())
      ? evalDate.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })
      : "—",
  };
};

function parseApiDate(value) {
  if (!value) return null;

  const datePart = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (datePart) {
    const [, year, month, day] = datePart;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export default function AdminExamsRewardsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [examFilter, setExamFilter] = useState("All");
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      try {
        const response = await apiFetch("/admin/evaluations");
        const rawExams = response.data || [];
        setExams(rawExams.map(parseExamData));
      } catch (err) {
        setError(err.message || "Failed to fetch evaluations.");
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const filteredExams = useMemo(() => {
    const query = search.toLowerCase().trim();

    return exams.filter((exam) => {
      const matchesSearch =
        !query ||
        exam.title?.toLowerCase().includes(query) ||
        exam.subjectName?.toLowerCase().includes(query) ||
        exam.className?.toLowerCase().includes(query);

      const matchesFilter =
        examFilter === "All" || exam.status === examFilter;

      return matchesSearch && matchesFilter;
    });
  }, [exams, search, examFilter]);

  const scheduled = exams.filter((e) => e.status === "Scheduled").length;
  const completed = exams.filter((e) => e.status === "Completed").length;

  return (
    <div className="min-h-screen bg-[#FAF9FB] font-sans text-[#302C38]">
      <SidebarAdmin activeItem="Exams & Rewards" />

      <main className="lg:ml-64">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-5 sm:px-8">
          <p className="hidden text-sm text-gray-500 lg:block">
            Exams
          </p>

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
          {/* Heading */}
          <section>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-pf-purple">
                  ACADEMIC PERFORMANCE
                </p>
                <h1 className="mt-1 font-serif text-2xl font-medium text-pf-purple-dark sm:text-3xl">
                  Exams
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-gray-500">
                  Manage examinations and track learner performance.
                </p>
              </div>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-pf-purple px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-pf-purple-dark"
              >
                <Plus className="h-4 w-4" />
                Create exam
              </button>
            </div>
          </section>

          <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={ClipboardCheck}
              label="Total exams"
              value={exams.length}
            />
            <StatCard
              icon={Target}
              label="Scheduled"
              value={scheduled}
            />
            <StatCard
              icon={CheckCircle2}
              label="Completed"
              value={completed}
            />
            {/* V2: rewards pending statistic
            <StatCard icon={Award} label="Rewards pending" value={pendingRewards} />
            */}
          </section>

          {/* Exams */}
          <section className="mt-7 rounded-2xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 p-5 sm:p-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <h2 className="font-serif text-xl text-pf-purple-dark">
                    Examination management
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Create, schedule and monitor learner assessments.
                  </p>
                </div>

                <div className="relative w-full xl:w-80">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search exams..."
                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-pf-purple focus:ring-2 focus:ring-pf-purple/10"
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {examFilters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setExamFilter(filter)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      examFilter === filter
                        ? "bg-pf-purple text-white"
                        : "bg-[#FAF9FB] text-gray-500 hover:bg-pf-purple-light hover:text-pf-purple"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-4 text-center text-xs text-red-500">
                {error}
              </div>
            )}

            {loading ? (
              <div className="py-12 text-center text-sm text-gray-400">
                Loading examinations...
              </div>
            ) : (
              <>
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[1050px]">
                    <thead>
                      <tr className="border-b border-gray-100 bg-[#FCFBFD] text-left">
                        <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                          Examination
                        </th>
                        <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                          Subject
                        </th>
                        <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                          Level / Class
                        </th>
                        <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                          Date
                        </th>
                        <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                          Participants
                        </th>
                        <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                          Average
                        </th>
                        <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredExams.map((exam) => (
                        <ExamRow
                          key={exam.id}
                          exam={exam}
                          openMenu={openMenu}
                          setOpenMenu={setOpenMenu}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="divide-y divide-gray-100 md:hidden">
                  {filteredExams.map((exam) => (
                    <ExamMobileCard
                      key={exam.id}
                      exam={exam}
                      openMenu={openMenu}
                      setOpenMenu={setOpenMenu}
                    />
                  ))}
                </div>

                {filteredExams.length === 0 && (
                  <div className="py-16 text-center">
                    <ClipboardCheck className="mx-auto h-8 w-8 text-gray-300" />
                    <h3 className="mt-4 font-serif text-lg text-pf-purple-dark">
                      No examinations found
                    </h3>
                    <p className="mt-1 text-sm text-gray-400">
                      Try changing your search or filter.
                    </p>
                  </div>
                )}
              </>
            )}

            {filteredExams.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-5 py-4 sm:px-6">
                <p className="text-xs text-gray-400">
                  Showing {filteredExams.length} of {exams.length} examinations
                </p>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-pf-purple hover:underline"
                >
                  View all results
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </section>

          {/* V2: Rewards and most-progressive section
          <section className="mt-7 grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
            <div className="rounded-2xl border border-gray-200 bg-white">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 p-5 sm:p-6">
                <div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-pf-gold" />
                    <h2 className="font-serif text-xl text-pf-purple-dark">
                      Most Progressive Students
                    </h2>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Learners selected according to their academic improvement.
                  </p>
                </div>
                <button
                  type="button"
                  className="text-xs font-semibold text-pf-purple hover:underline"
                >
                  View history
                </button>
              </div>

              <div className="divide-y divide-gray-100">
                {progressiveStudents.map((student, index) => (
                  <ProgressiveStudent
                    key={student.id}
                    student={student}
                    position={index + 1}
                  />
                ))}
              </div>

              <div className="border-t border-gray-100 p-5">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-pf-purple hover:underline"
                >
                  Manage selection criteria
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white">
              <div className="border-b border-gray-100 p-5 sm:p-6">
                <div className="flex items-center gap-2">
                  <Medal className="h-5 w-5 text-pf-gold" />
                  <h2 className="font-serif text-xl text-pf-purple-dark">
                    Rewards
                  </h2>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Non-cash rewards given to progressive learners.
                </p>
              </div>

              <div className="divide-y divide-gray-100">
                {rewards.map((reward) => (
                  <RewardRow key={reward.id} reward={reward} />
                ))}
              </div>

              <div className="border-t border-gray-100 p-5">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-pf-purple hover:underline"
                >
                  Manage rewards
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </section>

          Reward configuration
          <section className="mt-7 rounded-2xl bg-pf-purple p-5 text-white sm:p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-white/10 p-3">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-medium tracking-wide text-purple-200">
                    REWARD PROGRAM
                  </p>
                  <h2 className="mt-1 font-serif text-xl">
                    Reward the most progressive learner
                  </h2>
                  <p className="mt-1 max-w-xl text-sm text-purple-100">
                    The platform can recognize learners based on improvement,
                    consistency and assessment performance rather than only the
                    highest average.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-pf-purple shadow-sm hover:bg-purple-50"
              >
                Configure program
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </section>
          */}
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }) {
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
      <p className="mt-4 text-xs text-gray-500">{label}</p>
    </div>
  );
}

function ExamRow({ exam, openMenu, setOpenMenu }) {
  return (
    <tr className="border-b border-gray-100 last:border-0 hover:bg-[#FCFBFD]">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pf-purple-light">
            <ClipboardCheck className="h-5 w-5 text-pf-purple" />
          </div>
          <div>
            <p className="max-w-[260px] truncate text-sm font-medium text-pf-purple-dark">
              {exam.title}
            </p>
            <p className="mt-0.5 text-[10px] text-gray-400">
              Examination #{exam.id.toString().padStart(3, "0")}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <span className="text-xs text-gray-600">{exam.subjectName}</span>
      </td>

      <td className="px-4 py-4">
        <p className="text-xs text-gray-600">{exam.levelName}</p>
        <p className="mt-0.5 text-[10px] text-gray-400">{exam.className}</p>
      </td>

      <td className="px-4 py-4 text-xs text-gray-600">
        {exam.formattedDate}
      </td>

      <td className="px-4 py-4">
        <div className="flex items-center gap-1.5">
          <UsersRound className="h-3.5 w-3.5 text-gray-400" />
          <span className="text-xs font-medium text-pf-purple-dark">
            {exam.participants}
          </span>
        </div>
      </td>

      <td className="px-4 py-4">
        {exam.average > 0 ? (
          <span className="text-xs font-semibold text-pf-purple-dark">
            {exam.average}/20
          </span>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        )}
      </td>

      <td className="px-4 py-4">
        <ExamStatus status={exam.status} />
      </td>

      <td className="relative px-6 py-4 text-right">
        <button
          type="button"
          onClick={() =>
            setOpenMenu(openMenu === exam.id ? null : exam.id)
          }
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-pf-purple"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>

        {openMenu === exam.id && <ExamActionMenu exam={exam} />}
      </td>
    </tr>
  );
}

function ExamMobileCard({ exam, openMenu, setOpenMenu }) {
  return (
    <div className="relative p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pf-purple-light">
          <ClipboardCheck className="h-5 w-5 text-pf-purple" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-pf-purple-dark">
                {exam.title}
              </p>
              <p className="mt-1 text-[10px] text-gray-400">
                {exam.subjectName} · {exam.className}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setOpenMenu(openMenu === exam.id ? null : exam.id)
              }
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <MiniInfo label="Date" value={exam.formattedDate} />
            <MiniInfo label="Participants" value={exam.participants} />
            <MiniInfo
              label="Average"
              value={exam.average > 0 ? `${exam.average}/20` : "—"}
            />
            <MiniInfo label="Level" value={exam.levelName} />
          </div>

          <div className="mt-3">
            <ExamStatus status={exam.status} />
          </div>
        </div>
      </div>

      {openMenu === exam.id && <ExamActionMenu exam={exam} mobile />}
    </div>
  );
}

function MiniInfo({ label, value }) {
  return (
    <div className="rounded-lg bg-[#FAF9FB] p-2.5">
      <p className="text-[10px] text-gray-400">{label}</p>
      <p className="mt-1 truncate text-xs font-medium text-pf-purple-dark">
        {value}
      </p>
    </div>
  );
}

function ExamStatus({ status }) {
  const styles = {
    Scheduled: "bg-blue-50 text-blue-600",
    Completed: "bg-green-50 text-green-600",
    Draft: "bg-gray-100 text-gray-500",
  };

  const Icon =
    status === "Scheduled"
      ? Target
      : status === "Completed"
      ? CheckCircle2
      : XCircle;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${
        styles[status] || "bg-gray-100 text-gray-500"
      }`}
    >
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}

function ExamActionMenu({ exam, mobile = false }) {
  return (
    <div
      className={`absolute z-30 w-52 rounded-xl border border-gray-200 bg-white p-1.5 text-left shadow-lg ${
        mobile ? "right-5 top-16" : "right-6 top-12"
      }`}
    >
      <a
        href={`/admin-exams-rewards/${exam.id}`}
        className="flex items-center justify-between rounded-lg px-3 py-2 text-xs text-gray-600 hover:bg-pf-purple-light hover:text-pf-purple"
      >
        View exam
        <ChevronRight className="h-3.5 w-3.5" />
      </a>

      <button
        type="button"
        className="w-full rounded-lg px-3 py-2 text-left text-xs text-gray-600 hover:bg-gray-50"
      >
        Edit exam
      </button>

      {exam.status === "Completed" && (
        <button
          type="button"
          className="w-full rounded-lg px-3 py-2 text-left text-xs text-pf-purple hover:bg-pf-purple-light"
        >
          View results
        </button>
      )}

      <button
        type="button"
        className="w-full rounded-lg px-3 py-2 text-left text-xs text-red-500 hover:bg-red-50"
      >
        Delete exam
      </button>
    </div>
  );
}

function ProgressiveStudent({ student, position }) {
  return (
    <div className="flex items-center gap-4 p-5">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          position === 1
            ? "bg-pf-gold text-white"
            : "bg-pf-purple-light text-pf-purple"
        }`}
      >
        {position}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-pf-purple-dark">
            {student.name}
          </p>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500">
            {student.className}
          </span>
        </div>

        <p className="mt-1 text-xs text-gray-500">{student.reason}</p>

        <div className="mt-2 flex flex-wrap gap-3 text-[10px] text-gray-400">
          <span>Previous: {student.previousAverage}%</span>
          <span>Current: {student.currentAverage}%</span>
          <span>{student.subjects} subjects</span>
        </div>
      </div>

      <div className="text-right">
        <p className="text-sm font-bold text-pf-green">
          +{student.progress}%
        </p>
        <p className="mt-1 text-[10px] text-gray-400">progress</p>
      </div>
    </div>
  );
}

function RewardRow({ reward }) {
  const awarded = reward.status === "Awarded";

  return (
    <div className="p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pf-purple-light">
          <Award className="h-5 w-5 text-pf-purple" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-pf-purple-dark">
                {reward.title}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {reward.description}
              </p>
            </div>

            <span
              className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-medium ${
                awarded
                  ? "bg-green-50 text-green-600"
                  : "bg-amber-50 text-amber-600"
              }`}
            >
              {reward.status}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-gray-400">
            <span>Recipient: {reward.recipient}</span>
            <span>{reward.period}</span>
          </div>
        </div>
      </div>
    </div>
  );
}