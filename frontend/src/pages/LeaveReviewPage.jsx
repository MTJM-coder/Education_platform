import React, { useMemo, useState } from "react";
import {
  Search,
  Star,
  MessageSquare,
  CheckCircle2,
  Clock3,
  X,
  UserRound,
  CalendarDays,
  BookOpen,
  Award,
  Filter,
  RotateCcw,
  Eye,
  Edit3,
  Send,
  ChevronRight,
  ThumbsUp,
  UsersRound,
  Menu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import ParentSidebar from "../components/parent/ParentSidebar";

const initialEvaluations = [
  {
    id: "EVAL-001",
    child: "Doly Junior",
    childId: 1,
    teacher: "Xavier Ndi",
    teacherId: 1,
    subject: "Mathematics",
    level: "Secondary",
    sessionDate: "2026-10-06",
    status: "pending",
    rating: 0,
    criteria: {
      teaching: 0,
      communication: 0,
      punctuality: 0,
      professionalism: 0,
    },
    comment: "",
  },
  {
    id: "EVAL-002",
    child: "Mireille Djoumesse",
    childId: 2,
    teacher: "Nfor Grace",
    teacherId: 2,
    subject: "Physics",
    level: "Secondary",
    sessionDate: "2026-10-13",
    status: "pending",
    rating: 0,
    criteria: {
      teaching: 0,
      communication: 0,
      punctuality: 0,
      professionalism: 0,
    },
    comment: "",
  },
  {
    id: "EVAL-003",
    child: "Doly Junior",
    childId: 1,
    teacher: "Acha Mireille",
    teacherId: 3,
    subject: "English",
    level: "Secondary",
    sessionDate: "2026-10-10",
    status: "reviewed",
    rating: 5,
    criteria: {
      teaching: 5,
      communication: 5,
      punctuality: 4,
      professionalism: 5,
    },
    comment:
      "Très bonne enseignante. Les explications sont claires et mon enfant progresse bien.",
  },
];

const children = ["All children", "Doly Junior", "Mireille Djoumesse"];

const subjects = [
  "All subjects",
  "Mathematics",
  "Physics",
  "English",
  "French",
  "Computer Science",
];

const statuses = ["All statuses", "Pending", "Reviewed"];

const criteriaLabels = {
  teaching: "Teaching quality",
  communication: "Communication",
  punctuality: "Punctuality",
  professionalism: "Professionalism",
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusStyles = (status) => {
  if (status === "reviewed") {
    return {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
      label: "Reviewed",
      icon: CheckCircle2,
    };
  }

  return {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    label: "Pending review",
    icon: Clock3,
  };
};

const StarRating = ({
  value = 0,
  onChange,
  size = 22,
  readonly = false,
}) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange?.(star)}
          className={`transition-transform ${
            readonly
              ? "cursor-default"
              : "hover:scale-110 cursor-pointer"
          }`}
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
};

const CriteriaRating = ({ label, value, onChange }) => {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
      <span className="text-sm font-medium text-gray-700">{label}</span>

      <StarRating
        value={value}
        onChange={onChange}
        size={19}
      />
    </div>
  );
};

export default function LeaveReviewPage() {
  const navigate = useNavigate();

  const [evaluations, setEvaluations] = useState(initialEvaluations);

  const [search, setSearch] = useState("");
  const [childFilter, setChildFilter] = useState("All children");
  const [subjectFilter, setSubjectFilter] = useState("All subjects");
  const [statusFilter, setStatusFilter] = useState("All statuses");

  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    criteria: {
      teaching: 0,
      communication: 0,
      punctuality: 0,
      professionalism: 0,
    },
    comment: "",
  });

  const filteredEvaluations = useMemo(() => {
    return evaluations.filter((evaluation) => {
      const query = search.trim().toLowerCase();

      const matchesSearch =
        !query ||
        evaluation.child.toLowerCase().includes(query) ||
        evaluation.teacher.toLowerCase().includes(query) ||
        evaluation.subject.toLowerCase().includes(query) ||
        evaluation.id.toLowerCase().includes(query);

      const matchesChild =
        childFilter === "All children" ||
        evaluation.child === childFilter;

      const matchesSubject =
        subjectFilter === "All subjects" ||
        evaluation.subject === subjectFilter;

      const matchesStatus =
        statusFilter === "All statuses" ||
        (statusFilter === "Pending" && evaluation.status === "pending") ||
        (statusFilter === "Reviewed" && evaluation.status === "reviewed");

      return (
        matchesSearch &&
        matchesChild &&
        matchesSubject &&
        matchesStatus
      );
    });
  }, [
    evaluations,
    search,
    childFilter,
    subjectFilter,
    statusFilter,
  ]);

  const stats = useMemo(() => {
    const pending = evaluations.filter(
      (item) => item.status === "pending"
    ).length;

    const reviewed = evaluations.filter(
      (item) => item.status === "reviewed"
    );

    const totalRatings = reviewed.reduce(
      (sum, item) => sum + item.rating,
      0
    );

    const average =
      reviewed.length > 0
        ? (totalRatings / reviewed.length).toFixed(1)
        : "0.0";

    return {
      total: evaluations.length,
      pending,
      reviewed: reviewed.length,
      average,
    };
  }, [evaluations]);

  const resetFilters = () => {
    setSearch("");
    setChildFilter("All children");
    setSubjectFilter("All subjects");
    setStatusFilter("All statuses");
  };

  const openReviewModal = (evaluation) => {
    setSelectedEvaluation(evaluation);

    setReviewForm({
      rating: evaluation.rating || 0,
      criteria: {
        teaching: evaluation.criteria?.teaching || 0,
        communication: evaluation.criteria?.communication || 0,
        punctuality: evaluation.criteria?.punctuality || 0,
        professionalism: evaluation.criteria?.professionalism || 0,
      },
      comment: evaluation.comment || "",
    });

    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedEvaluation(null);
  };

  const updateCriteria = (key, value) => {
    setReviewForm((prev) => ({
      ...prev,
      criteria: {
        ...prev.criteria,
        [key]: value,
      },
    }));
  };

  const submitReview = () => {
    if (!selectedEvaluation) return;

    if (reviewForm.rating === 0) {
      alert("Please select an overall rating.");
      return;
    }

    if (!reviewForm.comment.trim()) {
      alert("Please write a comment before submitting your review.");
      return;
    }

    setEvaluations((prev) =>
      prev.map((evaluation) =>
        evaluation.id === selectedEvaluation.id
          ? {
              ...evaluation,
              status: "reviewed",
              rating: reviewForm.rating,
              criteria: reviewForm.criteria,
              comment: reviewForm.comment.trim(),
            }
          : evaluation
      )
    );

    closeReviewModal();

    alert(
      "Your review has been submitted successfully."
    );
  };

  const reviewedCount = evaluations.filter(
    (item) => item.status === "reviewed"
  ).length;

  return (
    <div className="min-h-screen bg-[#F8F8FA]">
      {/* =========================
          SIDEBAR
      ========================== */}
      <ParentSidebar />

      {/* =========================
          MAIN CONTENT
      ========================== */}
      <div className="lg:ml-64">
        {/* =========================
            HEADER
        ========================== */}
        <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 backdrop-blur">
          <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              {/* Mobile menu button.
                  ParentSidebar can handle its own mobile behavior
                  if already configured in your project. */}
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 lg:hidden"
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent("open-parent-sidebar")
                  );
                }}
              >
                <Menu size={21} />
              </button>

              <div>
                <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  Evaluations & Reviews
                </h1>

                <p className="mt-1 hidden text-sm text-gray-500 sm:block">
                  Rate your children's teachers and share your experience
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/parent-dashboard")}
              className="hidden items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:flex"
            >
              <ChevronRight
                size={17}
                className="rotate-180"
              />
              Dashboard
            </button>
          </div>
        </header>

        {/* =========================
            PAGE CONTENT
        ========================== */}
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {/* =========================
                HERO
            ========================== */}
            <section className="mb-6 overflow-hidden rounded-3xl bg-[#6D4AFF] p-6 text-white shadow-sm sm:p-8">
              <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                <div className="max-w-2xl">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold">
                    <MessageSquare size={14} />
                    Parent feedback
                  </div>

                  <h2 className="text-2xl font-bold sm:text-3xl">
                    Help us improve your children's learning experience
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-white/80 sm:text-base">
                    Your feedback helps teachers improve their teaching,
                    communication and overall support for your children.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:min-w-[320px]">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-xs text-white/70">
                      Pending reviews
                    </p>
                    <p className="mt-1 text-2xl font-bold">
                      {stats.pending}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-xs text-white/70">
                      Reviews submitted
                    </p>
                    <p className="mt-1 text-2xl font-bold">
                      {reviewedCount}
                    </p>
                  </div>
                </div>
              </div>
            </section>

          

            {/* =========================
                FILTERS
            ========================== */}
            <section className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <Filter size={18} className="text-[#6D4AFF]" />
                  <h3 className="font-semibold text-gray-900">
                    Find an evaluation
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#6D4AFF]"
                >
                  <RotateCcw size={15} />
                  Reset filters
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                {/* Search */}
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search teacher, child..."
                    className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-[#6D4AFF] focus:ring-2 focus:ring-[#6D4AFF]/10"
                  />
                </div>

                {/* Child */}
                <select
                  value={childFilter}
                  onChange={(e) =>
                    setChildFilter(e.target.value)
                  }
                  className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#6D4AFF]"
                >
                  {children.map((child) => (
                    <option key={child} value={child}>
                      {child}
                    </option>
                  ))}
                </select>

                {/* Subject */}
                <select
                  value={subjectFilter}
                  onChange={(e) =>
                    setSubjectFilter(e.target.value)
                  }
                  className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#6D4AFF]"
                >
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>

                {/* Status */}
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
                  }
                  className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#6D4AFF]"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            {/* =========================
                RESULTS
            ========================== */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Evaluations
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {filteredEvaluations.length} evaluation
                    {filteredEvaluations.length !== 1
                      ? "s"
                      : ""}{" "}
                    found
                  </p>
                </div>
              </div>

              {filteredEvaluations.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                    <MessageSquare size={25} />
                  </div>

                  <h3 className="mt-4 font-semibold text-gray-900">
                    No evaluations found
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                    Try changing your search or filters to find
                    another evaluation.
                  </p>

                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#6D4AFF] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#5d3bea]"
                  >
                    <RotateCcw size={16} />
                    Reset filters
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEvaluations.map((evaluation) => {
                    const status = getStatusStyles(
                      evaluation.status
                    );

                    const StatusIcon = status.icon;

                    return (
                      <article
                        key={evaluation.id}
                        className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
                      >
                        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                          {/* Teacher / child */}
                          <div className="flex min-w-0 items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-50 text-[#6D4AFF]">
                              <UserRound size={23} />
                            </div>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="font-bold text-gray-900">
                                  {evaluation.teacher}
                                </h4>

                                <span
                                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${status.bg} ${status.text} ${status.border}`}
                                >
                                  <StatusIcon size={13} />
                                  {status.label}
                                </span>
                              </div>

                              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                                <span className="inline-flex items-center gap-1.5">
                                  <UsersRound size={15} />
                                  {evaluation.child}
                                </span>

                                <span className="inline-flex items-center gap-1.5">
                                  <BookOpen size={15} />
                                  {evaluation.subject}
                                </span>

                                <span className="inline-flex items-center gap-1.5">
                                  <CalendarDays size={15} />
                                  {formatDate(
                                    evaluation.sessionDate
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Rating */}
                          <div className="flex flex-col items-start gap-1 xl:items-center">
                            <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                              Rating
                            </span>

                            {evaluation.status === "reviewed" ? (
                              <div className="flex items-center gap-2">
                                <StarRating
                                  value={evaluation.rating}
                                  readonly
                                  size={19}
                                />

                                <span className="font-bold text-gray-900">
                                  {evaluation.rating}/5
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400">
                                Not rated yet
                              </span>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/teacher-profile/${evaluation.teacherId}`
                                )
                              }
                              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                            >
                              <Eye size={16} />
                              Profile
                            </button>

                            {evaluation.status ===
                            "reviewed" ? (
                              <button
                                type="button"
                                onClick={() =>
                                  openReviewModal(evaluation)
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-4 py-2.5 text-sm font-semibold text-[#6D4AFF] transition hover:bg-purple-100"
                              >
                                <Edit3 size={16} />
                                Edit review
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  openReviewModal(evaluation)
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D4AFF] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5d3bea]"
                              >
                                <Star size={16} />
                                Leave review
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Existing comment */}
                        {evaluation.status === "reviewed" &&
                          evaluation.comment && (
                            <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-4">
                              <div className="flex items-start gap-3">
                                <MessageSquare
                                  size={18}
                                  className="mt-0.5 shrink-0 text-[#6D4AFF]"
                                />

                                <div>
                                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                    Your comment
                                  </p>

                                  <p className="mt-1 text-sm leading-6 text-gray-700">
                                    {evaluation.comment}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                      </article>
                    );
                  })}
                </div>
              )}
            </section>

            {/* =========================
                INFO SECTION
            ========================== */}
            <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-[#6D4AFF]">
                  <Star size={19} />
                </div>

                <h3 className="mt-4 font-semibold text-gray-900">
                  Rate fairly
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Your rating should reflect your child's actual
                  learning experience with the teacher.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <MessageSquare size={19} />
                </div>

                <h3 className="mt-4 font-semibold text-gray-900">
                  Give useful feedback
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Mention what works well and what could be
                  improved to help the teacher progress.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <ThumbsUp size={19} />
                </div>

                <h3 className="mt-4 font-semibold text-gray-900">
                  Help the platform
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Parent feedback contributes to teacher quality
                  monitoring and continuous improvement.
                </p>
              </div>
            </section>

            {/* =========================
                QUICK ACTIONS
            ========================== */}
            <section className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <h3 className="font-bold text-gray-900">
                Quick actions
              </h3>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <button
                  type="button"
                  onClick={() =>
                    navigate("/parent-schedule")
                  }
                  className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 text-left transition hover:border-purple-200 hover:bg-purple-50"
                >
                  <CalendarDays
                    size={20}
                    className="text-[#6D4AFF]"
                  />

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      View schedule
                    </p>

                    <p className="text-xs text-gray-500">
                      See completed sessions
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/search")}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 text-left transition hover:border-purple-200 hover:bg-purple-50"
                >
                  <UsersRound
                    size={20}
                    className="text-[#6D4AFF]"
                  />

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Find a teacher
                    </p>

                    <p className="text-xs text-gray-500">
                      Discover teachers
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/suivi-demande")
                  }
                  className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 text-left transition hover:border-purple-200 hover:bg-purple-50"
                >
                  <MessageSquare
                    size={20}
                    className="text-[#6D4AFF]"
                  />

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Tutoring requests
                    </p>

                    <p className="text-xs text-gray-500">
                      Track your requests
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/resultats-scolaires")
                  }
                  className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 text-left transition hover:border-purple-200 hover:bg-purple-50"
                >
                  <Award
                    size={20}
                    className="text-[#6D4AFF]"
                  />

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Children results
                    </p>

                    <p className="text-xs text-gray-500">
                      Check academic results
                    </p>
                  </div>
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* =========================
          REVIEW MODAL
      ========================== */}
      {showReviewModal && selectedEvaluation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            {/* Modal header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {selectedEvaluation.status === "reviewed"
                    ? "Edit your review"
                    : "Leave a review"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {selectedEvaluation.teacher} ·{" "}
                  {selectedEvaluation.subject}
                </p>
              </div>

              <button
                type="button"
                onClick={closeReviewModal}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 sm:p-6">
              {/* Teacher / child */}
              <div className="rounded-2xl bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-[#6D4AFF]">
                    <UserRound size={21} />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">
                      {selectedEvaluation.teacher}
                    </p>

                    <p className="text-sm text-gray-500">
                      {selectedEvaluation.child} ·{" "}
                      {selectedEvaluation.subject}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                  <CalendarDays size={14} />
                  Session:{" "}
                  {formatDate(
                    selectedEvaluation.sessionDate
                  )}
                </div>
              </div>

              {/* Overall rating */}
              <div className="mt-6">
                <div className="text-center">
                  <h3 className="font-bold text-gray-900">
                    Overall rating
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    How would you rate your overall experience?
                  </p>

                  <div className="mt-4 flex justify-center">
                    <StarRating
                      value={reviewForm.rating}
                      onChange={(value) =>
                        setReviewForm((prev) => ({
                          ...prev,
                          rating: value,
                        }))
                      }
                      size={34}
                    />
                  </div>

                  <p className="mt-2 text-sm font-semibold text-gray-700">
                    {reviewForm.rating === 0
                      ? "Select a rating"
                      : `${reviewForm.rating} out of 5`}
                  </p>
                </div>
              </div>

              {/* Criteria */}
              <div className="mt-7">
                <h3 className="font-bold text-gray-900">
                  Rate specific areas
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Give more detailed feedback about the teacher.
                </p>

                <div className="mt-4 space-y-3">
                  {Object.entries(criteriaLabels).map(
                    ([key, label]) => (
                      <CriteriaRating
                        key={key}
                        label={label}
                        value={reviewForm.criteria[key]}
                        onChange={(value) =>
                          updateCriteria(key, value)
                        }
                      />
                    )
                  )}
                </div>
              </div>

              {/* Comment */}
              <div className="mt-7">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="review-comment"
                    className="font-bold text-gray-900"
                  >
                    Your comment
                  </label>

                  <span className="text-xs text-gray-400">
                    {reviewForm.comment.length}/500
                  </span>
                </div>

                <textarea
                  id="review-comment"
                  value={reviewForm.comment}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setReviewForm((prev) => ({
                        ...prev,
                        comment: e.target.value,
                      }));
                    }
                  }}
                  rows={5}
                  placeholder="Share your experience with this teacher..."
                  className="mt-3 w-full resize-none rounded-2xl border border-gray-200 p-4 text-sm leading-6 outline-none transition focus:border-[#6D4AFF] focus:ring-2 focus:ring-[#6D4AFF]/10"
                />
              </div>

              {/* Notice */}
              <div className="mt-5 rounded-xl border border-purple-100 bg-purple-50 p-4">
                <div className="flex gap-3">
                  <MessageSquare
                    size={18}
                    className="mt-0.5 shrink-0 text-[#6D4AFF]"
                  />

                  <p className="text-sm leading-6 text-purple-900">
                    Your feedback may be used by the platform to
                    monitor teacher quality, improve the learning
                    experience and support teacher development.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-gray-100 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={closeReviewModal}
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={submitReview}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D4AFF] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#5d3bea]"
              >
                <Send size={16} />
                {selectedEvaluation.status === "reviewed"
                  ? "Update review"
                  : "Submit review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}