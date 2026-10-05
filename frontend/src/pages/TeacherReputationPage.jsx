import { useEffect, useMemo, useState } from "react";
import { Award, MessageSquare, Star, UsersRound } from "lucide-react";
import TeacherSidebar from "../components/teacher/TeacherSidebar";
import { apiFetch } from "../lib/apiClient";

/* ========================================================= */
/* HELPERS                                                     */
/* ========================================================= */

// Accepte [..], { data: [..] } ou { data: { data: [..] } } selon apiFetch.
function toList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  return [];
}

// Accepte { ... }, { data: { ... } } ou { data: { data: { ... } } }.
function toObject(response) {
  return response?.data?.data ?? response?.data ?? response ?? null;
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// "senior_teacher" -> "Senior Teacher". Les valeurs exactes de `rank` viennent de la base.
function formatRank(rank) {
  if (!rank) return "—";
  return String(rank)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

// Avis anonymisés : seul le type de l'auteur est montré (Learner.type = self | child).
function reviewerLabel(review) {
  const type = review.assignment?.tutoring_request?.learner?.type;
  if (type === "child") return "Parent";
  if (type === "self") return "Student";
  return "Parent or student";
}

/* ========================================================= */
/* PAGE                                                        */
/* ========================================================= */

export default function TeacherReputationPage() {
  const [reputation, setReputation] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        // Profil enseignant (stars, rank, …) via /auth/me, avis via /me/reviews.
        const [meRes, reviewsRes] = await Promise.all([
          apiFetch("/auth/me"),
          apiFetch("/me/reviews"),
        ]);

        const profile = toObject(meRes);
        const list = toList(reviewsRes);
        const ratings = list
          .map((review) => Number(review.rating))
          .filter(Number.isFinite);

        if (cancelled) return;

        // Les stars et le rang sont calculés par le serveur : la page les affiche
        // tels quels. Moyenne et répartition se déduisent des avis reçus.
        setReputation({
          stars: profile?.stars,
          rank: profile?.rank,
          rank_points: profile?.rank_points,
          eligible_for_promotion: profile?.eligible_for_promotion,
          reviews_count: ratings.length,
          average_rating: ratings.length
            ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
            : null,
          distribution: Object.fromEntries(
            [1, 2, 3, 4, 5].map((n) => [
              n,
              ratings.filter((rating) => rating === n).length,
            ])
          ),
        });
        setReviews(list);
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Unable to load your reputation.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const count = Number(reputation?.reviews_count || 0);
  const average =
    reputation?.average_rating !== null &&
    reputation?.average_rating !== undefined
      ? Number(reputation.average_rating)
      : null;

  const distribution = useMemo(
    () =>
      [5, 4, 3, 2, 1].map((rating) => {
        const total = Number(reputation?.distribution?.[rating] || 0);
        return {
          rating,
          total,
          percent: count ? Math.round((total / count) * 100) : 0,
        };
      }),
    [reputation, count]
  );

  return (
    <div className="min-h-screen bg-[#FAFAFC]">
      <TeacherSidebar activeItem="My Reputation" />

      <main className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-100 bg-white/95 px-6 backdrop-blur lg:px-8">
          <div className="ml-12 lg:ml-0">
            <p className="text-xs text-gray-400">Teacher Portal</p>

            <h1 className="text-lg font-semibold text-pf-purple-dark">
              My Reputation
            </h1>
          </div>
        </header>

        <div className="p-6 lg:p-8">
          {/* Intro */}
          <section className="mb-7">
            <p className="max-w-2xl text-sm text-gray-500">
              Track your stars, your rank and the reviews left by parents and
              students.
            </p>
          </section>

          {error && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600"
            >
              {error}
            </div>
          )}

          {loading && (
            <p className="py-16 text-center text-sm text-gray-400">
              Loading your reputation…
            </p>
          )}

          {!loading && reputation && (
            <>
              {/* Overview */}
              <section className="grid gap-5 lg:grid-cols-3">
                {/* Stars and rank */}
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
                  <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Current Reputation
                      </p>

                      <div className="mt-3 flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-pf-purple-light">
                          <Star className="h-8 w-8 fill-pf-purple text-pf-purple" />
                        </div>

                        <div>
                          <p className="text-3xl font-bold text-pf-purple-dark">
                            {Number(reputation.stars || 0)}
                          </p>

                          <p className="text-sm text-gray-400">Stars</p>
                        </div>
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-xs uppercase tracking-wide text-gray-400">
                        Current Rank
                      </p>

                      <p className="mt-2 flex items-center gap-2 text-xl font-semibold text-pf-purple sm:justify-end">
                        <Award className="h-5 w-5" />
                        {formatRank(reputation.rank)}
                      </p>
                    </div>
                  </div>

                  {reputation.eligible_for_promotion && (
                    <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
                      <p className="text-xs leading-5 text-blue-700">
                        You are eligible for a promotion. It becomes effective
                        once it is validated by the administration.
                      </p>
                    </div>
                  )}
                </div>

                {/* Rating */}
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Average Rating
                  </p>

                  {count === 0 ? (
                    <p className="mt-4 text-sm text-gray-400">
                      No review yet. Parents and students can rate you after a
                      completed lesson.
                    </p>
                  ) : (
                    <>
                      <div className="mt-4 flex items-center gap-3">
                        <span className="text-4xl font-bold text-pf-purple-dark">
                          {average !== null ? average.toFixed(1) : "—"}
                        </span>

                        <div>
                          <StarRow value={average ?? 0} />

                          <p className="mt-1 text-xs text-gray-400">
                            {count} review{count !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 space-y-3">
                        {distribution.map((item) => (
                          <RatingBar
                            key={item.rating}
                            label={`${item.rating} star${item.rating > 1 ? "s" : ""}`}
                            value={item.percent}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </section>

              {/* Reviews */}
              <section className="mt-6 rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                  <div>
                    <h3 className="font-semibold text-pf-purple-dark">
                      Reviews
                    </h3>

                    <p className="mt-1 text-xs text-gray-400">
                      Feedback from parents and students
                    </p>
                  </div>

                  <MessageSquare className="h-5 w-5 text-gray-300" />
                </div>

                {reviews.length === 0 ? (
                  <p className="px-6 py-12 text-center text-sm text-gray-400">
                    You have not received any review yet.
                  </p>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

/* ========================================================= */
/* SMALL COMPONENTS                                            */
/* ========================================================= */

function StarRow({ value, size = "h-4 w-4" }) {
  const rounded = Math.round(value);

  return (
    <div className="flex" aria-label={`${value.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size} ${
            star <= rounded
              ? "fill-pf-purple text-pf-purple"
              : "text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

function RatingBar({ label, value }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-14 text-xs text-gray-400">{label}</span>

      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-pf-purple"
          style={{ width: `${value}%` }}
        />
      </div>

      <span className="w-10 text-right text-xs text-gray-400">{value}%</span>
    </div>
  );
}

function ReviewCard({ review }) {
  const subject = review.assignment?.tutoring_request?.subject?.name;

  return (
    <div className="px-6 py-5">
      <div className="flex gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pf-purple-light text-pf-purple">
          <UsersRound className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-medium text-pf-purple-dark">
                {reviewerLabel(review)}
              </p>

              {subject && (
                <p className="mt-0.5 text-xs text-gray-400">{subject}</p>
              )}
            </div>

            <p className="text-xs text-gray-400">
              {formatDate(review.created_at)}
            </p>
          </div>

          <div className="mt-2">
            <StarRow value={Number(review.rating) || 0} size="h-3.5 w-3.5" />
          </div>

          {review.comment && (
            <p className="mt-3 text-sm leading-6 text-gray-500">
              {review.comment}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}