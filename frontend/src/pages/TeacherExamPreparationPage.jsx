import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  GraduationCap,
  Plus,
  Target,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { useState } from "react";
import TeacherSidebar from "../components/teacher/TeacherSidebar";

const preparations = [
  {
    id: 1,
    learner: "Student A",
    exam: "GCE Advanced Level",
    institution: "GCE Board",
    city: "Yaoundé",
    subjects: ["Mathematics", "Physics"],
    progress: 78,
    nextSession: "Sep 22, 2026",
    status: "Active",
  },
  {
    id: 2,
    learner: "Student B",
    exam: "Polytechnic Entrance Exam",
    institution: "ENSP",
    city: "Yaoundé",
    subjects: ["Mathematics", "Physics"],
    progress: 61,
    nextSession: "Sep 24, 2026",
    status: "Active",
  },
  {
    id: 3,
    learner: "Student C",
    exam: "FMBS Entrance Exam",
    institution: "FMBS",
    city: "Douala",
    subjects: ["Mathematics", "Biology"],
    progress: 45,
    nextSession: "Sep 27, 2026",
    status: "Active",
  },
];

const upcomingSessions = [
  {
    learner: "Student A",
    subject: "Mathematics",
    date: "Sep 22, 2026",
    time: "16:00 - 18:00",
  },
  {
    learner: "Student B",
    subject: "Physics",
    date: "Sep 24, 2026",
    time: "14:00 - 16:00",
  },
  {
    learner: "Student C",
    subject: "Biology",
    date: "Sep 27, 2026",
    time: "10:00 - 12:00",
  },
];

export default function TeacherExamPreparationPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAFC]">
      <TeacherSidebar activeItem="Exam Preparation" />

      <main className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-100 bg-white/95 px-6 backdrop-blur lg:px-8">
          <div className="ml-12 lg:ml-0">
            <p className="text-xs text-gray-400">
              Teacher Portal
            </p>

            <h1 className="text-lg font-semibold text-pf-purple-dark">
              Exam Preparation
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-lg bg-pf-purple px-3.5 py-2.5 text-sm font-medium text-white shadow-sm hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            New Preparation
          </button>
        </header>

        <div className="p-6 lg:p-8">
          {/* Intro */}
          <section className="mb-7">
            <h2 className="font-serif text-2xl font-semibold text-pf-purple-dark">
              Exam Preparation
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
              Manage learners preparing for competitive exams,
              entrance examinations and other academic
              competitions.
            </p>
          </section>

          {/* Statistics */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={UsersRound}
              label="Learners"
              value="3"
              description="Currently preparing"
            />

            <StatCard
              icon={Target}
              label="Active Preparations"
              value="3"
              description="Exam preparation tracks"
            />

            <StatCard
              icon={TrendingUp}
              label="Average Progress"
              value="61%"
              description="Across preparations"
            />

            <StatCard
              icon={CalendarDays}
              label="Upcoming Sessions"
              value="3"
              description="Scheduled sessions"
            />
          </section>

          {/* Main preparation list */}
          <section className="mt-6 rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pf-purple-light text-pf-purple">
                  <Target className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-semibold text-pf-purple-dark">
                    My Preparation Tracks
                  </h3>

                  <p className="mt-1 text-xs text-gray-400">
                    Learners currently assigned to your exam
                    preparation sessions
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {preparations.map((preparation) => (
                <PreparationCard
                  key={preparation.id}
                  preparation={preparation}
                />
              ))}
            </div>
          </section>

          {/* Upcoming sessions */}
          <section className="mt-6 rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <h3 className="font-semibold text-pf-purple-dark">
                  Upcoming Preparation Sessions
                </h3>

                <p className="mt-1 text-xs text-gray-400">
                  Your next exam preparation classes
                </p>
              </div>

              <CalendarDays className="h-5 w-5 text-gray-300" />
            </div>

            <div className="divide-y divide-gray-100">
              {upcomingSessions.map((session, index) => (
                <SessionRow
                  key={index}
                  session={session}
                />
              ))}
            </div>
          </section>

          {/* Resources */}
          <section className="mt-6 grid gap-5 lg:grid-cols-2">
            <ResourceCard
              icon={FileText}
              title="Preparation Materials"
              description="Access lecture notes, past papers, corrections and other resources useful for exam preparation."
              action="View Materials"
            />

            <ResourceCard
              icon={BookOpen}
              title="Exam Information"
              description="Review exam requirements, subjects, institutions, dates and preparation conditions."
              action="View Exam Information"
            />
          </section>

          {/* Info */}
          <section className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-5">
            <div className="flex gap-3">
              <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

              <div>
                <h3 className="text-sm font-semibold text-blue-800">
                  How exam preparation works
                </h3>

                <p className="mt-1 text-xs leading-5 text-blue-700">
                  A learner can be enrolled in a preparation
                  track for a specific exam. The teacher covers
                  the required subjects, follows the learner's
                  progress and records preparation sessions.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {showForm && (
        <NewPreparationModal
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

/* ========================================================= */
/* STAT CARD                                                   */
/* ========================================================= */

function StatCard({
  icon: Icon,
  label,
  value,
  description,
}) {
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
/* PREPARATION CARD                                           */
/* ========================================================= */

function PreparationCard({ preparation }) {
  return (
    <div className="px-6 py-5 transition hover:bg-gray-50/60">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-pf-purple-light text-pf-purple">
            <GraduationCap className="h-5 w-5" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-semibold text-pf-purple-dark">
                {preparation.learner}
              </h4>

              <span className="rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-medium text-green-700">
                {preparation.status}
              </span>
            </div>

            <p className="mt-1 text-sm text-gray-600">
              {preparation.exam}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              {preparation.institution} · {preparation.city}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {preparation.subjects.map((subject) => (
                <span
                  key={subject}
                  className="rounded-md bg-gray-100 px-2.5 py-1 text-[11px] text-gray-500"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-64">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">
              Preparation progress
            </span>

            <span className="text-xs font-semibold text-pf-purple">
              {preparation.progress}%
            </span>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-pf-purple"
              style={{
                width: `${preparation.progress}%`,
              }}
            />
          </div>

          <p className="mt-2 flex items-center gap-1 text-xs text-gray-400">
            <CalendarDays className="h-3.5 w-3.5" />
            Next session: {preparation.nextSession}
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-2 self-start rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-pf-purple hover:bg-pf-purple-light lg:self-center"
        >
          View Track
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ========================================================= */
/* SESSION ROW                                                */
/* ========================================================= */

function SessionRow({ session }) {
  return (
    <div className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pf-purple-light text-pf-purple">
          <CalendarDays className="h-4 w-4" />
        </div>

        <div>
          <p className="text-sm font-medium text-pf-purple-dark">
            {session.learner}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            {session.subject}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div>
          <p className="text-xs text-gray-400">
            Date
          </p>

          <p className="mt-1 text-sm font-medium text-gray-600">
            {session.date}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400">
            Time
          </p>

          <p className="mt-1 flex items-center gap-1 text-sm font-medium text-gray-600">
            <Clock3 className="h-3.5 w-3.5" />
            {session.time}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ========================================================= */
/* RESOURCE CARD                                              */
/* ========================================================= */

function ResourceCard({
  icon: Icon,
  title,
  description,
  action,
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pf-purple-light text-pf-purple">
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="mt-4 font-semibold text-pf-purple-dark">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-gray-500">
        {description}
      </p>

      <button
        type="button"
        className="mt-5 flex items-center gap-2 text-sm font-medium text-pf-purple hover:underline"
      >
        {action}
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ========================================================= */
/* NEW PREPARATION MODAL                                      */
/* ========================================================= */

function NewPreparationModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="border-b border-gray-100 px-6 py-5">
          <h2 className="font-semibold text-pf-purple-dark">
            New Exam Preparation
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Create a preparation track for a learner.
          </p>
        </div>

        <div className="space-y-4 p-6">
          <FormField
            label="Learner"
            type="select"
            options={[
              "Select learner",
              "Student A",
              "Student B",
              "Student C",
            ]}
          />

          <FormField
            label="Exam"
            type="select"
            options={[
              "Select exam",
              "GCE Advanced Level",
              "Polytechnic Entrance Exam",
              "FMBS Entrance Exam",
            ]}
          />

          <FormField
            label="Subjects"
            type="text"
            placeholder="e.g. Mathematics, Physics"
          />

          <FormField
            label="Target date"
            type="date"
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-pf-purple px-4 py-2.5 text-sm font-medium text-white"
          >
            Create Preparation
          </button>
        </div>
      </div>
    </div>
  );
}

/* ========================================================= */
/* FORM FIELD                                                  */
/* ========================================================= */

function FormField({
  label,
  type = "text",
  placeholder,
  options,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-600">
        {label}
      </label>

      {type === "select" ? (
        <select className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-600 outline-none focus:border-pf-purple">
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-pf-purple"
        />
      )}
    </div>
  );
}