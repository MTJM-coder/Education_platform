import React, { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Award,
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  GraduationCap,
  Minus,
  Target,
  TrendingUp,
  Trophy,
  UsersRound,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const childrenData = [
  {
    id: 1,
    name: "Doly Junior",
    className: "Form 4",
    school: "Government Bilingual High School",
    average: 78,
    previousAverage: 74,
    target: 85,
    sessionsCompleted: 18,
    sessionsTotal: 20,
    studyHours: 24,
    currentRank: 6,
    totalStudents: 32,
  },
  {
    id: 2,
    name: "Mireille Djoumesse",
    className: "Form 3",
    school: "Lycée Bilingue de Douala",
    average: 81,
    previousAverage: 79,
    target: 85,
    sessionsCompleted: 21,
    sessionsTotal: 23,
    studyHours: 28,
    currentRank: 4,
    totalStudents: 28,
  },
];

const progressData = [
  {
    learnerId: 1,
    subject: "Mathematics",
    teacher: "Xavier Ndi",
    current: 78,
    previous: 72,
    target: 85,
    sessions: 8,
    progress: [64, 68, 70, 72, 74, 76, 78],
  },
  {
    learnerId: 1,
    subject: "Physics",
    teacher: "Nfor Grace",
    current: 64,
    previous: 68,
    target: 75,
    sessions: 5,
    progress: [71, 70, 68, 67, 65, 64],
  },
  {
    learnerId: 1,
    subject: "English",
    teacher: "Acha Mireille",
    current: 85,
    previous: 81,
    target: 90,
    sessions: 4,
    progress: [76, 78, 80, 81, 82, 85],
  },
  {
    learnerId: 1,
    subject: "Computer Science",
    teacher: "Bih Patrick",
    current: 72,
    previous: 72,
    target: 80,
    sessions: 3,
    progress: [68, 70, 72, 71, 72],
  },
  {
    learnerId: 1,
    subject: "French",
    teacher: "Ngoe Laure",
    current: 76,
    previous: 70,
    target: 82,
    sessions: 4,
    progress: [64, 67, 69, 70, 72, 76],
  },

  {
    learnerId: 2,
    subject: "Mathematics",
    teacher: "Xavier Ndi",
    current: 82,
    previous: 77,
    target: 88,
    sessions: 9,
    progress: [70, 73, 75, 77, 79, 80, 82],
  },
  {
    learnerId: 2,
    subject: "Physics",
    teacher: "Nfor Grace",
    current: 79,
    previous: 75,
    target: 85,
    sessions: 7,
    progress: [68, 70, 72, 75, 76, 78, 79],
  },
  {
    learnerId: 2,
    subject: "English",
    teacher: "Acha Mireille",
    current: 88,
    previous: 84,
    target: 92,
    sessions: 6,
    progress: [77, 79, 81, 84, 86, 88],
  },
  {
    learnerId: 2,
    subject: "Computer Science",
    teacher: "Bih Patrick",
    current: 75,
    previous: 75,
    target: 82,
    sessions: 4,
    progress: [70, 72, 74, 75],
  },
];

const weeklyActivity = [
  {
    learnerId: 1,
    week: "Week 1",
    hours: 4.2,
    sessions: 3,
    exercises: 8,
  },
  {
    learnerId: 1,
    week: "Week 2",
    hours: 5.1,
    sessions: 4,
    exercises: 11,
  },
  {
    learnerId: 1,
    week: "Week 3",
    hours: 4.7,
    sessions: 3,
    exercises: 10,
  },
  {
    learnerId: 1,
    week: "Week 4",
    hours: 6.0,
    sessions: 4,
    exercises: 14,
  },
  {
    learnerId: 2,
    week: "Week 1",
    hours: 5.0,
    sessions: 4,
    exercises: 10,
  },
  {
    learnerId: 2,
    week: "Week 2",
    hours: 6.2,
    sessions: 5,
    exercises: 13,
  },
  {
    learnerId: 2,
    week: "Week 3",
    hours: 5.8,
    sessions: 4,
    exercises: 15,
  },
  {
    learnerId: 2,
    week: "Week 4",
    hours: 7.0,
    sessions: 5,
    exercises: 17,
  },
];

const achievements = [
  {
    id: 1,
    learnerId: 1,
    title: "Most Progressive Student",
    description:
      "Forte progression en Mathématiques et en Anglais.",
    date: "September 2026",
    icon: Trophy,
  },
  {
    id: 2,
    learnerId: 1,
    title: "Consistent Learner",
    description:
      "Plusieurs semaines avec une activité régulière.",
    date: "September 2026",
    icon: Target,
  },
  {
    id: 3,
    learnerId: 2,
    title: "Excellent Progress",
    description:
      "Progression constante dans les matières principales.",
    date: "September 2026",
    icon: Award,
  },
];

const getTrend = (current, previous) => {
  if (current > previous) return "up";
  if (current < previous) return "down";
  return "stable";
};

const getScoreLabel = (score) => {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 50) return "Needs attention";
  return "Critical";
};

const getScoreClass = (score) => {
  if (score >= 80) {
    return "bg-green-50 text-green-700";
  }

  if (score >= 60) {
    return "bg-blue-50 text-blue-700";
  }

  if (score >= 50) {
    return "bg-orange-50 text-orange-700";
  }

  return "bg-red-50 text-red-700";
};

function ProgressBar({
  value,
  target = null,
  height = "h-2",
}) {
  const percentage = Math.min(Math.max(value, 0), 100);

  return (
    <div className="relative">
      <div
        className={`w-full overflow-hidden rounded-full bg-gray-100 ${height}`}
      >
        <div
          className={`h-full rounded-full transition-all ${
            value >= 80
              ? "bg-green-500"
              : value >= 60
              ? "bg-[#6D4AFF]"
              : "bg-orange-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {target !== null && (
        <div
          className="absolute top-1/2 h-4 w-0.5 -translate-y-1/2 bg-gray-800"
          style={{
            left: `${Math.min(target, 100)}%`,
          }}
          title={`Objectif : ${target}`}
        />
      )}
    </div>
  );
}

export default function ParentProgressPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const learnerFromUrl = Number(
    searchParams.get("learner")
  );

  const [selectedChild, setSelectedChild] = useState(
    learnerFromUrl || 1
  );

  const [period, setPeriod] = useState("current");

  const child = childrenData.find(
    (item) => item.id === selectedChild
  );

  const subjects = useMemo(
    () =>
      progressData.filter(
        (item) => item.learnerId === selectedChild
      ),
    [selectedChild]
  );

  const activity = useMemo(
    () =>
      weeklyActivity.filter(
        (item) => item.learnerId === selectedChild
      ),
    [selectedChild]
  );

  const childAchievements = achievements.filter(
    (item) => item.learnerId === selectedChild
  );

  const bestSubject = [...subjects].sort(
    (a, b) => b.current - a.current
  )[0];

  const weakestSubject = [...subjects].sort(
    (a, b) => a.current - b.current
  )[0];

  const mostImproved = [...subjects].sort(
    (a, b) =>
      b.current -
      b.previous -
      (a.current - a.previous)
  )[0];

  const averageImprovement =
    child && child.average && child.previousAverage
      ? (
          child.average - child.previousAverage
        ).toFixed(1)
      : "0";

  const goalProgress = child
    ? Math.min(
        Math.round(
          (child.average / child.target) * 100
        ),
        100
      )
    : 0;

  const totalHours = activity.reduce(
    (sum, item) => sum + item.hours,
    0
  );

  const totalExercises = activity.reduce(
    (sum, item) => sum + item.exercises,
    0
  );

  const handleChildChange = (id) => {
    const numericId = Number(id);

    setSelectedChild(numericId);

    navigate(
      `/child-progress?learner=${numericId}`,
      { replace: true }
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F8FA]">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-6 py-5 lg:px-8">
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <button
              onClick={() =>
                navigate("/parent-dashboard")
              }
              className="hover:text-[#6D4AFF]"
            >
              Dashboard
            </button>

            <span>/</span>

            <span className="font-medium text-gray-900">
              Progress
            </span>
          </div>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Child Progress
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Suivez l'évolution scolaire et l'activité
                d'apprentissage.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <select
                  value={selectedChild}
                  onChange={(e) =>
                    handleChildChange(e.target.value)
                  }
                  className="appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-gray-800 outline-none focus:border-[#6D4AFF]"
                >
                  {childrenData.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>

              <div className="relative">
                <select
                  value={period}
                  onChange={(e) =>
                    setPeriod(e.target.value)
                  }
                  className="appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-gray-800 outline-none focus:border-[#6D4AFF]"
                >
                  <option value="current">
                    Current Term
                  </option>
                  <option value="previous">
                    Previous Term
                  </option>
                  <option value="year">
                    Academic Year
                  </option>
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 lg:p-8">
        {/* Student identity */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#6D4AFF]/10">
                <GraduationCap
                  size={28}
                  className="text-[#6D4AFF]"
                />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {child?.name}
                </h2>

                <p className="text-sm text-gray-500">
                  {child?.className} • {child?.school}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() =>
                  navigate(
                    `/resultats-scolaires?learner=${selectedChild}`
                  )
                }
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <BarChart3 size={17} />
                Résultats
              </button>

              <button
                onClick={() =>
                  navigate(
                    `/parent-schedule?learner=${selectedChild}`
                  )
                }
                className="inline-flex items-center gap-2 rounded-xl bg-[#6D4AFF] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#5B3FE0]"
              >
                <CalendarDays size={17} />
                Planning
              </button>
            </div>
          </div>
        </div>

        {/* Main stats */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Moyenne actuelle
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {child?.average}
                  <span className="ml-1 text-base font-medium text-gray-400">
                    /100
                  </span>
                </p>

                <div className="mt-2 flex items-center gap-1.5">
                  {Number(averageImprovement) > 0 ? (
                    <ArrowUp
                      size={15}
                      className="text-green-600"
                    />
                  ) : Number(averageImprovement) < 0 ? (
                    <ArrowDown
                      size={15}
                      className="text-red-500"
                    />
                  ) : (
                    <Minus
                      size={15}
                      className="text-gray-400"
                    />
                  )}

                  <span
                    className={`text-xs font-semibold ${
                      Number(averageImprovement) > 0
                        ? "text-green-600"
                        : Number(averageImprovement) < 0
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    {Number(averageImprovement) > 0
                      ? "+"
                      : ""}
                    {averageImprovement} pts
                  </span>

                  <span className="text-xs text-gray-400">
                    vs précédent
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-[#6D4AFF]/10 p-3">
                <TrendingUp
                  size={22}
                  className="text-[#6D4AFF]"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Objectif
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {child?.target}
                  <span className="ml-1 text-base font-medium text-gray-400">
                    /100
                  </span>
                </p>

                <p className="mt-2 text-xs text-gray-500">
                  {goalProgress}% de l'objectif atteint
                </p>
              </div>

              <div className="rounded-xl bg-green-50 p-3">
                <Target
                  size={22}
                  className="text-green-600"
                />
              </div>
            </div>

            <div className="mt-4">
              <ProgressBar
                value={goalProgress}
                height="h-2"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Séances complétées
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {child?.sessionsCompleted}
                  <span className="text-base font-medium text-gray-400">
                    {" "}
                    / {child?.sessionsTotal}
                  </span>
                </p>

                <p className="mt-2 text-xs text-gray-500">
                  {Math.round(
                    (child?.sessionsCompleted /
                      child?.sessionsTotal) *
                      100
                  )}
                  % des séances
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-3">
                <CheckCircle2
                  size={22}
                  className="text-blue-600"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Rang actuel
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {child?.currentRank}
                  <span className="text-base font-medium text-gray-400">
                    {" "}
                    / {child?.totalStudents}
                  </span>
                </p>

                <p className="mt-2 text-xs text-gray-500">
                  Classement de la classe
                </p>
              </div>

              <div className="rounded-xl bg-yellow-50 p-3">
                <Trophy
                  size={22}
                  className="text-yellow-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Progress overview */}
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Overall progress */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 xl:col-span-2">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-bold text-gray-900">
                  Progression générale
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Évolution de la performance sur les dernières
                  évaluations.
                </p>
              </div>

              <div className="rounded-xl bg-[#6D4AFF]/10 p-3">
                <BarChart3
                  size={21}
                  className="text-[#6D4AFF]"
                />
              </div>
            </div>

            <div className="mt-6">
              <div className="flex h-52 items-end gap-3">
                {[
                  64, 67, 70, 69, 73, 74, 76, 78,
                ].map((value, index) => (
                  <div
                    key={index}
                    className="flex h-full flex-1 flex-col justify-end"
                  >
                    <div className="mb-2 text-center text-xs font-medium text-gray-500">
                      {value}
                    </div>

                    <div
                      className="w-full rounded-t-lg bg-[#6D4AFF]/80 transition hover:bg-[#6D4AFF]"
                      style={{
                        height: `${value * 1.8}px`,
                        maxHeight: "180px",
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-3 grid grid-cols-8 border-t border-gray-100 pt-3 text-center text-[11px] text-gray-400">
                <span>W1</span>
                <span>W2</span>
                <span>W3</span>
                <span>W4</span>
                <span>W5</span>
                <span>W6</span>
                <span>W7</span>
                <span>W8</span>
              </div>
            </div>
          </div>

          {/* Quick insights */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="font-bold text-gray-900">
              Analyse rapide
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Les principaux éléments à retenir.
            </p>

            <div className="mt-5 space-y-4">
              {bestSubject && (
                <div className="rounded-xl bg-green-50 p-4">
                  <div className="flex items-start gap-3">
                    <Trophy
                      size={20}
                      className="mt-0.5 shrink-0 text-green-600"
                    />

                    <div>
                      <p className="text-sm font-semibold text-green-800">
                        Point fort
                      </p>

                      <p className="mt-1 text-sm text-green-700">
                        {bestSubject.subject} avec{" "}
                        {bestSubject.current}/100.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {mostImproved && (
                <div className="rounded-xl bg-blue-50 p-4">
                  <div className="flex items-start gap-3">
                    <TrendingUp
                      size={20}
                      className="mt-0.5 shrink-0 text-blue-600"
                    />

                    <div>
                      <p className="text-sm font-semibold text-blue-800">
                        Plus forte progression
                      </p>

                      <p className="mt-1 text-sm text-blue-700">
                        {mostImproved.subject} : +
                        {mostImproved.current -
                          mostImproved.previous}{" "}
                        points.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {weakestSubject && (
                <div className="rounded-xl bg-orange-50 p-4">
                  <div className="flex items-start gap-3">
                    <Target
                      size={20}
                      className="mt-0.5 shrink-0 text-orange-600"
                    />

                    <div>
                      <p className="text-sm font-semibold text-orange-800">
                        À renforcer
                      </p>

                      <p className="mt-1 text-sm text-orange-700">
                        {weakestSubject.subject} nécessite
                        davantage de suivi.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Subjects */}
        <div className="mt-6">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              Progression par matière
            </h2>

            <p className="text-sm text-gray-500">
              Comparez le niveau actuel avec les objectifs.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {subjects.map((subject) => {
              const difference =
                subject.current - subject.previous;

              const trend = getTrend(
                subject.current,
                subject.previous
              );

              return (
                <div
                  key={subject.subject}
                  className="rounded-2xl border border-gray-200 bg-white p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6D4AFF]/10">
                        <BookOpen
                          size={20}
                          className="text-[#6D4AFF]"
                        />
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {subject.subject}
                        </h3>

                        <p className="text-xs text-gray-500">
                          {subject.teacher}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getScoreClass(
                        subject.current
                      )}`}
                    >
                      {getScoreLabel(subject.current)}
                    </span>
                  </div>

                  <div className="mt-5 flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold text-gray-900">
                        {subject.current}
                        <span className="text-sm font-medium text-gray-400">
                          /100
                        </span>
                      </p>

                      <div className="mt-1 flex items-center gap-1.5">
                        {trend === "up" && (
                          <ArrowUp
                            size={14}
                            className="text-green-600"
                          />
                        )}

                        {trend === "down" && (
                          <ArrowDown
                            size={14}
                            className="text-red-500"
                          />
                        )}

                        {trend === "stable" && (
                          <Minus
                            size={14}
                            className="text-gray-400"
                          />
                        )}

                        <span
                          className={`text-xs font-semibold ${
                            trend === "up"
                              ? "text-green-600"
                              : trend === "down"
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {difference > 0 ? "+" : ""}
                          {difference} pts
                        </span>

                        <span className="text-xs text-gray-400">
                          vs précédent
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-400">
                        Objectif
                      </p>

                      <p className="mt-1 text-sm font-bold text-gray-800">
                        {subject.target}/100
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <ProgressBar
                      value={subject.current}
                      target={subject.target}
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                    <span className="text-xs text-gray-500">
                      {subject.sessions} séances
                    </span>

                    <button
                      onClick={() =>
                        navigate(
                          `/resultats-scolaires?learner=${selectedChild}`
                        )
                      }
                      className="text-xs font-semibold text-[#6D4AFF] hover:underline"
                    >
                      Voir les résultats
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity */}
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 xl:col-span-2">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-bold text-gray-900">
                  Activité d'apprentissage
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Temps consacré et exercices réalisés.
                </p>
              </div>

              <Clock3
                size={21}
                className="text-[#6D4AFF]"
              />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500">
                  Temps total
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {totalHours.toFixed(1)}h
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500">
                  Exercices
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {totalExercises}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-500">
                  Séances / semaine
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {(
                    activity.reduce(
                      (sum, item) => sum + item.sessions,
                      0
                    ) / activity.length
                  ).toFixed(1)}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {activity.map((week) => (
                <div key={week.week}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {week.week}
                    </span>

                    <span className="text-xs text-gray-500">
                      {week.hours}h • {week.exercises} exercices
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-[#6D4AFF]"
                      style={{
                        width: `${Math.min(
                          (week.hours / 8) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attendance */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="font-bold text-gray-900">
              Assiduité
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Présence aux séances de tutorat.
            </p>

            <div className="mt-6 flex items-center justify-center">
              <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-[12px] border-green-100">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">
                    {Math.round(
                      (child.sessionsCompleted /
                        child.sessionsTotal) *
                        100
                    )}
                    %
                  </p>

                  <p className="text-xs text-gray-500">
                    présence
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Séances réalisées
                </span>

                <span className="font-semibold text-gray-900">
                  {child.sessionsCompleted}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Séances prévues
                </span>

                <span className="font-semibold text-gray-900">
                  {child.sessionsTotal}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Heures d'étude
                </span>

                <span className="font-semibold text-gray-900">
                  {child.studyHours}h
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-900">
                Achievements
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Les progrès et récompenses de {child.name}.
              </p>
            </div>

            <Award
              size={22}
              className="text-yellow-500"
            />
          </div>

          {childAchievements.length === 0 ? (
            <div className="mt-6 rounded-xl bg-gray-50 p-8 text-center">
              <Award
                size={36}
                className="mx-auto text-gray-300"
              />

              <p className="mt-3 font-medium text-gray-900">
                Aucun achievement pour le moment
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Continuez les efforts pour débloquer de nouvelles
                récompenses.
              </p>
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {childAchievements.map((achievement) => {
                const Icon = achievement.icon;

                return (
                  <div
                    key={achievement.id}
                    className="rounded-xl border border-yellow-100 bg-yellow-50/50 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-yellow-100 p-3">
                        <Icon
                          size={21}
                          className="text-yellow-600"
                        />
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {achievement.title}
                        </h3>

                        <p className="mt-1 text-sm leading-5 text-gray-600">
                          {achievement.description}
                        </p>

                        <p className="mt-3 text-xs font-medium text-gray-400">
                          {achievement.date}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom actions */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <button
            onClick={() =>
              navigate(
                `/resultats-scolaires?learner=${selectedChild}`
              )
            }
            className="rounded-2xl border border-gray-200 bg-white p-5 text-left transition hover:border-[#6D4AFF]/30 hover:shadow-sm"
          >
            <BarChart3
              size={22}
              className="text-[#6D4AFF]"
            />

            <h3 className="mt-3 font-semibold text-gray-900">
              Résultats scolaires
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Consultez les notes et classements par matière.
            </p>
          </button>

          <button
            onClick={() =>
              navigate(
                `/parent-schedule?learner=${selectedChild}`
              )
            }
            className="rounded-2xl border border-gray-200 bg-white p-5 text-left transition hover:border-[#6D4AFF]/30 hover:shadow-sm"
          >
            <CalendarDays
              size={22}
              className="text-[#6D4AFF]"
            />

            <h3 className="mt-3 font-semibold text-gray-900">
              Planning
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Consultez les prochaines séances de tutorat.
            </p>
          </button>

          <button
            onClick={() =>
              navigate("/search")
            }
            className="rounded-2xl border border-gray-200 bg-white p-5 text-left transition hover:border-[#6D4AFF]/30 hover:shadow-sm"
          >
            <UsersRound
              size={22}
              className="text-[#6D4AFF]"
            />

            <h3 className="mt-3 font-semibold text-gray-900">
              Trouver un enseignant
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Ajoutez du soutien dans une matière spécifique.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}