import {
  Award,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  ClipboardList,
  CreditCard,
  GraduationCap,
  Home,
  Menu,
  Search,
  Settings,
  Star,
  Target,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";

const navigation = [
  { label: "Dashboard", icon: Home, href: "/parent-dashboard" },
  { label: "My Children", icon: UsersRound, href: "/parent-dashboard#children" },
  { label: "Find a Teacher", icon: Search, href: "/search" },
  { label: "Tutoring Requests", icon: ClipboardList, href: "/suivi-demande" },
  { label: "My Teachers", icon: GraduationCap, href: "/parent-teachers" },
  { label: "Schedule", icon: CalendarDays, href: "/parent-schedule" },
  { label: "Payments", icon: CreditCard, href: "/paiements" },
  { label: "Evaluations", icon: Star, href: "/laisser-un-avis" },
  { label: "Children Results", icon: BarChart3, href: "/resultats-scolaires" },
  { label: "Progress", icon: BarChart3, href: "/child-progress" },
  { label: "Learning Platform", icon: BookOpen, href: "/learning-platform" },
  { label: "Exam Preparation", icon: Target, href: "/learning-platform#exam-preparation" },
  { label: "Awards", icon: Award, href: "/resultats-scolaires#awards" },
];

const accountNavigation = [
  { label: "Notifications", icon: Bell, href: "/parametres#notifications" },
  { label: "My Profile", icon: UserRound, href: "/parametres#profile" },
  { label: "Settings", icon: Settings, href: "/parametres" },
];

function NavigationLink({ item, pathname, hash, onNavigate }) {
  const Icon = item.icon;
  const [itemPath, itemHash = ""] = item.href.split("#");
  const active = itemPath === pathname && (!itemHash || `#${itemHash}` === hash);

  return (
    <a
      href={item.href}
      onClick={onNavigate}
      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
        active
          ? "bg-pf-purple text-white"
          : "text-[#5D5A65] hover:bg-pf-purple-light hover:text-pf-purple-dark"
      }`}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
      <span className="font-medium">{item.label}</span>
    </a>
  );
}

function SidebarContent({ onNavigate }) {
  const { pathname, hash } = useLocation();

  return (
    <>
      <a href="/" className="flex items-center gap-2.5 px-2" onClick={onNavigate}>
        <img
          src="/pathfinder-logo.png"
          alt="The Pathfinder Academic"
          className="h-9 w-9 object-contain"
        />
        <span className="font-serif text-sm font-medium text-pf-purple-dark">The Pathfinder</span>
      </a>
      <p className="mt-7 px-2 text-[10px] font-semibold tracking-[0.16em] text-gray-400">
        PARENT PORTAL
      </p>
      <nav className="mt-3 space-y-1" aria-label="Parent navigation">
        {navigation.map((item) => (
          <NavigationLink key={item.label} item={item} pathname={pathname} hash={hash} onNavigate={onNavigate} />
        ))}
      </nav>
      <div className="mt-5 space-y-1 border-t border-gray-100 pt-4">
        {accountNavigation.map((item) => (
          <NavigationLink key={item.label} item={item} pathname={pathname} hash={hash} onNavigate={onNavigate} />
        ))}
      </div>
    </>
  );
}

export default function ParentSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobileNavigation = () => setMobileOpen(false);

  return (
    <>
      <aside className="parent-sidebar fixed inset-y-0 left-0 z-20 hidden w-64 overflow-y-auto border-r border-gray-100 bg-white px-4 py-6 lg:flex lg:flex-col">
        <SidebarContent />
      </aside>

      <button
        type="button"
        aria-label="Open parent navigation"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-30 rounded-md border border-gray-200 bg-white p-2 text-pf-purple shadow-sm lg:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={closeMobileNavigation}
            className="absolute inset-0 h-full w-full bg-black/40"
          />
          <aside className="relative flex h-full w-72 flex-col overflow-y-auto bg-white px-4 py-6 shadow-xl">
            <button
              type="button"
              aria-label="Close navigation"
              onClick={closeMobileNavigation}
              className="absolute right-4 top-4 rounded-md p-1 text-gray-500"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            <SidebarContent onNavigate={closeMobileNavigation} />
          </aside>
        </div>
      )}
    </>
  );
}
