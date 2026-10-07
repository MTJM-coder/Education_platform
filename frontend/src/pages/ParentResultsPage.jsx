import React, { useMemo, useState } from "react";
import {
  Search,
  GraduationCap,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  CalendarDays,
  ChevronDown,
  Eye,
  BarChart3,
  Trophy,
  Target,
  X,
  CheckCircle2,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const childrenData = [
  {
    id: 1,
    name: "Doly Junior",
    level: "Secondary",
    className: "Form 4",
    school: "Government Bilingual High School",
    average: 78,
    previousAverage: 74,
  },
  {
    id: 2,
    name: "Mireille Djoumesse",
    level: "Secondary",
    className: "Form 3",
    school: "Lycée Bilingue de Douala",
    average: 81,
    previousAverage: 79,
  },
];

const resultsData = [
  {
    id: "RES-001",
    learnerId: 1,
    subject: "Mathematics",
    teacher: "Xavier Ndi",
    score: 78,
    previousScore: 72,
    coefficient: 4,
    rank: 6,
    totalStudents: 32,
    term: "Term 1",
    date: "2026-10-06",
    status: "improved",
  },
  {
    id: "RES-002",
    learnerId: 1,
    subject: "Physics",
    teacher: "Nfor Grace",
    score: 64,
    previousScore: 68,
    coefficient: 4,
    rank: 14,
    totalStudents: 32,
    term: "Term 1",
    date: "2026-10-06",
    status: "declined",
  },
  {
    id: "RES-003",
    learnerId: 1,
    subject: "English",
    teacher: "Acha Mireille",
    score: 85,
    previousScore: 81,
    coefficient: 3,
    rank: 3,
    totalStudents: 32,
    term: "Term 1",
    date: "2026-10-06",
    status: "improved",
  },
  {
    id: "RES-004",
    learnerId: 1,
    subject: "Computer Science",
    teacher: "Bih Patrick",
    score: 72,
    previousScore: 72,
    coefficient: 2,
    rank: 9,
    totalStudents: 32,
    term: "Term 1",
    date: "2026-10-06",
    status: "stable",
  },
  {
    id: "RES-005",
    learnerId: 1,
    subject: "French",
    teacher: "Ngoe Laure",
    score: 76,
    previousScore: 70,
    coefficient: 3,
    rank: 7,
    totalStudents: 32,
    term: "Term 1",
    date: "2026-10-06",
    status: "improved",
  },

  {
    id: "RES-006",
    learnerId: 2,
    subject: "Mathematics",
    teacher: "Xavier Ndi",
    score: 82,
    previousScore: 77,
    coefficient: 4,
    rank: 4,
    totalStudents: 28,
    term: "Term 1",
    date: "2026-10-06",
    status: "improved",
  },
  {
    id: "RES-007",
    learnerId: 2,
    subject: "Physics",
    teacher: "Nfor Grace",
    score: 79,
    previousScore: 75,
    coefficient: 4,
    rank: 5,
    totalStudents: 28,
    term: "Term 1",
    date: "2026-10-06",
    status: "improved",
  },
  {
    id: "RES-008",
    learnerId: 2,
    subject: "English",
    teacher: "Acha Mireille",
    score: 88,
    previousScore: 84,
    coefficient: 3,
    rank: 2,
    totalStudents: 28,
    term: "Term 1",
    date: "2026-10-06",
    status: "improved",
  },
  {
    id: "RES-009",
    learnerId: 2,
    subject: "Computer Science",
    teacher: "Bih Patrick",
    score: 75,
    previousScore: 75,
    coefficient: 2,
    rank: 8,
    totalStudents: 28,
    term: "Term 1",
    date: "2026-10-06",
    status: "stable",
  },
];

const awardsData = [
  {
    id: "AWD-001",
    learnerId: 1,
    title: "Most Progressive Student",
    period: "September 2026",
    reason:
      "Progression remarquable en Mathématiques et en Anglais.",
    reward: "School supplies",
    date: "2026-09-30",
  },
  {
    id: "AWD-002",
    learnerId: 2,
    title: "Excellent Progress",
    period: "September 2026",
    reason:
      "Amélioration constante des résultats et excellente participation.",
    reward: "School bag",
    date: "2026-09-30",
  },
];

const formatDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const getScoreStyle = (score) => {
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

const getProgressIcon = (score, previousScore) => {
  if (score > previousScore) {
    return (
      <TrendingUp
        size={16}
        className="text-green-600"
      />
    );
  }

  if (score < previousScore) {
    return (
      <TrendingDown
        size={16}
        className="text-red-500"
      />
    );
  }

  return (
    <Minus
      size={16}
      className="text-gray-400"
    />
  );
};

export default function ParentResultsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const learnerFromUrl = Number(searchParams.get("learner"));

  const [selectedChild, setSelectedChild] = useState(
    learnerFromUrl || childrenData[0].id
  );

  const [term, setTerm] = useState("Term 1");
  const [search, setSearch] = useState("");
  const [selectedResult, setSelectedResult] = useState(null);
  const [showAwards, setShowAwards] = useState(false);

  const child = childrenData.find(
    (item) => item.id === selectedChild
  );

  const childResults = useMemo(() => {
    const query = search.trim().toLowerCase();

    return resultsData.filter((result) => {
      const matchesChild =
        result.learnerId === selectedChild;

      const matchesTerm = result.term === term;

      const matchesSearch =
        !query ||
        result.subject.toLowerCase().includes(query) ||
        result.teacher.toLowerCase().includes(query);

      return (
        matchesChild &&
        matchesTerm &&
        matchesSearch
      );
    });
  }, [selectedChild, term, search]);

  const childAwards = awardsData.filter(
    (award) => award.learnerId === selectedChild
  );

  const average =
    childResults.length > 0
      ? (
          childResults.reduce(
            (sum, result) => sum + result.score,
            0
          ) / childResults.length
        ).toFixed(1)
      : "—";

  const previousAverage =
    childResults.length > 0
      ? (
          childResults.reduce(
            (sum, result) => sum + result.previousScore,
            0
          ) / childResults.length
        ).toFixed(1)
      : "—";

  const averageChange =
    average !== "—" && previousAverage !== "—"
      ? (Number(average) - Number(previousAverage)).toFixed(1)
      : 0;

  const bestSubject =
    childResults.length > 0
      ? [...childResults].sort(
          (a, b) => b.score - a.score
        )[0]
      : null;

  const needsAttention =
    childResults.length > 0
      ? [...childResults].sort(
          (a, b) => a.score - b.score
        )[0]
      : null;

  const handleChildChange = (id) => {
    setSelectedChild(Number(id));

    navigate(`/resultats-scolaires?learner=${id}`, {
      replace: true,
    });
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
              Children Results
            </span>
          </div>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Children Results
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Consultez les résultats et la progression
                scolaire de vos enfants.
              </p>
            </div>

            <button
              onClick={() =>
                navigate(
                  `/child-progress?learner=${selectedChild}`
                )
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D4AFF] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5B3FE0]"
            >
              <BarChart3 size={18} />
              Voir la progression
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 lg:p-8">
        {/* Child selector */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#6D4AFF]/10">
                <GraduationCap
                  size={27}
                  className="text-[#6D4AFF]"
                />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Résultats de
                </p>

                <h2 className="text-lg font-bold text-gray-900">
                  {child?.name}
                </h2>

                <p className="text-sm text-gray-500">
                  {child?.className} • {child?.school}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
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
                  value={term}
                  onChange={(e) =>
                    setTerm(e.target.value)
                  }
                  className="appearance-none rounded-xl border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-gray-800 outline-none focus:border-[#6D4AFF]"
                >
                  <option value="Term 1">Term 1</option>
                  <option value="Term 2">Term 2</option>
                  <option value="Term 3">Term 3</option>
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Moyenne générale
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {average}
                  {average !== "—" && (
                    <span className="ml-1 text-base font-medium text-gray-400">
                      /100
                    </span>
                  )}
                </p>
              </div>

              <div className="rounded-xl bg-[#6D4AFF]/10 p-3">
                <Target
                  size={22}
                  className="text-[#6D4AFF]"
                />
              </div>
            </div>

            {averageChange !== 0 && (
              <div className="mt-3 flex items-center gap-1 text-xs font-medium">
                {Number(averageChange) > 0 ? (
                  <TrendingUp
                    size={14}
                    className="text-green-600"
                  />
                ) : (
                  <TrendingDown
                    size={14}
                    className="text-red-500"
                  />
                )}

                <span
                  className={
                    Number(averageChange) > 0
                      ? "text-green-600"
                      : "text-red-500"
                  }
                >
                  {Number(averageChange) > 0 ? "+" : ""}
                  {averageChange} pts
                </span>

                <span className="text-gray-400">
                  vs période précédente
                </span>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Meilleure matière
                </p>

                <p className="mt-2 text-lg font-bold text-gray-900">
                  {bestSubject?.subject || "—"}
                </p>

                {bestSubject && (
                  <p className="mt-1 text-sm text-green-600">
                    {bestSubject.score}/100
                  </p>
                )}
              </div>

              <div className="rounded-xl bg-green-50 p-3">
                <Trophy
                  size={22}
                  className="text-green-600"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  À renforcer
                </p>

                <p className="mt-2 text-lg font-bold text-gray-900">
                  {needsAttention?.subject || "—"}
                </p>

                {needsAttention && (
                  <p className="mt-1 text-sm text-orange-600">
                    {needsAttention.score}/100
                  </p>
                )}
              </div>

              <div className="rounded-xl bg-orange-50 p-3">
                <Target
                  size={22}
                  className="text-orange-500"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Récompenses
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {childAwards.length}
                </p>

                <button
                  onClick={() => setShowAwards(true)}
                  className="mt-1 text-xs font-semibold text-[#6D4AFF] hover:underline"
                >
                  Voir les récompenses
                </button>
              </div>

              <div className="rounded-xl bg-yellow-50 p-3">
                <Award
                  size={22}
                  className="text-yellow-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5">
          <div className="relative max-w-xl">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Rechercher une matière ou un enseignant..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#6D4AFF] focus:ring-2 focus:ring-[#6D4AFF]/10"
            />
          </div>
        </div>

        {/* Results table */}
        <div className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Résultats par matière
              </h2>

              <p className="text-sm text-gray-500">
                {childResults.length} matière
                {childResults.length > 1 ? "s" : ""}
              </p>
            </div>

            <button
              onClick={() =>
                navigate(
                  `/parent-schedule?learner=${selectedChild}`
                )
              }
              className="hidden items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-white sm:flex"
            >
              <CalendarDays size={17} />
              Planning
            </button>
          </div>

          {childResults.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
              <BookOpen
                size={42}
                className="mx-auto text-gray-300"
              />

              <h3 className="mt-4 font-semibold text-gray-900">
                Aucun résultat
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Aucun résultat ne correspond à votre recherche.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px]">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Matière
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Enseignant
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Note
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Évolution
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Rang
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {childResults.map((result) => (
                      <tr
                        key={result.id}
                        className="transition hover:bg-gray-50"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#6D4AFF]/10">
                              <BookOpen
                                size={18}
                                className="text-[#6D4AFF]"
                              />
                            </div>

                            <div>
                              <p className="font-semibold text-gray-900">
                                {result.subject}
                              </p>

                              <p className="text-xs text-gray-400">
                                Coef. {result.coefficient}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-gray-800">
                            {result.teacher}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-lg px-3 py-1.5 text-sm font-bold ${getScoreStyle(
                              result.score
                            )}`}
                          >
                            {result.score}/100
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            {getProgressIcon(
                              result.score,
                              result.previousScore
                            )}

                            <span className="text-sm text-gray-600">
                              {result.score >
                              result.previousScore
                                ? `+${result.score - result.previousScore}`
                                : result.score <
                                  result.previousScore
                                ? result.score -
                                  result.previousScore
                                : "Stable"}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="text-sm font-medium text-gray-700">
                            {result.rank}
                            <span className="text-gray-400">
                              {" "}
                              / {result.totalStudents}
                            </span>
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() =>
                              setSelectedResult(result)
                            }
                            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#6D4AFF] hover:bg-[#6D4AFF]/5"
                          >
                            <Eye size={16} />
                            Détails
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Bottom actions */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <button
            onClick={() =>
              navigate(
                `/child-progress?learner=${selectedChild}`
              )
            }
            className="rounded-2xl border border-gray-200 bg-white p-5 text-left transition hover:border-[#6D4AFF]/30 hover:shadow-sm"
          >
            <BarChart3
              size={22}
              className="text-[#6D4AFF]"
            />

            <h3 className="mt-3 font-semibold text-gray-900">
              Voir la progression
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Suivez l'évolution des performances dans le
              temps.
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
              Planning de l'enfant
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
            <GraduationCap
              size={22}
              className="text-[#6D4AFF]"
            />

            <h3 className="mt-3 font-semibold text-gray-900">
              Trouver un enseignant
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Recherchez un enseignant pour renforcer une
              matière.
            </p>
          </button>
        </div>
      </div>

      {/* Result details modal */}
      {selectedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Détails du résultat
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {selectedResult.subject}
                </p>
              </div>

              <button
                onClick={() => setSelectedResult(null)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Note obtenue
                  </p>

                  <p className="mt-1 text-3xl font-bold text-gray-900">
                    {selectedResult.score}
                    <span className="text-base text-gray-400">
                      /100
                    </span>
                  </p>
                </div>

                <div
                  className={`rounded-xl px-4 py-2 text-sm font-semibold ${getScoreStyle(
                    selectedResult.score
                  )}`}
                >
                  {selectedResult.score >= 80
                    ? "Excellent"
                    : selectedResult.score >= 60
                    ? "Bon niveau"
                    : selectedResult.score >= 50
                    ? "À renforcer"
                    : "Insuffisant"}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-xs text-gray-400">
                    Enseignant
                  </p>

                  <p className="mt-1 font-medium text-gray-900">
                    {selectedResult.teacher}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-xs text-gray-400">
                    Coefficient
                  </p>

                  <p className="mt-1 font-medium text-gray-900">
                    {selectedResult.coefficient}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-xs text-gray-400">
                    Rang
                  </p>

                  <p className="mt-1 font-medium text-gray-900">
                    {selectedResult.rank} /{" "}
                    {selectedResult.totalStudents}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-xs text-gray-400">
                    Date
                  </p>

                  <p className="mt-1 font-medium text-gray-900">
                    {formatDate(selectedResult.date)}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Évolution
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Résultat précédent :{" "}
                      {selectedResult.previousScore}/100
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {getProgressIcon(
                      selectedResult.score,
                      selectedResult.previousScore
                    )}

                    <span className="font-semibold">
                      {selectedResult.score >
                      selectedResult.previousScore
                        ? `+${
                            selectedResult.score -
                            selectedResult.previousScore
                          } pts`
                        : selectedResult.score <
                          selectedResult.previousScore
                        ? `${
                            selectedResult.score -
                            selectedResult.previousScore
                          } pts`
                        : "Stable"}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedResult(null);
                  navigate(
                    `/child-progress?learner=${selectedChild}`
                  );
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6D4AFF] px-4 py-3 text-sm font-semibold text-white hover:bg-[#5B3FE0]"
              >
                <BarChart3 size={17} />
                Voir la progression
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Awards modal */}
      {showAwards && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Récompenses
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Récompenses obtenues par {child?.name}
                </p>
              </div>

              <button
                onClick={() => setShowAwards(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[65vh] space-y-4 overflow-y-auto p-6">
              {childAwards.length === 0 ? (
                <div className="py-8 text-center">
                  <Award
                    size={40}
                    className="mx-auto text-gray-300"
                  />

                  <p className="mt-3 font-medium text-gray-900">
                    Aucune récompense
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Les récompenses apparaîtront ici.
                  </p>
                </div>
              ) : (
                childAwards.map((award) => (
                  <div
                    key={award.id}
                    className="rounded-xl border border-yellow-100 bg-yellow-50/50 p-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="rounded-xl bg-yellow-100 p-3">
                        <Trophy
                          size={22}
                          className="text-yellow-600"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="font-bold text-gray-900">
                            {award.title}
                          </h3>

                          <span className="text-xs font-medium text-gray-500">
                            {award.period}
                          </span>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-gray-600">
                          {award.reason}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-700">
                            <Award size={13} />
                            {award.reward}
                          </span>

                          <span className="text-xs text-gray-400">
                            {formatDate(award.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-gray-200 p-5">
              <button
                onClick={() => setShowAwards(false)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}