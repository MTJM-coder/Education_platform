import { useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CirclePlay,
  ClipboardCheck,
  FileText,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Video,
  XCircle,
} from "lucide-react";
import SidebarAdmin from "../components/admin/SidebarAdmin";

const contents = [
  {
    id: 1,
    title: "Solving Quadratic Equations",
    type: "Lesson",
    subject: "Mathematics",
    level: "Secondary",
    className: "Form 3",
    teacher: "Mr. Xavier Ndi",
    status: "Published",
    date: "18 Sept. 2026",
    views: 186,
  },
  {
    id: 2,
    title: "Introduction to Electricity",
    type: "Video",
    subject: "Physics",
    level: "Secondary",
    className: "Form 2",
    teacher: "Mrs. Nfor",
    status: "Published",
    date: "17 Sept. 2026",
    views: 143,
  },
  {
    id: 3,
    title: "Algebra — Chapter 3 Quiz",
    type: "Quiz",
    subject: "Mathematics",
    level: "Secondary",
    className: "Form 3",
    teacher: "Mr. Xavier Ndi",
    status: "Pending Review",
    date: "18 Sept. 2026",
    views: 0,
  },
  {
    id: 4,
    title: "Writing a Persuasive Essay",
    type: "Document",
    subject: "English",
    level: "Secondary",
    className: "Form 2",
    teacher: "Mrs. Acha",
    status: "Published",
    date: "16 Sept. 2026",
    views: 97,
  },
  {
    id: 5,
    title: "Human Reproduction",
    type: "Lesson",
    subject: "Biology",
    level: "Secondary",
    className: "Form 4",
    teacher: "Mr. Bih",
    status: "Pending Review",
    date: "15 Sept. 2026",
    views: 0,
  },
  {
    id: 6,
    title: "French Grammar Basics",
    type: "Document",
    subject: "French",
    level: "Primary",
    className: "Class 6",
    teacher: "Mrs. Mbarga",
    status: "Draft",
    date: "14 Sept. 2026",
    views: 0,
  },
  {
    id: 7,
    title: "HTML & CSS Fundamentals",
    type: "Video",
    subject: "Computer Science",
    level: "Secondary",
    className: "Form 1",
    teacher: "Mr. Bih",
    status: "Published",
    date: "12 Sept. 2026",
    views: 211,
  },
];

const typeFilters = [
  "All",
  "Lessons",
  "Videos",
  "Quizzes",
  "Documents",
];

const statusFilters = [
  "All statuses",
  "Published",
  "Pending Review",
  "Draft",
];

export default function AdminContentPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] =
    useState("All statuses");
  const [openMenu, setOpenMenu] = useState(null);

  const filteredContent = useMemo(() => {
    const query = search.toLowerCase().trim();

    return contents.filter((item) => {
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.subject.toLowerCase().includes(query) ||
        item.teacher.toLowerCase().includes(query);

      const matchesType =
        typeFilter === "All" ||
        item.type === typeFilter.slice(0, -1);

      const matchesStatus =
        statusFilter === "All statuses" ||
        item.status === statusFilter;

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus
      );
    });
  }, [search, typeFilter, statusFilter]);

  const published = contents.filter(
    (item) => item.status === "Published"
  ).length;

  const pending = contents.filter(
    (item) => item.status === "Pending Review"
  ).length;

  const drafts = contents.filter(
    (item) => item.status === "Draft"
  ).length;

  return (
    <div className="min-h-screen bg-[#FAF9FB] font-sans text-[#302C38]">
      <SidebarAdmin activeItem="Content" />

      <main className="lg:ml-64">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-5 sm:px-8">
          <p className="hidden text-sm text-gray-500 lg:block">
            Content
          </p>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold text-pf-purple-dark">
                Super Admin
              </p>

              <p className="text-[11px] text-gray-400">
                Platform Administrator
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pf-purple text-xs font-semibold text-white">
              SA
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8">
          {/* Heading */}
          <section>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-pf-purple">
                  LEARNING CONTENT
                </p>

                <h1 className="mt-1 font-serif text-2xl font-medium text-pf-purple-dark sm:text-3xl">
                  Content Management
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-gray-500">
                  Review, organize and manage the educational
                  content available to learners.
                </p>
              </div>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-pf-purple px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-pf-purple-dark"
              >
                <Plus className="h-4 w-4" />
                Add content
              </button>
            </div>
          </section>

          {/* Statistics */}
          <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={FileText}
              label="Total content"
              value={contents.length}
            />

            <StatCard
              icon={CheckCircle2}
              label="Published"
              value={published}
            />

            <StatCard
              icon={ClipboardCheck}
              label="Pending review"
              value={pending}
            />

            <StatCard
              icon={FileText}
              label="Drafts"
              value={drafts}
            />
          </section>

          {/* Main content */}
          <section className="mt-7 rounded-2xl border border-gray-200 bg-white">
            {/* Toolbar */}
            <div className="border-b border-gray-100 p-5 sm:p-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <h2 className="font-serif text-xl text-pf-purple-dark">
                    Content library
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {filteredContent.length} item
                    {filteredContent.length !== 1
                      ? "s"
                      : ""}{" "}
                    displayed
                  </p>
                </div>

                <div className="relative w-full xl:w-80">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search content..."
                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-pf-purple focus:ring-2 focus:ring-pf-purple/10"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="mt-5 flex flex-wrap gap-2">
                {typeFilters.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setTypeFilter(type)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      typeFilter === type
                        ? "bg-pf-purple text-white"
                        : "bg-[#FAF9FB] text-gray-500 hover:bg-pf-purple-light hover:text-pf-purple"
                    }`}
                  >
                    {type}
                  </button>
                ))}

                <div className="relative ml-auto">
                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value)
                    }
                    className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-9 text-xs text-gray-600 outline-none focus:border-pf-purple"
                  >
                    {statusFilters.map((status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[1050px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#FCFBFD] text-left">
                    <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Content
                    </th>

                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Type
                    </th>

                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Subject
                    </th>

                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Level / Class
                    </th>

                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Teacher
                    </th>

                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Status
                    </th>

                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Views
                    </th>

                    <th className="px-6 py-3 text-right text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredContent.map((item) => (
                    <ContentRow
                      key={item.id}
                      item={item}
                      openMenu={openMenu}
                      setOpenMenu={setOpenMenu}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="divide-y divide-gray-100 md:hidden">
              {filteredContent.map((item) => (
                <ContentMobileCard
                  key={item.id}
                  item={item}
                  openMenu={openMenu}
                  setOpenMenu={setOpenMenu}
                />
              ))}
            </div>

            {/* Empty state */}
            {filteredContent.length === 0 && (
              <div className="py-16 text-center">
                <FileText className="mx-auto h-8 w-8 text-gray-300" />

                <h3 className="mt-4 font-serif text-lg text-pf-purple-dark">
                  No content found
                </h3>

                <p className="mt-1 text-sm text-gray-400">
                  Try changing your search or filters.
                </p>
              </div>
            )}

            {/* Footer */}
            {filteredContent.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-5 py-4 sm:px-6">
                <p className="text-xs text-gray-400">
                  Showing {filteredContent.length} of{" "}
                  {contents.length} content items
                </p>

                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-pf-purple hover:underline"
                >
                  Manage content categories
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

/* ========================================================= */
/* STAT CARD                                                   */
/* ========================================================= */

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pf-purple-light">
          <Icon className="h-5 w-5 text-pf-purple" />
        </div>

        <span className="font-serif text-2xl text-pf-purple-dark">
          {value}
        </span>
      </div>

      <p className="mt-4 text-xs text-gray-500">
        {label}
      </p>
    </div>
  );
}

/* ========================================================= */
/* CONTENT ROW                                                 */
/* ========================================================= */

function ContentRow({
  item,
  openMenu,
  setOpenMenu,
}) {
  return (
    <tr className="border-b border-gray-100 last:border-0 hover:bg-[#FCFBFD]">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <ContentIcon type={item.type} />

          <div className="min-w-0">
            <p className="max-w-[250px] truncate text-sm font-medium text-pf-purple-dark">
              {item.title}
            </p>

            <p className="mt-0.5 text-[10px] text-gray-400">
              Added {item.date}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] text-gray-600">
          {item.type}
        </span>
      </td>

      <td className="px-4 py-4">
        <span className="text-xs text-gray-600">
          {item.subject}
        </span>
      </td>

      <td className="px-4 py-4">
        <p className="text-xs text-gray-600">
          {item.level}
        </p>

        <p className="mt-0.5 text-[10px] text-gray-400">
          {item.className}
        </p>
      </td>

      <td className="px-4 py-4">
        <span className="text-xs text-gray-600">
          {item.teacher}
        </span>
      </td>

      <td className="px-4 py-4">
        <StatusBadge status={item.status} />
      </td>

      <td className="px-4 py-4 text-xs font-medium text-pf-purple-dark">
        {item.views}
      </td>

      <td className="relative px-6 py-4 text-right">
        <button
          type="button"
          onClick={() =>
            setOpenMenu(
              openMenu === item.id ? null : item.id
            )
          }
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-pf-purple"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>

        {openMenu === item.id && (
          <ActionMenu item={item} />
        )}
      </td>
    </tr>
  );
}

/* ========================================================= */
/* MOBILE CARD                                                 */
/* ========================================================= */

function ContentMobileCard({
  item,
  openMenu,
  setOpenMenu,
}) {
  return (
    <div className="relative p-5">
      <div className="flex items-start gap-3">
        <ContentIcon type={item.type} />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-pf-purple-dark">
                {item.title}
              </p>

              <p className="mt-1 text-[10px] text-gray-400">
                {item.type} · {item.subject}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setOpenMenu(
                  openMenu === item.id ? null : item.id
                )
              }
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <MiniInfo
              label="Level"
              value={item.level}
            />

            <MiniInfo
              label="Class"
              value={item.className}
            />

            <MiniInfo
              label="Teacher"
              value={item.teacher}
            />

            <MiniInfo
              label="Views"
              value={item.views}
            />
          </div>

          <div className="mt-3">
            <StatusBadge status={item.status} />
          </div>
        </div>
      </div>

      {openMenu === item.id && (
        <ActionMenu item={item} mobile />
      )}
    </div>
  );
}

/* ========================================================= */
/* CONTENT ICON                                                */
/* ========================================================= */

function ContentIcon({ type }) {
  const icons = {
    Lesson: BookOpen,
    Video: CirclePlay,
    Quiz: ClipboardCheck,
    Document: FileText,
  };

  const Icon = icons[type] || FileText;

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pf-purple-light">
      <Icon className="h-5 w-5 text-pf-purple" />
    </div>
  );
}

/* ========================================================= */
/* MINI INFO                                                    */
/* ========================================================= */

function MiniInfo({ label, value }) {
  return (
    <div className="rounded-lg bg-[#FAF9FB] p-2.5">
      <p className="text-[10px] text-gray-400">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-medium text-pf-purple-dark">
        {value}
      </p>
    </div>
  );
}

/* ========================================================= */
/* STATUS                                                       */
/* ========================================================= */

function StatusBadge({ status }) {
  const styles = {
    Published: "bg-green-50 text-green-600",
    "Pending Review": "bg-amber-50 text-amber-600",
    Draft: "bg-gray-100 text-gray-500",
  };

  const Icon =
    status === "Published"
      ? CheckCircle2
      : status === "Pending Review"
      ? ClipboardCheck
      : XCircle;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${
        styles[status] || "bg-gray-100 text-gray-500"
      }`}
    >
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}

/* ========================================================= */
/* ACTION MENU                                                 */
/* ========================================================= */

function ActionMenu({
  item,
  mobile = false,
}) {
  return (
    <div
      className={`absolute z-30 w-52 rounded-xl border border-gray-200 bg-white p-1.5 text-left shadow-lg ${
        mobile
          ? "right-5 top-16"
          : "right-6 top-12"
      }`}
    >
      <a
        href={`/admin-content/${item.id}`}
        className="flex items-center justify-between rounded-lg px-3 py-2 text-xs text-gray-600 hover:bg-pf-purple-light hover:text-pf-purple"
      >
        View content
        <ChevronRight className="h-3.5 w-3.5" />
      </a>

      {item.status === "Pending Review" && (
        <>
          <button
            type="button"
            className="w-full rounded-lg px-3 py-2 text-left text-xs text-green-600 hover:bg-green-50"
          >
            Approve content
          </button>

          <button
            type="button"
            className="w-full rounded-lg px-3 py-2 text-left text-xs text-red-500 hover:bg-red-50"
          >
            Reject content
          </button>
        </>
      )}

      <button
        type="button"
        className="w-full rounded-lg px-3 py-2 text-left text-xs text-gray-600 hover:bg-gray-50"
      >
        Edit content
      </button>

      <button
        type="button"
        className="w-full rounded-lg px-3 py-2 text-left text-xs text-red-500 hover:bg-red-50"
      >
        Delete content
      </button>
    </div>
  );
}