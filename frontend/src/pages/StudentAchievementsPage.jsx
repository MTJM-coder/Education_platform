import {
  Award,
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Flame,
  GraduationCap,
  Medal,
  Star,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
import SidebarStudent from "../components/student/SidebarStudent";

const achievements = [
  {
    title: "Excellent Progress",
    description: "Improved your average by more than 10%.",
    date: "18 Sept. 2026",
    icon: TrendingUp,
    unlocked: true,
  },
  {
    title: "Math Master",
    description: "Scored above 80% in three Mathematics assessments.",
    date: "15 Sept. 2026",
    icon: BookOpen,
    unlocked: true,
  },
  {
    title: "Consistent Learner",
    description: "Completed your learning goals for 7 consecutive days.",
    date: "12 Sept. 2026",
    icon: Flame,
    unlocked: true,
  },
  {
    title: "Assessment Champion",
    description: "Complete 10 academic assessments.",
    date: null,
    icon: Medal,
    unlocked: false,
  },
  {
    title: "Top Performer",
    description: "Reach an overall average of 90% or more.",
    date: null,
    icon: Trophy,
    unlocked: false,
  },
  {
    title: "Learning Explorer",
    description: "Complete 25 learning resources.",
    date: null,
    icon: Target,
    unlocked: false,
  },
];

const progressSubjects = [
  {
    subject: "Mathematics",
    current: 82,
    previous: 74,
    change: 8,
  },
  {
    subject: "Physics",
    current: 72,
    previous: 67,
    change: 5,
  },
  {
    subject: "English",
    current: 91,
    previous: 79,
    change: 12,
  },
  {
    subject: "Computer Science",
    current: 92,
    previous: 77,
    change: 15,
  },
];

const goals = [
  {
    title: "Complete 20 lessons",
    current: 14,
    target: 20,
    unit: "lessons",
  },
  {
    title: "Reach 85% average",
    current: 82,
    target: 85,
    unit: "%",
  },
  {
    title: "Complete 10 assessments",
    current: 7,
    target: 10,
    unit: "assessments",
  },
];

export default function StudentAchievementsPage() {
  const overallProgress = 82;

  const unlockedAchievements = achievements.filter(
    (achievement) => achievement.unlocked
  ).length;

  return (
    <div className="min-h-screen bg-[#FAF9FB] font-sans text-[#302C38]">
      <SidebarStudent activeItem="Progress & Achievements" />

      <main className="lg:ml-64">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-5 sm:px-8">
          <div className="flex items-center gap-2 lg:hidden">
            <GraduationCap className="h-6 w-6 text-pf-purple" />

            <span className="font-serif text-sm text-pf-purple-dark">
              Student Portal
            </span>
          </div>

          <p className="hidden text-sm text-gray-500 lg:block">
            Progress & Achievements
          </p>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pf-purple-light text-xs font-semibold text-pf-purple">
            JM
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8">
          {/* Introduction */}
          <section>
            <p className="text-sm font-medium text-pf-purple">
              YOUR JOURNEY
            </p>

            <h1 className="mt-1 font-serif text-2xl font-medium text-pf-purple-dark sm:text-3xl">
              Progress & Achievements
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-gray-500">
              Track your academic progress, celebrate your
              achievements and see how far you have come.
            </p>
          </section>

          {/* Main progress */}
          <section className="mt-7 grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-2xl bg-pf-purple p-6 text-white sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.15em] text-purple-200">
                    OVERALL PROGRESS
                  </p>

                  <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
                    Keep going, you're doing great!
                  </h2>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-purple-100">
                    Your current academic progress is strong.
                    Continue working consistently to reach your
                    next goals.
                  </p>
                </div>

                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-8 border-white/20">
                  <span className="font-serif text-2xl">
                    {overallProgress}%
                  </span>
                </div>
              </div>

              <div className="mt-7">
                <div className="flex justify-between text-xs text-purple-200">
                  <span>Current progress</span>
                  <span>{overallProgress}%</span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-white"
                    style={{
                      width: `${overallProgress}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="rounded-lg bg-white/10 px-3 py-2">
                  <p className="text-[10px] text-purple-200">
                    Current average
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    82%
                  </p>
                </div>

                <div className="rounded-lg bg-white/10 px-3 py-2">
                  <p className="text-[10px] text-purple-200">
                    Subjects
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    4 active
                  </p>
                </div>

                <div className="rounded-lg bg-white/10 px-3 py-2">
                  <p className="text-[10px] text-purple-200">
                    Achievements
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {unlockedAchievements}
                  </p>
                </div>
              </div>
            </div>

            {/* Most Progressive Student */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF4D8]">
                  <Trophy className="h-5 w-5 text-pf-gold" />
                </div>

                <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-pf-green">
                  This Month
                </span>
              </div>

              <p className="mt-5 text-[10px] font-semibold tracking-[0.14em] text-gray-400">
                MOST PROGRESSIVE STUDENT
              </p>

              <h2 className="mt-2 font-serif text-xl text-pf-purple-dark">
                Keep improving!
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                This award recognizes students who show the
                strongest improvement in academic performance,
                progression and consistency.
              </p>

              <div className="mt-5 rounded-xl bg-[#FAF9FB] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pf-purple-light">
                    <Star className="h-5 w-5 text-pf-purple" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-pf-purple-dark">
                      Your current progress
                    </p>

                    <p className="mt-1 text-[11px] text-gray-400">
                      +10% compared with the previous period
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-[11px] text-gray-400">
                Awards may include a textbook, school bag,
                school supplies or another educational reward.
              </p>
            </div>
          </section>

          {/* Subject progress */}
          <section className="mt-7 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="font-serif text-xl text-pf-purple-dark">
                  Progress by Subject
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  See how your performance has changed in each
                  subject.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400">
                <CalendarDays className="h-4 w-4" />
                Current period
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {progressSubjects.map((item) => (
                <SubjectProgressCard
                  key={item.subject}
                  subject={item}
                />
              ))}
            </div>
          </section>

          {/* Goals */}
          <section className="mt-7 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-xl text-pf-purple-dark">
                    My Goals
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Keep working towards your next milestones.
                  </p>
                </div>

                <Target className="h-5 w-5 text-pf-purple" />
              </div>

              <div className="mt-5 space-y-5">
                {goals.map((goal) => (
                  <GoalCard
                    key={goal.title}
                    goal={goal}
                  />
                ))}
              </div>
            </div>

            {/* Learning streak */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
                  <Flame className="h-5 w-5 text-orange-500" />
                </div>

                <div>
                  <h2 className="font-serif text-xl text-pf-purple-dark">
                    Learning Streak
                  </h2>

                  <p className="text-xs text-gray-400">
                    Consistency matters
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-end gap-2">
                <span className="font-serif text-4xl text-pf-purple-dark">
                  7
                </span>

                <span className="mb-1 text-sm text-gray-500">
                  days
                </span>
              </div>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                You have learned for 7 consecutive days. Keep
                the streak going!
              </p>

              <div className="mt-5 grid grid-cols-7 gap-1.5">
                {["M", "T", "W", "T", "F", "S", "S"].map(
                  (day, index) => (
                    <div
                      key={`${day}-${index}`}
                      className="text-center"
                    >
                      <div className="flex h-8 items-center justify-center rounded-lg bg-pf-purple text-[10px] font-semibold text-white">
                        ✓
                      </div>

                      <span className="mt-1 block text-[9px] text-gray-400">
                        {day}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </section>

          {/* Achievements */}
          <section className="mt-7 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-xl text-pf-purple-dark">
                  Achievements
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Milestones you have unlocked and goals you
                  can still reach.
                </p>
              </div>

              <span className="rounded-full bg-pf-purple-light px-3 py-1.5 text-xs font-medium text-pf-purple">
                {unlockedAchievements} / {achievements.length} unlocked
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {achievements.map((achievement) => (
                <AchievementCard
                  key={achievement.title}
                  achievement={achievement}
                />
              ))}
            </div>
          </section>

          {/* Reward history */}
          <section className="mt-7 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl text-pf-purple-dark">
                  Reward History
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Your academic recognition history.
                </p>
              </div>

              <Award className="h-5 w-5 text-pf-purple" />
            </div>

            <div className="mt-5 flex items-center gap-4 rounded-xl bg-[#FAF9FB] p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFF4D8]">
                <Trophy className="h-5 w-5 text-pf-gold" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-pf-purple-dark">
                  No reward received yet
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Continue improving to become the Most
                  Progressive Student of the Month.
                </p>
              </div>

              <ChevronRight className="h-5 w-5 text-gray-300" />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* ========================================================= */
/* SUBJECT PROGRESS CARD                                      */
/* ========================================================= */

function SubjectProgressCard({ subject }) {
  return (
    <div className="rounded-xl bg-[#FAF9FB] p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-pf-purple-dark">
            {subject.subject}
          </p>

          <p className="mt-1 text-[10px] text-gray-400">
            Previous: {subject.previous}%
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm font-semibold text-pf-purple">
            {subject.current}%
          </p>

          <p className="mt-1 text-[10px] font-semibold text-pf-green">
            +{subject.change}%
          </p>
        </div>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-pf-purple"
          style={{
            width: `${subject.current}%`,
          }}
        />
      </div>
    </div>
  );
}

/* ========================================================= */
/* GOAL CARD                                                   */
/* ========================================================= */

function GoalCard({ goal }) {
  const progress = Math.min(
    (goal.current / goal.target) * 100,
    100
  );

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium text-pf-purple-dark">
          {goal.title}
        </p>

        <span className="text-[10px] font-semibold text-pf-purple">
          {goal.current} / {goal.target} {goal.unit}
        </span>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-pf-purple"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}

/* ========================================================= */
/* ACHIEVEMENT CARD                                            */
/* ========================================================= */

function AchievementCard({ achievement }) {
  const Icon = achievement.icon;

  return (
    <div
      className={`rounded-xl border p-4 ${
        achievement.unlocked
          ? "border-gray-200 bg-white"
          : "border-dashed border-gray-200 bg-[#FAF9FB]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            achievement.unlocked
              ? "bg-pf-purple-light"
              : "bg-gray-100"
          }`}
        >
          <Icon
            className={`h-5 w-5 ${
              achievement.unlocked
                ? "text-pf-purple"
                : "text-gray-300"
            }`}
          />
        </div>

        {achievement.unlocked ? (
          <CheckCircle2 className="h-5 w-5 text-pf-green" />
        ) : (
          <span className="text-[10px] font-medium text-gray-400">
            Locked
          </span>
        )}
      </div>

      <h3
        className={`mt-4 text-sm font-semibold ${
          achievement.unlocked
            ? "text-pf-purple-dark"
            : "text-gray-400"
        }`}
      >
        {achievement.title}
      </h3>

      <p
        className={`mt-2 text-xs leading-5 ${
          achievement.unlocked
            ? "text-gray-500"
            : "text-gray-400"
        }`}
      >
        {achievement.description}
      </p>

      {achievement.unlocked && achievement.date && (
        <p className="mt-3 text-[10px] text-gray-400">
          Unlocked on {achievement.date}
        </p>
      )}
    </div>
  );
}