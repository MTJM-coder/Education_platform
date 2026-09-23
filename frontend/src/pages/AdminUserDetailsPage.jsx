import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Edit3,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Shield,
  User,
  UserCheck,
  UserX,
  CalendarDays,
  Clock3,
  Activity,
} from "lucide-react";
import SidebarAdmin from "../components/admin/SidebarAdmin";

const users = {
  "01a0cf7b-afdc-707f-838d-7e59990d729f": {
    id: "01a0cf7b-afdc-707f-838d-7e59990d729f",
    firstName: "Doly Fernie",
    lastName: "Djoumesse",
    email: "dolyferniedjoumesse@gmail.com",
    phone: "+237 6XX XXX XXX",
    role: "Super Admin",
    roleKey: "super_admin",
    status: "Active",
    location: "Douala, Littoral",
    joinedAt: "12 September 2026",
    lastLogin: "23 September 2026 · 18:42",
    avatar: "DF",
    permissions: [
      "Manage users",
      "Manage teachers",
      "Manage academic content",
      "Manage tutoring",
      "Manage payments",
      "Manage disputes",
      "Manage reports & analytics",
      "Manage permissions",
      "Manage platform settings",
    ],
    activity: [
      {
        title: "Updated platform settings",
        date: "23 Sep 2026 · 18:42",
      },
      {
        title: "Reviewed teacher account",
        date: "23 Sep 2026 · 16:18",
      },
      {
        title: "Modified academic configuration",
        date: "22 Sep 2026 · 14:06",
      },
      {
        title: "Logged into admin panel",
        date: "22 Sep 2026 · 09:21",
      },
    ],
  },
};

export default function AdminUserDetailsPage() {
  const userId = window.location.pathname.split("/").pop();

  const user =
    users[userId] ||
    users["01a0cf7b-afdc-707f-838d-7e59990d729f"];

  const [openMenu, setOpenMenu] = useState(false);
  const [status, setStatus] = useState(user.status);

  function toggleStatus() {
    setStatus((current) =>
      current === "Active" ? "Suspended" : "Active"
    );
    setOpenMenu(false);
  }

  return (
    <div className="min-h-screen bg-[#FAF9FB] font-sans text-[#302C38]">
      <SidebarAdmin activeItem="Users" />

      <main className="lg:ml-64">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <a
              href="/admin-users"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-pf-purple"
            >
              <ArrowLeft className="h-4 w-4" />
            </a>

            <div>
              <p className="text-sm font-medium text-pf-purple-dark">
                User details
              </p>

              <p className="hidden text-[11px] text-gray-400 sm:block">
                Administration · Users
              </p>
            </div>
          </div>

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

        <div className="mx-auto max-w-6xl px-5 py-7 sm:px-8">
          {/* Page heading */}
          <section className="mb-7">
            <p className="text-sm font-medium text-pf-purple">
              USER MANAGEMENT
            </p>

            <h1 className="mt-1 font-serif text-2xl font-medium text-pf-purple-dark sm:text-3xl">
              User profile
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              View and manage this user's account and access.
            </p>
          </section>

          {/* Profile hero */}
          <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-pf-purple-light text-xl font-semibold text-pf-purple">
                  {user.avatar}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-serif text-2xl text-pf-purple-dark">
                      {user.firstName} {user.lastName}
                    </h2>

                    <StatusBadge status={status} />
                  </div>

                  <p className="mt-1 text-sm text-gray-500">
                    {user.role}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    ID: {user.id}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50 hover:text-pf-purple"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit user
                </button>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenMenu(!openMenu)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>

                  {openMenu && (
                    <div className="absolute right-0 top-12 z-30 w-48 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg">
                      <button
                        type="button"
                        onClick={toggleStatus}
                        className={`w-full rounded-lg px-3 py-2 text-left text-xs ${
                          status === "Active"
                            ? "text-red-500 hover:bg-red-50"
                            : "text-green-600 hover:bg-green-50"
                        }`}
                      >
                        {status === "Active"
                          ? "Suspend user"
                          : "Activate user"}
                      </button>

                      <button
                        type="button"
                        className="w-full rounded-lg px-3 py-2 text-left text-xs text-gray-600 hover:bg-gray-50"
                      >
                        Reset password
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Main grid */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
            {/* Left */}
            <div className="space-y-6">
              {/* Personal information */}
              <section className="rounded-2xl border border-gray-200 bg-white">
                <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pf-purple-light">
                      <User className="h-4 w-4 text-pf-purple" />
                    </div>

                    <div>
                      <h3 className="font-serif text-lg text-pf-purple-dark">
                        Personal information
                      </h3>

                      <p className="text-xs text-gray-400">
                        Basic account information
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-x-6 gap-y-5 p-5 sm:grid-cols-2 sm:p-6">
                  <InfoItem
                    icon={User}
                    label="Full name"
                    value={`${user.firstName} ${user.lastName}`}
                  />

                  <InfoItem
                    icon={Shield}
                    label="Role"
                    value={user.role}
                  />

                  <InfoItem
                    icon={Mail}
                    label="Email"
                    value={user.email}
                  />

                  <InfoItem
                    icon={Phone}
                    label="Phone"
                    value={user.phone}
                  />

                  <InfoItem
                    icon={MapPin}
                    label="Location"
                    value={user.location}
                  />

                  <InfoItem
                    icon={CalendarDays}
                    label="Joined"
                    value={user.joinedAt}
                  />
                </div>
              </section>

              {/* Activity */}
              <section className="rounded-2xl border border-gray-200 bg-white">
                <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pf-purple-light">
                      <Activity className="h-4 w-4 text-pf-purple" />
                    </div>

                    <div>
                      <h3 className="font-serif text-lg text-pf-purple-dark">
                        Recent activity
                      </h3>

                      <p className="text-xs text-gray-400">
                        Latest actions performed by this user
                      </p>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {user.activity.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 px-5 py-4 sm:px-6"
                    >
                      <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-50">
                        <Clock3 className="h-3.5 w-3.5 text-gray-400" />
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">
                          {item.title}
                        </p>

                        <p className="mt-1 text-[11px] text-gray-400">
                          {item.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right */}
            <div className="space-y-6">
              {/* Account status */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                <h3 className="font-serif text-lg text-pf-purple-dark">
                  Account status
                </h3>

                <div className="mt-5 rounded-xl bg-[#FAF9FB] p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {status === "Active" ? (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50">
                          <UserCheck className="h-4 w-4 text-green-600" />
                        </div>
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50">
                          <UserX className="h-4 w-4 text-red-500" />
                        </div>
                      )}

                      <div>
                        <p className="text-sm font-medium text-pf-purple-dark">
                          {status}
                        </p>

                        <p className="text-[11px] text-gray-400">
                          Account currently{" "}
                          {status === "Active"
                            ? "available"
                            : "restricted"}
                        </p>
                      </div>
                    </div>

                    <StatusBadge status={status} />
                  </div>
                </div>

                <div className="mt-5">
                  <InfoItem
                    icon={Clock3}
                    label="Last login"
                    value={user.lastLogin}
                  />
                </div>
              </section>

              {/* Permissions */}
              <section className="rounded-2xl border border-gray-200 bg-white">
                <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
                  <h3 className="font-serif text-lg text-pf-purple-dark">
                    Permissions
                  </h3>

                  <p className="mt-1 text-xs text-gray-400">
                    Access currently granted to this account
                  </p>
                </div>

                <div className="space-y-2 p-5 sm:p-6">
                  {user.permissions.map((permission) => (
                    <div
                      key={permission}
                      className="flex items-center gap-2.5 rounded-lg bg-[#FAF9FB] px-3 py-2.5"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />

                      <span className="text-xs text-gray-600">
                        {permission}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Security */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pf-purple-light">
                    <Shield className="h-4 w-4 text-pf-purple" />
                  </div>

                  <div>
                    <h3 className="font-serif text-lg text-pf-purple-dark">
                      Security
                    </h3>

                    <p className="mt-1 text-xs leading-relaxed text-gray-400">
                      Manage account security and authentication
                      options from the administration panel.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-5 w-full rounded-lg border border-gray-200 px-4 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  Reset password
                </button>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ========================================================= */
/* INFO ITEM                                                   */
/* ========================================================= */

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-50">
        <Icon className="h-3.5 w-3.5 text-gray-400" />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm text-gray-600">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ========================================================= */
/* STATUS BADGE                                                */
/* ========================================================= */

function StatusBadge({ status }) {
  const active = status === "Active";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${
        active
          ? "bg-green-50 text-green-600"
          : "bg-red-50 text-red-500"
      }`}
    >
      {active ? (
        <CheckCircle2 className="h-3 w-3" />
      ) : (
        <UserX className="h-3 w-3" />
      )}

      {status}
    </span>
  );
}