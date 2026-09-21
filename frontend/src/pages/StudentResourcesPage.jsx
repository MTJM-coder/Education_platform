import { useMemo, useState } from "react";
import {
  BookOpen,
  ChevronRight,
  CirclePlay,
  Download,
  FileText,
  Filter,
  GraduationCap,
  Library,
  Search,
  ClipboardCheck,
  Dumbbell,
} from "lucide-react";
import SidebarStudent from "../components/student/SidebarStudent";

const resources = [
  {
    id: 1,
    title: "Mathematics Past Paper 2025",
    subject: "Mathematics",
    type: "Past Papers",
    format: "PDF",
    description:
      "Previous examination paper for mathematics practice.",
    date: "18 Sept. 2026",
    icon: FileText,
  },
  {
    id: 2,
    title: "Quadratic Equations - Complete Notes",
    subject: "Mathematics",
    type: "Notes",
    format: "PDF",
    description:
      "Complete lesson notes covering quadratic equations.",
    date: "16 Sept. 2026",
    icon: BookOpen,
  },
  {
    id: 3,
    title: "Electric Circuits Explained",
    subject: "Physics",
    type: "Videos",
    format: "Video",
    description:
      "A visual explanation of electric circuits and components.",
    date: "15 Sept. 2026",
    icon: CirclePlay,
  },
  {
    id: 4,
    title: "Physics Examination 2024",
    subject: "Physics",
    type: "Past Papers",
    format: "PDF",
    description:
      "Previous physics examination for revision.",
    date: "12 Sept. 2026",
    icon: FileText,
  },
  {
    id: 5,
    title: "Essay Writing Guide",
    subject: "English",
    type: "Notes",
    format: "PDF",
    description:
      "Learn how to structure and write a strong academic essay.",
    date: "10 Sept. 2026",
    icon: BookOpen,
  },
  {
    id: 6,
    title: "HTML & CSS Practice",
    subject: "Computer Science",
    type: "Exercises",
    format: "Exercise",
    description:
      "Practice exercises covering the basics of HTML and CSS.",
    date: "8 Sept. 2026",
    icon: Dumbbell,
  },
  {
    id: 7,
    title: "Algebra Chapter 3 Quiz",
    subject: "Mathematics",
    type: "Quizzes",
    format: "Quiz",
    description:
      "Test your understanding of algebraic expressions.",
    date: "6 Sept. 2026",
    icon: ClipboardCheck,
  },
];

const resourceTypes = [
  "All",
  "Past Papers",
  "Notes",
  "Exercises",
  "Quizzes",
  "Videos",
];

const subjects = [
  "All Subjects",
  "Mathematics",
  "Physics",
  "English",
  "Computer Science",
];

export default function StudentResourcesPage() {
  const [type, setType] = useState("All");
  const [subject, setSubject] = useState("All Subjects");
  const [search, setSearch] = useState("");

  const filteredResources = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return resources.filter((resource) => {
      const matchesType =
        type === "All" || resource.type === type;

      const matchesSubject =
        subject === "All Subjects" ||
        resource.subject === subject;

      const matchesSearch =
        !searchValue ||
        resource.title.toLowerCase().includes(searchValue) ||
        resource.subject.toLowerCase().includes(searchValue) ||
        resource.type.toLowerCase().includes(searchValue);

      return (
        matchesType &&
        matchesSubject &&
        matchesSearch
      );
    });
  }, [type, subject, search]);

  return (
    <div className="min-h-screen bg-[#FAF9FB] font-sans text-[#302C38]">
      <SidebarStudent activeItem="My Learning" />

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
            Learning Resources
          </p>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pf-purple-light text-xs font-semibold text-pf-purple">
            JM
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8">
          {/* Page introduction */}
          <section>
            <p className="text-sm font-medium text-pf-purple">
              LEARNING LIBRARY
            </p>

            <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="font-serif text-2xl font-medium text-pf-purple-dark sm:text-3xl">
                  Resources
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                  Explore past papers, notes, exercises, quizzes and
                  other learning materials to improve your knowledge.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-pf-purple-light px-3 py-2 text-xs font-medium text-pf-purple">
                <Library className="h-4 w-4" />
                {filteredResources.length} resources
              </div>
            </div>
          </section>

          {/* Search and filters */}
          <section className="mt-7 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Search */}
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search resources..."
                  aria-label="Search resources"
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-pf-purple focus:ring-2 focus:ring-pf-purple/10"
                />
              </div>

              {/* Subject filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />

                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-600 outline-none focus:border-pf-purple"
                >
                  {subjects.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Resource type filters */}
            <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
              {resourceTypes.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setType(item)}
                  className={`whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-medium transition ${
                    type === item
                      ? "bg-pf-purple text-white"
                      : "bg-[#FAF9FB] text-gray-500 hover:bg-pf-purple-light hover:text-pf-purple"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>

          {/* Resources */}
          <section className="mt-7">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl text-pf-purple-dark">
                  Available Resources
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Materials available for your level and subjects.
                </p>
              </div>
            </div>

            {filteredResources.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredResources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-200 bg-white py-14 text-center">
                <Library className="mx-auto h-8 w-8 text-gray-300" />

                <h3 className="mt-3 text-sm font-medium text-gray-600">
                  No resources found
                </h3>

                <p className="mt-1 text-xs text-gray-400">
                  Try another search or change your filters.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setType("All");
                    setSubject("All Subjects");
                  }}
                  className="mt-4 text-xs font-semibold text-pf-purple hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </section>

          {/* Learning tip */}
          <section className="mt-8 rounded-2xl bg-pf-purple p-5 text-white sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium tracking-wide text-purple-200">
                  STUDY TIP
                </p>

                <h2 className="mt-1 font-serif text-xl">
                  Practice with past papers
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-purple-100">
                  Use previous examination papers to test your
                  knowledge and become familiar with the structure
                  of real exams.
                </p>
              </div>

              <a
                href="#past-papers"
                onClick={() => setType("Past Papers")}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-semibold text-pf-purple transition hover:bg-gray-100"
              >
                View past papers
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* ========================================================= */
/* RESOURCE CARD                                               */
/* ========================================================= */

function ResourceCard({ resource }) {
  const Icon = resource.icon;

  return (
    <article className="group rounded-2xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-sm">
      {/* Top */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pf-purple-light">
          <Icon className="h-5 w-5 text-pf-purple" />
        </div>

        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-medium text-gray-500">
          {resource.format}
        </span>
      </div>

      {/* Content */}
      <div className="mt-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-pf-purple">
            {resource.type}
          </span>
        </div>

        <h3 className="mt-1.5 line-clamp-2 font-serif text-lg font-medium text-pf-purple-dark">
          {resource.title}
        </h3>

        <p className="mt-1 text-xs font-medium text-gray-500">
          {resource.subject}
        </p>

        <p className="mt-3 line-clamp-2 text-xs leading-5 text-gray-500">
          {resource.description}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
        <span className="text-[10px] text-gray-400">
          {resource.date}
        </span>

        <div className="flex gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-pf-purple-dark transition hover:bg-gray-50"
          >
            View
            <ChevronRight className="h-3.5 w-3.5" />
          </button>

          {resource.format === "PDF" && (
            <button
              type="button"
              aria-label={`Download ${resource.title}`}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-pf-purple text-white transition hover:bg-pf-purple-dark"
            >
              <Download className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}