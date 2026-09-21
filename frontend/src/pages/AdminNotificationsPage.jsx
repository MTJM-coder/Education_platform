import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  FileCheck2,
  GraduationCap,
  Search,
  UserCheck,
  UsersRound,
} from "lucide-react";
import SidebarAdmin from "../components/admin/SidebarAdmin";

const notifications = [
  {
    id: 1,
    type: "teacher",
    title: "New teacher application",
    message: "A new teacher application has been submitted and is waiting for review.",
    time: "10 min ago",
    unread: true,
    icon: UserCheck,
  },
  {
    id: 2,
    type: "finance",
    title: "Payment received",
    message: "A tutoring payment of 25,000 FCFA has been successfully received.",
    time: "32 min ago",
    unread: true,
    icon: CircleDollarSign,
  },
  {
    id: 3,
    type: "system",
    title: "Teacher documents verified",
    message: "The documents of a teacher have been successfully verified.",
    time: "1 hour ago",
    unread: false,
    icon: FileCheck2,
  },
  {
    id: 4,
    type: "user",
    title: "New learner registered",
    message: "A new learner has joined the platform.",
    time: "2 hours ago",
    unread: true,
    icon: GraduationCap,
  },
  {
    id: 5,
    type: "dispute",
    title: "New dispute reported",
    message: "A parent has opened a dispute regarding a tutoring session.",
    time: "3 hours ago",
    unread: true,
    icon: AlertTriangle,
  },
  {
    id: 6,
    type: "teacher",
    title: "Teacher promoted",
    message: "A teacher has reached the required ranking and is eligible for promotion.",
    time: "5 hours ago",
    unread: false,
    icon: UserCheck,
  },
  {
    id: 7,
    type: "finance",
    title: "Teacher payout completed",
    message: "A teacher payout has been processed successfully.",
    time: "Yesterday",
    unread: false,
    icon: CircleDollarSign,
  },
  {
    id: 8,
    type: "user",
    title: "New parent registered",
    message: "A new parent account has been created.",
    time: "Yesterday",
    unread: false,
    icon: UsersRound,
  },
];

const filters = [
  { label: "All", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Teachers", value: "teacher" },
  { label: "Finance", value: "finance" },
  { label: "System", value: "system" },
  { label: "Disputes", value: "dispute" },
];

export default function AdminNotificationsPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState(notifications);

  const filteredNotifications = useMemo(() => {
    const query = search.toLowerCase().trim();

    return items.filter((notification) => {
      const matchesSearch =
        !query ||
        notification.title.toLowerCase().includes(query) ||
        notification.message.toLowerCase().includes(query);

      const matchesFilter =
        filter === "all"
          ? true
          : filter === "unread"
          ? notification.unread
          : notification.type === filter;

      return matchesSearch && matchesFilter;
    });
  }, [items, filter, search]);

  const unreadCount = items.filter(
    (notification) => notification.unread
  ).length;

  function markAsRead(id) {
    setItems((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification
      )
    );
  }

  function markAllAsRead() {
    setItems((current) =>
      current.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9FB] font-sans text-[#302C38]">
      <SidebarAdmin activeItem="" />

      <main className="lg:ml-64">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-5 sm:px-8">
          <p className="hidden text-sm text-gray-500 lg:block">
            Notifications
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

        <div className="mx-auto max-w-5xl px-5 py-7 sm:px-8">
          {/* Heading */}
          <section>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-pf-purple">
                  ADMIN CENTER
                </p>

                <h1 className="mt-1 font-serif text-2xl font-medium text-pf-purple-dark sm:text-3xl">
                  Notifications
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                  Stay informed about important activity across the platform.
                </p>
              </div>

              <button
                type="button"
                onClick={markAllAsRead}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-pf-purple-dark transition hover:bg-gray-50"
              >
                <CheckCircle2 className="h-4 w-4 text-pf-purple" />
                Mark all as read
              </button>
            </div>
          </section>

          {/* Summary */}
          <section className="mt-7 grid gap-4 sm:grid-cols-3">
            <SummaryCard
              icon={Bell}
              label="Total notifications"
              value={items.length}
            />

            <SummaryCard
              icon={CheckCircle2}
              label="Unread"
              value={unreadCount}
            />

            <SummaryCard
              icon={AlertTriangle}
              label="Requires attention"
              value={
                items.filter(
                  (notification) =>
                    notification.unread &&
                    notification.type === "dispute"
                ).length
              }
            />
          </section>

          {/* Notification panel */}
          <section className="mt-7 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {/* Toolbar */}
            <div className="border-b border-gray-100 p-5 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="font-serif text-xl text-pf-purple-dark">
                    Recent notifications
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {filteredNotifications.length} notification
                    {filteredNotifications.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <div className="relative w-full lg:w-72">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search notifications..."
                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-xs outline-none transition focus:border-pf-purple focus:ring-2 focus:ring-pf-purple/10"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
                {filters.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setFilter(item.value)}
                    className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      filter === item.value
                        ? "bg-pf-purple text-white"
                        : "bg-[#FAF9FB] text-gray-500 hover:bg-pf-purple-light hover:text-pf-purple"
                    }`}
                  >
                    {item.label}

                    {item.value === "unread" && unreadCount > 0 && (
                      <span
                        className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[9px] ${
                          filter === "unread"
                            ? "bg-white/20 text-white"
                            : "bg-pf-gold text-white"
                        }`}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="divide-y divide-gray-100">
              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={markAsRead}
                />
              ))}
            </div>

            {/* Empty state */}
            {filteredNotifications.length === 0 && (
              <div className="py-16 text-center">
                <Bell className="mx-auto h-9 w-9 text-gray-300" />

                <h3 className="mt-4 font-serif text-lg text-pf-purple-dark">
                  No notifications found
                </h3>

                <p className="mt-1 text-sm text-gray-400">
                  Try another filter or search term.
                </p>
              </div>
            )}

            {/* Footer */}
            {filteredNotifications.length > 0 && (
              <div className="border-t border-gray-100 px-5 py-4 sm:px-6">
                <button
                  type="button"
                  className="mx-auto flex items-center gap-1 text-xs font-semibold text-pf-purple hover:underline"
                >
                  View notification history
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

/* ========================================================= */
/* SUMMARY CARD                                               */
/* ========================================================= */

function SummaryCard({ icon: Icon, label, value }) {
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
/* NOTIFICATION ITEM                                          */
/* ========================================================= */

function NotificationItem({ notification, onRead }) {
  const Icon = notification.icon;

  return (
    <div
      className={`group flex gap-4 px-5 py-4 transition sm:px-6 ${
        notification.unread
          ? "bg-purple-50/30"
          : "bg-white"
      } hover:bg-[#FCFBFD]`}
    >
      {/* Icon */}
      <div
        className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          notification.type === "dispute"
            ? "bg-red-50 text-red-500"
            : notification.type === "finance"
            ? "bg-green-50 text-green-600"
            : "bg-pf-purple-light text-pf-purple"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-2">
            <h3
              className={`text-sm ${
                notification.unread
                  ? "font-semibold text-pf-purple-dark"
                  : "font-medium text-gray-700"
              }`}
            >
              {notification.title}
            </h3>

            {notification.unread && (
              <span className="h-1.5 w-1.5 rounded-full bg-pf-purple" />
            )}
          </div>

          <span className="shrink-0 text-[11px] text-gray-400">
            {notification.time}
          </span>
        </div>

        <p className="mt-1.5 max-w-2xl text-xs leading-5 text-gray-500">
          {notification.message}
        </p>

        <div className="mt-3 flex items-center gap-4">
          <button
            type="button"
            className="text-xs font-semibold text-pf-purple hover:underline"
          >
            View details
          </button>

          {notification.unread && (
            <button
              type="button"
              onClick={() => onRead(notification.id)}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Mark as read
            </button>
          )}
        </div>
      </div>
    </div>
  );
}