import {
  Award,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
  Home,
  Settings,
  Target,
  UserRound,
  UsersRound,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  {
    label: "Dashboard",
    icon: Home,
    href: "/student-dashboard",
  },
  {
    label: "My Learning",
    icon: BookOpen,
    href: "/student-learning",
    children: [
      {
        label: "My Subjects",
        href: "/student-learning",
      },
      {
        label: "Resources",
        href: "/student-resources",
      },
    ],
  },
  {
    label: "My Teachers",
    icon: UsersRound,
    href: "/student-teachers",
  },
  {
    label: "My Schedule",
    icon: CalendarDays,
    href: "/student-schedule",
  },
  {
    label: "Assessments",
    icon: ClipboardCheck,
    href: "/student-assessments",
  },
  {
    label: "My Results",
    icon: BarChart3,
    href: "/student-results",
  },
  {
    label: "Exam Preparation",
    icon: Target,
    href: "/student-exam-preparation",
  },
  {
    label: "Progress & Achievements",
    icon: Award,
    href: "/student-achievements",
  },
];

function NavItem({ item, activeItem }) {
  const Icon = item.icon;
  const active = item.label === activeItem;
  const content = <><Icon className="h-[18px] w-[18px] shrink-0" /><span className="font-medium">{item.label}</span></>;
  const className = `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${active ? "bg-pf-purple text-white shadow-sm" : "text-[#5D5A65] hover:bg-pf-purple-light hover:text-pf-purple-dark"}`;

  return <div>
    {item.href ? <a href={item.href} className={className}>{content}</a> : <button type="button" className={className}>{content}</button>}
    {item.children && <div className="ml-9 mt-1 space-y-1 border-l border-gray-200 pl-3">{item.children.map((child) => child.href ? <a key={child.label} href={child.href} className="block py-1 text-left text-xs text-gray-500 hover:text-pf-purple">{child.label}</a> : <button key={child.label} type="button" className="block py-1 text-left text-xs text-gray-500 hover:text-pf-purple">{child.label}</button>)}</div>}
  </div>;
}

function SidebarContent({ activeItem, mobile = false, onClose }) {
  return <>
    <a href="/" className="flex items-center gap-2.5 px-2"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pf-purple text-white"><GraduationCap className="h-5 w-5" /></div><span className="font-serif text-sm font-medium text-pf-purple-dark">The Pathfinder</span></a>
    <p className="mt-8 px-2 text-[10px] font-semibold tracking-[0.16em] text-gray-400">STUDENT PORTAL</p>
    <nav className="mt-3 space-y-1.5">{navigation.map((item) => <NavItem key={item.label} item={item} activeItem={activeItem} />)}</nav>
    <div className="mt-auto space-y-1 border-t border-gray-100 pt-4">
      <a href="/student-notifications" className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#5D5A65] hover:bg-pf-purple-light"><Bell className="h-[18px] w-[18px]" /> Notifications <span className="ml-auto rounded-full bg-pf-gold px-1.5 py-0.5 text-[10px] font-semibold text-white">3</span></a>
      <a href="/student-profile" className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#5D5A65] hover:bg-pf-purple-light"><UserRound className="h-[18px] w-[18px]" /> My Profile</a>
      <button type="button" className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#5D5A65] hover:bg-pf-purple-light"><Settings className="h-[18px] w-[18px]" /> Settings</button>
    </div>
  </>;
}

export default function SidebarStudent({ activeItem = "Dashboard" }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return <>
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 overflow-y-auto border-r border-gray-100 bg-white px-4 py-6 lg:flex lg:flex-col"><SidebarContent activeItem={activeItem} /></aside>
    <button type="button" aria-label="Open student navigation" onClick={() => setMobileOpen(true)} className="fixed left-4 top-4 z-30 rounded-lg border border-gray-200 bg-white p-2 text-pf-purple shadow-sm lg:hidden"><Menu className="h-5 w-5" /></button>
    {mobileOpen && <div className="fixed inset-0 z-50 lg:hidden"><button type="button" aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="absolute inset-0 h-full w-full bg-black/40" /><aside className="relative flex h-full w-72 flex-col overflow-y-auto bg-white px-4 py-6 shadow-xl"><button type="button" aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="absolute right-4 top-4 rounded-md p-1 text-gray-500"><X className="h-5 w-5" /></button><SidebarContent activeItem={activeItem} mobile onClose={() => setMobileOpen(false)} /></aside></div>}
  </>;
}
