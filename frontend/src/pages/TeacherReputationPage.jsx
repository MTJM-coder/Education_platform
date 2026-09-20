import {
  Award,
  BarChart3,
  ChevronRight,
  Clock3,
  Medal,
  MessageSquare,
  Star,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import TeacherSidebar from "../components/teacher/TeacherSidebar";

const reviews = [
  {
    id: 1,
    name: "Parent A",
    rating: 5,
    comment:
      "Very patient and explains difficult concepts clearly.",
    subject: "Mathematics",
    date: "Sep 18, 2026",
  },
  {
    id: 2,
    name: "Parent B",
    rating: 5,
    comment:
      "My child's understanding has improved significantly.",
    subject: "Physics",
    date: "Sep 15, 2026",
  },
  {
    id: 3,
    name: "Student C",
    rating: 4,
    comment:
      "Good teacher and always available when I need help.",
    subject: "Mathematics",
    date: "Sep 12, 2026",
  },
];

const ranks = [
  {
    name: "Teacher",
    stars: 0,
    description: "Starting rank",
  },
  {
    name: "Senior Teacher",
    stars: 3,
    description: "Consistent performance",
  },
  {
    name: "Head Teacher",
    stars: 6,
    description: "Excellent performance",
  },
  {
    name: "Admin Staff",
    stars: 10,
    description: "Promotion by Super Admin",
  },
];

export default function TeacherReputationPage() {
  const currentStars = 4;
  const currentRank = "Senior Teacher";
  const nextRank = "Head Teacher";
  const nextRankStars = 6;

  const progress =
    (currentStars / nextRankStars) * 100;

  return (
    <div className="min-h-screen bg-[#FAFAFC]">
      <TeacherSidebar activeItem="My Reputation" />

      <main className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-100 bg-white/95 px-6 backdrop-blur lg:px-8">
          <div className="ml-12 lg:ml-0">
            <p className="text-xs text-gray-400">
              Teacher Portal
            </p>

            <h1 className="text-lg font-semibold text-pf-purple-dark">
              My Reputation
            </h1>
          </div>
        </header>

        <div className="p-6 lg:p-8">
          {/* Intro */}
          <section className="mb-7">
            <h2 className="font-serif text-2xl font-semibold text-pf-purple-dark">
              My Reputation
            </h2>

            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Track your ratings, recommendations, stars and
              professional progression on the platform.
            </p>
          </section>

          {/* Reputation overview */}
          <section className="grid gap-5 lg:grid-cols-3">
            {/* Stars */}
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
                        {currentStars}
                      </p>

                      <p className="text-sm text-gray-400">
                        Stars
                      </p>
                    </div>
                  </div>
                </div>

                <div className="sm:text-right">
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    Current Rank
                  </p>

                  <p className="mt-2 text-xl font-semibold text-pf-purple">
                    {currentRank}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {nextRankStars - currentStars} more stars to{" "}
                    {nextRank}
                  </p>
                </div>
              </div>

              {/* Stars */}
              <div className="mt-7">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-gray-500">
                    Progress toward {nextRank}
                  </p>

                  <p className="text-xs font-semibold text-pf-purple">
                    {currentStars}/{nextRankStars}
                  </p>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-pf-purple transition-all"
                    style={{
                      width: `${Math.min(progress, 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Star indicators */}
              <div className="mt-5 flex items-center justify-between">
                {Array.from({ length: nextRankStars }).map(
                  (_, index) => {
                    const filled = index < currentStars;

                    return (
                      <div
                        key={index}
                        className={`flex h-9 w-9 items-center justify-center rounded-full ${
                          filled
                            ? "bg-pf-purple-light"
                            : "bg-gray-100"
                        }`}
                      >
                        <Star
                          className={`h-4 w-4 ${
                            filled
                              ? "fill-pf-purple text-pf-purple"
                              : "text-gray-300"
                          }`}
                        />
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* Rating */}
            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Average Rating
              </p>

              <div className="mt-4 flex items-center gap-3">
                <span className="text-4xl font-bold text-pf-purple-dark">
                  4.8
                </span>

                <div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-4 w-4 fill-pf-purple text-pf-purple"
                      />
                    ))}
                  </div>

                  <p className="mt-1 text-xs text-gray-400">
                    37 reviews
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <RatingBar label="5 stars" value={85} />
                <RatingBar label="4 stars" value={10} />
                <RatingBar label="3 stars" value={3} />
                <RatingBar label="2 stars" value={1} />
                <RatingBar label="1 star" value={1} />
              </div>
            </div>
          </section>

          {/* Performance */}
          <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <PerformanceCard
              icon={UsersRound}
              label="Recommendations"
              value="29"
              description="Parents & students"
            />

            <PerformanceCard
              icon={TrendingUp}
              label="Student Progress"
              value="91%"
              description="Positive progress"
            />

            <PerformanceCard
              icon={Clock3}
              label="Punctuality"
              value="96%"
              description="Sessions on time"
            />

            <PerformanceCard
              icon={BarChart3}
              label="Performance"
              value="92%"
              description="Overall score"
            />
          </section>

          {/* Career progression */}
          <section className="mt-6 rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pf-purple-light text-pf-purple">
                  <Medal className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-semibold text-pf-purple-dark">
                    Career Progression
                  </h3>

                  <p className="mt-1 text-xs text-gray-400">
                    Your professional growth on the platform
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid gap-4 md:grid-cols-4">
                {ranks.map((rank, index) => {
                  const reached =
                    currentStars >= rank.stars;

                  const current =
                    rank.name === currentRank;

                  return (
                    <div
                      key={rank.name}
                      className="relative"
                    >
                      <div
                        className={`rounded-xl border p-5 ${
                          current
                            ? "border-pf-purple bg-pf-purple-light"
                            : reached
                            ? "border-gray-200 bg-white"
                            : "border-gray-100 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-full ${
                              reached
                                ? "bg-pf-purple text-white"
                                : "bg-gray-200 text-gray-400"
                            }`}
                          >
                            <Award className="h-4 w-4" />
                          </div>

                          {current && (
                            <span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-pf-purple">
                              CURRENT
                            </span>
                          )}
                        </div>

                        <h4 className="mt-4 font-semibold text-pf-purple-dark">
                          {rank.name}
                        </h4>

                        <p className="mt-1 text-xs text-gray-400">
                          {rank.description}
                        </p>

                        <div className="mt-4 flex items-center gap-1">
                          <Star
                            className={`h-3.5 w-3.5 ${
                              reached
                                ? "fill-pf-purple text-pf-purple"
                                : "text-gray-300"
                            }`}
                          />

                          <span className="text-xs font-medium text-gray-500">
                            {rank.stars} stars
                          </span>
                        </div>
                      </div>

                      {index < ranks.length - 1 && (
                        <ChevronRight className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-gray-300 md:block" />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
                <p className="text-xs leading-5 text-blue-700">
                  Reaching the required star level does not
                  automatically make you an Admin Staff member.
                  Promotion to Admin Staff must be validated by
                  the Super Admin.
                </p>
              </div>
            </div>
          </section>

          {/* How stars are earned */}
          <section className="mt-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pf-purple-light text-pf-purple">
                <Star className="h-5 w-5" />
              </div>

              <div>
                <h3 className="font-semibold text-pf-purple-dark">
                  How You Earn Stars
                </h3>

                <p className="mt-1 text-xs text-gray-400">
                  Stars reflect your overall reputation and
                  professional performance.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StarSource
                title="Positive Reviews"
                description="High ratings from parents and students."
              />

              <StarSource
                title="Recommendations"
                description="Students and parents recommending your services."
              />

              <StarSource
                title="Student Progress"
                description="Strong academic improvement among your students."
              />

              <StarSource
                title="Reliability"
                description="Good attendance and punctuality."
              />
            </div>
          </section>

          {/* Reviews */}
          <section className="mt-6 rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <h3 className="font-semibold text-pf-purple-dark">
                  Recent Reviews
                </h3>

                <p className="mt-1 text-xs text-gray-400">
                  Feedback from parents and students
                </p>
              </div>

              <MessageSquare className="h-5 w-5 text-gray-300" />
            </div>

            <div className="divide-y divide-gray-100">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* ========================================================= */
/* RATING BAR                                                 */
/* ========================================================= */

function RatingBar({ label, value }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-14 text-xs text-gray-400">
        {label}
      </span>

      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-pf-purple"
          style={{ width: `${value}%` }}
        />
      </div>

      <span className="w-8 text-right text-xs text-gray-400">
        {value}%
      </span>
    </div>
  );
}

/* ========================================================= */
/* PERFORMANCE CARD                                           */
/* ========================================================= */

function PerformanceCard({
  icon: Icon,
  label,
  value,
  description,
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-pf-purple-dark">
            {value}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            {description}
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pf-purple-light text-pf-purple">
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

/* ========================================================= */
/* STAR SOURCE                                                */
/* ========================================================= */

function StarSource({ title, description }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <Star className="h-5 w-5 fill-pf-purple text-pf-purple" />

      <h4 className="mt-3 text-sm font-semibold text-pf-purple-dark">
        {title}
      </h4>

      <p className="mt-1 text-xs leading-5 text-gray-400">
        {description}
      </p>
    </div>
  );
}

/* ========================================================= */
/* REVIEW CARD                                                */
/* ========================================================= */

function ReviewCard({ review }) {
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
                {review.name}
              </p>

              <p className="mt-0.5 text-xs text-gray-400">
                {review.subject}
              </p>
            </div>

            <p className="text-xs text-gray-400">
              {review.date}
            </p>
          </div>

          <div className="mt-2 flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-3.5 w-3.5 ${
                  star <= review.rating
                    ? "fill-pf-purple text-pf-purple"
                    : "text-gray-200"
                }`}
              />
            ))}
          </div>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            {review.comment}
          </p>
        </div>
      </div>
    </div>
  );
}