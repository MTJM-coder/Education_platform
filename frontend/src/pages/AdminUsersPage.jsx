import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  MoreHorizontal,
  Search,
  ShieldCheck,
  UserCheck,
  UserRound,
  UsersRound,
  XCircle,
} from "lucide-react";
import SidebarAdmin from "../components/admin/SidebarAdmin";
import { apiFetch, getToken } from "../lib/apiClient";

const roleFilters = [
  "All",
  "student",
  "parent",
  "teacher",
  "admin Staff",
];

const statusFilters = [
  "All statuses",
  "active",
  "pending",
  "suspended",
  "inactive",
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] =
    useState("All statuses");

  const [openMenu, setOpenMenu] = useState(null);

  const handleSuspend = async (id) => {
    try {
      await apiFetch(`/admin/user/suspend/${id}`, {
        method: "PATCH",
      });

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === id
            ? { ...user, status: "suspended" }
            : user
        )
      );
      setOpenMenu(null);
    } catch (error) {
      setUsersError(error.message || "Unable to suspend user.");
    }
  };

  const handleActivate = async (id) => {
    try {
      await apiFetch(`/admin/user/activate/${id}`, {
        method: "PATCH",
      });

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === id
            ? { ...user, status: "active" }
            : user
        )
      );
      setOpenMenu(null);
    } catch (error) {
      setUsersError(error.message || "Unable to activate user.");
    }
  };

  useEffect(() => {
    let mounted = true;

    async function loadUsers() {
      if (!getToken()) {
        if (mounted) {
          setLoadingUsers(false);
        }
        return;
      }

      try {
        const response = await apiFetch("/admin/users");
        const loadedUsers = Array.isArray(response)
          ? response
          : response?.users ?? response?.data ?? [];

        if (mounted) {
          setUsers(loadedUsers);
        }
      } catch (error) {
        if (mounted) {
          setUsersError(error.message || "Unable to load users.");
        }
      } finally {
        if (mounted) {
          setLoadingUsers(false);
        }
      }
    }

    loadUsers();

    return () => {
      mounted = false;
    };
  }, []);
const filteredUsers = useMemo(() => {
  return users.filter((user) => {
    const query = search.toLowerCase().trim();

    // 1. Recherche sécurisée (gestion des valeurs nulles/undefined)
    const firstName = (user.first_name || "").toLowerCase();
    const lastName = (user.last_name || "").toLowerCase(); // au cas où
    const email = (user.email || "").toLowerCase();
    const phone = (user.phone || "").toLowerCase();

    const matchesSearch =
      !query ||
      firstName.includes(query) ||
      lastName.includes(query) ||
      email.includes(query) ||
      phone.includes(query);

    // 2. Filtre de Rôle (Insensible à la casse)
    const matchesRole =
      roleFilter === "All" ||
      (user.role || "").toLowerCase() === roleFilter.toLowerCase();

    // 3. Filtre de Statut (Insensible à la casse)
    const matchesStatus =
      statusFilter === "All statuses" ||
      (user.status || "").toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesRole && matchesStatus;
  });
}, [users, search, roleFilter, statusFilter]); 

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.status === "active"
  ).length;

  const pendingUsers = users.filter(
    (user) => user.status === "pending"
  ).length;

  const teachers = users.filter(
    (user) => user.role === "teacher"
  ).length;

  return (
    <div className="min-h-screen bg-[#FAF9FB] font-sans text-[#302C38]">
      <SidebarAdmin activeItem="Users" />

      <main className="lg:ml-64">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-5 sm:px-8">
          <p className="hidden text-sm text-gray-500 lg:block">
            Users
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
          {/* Page heading */}
          <section>
            <p className="text-sm font-medium text-pf-purple">
              USER MANAGEMENT
            </p>

            <h1 className="mt-1 font-serif text-2xl font-medium text-pf-purple-dark sm:text-3xl">
              Users
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-gray-500">
              Manage all accounts registered on The Pathfinder
              platform.
            </p>
          </section>

          {/* Statistics */}
          <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={UsersRound}
              label="Total users"
              value={totalUsers}
            />

            <StatCard
              icon={CheckCircle2}
              label="Active users"
              value={activeUsers}
            />

            <StatCard
              icon={UserCheck}
              label="Teachers"
              value={teachers}
            />

            <StatCard
              icon={ShieldCheck}
              label="Pending accounts"
              value={pendingUsers}
            />
          </section>

          {/* Main users section */}
          <section className="mt-7 rounded-2xl border border-gray-200 bg-white">
            {loadingUsers && (
              <p className="px-5 py-4 text-sm text-gray-500 sm:px-6">
                Loading users...
              </p>
            )}

            {usersError && (
              <p className="px-5 py-4 text-sm text-red-600 sm:px-6">
                {usersError}
              </p>
            )}

            {/* Toolbar */}
            <div className="border-b border-gray-100 p-5 sm:p-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <h2 className="font-serif text-xl text-pf-purple-dark">
                    All users
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {filteredUsers.length} user
                    {filteredUsers.length !== 1
                      ? "s"
                      : ""}{" "}
                    displayed
                  </p>
                </div>

                {/* Search */}
                <div className="relative w-full xl:w-72">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search users..."
                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-xs outline-none transition focus:border-pf-purple focus:ring-2 focus:ring-pf-purple/10"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="mt-5 flex flex-wrap gap-2">
                {roleFilters.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setRoleFilter(role)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      roleFilter === role
                        ? "bg-pf-purple text-white"
                        : "bg-[#FAF9FB] text-gray-500 hover:bg-pf-purple-light hover:text-pf-purple"
                    }`}
                  >
                    {role}
                  </button>
                ))}

                <div className="ml-auto relative">
                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value)
                    }
                    className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-9 text-xs text-gray-600 outline-none focus:border-pf-purple"
                  >
                    {statusFilters.map((status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[850px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#FCFBFD] text-left">
                    <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      User
                    </th>

                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Role
                    </th>

                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Location
                    </th>

                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Status
                    </th>

                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Joined
                    </th>

                    <th className="px-6 py-3 text-right text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <UserRow
                      key={user.id}
                      user={user}
                      openMenu={openMenu}
                      setOpenMenu={setOpenMenu}
                      onSuspend={handleSuspend}
                      onActivate={handleActivate}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-gray-100 md:hidden">
              {filteredUsers.map((user) => (
                <MobileUserCard
                  key={user.id}
                  user={user}
                  openMenu={openMenu}
                  setOpenMenu={setOpenMenu}
                  onSuspend={handleSuspend}
                  onActivate={handleActivate}
                />
              ))}
            </div>

            {/* Empty state */}
            {filteredUsers.length === 0 && (
              <div className="py-16 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-pf-purple-light">
                  <UsersRound className="h-5 w-5 text-pf-purple" />
                </div>

                <h3 className="mt-4 font-serif text-lg text-pf-purple-dark">
                  No users found
                </h3>

                <p className="mt-1 text-sm text-gray-400">
                  Try changing your search or filters.
                </p>
              </div>
            )}

            {/* Footer */}
            {filteredUsers.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-5 py-4 sm:px-6">
                <p className="text-xs text-gray-400">
                  Showing {filteredUsers.length} of{" "}
                  {totalUsers} users
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled
                    className="rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-300"
                  >
                    Previous
                  </button>

                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-pf-purple text-xs font-semibold text-white">
                    1
                  </span>

                  <button
                    type="button"
                    className="rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-500 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

/* ========================================================= */
/* STAT CARD                                                   */
/* ========================================================= */

function StatCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pf-purple-light">
          <Icon className="h-5 w-5 text-pf-purple" />
        </div>

        <span className="font-serif text-2xl text-pf-purple-dark">
          {value}
        </span>
      </div>

      <p className="mt-4 text-xs text-gray-500">
        {label}
      </p>
    </div>
  );
}

/* ========================================================= */
/* USER ROW                                                    */
/* ========================================================= */

function UserRow({
  user,
  openMenu,
  setOpenMenu,
  onSuspend,
  onActivate,
}) {
  return (
    <tr className="border-b border-gray-100 last:border-0 hover:bg-[#FCFBFD]">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar name={user.first_name} />

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-pf-purple-dark">
              {user.first_name}
            </p>

            <p className="mt-0.5 truncate text-xs text-gray-400">
              {user.email}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <RoleBadge role={user?.role} />
      </td>

      <td className="px-4 py-4 text-xs text-gray-500">
        {user?.parent_profile?.address || user?.teacher_profile?.location || user?.learner_profile?.location||'-'}
      </td>

      <td className="px-4 py-4">
        <StatusBadge status={user?.status??''} />
      </td>

      <td className="px-4 py-4 text-xs text-gray-500">
         {new Date(user.created_at).toLocaleDateString("fr-FR")}
      </td>

      <td className="relative px-6 py-4 text-right">
        <button
          type="button"
          onClick={() =>
            setOpenMenu(
              openMenu === user.id ? null : user.id
            )
          }
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-pf-purple"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>

        {openMenu === user.id && (
          <ActionMenu
            user={user}
            onSuspend={onSuspend}
            onActivate={onActivate}
          />
        )}
      </td>
    </tr>
  );
}

/* ========================================================= */
/* MOBILE USER CARD                                            */
/* ========================================================= */

function MobileUserCard({
  user,
  openMenu,
  setOpenMenu,
  onSuspend,
  onActivate,
}) {
  return (
    <div className="relative p-5">
      <div className="flex items-start gap-3">
        <Avatar name={user.first_name} />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-pf-purple-dark">
                {user.first_name}
              </p>

              <p className="mt-0.5 truncate text-xs text-gray-400">
                {user.email}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setOpenMenu(
                  openMenu === user.id ? null : user.id
                )
              }
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <RoleBadge role={user.role} />
            <StatusBadge status={user?.status??''} />
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400">
            <span>{user?.location??''}</span>
            <span>{new Date(user.created_at).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>
      </div>

      {openMenu === user.id && (
        <ActionMenu
          user={user}
          mobile
          onSuspend={onSuspend}
          onActivate={onActivate}
        />
      )}
    </div>
  );
}

/* ========================================================= */
/* AVATAR                                                      */
/* ========================================================= */

function Avatar({ name }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pf-purple-light text-xs font-semibold text-pf-purple">
      {initials}
    </div>
  );
}

/* ========================================================= */
/* ROLE BADGE                                                  */
/* ========================================================= */

function RoleBadge({ role }) {
  const styles = {
    learner: "bg-blue-50 text-blue-600",
    parent: "bg-purple-50 text-purple-600",
    teacher: "bg-green-50 text-green-600",
    "admin Staff" : "bg-amber-50 text-amber-600",
    "admin":"bg-amber-50 text-amber-600",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${
        styles[role] || "bg-gray-100 text-gray-500"
      }`}
    >
      {role}
    </span>
  );
}

/* ========================================================= */
/* STATUS BADGE                                                */
/* ========================================================= */

function StatusBadge({ status }) {
  const styles = {
    active: "bg-green-50 text-green-600",
    pending: "bg-amber-50 text-amber-600",
    suspended: "bg-red-50 text-red-600",
    inactive: "bg-gray-100 text-gray-500",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${
        styles[status] || "bg-gray-100 text-gray-500"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "active"
            ? "bg-green-500"
            : status === "pending"
            ? "bg-amber-500"
            : status === "suspended"
            ? "bg-red-500"
            : "bg-gray-400"
        }`}
      />

      {status}
    </span>
  );
}

/* ========================================================= */
/* ACTION MENU                                                 */
/* ========================================================= */

function ActionMenu({
  user,
  mobile = false,
  onSuspend,
  onActivate,
}) {
  return (
    <div
      className={`absolute z-30 w-44 rounded-xl border border-gray-200 bg-white p-1.5 text-left shadow-lg ${
        mobile
          ? "right-5 top-16"
          : "right-6 top-12"
      }`}
    >
      {/* <a
        href={`/admin-users/${user.id}`}
        className="flex items-center justify-between rounded-lg px-3 py-2 text-xs text-gray-600 hover:bg-pf-purple-light hover:text-pf-purple"
      >
        View profile
        <ChevronRight className="h-3.5 w-3.5" />
      </a> */}

      <button
        type="button"
        className="w-full rounded-lg px-3 py-2 text-left text-xs text-gray-600 hover:bg-gray-50"
      >
        Edit user
      </button>

      {user.status === "active" ? (
        <button
          onClick={() => onSuspend(user.id)}
          type="button"
          className="w-full rounded-lg px-3 py-2 text-left text-xs text-red-500 hover:bg-red-50"
        >
          Suspend account
        </button>
      ) : (
        <button
        onClick={() => onActivate(user.id)}
          type="button"
          className="w-full rounded-lg px-3 py-2 text-left text-xs text-green-600 hover:bg-green-50"
        >
          Activate account
        </button>
      )}
    </div>
  );
}