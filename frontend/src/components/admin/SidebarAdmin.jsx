import {
  AlertTriangle,
  BarChart3,
  Bell,
  BookOpen,
  ClipboardCheck,
  Coins,
  FileText,
  GraduationCap,
  Home,
  Menu,
  Settings,
  ShieldCheck,
  Target,
  UsersRound,
  UserCheck,
  X,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  {
    label: "Dashboard",
    icon: Home,
    href: "/admin-dashboard",
  },
  {
    label: "Users",
    icon: UsersRound,
    href: "/admin-users",
  },
  {
    label: "Teacher Management",
    icon: UserCheck,
    href: "/admin-teachers",
  },
  {
    label: "Academic",
    icon: GraduationCap,
    href: "/admin-academic",
  },
  {
    label: "Tutoring",
    icon: BookOpen,
    href: "/admin-tutoring",
  },
  {
    label: "Payments & Finance",
    icon: Coins,
    href: "/admin-finance",
  },
  {
    label: "Disputes",
    icon: AlertTriangle,
    href: "/admin-disputes",
  },
  {
    label: "Content",
    icon: FileText,
    href: "/admin-content",
  },
  {
    label: "Exams & Rewards",
    icon: Target,
    href: "/admin-exams-rewards",
  },
  {
    label: "Reports & Analytics",
    icon: BarChart3,
    href: "/admin-analytics",
  },
];

function NavItem({ item, activeItem }) {
  const Icon = item.icon;
  const active = item.label === activeItem;

  return (
    <a
      href={item.href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
        active
          ? "bg-pf-purple text-white shadow-sm"
          : "text-[#5D5A65] hover:bg-pf-purple-light hover:text-pf-purple-dark"
      }`}
    >
      <Icon className="h-[18px] w-[18px] shrink-0" />

      <span className="font-medium">
        {item.label}
      </span>
    </a>
  );
}

function SidebarContent({ activeItem }) {
  return (
    <>
      {/* Logo */}
      <a
        href="/"
        className="flex items-center gap-2.5 px-2"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pf-purple text-white">
          <GraduationCap className="h-5 w-5" />
        </div>

        <span className="font-serif text-sm font-medium text-pf-purple-dark">
          The Pathfinder
        </span>
      </a>

      {/* Portal label */}
      <p className="mt-8 px-2 text-[10px] font-semibold tracking-[0.16em] text-gray-400">
        ADMIN PORTAL
      </p>

      {/* Main navigation */}
      <nav className="mt-3 space-y-1.5">
        {navigation.map((item) => (
          <NavItem
            key={item.label}
            item={item}
            activeItem={activeItem}
          />
        ))}
      </nav>

      {/* Bottom navigation */}
      <div className="mt-auto space-y-1 border-t border-gray-100 pt-4">
        <a
          href="/admin-notifications"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#5D5A65] transition hover:bg-pf-purple-light hover:text-pf-purple-dark"
        >
          <Bell className="h-[18px] w-[18px]" />

          <span>Notifications</span>

          <span className="ml-auto rounded-full bg-pf-gold px-1.5 py-0.5 text-[10px] font-semibold text-white">
            5
          </span>
        </a>

        <a
          href="/admin-permissions"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#5D5A65] transition hover:bg-pf-purple-light hover:text-pf-purple-dark"
        >
          <ShieldCheck className="h-[18px] w-[18px]" />

          <span>Permissions</span>
        </a>

        <a
          href="/admin-settings"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#5D5A65] transition hover:bg-pf-purple-light hover:text-pf-purple-dark"
        >
          <Settings className="h-[18px] w-[18px]" />

          <span>Settings</span>
        </a>
      </div>
    </>
  );
}

export default function SidebarAdmin({
  activeItem = "Dashboard",
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 overflow-y-auto border-r border-gray-100 bg-white px-4 py-6 lg:flex lg:flex-col">
        <SidebarContent activeItem={activeItem} />
      </aside>

      {/* Mobile menu button */}
      <button
        type="button"
        aria-label="Open admin navigation"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-30 rounded-lg border border-gray-200 bg-white p-2 text-pf-purple shadow-sm lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 h-full w-full bg-black/40"
          />

          {/* Sidebar */}
          <aside className="relative flex h-full w-72 flex-col overflow-y-auto bg-white px-4 py-6 shadow-xl">
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setMobileOpen(false)}
              className="absolute right-4 top-4 rounded-md p-1 text-gray-500 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>

            <SidebarContent activeItem={activeItem} />
          </aside>
        </div>
      )}
    </>
  );
}