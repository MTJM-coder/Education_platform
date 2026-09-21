import { useMemo, useState } from "react";
import {
  BarChart3,
  BookOpen,
  Check,
  ChevronRight,
  Coins,
  FileText,
  GraduationCap,
  LockKeyhole,
  Search,
  ShieldCheck,
  Target,
  UserCheck,
  UsersRound,
  X,
} from "lucide-react";
import SidebarAdmin from "../components/admin/SidebarAdmin";

const staffMembers = [
  {
    id: 1,
    name: "Jean Mbarga",
    email: "jean.mbarga@pathfinder.cm",
    role: "Admin Staff",
    department: "Academic",
    status: "Active",
    permissions: [
      "Users",
      "Teacher Management",
      "Academic",
      "Content",
    ],
  },
  {
    id: 2,
    name: "Sophie Nfor",
    email: "sophie.nfor@pathfinder.cm",
    role: "Admin Staff",
    department: "Finance",
    status: "Active",
    permissions: [
      "Users",
      "Payments & Finance",
      "Reports & Analytics",
    ],
  },
  {
    id: 3,
    name: "Daniel Bih",
    email: "daniel.bih@pathfinder.cm",
    role: "Head of Mathematics",
    department: "Mathematics",
    status: "Active",
    permissions: [
      "Academic",
      "Assessments",
      "Reports & Analytics",
    ],
  },
  {
    id: 4,
    name: "Mary Acha",
    email: "mary.acha@pathfinder.cm",
    role: "Admin Staff",
    department: "Teacher Management",
    status: "Inactive",
    permissions: [
      "Teacher Management",
      "Users",
    ],
  },
];

const permissionGroups = [
  {
    title: "Users",
    icon: UsersRound,
    permissions: [
      "View users",
      "Create users",
      "Edit users",
      "Deactivate users",
    ],
  },
  {
    title: "Teacher Management",
    icon: UserCheck,
    permissions: [
      "View teachers",
      "Review applications",
      "Verify documents",
      "Manage teacher status",
    ],
  },
  {
    title: "Academic",
    icon: GraduationCap,
    permissions: [
      "Manage subjects",
      "Manage levels",
      "Manage classes",
      "Manage departments",
    ],
  },
  {
    title: "Tutoring",
    icon: BookOpen,
    permissions: [
      "View tutoring sessions",
      "Manage assignments",
      "Manage schedules",
      "Handle tutoring issues",
    ],
  },
  {
    title: "Payments & Finance",
    icon: Coins,
    permissions: [
      "View payments",
      "Manage payouts",
      "Manage commissions",
      "View financial reports",
    ],
  },
  {
    title: "Content",
    icon: FileText,
    permissions: [
      "View content",
      "Create content",
      "Edit content",
      "Delete content",
    ],
  },
  {
    title: "Exams & Rewards",
    icon: Target,
    permissions: [
      "Manage exams",
      "Manage evaluations",
      "Manage rewards",
      "Manage rankings",
    ],
  },
  {
    title: "Reports & Analytics",
    icon: BarChart3,
    permissions: [
      "View analytics",
      "Export reports",
      "View performance reports",
    ],
  },
];

export default function AdminPermissionsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedStaff, setSelectedStaff] = useState(null);

  const filteredStaff = useMemo(() => {
    const query = search.toLowerCase().trim();

    return staffMembers.filter((staff) => {
      const matchesSearch =
        !query ||
        staff.name.toLowerCase().includes(query) ||
        staff.email.toLowerCase().includes(query) ||
        staff.role.toLowerCase().includes(query) ||
        staff.department.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        staff.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  return (
    <div className="min-h-screen bg-[#FAF9FB] font-sans text-[#302C38]">
      <SidebarAdmin activeItem="" />

      <main className="lg:ml-64">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-5 sm:px-8">
          <p className="hidden text-sm text-gray-500 lg:block">
            Permissions
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
                  ACCESS CONTROL
                </p>

                <h1 className="mt-1 font-serif text-2xl font-medium text-pf-purple-dark sm:text-3xl">
                  Permissions
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-gray-500">
                  Control what Admin Staff and department heads can
                  access and manage on the platform.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-pf-purple-light px-3 py-2">
                <ShieldCheck className="h-4 w-4 text-pf-purple" />

                <span className="text-xs font-medium text-pf-purple-dark">
                  Super Admin access
                </span>
              </div>
            </div>
          </section>

          {/* Security notice */}
          <section className="mt-7 rounded-2xl border border-purple-100 bg-pf-purple-light p-5">
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
                <LockKeyhole className="h-4 w-4 text-pf-purple" />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-pf-purple-dark">
                  Permission management
                </h2>

                <p className="mt-1 max-w-3xl text-xs leading-5 text-gray-600">
                  Only the Super Admin can grant or remove administrative
                  permissions. Changes should be reviewed carefully because
                  they affect access to platform data and management tools.
                </p>
              </div>
            </div>
          </section>

          {/* Staff table */}
          <section className="mt-7 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {/* Toolbar */}
            <div className="border-b border-gray-100 p-5 sm:p-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <h2 className="font-serif text-xl text-pf-purple-dark">
                    Administrative users
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {filteredStaff.length} user
                    {filteredStaff.length !== 1 ? "s" : ""} displayed
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
                    placeholder="Search staff..."
                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-xs outline-none transition focus:border-pf-purple focus:ring-2 focus:ring-pf-purple/10"
                  />
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                {["All", "Active", "Inactive"].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      statusFilter === status
                        ? "bg-pf-purple text-white"
                        : "bg-[#FAF9FB] text-gray-500 hover:bg-pf-purple-light hover:text-pf-purple"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#FCFBFD] text-left">
                    <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Staff member
                    </th>

                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Role
                    </th>

                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Department
                    </th>

                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Permissions
                    </th>

                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Status
                    </th>

                    <th className="px-6 py-3 text-right text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStaff.map((staff) => (
                    <StaffRow
                      key={staff.id}
                      staff={staff}
                      onManage={() => setSelectedStaff(staff)}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="divide-y divide-gray-100 md:hidden">
              {filteredStaff.map((staff) => (
                <StaffMobileCard
                  key={staff.id}
                  staff={staff}
                  onManage={() => setSelectedStaff(staff)}
                />
              ))}
            </div>

            {/* Empty */}
            {filteredStaff.length === 0 && (
              <div className="py-16 text-center">
                <ShieldCheck className="mx-auto h-9 w-9 text-gray-300" />

                <h3 className="mt-4 font-serif text-lg text-pf-purple-dark">
                  No administrative users found
                </h3>

                <p className="mt-1 text-sm text-gray-400">
                  Try another search or filter.
                </p>
              </div>
            )}
          </section>

          {/* Permission reference */}
          <section className="mt-7">
            <div className="mb-4">
              <h2 className="font-serif text-xl text-pf-purple-dark">
                Permission modules
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Available access areas that can be assigned to administrative
                users.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {permissionGroups.map((group) => (
                <PermissionModule
                  key={group.title}
                  group={group}
                />
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Permission modal */}
      {selectedStaff && (
        <PermissionModal
          staff={selectedStaff}
          onClose={() => setSelectedStaff(null)}
        />
      )}
    </div>
  );
}

/* ========================================================= */
/* STAFF ROW                                                   */
/* ========================================================= */

function StaffRow({ staff, onManage }) {
  return (
    <tr className="border-b border-gray-100 last:border-0 hover:bg-[#FCFBFD]">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pf-purple-light text-xs font-semibold text-pf-purple">
            {getInitials(staff.name)}
          </div>

          <div>
            <p className="text-sm font-medium text-pf-purple-dark">
              {staff.name}
            </p>

            <p className="mt-0.5 text-[10px] text-gray-400">
              {staff.email}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] text-gray-600">
          {staff.role}
        </span>
      </td>

      <td className="px-4 py-4 text-xs text-gray-500">
        {staff.department}
      </td>

      <td className="px-4 py-4">
        <div className="flex flex-wrap gap-1">
          {staff.permissions.slice(0, 2).map((permission) => (
            <span
              key={permission}
              className="rounded-full bg-pf-purple-light px-2 py-1 text-[10px] text-pf-purple"
            >
              {permission}
            </span>
          ))}

          {staff.permissions.length > 2 && (
            <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] text-gray-500">
              +{staff.permissions.length - 2}
            </span>
          )}
        </div>
      </td>

      <td className="px-4 py-4">
        <StatusBadge status={staff.status} />
      </td>

      <td className="px-6 py-4 text-right">
        <button
          type="button"
          onClick={onManage}
          className="inline-flex items-center gap-1 text-xs font-semibold text-pf-purple hover:underline"
        >
          Manage
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </td>
    </tr>
  );
}

/* ========================================================= */
/* MOBILE STAFF CARD                                           */
/* ========================================================= */

function StaffMobileCard({ staff, onManage }) {
  return (
    <div className="p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pf-purple-light text-xs font-semibold text-pf-purple">
          {getInitials(staff.name)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-pf-purple-dark">
                {staff.name}
              </p>

              <p className="mt-0.5 truncate text-[10px] text-gray-400">
                {staff.email}
              </p>
            </div>

            <StatusBadge status={staff.status} />
          </div>

          <div className="mt-3 flex flex-wrap gap-1">
            <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] text-gray-600">
              {staff.role}
            </span>

            <span className="rounded-full bg-pf-purple-light px-2 py-1 text-[10px] text-pf-purple">
              {staff.department}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1">
            {staff.permissions.map((permission) => (
              <span
                key={permission}
                className="rounded-full bg-[#FAF9FB] px-2 py-1 text-[10px] text-gray-500"
              >
                {permission}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={onManage}
            className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-pf-purple"
          >
            Manage permissions
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ========================================================= */
/* PERMISSION MODULE                                           */
/* ========================================================= */

function PermissionModule({ group }) {
  const Icon = group.icon;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pf-purple-light">
          <Icon className="h-4 w-4 text-pf-purple" />
        </div>

        <h3 className="text-sm font-semibold text-pf-purple-dark">
          {group.title}
        </h3>
      </div>

      <div className="mt-4 space-y-2">
        {group.permissions.map((permission) => (
          <div
            key={permission}
            className="flex items-center gap-2 text-xs text-gray-500"
          >
            <Check className="h-3.5 w-3.5 text-pf-green" />
            {permission}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ========================================================= */
/* PERMISSION MODAL                                            */
/* ========================================================= */

function PermissionModal({ staff, onClose }) {
  const [selected, setSelected] = useState(
    staff.permissions
  );

  function togglePermission(permission) {
    setSelected((current) =>
      current.includes(permission)
        ? current.filter((item) => item !== permission)
        : [...current, permission]
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close permissions"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Modal header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-pf-purple">
              ACCESS CONTROL
            </p>

            <h2 className="mt-1 font-serif text-xl text-pf-purple-dark">
              Manage permissions
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              {staff.name} · {staff.role}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Permission list */}
        <div className="overflow-y-auto p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {permissionGroups.map((group) => (
              <PermissionGroupEditor
                key={group.title}
                group={group}
                selected={selected}
                onToggle={togglePermission}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-[#FCFBFD] px-5 py-4 sm:px-6">
          <p className="text-xs text-gray-400">
            {selected.length} permission module
            {selected.length !== 1 ? "s" : ""} selected
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-pf-purple px-4 py-2.5 text-xs font-medium text-white hover:bg-pf-purple-dark"
            >
              Save permissions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================================================= */
/* PERMISSION GROUP EDITOR                                     */
/* ========================================================= */

function PermissionGroupEditor({
  group,
  selected,
  onToggle,
}) {
  const Icon = group.icon;

  const active = selected.includes(group.title);

  return (
    <div
      className={`rounded-xl border p-4 transition ${
        active
          ? "border-pf-purple/30 bg-pf-purple-light/40"
          : "border-gray-200 bg-white"
      }`}
    >
      <button
        type="button"
        onClick={() => onToggle(group.title)}
        className="flex w-full items-center gap-3 text-left"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pf-purple-light">
          <Icon className="h-4 w-4 text-pf-purple" />
        </div>

        <span className="flex-1 text-sm font-semibold text-pf-purple-dark">
          {group.title}
        </span>

        <div
          className={`flex h-5 w-5 items-center justify-center rounded-md border ${
            active
              ? "border-pf-purple bg-pf-purple text-white"
              : "border-gray-300 bg-white"
          }`}
        >
          {active && <Check className="h-3.5 w-3.5" />}
        </div>
      </button>

      <div className="mt-3 space-y-1.5 border-t border-gray-100 pt-3">
        {group.permissions.map((permission) => (
          <p
            key={permission}
            className="text-[11px] text-gray-500"
          >
            • {permission}
          </p>
        ))}
      </div>
    </div>
  );
}

/* ========================================================= */
/* STATUS                                                      */
/* ========================================================= */

function StatusBadge({ status }) {
  const active = status === "Active";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${
        active
          ? "bg-green-50 text-green-600"
          : "bg-gray-100 text-gray-500"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-green-500" : "bg-gray-400"
        }`}
      />

      {status}
    </span>
  );
}

/* ========================================================= */
/* HELPERS                                                     */
/* ========================================================= */

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}