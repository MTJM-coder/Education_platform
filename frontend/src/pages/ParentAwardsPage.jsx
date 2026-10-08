import React, { useMemo, useState } from "react";
import {
  Award,
  Trophy,
  Medal,
  Star,
  Target,
  TrendingUp,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Search,
  Filter,
  X,
  Menu,
  CheckCircle2,
  Gift,
  GraduationCap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ParentSidebar from "../components/parent/ParentSidebar";

const childrenData = [
  {
    id: 1,
    name: "Doly Junior",
    className: "Form 4",
    level: "Secondary",
    average: 78,
  },
  {
    id: 2,
    name: "Mireille Djoumesse",
    className: "Form 5",
    level: "Secondary",
    average: 81,
  },
];

const awardsData = [
  {
    id: "AWD-001",
    childId: 1,
    child: "Doly Junior",
    title: "Most Progressive Student",
    category: "Progress",
    description:
      "Awarded for significant academic improvement during the term.",
    date: "2026-09-28",
    reason:
      "Average increased from 74% to 78% with strong improvement in Mathematics and Physics.",
    reward: "School supplies",
    status: "Received",
    icon: TrendingUp,
  },
  {
    id: "AWD-002",
    childId: 1,
    child: "Doly Junior",
    title: "Mathematics Achievement",
    category: "Academic",
    description:
      "Excellent progress and consistent performance in Mathematics.",
    date: "2026-09-15",
    reason:
      "Completed 16 out of 24 lessons and maintained strong assessment results.",
    reward: "Certificate",
    status: "Received",
    icon: BookOpen,
  },
  {
    id: "AWD-003",
    childId: 2,
    child: "Mireille Djoumesse",
    title: "Most Progressive Student",
    category: "Progress",
    description:
      "Recognized for consistent academic growth and learning commitment.",
    date: "2026-09-30",
    reason:
      "Average increased from 79% to 81% with excellent attendance.",
    reward: "School bag",
    status: "Received",
    icon: TrendingUp,
  },
  {
    id: "AWD-004",
    childId: 2,
    child: "Mireille Djoumesse",
    title: "Excellent Attendance",
    category: "Commitment",
    description:
      "Awarded for excellent attendance and punctuality in tutoring sessions.",
    date: "2026-09-20",
    reason:
      "Completed 21 of 23 scheduled tutoring sessions.",
    reward: "Certificate",
    status: "Received",
    icon: CalendarDays,
  },
  {
    id: "AWD-005",
    childId: 2,
    child: "Mireille Djoumesse",
    title: "Physics Excellence",
    category: "Academic",
    description:
      "Strong commitment and improvement in Physics.",
    date: "2026-08-25",
    reason:
      "Improved Physics performance through regular exercises and revision.",
    reward: "Learning materials",
    status: "Received",
    icon: GraduationCap,
  },
];

const upcomingAwards = [
  {
    childId: 1,
    child: "Doly Junior",
    title: "Next Progress Milestone",
    description: "Reach an average of 82% to unlock the next milestone.",
    progress: 78,
    target: 82,
  },
  {
    childId: 2,
    child: "Mireille Djoumesse",
    title: "Academic Excellence",
    description: "Reach an average of 85% to qualify.",
    progress: 81,
    target: 85,
  },
];

export default function ParentAwardsPage() {
  const navigate = useNavigate();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState("all");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedAward, setSelectedAward] = useState(null);

  const categories = [
    "All",
    ...new Set(awardsData.map((award) => award.category)),
  ];

  const filteredAwards = useMemo(() => {
    return awardsData.filter((award) => {
      const matchesChild =
        selectedChild === "all" ||
        award.childId === Number(selectedChild);

      const matchesCategory =
        category === "All" || award.category === category;

      const matchesSearch =
        award.title.toLowerCase().includes(search.toLowerCase()) ||
        award.child.toLowerCase().includes(search.toLowerCase()) ||
        award.description.toLowerCase().includes(search.toLowerCase());

      return matchesChild && matchesCategory && matchesSearch;
    });
  }, [selectedChild, category, search]);

  const receivedCount = filteredAwards.length;

  const progressAwards = filteredAwards.filter(
    (award) => award.category === "Progress"
  ).length;

  const academicAwards = filteredAwards.filter(
    (award) => award.category === "Academic"
  ).length;

  const childrenWithAwards = new Set(
    filteredAwards.map((award) => award.childId)
  ).size;

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
          fixed inset-y-0 left-0 z-50 w-72 bg-white transition-transform duration-300
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
                <p className="hidden text-sm text-gray-500 sm:block">
                  Dashboard / Awards
                </p>

                <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  Awards & Achievements
                </h1>
              </div>
            </div>

            <div className="hidden items-center gap-2 rounded-xl bg-purple-50 px-4 py-2 text-sm font-medium text-[#6D4AFF] sm:flex">
              <Trophy size={17} />
              Celebrate progress
            </div>
          </div>
        </header>

        <div className="space-y-8 p-4 sm:p-6 lg:p-8">
          {/* Hero */}
          <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
            <div className="bg-[#6D4AFF] p-6 text-white sm:p-8">
              <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                <div>
                  <div className="flex items-center gap-2 text-purple-100">
                    <Award size={20} />
                    <span className="text-sm font-medium">
                      Recognition & motivation
                    </span>
                  </div>

                  <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                    Celebrate every achievement.
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-purple-100 sm:text-base">
                    Track the awards and milestones your children have earned
                    through academic progress, commitment and consistent
                    learning.
                  </p>
                </div>

                <div className="hidden h-28 w-28 items-center justify-center rounded-full bg-white/10 lg:flex">
                  <Trophy size={58} strokeWidth={1.5} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-5 lg:grid-cols-4">
              <StatCard
                icon={Award}
                label="Awards Received"
                value={receivedCount}
              />

              <StatCard
                icon={TrendingUp}
                label="Progress Awards"
                value={progressAwards}
              />

              <StatCard
                icon={BookOpen}
                label="Academic Awards"
                value={academicAwards}
              />

              <StatCard
                icon={Star}
                label="Children Recognized"
                value={childrenWithAwards}
              />
            </div>
          </section>

          {/* Filters */}
          <section>
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 lg:flex-row">
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search awards..."
                    className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#6D4AFF]"
                  />
                </div>

                <select
                  value={selectedChild}
                  onChange={(e) => setSelectedChild(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#6D4AFF]"
                >
                  <option value="all">All Children</option>

                  {childrenData.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.name}
                    </option>
                  ))}
                </select>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#6D4AFF]"
                >
                  {categories.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Awards */}
          <section>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Achievements
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Awards earned by your children.
                </p>
              </div>

              <span className="hidden items-center gap-2 text-sm text-gray-500 sm:flex">
                <Filter size={16} />
                {filteredAwards.length} result
                {filteredAwards.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredAwards.map((award) => {
                const Icon = award.icon;

                return (
                  <AwardCard
                    key={award.id}
                    award={award}
                    onOpen={() => setSelectedAward(award)}
                  />
                );
              })}
            </div>

            {filteredAwards.length === 0 && (
              <EmptyState
                title="No awards found"
                text="Try changing your child or category filter."
              />
            )}
          </section>

          {/* Upcoming milestones */}
          <section>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Upcoming Milestones
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Goals your children are currently working toward.
              </p>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {upcomingAwards
                .filter(
                  (item) =>
                    selectedChild === "all" ||
                    item.childId === Number(selectedChild)
                )
                .map((item) => {
                  const percentage = Math.min(
                    100,
                    Math.round((item.progress / item.target) * 100)
                  );

                  return (
                    <div
                      key={item.childId}
                      className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-[#6D4AFF]">
                            <Target size={22} />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {item.title}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {item.child}
                            </p>
                          </div>
                        </div>

                        <span className="text-sm font-bold text-[#6D4AFF]">
                          {item.progress}% → {item.target}%
                        </span>
                      </div>

                      <p className="mt-4 text-sm leading-5 text-gray-500">
                        {item.description}
                      </p>

                      <div className="mt-5">
                        <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-[#6D4AFF]"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>

                        <div className="mt-2 flex justify-between text-xs text-gray-500">
                          <span>Current: {item.progress}%</span>
                          <span>Target: {item.target}%</span>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          navigate(
                            `/child-progress?learner=${item.childId}`
                          )
                        }
                        className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#6D4AFF]"
                      >
                        View Progress
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  );
                })}
            </div>
          </section>

          {/* Quick actions */}
          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-gray-900">Quick Actions</h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <QuickAction
                icon={TrendingUp}
                label="View Progress"
                onClick={() => navigate("/child-progress")}
              />

              <QuickAction
                icon={BookOpen}
                label="Learning Platform"
                onClick={() => navigate("/learning-platform")}
              />

              <QuickAction
                icon={Target}
                label="Exam Preparation"
                onClick={() =>
                  navigate("/learning-platform#exam-preparation")
                }
              />

              <QuickAction
                icon={GraduationCap}
                label="School Results"
                onClick={() => navigate("/resultats-scolaires")}
              />
            </div>
          </section>
        </div>
      </main>

      {/* Award details modal */}
      {selectedAward && (
        <AwardDetailsModal
          award={selectedAward}
          onClose={() => setSelectedAward(null)}
          onProgress={() =>
            navigate(`/child-progress?learner=${selectedAward.childId}`)
          }
        />
      )}
    </div>
  );
}

/* ================================================= */
/* Components */
/* ================================================= */

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-[#6D4AFF]">
          <Icon size={20} />
        </div>

        <span className="text-2xl font-bold text-gray-900">{value}</span>
      </div>

      <p className="mt-3 text-sm text-gray-500">{label}</p>
    </div>
  );
}

function AwardCard({ award, onOpen }) {
  const Icon = award.icon;

  const formattedDate = new Date(award.date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center justify-between bg-[#6D4AFF] px-5 py-3 text-white">
        <div className="flex items-center gap-2">
          <Trophy size={16} />
          <span className="text-xs font-semibold uppercase tracking-wide">
            {award.category}
          </span>
        </div>

        <span className="text-xs text-purple-100">{award.status}</span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-[#6D4AFF]">
            <Icon size={27} />
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-500">
            <CalendarDays size={14} />
            {formattedDate}
          </div>
        </div>

        <h3 className="mt-5 text-lg font-bold text-gray-900">
          {award.title}
        </h3>

        <p className="mt-1 text-sm font-medium text-[#6D4AFF]">
          {award.child}
        </p>

        <p className="mt-3 line-clamp-3 text-sm leading-5 text-gray-500">
          {award.description}
        </p>

        <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#F8F8FA] p-3">
          <Gift size={17} className="text-[#6D4AFF]" />

          <div>
            <p className="text-xs text-gray-500">Reward</p>
            <p className="text-sm font-semibold text-gray-800">
              {award.reward}
            </p>
          </div>
        </div>

        <button
          onClick={onOpen}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#6D4AFF] hover:text-[#6D4AFF]"
        >
          View Details
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function AwardDetailsModal({ award, onClose, onProgress }) {
  const Icon = award.icon;

  const formattedDate = new Date(award.date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-xl">
        <div className="relative bg-[#6D4AFF] p-6 text-white">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-xl p-2 text-purple-100 hover:bg-white/10"
          >
            <X size={20} />
          </button>

          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
            <Icon size={32} />
          </div>

          <p className="mt-5 text-sm text-purple-100">{award.category}</p>

          <h2 className="mt-1 text-2xl font-bold">{award.title}</h2>

          <p className="mt-1 text-sm text-purple-100">{award.child}</p>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Award Date
            </p>

            <p className="mt-1 font-semibold text-gray-900">
              {formattedDate}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Why this award was earned
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              {award.reason}
            </p>
          </div>

          <div className="rounded-2xl bg-purple-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#6D4AFF]">
                <Gift size={19} />
              </div>

              <div>
                <p className="text-xs text-gray-500">Reward</p>

                <p className="font-semibold text-gray-900">
                  {award.reward}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-green-100 bg-green-50 p-3 text-sm text-green-700">
            <CheckCircle2 size={18} />
            This achievement has been received.
          </div>

          <button
            onClick={onProgress}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6D4AFF] px-5 py-3.5 text-sm font-semibold text-white hover:bg-[#5d3de0]"
          >
            View Child Progress
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl border border-gray-100 p-4 text-left transition hover:border-purple-100 hover:bg-purple-50"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-[#6D4AFF]">
        <Icon size={19} />
      </div>

      <span className="text-sm font-semibold text-gray-700">{label}</span>

      <ChevronRight size={16} className="ml-auto text-gray-400" />
    </button>
  );
}

function EmptyState({ title, text }) {
  return (
    <div className="mt-5 rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
      <Medal className="mx-auto text-gray-300" size={42} />

      <h3 className="mt-4 font-semibold text-gray-900">{title}</h3>

      <p className="mt-1 text-sm text-gray-500">{text}</p>
    </div>
  );
}