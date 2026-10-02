import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  MapPin,
  Search,
  UserRound,
  UsersRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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

function getUserName(user) {
  if (!user) return null;
  if (user.name) return user.name;
  const full = [user.first_name, user.last_name].filter(Boolean).join(" ");
  return full || null;
}

// Un learner de type "child" n'a peut-être pas de user : on retombe sur le parent.
function getLearnerName(learner) {
  const own = getUserName(learner?.user);
  if (own) return own;

  const parent = getUserName(learner?.parent_profile?.user);
  if (parent) return `Child of ${parent}`;

  return "Student";
}

function sessionStart(session) {
  const date = String(session.session_date ?? "").slice(0, 10);
  const time = String(session.start_time ?? "00:00:00").slice(0, 8);
  const value = new Date(`${date}T${time}`);
  return Number.isNaN(value.getTime()) ? null : value;
}

function formatLesson(date) {
  if (!date) return null;

  const now = new Date();
  const startOfDay = (d) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round(
    (startOfDay(date) - startOfDay(now)) / 86400000
  );

  const time = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (diffDays === 0) return `Today, ${time}`;
  if (diffDays === 1) return `Tomorrow, ${time}`;

  const day = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
  return `${day}, ${time}`;
}

/* ========================================================= */
/* PAGE                                                        */
/* ========================================================= */

export default function TeacherStudentsPage() {
  const [search, setSearch] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [assignmentsRes, sessionsRes] = await Promise.all([
          apiFetch("/me/assignments"),
          apiFetch("/me/sessions?upcoming=1"),
        ]);

        if (cancelled) return;
        setAssignments(toList(assignmentsRes));
        setSessions(toList(sessionsRes));
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Unable to load your students.");
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

  // Prochaine séance par learner (les séances arrivent déjà filtrées "upcoming").
  const nextLessonByLearner = useMemo(() => {
    const map = new Map();

    sessions.forEach((session) => {
      const learnerId = session.assignment?.tutoring_request?.learner?.id;
      const start = sessionStart(session);
      if (!learnerId || !start) return;

      const current = map.get(learnerId);
      if (!current || start < current) map.set(learnerId, start);
    });

    return map;
  }, [sessions]);

  // Un élève = un learner, avec toutes les matières de ses affectations actives.
  const students = useMemo(() => {
    const map = new Map();

    assignments
      .filter((assignment) => assignment.status === "active")
      .forEach((assignment) => {
        const request = assignment.tutoring_request;
        const learner = request?.learner;
        if (!learner) return;

        if (!map.has(learner.id)) {
          map.set(learner.id, {
            id: learner.id,
            name: getLearnerName(learner),
            className:
              learner.classroom?.name ?? learner.level?.name ?? null,
            school: learner.school_name ?? null,
            location: learner.location ?? request.location ?? null,
            subjects: [],
            nextLesson: nextLessonByLearner.get(learner.id) ?? null,
          });
        }

        const subjectName = request.subject?.name;
        const student = map.get(learner.id);
        if (subjectName && !student.subjects.includes(subjectName)) {
          student.subjects.push(subjectName);
        }
      });

    return Array.from(map.values());
  }, [assignments, nextLessonByLearner]);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return students;

    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(query) ||
        (student.className ?? "").toLowerCase().includes(query) ||
        student.subjects.some((subject) =>
          subject.toLowerCase().includes(query)
        )
    );
  }, [students, search]);

  const subjectCount = useMemo(
    () => new Set(students.flatMap((student) => student.subjects)).size,
    [students]
  );

  // Séances dans les 7 prochains jours (la liste est déjà "à venir").
  const lessonsNext7Days = useMemo(() => {
    const limit = new Date();
    limit.setDate(limit.getDate() + 7);

    return sessions.filter((session) => {
      const start = sessionStart(session);
      return start && start <= limit;
    }).length;
  }, [sessions]);

  return (
    <div className="min-h-screen bg-[#FAFAFC]">
      <TeacherSidebar activeItem="My Students" />

      <main className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-100 bg-white/95 px-6 backdrop-blur lg:px-8">
          <div className="ml-12 lg:ml-0">
            <p className="text-xs text-gray-400">Teacher Portal</p>

            <h1 className="text-lg font-semibold text-pf-purple-dark">
              My Students
            </h1>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pf-purple-light">
            <UsersRound className="h-4 w-4 text-pf-purple" />
          </div>
        </header>

        <div className="p-6 lg:p-8">
          {/* Intro */}
          <section className="mb-7">
            <h2 className="font-serif text-2xl font-semibold text-pf-purple-dark">
              Your Students
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              The students assigned to you and their next lesson.
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

          {/* Summary cards */}
          <section className="grid gap-4 sm:grid-cols-3">
            <SummaryCard
              icon={UsersRound}
              label="Total Students"
              value={loading ? "—" : students.length}
              description="Currently assigned"
            />

            <SummaryCard
              icon={BookOpen}
              label="Subjects"
              value={loading ? "—" : subjectCount}
              description="Currently teaching"
            />

            <SummaryCard
              icon={CalendarDays}
              label="Next 7 Days"
              value={loading ? "—" : lessonsNext7Days}
              description="Scheduled lessons"
            />
          </section>

          {/* Search */}
          <section className="mt-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                placeholder="Search student, class or subject..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-pf-purple focus:bg-white"
              />
            </div>
          </section>

          {/* Students */}
          <section className="mt-6 rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <h3 className="font-semibold text-pf-purple-dark">
                  Assigned Students
                </h3>

                <p className="mt-0.5 text-xs text-gray-400">
                  {filteredStudents.length} student
                  {filteredStudents.length !== 1 ? "s" : ""} displayed
                </p>
              </div>
            </div>

            {loading && (
              <p className="px-6 py-10 text-center text-sm text-gray-400">
                Loading your students…
              </p>
            )}

            {/* Desktop table */}
            {!loading && filteredStudents.length > 0 && (
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 text-left">
                      <Th>Student</Th>
                      <Th>Subjects</Th>
                      <Th>Next Lesson</Th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredStudents.map((student) => (
                      <tr
                        key={student.id}
                        className="transition hover:bg-gray-50/70"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pf-purple-light">
                              <UserRound className="h-5 w-5 text-pf-purple" />
                            </div>

                            <div>
                              <p className="font-medium text-pf-purple-dark">
                                {student.name}
                              </p>

                              {student.className && (
                                <p className="mt-0.5 text-xs text-gray-400">
                                  {student.className}
                                </p>
                              )}

                              {student.school && (
                                <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                                  <GraduationCap className="h-3 w-3" />
                                  {student.school}
                                </p>
                              )}

                              {student.location && (
                                <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                                  <MapPin className="h-3 w-3" />
                                  {student.location}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <SubjectTags subjects={student.subjects} />
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <CalendarDays className="h-4 w-4 text-pf-purple" />
                            {formatLesson(student.nextLesson) ??
                              "No lesson scheduled"}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Mobile cards */}
            {!loading && filteredStudents.length > 0 && (
              <div className="divide-y divide-gray-100 md:hidden">
                {filteredStudents.map((student) => (
                  <div key={student.id} className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pf-purple-light">
                        <UserRound className="h-5 w-5 text-pf-purple" />
                      </div>

                      <div>
                        <p className="font-medium text-pf-purple-dark">
                          {student.name}
                        </p>

                        {student.className && (
                          <p className="text-xs text-gray-400">
                            {student.className}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4">
                      <SubjectTags subjects={student.subjects} />
                    </div>

                    <div className="mt-4 flex flex-col gap-2 text-xs text-gray-400">
                      {student.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-pf-purple" />
                          {student.location}
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-3.5 w-3.5 text-pf-purple" />
                        Next lesson:{" "}
                        {formatLesson(student.nextLesson) ?? "none scheduled"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && filteredStudents.length === 0 && (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-pf-purple-light">
                  <UsersRound className="h-5 w-5 text-pf-purple" />
                </div>

                <h3 className="mt-4 font-semibold text-pf-purple-dark">
                  {students.length === 0
                    ? "No students assigned yet"
                    : "No students found"}
                </h3>

                <p className="mt-1 text-sm text-gray-400">
                  {students.length === 0
                    ? "Students appear here once an assignment is validated."
                    : "Try changing your search."}
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

/* ========================================================= */
/* SMALL COMPONENTS                                            */
/* ========================================================= */

function SummaryCard({ icon: Icon, label, value, description }) {
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

function Th({ children }) {
  return (
    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
      {children}
    </th>
  );
}

function SubjectTags({ subjects }) {
  if (subjects.length === 0) {
    return <span className="text-xs text-gray-400">—</span>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {subjects.map((subject) => (
        <span
          key={subject}
          className="rounded-full bg-pf-purple-light px-2.5 py-1 text-xs font-medium text-pf-purple"
        >
          {subject}
        </span>
      ))}
    </div>
  );
}