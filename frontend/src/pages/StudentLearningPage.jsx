import { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  CirclePlay,
  ClipboardCheck,
  FileText,
  Filter,
  GraduationCap,
  Library,
  Search,
} from "lucide-react";
import SidebarStudent from "../components/student/SidebarStudent";

const subjects = [
  { name: "Mathematics", teacher: "Mr. Xavier Ndzi", progress: 78, color: "bg-pf-purple", next: "Algebra · Today, 16:00", lessons: 18, done: 14 },
  { name: "Physics", teacher: "Mrs. Nfor", progress: 64, color: "bg-pf-blue", next: "Electricity · Thursday", lessons: 14, done: 9 },
  { name: "English", teacher: "Mrs. Acha", progress: 85, color: "bg-pf-green", next: "Essay writing · Friday", lessons: 20, done: 17 },
  { name: "Computer Science", teacher: "Mr. Bih", progress: 72, color: "bg-[#C47725]", next: "HTML & CSS · Next Monday", lessons: 16, done: 12 },
];

const content = [
  { type: "Lesson", title: "Solving quadratic equations", subject: "Mathematics", detail: "45 min · Added today", icon: BookOpen, kind: "Lessons" },
  { type: "Video", title: "The complete guide to the cell", subject: "Physics", detail: "18 min · Added yesterday", icon: CirclePlay, kind: "Videos" },
  { type: "Quiz", title: "Algebra: Chapter 3", subject: "Mathematics", detail: "10 questions · Due tomorrow", icon: ClipboardCheck, kind: "Quizzes" },
  { type: "Document", title: "Writing a persuasive essay", subject: "English", detail: "PDF · Added 16 Sept.", icon: FileText, kind: "Documents" },
];

const filters = ["All", "Lessons", "Exercises", "Quizzes", "Videos", "Documents"];

export default function StudentLearningPage() {
  const [filter, setFilter] = useState("All");
  const shownContent = filter === "All" ? content : content.filter((item) => item.kind === filter);

  return <div className="min-h-screen bg-[#FAF9FB] font-sans text-[#302C38]">
    <SidebarStudent activeItem="My Learning" />
    <main className="lg:ml-64">
      <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-5 sm:px-8"><div className="flex items-center gap-2 lg:hidden"><GraduationCap className="h-6 w-6 text-pf-purple" /><span className="font-serif text-sm text-pf-purple-dark">Student Portal</span></div><p className="hidden text-sm text-gray-500 lg:block">My Learning</p><div className="flex h-8 w-8 items-center justify-center rounded-full bg-pf-purple-light text-xs font-semibold text-pf-purple">JM</div></header>
      <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8">
        <section className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-medium text-pf-purple">LEARNING SPACE</p><h1 className="mt-1 font-serif text-2xl font-medium text-pf-purple-dark sm:text-3xl">My Learning</h1><p className="mt-2 text-sm text-gray-500">Continue learning at your own pace and track every achievement.</p></div><button type="button" className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-pf-purple-dark hover:bg-gray-50"><Library className="h-4 w-4 text-pf-purple" /> Browse all resources</button></section>

        <section className="mt-7"><div className="mb-3 flex items-center justify-between"><h2 className="font-serif text-xl text-pf-purple-dark">My Subjects</h2><span className="text-xs text-gray-400">4 active subjects</span></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{subjects.map((subject) => <SubjectCard key={subject.name} subject={subject} />)}</div></section>

        <section className="mt-8 grid gap-5 xl:grid-cols-[1.55fr_0.8fr]">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-serif text-xl text-pf-purple-dark">Continue learning</h2><p className="mt-1 text-sm text-gray-500">Your newest lessons, activities and resources.</p></div><div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" /><input aria-label="Search learning content" className="w-48 rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-xs outline-none focus:border-pf-purple" placeholder="Search..." /></div></div>
            <div className="mt-5 flex gap-2 overflow-x-auto pb-1">{filters.map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium ${filter === item ? "bg-pf-purple text-white" : "bg-[#FAF9FB] text-gray-500 hover:bg-pf-purple-light"}`}>{item}</button>)}</div>
            <div className="mt-4 divide-y divide-gray-100">{shownContent.map((item) => { const Icon = item.icon; return <button key={item.title} type="button" className="flex w-full items-center gap-3 py-3.5 text-left hover:bg-[#FCFBFD]"><div className="rounded-lg bg-pf-purple-light p-2.5"><Icon className="h-5 w-5 text-pf-purple" /></div><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="truncate text-sm font-medium text-pf-purple-dark">{item.title}</p><span className="hidden rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500 sm:inline">{item.type}</span></div><p className="mt-1 text-xs text-gray-500">{item.subject} · {item.detail}</p></div><ChevronRight className="h-4 w-4 shrink-0 text-gray-400" /></button> })}{shownContent.length === 0 && <p className="py-8 text-center text-sm text-gray-400">No content found in this category.</p>}</div>
          </div>
          <aside className="space-y-5"><section className="rounded-2xl bg-pf-purple p-5 text-white"><div className="flex items-start justify-between"><div><p className="text-xs font-medium tracking-wide text-purple-200">YOUR WEEK</p><h2 className="mt-2 font-serif text-xl">4h 25min</h2><p className="mt-1 text-xs text-purple-100">Learning time this week</p></div><div className="rounded-lg bg-white/15 p-2.5"><BookOpen className="h-5 w-5" /></div></div><div className="mt-5 flex h-10 items-end gap-1.5">{[42, 65, 30, 82, 52, 70, 20].map((height, index) => <span key={index} className="flex-1 rounded-t bg-white/30" style={{ height: `${height}%` }} />)}</div><div className="mt-2 flex justify-between text-[10px] text-purple-200"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div></section>
            <section className="rounded-2xl border border-gray-200 bg-white p-5"><div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-pf-green" /><h2 className="font-serif text-lg text-pf-purple-dark">Today’s goal</h2></div><p className="mt-3 text-sm text-gray-600">Finish the mathematics lesson and attempt the algebra quiz.</p><div className="mt-4 flex items-center gap-3"><div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100"><div className="h-full w-1/2 rounded-full bg-pf-green" /></div><span className="text-xs font-semibold text-pf-green">1 / 2</span></div><button type="button" className="mt-4 text-sm font-semibold text-pf-purple hover:underline">View daily plan →</button></section>
          </aside>
        </section>
      </div>
    </main>
  </div>;
}

function SubjectCard({ subject }) {
  const href = subject.name === "Mathematics" ? "/student-learning/mathematics" : "#";
  return <article className="rounded-2xl border border-gray-200 bg-white p-4.5 transition hover:-translate-y-0.5 hover:shadow-sm"><div className="flex items-start justify-between"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pf-purple-light"><BookOpen className="h-5 w-5 text-pf-purple" /></div><span className="text-sm font-semibold text-pf-purple-dark">{subject.progress}%</span></div><h3 className="mt-4 font-serif text-lg font-medium text-pf-purple-dark">{subject.name}</h3><p className="mt-1 text-xs text-gray-500">{subject.teacher}</p><div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100"><div className={`h-full rounded-full ${subject.color}`} style={{ width: `${subject.progress}%` }} /></div><div className="mt-3 flex justify-between text-[11px] text-gray-500"><span>{subject.done}/{subject.lessons} lessons</span><span className="max-w-[120px] truncate text-right">{subject.next}</span></div><a href={href} className="mt-4 flex w-full items-center justify-between border-t border-gray-100 pt-3 text-xs font-semibold text-pf-purple">Open subject <ChevronRight className="h-4 w-4" /></a></article>;
}
