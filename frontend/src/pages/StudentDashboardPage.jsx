import {
  Award,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  ChevronRight,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Home,
  Library,
  Medal,
  Settings,
  Target,
  UserRound,
  UsersRound,
} from "lucide-react";

const navigation = [
  { label: "Dashboard", icon: Home },
  { label: "My Learning", icon: BookOpen, children: ["My Subjects", "Courses", "Resources"] },
  { label: "My Teachers", icon: UsersRound },
  { label: "My Schedule", icon: CalendarDays },
  { label: "Assessments", icon: ClipboardCheck },
  { label: "My Results", icon: BarChart3 },
  { label: "Exam Preparation", icon: Target },
  { label: "Progress & Achievements", icon: Award },
];

const assessments = [
  { title: "Algebra quiz", subject: "Mathematics", date: "Tomorrow", tone: "bg-[#FBF3E1] text-[#8A5A00]" },
  { title: "Essay: My future career", subject: "English", date: "Friday, 20 Sept.", tone: "bg-pf-purple-light text-pf-purple-dark" },
];

const resources = [
  { title: "Solving quadratic equations", detail: "Mathematics · PDF lesson", icon: FileText },
  { title: "Revision: Cell structure", detail: "Biology · Video", icon: Library },
];

function NavItem({ item }) {
  const Icon = item.icon;
  const active = item.label === "Dashboard";

  return (
    <div>
      <button
        type="button"
        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
          active
            ? "bg-pf-purple text-white shadow-sm"
            : "text-[#5D5A65] hover:bg-pf-purple-light hover:text-pf-purple-dark"
        }`}
      >
        <Icon className="h-[18px] w-[18px] shrink-0" />
        <span className="font-medium">{item.label}</span>
      </button>
      {item.children && (
        <div className="ml-9 mt-1 space-y-1 border-l border-gray-200 pl-3">
          {item.children.map((child) => (
            <button key={child} type="button" className="block py-1 text-left text-xs text-gray-500 hover:text-pf-purple">
              {child}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function StudentDashboardPage() {
  return (
    <div className="min-h-screen bg-[#FAF9FB] font-sans text-[#302C38]">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-gray-100 bg-white px-4 py-6 lg:flex lg:flex-col">
        <a href="/" className="flex items-center gap-2.5 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pf-purple text-white"><GraduationCap className="h-5 w-5" /></div>
          <span className="font-serif text-sm font-medium text-pf-purple-dark">The Pathfinder</span>
        </a>
        <p className="mt-8 px-2 text-[10px] font-semibold tracking-[0.16em] text-gray-400">STUDENT PORTAL</p>
        <nav className="mt-3 space-y-1.5">
          {navigation.map((item) => <NavItem key={item.label} item={item} />)}
        </nav>
        <div className="mt-auto space-y-1 border-t border-gray-100 pt-4">
          <button type="button" className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#5D5A65] hover:bg-pf-purple-light"><Bell className="h-[18px] w-[18px]" /> Notifications <span className="ml-auto rounded-full bg-pf-gold px-1.5 py-0.5 text-[10px] font-semibold text-white">3</span></button>
          <button type="button" className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#5D5A65] hover:bg-pf-purple-light"><UserRound className="h-[18px] w-[18px]" /> My Profile</button>
          <button type="button" className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#5D5A65] hover:bg-pf-purple-light"><Settings className="h-[18px] w-[18px]" /> Settings</button>
        </div>
      </aside>

      <main className="lg:ml-64">
        <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-5 sm:px-8">
          <div className="flex items-center gap-2 lg:hidden"><GraduationCap className="h-6 w-6 text-pf-purple" /><span className="font-serif text-sm text-pf-purple-dark">Student Portal</span></div>
          <p className="hidden text-sm text-gray-500 lg:block">Tuesday, 17 September 2024</p>
          <div className="flex items-center gap-3">
            <button type="button" className="relative rounded-full p-2 text-gray-500 hover:bg-gray-50"><Bell className="h-5 w-5" /><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-pf-gold" /></button>
            <div className="flex items-center gap-2 border-l border-gray-100 pl-3"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-pf-purple-light text-xs font-semibold text-pf-purple">JM</div><div className="hidden sm:block"><p className="text-xs font-medium text-pf-purple-dark">Jean M.</p><p className="text-[10px] text-gray-400">Form 4</p></div></div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8">
          

          <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric icon={BookOpen} label="Active courses" value="3" note="This term" color="text-pf-purple" />
            <Metric icon={ClipboardCheck} label="Assessments" value="2" note="Coming up" color="text-[#B47B00]" />
            <Metric icon={BarChart3} label="Average" value="14.5 / 20" note="+1.2 this month" color="text-pf-green" />
            <Metric icon={Medal} label="Class rank" value="#3" note="Most progressive" color="text-pf-purple" />
          </section>

          <section className="mt-6 grid gap-5 xl:grid-cols-[1.5fr_0.9fr]">
            <div className="rounded-2xl bg-pf-purple p-6 text-white sm:p-7">
              <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-medium tracking-wide text-purple-200">NEXT LESSON</p><h2 className="mt-2 font-serif text-2xl">Mathematics</h2><p className="mt-1 text-sm text-purple-100">Today · 16:00 – 17:30</p></div><div className="rounded-lg bg-white/15 p-3"><CalendarDays className="h-6 w-6" /></div></div>
              <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-5"><p className="text-sm text-purple-100">Teacher: <span className="font-medium text-white">Mr. Xavier Ndzi</span></p><button type="button" className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-pf-purple-dark hover:bg-purple-50">View lesson <ChevronRight className="inline h-4 w-4" /></button></div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5"><div className="flex items-center justify-between"><div><p className="text-xs font-medium text-pf-purple">OVERALL PROGRESS</p><p className="mt-1 font-serif text-2xl text-pf-purple-dark">72%</p></div><div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-pf-purple-light text-xs font-bold text-pf-purple">72%</div></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-100"><div className="h-full w-[72%] rounded-full bg-pf-purple" /></div><p className="mt-3 text-xs leading-relaxed text-gray-500">You are 8% closer to your end-of-term goal. Keep your momentum going!</p></div>
          </section>

          <section className="mt-6 grid gap-5 lg:grid-cols-2 xl:grid-cols-[1.1fr_1.1fr_0.8fr]">
            <Panel title="Upcoming assessments" action="View all"><div className="space-y-3">{assessments.map((item) => <div key={item.title} className="flex items-center gap-3 rounded-xl bg-[#FAF9FB] p-3"><div className="rounded-lg bg-white p-2 text-pf-purple shadow-sm"><ClipboardCheck className="h-4 w-4" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-pf-purple-dark">{item.title}</p><p className="mt-0.5 text-xs text-gray-500">{item.subject}</p></div><span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-medium ${item.tone}`}>{item.date}</span></div>)}</div></Panel>
            <Panel title="Recently added" action="All resources"><div className="space-y-3">{resources.map((item) => { const Icon = item.icon; return <button key={item.title} type="button" className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-[#FAF9FB]"><div className="rounded-lg bg-pf-purple-light p-2.5"><Icon className="h-4 w-4 text-pf-purple" /></div><div className="min-w-0"><p className="truncate text-sm font-medium text-pf-purple-dark">{item.title}</p><p className="mt-0.5 text-xs text-gray-500">{item.detail}</p></div></button>})}</div></Panel>
            <div className="rounded-2xl border border-[#E6DDAE] bg-[#FFFBEF] p-5"><Target className="h-5 w-5 text-[#A16C00]" /><p className="mt-3 text-xs font-semibold tracking-wide text-[#A16C00]">WEEKLY GOAL</p><h2 className="mt-1 font-serif text-lg text-pf-purple-dark">Complete 2 revision sessions</h2><p className="mt-2 text-sm text-gray-600">You have completed <b>1 of 2</b> sessions this week.</p><div className="mt-4 h-2 overflow-hidden rounded-full bg-[#F3E7BE]"><div className="h-full w-1/2 rounded-full bg-pf-gold" /></div><button type="button" className="mt-4 text-sm font-semibold text-pf-purple hover:underline">Continue revision →</button></div>
          </section>
        </div>
      </main>
    </div>
  );
}

function Metric({ icon: Icon, label, value, note, color }) {
  return <div className="rounded-xl border border-gray-200 bg-white p-4"><div className="flex items-start justify-between"><p className="text-xs text-gray-500">{label}</p><Icon className={`h-4 w-4 ${color}`} /></div><p className="mt-2 text-xl font-semibold text-pf-purple-dark">{value}</p><p className="mt-1 text-xs text-gray-400">{note}</p></div>;
}

function Panel({ title, action, children }) {
  return <section className="rounded-2xl border border-gray-200 bg-white p-5"><div className="mb-4 flex items-center justify-between"><h2 className="font-serif text-lg font-medium text-pf-purple-dark">{title}</h2><button type="button" className="text-xs font-medium text-pf-purple hover:underline">{action}</button></div>{children}</section>;
}
