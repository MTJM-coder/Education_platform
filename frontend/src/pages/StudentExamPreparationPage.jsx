import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  GraduationCap,
  Target,
  Trophy,
  TrendingUp,
} from "lucide-react";
import SidebarStudent from "../components/student/SidebarStudent";

const exams = [
  {
    name: "GCE Advanced Level",
    institution: "Cameroon GCE Board",
    date: "June 2027",
    subjects: ["Mathematics", "Physics", "English"],
    progress: 68,
    status: "In progress",
  },
  {
    name: "Polytechnic Entrance Exam",
    institution: "National Advanced School of Engineering",
    date: "2027",
    subjects: ["Mathematics", "Physics", "Computer Science"],
    progress: 35,
    status: "In progress",
  },
  {
    name: "University Entrance Preparation",
    institution: "University Preparation",
    date: "2027",
    subjects: ["Mathematics", "English"],
    progress: 0,
    status: "Available",
  },
];

const resources = [
  {
    title: "Mathematics Past Papers",
    type: "Past Papers",
    detail: "15 documents",
    icon: FileText,
  },
  {
    title: "Physics Revision Notes",
    type: "Revision Notes",
    detail: "12 documents",
    icon: BookOpen,
  },
  {
    title: "Mathematics Practice Quiz",
    type: "Quiz",
    detail: "20 questions",
    icon: Target,
  },
];

export default function StudentExamPreparationPage() {
  const activeExam = exams[0];

  return (
    <div className="min-h-screen bg-[#FAF9FB] font-sans text-[#302C38]">
      <SidebarStudent activeItem="Exam Preparation" />

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
            Exam Preparation
          </p>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pf-purple-light text-xs font-semibold text-pf-purple">
            JM
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8">
          {/* Introduction */}
          <section>
            <p className="text-sm font-medium text-pf-purple">
              PREPARE FOR YOUR FUTURE
            </p>

            <h1 className="mt-1 font-serif text-2xl font-medium text-pf-purple-dark sm:text-3xl">
              Exam Preparation
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-gray-500">
              Prepare for competitive exams and important academic
              milestones with structured resources and teacher
              support.
            </p>
          </section>

          {/* Current preparation */}
          <section className="mt-7 rounded-2xl bg-pf-purple p-6 text-white sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide">
                    Current preparation
                  </span>

                  <span className="rounded-full bg-green-400/20 px-2.5 py-1 text-[10px] font-semibold text-green-100">
                    {activeExam.status}
                  </span>
                </div>

                <h2 className="mt-4 font-serif text-2xl sm:text-3xl">
                  {activeExam.name}
                </h2>

                <p className="mt-2 text-sm text-purple-100">
                  {activeExam.institution}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {activeExam.subjects.map((subject) => (
                    <span
                      key={subject}
                      className="rounded-lg bg-white/10 px-3 py-1.5 text-xs text-purple-100"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-full border-8 border-white/15">
                <span className="font-serif text-2xl">
                  {activeExam.progress}%
                </span>

                <span className="text-[9px] text-purple-200">
                  completed
                </span>
              </div>
            </div>

            <div className="mt-7">
              <div className="flex justify-between text-xs text-purple-200">
                <span>Preparation progress</span>
                <span>{activeExam.progress}%</span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-white"
                  style={{
                    width: `${activeExam.progress}%`,
                  }}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-purple-100">
                <CalendarDays className="h-4 w-4" />
                Exam: {activeExam.date}
              </div>

              <div className="flex items-center gap-2 text-xs text-purple-100">
                <BookOpen className="h-4 w-4" />
                {activeExam.subjects.length} subjects
              </div>
            </div>
          </section>

          {/* Preparation statistics */}
          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={BookOpen}
              label="Resources completed"
              value="24"
              detail="of 35 resources"
            />

            <StatCard
              icon={Target}
              label="Practice questions"
              value="186"
              detail="questions attempted"
            />

            <StatCard
              icon={TrendingUp}
              label="Average score"
              value="78%"
              detail="+8% this month"
            />

            <StatCard
              icon={Clock3}
              label="Study time"
              value="12h 40m"
              detail="this preparation"
            />
          </section>

          {/* Continue preparation + daily target */}
          <section className="mt-7 grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-serif text-xl text-pf-purple-dark">
                    Continue Preparation
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Pick up where you left off.
                  </p>
                </div>

                <button
                  type="button"
                  className="text-xs font-semibold text-pf-purple hover:underline"
                >
                  View all
                </button>
              </div>

              <div className="mt-5 space-y-3">
                <PreparationItem
                  title="Algebra & Functions"
                  subject="Mathematics"
                  progress={82}
                  lessons="8 / 10 lessons"
                />

                <PreparationItem
                  title="Mechanics"
                  subject="Physics"
                  progress={64}
                  lessons="7 / 11 lessons"
                />

                <PreparationItem
                  title="Essay Writing"
                  subject="English"
                  progress={58}
                  lessons="5 / 9 lessons"
                />
              </div>
            </div>

            {/* Daily target */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pf-purple-light">
                  <Target className="h-5 w-5 text-pf-purple" />
                </div>

                <div>
                  <h2 className="font-serif text-lg text-pf-purple-dark">
                    Today's Target
                  </h2>

                  <p className="text-xs text-gray-400">
                    Your preparation plan
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="font-serif text-3xl text-pf-purple-dark">
                      2
                    </span>

                    <span className="ml-1 text-xs text-gray-500">
                      / 3 tasks
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-pf-green">
                    67%
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full w-2/3 rounded-full bg-pf-green" />
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <Task
                  label="Complete Algebra revision"
                  completed
                />

                <Task
                  label="Attempt Physics quiz"
                  completed
                />

                <Task
                  label="Read Essay Writing notes"
                  completed={false}
                />
              </div>
            </div>
          </section>

          {/* Resources */}
          <section className="mt-7 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="font-serif text-xl text-pf-purple-dark">
                  Preparation Resources
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Past papers, notes and practice materials.
                </p>
              </div>

              <button
                type="button"
                className="text-xs font-semibold text-pf-purple hover:underline"
              >
                Browse resources →
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {resources.map((resource) => {
                const Icon = resource.icon;

                return (
                  <button
                    key={resource.title}
                    type="button"
                    className="group rounded-xl border border-gray-200 p-4 text-left transition hover:-translate-y-0.5 hover:border-pf-purple hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pf-purple-light">
                        <Icon className="h-5 w-5 text-pf-purple" />
                      </div>

                      <ChevronRight className="h-4 w-4 text-gray-300 transition group-hover:text-pf-purple" />
                    </div>

                    <h3 className="mt-4 text-sm font-semibold text-pf-purple-dark">
                      {resource.title}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      {resource.type} · {resource.detail}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Exam subjects */}
          <section className="mt-7 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
            <div>
              <h2 className="font-serif text-xl text-pf-purple-dark">
                Subjects
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your preparation progress by subject.
              </p>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <ExamSubject
                subject="Mathematics"
                progress={82}
                score="84%"
              />

              <ExamSubject
                subject="Physics"
                progress={64}
                score="72%"
              />

              <ExamSubject
                subject="English"
                progress={58}
                score="78%"
              />
            </div>
          </section>

          {/* Available exams */}
          <section className="mt-7 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
            <div>
              <h2 className="font-serif text-xl text-pf-purple-dark">
                Available Exam Preparations
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Explore other preparation tracks available to you.
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {exams.map((exam) => (
                <ExamRow key={exam.name} exam={exam} />
              ))}
            </div>
          </section>

          {/* Motivation */}
          <section className="mt-7 mb-4 rounded-2xl border border-pf-purple-light bg-pf-purple-light p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white">
                <Trophy className="h-5 w-5 text-pf-gold" />
              </div>

              <div>
                <h2 className="font-serif text-lg text-pf-purple-dark">
                  Your goal is bigger than the exam
                </h2>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
                  Stay consistent, work with your teachers and
                  use the available resources. Every completed
                  lesson brings you one step closer to your goal.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* ========================================================= */
/* STAT CARD                                                   */
/* ========================================================= */

function StatCard({ icon: Icon, label, value, detail }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pf-purple-light">
          <Icon className="h-5 w-5 text-pf-purple" />
        </div>

        <TrendingUp className="h-4 w-4 text-pf-green" />
      </div>

      <p className="mt-4 text-xs text-gray-500">{label}</p>

      <p className="mt-1 font-serif text-2xl text-pf-purple-dark">
        {value}
      </p>

      <p className="mt-1 text-[10px] text-gray-400">
        {detail}
      </p>
    </div>
  );
}

/* ========================================================= */
/* PREPARATION ITEM                                            */
/* ========================================================= */

function PreparationItem({
  title,
  subject,
  progress,
  lessons,
}) {
  return (
    <button
      type="button"
      className="group flex w-full items-center gap-4 rounded-xl border border-gray-100 p-4 text-left transition hover:border-pf-purple hover:bg-[#FCFBFD]"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pf-purple-light">
        <BookOpen className="h-5 w-5 text-pf-purple" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-pf-purple-dark">
              {title}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              {subject} · {lessons}
            </p>
          </div>

          <span className="text-xs font-semibold text-pf-purple">
            {progress}%
          </span>
        </div>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-pf-purple"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      <ChevronRight className="h-4 w-4 shrink-0 text-gray-300 group-hover:text-pf-purple" />
    </button>
  );
}

/* ========================================================= */
/* TASK                                                        */
/* ========================================================= */

function Task({ label, completed }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
          completed
            ? "bg-pf-green text-white"
            : "border border-gray-300"
        }`}
      >
        {completed && (
          <CheckCircle2 className="h-4 w-4" />
        )}
      </div>

      <span
        className={`text-xs ${
          completed
            ? "text-gray-400 line-through"
            : "text-pf-purple-dark"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

/* ========================================================= */
/* EXAM SUBJECT                                                */
/* ========================================================= */

function ExamSubject({ subject, progress, score }) {
  return (
    <div className="rounded-xl bg-[#FAF9FB] p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-pf-purple-dark">
            {subject}
          </p>

          <p className="mt-1 text-[10px] text-gray-400">
            Current average: {score}
          </p>
        </div>

        <span className="text-xs font-semibold text-pf-purple">
          {progress}%
        </span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-pf-purple"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <p className="mt-2 text-[10px] text-gray-400">
        Preparation completed
      </p>
    </div>
  );
}

/* ========================================================= */
/* EXAM ROW                                                    */
/* ========================================================= */

function ExamRow({ exam }) {
  const isActive = exam.status === "In progress";

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-gray-100 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pf-purple-light">
        <GraduationCap className="h-5 w-5 text-pf-purple" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-pf-purple-dark">
            {exam.name}
          </p>

          <span
            className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
              isActive
                ? "bg-green-50 text-pf-green"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {exam.status}
          </span>
        </div>

        <p className="mt-1 text-xs text-gray-400">
          {exam.institution} · {exam.date}
        </p>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {exam.subjects.map((subject) => (
            <span
              key={subject}
              className="rounded-md bg-[#FAF9FB] px-2 py-1 text-[9px] text-gray-500"
            >
              {subject}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {exam.progress > 0 && (
          <div className="hidden w-24 sm:block">
            <div className="flex justify-between text-[9px] text-gray-400">
              <span>Progress</span>
              <span>{exam.progress}%</span>
            </div>

            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-pf-purple"
                style={{
                  width: `${exam.progress}%`,
                }}
              />
            </div>
          </div>
        )}

        <button
          type="button"
          className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-pf-purple hover:bg-pf-purple-light"
        >
          {isActive ? "Continue" : "Explore"}
        </button>
      </div>
    </div>
  );
}