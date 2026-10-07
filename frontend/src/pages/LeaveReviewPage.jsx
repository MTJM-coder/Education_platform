import React, { useMemo, useState } from "react";
import {
  Search,
  Star,
  MessageSquare,
  CheckCircle2,
  Clock3,
  UserRound,
  BookOpen,
  CalendarDays,
  RotateCcw,
  X,
  Send,
  Edit3,
  Eye,
  GraduationCap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const initialEvaluations = [
  {
    id: "EVAL-001",
    sessionId: "SES-006",
    learnerId: 1,
    learner: "Doly Junior",
    teacherId: 1,
    teacher: "Xavier Ndi",
    subject: "Mathematics",
    level: "Secondary",
    date: "2026-10-06",
    status: "pending",
  },
  {
    id: "EVAL-002",
    sessionId: "SES-005",
    learnerId: 2,
    learner: "Mireille Djoumesse",
    teacherId: 2,
    teacher: "Nfor Grace",
    subject: "Physics",
    level: "Secondary",
    date: "2026-10-13",
    status: "pending",
  },
  {
    id: "EVAL-003",
    sessionId: "SES-003",
    learnerId: 1,
    learner: "Doly Junior",
    teacherId: 3,
    teacher: "Acha Mireille",
    subject: "English",
    level: "Secondary",
    date: "2026-10-10",
    status: "reviewed",
    rating: 5,
    criteria: {
      teaching: 5,
      punctuality: 5,
      communication: 5,
      understanding: 4,
    },
    comment:
      "Excellent cours. Le professeur explique très bien et prend le temps de vérifier la compréhension.",
  },
];

const criteriaList = [
  {
    key: "teaching",
    label: "Teaching quality",
    description: "Qualité des explications et méthode pédagogique",
  },
  {
    key: "punctuality",
    label: "Punctuality",
    description: "Ponctualité et respect des horaires",
  },
  {
    key: "communication",
    label: "Communication",
    description: "Communication avec le parent et l'apprenant",
  },
  {
    key: "understanding",
    label: "Understanding the child",
    description: "Capacité à comprendre les besoins de l'apprenant",
  },
];

const formatDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const getStatusLabel = (status) => {
  if (status === "pending") return "À évaluer";
  return "Évalué";
};

function StarRating({
  value,
  onChange,
  size = 22,
  readOnly = false,
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star)}
          className={`transition ${
            readOnly
              ? "cursor-default"
              : "cursor-pointer hover:scale-110"
          }`}
          aria-label={`${star} étoile${star > 1 ? "s" : ""}`}
        >
          <Star
            size={size}
            className={
              star <= value
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        </button>
      ))}
    </div>
  );
}

export default function LeaveReviewPage() {
  const navigate = useNavigate();

  const [evaluations, setEvaluations] = useState(initialEvaluations);

  const [search, setSearch] = useState("");
  const [childFilter, setChildFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");

  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [modalMode, setModalMode] = useState(null);

  const [rating, setRating] = useState(0);
  const [criteria, setCriteria] = useState({
    teaching: 0,
    punctuality: 0,
    communication: 0,
    understanding: 0,
  });
  const [comment, setComment] = useState("");

  const children = useMemo(() => {
    return [...new Set(evaluations.map((item) => item.learner))];
  }, [evaluations]);

  const subjects = useMemo(() => {
    return [...new Set(evaluations.map((item) => item.subject))];
  }, [evaluations]);

  const filteredEvaluations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return evaluations.filter((item) => {
      const matchesSearch =
        !query ||
        item.learner.toLowerCase().includes(query) ||
        item.teacher.toLowerCase().includes(query) ||
        item.subject.toLowerCase().includes(query);

      const matchesChild =
        childFilter === "all" || item.learner === childFilter;

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      const matchesSubject =
        subjectFilter === "all" || item.subject === subjectFilter;

      return (
        matchesSearch &&
        matchesChild &&
        matchesStatus &&
        matchesSubject
      );
    });
  }, [
    evaluations,
    search,
    childFilter,
    statusFilter,
    subjectFilter,
  ]);

  const pendingCount = evaluations.filter(
    (item) => item.status === "pending"
  ).length;

  const reviewed = evaluations.filter(
    (item) => item.status === "reviewed"
  );

  const averageRating =
    reviewed.length > 0
      ? (
          reviewed.reduce((sum, item) => sum + item.rating, 0) /
          reviewed.length
        ).toFixed(1)
      : "—";

  const resetFilters = () => {
    setSearch("");
    setChildFilter("all");
    setStatusFilter("all");
    setSubjectFilter("all");
  };

  const openReview = (evaluation, mode = "create") => {
    setSelectedEvaluation(evaluation);
    setModalMode(mode);

    if (mode === "edit" || mode === "view") {
      setRating(evaluation.rating || 0);

      setCriteria({
        teaching: evaluation.criteria?.teaching || 0,
        punctuality: evaluation.criteria?.punctuality || 0,
        communication: evaluation.criteria?.communication || 0,
        understanding: evaluation.criteria?.understanding || 0,
      });

      setComment(evaluation.comment || "");
    } else {
      setRating(0);

      setCriteria({
        teaching: 0,
        punctuality: 0,
        communication: 0,
        understanding: 0,
      });

      setComment("");
    }
  };

  const closeModal = () => {
    setSelectedEvaluation(null);
    setModalMode(null);
    setRating(0);
    setComment("");

    setCriteria({
      teaching: 0,
      punctuality: 0,
      communication: 0,
      understanding: 0,
    });
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();

    if (!selectedEvaluation) return;

    if (rating === 0) {
      alert("Veuillez donner une note générale.");
      return;
    }

    const updatedEvaluation = {
      ...selectedEvaluation,
      status: "reviewed",
      rating,
      criteria,
      comment,
    };

    setEvaluations((current) =>
      current.map((item) =>
        item.id === selectedEvaluation.id
          ? updatedEvaluation
          : item
      )
    );

    closeModal();
  };

  return (
    <div className="min-h-screen bg-[#F8F8FA]">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-6 py-5 lg:px-8">
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <button
              onClick={() => navigate("/parent-dashboard")}
              className="hover:text-[#6D4AFF]"
            >
              Dashboard
            </button>

            <span>/</span>

            <span className="font-medium text-gray-900">
              Evaluations
            </span>
          </div>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Evaluations
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Évaluez les enseignants après les séances de
                tutorat.
              </p>
            </div>

            <button
              onClick={() => navigate("/parent-schedule")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D4AFF] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5B3FE0]"
            >
              <CalendarDays size={18} />
              Voir le planning
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 lg:p-8">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Évaluations à faire
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {pendingCount}
                </p>
              </div>

              <div className="rounded-xl bg-orange-50 p-3">
                <Clock3 className="text-orange-500" size={23} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Avis envoyés
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {reviewed.length}
                </p>
              </div>

              <div className="rounded-xl bg-green-50 p-3">
                <CheckCircle2
                  className="text-green-600"
                  size={23}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Note moyenne donnée
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <p className="text-3xl font-bold text-gray-900">
                    {averageRating}
                  </p>

                  {averageRating !== "—" && (
                    <Star
                      size={22}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  )}
                </div>
              </div>

              <div className="rounded-xl bg-yellow-50 p-3">
                <Star
                  className="fill-yellow-400 text-yellow-500"
                  size={23}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un enseignant, enfant ou matière..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#6D4AFF] focus:ring-2 focus:ring-[#6D4AFF]/10"
              />
            </div>

            <select
              value={childFilter}
              onChange={(e) => setChildFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6D4AFF]"
            >
              <option value="all">Tous les enfants</option>

              {children.map((child) => (
                <option key={child} value={child}>
                  {child}
                </option>
              ))}
            </select>

            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6D4AFF]"
            >
              <option value="all">Toutes les matières</option>

              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#6D4AFF]"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">À évaluer</option>
              <option value="reviewed">Évalué</option>
            </select>

            <button
              onClick={resetFilters}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            >
              <RotateCcw size={17} />
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Evaluation list */}
        <div className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Séances à évaluer
              </h2>

              <p className="text-sm text-gray-500">
                {filteredEvaluations.length} résultat
                {filteredEvaluations.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {filteredEvaluations.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
              <MessageSquare
                size={42}
                className="mx-auto text-gray-300"
              />

              <h3 className="mt-4 font-semibold text-gray-900">
                Aucune évaluation trouvée
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Essayez de modifier vos filtres.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {filteredEvaluations.map((evaluation) => (
                <div
                  key={evaluation.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#6D4AFF]/10">
                        <UserRound
                          size={21}
                          className="text-[#6D4AFF]"
                        />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-gray-900">
                          {evaluation.teacher}
                        </h3>

                        <p className="text-sm text-gray-500">
                          {evaluation.subject} •{" "}
                          {evaluation.level}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                        evaluation.status === "pending"
                          ? "bg-orange-50 text-orange-600"
                          : "bg-green-50 text-green-600"
                      }`}
                    >
                      {getStatusLabel(evaluation.status)}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-gray-50 p-4">
                    <div>
                      <p className="text-xs text-gray-400">
                        Apprenant
                      </p>

                      <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-gray-800">
                        <GraduationCap size={15} />
                        {evaluation.learner}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        Date
                      </p>

                      <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-gray-800">
                        <CalendarDays size={15} />
                        {formatDate(evaluation.date)}
                      </p>
                    </div>
                  </div>

                  {evaluation.status === "reviewed" && (
                    <div className="mt-4 rounded-xl border border-yellow-100 bg-yellow-50/50 p-4">
                      <div className="flex items-center gap-2">
                        <StarRating
                          value={evaluation.rating}
                          readOnly
                          size={18}
                        />

                        <span className="text-sm font-semibold text-gray-700">
                          {evaluation.rating}/5
                        </span>
                      </div>

                      {evaluation.comment && (
                        <p className="mt-3 text-sm leading-6 text-gray-600">
                          “{evaluation.comment}”
                        </p>
                      )}
                    </div>
                  )}

                  <div className="mt-5 flex flex-wrap gap-2">
                    <button
                      onClick={() =>
                        navigate(
                          `/teacher-profile/${evaluation.teacherId}`
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <UserRound size={16} />
                      Voir le profil
                    </button>

                    {evaluation.status === "pending" ? (
                      <button
                        onClick={() =>
                          openReview(evaluation, "create")
                        }
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#6D4AFF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5B3FE0]"
                      >
                        <Star size={16} />
                        Laisser un avis
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          openReview(evaluation, "edit")
                        }
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                      >
                        <Edit3 size={16} />
                        Modifier mon avis
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submitted reviews */}
        {reviewed.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 text-lg font-bold text-gray-900">
              Mes avis
            </h2>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px]">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Enseignant
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Matière
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Enfant
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Note
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Commentaire
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {reviewed.map((review) => (
                      <tr
                        key={review.id}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-5 py-4">
                          <p className="font-medium text-gray-900">
                            {review.teacher}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {review.subject}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {review.learner}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1">
                            <Star
                              size={16}
                              className="fill-yellow-400 text-yellow-400"
                            />

                            <span className="font-semibold text-gray-800">
                              {review.rating}
                            </span>
                          </div>
                        </td>

                        <td className="max-w-[280px] px-5 py-4">
                          <p className="truncate text-sm text-gray-600">
                            {review.comment || "—"}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() =>
                              openReview(review, "edit")
                            }
                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-[#6D4AFF] hover:bg-[#6D4AFF]/5"
                          >
                            <Edit3 size={15} />
                            Modifier
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Review modal */}
      {selectedEvaluation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Modal header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {modalMode === "create"
                    ? "Évaluer la séance"
                    : "Modifier mon avis"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {selectedEvaluation.teacher} •{" "}
                  {selectedEvaluation.subject}
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmitReview}
              className="space-y-6 p-6"
            >
              {/* Session information */}
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-gray-400">
                      Apprenant
                    </p>

                    <p className="mt-1 font-medium text-gray-900">
                      {selectedEvaluation.learner}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Matière
                    </p>

                    <p className="mt-1 font-medium text-gray-900">
                      {selectedEvaluation.subject}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Séance
                    </p>

                    <p className="mt-1 font-medium text-gray-900">
                      {formatDate(selectedEvaluation.date)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Overall rating */}
              <div>
                <label className="block text-sm font-semibold text-gray-900">
                  Note générale
                </label>

                <div className="mt-3 flex items-center gap-3">
                  <StarRating
                    value={rating}
                    onChange={setRating}
                    size={32}
                    readOnly={modalMode === "view"}
                  />

                  <span className="text-sm font-medium text-gray-500">
                    {rating > 0
                      ? `${rating}/5`
                      : "Sélectionnez une note"}
                  </span>
                </div>
              </div>

              {/* Criteria */}
              <div>
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Critères d'évaluation
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Donnez une note sur chaque aspect de la
                    prestation.
                  </p>
                </div>

                <div className="space-y-3">
                  {criteriaList.map((criterion) => (
                    <div
                      key={criterion.key}
                      className="rounded-xl border border-gray-200 p-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {criterion.label}
                          </p>

                          <p className="mt-0.5 text-xs text-gray-500">
                            {criterion.description}
                          </p>
                        </div>

                        <StarRating
                          value={criteria[criterion.key]}
                          onChange={(value) =>
                            setCriteria((current) => ({
                              ...current,
                              [criterion.key]: value,
                            }))
                          }
                          size={21}
                          readOnly={modalMode === "view"}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Commentaire
                </label>

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  disabled={modalMode === "view"}
                  rows={5}
                  maxLength={1000}
                  placeholder="Partagez votre expérience avec cet enseignant..."
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-[#6D4AFF] focus:ring-2 focus:ring-[#6D4AFF]/10 disabled:cursor-not-allowed disabled:opacity-70"
                />

                <p className="mt-1 text-right text-xs text-gray-400">
                  {comment.length}/1000
                </p>
              </div>

              {/* Footer */}
              <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Fermer
                </button>

                {modalMode !== "view" && (
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D4AFF] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#5B3FE0]"
                  >
                    <Send size={16} />

                    {modalMode === "create"
                      ? "Publier mon avis"
                      : "Enregistrer les modifications"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}