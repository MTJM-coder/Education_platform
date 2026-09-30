import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Award,
  BarChart3,
  BookOpen,
  CheckCircle2,
  FileText,
  ListChecks,
  Target,
  Trophy,
  UsersRound,
} from "lucide-react";
import { useParams } from "react-router-dom";
import SidebarAdmin from "../components/admin/SidebarAdmin";
import { apiFetch } from "../lib/apiClient";

/* ========================================================= */
/* HELPERS                                                     */
/* ========================================================= */

// Les noms de champs de Question / User / Learner ne sont pas visibles depuis
// les fichiers fournis : on essaie plusieurs noms courants. Adaptez ces
// helpers si vos colonnes s'appellent autrement.
function getQuestionText(q) {
  return q.question_text ?? q.text ?? q.content ?? q.question ?? q.title ?? "—";
}

function getQuestionMarks(q) {
  const value = q.marks ?? q.points ?? q.max_score ?? null;
  return value === null || value === undefined ? null : Number(value);
}

function getPersonName(user) {
  if (!user) return "—";
  if (user.name) return user.name;
  const full = [user.first_name, user.last_name].filter(Boolean).join(" ");
  return full || user.email || "—";
}

function getLearnerName(result) {
  return getPersonName(result.learner?.user);
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatNumber(value) {
  if (value === null || value === undefined) return "—";
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

/* ========================================================= */
/* PAGE                                                        */
/* ========================================================= */

export default function AdminExamRewardDetailPage() {
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState("Overview");
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchEvaluation = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await apiFetch(`/evaluations/${id}`);
        // show() renvoie l'évaluation directement ; on accepte aussi { data }.
        const payload = response?.data ?? response;
        if (!cancelled) setEvaluation(payload);
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Unable to load this assessment.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchEvaluation();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const questions = useMemo(
    () => evaluation?.questions ?? [],
    [evaluation]
  );

  const results = useMemo(
    () => evaluation?.results ?? [],
    [evaluation]
  );

  // Total des points : somme des points des questions, si le champ existe.
  const totalMarks = useMemo(() => {
    const marks = questions.map(getQuestionMarks);
    if (marks.length === 0 || marks.some((m) => m === null)) return null;
    return marks.reduce((sum, m) => sum + m, 0);
  }, [questions]);

  const stats = useMemo(() => {
    const scores = results
      .map((r) => Number(r.score))
      .filter((s) => Number.isFinite(s));

    if (scores.length === 0) {
      return { count: results.length, average: null, highest: null, lowest: null };
    }

    return {
      count: results.length,
      average: scores.reduce((sum, s) => sum + s, 0) / scores.length,
      highest: Math.max(...scores),
      lowest: Math.min(...scores),
    };
  }, [results]);

  const scoreLabel = (value) => {
    if (value === null || value === undefined) return "—";
    return totalMarks
      ? `${formatNumber(value)}/${formatNumber(totalMarks)}`
      : formatNumber(value);
  };

  const averagePercent =
    stats.average !== null && totalMarks
      ? Math.round((stats.average / totalMarks) * 100)
      : null;

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
              aria-label="Back to exams and rewards"
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
          {loading && (
            <p className="text-sm text-gray-500">Loading assessment…</p>
          )}

          {!loading && error && (
            <div
              role="alert"
              className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600"
            >
              {error}
            </div>
          )}

          {!loading && !error && evaluation && (
            <>
              {/* Page heading */}
              <section>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pf-purple-light">
                    <FileText className="h-6 w-6 text-pf-purple" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-pf-purple">
                      ASSESSMENT DETAILS
                    </p>

                    <h1 className="mt-1 font-serif text-2xl font-medium text-pf-purple-dark sm:text-3xl">
                      {evaluation.title}
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                      {evaluation.subject?.name ?? "—"} ·{" "}
                      {formatDate(evaluation.eval_date)}
                    </p>
                  </div>
                </div>
              </section>

              {/* Main stats */}
              <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  icon={UsersRound}
                  label="Results recorded"
                  value={stats.count}
                  detail="Learners with a score"
                />

                <StatCard
                  icon={Target}
                  label="Average score"
                  value={scoreLabel(stats.average)}
                  detail={
                    averagePercent !== null
                      ? `${averagePercent}% average`
                      : "No score yet"
                  }
                />

                <StatCard
                  icon={Trophy}
                  label="Highest score"
                  value={scoreLabel(stats.highest)}
                  detail="Best performance"
                />

                <StatCard
                  icon={ListChecks}
                  label="Questions"
                  value={questions.length}
                  detail={
                    totalMarks ? `${formatNumber(totalMarks)} marks in total` : "In this assessment"
                  }
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
                    evaluation={evaluation}
                    questionCount={questions.length}
                    totalMarks={totalMarks}
                    stats={stats}
                    scoreLabel={scoreLabel}
                  />
                )}

                {activeTab === "Questions" && (
                  <QuestionsTab questions={questions} />
                )}

                {activeTab === "Participants" && (
                  <ParticipantsTab
                    results={results}
                    totalMarks={totalMarks}
                  />
                )}

                {activeTab === "Reward" && <RewardTab />}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

/* ========================================================= */
/* OVERVIEW                                                    */
/* ========================================================= */

function OverviewTab({
  evaluation,
  questionCount,
  totalMarks,
  stats,
  scoreLabel,
}) {
  const levels = evaluation.subject?.levels ?? [];
  const levelNames = levels.map((level) => level.name).filter(Boolean);
  const classNames = levels
    .flatMap((level) => level.classrooms ?? [])
    .map((classroom) => classroom.name)
    .filter(Boolean);

  return (
    <div className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
      <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-pf-purple" />

          <h2 className="font-serif text-xl text-pf-purple-dark">
            Assessment information
          </h2>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <InfoItem label="Subject" value={evaluation.subject?.name ?? "—"} />
          <InfoItem label="Date" value={formatDate(evaluation.eval_date)} />
          <InfoItem
            label="Levels"
            value={levelNames.length ? levelNames.join(", ") : "—"}
          />
          <InfoItem
            label="Classes"
            value={classNames.length ? classNames.join(", ") : "—"}
          />
          <InfoItem
            label="Created by"
            value={getPersonName(evaluation.creator)}
          />
          <InfoItem label="Questions" value={`${questionCount} questions`} />
          {totalMarks !== null && (
            <InfoItem
              label="Total marks"
              value={`${formatNumber(totalMarks)} marks`}
            />
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-pf-purple" />

          <h2 className="font-serif text-lg text-pf-purple-dark">
            Performance
          </h2>
        </div>

        {stats.count === 0 ? (
          <p className="mt-5 text-sm text-gray-500">
            No result has been recorded for this assessment yet.
          </p>
        ) : (
          <div className="mt-5 space-y-4">
            <PerformanceRow label="Average" value={scoreLabel(stats.average)} />
            <PerformanceRow label="Highest" value={scoreLabel(stats.highest)} />
            <PerformanceRow label="Lowest" value={scoreLabel(stats.lowest)} />
          </div>
        )}
      </section>
    </div>
  );
}

/* ========================================================= */
/* QUESTIONS                                                   */
/* ========================================================= */

function QuestionsTab({ questions }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-100 p-5 sm:p-6">
        <h2 className="font-serif text-xl text-pf-purple-dark">Questions</h2>

        <p className="mt-1 text-sm text-gray-500">
          Questions included in this assessment.
        </p>
      </div>

      {questions.length === 0 ? (
        <p className="p-5 text-sm text-gray-500 sm:p-6">
          No question has been added to this assessment yet.
        </p>
      ) : (
        <div className="divide-y divide-gray-100">
          {questions.map((question, index) => {
            const marks = getQuestionMarks(question);

            return (
              <div key={question.id} className="flex items-start gap-4 p-5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-pf-purple-light text-xs font-semibold text-pf-purple">
                  {question.number ?? index + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-pf-purple-dark">
                    {getQuestionText(question)}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {question.type && (
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] text-gray-500">
                        {question.type}
                      </span>
                    )}

                    {marks !== null && (
                      <span className="text-[10px] text-gray-400">
                        {formatNumber(marks)} marks
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

/* ========================================================= */
/* PARTICIPANTS                                                */
/* ========================================================= */

function ParticipantsTab({ results, totalMarks }) {
  const rows = results.map((result) => {
    const score = Number(result.score);
    const hasScore = Number.isFinite(score);

    return {
      id: result.id,
      name: getLearnerName(result),
      className: result.learner?.classroom?.name ?? "—",
      score: hasScore ? score : null,
      percentage:
        hasScore && totalMarks
          ? Math.round((score / totalMarks) * 1000) / 10
          : null,
      grade: result.grade ?? null,
    };
  });

  return (
    <section className="rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-100 p-5 sm:p-6">
        <h2 className="font-serif text-xl text-pf-purple-dark">
          Participants
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Learners with a recorded result for this assessment.
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="p-5 text-sm text-gray-500 sm:p-6">
          No result has been recorded yet.
        </p>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100 bg-[#FCFBFD] text-left">
                  <Th className="px-6">Learner</Th>
                  <Th>Class</Th>
                  <Th>Score</Th>
                  <Th>Percentage</Th>
                  <Th className="px-6">Grade</Th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={row.name} />
                        <span className="text-sm font-medium text-pf-purple-dark">
                          {row.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-xs text-gray-500">
                      {row.className}
                    </td>

                    <td className="px-4 py-4 text-xs font-semibold text-pf-purple-dark">
                      {row.score !== null
                        ? totalMarks
                          ? `${formatNumber(row.score)}/${formatNumber(totalMarks)}`
                          : formatNumber(row.score)
                        : "—"}
                    </td>

                    <td className="px-4 py-4 text-xs text-gray-500">
                      {row.percentage !== null ? `${row.percentage}%` : "—"}
                    </td>

                    <td className="px-6 py-4 text-xs text-gray-500">
                      {row.grade ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-gray-100 md:hidden">
            {rows.map((row) => (
              <div key={row.id} className="flex items-center gap-3 p-5">
                <Avatar name={row.name} />

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-pf-purple-dark">
                    {row.name}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">{row.className}</p>
                </div>

                <div className="text-right">
                  <p className="text-xs font-semibold text-pf-purple-dark">
                    {row.score !== null
                      ? totalMarks
                        ? `${formatNumber(row.score)}/${formatNumber(totalMarks)}`
                        : formatNumber(row.score)
                      : "—"}
                  </p>

                  {row.grade && (
                    <p className="mt-1 text-[10px] text-gray-400">
                      {row.grade}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

/* ========================================================= */
/* REWARD (placeholder — module Récompenses pas encore codé)   */
/* ========================================================= */

function RewardTab() {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pf-purple-light">
          <Award className="h-5 w-5 text-pf-purple" />
        </div>

        <div>
          <h2 className="font-serif text-xl text-pf-purple-dark">Rewards</h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
            Rewards are not available yet. This tab will show the reward linked
            to this assessment once the rewards module is built.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ========================================================= */
/* SMALL COMPONENTS                                            */
/* ========================================================= */

function StatCard({ icon: Icon, label, value, detail }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pf-purple-light">
          <Icon className="h-5 w-5 text-pf-purple" />
        </div>

        <span className="font-serif text-xl text-pf-purple-dark">{value}</span>
      </div>

      <p className="mt-4 text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-[10px] text-gray-400">{detail}</p>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-pf-purple-dark">{value}</p>
    </div>
  );
}

function PerformanceRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-pf-purple-dark">{value}</span>
    </div>
  );
}

function Th({ children, className = "px-4" }) {
  return (
    <th
      className={`${className} py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400`}
    >
      {children}
    </th>
  );
}

function Avatar({ name }) {
  const initials =
    name === "—"
      ? "?"
      : name
          .split(" ")
          .filter(Boolean)
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();

  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pf-purple-light text-xs font-semibold text-pf-purple">
      {initials}
    </div>
  );
}