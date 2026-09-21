
import { useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Edit3,
  GraduationCap,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  UsersRound,
  X,
  XCircle,
} from "lucide-react";
import SidebarAdmin from "../components/admin/SidebarAdmin";

/* ========================================================= */
/* DATA                                                        */
/* ========================================================= */

const initialLevels = [
  {
    id: 1,
    name: "Primary",
    code: "PRI",
    description: "Primary school education",
    classes: 6,
    learners: 420,
    status: "Active",
  },
  {
    id: 2,
    name: "Secondary",
    code: "SEC",
    description: "Secondary school education",
    classes: 7,
    learners: 580,
    status: "Active",
  },
];

const initialClasses = [
  {
    id: 1,
    name: "Class 1",
    code: "C1",
    level: "Primary",
    learners: 72,
    status: "Active",
  },
  {
    id: 2,
    name: "Class 2",
    code: "C2",
    level: "Primary",
    learners: 68,
    status: "Active",
  },
  {
    id: 3,
    name: "Class 3",
    code: "C3",
    level: "Primary",
    learners: 74,
    status: "Active",
  },
  {
    id: 4,
    name: "Class 4",
    code: "C4",
    level: "Primary",
    learners: 70,
    status: "Active",
  },
  {
    id: 5,
    name: "Class 5",
    code: "C5",
    level: "Primary",
    learners: 69,
    status: "Active",
  },
  {
    id: 6,
    name: "Class 6",
    code: "C6",
    level: "Primary",
    learners: 67,
    status: "Active",
  },
  {
    id: 7,
    name: "Form 1",
    code: "F1",
    level: "Secondary",
    learners: 92,
    status: "Active",
  },
  {
    id: 8,
    name: "Form 2",
    code: "F2",
    level: "Secondary",
    learners: 88,
    status: "Active",
  },
  {
    id: 9,
    name: "Form 3",
    code: "F3",
    level: "Secondary",
    learners: 86,
    status: "Active",
  },
  {
    id: 10,
    name: "Form 4",
    code: "F4",
    level: "Secondary",
    learners: 81,
    status: "Active",
  },
  {
    id: 11,
    name: "Form 5",
    code: "F5",
    level: "Secondary",
    learners: 78,
    status: "Active",
  },
  {
    id: 12,
    name: "Lower Sixth",
    code: "L6",
    level: "Secondary",
    learners: 77,
    status: "Active",
  },
  {
    id: 13,
    name: "Upper Sixth",
    code: "U6",
    level: "Secondary",
    learners: 78,
    status: "Active",
  },
];

const initialSubjects = [
  {
    id: 1,
    name: "Mathematics",
    code: "MATH",
    category: "Science",
    levels: ["Primary", "Secondary"],
    teachers: 24,
    learners: 186,
    status: "Active",
  },
  {
    id: 2,
    name: "Physics",
    code: "PHY",
    category: "Science",
    levels: ["Secondary"],
    teachers: 15,
    learners: 104,
    status: "Active",
  },
  {
    id: 3,
    name: "English",
    code: "ENG",
    category: "Languages",
    levels: ["Primary", "Secondary"],
    teachers: 21,
    learners: 163,
    status: "Active",
  },
  {
    id: 4,
    name: "French",
    code: "FRE",
    category: "Languages",
    levels: ["Primary", "Secondary"],
    teachers: 18,
    learners: 142,
    status: "Active",
  },
  {
    id: 5,
    name: "Computer Science",
    code: "CS",
    category: "Technology",
    levels: ["Secondary"],
    teachers: 12,
    learners: 96,
    status: "Active",
  },
  {
    id: 6,
    name: "Biology",
    code: "BIO",
    category: "Science",
    levels: ["Secondary"],
    teachers: 9,
    learners: 72,
    status: "Inactive",
  },
];

/* ========================================================= */
/* MAIN PAGE                                                   */
/* ========================================================= */

export default function AdminAcademicPage() {
  const [activeTab, setActiveTab] = useState("Subjects");

  const [subjects, setSubjects] = useState(initialSubjects);
  const [levels, setLevels] = useState(initialLevels);
  const [classes, setClasses] = useState(initialClasses);

  const [search, setSearch] = useState("");

  const [modal, setModal] = useState(null);

  const [editingItem, setEditingItem] = useState(null);

  /* --------------------------------------------------------- */
  /* OPEN MODALS                                                */
  /* --------------------------------------------------------- */

  const openAddModal = (type) => {
    setEditingItem(null);
    setModal(type);
  };

  const openEditModal = (type, item) => {
    setEditingItem(item);
    setModal(type);
  };

  const closeModal = () => {
    setModal(null);
    setEditingItem(null);
  };

  /* --------------------------------------------------------- */
  /* DELETE                                                      */
  /* --------------------------------------------------------- */

  const deleteSubject = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this subject?"
      )
    ) {
      setSubjects((items) =>
        items.filter((item) => item.id !== id)
      );
    }
  };

  const deleteLevel = (id) => {
    if (
      window.confirm(
        "Deleting this level may affect its classes. Continue?"
      )
    ) {
      setLevels((items) =>
        items.filter((item) => item.id !== id)
      );
    }
  };

  const deleteClass = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this class?"
      )
    ) {
      setClasses((items) =>
        items.filter((item) => item.id !== id)
      );
    }
  };

  /* --------------------------------------------------------- */
  /* TOGGLE STATUS                                               */
  /* --------------------------------------------------------- */

  const toggleStatus = (type, id) => {
    const setter =
      type === "subject"
        ? setSubjects
        : type === "level"
        ? setLevels
        : setClasses;

    setter((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              status:
                item.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : item
      )
    );
  };

  /* --------------------------------------------------------- */
  /* FILTER                                                      */
  /* --------------------------------------------------------- */

  const query = search.toLowerCase().trim();

  const filteredSubjects = useMemo(() => {
    return subjects.filter(
      (subject) =>
        !query ||
        subject.name.toLowerCase().includes(query) ||
        subject.code.toLowerCase().includes(query) ||
        subject.category.toLowerCase().includes(query)
    );
  }, [subjects, query]);

  const filteredLevels = useMemo(() => {
    return levels.filter(
      (level) =>
        !query ||
        level.name.toLowerCase().includes(query) ||
        level.code.toLowerCase().includes(query)
    );
  }, [levels, query]);

  const filteredClasses = useMemo(() => {
    return classes.filter(
      (item) =>
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query) ||
        item.level.toLowerCase().includes(query)
    );
  }, [classes, query]);

  /* --------------------------------------------------------- */
  /* SAVE SUBJECT                                                */
  /* --------------------------------------------------------- */

  const saveSubject = (data) => {
    if (editingItem) {
      setSubjects((items) =>
        items.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                ...data,
              }
            : item
        )
      );
    } else {
      setSubjects((items) => [
        ...items,
        {
          id: Date.now(),
          ...data,
          teachers: 0,
          learners: 0,
          status: "Active",
        },
      ]);
    }

    closeModal();
  };

  /* --------------------------------------------------------- */
  /* SAVE LEVEL                                                  */
  /* --------------------------------------------------------- */

  const saveLevel = (data) => {
    if (editingItem) {
      setLevels((items) =>
        items.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                ...data,
              }
            : item
        )
      );
    } else {
      setLevels((items) => [
        ...items,
        {
          id: Date.now(),
          ...data,
          classes: 0,
          learners: 0,
          status: "Active",
        },
      ]);
    }

    closeModal();
  };

  /* --------------------------------------------------------- */
  /* SAVE CLASS                                                  */
  /* --------------------------------------------------------- */

  const saveClass = (data) => {
    if (editingItem) {
      setClasses((items) =>
        items.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                ...data,
              }
            : item
        )
      );
    } else {
      setClasses((items) => [
        ...items,
        {
          id: Date.now(),
          ...data,
          learners: 0,
          status: "Active",
        },
      ]);
    }

    closeModal();
  };

  return (
    <div className="min-h-screen bg-[#FAF9FB] font-sans text-[#302C38]">
      <SidebarAdmin activeItem="Academic" />

      <main className="lg:ml-64">
        {/* HEADER */}
        <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-5 sm:px-8">
          <p className="hidden text-sm text-gray-500 lg:block">
            Academic Management
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
          {/* PAGE TITLE */}
          <section>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-pf-purple">
                  ACADEMIC MANAGEMENT
                </p>

                <h1 className="mt-1 font-serif text-2xl font-medium text-pf-purple-dark sm:text-3xl">
                  Academic Structure
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-gray-500">
                  Manage subjects, school levels and classes
                  available on the platform.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  openAddModal(
                    activeTab === "Subjects"
                      ? "subject"
                      : activeTab === "Levels"
                      ? "level"
                      : "class"
                  )
                }
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-pf-purple px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-pf-purple-dark"
              >
                <Plus className="h-4 w-4" />

                Add{" "}
                {activeTab === "Subjects"
                  ? "subject"
                  : activeTab === "Levels"
                  ? "level"
                  : "class"}
              </button>
            </div>
          </section>

          {/* STATISTICS */}
          <section className="mt-7 grid gap-4 sm:grid-cols-3">
            <StatCard
              icon={BookOpen}
              label="Subjects"
              value={subjects.length}
            />

            <StatCard
              icon={GraduationCap}
              label="School levels"
              value={levels.length}
            />

            <StatCard
              icon={UsersRound}
              label="Classes"
              value={classes.length}
            />
          </section>

          {/* TABS */}
          <section className="mt-7 rounded-2xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-5 sm:px-6">
              <div className="flex gap-6 overflow-x-auto">
                {["Subjects", "Levels", "Classes"].map(
                  (tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab);
                        setSearch("");
                      }}
                      className={`relative whitespace-nowrap py-4 text-sm font-medium ${
                        activeTab === tab
                          ? "text-pf-purple"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      {tab}

                      {activeTab === tab && (
                        <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-pf-purple" />
                      )}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* TOOLBAR */}
            <div className="border-b border-gray-100 p-5 sm:p-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder={`Search ${activeTab.toLowerCase()}...`}
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-pf-purple focus:ring-2 focus:ring-pf-purple/10"
                />
              </div>
            </div>

            {/* SUBJECTS */}
            {activeTab === "Subjects" && (
              <SubjectsTable
                subjects={filteredSubjects}
                onEdit={(item) =>
                  openEditModal("subject", item)
                }
                onDelete={deleteSubject}
                onToggle={(id) =>
                  toggleStatus("subject", id)
                }
              />
            )}

            {/* LEVELS */}
            {activeTab === "Levels" && (
              <LevelsTable
                levels={filteredLevels}
                onEdit={(item) =>
                  openEditModal("level", item)
                }
                onDelete={deleteLevel}
                onToggle={(id) =>
                  toggleStatus("level", id)
                }
              />
            )}

            {/* CLASSES */}
            {activeTab === "Classes" && (
              <ClassesTable
                classes={filteredClasses}
                levels={levels}
                onEdit={(item) =>
                  openEditModal("class", item)
                }
                onDelete={deleteClass}
                onToggle={(id) =>
                  toggleStatus("class", id)
                }
              />
            )}
          </section>
        </div>
      </main>

      {/* MODALS */}

      {modal === "subject" && (
        <SubjectModal
          item={editingItem}
          onClose={closeModal}
          onSave={saveSubject}
          levels={levels}
        />
      )}

      {modal === "level" && (
        <LevelModal
          item={editingItem}
          onClose={closeModal}
          onSave={saveLevel}
        />
      )}

      {modal === "class" && (
        <ClassModal
          item={editingItem}
          onClose={closeModal}
          onSave={saveClass}
          levels={levels}
        />
      )}
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
/* SUBJECT TABLE                                               */
/* ========================================================= */

function SubjectsTable({
  subjects,
  onEdit,
  onDelete,
  onToggle,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[850px]">
        <thead>
          <tr className="border-b border-gray-100 bg-[#FCFBFD] text-left">
            <TableHead>Subject</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Levels</TableHead>
            <TableHead>Teachers</TableHead>
            <TableHead>Learners</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </tr>
        </thead>

        <tbody>
          {subjects.map((subject) => (
            <tr
              key={subject.id}
              className="border-b border-gray-100 last:border-0 hover:bg-[#FCFBFD]"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pf-purple-light">
                    <BookOpen className="h-5 w-5 text-pf-purple" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-pf-purple-dark">
                      {subject.name}
                    </p>

                    <p className="text-[10px] text-gray-400">
                      {subject.code}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-4 py-4 text-xs text-gray-500">
                {subject.category}
              </td>

              <td className="px-4 py-4">
                <div className="flex flex-wrap gap-1">
                  {subject.levels.map((level) => (
                    <span
                      key={level}
                      className="rounded-full bg-pf-purple-light px-2 py-1 text-[10px] text-pf-purple"
                    >
                      {level}
                    </span>
                  ))}
                </div>
              </td>

              <td className="px-4 py-4 text-xs font-medium">
                {subject.teachers}
              </td>

              <td className="px-4 py-4 text-xs font-medium">
                {subject.learners}
              </td>

              <td className="px-4 py-4">
                <StatusBadge status={subject.status} />
              </td>

              <td className="px-4 py-4">
                <ActionButtons
                  onEdit={() => onEdit(subject)}
                  onDelete={() => onDelete(subject.id)}
                  onToggle={() => onToggle(subject.id)}
                  active={subject.status === "Active"}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {subjects.length === 0 && <EmptyState />}
    </div>
  );
}

/* ========================================================= */
/* LEVELS TABLE                                                */
/* ========================================================= */

function LevelsTable({
  levels,
  onEdit,
  onDelete,
  onToggle,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[750px]">
        <thead>
          <tr className="border-b border-gray-100 bg-[#FCFBFD] text-left">
            <TableHead>Level</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Classes</TableHead>
            <TableHead>Learners</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </tr>
        </thead>

        <tbody>
          {levels.map((level) => (
            <tr
              key={level.id}
              className="border-b border-gray-100 last:border-0 hover:bg-[#FCFBFD]"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pf-purple-light">
                    <GraduationCap className="h-5 w-5 text-pf-purple" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-pf-purple-dark">
                      {level.name}
                    </p>

                    <p className="text-[10px] text-gray-400">
                      {level.code}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-4 py-4 text-xs text-gray-500">
                {level.description}
              </td>

              <td className="px-4 py-4 text-xs font-medium">
                {level.classes}
              </td>

              <td className="px-4 py-4 text-xs font-medium">
                {level.learners}
              </td>

              <td className="px-4 py-4">
                <StatusBadge status={level.status} />
              </td>

              <td className="px-4 py-4">
                <ActionButtons
                  onEdit={() => onEdit(level)}
                  onDelete={() => onDelete(level.id)}
                  onToggle={() => onToggle(level.id)}
                  active={level.status === "Active"}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {levels.length === 0 && <EmptyState />}
    </div>
  );
}

/* ========================================================= */
/* CLASSES TABLE                                               */
/* ========================================================= */

function ClassesTable({
  classes,
  levels,
  onEdit,
  onDelete,
  onToggle,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[750px]">
        <thead>
          <tr className="border-b border-gray-100 bg-[#FCFBFD] text-left">
            <TableHead>Class</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Learners</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </tr>
        </thead>

        <tbody>
          {classes.map((item) => (
            <tr
              key={item.id}
              className="border-b border-gray-100 last:border-0 hover:bg-[#FCFBFD]"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pf-purple-light">
                    <BookOpen className="h-5 w-5 text-pf-purple" />
                  </div>

                  <p className="text-sm font-medium text-pf-purple-dark">
                    {item.name}
                  </p>
                </div>
              </td>

              <td className="px-4 py-4 text-xs text-gray-500">
                {item.code}
              </td>

              <td className="px-4 py-4">
                <span className="rounded-full bg-pf-purple-light px-2.5 py-1 text-[10px] text-pf-purple">
                  {item.level}
                </span>
              </td>

              <td className="px-4 py-4 text-xs font-medium">
                {item.learners}
              </td>

              <td className="px-4 py-4">
                <StatusBadge status={item.status} />
              </td>

              <td className="px-4 py-4">
                <ActionButtons
                  onEdit={() => onEdit(item)}
                  onDelete={() => onDelete(item.id)}
                  onToggle={() => onToggle(item.id)}
                  active={item.status === "Active"}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {classes.length === 0 && <EmptyState />}
    </div>
  );
}

/* ========================================================= */
/* TABLE HEAD                                                  */
/* ========================================================= */

function TableHead({ children }) {
  return (
    <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
      {children}
    </th>
  );
}

/* ========================================================= */
/* ACTION BUTTONS                                              */
/* ========================================================= */

function ActionButtons({
  onEdit,
  onDelete,
  onToggle,
  active,
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={onEdit}
        title="Edit"
        className="rounded-lg p-2 text-gray-400 hover:bg-pf-purple-light hover:text-pf-purple"
      >
        <Edit3 className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={onToggle}
        title={active ? "Deactivate" : "Activate"}
        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
      >
        {active ? (
          <XCircle className="h-4 w-4" />
        ) : (
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        )}
      </button>

      <button
        type="button"
        onClick={onDelete}
        title="Delete"
        className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
      >
        <Trash2 className="h-4 w-4" />
      </button>
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
      {active ? (
        <CheckCircle2 className="h-3 w-3" />
      ) : (
        <XCircle className="h-3 w-3" />
      )}

      {status}
    </span>
  );
}

/* ========================================================= */
/* EMPTY STATE                                                 */
/* ========================================================= */

function EmptyState() {
  return (
    <div className="py-16 text-center">
      <BookOpen className="mx-auto h-8 w-8 text-gray-300" />

      <h3 className="mt-4 font-serif text-lg text-pf-purple-dark">
        Nothing found
      </h3>

      <p className="mt-1 text-sm text-gray-400">
        Try changing your search.
      </p>
    </div>
  );
}

/* ========================================================= */
/* MODAL BASE                                                  */
/* ========================================================= */

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="font-serif text-xl text-pf-purple-dark">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

/* ========================================================= */
/* SUBJECT MODAL                                               */
/* ========================================================= */

function SubjectModal({
  item,
  onClose,
  onSave,
  levels,
}) {
  const [name, setName] = useState(item?.name || "");
  const [code, setCode] = useState(item?.code || "");
  const [category, setCategory] = useState(
    item?.category || "Science"
  );
  const [selectedLevels, setSelectedLevels] = useState(
    item?.levels || []
  );

  const toggleLevel = (level) => {
    setSelectedLevels((current) =>
      current.includes(level)
        ? current.filter((item) => item !== level)
        : [...current, level]
    );
  };

  const submit = (event) => {
    event.preventDefault();

    if (!name.trim() || !code.trim()) return;

    onSave({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      category,
      levels: selectedLevels,
    });
  };

  return (
    <Modal
      title={item ? "Edit subject" : "Add subject"}
      onClose={onClose}
    >
      <form onSubmit={submit} className="space-y-5">
        <Input
          label="Subject name"
          value={name}
          onChange={setName}
          placeholder="e.g. Mathematics"
        />

        <Input
          label="Subject code"
          value={code}
          onChange={setCode}
          placeholder="e.g. MATH"
        />

        <div>
          <label className="text-xs font-medium text-gray-600">
            Category
          </label>

          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
            className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-pf-purple"
          >
            <option>Science</option>
            <option>Languages</option>
            <option>Technology</option>
            <option>Humanities</option>
            <option>Arts</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600">
            Available levels
          </label>

          <div className="mt-2 flex flex-wrap gap-2">
            {levels.map((level) => (
              <button
                key={level.id}
                type="button"
                onClick={() => toggleLevel(level.name)}
                className={`rounded-full px-3 py-1.5 text-xs ${
                  selectedLevels.includes(level.name)
                    ? "bg-pf-purple text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {level.name}
              </button>
            ))}
          </div>
        </div>

        <ModalActions
          onClose={onClose}
          submitLabel={item ? "Save changes" : "Add subject"}
        />
      </form>
    </Modal>
  );
}

/* ========================================================= */
/* LEVEL MODAL                                                 */
/* ========================================================= */

function LevelModal({ item, onClose, onSave }) {
  const [name, setName] = useState(item?.name || "");
  const [code, setCode] = useState(item?.code || "");
  const [description, setDescription] = useState(
    item?.description || ""
  );

  const submit = (event) => {
    event.preventDefault();

    if (!name.trim() || !code.trim()) return;

    onSave({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      description: description.trim(),
    });
  };

  return (
    <Modal
      title={item ? "Edit school level" : "Add school level"}
      onClose={onClose}
    >
      <form onSubmit={submit} className="space-y-5">
        <Input
          label="Level name"
          value={name}
          onChange={setName}
          placeholder="e.g. Primary"
        />

        <Input
          label="Level code"
          value={code}
          onChange={setCode}
          placeholder="e.g. PRI"
        />

        <div>
          <label className="text-xs font-medium text-gray-600">
            Description
          </label>

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            rows={3}
            placeholder="Describe this school level..."
            className="mt-1.5 w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-pf-purple"
          />
        </div>

        <ModalActions
          onClose={onClose}
          submitLabel={item ? "Save changes" : "Add level"}
        />
      </form>
    </Modal>
  );
}

/* ========================================================= */
/* CLASS MODAL                                                 */
/* ========================================================= */

function ClassModal({
  item,
  onClose,
  onSave,
  levels,
}) {
  const [name, setName] = useState(item?.name || "");
  const [code, setCode] = useState(item?.code || "");
  const [level, setLevel] = useState(
    item?.level || levels[0]?.name || ""
  );

  const submit = (event) => {
    event.preventDefault();

    if (!name.trim() || !code.trim() || !level) return;

    onSave({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      level,
    });
  };

  return (
    <Modal
      title={item ? "Edit class" : "Add class"}
      onClose={onClose}
    >
      <form onSubmit={submit} className="space-y-5">
        <Input
          label="Class name"
          value={name}
          onChange={setName}
          placeholder="e.g. Class 1"
        />

        <Input
          label="Class code"
          value={code}
          onChange={setCode}
          placeholder="e.g. C1"
        />

        <div>
          <label className="text-xs font-medium text-gray-600">
            School level
          </label>

          <select
            value={level}
            onChange={(event) =>
              setLevel(event.target.value)
            }
            className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-pf-purple"
          >
            {levels.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <ModalActions
          onClose={onClose}
          submitLabel={item ? "Save changes" : "Add class"}
        />
      </form>
    </Modal>
  );
}

/* ========================================================= */
/* INPUT                                                       */
/* ========================================================= */

function Input({
  label,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-600">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-pf-purple focus:ring-2 focus:ring-pf-purple/10"
      />
    </div>
  );
}

/* ========================================================= */
/* MODAL ACTIONS                                               */
/* ========================================================= */

function ModalActions({
  onClose,
  submitLabel,
}) {
  return (
    <div className="flex justify-end gap-2 border-t border-gray-100 pt-5">
      <button
        type="button"
        onClick={onClose}
        className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-500 hover:bg-gray-50"
      >
        Cancel
      </button>

      <button
        type="submit"
        className="rounded-lg bg-pf-purple px-4 py-2.5 text-sm font-medium text-white hover:bg-pf-purple-dark"
      >
        {submitLabel}
      </button>
    </div>
  );
}
