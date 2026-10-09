import { useCallback, useEffect, useMemo, useState } from "react";
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
  Send,
  ChevronRight,
  ThumbsUp,
  UsersRound,
  Menu,
  Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import ParentSidebar from "../components/parent/ParentSidebar";
import { apiFetch } from "../lib/apiClient";

/* =========================================================
   HELPERS
========================================================= */

// Accepte [..], { data: [..] } ou { data: { data: [..] } } selon apiFetch.
function toList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  return [];
}

function getUserName(user) {
  if (!user) return null;
  if (user.name) return user.name;
  const full = [user.first_name, user.last_name].filter(Boolean).join(" ");
  return full || null;
}

function getLearnerName(learner) {
  if (!learner) return "Student";
  const own = [learner.first_name, learner.last_name].filter(Boolean).join(" ");
  if (own) return own;
  return getUserName(learner.user) ?? "Student";
}

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(String(value).length === 10 ? `${value}T00:00:00` : value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-US", {
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

const COMMENT_LIMIT = 500;

const StarRating = ({ value = 0, onChange, size = 22, readonly = false }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          onClick={() => !readonly && onChange?.(star)}
          className={`transition-transform ${
            readonly ? "cursor-default" : "hover:scale-110 cursor-pointer"
          }`}
        >
          <Star
            size={size}
            className={
              star <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }
          />
        </button>
      ))}
    </div>
  );
};

/* =========================================================
   PAGE
========================================================= */

export default function LeaveReviewPage() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [childFilter, setChildFilter] = useState("All children");
  const [subjectFilter, setSubjectFilter] = useState("All subjects");
  const [statusFilter, setStatusFilter] = useState("All statuses");

  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const loadAll = useCallback(async () => {
    const [requestsRes, sessionsRes, reviewsRes, childrenRes] = await Promise.all([
      apiFetch("/me/tutoring-requests"),
      apiFetch("/me/sessions"),
      apiFetch("/me/reviews"),
      apiFetch("/me/children"),
    ]);

    setRequests(toList(requestsRes));
    setSessions(toList(sessionsRes));
    setReviews(toList(reviewsRes));
    setChildren(toList(childrenRes));
  }, []);

  useEffect(() => {
    loadAll()
      .catch((err) => setError(err?.message || "Unable to load your reviews."))
      .finally(() => setLoading(false));
  }, [loadAll]);

  /* ---------------------------------------------------------
     Une évaluation = une AFFECTATION (un avis par affectation).
     Elle devient notable après au moins une séance terminée.
  --------------------------------------------------------- */

  const evaluations = useMemo(() => {
    // Informations d'affichage de chaque affectation (matière, enseignant, enfant).
    const info = new Map();
    requests.forEach((request) => {
      (request.assignments ?? []).forEach((assignment) => {
        info.set(assignment.id, {
          teacher: getUserName(assignment.teacher?.user) ?? "Teacher",
          child: getLearnerName(request.learner),
          subject: request.subject?.name ?? "—",
        });
      });
    });

    // Dernière séance terminée de chaque affectation.
    const lastCompleted = new Map();
    sessions
      .filter((session) => session.status === "completed")
      .forEach((session) => {
        const date = String(session.session_date ?? "").slice(0, 10);
        const current = lastCompleted.get(session.assignment_id);
        if (!current || date > current) lastCompleted.set(session.assignment_id, date);
      });

    const reviewByAssignment = new Map(
      reviews.map((review) => [review.assignment_id, review])
    );

    const ids = new Set([...lastCompleted.keys(), ...reviewByAssignment.keys()]);

    return Array.from(ids)
      .filter((id) => info.has(id))
      .map((id) => {
        const review = reviewByAssignment.get(id);

        return {
          id,
          ...info.get(id),
          status: review ? "reviewed" : "pending",
          rating: review ? Number(review.rating) : 0,
          comment: review?.comment ?? "",
          sessionDate: lastCompleted.get(id) ?? null,
          reviewedAt: review?.created_at ?? null,
        };
      })
      .sort((a, b) => {
        if (a.status !== b.status) return a.status === "pending" ? -1 : 1;
        return String(b.sessionDate ?? "").localeCompare(String(a.sessionDate ?? ""));
      });
  }, [requests, sessions, reviews]);

  const childOptions = useMemo(
    () => ["All children", ...children.map((child) => getLearnerName(child))],
    [children]
  );

  const subjectOptions = useMemo(
    () => [
      "All subjects",
      ...Array.from(new Set(evaluations.map((item) => item.subject))).sort(),
    ],
    [evaluations]
  );

  const filteredEvaluations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return evaluations.filter((evaluation) => {
      const matchesSearch =
        !query ||
        evaluation.child.toLowerCase().includes(query) ||
        evaluation.teacher.toLowerCase().includes(query) ||
        evaluation.subject.toLowerCase().includes(query);

      const matchesChild = childFilter === "All children" || evaluation.child === childFilter;
      const matchesSubject =
        subjectFilter === "All subjects" || evaluation.subject === subjectFilter;
      const matchesStatus =
        statusFilter === "All statuses" ||
        (statusFilter === "Pending" && evaluation.status === "pending") ||
        (statusFilter === "Reviewed" && evaluation.status === "reviewed");

      return matchesSearch && matchesChild && matchesSubject && matchesStatus;
    });
  }, [evaluations, search, childFilter, subjectFilter, statusFilter]);

  const stats = useMemo(() => {
    const reviewed = evaluations.filter((item) => item.status === "reviewed");

    return {
      pending: evaluations.filter((item) => item.status === "pending").length,
      reviewed: reviewed.length,
    };
  }, [evaluations]);

  const selectedEvaluation =
    evaluations.find((item) => item.id === selectedAssignmentId) ?? null;

  const resetFilters = () => {
    setSearch("");
    setChildFilter("All children");
    setSubjectFilter("All subjects");
    setStatusFilter("All statuses");
  };

  const openReviewModal = (evaluation) => {
    setSelectedAssignmentId(evaluation.id);
    setRating(0);
    setComment("");
    setFormError("");
  };

  const closeReviewModal = () => {
    if (submitting) return;
    setSelectedAssignmentId(null);
  };

  const submitReview = async () => {
    if (!selectedEvaluation) return;

    setFormError("");

    if (rating === 0) {
      setFormError("Please select an overall rating.");
      return;
    }

    setSubmitting(true);

    try {
      // Un seul avis par affectation, non modifiable ensuite (règle du serveur).
      await apiFetch(`/assignments/${selectedEvaluation.id}/review`, {
        method: "PUT",
        body: JSON.stringify({
          rating,
          comment: comment.trim() || undefined,
        }),
      });

      await loadAll();
      setSelectedAssignmentId(null);
    } catch (err) {
      setFormError(err?.message || "Unable to submit your review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8FA]">
      <ParentSidebar />

      <div className="lg:ml-64">
        {/* HEADER */}
        <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 backdrop-blur">
          <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              {/* Bouton mobile : ParentSidebar gère son propre menu s'il est configuré. */}
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 lg:hidden"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("open-parent-sidebar"));
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
              <ChevronRight size={17} className="rotate-180" />
              Dashboard
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {error && (
              <div
                role="alert"
                className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600"
              >
                {error}
              </div>
            )}

            {/* HERO */}
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
                    <p className="text-xs text-white/70">Pending reviews</p>
                    <p className="mt-1 text-2xl font-bold">
                      {loading ? "—" : stats.pending}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4">
                    <p className="text-xs text-white/70">Reviews submitted</p>
                    <p className="mt-1 text-2xl font-bold">
                      {loading ? "—" : stats.reviewed}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* FILTERS */}
            <section className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <Filter size={18} className="text-[#6D4AFF]" />
                  <h3 className="font-semibold text-gray-900">Find an evaluation</h3>
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

                <select
                  value={childFilter}
                  onChange={(e) => setChildFilter(e.target.value)}
                  aria-label="Child"
                  className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#6D4AFF]"
                >
                  {childOptions.map((child) => (
                    <option key={child} value={child}>
                      {child}
                    </option>
                  ))}
                </select>

                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  aria-label="Subject"
                  className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#6D4AFF]"
                >
                  {subjectOptions.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  aria-label="Status"
                  className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#6D4AFF]"
                >
                  {["All statuses", "Pending", "Reviewed"].map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            {/* RESULTS */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Evaluations</h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {filteredEvaluations.length} evaluation
                    {filteredEvaluations.length !== 1 ? "s" : ""} found
                  </p>
                </div>
              </div>

              {loading ? (
                <p className="py-16 text-center text-sm text-gray-400">
                  Loading your evaluations…
                </p>
              ) : filteredEvaluations.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                    <MessageSquare size={25} />
                  </div>

                  <h3 className="mt-4 font-semibold text-gray-900">
                    {evaluations.length === 0
                      ? "Nothing to review yet"
                      : "No evaluations found"}
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                    {evaluations.length === 0
                      ? "You can review a teacher after the first completed lesson with them."
                      : "Try changing your search or filters to find another evaluation."}
                  </p>

                  {evaluations.length > 0 && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#6D4AFF] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#5d3bea]"
                    >
                      <RotateCcw size={16} />
                      Reset filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEvaluations.map((evaluation) => {
                    const status = getStatusStyles(evaluation.status);
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

                                {evaluation.sessionDate && (
                                  <span className="inline-flex items-center gap-1.5">
                                    <CalendarDays size={15} />
                                    Last lesson: {formatDate(evaluation.sessionDate)}
                                  </span>
                                )}
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
                                <StarRating value={evaluation.rating} readonly size={19} />

                                <span className="font-bold text-gray-900">
                                  {evaluation.rating}/5
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400">Not rated yet</span>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2">
                            {evaluation.status === "reviewed" ? (
                              <span className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-500">
                                <Lock size={15} />
                                Submitted {formatDate(evaluation.reviewedAt)}
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => openReviewModal(evaluation)}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D4AFF] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5d3bea]"
                              >
                                <Star size={16} />
                                Leave review
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Existing comment */}
                        {evaluation.status === "reviewed" && evaluation.comment && (
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

            {/* INFO SECTION */}
            <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-[#6D4AFF]">
                  <Star size={19} />
                </div>

                <h3 className="mt-4 font-semibold text-gray-900">Rate fairly</h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Your rating should reflect your child's actual learning
                  experience with the teacher.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <MessageSquare size={19} />
                </div>

                <h3 className="mt-4 font-semibold text-gray-900">Give useful feedback</h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Mention what works well and what could be improved to help
                  the teacher progress.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <ThumbsUp size={19} />
                </div>

                <h3 className="mt-4 font-semibold text-gray-900">Help the platform</h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Parent feedback contributes to teacher quality monitoring and
                  continuous improvement.
                </p>
              </div>
            </section>

            {/* QUICK ACTIONS */}
            <section className="mt-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
              <h3 className="font-bold text-gray-900">Quick actions</h3>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <button
                  type="button"
                  onClick={() => navigate("/parent-schedule")}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 text-left transition hover:border-purple-200 hover:bg-purple-50"
                >
                  <CalendarDays size={20} className="text-[#6D4AFF]" />

                  <div>
                    <p className="text-sm font-semibold text-gray-900">View schedule</p>
                    <p className="text-xs text-gray-500">See completed sessions</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/search")}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 text-left transition hover:border-purple-200 hover:bg-purple-50"
                >
                  <UsersRound size={20} className="text-[#6D4AFF]" />

                  <div>
                    <p className="text-sm font-semibold text-gray-900">Find a teacher</p>
                    <p className="text-xs text-gray-500">Discover teachers</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/suivi-demande")}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 text-left transition hover:border-purple-200 hover:bg-purple-50"
                >
                  <MessageSquare size={20} className="text-[#6D4AFF]" />

                  <div>
                    <p className="text-sm font-semibold text-gray-900">Tutoring requests</p>
                    <p className="text-xs text-gray-500">Track your requests</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/resultats-scolaires")}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 text-left transition hover:border-purple-200 hover:bg-purple-50"
                >
                  <Award size={20} className="text-[#6D4AFF]" />

                  <div>
                    <p className="text-sm font-semibold text-gray-900">Children results</p>
                    <p className="text-xs text-gray-500">Check academic results</p>
                  </div>
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* REVIEW MODAL */}
      {selectedEvaluation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Leave a review</h2>

                <p className="mt-1 text-sm text-gray-500">
                  {selectedEvaluation.teacher} · {selectedEvaluation.subject}
                </p>
              </div>

              <button
                type="button"
                onClick={closeReviewModal}
                aria-label="Close"
                className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 sm:p-6">
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
                      {selectedEvaluation.child} · {selectedEvaluation.subject}
                    </p>
                  </div>
                </div>

                {selectedEvaluation.sessionDate && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                    <CalendarDays size={14} />
                    Last lesson: {formatDate(selectedEvaluation.sessionDate)}
                  </div>
                )}
              </div>

              {/* Overall rating */}
              <div className="mt-6 text-center">
                <h3 className="font-bold text-gray-900">Overall rating</h3>

                <p className="mt-1 text-sm text-gray-500">
                  How would you rate your overall experience?
                </p>

                <div className="mt-4 flex justify-center">
                  <StarRating value={rating} onChange={setRating} size={34} />
                </div>

                <p className="mt-2 text-sm font-semibold text-gray-700">
                  {rating === 0 ? "Select a rating" : `${rating} out of 5`}
                </p>
              </div>

              {/* Comment */}
              <div className="mt-7">
                <div className="flex items-center justify-between">
                  <label htmlFor="review-comment" className="font-bold text-gray-900">
                    Your comment{" "}
                    <span className="text-sm font-normal text-gray-400">(optional)</span>
                  </label>

                  <span className="text-xs text-gray-400">
                    {comment.length}/{COMMENT_LIMIT}
                  </span>
                </div>

                <textarea
                  id="review-comment"
                  value={comment}
                  onChange={(e) => {
                    if (e.target.value.length <= COMMENT_LIMIT) setComment(e.target.value);
                  }}
                  rows={5}
                  placeholder="Share your experience with this teacher..."
                  className="mt-3 w-full resize-none rounded-2xl border border-gray-200 p-4 text-sm leading-6 outline-none transition focus:border-[#6D4AFF] focus:ring-2 focus:ring-[#6D4AFF]/10"
                />
              </div>

              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex gap-3">
                  <Lock size={18} className="mt-0.5 shrink-0 text-amber-600" />

                  <p className="text-sm leading-6 text-amber-900">
                    You can leave one review per teacher assignment. It cannot
                    be edited after you submit it.
                  </p>
                </div>
              </div>

              <div className="mt-3 rounded-xl border border-purple-100 bg-purple-50 p-4">
                <div className="flex gap-3">
                  <MessageSquare size={18} className="mt-0.5 shrink-0 text-[#6D4AFF]" />

                  <p className="text-sm leading-6 text-purple-900">
                    Your review is shown to the teacher anonymously, and may be
                    used by the platform to monitor teacher quality.
                  </p>
                </div>
              </div>

              {formError && (
                <p role="alert" className="mt-4 text-sm text-red-600">
                  {formError}
                </p>
              )}
            </div>

            <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-gray-100 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={closeReviewModal}
                disabled={submitting}
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={submitReview}
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D4AFF] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#5d3bea] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={16} />
                {submitting ? "Submitting…" : "Submit review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}