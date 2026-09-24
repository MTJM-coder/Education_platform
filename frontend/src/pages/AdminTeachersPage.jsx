import { useEffect, useMemo, useState } from "react";
import {
  Award,
  CheckCircle2,
  ChevronRight,
  FileCheck2,
  Filter,
  GraduationCap,
  MoreHorizontal,
  Search,
  Star,
  UserCheck,
  UsersRound,
  XCircle,
} from "lucide-react";
import SidebarAdmin from "../components/admin/SidebarAdmin";
import { apiFetch } from "../lib/apiClient";


const statusFilters = [
  "All",
  "validated",
  "pending",
  "suspended",
];

function getUniqueLearnerCount(teacher) {
  const uniqueLearnerIds = new Set(
    (teacher?.assignments ?? [])
      .map((assignment) => assignment?.tutoring_request?.learner_id)
      .filter(Boolean)
  );

  return uniqueLearnerIds.size;
}

function getTeacherId(teacher) {
  return teacher?.id ?? teacher?.user_id ?? teacher?.user?.id;
}

export default function AdminTeachersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [openMenu, setOpenMenu] = useState(null);
   const [teachers, setTeachers] = useState([]);
  const [teachersErrors, setTeachersErrors] = useState("");

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const response = await apiFetch("/admin/teachers");
        const loadedTeachers = Array.isArray(response)
          ? response
          : response?.teachers ?? response?.data ?? [];
        setTeachers(loadedTeachers);
      } catch (error) {
        setTeachersErrors(error.message || "Unable to load teachers.");
      }
    };

    loadTeachers();
  }, []);

  const filteredTeachers = useMemo(() => {
    const query = search.toLowerCase().trim();

    return teachers.filter((teacher) => {
      const matchesSearch =
        !query ||
        teacher.user.first_name.toLowerCase().includes(query) ||
        teacher.user.last_name.toLowerCase().includes(query) ||
        teacher.user.email.toLowerCase().includes(query) ||
        teacher.location.toLowerCase().includes(query) ||
        teacher.teacherSubjects.some((subject) =>
          subject.toLowerCase().includes(query)
        );

      const matchesStatus =
        statusFilter === "All" ||
        teacher.validation_status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [teachers, search, statusFilter]);

  const validated = teachers.filter(
    (teacher) => teacher.validation_status === "validated"
  ).length;

  const pending = teachers.filter( 
    (teacher) => teacher.validation_status === "pending"
  ).length;

  const suspended = teachers.filter(
    (teacher) => teacher.validation_status === "suspended"
  ).length;

  const totalStudents = teachers.reduce(
    (total, teacher) => total + getUniqueLearnerCount(teacher),
    0
  );
  

  return (
    <div className="min-h-screen bg-[#FAF9FB] font-sans text-[#302C38]">
      <SidebarAdmin activeItem="Teacher Management" />

      <main className="lg:ml-64">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-5 sm:px-8">
          <p className="hidden text-sm text-gray-500 lg:block">
            Teacher Management
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
            <p className="text-sm font-medium text-pf-purple">
              TEACHER MANAGEMENT
            </p>

            <h1 className="mt-1 font-serif text-2xl font-medium text-pf-purple-dark sm:text-3xl">
              Teachers
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-gray-500">
              Review, validate and manage teachers registered on
              the platform.
            </p>
          </section>

          {/* Stats */}
          <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={UsersRound}
              label="Total teachers"
              value={teachers.length}
            />

            <StatCard
              icon={UserCheck}
              label="Validated"
              value={validated}
            />

            <StatCard
              icon={FileCheck2}
              label="Pending review"
              value={pending}
            />

            <StatCard
              icon={GraduationCap}
              label="Active students"
              value={totalStudents}
            />
          </section>

          {/* Teacher list */}
          <section className="mt-7 rounded-2xl border border-gray-200 bg-white">
            {/* Toolbar */}
            <div className="border-b border-gray-100 p-5 sm:p-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <h2 className="font-serif text-xl text-pf-purple-dark">
                    Teacher directory
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {filteredTeachers?.length} teacher
                    {filteredTeachers?.length !== 1
                      ? "s"
                      : ""}{" "}
                    displayed
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
                    placeholder="Search teacher, subject..."
                    className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-pf-purple focus:ring-2 focus:ring-pf-purple/10"
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {statusFilters.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${statusFilter === status
                      ? "bg-pf-purple text-white"
                      : "bg-[#FAF9FB] text-gray-500 hover:bg-pf-purple-light hover:text-pf-purple"
                      }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#FCFBFD] text-left">
                    <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Teacher
                    </th>

                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Subjects
                    </th>

                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Location
                    </th>

                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Reputation
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
                  {filteredTeachers?.map((teacher) => (
                    <TeacherRow
                      key={teacher?.id}
                      teacher={teacher}
                      openMenu={openMenu}
                      setOpenMenu={setOpenMenu}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="divide-y divide-gray-100 md:hidden">
              {filteredTeachers?.map((teacher) => (
                <TeacherMobileCard
                  key={teacher.id}
                  teacher={teacher}
                  openMenu={openMenu}
                  setOpenMenu={setOpenMenu}
                />
              ))}
            </div>

            {filteredTeachers.length === 0 && (
              <div className="py-16 text-center">
                <UsersRound className="mx-auto h-8 w-8 text-gray-300" />

                <h3 className="mt-4 font-serif text-lg text-pf-purple-dark">
                  No teachers found
                </h3>

                <p className="mt-1 text-sm text-gray-400">
                  Try changing your search or filter.
                </p>
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

function StatCard({ icon: Icon, label, value }) {
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
/* TEACHER ROW                                                 */
/* ========================================================= */

function TeacherRow({
  teacher,
  openMenu,
  setOpenMenu,
}) {
  return (
    <tr className="border-b border-gray-100 last:border-0 hover:bg-[#FCFBFD]">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar name={teacher?.user?.first_name+" "+teacher?.user?.last_name} />

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-pf-purple-dark">
              {teacher?.user?.first_name+" "+teacher?.user?.last_name}
            </p>

            <p className="mt-0.5 truncate text-xs text-gray-400">
              {teacher?.email}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        <div className="flex max-w-[190px] flex-wrap gap-1">
          {teacher?.teacherSubjects?.map((subject) => (
            <span
              key={subject}
              className="rounded-full bg-pf-purple-light px-2 py-1 text-[10px] text-pf-purple"
            >
              {subject}
            </span>
          ))}
        </div>
      </td>

      <td className="px-4 py-4">
        <p className="text-xs text-gray-500">
          {teacher?.location}
        </p>

        <p className="mt-1 text-[10px] text-gray-400">
          {teacher?.experience_years}
        </p>
      </td>

      <td className="px-4 py-4">
        <div className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-pf-gold text-pf-gold" />

          <span className="text-xs font-semibold text-pf-purple-dark">
            { teacher?.stars }
          </span>
        </div>

        <p className="mt-1 text-[10px] text-gray-400">
          {getUniqueLearnerCount(teacher)} students
        </p>
      </td>

      <td className="px-4 py-4">
        <TeacherStatus status={teacher?.validation_status} />
      </td>

      <td className="relative px-6 py-4 text-right">
        <button
          type="button"
          onClick={() =>
            setOpenMenu(
              openMenu === teacher.id
                ? null
                : teacher.id
            )
          }
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-pf-purple"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>

        {openMenu === teacher.id && (
          <TeacherActionMenu teacher={teacher} />
        )}
      </td>
    </tr>
  );
}

/* ========================================================= */
/* MOBILE CARD                                                 */
/* ========================================================= */

function TeacherMobileCard({
  teacher,
  openMenu,
  setOpenMenu,
}) {
  return (
    <div className="relative p-5">
      <div className="flex items-start gap-3">
        <Avatar name={teacher?.user?.first_name+" "+teacher?.user?.last_name} />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-pf-purple-dark">
                {teacher?.user?.first_name+" "+teacher?.user?.last_name}
              </p>

              <p className="mt-0.5 truncate text-xs text-gray-400">
                {teacher?.email}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setOpenMenu(
                  openMenu === teacher.id
                    ? null
                    : teacher.id
                )
              }
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-1">
            {teacher?.teacherSubjects?.map((subject) => (
              <span
                key={subject}
                className="rounded-full bg-pf-purple-light px-2 py-1 text-[10px] text-pf-purple"
              >
                {subject}
              </span>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <TeacherStatus status={teacher?.validation_status} />
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-pf-gold text-pf-gold" />

              <span className="text-xs font-semibold">
                {teacher.stars > 0
                  ? teacher.stars
                  : "No rating"}
              </span>
            </div>

            <span className="text-[11px] text-gray-400">
              {teacher?.location} · {getUniqueLearnerCount(teacher)} students
            </span>
          </div>
        </div>
      </div>

      {openMenu === teacher.id && (
        <TeacherActionMenu
          teacher={teacher}
          mobile
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
/* DOCUMENT STATUS                                             */
/* ========================================================= */

/* ========================================================= */
/* TEACHER STATUS                                             */
/* ========================================================= */

function TeacherStatus({ status }) {
  const config = {
    validated: {
      className: "bg-green-50 text-green-600",
    },

    pending: {
      className: "bg-amber-50 text-amber-600",
    },

    suspended: {
      className: "bg-red-50 text-red-600",
    },
  };

  const normalizedStatus = (status || "pending").toLowerCase();
  const current = config[normalizedStatus] || config.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${current.className}`}
    >
      {normalizedStatus}
    </span>
  );
}

/* ========================================================= */
/* ACTION MENU                                                 */
/* ========================================================= */

function TeacherActionMenu({
  teacher,
  mobile = false,
}) {
  const teacherId = getTeacherId(teacher);

  return (
    <div
      className={`absolute z-30 w-48 rounded-xl border border-gray-200 bg-white p-1.5 text-left shadow-lg ${mobile
        ? "right-5 top-16"
        : "right-6 top-12"
        }`}
    >
      <a
        href={teacherId ? `/admin-teachers/${teacherId}` : "#"}
        className="flex items-center justify-between rounded-lg px-3 py-2 text-xs text-gray-600 hover:bg-pf-purple-light hover:text-pf-purple"
      >
        View teacher
        <ChevronRight className="h-3.5 w-3.5" />
      </a>

      <a
        href={teacherId ? `/admin-teachers/${teacherId}/documents` : "#"}
        className="block rounded-lg px-3 py-2 text-xs text-gray-600 hover:bg-gray-50"
      >
        Review documents
      </a>

      {teacher.validation_status === "pending" && (
        <button
          type="button"
          className="w-full rounded-lg px-3 py-2 text-left text-xs text-green-600 hover:bg-green-50"
        >
          Validate teacher
        </button>
      )}

      {teacher.validation_status === "validated" && (
        <button
          type="button"
          className="w-full rounded-lg px-3 py-2 text-left text-xs text-red-500 hover:bg-red-50"
        >
          Suspend teacher
        </button>
      )}

      {teacher.validation_status === "Suspended" && (
        <button
          type="button"
          className="w-full rounded-lg px-3 py-2 text-left text-xs text-green-600 hover:bg-green-50"
        >
          Reactivate teacher
        </button>
      )}
    </div>
  );
}