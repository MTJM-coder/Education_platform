import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  MapPin,
  Search,
  UserRound,
  UsersRound,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import TeacherSidebar from "../components/teacher/TeacherSidebar";

const assignments = [
  {
    id: "ASG-001",
    student: "Junior D.",
    className: "Form 4",
    subject: "Mathematics",
    location: "Bonamoussadi",
    schedule: "Mon & Wed · 16:00 - 17:30",
    rate: "3,500 FCFA / hour",
    startDate: "Sep 8, 2026",
    status: "Active",
  },
  {
    id: "ASG-002",
    student: "Sarah M.",
    className: "Class 6",
    subject: "English",
    location: "Makepe",
    schedule: "Tue & Thu · 14:00 - 15:30",
    rate: "3,000 FCFA / hour",
    startDate: "Sep 10, 2026",
    status: "Active",
  },
  {
    id: "ASG-003",
    student: "David N.",
    className: "Lower Sixth",
    subject: "Physics",
    location: "Deido",
    schedule: "Friday · 17:00 - 18:30",
    rate: "4,000 FCFA / hour",
    startDate: "Sep 15, 2026",
    status: "Active",
  },
  {
    id: "ASG-004",
    student: "Grace T.",
    className: "Form 3",
    subject: "Mathematics",
    location: "Akwa",
    schedule: "Saturday · 10:00 - 12:00",
    rate: "3,500 FCFA / hour",
    startDate: "Sep 18, 2026",
    status: "Pending",
  },
  {
    id: "ASG-005",
    student: "Michael E.",
    className: "Upper Sixth",
    subject: "Physics",
    location: "Bonapriso",
    schedule: "Wed & Sat · 16:30 - 18:00",
    rate: "4,000 FCFA / hour",
    startDate: "Aug 25, 2026",
    status: "Completed",
  },
];

const filters = ["All", "Active", "Pending", "Completed"];

export default function TeacherAssignmentsPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredAssignments = assignments.filter((assignment) => {
    const query = search.toLowerCase();

    const matchesSearch =
      assignment.student.toLowerCase().includes(query) ||
      assignment.subject.toLowerCase().includes(query) ||
      assignment.location.toLowerCase().includes(query) ||
      assignment.id.toLowerCase().includes(query);

    const matchesFilter =
      activeFilter === "All" ||
      assignment.status === activeFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#FAFAFC]">
      <TeacherSidebar activeItem="My Assignments" />

      <main className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-100 bg-white/95 px-6 backdrop-blur lg:px-8">
          <div className="ml-12 lg:ml-0">
            <p className="text-xs text-gray-400">Teacher Portal</p>

            <h1 className="text-lg font-semibold text-pf-purple-dark">
              My Assignments
            </h1>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pf-purple-light">
            <FileText className="h-4 w-4 text-pf-purple" />
          </div>
        </header>

        <div className="p-6 lg:p-8">
          {/* Intro */}
          <section className="mb-7">
            <h2 className="font-serif text-2xl font-semibold text-pf-purple-dark">
              Teaching Assignments
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage your active tutoring assignments and their details.
            </p>
          </section>

          {/* Summary */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              icon={UsersRound}
              label="Total Assignments"
              value="5"
              description="All assignments"
            />

            <SummaryCard
              icon={CheckCircle2}
              label="Active"
              value="3"
              description="Currently teaching"
            />

            <SummaryCard
              icon={Clock3}
              label="Pending"
              value="1"
              description="Awaiting activation"
            />

            <SummaryCard
              icon={BookOpen}
              label="Subjects"
              value="3"
              description="Across your assignments"
            />
          </section>

          {/* Search & filters */}
          <section className="mt-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search student, subject or assignment..."
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-pf-purple focus:bg-white"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                      activeFilter === filter
                        ? "bg-pf-purple text-white"
                        : "bg-gray-50 text-gray-500 hover:bg-pf-purple-light hover:text-pf-purple"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Assignments list */}
          <section className="mt-6 rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-4">
              <h3 className="font-semibold text-pf-purple-dark">
                Assignment List
              </h3>

              <p className="mt-0.5 text-xs text-gray-400">
                {filteredAssignments.length} assignment
                {filteredAssignments.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredAssignments.map((assignment) => (
                <AssignmentRow
                  key={assignment.id}
                  assignment={assignment}
                />
              ))}
            </div>

            {filteredAssignments.length === 0 && (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-pf-purple-light">
                  <FileText className="h-5 w-5 text-pf-purple" />
                </div>

                <h3 className="mt-4 font-semibold text-pf-purple-dark">
                  No assignments found
                </h3>

                <p className="mt-1 text-sm text-gray-400">
                  Try changing your search or filter.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

/* ---------------------------------- */
/* Assignment Row                     */
/* ---------------------------------- */

function AssignmentRow({ assignment }) {
  return (
    <div className="px-5 py-5 transition hover:bg-gray-50/60">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        {/* Student + subject */}
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pf-purple-light">
            <UserRound className="h-5 w-5 text-pf-purple" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-medium text-pf-purple-dark">
                {assignment.student}
              </h4>

              <StatusBadge status={assignment.status} />
            </div>

            <p className="mt-1 text-sm text-gray-500">
              {assignment.className} · {assignment.subject}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Assignment #{assignment.id}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="grid gap-4 sm:grid-cols-3 xl:min-w-[560px]">
          <Detail
            icon={MapPin}
            label="Location"
            value={assignment.location}
          />

          <Detail
            icon={CalendarDays}
            label="Schedule"
            value={assignment.schedule}
          />

          <Detail
            icon={CoinsIcon}
            label="Agreed Rate"
            value={assignment.rate}
          />
        </div>

        {/* Action */}
        <button
          type="button"
          className="flex w-fit items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-pf-purple transition hover:border-pf-purple/30 hover:bg-pf-purple-light"
        >
          View Details
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
        <Clock3 className="h-3.5 w-3.5" />
        Started {assignment.startDate}
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* Summary Card                       */
/* ---------------------------------- */

function SummaryCard({
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

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pf-purple-light text-pf-purple">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* Detail                             */
/* ---------------------------------- */

function Detail({ icon: Icon, label, value }) {
  return (
    <div>
      <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-gray-400">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </p>

      <p className="text-sm font-medium text-pf-purple-dark">
        {value}
      </p>
    </div>
  );
}

/* ---------------------------------- */
/* Status Badge                       */
/* ---------------------------------- */

function StatusBadge({ status }) {
  const styles = {
    Active: "bg-green-50 text-green-700",
    Pending: "bg-amber-50 text-amber-700",
    Completed: "bg-gray-100 text-gray-600",
  };

  const icons = {
    Active: CheckCircle2,
    Pending: Clock3,
    Completed: XCircle,
  };

  const Icon = icons[status] || Clock3;

  return (
    <span
      className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}

/* ---------------------------------- */
/* Coins icon                         */
/* ---------------------------------- */

function CoinsIcon(props) {
  return <span {...props}>₣</span>;
}