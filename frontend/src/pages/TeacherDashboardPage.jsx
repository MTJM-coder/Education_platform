import {
  Award,
  Bell,
  CalendarDays,
  ChevronRight,
  Clock3,
  Coins,
  Star,
  Target,
  TrendingUp,
  UsersRound,
  Book,
  MapPin
} from "lucide-react";
import TeacherSidebar from "../components/teacher/TeacherSidebar";
import { useEffect, useState } from "react";
import { apiFetch } from "../lib/apiClient";

const upcomingLessons = [
  {
    id: 1,
    student: "Junior D.",
    subject: "Mathematics",
    date: "Today",
    time: "16:00 - 17:30",
    location: "Bonamoussadi",
  },
  {
    id: 2,
    student: "Sarah M.",
    subject: "English",
    date: "Tomorrow",
    time: "14:00 - 15:30",
    location: "Makepe",
  },
  {
    id: 3,
    student: "David N.",
    subject: "Physics",
    date: "Sep 23",
    time: "17:00 - 18:30",
    location: "Deido",
  },
];

const recentReviews = [
  {
    id: 1,
    parent: "Mrs. Johnson",
    rating: 5,
    comment:
      "Very patient teacher. My son has improved a lot in Mathematics.",
  },
  {
    id: 2,
    parent: "Mr. Paul",
    rating: 5,
    comment:
      "Excellent communication and always punctual.",
  },


];

const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;

  const total = reviews.reduce((acc, curr) => acc + curr.rating, 0);
  return (total / reviews.length).toFixed(1); // Arrondi à 1 décimale (ex: 4.5)
};



export default function TeacherDashboardPage() {
  const [lessons, setLessons] = useState([])
  const [reviews, setReviews] = useState([])
  const [error, setError] = useState("")
  const [assignment,setAssignment]=useState([])
  const [earning,setEarning] = useState([])
  const [me,setMe]=useState([])
  useEffect(() => {
    const fetch = async () => {
      try {
        const sessionResponse = await apiFetch('/me/sessions?upcoming=1')
        const reviewResponse = await apiFetch('/me/reviews')
        const assignmentResponse = await apiFetch('/me/assignments')
        const meResponse = await apiFetch("/auth/me")
        const earningResponse = await apiFetch("/me/earnings")
        setReviews(reviewResponse.data)
        setLessons(sessionResponse.data)
        setAssignment(assignmentResponse.data)
        setEarning(earningResponse)
        setMe(meResponse.data)
      } catch (error) {
        setError(message.error)
      }

    }
    fetch()
  }, [])

  return (
    <div className="min-h-screen bg-[#FAFAFC]">
      <TeacherSidebar activeItem="Dashboard" />

      <main className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-100 bg-white/95 px-6 backdrop-blur lg:px-8">
          <div className="ml-12 lg:ml-0">
            <p className="text-xs text-gray-400">Teacher Portal</p>
            <h1 className="text-lg font-semibold text-pf-purple-dark">
              Dashboard
            </h1>
          </div>

          <button
            type="button"
            className="relative rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
          >
            <Bell className="h-5 w-5" />

            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-pf-purple" />
          </button>
        </header>

        <div className="p-6 lg:p-8">
          {/* Welcome */}
          <section className="mb-8">
            <p className="text-sm text-gray-500">Sunday, September 20, 2026</p>

            <p className="mt-1 text-sm text-gray-500">
              Here is an overview of your teaching activity.
            </p>
          </section>

          {/* Main stats */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={UsersRound}
              label="My Students"
              value={assignment.length}
              description="Currently assigned"
            />

            <StatCard
              icon={CalendarDays}
              label="Upcoming Lessons"
              value={lessons.length}
              description="Next 7 days"
            />

            <StatCard
              icon={Star}
              label="My Rating"
              value={calculateAverageRating(reviews)}
              description={`from ${reviews.length} reviews`}
            />

            <StatCard
              icon={Coins}
              label="Available Balance"
              value={`${me?.balance} FCFA`}
              description="Ready for withdrawal"
            />
          </section>

          {/* Secondary performance cards */}
          <section className="mt-6 grid gap-6 xl:grid-cols-3">
            {/* Reputation */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Reputation
                  </p>

                  <h3 className="mt-1 text-lg font-semibold text-pf-purple-dark">
                    {me?.rank??""}
                  </h3>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pf-purple-light text-pf-purple">
                  <Award className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-pf-purple-dark">
                    ⭐ {me?.stars??" "}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Current stars
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-semibold text-pf-purple-dark">
                    {me?.rank_points??" "}
                  </p>

                  <p className="text-xs text-gray-400">Points</p>
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex justify-between text-xs">
                  <span className="text-gray-500">
                    Progress to senior Teacher
                  </span>

                  <span className="font-medium text-pf-purple">{`${me.rank_points/100}%`}</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-pf-purple"
                    style={{ width: `${me.rank_points/100}%` }}
                  />
                </div>
              </div>

              <a
                href="/teacher-reputation"
                className="mt-5 flex items-center gap-1 text-sm font-medium text-pf-purple hover:underline"
              >
                View reputation
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>

            {/* Earnings */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Earnings
                  </p>

                  <h3 className="mt-1 text-lg font-semibold text-pf-purple-dark">
                    This month
                  </h3>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pf-purple-light text-pf-purple">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>

              <p className="mt-5 text-2xl font-bold text-pf-purple-dark">
                {earning?.this_month} FCFA
              </p>

              <p className="mt-1 text-xs text-gray-400">
                {earning?.percent_change}% compared to last month
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-400">In escrow</p>
                  <p className="mt-1 font-semibold text-pf-purple-dark">
                    {earning?.in_escrow}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs text-gray-400">Current rate</p>
                  <p className="mt-1 font-semibold text-pf-purple-dark">
                    {earning?.current_rate}/h
                  </p>
                </div>
              </div>

              <a
                href="/teacher-earnings"
                className="mt-5 flex items-center gap-1 text-sm font-medium text-pf-purple hover:underline"
              >
                View earnings
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>

            {/* Quick actions */}
            <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Quick actions
              </p>

              <h3 className="mt-1 text-lg font-semibold text-pf-purple-dark">
                What would you like to do?
              </h3>

              <div className="mt-5 space-y-2">
                <QuickAction
                  icon={CalendarDays}
                  label="View my calendar"
                  href="/teacher-calendar"
                />

                <QuickAction
                  icon={UsersRound}
                  label="View my students"
                  href="/teacher-students"
                />

                <QuickAction
                  icon={Book}
                  label="Add lecture note"
                  href="/teacher-lecture-notes"
                />

                <QuickAction
                  icon={Target}
                  label="Exam preparation"
                  href="/teacher-exam-preparation"
                />
              </div>
            </div>
          </section>

          {/* Upcoming lessons + Reviews */}
          <section className="mt-6 grid gap-6 xl:grid-cols-3">
            {/* Upcoming lessons */}
            <div className="xl:col-span-2 rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <div>
                  <h3 className="font-semibold text-pf-purple-dark">
                    Upcoming Lessons
                  </h3>

                  <p className="mt-0.5 text-xs text-gray-400">
                    Your next scheduled sessions
                  </p>
                </div>

                <a
                  href="/teacher-calendar"
                  className="text-sm font-medium text-pf-purple hover:underline"
                >
                  View calendar
                </a>
              </div>

              <div className="divide-y divide-gray-100">
                {lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pf-purple-light text-pf-purple">
                        <CalendarDays className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="font-medium text-pf-purple-dark">
                          {lesson?.assignment?.tutoring_request?.subject?.name}
                        </p>

                        <p className="mt-0.5 text-sm text-gray-500">
                          {(() => {
                            const learner = lesson?.assignment?.tutoring_request?.learner;
                            const targetUser = learner?.user || learner?.parent_profile?.user;

                            if (!targetUser) return 'Nom indisponible';

                            const initial = targetUser.first_name ? `${targetUser.first_name.charAt(0).toUpperCase()}.` : '';
                            const lastName = targetUser.last_name || '';

                            return `${lastName} ${initial}`.trim();
                          })()}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          <MapPin className="inline mr-4 text-xs"></MapPin> {lesson?.location}
                        </p>
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <p className="text-sm font-medium text-pf-purple-dark">
                        {new Date(lesson?.session_date).toLocaleDateString("fr-FR")}
                      </p>

                      <p className="mt-1 flex items-center gap-1 text-xs text-gray-400 sm:justify-end">
                        <Clock3 className="h-3.5 w-3.5" />
                        {lesson?.start_time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent reviews */}
            <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-5 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-pf-purple-dark">
                      Recent Reviews
                    </h3>

                    <p className="mt-0.5 text-xs text-gray-400">
                      Latest feedback
                    </p>
                  </div>

                  <a
                    href="/teacher-reputation"
                    className="text-sm font-medium text-pf-purple hover:underline"
                  >
                    All
                  </a>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {reviews.slice(0,3).map((review) => (
                  <div key={review.id} className="p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-pf-purple-dark">
                        {"user XXXX"}
                      </p>

                      <div className="flex gap-0.5">
                        {Array.from({ length: review.rating }).map(
                          (_, index) => (
                            <Star
                              key={index}
                              className="h-3.5 w-3.5 fill-current text-pf-purple"
                            />
                          )
                        )}
                      </div>
                    </div>

                    <p className="mt-2 text-sm leading-5 text-gray-500">
                      "{review.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* ---------------------------------- */
/* Reusable components                 */
/* ---------------------------------- */

function StatCard({ icon: Icon, label, value, description }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-pf-purple-dark">
            {value}
          </p>

          <p className="mt-1 text-xs text-gray-400">{description}</p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pf-purple-light text-pf-purple">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, href }) {
  return (
    <a
      href={href}
      className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-3 transition hover:border-pf-purple/20 hover:bg-pf-purple-light"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-pf-purple-light text-pf-purple">
          <Icon className="h-4 w-4" />
        </div>

        <span className="text-sm font-medium text-[#5D5A65]">
          {label}
        </span>
      </div>

      <ChevronRight className="h-4 w-4 text-gray-400" />
    </a>
  );
}
