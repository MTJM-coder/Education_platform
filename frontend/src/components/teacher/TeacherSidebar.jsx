import {
  Award,
  CalendarDays,
  ClipboardCheck,
  Coins,
  FileText,
  Home,
  Settings,
  Target,
  UserRound,
  UsersRound,
  GraduationCap,
  Menu,
  X,
  ClipboardList,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  {
    label: "Dashboard",
    icon: Home,
    href: "/teacher-dashboard",
  },
  {
    label: "My Profile",
    icon: UserRound,
    href: "/teacher-profile",
  },
  {
    label: "My Students",
    icon: UsersRound,
    href: "/teacher-students",
  },
  {
    label: "My Assignments",
    icon: ClipboardList,
    href: "/teacher-assignments",
  },
  {
    label: "My Calendar",
    icon: CalendarDays,
    href: "/teacher-calendar",
  },
  {
    label: "My Lecture Notes",
    icon: FileText,
    href: "/teacher-lecture-notes",
  },
  {
    label: "Assessments & Results",
    icon: ClipboardCheck,
    href: "/teacher-assessments",
  },
  {
    label: "My Reputation",
    icon: Award,
    href: "/teacher-reputation",
  },
  {
    label: "Earnings",
    icon: Coins,
    href: "/teacher-earnings",
  },
  {
    label: "Exam Preparation",
    icon: Target,
    href: "/teacher-exam-preparation",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/teacher-settings",
  },
];

function SidebarContent({ activeItem, onNavigate }) {
  return (
    <>
      {/* Logo */}
      <a
        href="/"
        className="flex items-center gap-2.5 px-2"
        onClick={onNavigate}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pf-purple text-white">
          <GraduationCap className="h-5 w-5" />
        </div>

        <span className="font-serif text-sm font-medium text-pf-purple-dark">
          The Pathfinder
        </span>
      </a>

      {/* Portal title */}
      <p className="mt-8 px-2 text-[10px] font-semibold tracking-[0.16em] text-gray-400">
        TEACHER PORTAL
      </p>

      {/* Navigation */}
      <nav className="mt-3 space-y-1.5">
        {navigation.map(({ label, icon: Icon, href }) => (
          <a
            key={label}
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
              label === activeItem
                ? "bg-pf-purple text-white shadow-sm"
                : "text-[#5D5A65] hover:bg-pf-purple-light hover:text-pf-purple-dark"
            }`}
          >
            <Icon className="h-[18px] w-[18px] shrink-0" />

            <span className="font-medium">{label}</span>
          </a>
        ))}
      </nav>
    </>
  );
}

export default function TeacherSidebar({
  activeItem = "Dashboard",
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 overflow-y-auto border-r border-gray-100 bg-white px-4 py-6 lg:flex lg:flex-col">
        <SidebarContent activeItem={activeItem} />
      </aside>

      {/* Mobile menu button */}
      <button
        type="button"
        aria-label="Open teacher navigation"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-30 rounded-lg border border-gray-200 bg-white p-2 text-pf-purple shadow-sm lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <button
            type="button"
            aria-label="Close navigation"
            onClick={closeMobileMenu}
            className="absolute inset-0 h-full w-full bg-black/40"
          />

          {/* Sidebar */}
          <aside className="relative flex h-full w-72 flex-col overflow-y-auto bg-white px-4 py-6 shadow-xl">
            {/* Close button */}
            <button
              type="button"
              aria-label="Close navigation"
              onClick={closeMobileMenu}
              className="absolute right-4 top-4 rounded-md p-1 text-gray-500 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>

            <SidebarContent
              activeItem={activeItem}
              onNavigate={closeMobileMenu}
            />
          </aside>
        </div>
      )}
    </>
  );
}