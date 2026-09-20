import { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  CirclePlay,
  ClipboardCheck,
  FileText,
  FileQuestion,
  GraduationCap,
  PenLine,
} from "lucide-react";
import SidebarStudent from "../components/student/SidebarStudent";

const modules = [
  { title: "Chapter 1 · Algebraic expressions", completed: 3, total: 3, lessons: [
    { title: "Introduction to algebraic expressions", type: "Lesson", done: true },
    { title: "Simplifying expressions", type: "Video", done: true },
    { title: "Practice: Like terms", type: "Exercise", done: true },
  ] },
  { title: "Chapter 2 · Linear equations", completed: 3, total: 3, lessons: [
    { title: "Solving one-step equations", type: "Lesson", done: true },
    { title: "Equations with variables on both sides", type: "Video", done: true },
    { title: "Linear equations quiz", type: "Quiz", done: true },
  ] },
  { title: "Chapter 3 · Quadratic equations", completed: 1, total: 3, lessons: [
    { title: "Solving quadratic equations", type: "Lesson", done: true },
    { title: "The quadratic formula", type: "Video", done: false },
    { title: "Practice: Quadratic equations", type: "Exercise", done: false },
  ] },
  { title: "Chapter 4 · Functions", completed: 0, total: 1, lessons: [
    { title: "Introduction to functions", type: "Lesson", done: false },
  ] },
];

const resources = [
  { title: "Algebra revision notes", type: "PDF", icon: FileText },
  { title: "Form 4 Mathematics past paper", type: "Past paper", icon: FileQuestion },
  { title: "Linear equations corrections", type: "Correction", icon: PenLine },
];

const typeIcons = { Lesson: BookOpen, Video: CirclePlay, Exercise: PenLine, Quiz: ClipboardCheck };

export default function StudentSubjectPage() {
  const [openModule, setOpenModule] = useState(2);
  return <div className="min-h-screen bg-[#FAF9FB] font-sans text-[#302C38]">
    <SidebarStudent activeItem="My Learning" />
    <main className="lg:ml-64">
      <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-5 sm:px-8"><div className="flex items-center gap-2 lg:hidden"><GraduationCap className="h-6 w-6 text-pf-purple" /><span className="font-serif text-sm text-pf-purple-dark">Student Portal</span></div><p className="hidden text-sm text-gray-500 lg:block">My Learning · Mathematics</p><div className="flex h-8 w-8 items-center justify-center rounded-full bg-pf-purple-light text-xs font-semibold text-pf-purple">JM</div></header>
      <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8">
        <a href="/student-learning" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-pf-purple"><ArrowLeft className="h-4 w-4" /> Back to My Learning</a>
        <section className="mt-5 rounded-2xl bg-pf-purple px-6 py-7 text-white sm:px-8"><div className="flex flex-wrap items-start justify-between gap-6"><div><p className="text-xs font-medium tracking-[0.12em] text-purple-200">MY SUBJECT</p><h1 className="mt-2 font-serif text-3xl">Mathematics</h1><p className="mt-2 text-sm text-purple-100">Form 4 · Mr. Xavier Ndzi</p></div><div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3"><p className="text-xs text-purple-200">NEXT CLASS</p><p className="mt-1 text-sm font-medium">Today · 16:00</p></div></div><div className="mt-7 border-t border-white/15 pt-5"><div className="flex items-center justify-between gap-4"><p className="text-sm font-medium">Course progress</p><p className="text-sm font-semibold">7 / 10 lessons completed</p></div><div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/20"><div className="h-full w-[70%] rounded-full bg-pf-gold" /></div><p className="mt-2 text-xs text-purple-200">70% complete · You’re doing great, Jean.</p></div></section>

        <section className="mt-7 grid gap-5 xl:grid-cols-[1.55fr_0.8fr]"><div><div className="mb-3 flex items-center justify-between"><h2 className="font-serif text-xl text-pf-purple-dark">Course content</h2><span className="text-xs text-gray-400">4 chapters</span></div><div className="space-y-3">{modules.map((module, index) => <Module key={module.title} module={module} index={index} open={openModule === index} onToggle={() => setOpenModule(openModule === index ? null : index)} />)}</div></div>
          <aside className="space-y-5"><section className="rounded-2xl border border-gray-200 bg-white p-5"><h2 className="font-serif text-lg text-pf-purple-dark">Course resources</h2><p className="mt-1 text-xs text-gray-500">Useful material from your teacher.</p><div className="mt-4 space-y-1">{resources.map((resource) => { const Icon = resource.icon; return <button key={resource.title} type="button" className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-[#FAF9FB]"><div className="rounded-lg bg-pf-purple-light p-2"><Icon className="h-4 w-4 text-pf-purple" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-pf-purple-dark">{resource.title}</p><p className="mt-0.5 text-[11px] text-gray-500">{resource.type}</p></div><ChevronRight className="h-4 w-4 text-gray-400" /></button>})}</div><button type="button" className="mt-4 text-sm font-semibold text-pf-purple hover:underline">View all resources →</button></section>
            <section className="rounded-2xl border border-[#E6DDAE] bg-[#FFFBEF] p-5"><ClipboardCheck className="h-5 w-5 text-[#A16C00]" /><p className="mt-3 text-xs font-semibold tracking-wide text-[#A16C00]">UP NEXT</p><h2 className="mt-1 font-serif text-lg text-pf-purple-dark">Quadratic equations quiz</h2><p className="mt-2 text-sm text-gray-600">10 questions · Due tomorrow at 18:00</p><button type="button" className="mt-4 rounded-lg bg-pf-purple px-3.5 py-2 text-sm font-medium text-white">Start quiz</button></section></aside>
        </section>
      </div>
    </main>
  </div>;
}

function Module({ module, index, open, onToggle }) {
  const percentage = Math.round((module.completed / module.total) * 100);
  return <section className="overflow-hidden rounded-xl border border-gray-200 bg-white"><button type="button" onClick={onToggle} className="flex w-full items-center gap-3 p-4 text-left"><div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${module.completed === module.total ? "bg-[#EEF6E7] text-pf-green" : "bg-pf-purple-light text-pf-purple"}`}>{module.completed === module.total ? <Check className="h-4 w-4" /> : index + 1}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1"><h3 className="text-sm font-semibold text-pf-purple-dark">{module.title}</h3><span className="text-xs text-gray-500">{module.completed}/{module.total} completed</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-pf-purple" style={{ width: `${percentage}%` }} /></div></div><ChevronDown className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} /></button>{open && <div className="border-t border-gray-100 px-4 py-1">{module.lessons.map((lesson) => { const Icon = typeIcons[lesson.type]; return <button key={lesson.title} type="button" className="flex w-full items-center gap-3 border-b border-gray-100 py-3 text-left last:border-0 hover:bg-[#FCFBFD]"><div className={`rounded-lg p-2 ${lesson.done ? "bg-[#EEF6E7] text-pf-green" : "bg-pf-purple-light text-pf-purple"}`}>{lesson.done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}</div><div className="flex-1"><p className={`text-sm ${lesson.done ? "text-gray-500" : "font-medium text-pf-purple-dark"}`}>{lesson.title}</p><p className="mt-0.5 text-[11px] text-gray-400">{lesson.type}{lesson.done ? " · Completed" : ""}</p></div><ChevronRight className="h-4 w-4 text-gray-400" /></button>})}</div>}</section>;
}
