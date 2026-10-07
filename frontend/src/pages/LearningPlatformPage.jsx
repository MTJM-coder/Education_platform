import React, { useMemo, useState } from "react";
import {
  Search,
  BookOpen,
  PlayCircle,
  FileText,
  ClipboardCheck,
  Clock3,
  ChevronRight,
  GraduationCap,
  Target,
  Award,
  TrendingUp,
  X,
  CheckCircle2,
  UsersRound,
  Menu,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ParentSidebar from "../components/parent/ParentSidebar";

const childrenData = [
  {
    id: 1,
    name: "Doly Junior",
    level: "Secondary",
    className: "Form 4",
  },
  {
    id: 2,
    name: "Mireille Djoumesse",
    level: "Secondary",
    className: "Form 5",
  },
];

const coursesData = [
  {
    id: "MAT-001",
    title: "Mathematics Mastery",
    subject: "Mathematics",
    teacher: "Xavier Ndi",
    progress: 68,
    lessons: 24,
    completedLessons: 16,
    duration: "12h",
    level: "Intermediate",
    enrolled: 120,
    description:
      "Strengthen algebra, geometry, equations and problem-solving skills.",
    color: "purple",
    children: [1, 2],
  },
  {
    id: "PHY-001",
    title: "Physics Fundamentals",
    subject: "Physics",
    teacher: "Nfor Grace",
    progress: 42,
    lessons: 18,
    completedLessons: 8,
    duration: "10h",
    level: "Intermediate",
    enrolled: 86,
    description:
      "Understand mechanics, electricity, energy and fundamental physics concepts.",
    color: "blue",
    children: [1, 2],
  },
  {
    id: "ENG-001",
    title: "English Communication",
    subject: "English",
    teacher: "Acha Mireille",
    progress: 84,
    lessons: 20,
    completedLessons: 17,
    duration: "8h",
    level: "Intermediate",
    enrolled: 94,
    description:
      "Improve grammar, vocabulary, reading comprehension and communication.",
    color: "green",
    children: [1],
  },
  {
    id: "CSC-001",
    title: "Computer Science Basics",
    subject: "Computer Science",
    teacher: "Bih Patrick",
    progress: 56,
    lessons: 16,
    completedLessons: 9,
    duration: "7h",
    level: "Beginner",
    enrolled: 73,
    description:
      "Learn programming fundamentals, algorithms and computer concepts.",
    color: "orange",
    children: [1, 2],
  },
  {
    id: "FRE-001",
    title: "French Essentials",
    subject: "French",
    teacher: "Ngoe Laure",
    progress: 32,
    lessons: 15,
    completedLessons: 5,
    duration: "6h",
    level: "Beginner",
    enrolled: 61,
    description:
      "Build vocabulary, grammar and written French skills step by step.",
    color: "pink",
    children: [2],
  },
];

const resourcesData = [
  {
    id: "RES-001",
    title: "Algebra — Equations and Inequalities",
    subject: "Mathematics",
    type: "video",
    duration: "18 min",
    course: "MAT-001",
  },
  {
    id: "RES-002",
    title: "Physics Formula Sheet",
    subject: "Physics",
    type: "pdf",
    duration: "8 pages",
    course: "PHY-001",
  },
  {
    id: "RES-003",
    title: "English Grammar Quiz",
    subject: "English",
    type: "quiz",
    duration: "15 questions",
    course: "ENG-001",
  },
  {
    id: "RES-004",
    title: "Introduction to Algorithms",
    subject: "Computer Science",
    type: "video",
    duration: "24 min",
    course: "CSC-001",
  },
];

const modulesData = [
  "Introduction",
  "Core Concepts",
  "Practice Exercises",
  "Quiz & Assessment",
  "Revision",
];

const getResourceIcon = (type) => {
  if (type === "video") return PlayCircle;
  if (type === "pdf") return FileText;
  return ClipboardCheck;
};

const getColorClasses = (color) => {
  const colors = {
    purple: "bg-purple-50 text-purple-600",
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    pink: "bg-pink-50 text-pink-600",
  };

  return colors[color] || colors.purple;
};

export default function LearningPlatformPage() {
  const navigate = useNavigate();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState(1);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("All");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);

  const subjects = [
    "All",
    ...new Set(coursesData.map((course) => course.subject)),
  ];

  const childCourses = useMemo(() => {
    return coursesData.filter((course) =>
      course.children.includes(Number(selectedChild))
    );
  }, [selectedChild]);

  const filteredCourses = useMemo(() => {
    return childCourses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.subject.toLowerCase().includes(search.toLowerCase()) ||
        course.teacher.toLowerCase().includes(search.toLowerCase());

      const matchesSubject =
        subjectFilter === "All" || course.subject === subjectFilter;

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "In Progress" &&
          course.progress > 0 &&
          course.progress < 100) ||
        (statusFilter === "Completed" && course.progress === 100);

      const matchesTab =
        activeTab === "All" ||
        (activeTab === "In Progress" &&
          course.progress > 0 &&
          course.progress < 100) ||
        (activeTab === "Completed" && course.progress === 100);

      return (
        matchesSearch &&
        matchesSubject &&
        matchesStatus &&
        matchesTab
      );
    });
  }, [
    childCourses,
    search,
    subjectFilter,
    statusFilter,
    activeTab,
  ]);

  const continueCourse = useMemo(() => {
    return [...childCourses]
      .filter((course) => course.progress < 100)
      .sort((a, b) => b.progress - a.progress)[0];
  }, [childCourses]);

  const totalCourses = childCourses.length;

  const completedCourses = childCourses.filter(
    (course) => course.progress === 100
  ).length;

  const inProgressCourses = childCourses.filter(
    (course) => course.progress > 0 && course.progress < 100
  ).length;

  const learningHours = childCourses.reduce((total, course) => {
    return total + parseFloat(course.duration);
  }, 0);

  const scrollToExamPreparation = () => {
    document
      .getElementById("exam-preparation")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F8F8FA]">
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-72 transform bg-white transition-transform duration-300
          lg:translate-x-0
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <ParentSidebar />

        <button
          onClick={() => setMobileSidebarOpen(false)}
          className="absolute right-3 top-3 rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main */}
      <main className="lg:ml-72">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="rounded-xl border border-gray-200 p-2 lg:hidden"
              >
                <Menu size={20} />
              </button>

              <div>
                <div className="hidden text-sm text-gray-500 sm:block">
                  Dashboard / Learning Platform
                </div>

                <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  Learning Platform
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="hidden text-sm font-medium text-gray-600 sm:block">
                Learning for
              </label>

              <select
                value={selectedChild}
                onChange={(e) => setSelectedChild(Number(e.target.value))}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium outline-none focus:border-[#6D4AFF]"
              >
                {childrenData.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>

        <div className="space-y-8 p-4 sm:p-6 lg:p-8">
          {/* Hero */}
          <section className="overflow-hidden rounded-3xl bg-[#6D4AFF] p-6 text-white shadow-sm sm:p-8">
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <div className="mb-3 flex items-center gap-2 text-purple-100">
                  <Sparkles size={18} />
                  <span className="text-sm font-medium">
                    Personalized learning
                  </span>
                </div>

                <h2 className="text-2xl font-bold sm:text-3xl">
                  Help {childrenData.find((c) => c.id === selectedChild)?.name}{" "}
                  learn better.
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-purple-100 sm:text-base">
                  Access courses, videos, documents, quizzes and revision
                  resources in one place.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() =>
                      continueCourse && setSelectedCourse(continueCourse)
                    }
                    className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#6D4AFF] transition hover:bg-purple-50"
                  >
                    Continue Learning
                  </button>

                  <button
                    onClick={scrollToExamPreparation}
                    className="rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                  >
                    Exam Preparation
                  </button>
                </div>
              </div>

              <div className="hidden h-36 w-36 items-center justify-center rounded-full bg-white/10 lg:flex">
                <GraduationCap size={72} strokeWidth={1.5} />
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            <StatCard
              icon={BookOpen}
              label="My Courses"
              value={totalCourses}
            />

            <StatCard
              icon={TrendingUp}
              label="In Progress"
              value={inProgressCourses}
            />

            <StatCard
              icon={CheckCircle2}
              label="Completed"
              value={completedCourses}
            />

            <StatCard
              icon={Clock3}
              label="Learning Hours"
              value={`${learningHours}h`}
            />
          </section>

          {/* Continue Learning */}
          {continueCourse && (
            <section>
              <SectionTitle
                title="Continue Learning"
                subtitle="Pick up where you left off."
              />

              <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-5 md:flex-row md:items-center">
                  <div
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${getColorClasses(
                      continueCourse.color
                    )}`}
                  >
                    <BookOpen size={28} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-[#6D4AFF]">
                        {continueCourse.subject}
                      </span>

                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                        {continueCourse.level}
                      </span>
                    </div>

                    <h3 className="mt-1 text-lg font-bold text-gray-900">
                      {continueCourse.title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      with {continueCourse.teacher}
                    </p>

                    <div className="mt-4 flex items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-[#6D4AFF]"
                          style={{
                            width: `${continueCourse.progress}%`,
                          }}
                        />
                      </div>

                      <span className="text-sm font-semibold text-gray-700">
                        {continueCourse.progress}%
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedCourse(continueCourse)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D4AFF] px-5 py-3 text-sm font-semibold text-white hover:bg-[#5d3de0]"
                  >
                    Continue
                    <ChevronRight size={17} />
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Courses */}
          <section>
            <SectionTitle
              title="My Courses"
              subtitle="Courses available for this learner."
            />

            {/* Filters */}
            <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 xl:flex-row">
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search courses, subjects or teachers..."
                    className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#6D4AFF]"
                  />
                </div>

                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#6D4AFF]"
                >
                  {subjects.map((subject) => (
                    <option key={subject}>{subject}</option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#6D4AFF]"
                >
                  <option>All</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {["All", "In Progress", "Completed"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      activeTab === tab
                        ? "bg-[#6D4AFF] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Course grid */}
            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onOpen={() => setSelectedCourse(course)}
                />
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <EmptyState
                title="No courses found"
                text="Try another search or change your filters."
              />
            )}
          </section>

          {/* Resources */}
          <section>
            <SectionTitle
              title="Learning Resources"
              subtitle="Videos, documents and quizzes."
            />

            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {resourcesData.map((resource) => {
                const Icon = getResourceIcon(resource.type);

                return (
                  <button
                    key={resource.id}
                    onClick={() => setSelectedResource(resource)}
                    className="group rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-purple-100 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-[#6D4AFF]">
                        <Icon size={21} />
                      </div>

                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs capitalize text-gray-500">
                        {resource.type}
                      </span>
                    </div>

                    <h3 className="mt-4 line-clamp-2 font-semibold text-gray-900">
                      {resource.title}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      {resource.subject}
                    </p>

                    <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                      <span>{resource.duration}</span>

                      <span className="flex items-center gap-1 font-medium text-[#6D4AFF]">
                        Open
                        <ChevronRight size={14} />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Exam Preparation */}
          <section
            id="exam-preparation"
            className="scroll-mt-24 rounded-3xl border border-purple-100 bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <div className="flex items-center gap-2 text-[#6D4AFF]">
                  <Target size={20} />
                  <span className="text-sm font-semibold">
                    Exam Preparation
                  </span>
                </div>

                <h2 className="mt-2 text-2xl font-bold text-gray-900">
                  Prepare for upcoming exams
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                  Revision courses, practice questions, mock exams and
                  performance tracking to help your child prepare effectively.
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedCourse({
                    id: "EXAM-001",
                    title: "Exam Preparation",
                    subject: "Exam Preparation",
                    teacher: "Learning Team",
                    progress: 25,
                    lessons: 30,
                    completedLessons: 8,
                    duration: "15h",
                    level: "All Levels",
                    enrolled: 0,
                    description:
                      "Revision plans, practice questions and mock examinations.",
                    color: "purple",
                    children: [1, 2],
                  })
                }
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#6D4AFF] px-5 py-3 text-sm font-semibold text-white hover:bg-[#5d3de0]"
              >
                Start Preparation
                <ChevronRight size={17} />
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <ExamFeature
                icon={BookOpen}
                title="Revision Courses"
                text="Structured revision content."
              />

              <ExamFeature
                icon={ClipboardCheck}
                title="Practice Tests"
                text="Train with exam-style questions."
              />

              <ExamFeature
                icon={Award}
                title="Track Progress"
                text="Monitor preparation and results."
              />
            </div>
          </section>
        </div>
      </main>

      {/* Course modal */}
      {selectedCourse && (
        <CourseModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onContinue={() => {
            setSelectedCourse(null);
            alert(
              `Opening "${selectedCourse.title}". This will later connect to the Learning Platform backend.`
            );
          }}
        />
      )}

      {/* Resource modal */}
      {selectedResource && (
        <ResourceModal
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------- */
/* Components */
/* -------------------------------------------------- */

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-[#6D4AFF]">
          <Icon size={21} />
        </div>

        <span className="text-2xl font-bold text-gray-900">{value}</span>
      </div>

      <p className="mt-4 text-sm text-gray-500">{label}</p>
    </div>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
    </div>
  );
}

function CourseCard({ course, onOpen }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className={`h-2 ${getColorClasses(course.color)}`} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${getColorClasses(
              course.color
            )}`}
          >
            <BookOpen size={23} />
          </div>

          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
            {course.level}
          </span>
        </div>

        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[#6D4AFF]">
          {course.subject}
        </p>

        <h3 className="mt-1 min-h-[48px] text-lg font-bold text-gray-900">
          {course.title}
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          Teacher: {course.teacher}
        </p>

        <p className="mt-3 line-clamp-2 text-sm leading-5 text-gray-500">
          {course.description}
        </p>

        <div className="mt-5 flex items-center justify-between text-xs text-gray-500">
          <span>{course.lessons} lessons</span>
          <span>{course.duration}</span>
          <span className="flex items-center gap-1">
            <UsersRound size={13} />
            {course.enrolled}
          </span>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-gray-500">Progress</span>
            <span className="font-semibold text-gray-700">
              {course.progress}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-[#6D4AFF]"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>

        <button
          onClick={onOpen}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#6D4AFF] hover:text-[#6D4AFF]"
        >
          View Course
          <ChevronRight size={17} />
        </button>
      </div>
    </div>
  );
}

function ExamFeature({ icon: Icon, title, text }) {
  return (
    <div className="rounded-2xl bg-[#F8F8FA] p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-[#6D4AFF]">
        <Icon size={19} />
      </div>

      <h3 className="mt-3 font-semibold text-gray-900">{title}</h3>

      <p className="mt-1 text-sm text-gray-500">{text}</p>
    </div>
  );
}

function EmptyState({ title, text }) {
  return (
    <div className="mt-5 rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
      <BookOpen className="mx-auto text-gray-300" size={42} />

      <h3 className="mt-4 font-semibold text-gray-900">{title}</h3>

      <p className="mt-1 text-sm text-gray-500">{text}</p>
    </div>
  );
}

function CourseModal({ course, onClose, onContinue }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-gray-100 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#6D4AFF]">
              {course.subject}
            </p>

            <h2 className="mt-1 text-2xl font-bold text-gray-900">
              {course.title}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {course.description}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <InfoItem label="Teacher" value={course.teacher} />
            <InfoItem label="Lessons" value={course.lessons} />
            <InfoItem label="Duration" value={course.duration} />
            <InfoItem label="Level" value={course.level} />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Course Progress
              </span>

              <span className="text-sm font-bold text-[#6D4AFF]">
                {course.progress}%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-[#6D4AFF]"
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">Course Modules</h3>

            <div className="mt-3 space-y-2">
              {modulesData.map((module, index) => (
                <div
                  key={module}
                  className="flex items-center gap-3 rounded-xl border border-gray-100 p-3"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-sm font-semibold text-[#6D4AFF]">
                    {index + 1}
                  </div>

                  <span className="text-sm font-medium text-gray-700">
                    {module}
                  </span>

                  {index < Math.floor(course.progress / 20) && (
                    <CheckCircle2
                      size={17}
                      className="ml-auto text-green-500"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onContinue}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6D4AFF] px-5 py-3.5 text-sm font-semibold text-white hover:bg-[#5d3de0]"
          >
            <PlayCircle size={18} />
            Continue Learning
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="rounded-xl bg-[#F8F8FA] p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}

function ResourceModal({ resource, onClose }) {
  const Icon = getResourceIcon(resource.type);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-[#6D4AFF]">
              <Icon size={23} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase text-[#6D4AFF]">
                {resource.type}
              </p>

              <h2 className="mt-1 font-bold text-gray-900">
                {resource.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-gray-400 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 rounded-2xl bg-[#F8F8FA] p-4">
          <p className="text-sm text-gray-500">Subject</p>
          <p className="mt-1 font-semibold text-gray-900">
            {resource.subject}
          </p>

          <p className="mt-4 text-sm text-gray-500">Duration / size</p>
          <p className="mt-1 font-semibold text-gray-900">
            {resource.duration}
          </p>
        </div>

        <button
          onClick={() =>
            alert(
              `"${resource.title}" will open here once the Learning Platform backend/resource URL is connected.`
            )
          }
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6D4AFF] px-5 py-3.5 text-sm font-semibold text-white hover:bg-[#5d3de0]"
        >
          <Icon size={18} />
          Open Resource
        </button>
      </div>
    </div>
  );
}