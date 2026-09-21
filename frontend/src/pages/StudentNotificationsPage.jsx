import { useMemo, useState } from "react";
import {
  Bell,
  BookOpen,
  CheckCheck,
  ClipboardCheck,
  GraduationCap,
  MoreHorizontal,
  Trophy,
  UserRound,
  CalendarDays,
  AlertCircle,
} from "lucide-react";
import SidebarStudent from "../components/student/SidebarStudent";

const initialNotifications = [
  {
    id: 1,
    type: "Academic",
    title: "New assessment result available",
    message:
      "Your Mathematics assessment result has been published. You scored 84%.",
    time: "10 min ago",
    date: "Today",
    unread: true,
    icon: ClipboardCheck,
  },
  {
    id: 2,
    type: "Courses",
    title: "New learning resource",
    message:
      "A new Mathematics lesson on quadratic equations has been added to your learning space.",
    time: "1 hour ago",
    date: "Today",
    unread: true,
    icon: BookOpen,
  },
  {
    id: 3,
    type: "Courses",
    title: "Upcoming lesson",
    message:
      "Your Mathematics lesson with Mr. Xavier is scheduled for today at 16:00.",
    time: "3 hours ago",
    date: "Today",
    unread: true,
    icon: CalendarDays,
  },
  {
    id: 4,
    type: "Rewards",
    title: "Achievement unlocked",
    message:
      "Congratulations! You have unlocked the Excellent Progress achievement.",
    time: "Yesterday",
    date: "19 Sept. 2026",
    unread: false,
    icon: Trophy,
  },
  {
    id: 5,
    type: "Academic",
    title: "Assessment reminder",
    message:
      "Your Algebra Chapter 3 quiz is due tomorrow. Don't forget to complete it.",
    time: "Yesterday",
    date: "19 Sept. 2026",
    unread: false,
    icon: AlertCircle,
  },
  {
    id: 6,
    type: "Courses",
    title: "Teacher assigned",
    message:
      "Mrs. Nfor has been assigned to your Physics tutoring request.",
    time: "2 days ago",
    date: "18 Sept. 2026",
    unread: false,
    icon: UserRound,
  },
  {
    id: 7,
    type: "Rewards",
    title: "Progress update",
    message:
      "Your overall academic progress has increased by 6% this month.",
    time: "3 days ago",
    date: "17 Sept. 2026",
    unread: false,
    icon: Trophy,
  },
];

const filters = ["All", "Unread", "Academic", "Courses", "Rewards"];

export default function StudentNotificationsPage() {
  const [notifications, setNotifications] =
    useState(initialNotifications);

  const [filter, setFilter] = useState("All");

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  const filteredNotifications = useMemo(() => {
    if (filter === "All") {
      return notifications;
    }

    if (filter === "Unread") {
      return notifications.filter(
        (notification) => notification.unread
      );
    }

    return notifications.filter(
      (notification) => notification.type === filter
    );
  }, [filter, notifications]);

  function markAsRead(id) {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification
      )
    );
  }

  function markAllAsRead() {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9FB] font-sans text-[#302C38]">
      <SidebarStudent activeItem="" />

      <main className="lg:ml-64">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-5 sm:px-8">
          <div className="flex items-center gap-2 lg:hidden">
            <GraduationCap className="h-6 w-6 text-pf-purple" />

            <span className="font-serif text-sm text-pf-purple-dark">
              Student Portal
            </span>
          </div>

          <p className="hidden text-sm text-gray-500 lg:block">
            Notifications
          </p>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pf-purple-light text-xs font-semibold text-pf-purple">
            JM
          </div>
        </header>

        <div className="mx-auto max-w-5xl px-5 py-7 sm:px-8">
          {/* Page heading */}
          <section className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-pf-purple">
                STAY UPDATED
              </p>

              <h1 className="mt-1 font-serif text-2xl font-medium text-pf-purple-dark sm:text-3xl">
                Notifications
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Keep track of your latest academic and learning
                activities.
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-pf-purple hover:bg-pf-purple-light"
              >
                <CheckCheck className="h-4 w-4" />
                Mark all as read
              </button>
            )}
          </section>

          {/* Summary */}
          <section className="mt-7 grid gap-4 sm:grid-cols-3">
            <SummaryCard
              icon={Bell}
              label="Total notifications"
              value={notifications.length}
            />

            <SummaryCard
              icon={AlertCircle}
              label="Unread"
              value={unreadCount}
            />

            <SummaryCard
              icon={Trophy}
              label="Rewards & achievements"
              value={
                notifications.filter(
                  (item) => item.type === "Rewards"
                ).length
              }
            />
          </section>

          {/* Notifications */}
          <section className="mt-7 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
            {/* Filters */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl text-pf-purple-dark">
                  Your notifications
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Recent updates from your student account.
                </p>
              </div>

              <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
                {filters.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFilter(item)}
                    className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      filter === item
                        ? "bg-pf-purple text-white"
                        : "bg-[#FAF9FB] text-gray-500 hover:bg-pf-purple-light hover:text-pf-purple"
                    }`}
                  >
                    {item}

                    {item === "Unread" && unreadCount > 0 && (
                      <span
                        className={`ml-1.5 ${
                          filter === item
                            ? "text-white"
                            : "text-pf-purple"
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
            <div className="mt-5 divide-y divide-gray-100">
              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={markAsRead}
                />
              ))}

              {filteredNotifications.length === 0 && (
                <div className="py-14 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-pf-purple-light">
                    <Bell className="h-5 w-5 text-pf-purple" />
                  </div>

                  <h3 className="mt-4 font-serif text-lg text-pf-purple-dark">
                    No notifications
                  </h3>

                  <p className="mt-1 text-sm text-gray-400">
                    You're all caught up for now.
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Notification preferences preview */}
          <section className="mt-6 rounded-2xl border border-pf-purple-light bg-pf-purple-light p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white">
                <Bell className="h-5 w-5 text-pf-purple" />
              </div>

              <div>
                <h2 className="font-serif text-lg text-pf-purple-dark">
                  Never miss an important update
                </h2>

                <p className="mt-1 text-sm leading-6 text-gray-600">
                  You'll receive notifications about lessons,
                  assessments, results, teacher assignments,
                  achievements and other important activities.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* ========================================================= */
/* SUMMARY CARD                                                */
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

      <p className="mt-4 text-xs text-gray-500">{label}</p>
    </div>
  );
}

/* ========================================================= */
/* NOTIFICATION ITEM                                           */
/* ========================================================= */

function NotificationItem({ notification, onRead }) {
  const Icon = notification.icon;

  return (
    <div
      className={`group flex gap-4 py-4 transition ${
        notification.unread
          ? "bg-[#FCFBFD]"
          : "bg-white"
      }`}
    >
      {/* Icon */}
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
          notification.unread
            ? "bg-pf-purple-light"
            : "bg-gray-100"
        }`}
      >
        <Icon
          className={`h-5 w-5 ${
            notification.unread
              ? "text-pf-purple"
              : "text-gray-400"
          }`}
        />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
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

          <span className="shrink-0 text-[10px] text-gray-400">
            {notification.time}
          </span>
        </div>

        <p className="mt-1.5 max-w-2xl text-xs leading-5 text-gray-500">
          {notification.message}
        </p>

        <div className="mt-2 flex items-center gap-3">
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[9px] font-medium text-gray-500">
            {notification.type}
          </span>

          {notification.unread && (
            <button
              type="button"
              onClick={() => onRead(notification.id)}
              className="text-[10px] font-semibold text-pf-purple opacity-100 hover:underline"
            >
              Mark as read
            </button>
          )}
        </div>
      </div>

      {/* More */}
      <button
        type="button"
        aria-label="More notification options"
        className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-300 hover:bg-gray-100 hover:text-gray-500 sm:flex"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
    </div>
  );
}