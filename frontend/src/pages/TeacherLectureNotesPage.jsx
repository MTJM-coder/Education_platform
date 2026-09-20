import {
  BookOpen,
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  Filter,
  MoreVertical,
  Plus,
  Search,
  Upload,
  XCircle,
  X

} from "lucide-react";
import { useState } from "react";
import TeacherSidebar from "../components/teacher/TeacherSidebar";

const notes = [
  {
    id: 1,
    title: "Quadratic Equations",
    subject: "Mathematics",
    level: "Form 4",
    file: "quadratic-equations.pdf",
    date: "Sep 18, 2026",
    status: "Approved",
    size: "2.4 MB",
  },
  {
    id: 2,
    title: "Newton's Laws of Motion",
    subject: "Physics",
    level: "Form 5",
    file: "newtons-laws.pdf",
    date: "Sep 16, 2026",
    status: "Pending Review",
    size: "3.1 MB",
  },
  {
    id: 3,
    title: "Algebraic Expressions",
    subject: "Mathematics",
    level: "Form 3",
    file: "algebraic-expressions.pdf",
    date: "Sep 12, 2026",
    status: "Approved",
    size: "1.8 MB",
  },
  {
    id: 4,
    title: "Chemical Reactions",
    subject: "Chemistry",
    level: "Form 4",
    file: "chemical-reactions.pdf",
    date: "Sep 8, 2026",
    status: "Rejected",
    size: "2.7 MB",
    rejectionReason:
      "Please add more examples and practical exercises.",
  },
  {
    id: 5,
    title: "Functions and Graphs",
    subject: "Mathematics",
    level: "Lower Sixth",
    file: "functions-graphs.pdf",
    date: "Sep 5, 2026",
    status: "Approved",
    size: "4.2 MB",
  },
];

const filters = [
  "All",
  "Approved",
  "Pending Review",
  "Rejected",
];

export default function TeacherLectureNotesPage() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [showUpload, setShowUpload] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const filteredNotes = notes.filter((note) => {
    const query = search.toLowerCase();

    const matchesSearch =
      note.title.toLowerCase().includes(query) ||
      note.subject.toLowerCase().includes(query) ||
      note.level.toLowerCase().includes(query);

    const matchesFilter =
      activeFilter === "All" ||
      note.status === activeFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#FAFAFC]">
      <TeacherSidebar activeItem="My Lecture Notes" />

      <main className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-100 bg-white/95 px-6 backdrop-blur lg:px-8">
          <div className="ml-12 lg:ml-0">
            <p className="text-xs text-gray-400">
              Teacher Portal
            </p>

            <h1 className="text-lg font-semibold text-pf-purple-dark">
              My Lecture Notes
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 rounded-lg bg-pf-purple px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
          >
            <Plus className="h-4 w-4" />

            <span className="hidden sm:inline">
              Upload Note
            </span>
          </button>
        </header>

        <div className="p-6 lg:p-8">
          {/* Intro */}
          <section className="mb-7">
            <h2 className="font-serif text-2xl font-semibold text-pf-purple-dark">
              My Lecture Notes
            </h2>

            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Upload and manage your course materials. Notes
              submitted here may be reviewed by the Head of
              Department before becoming available on the platform.
            </p>
          </section>

          {/* Summary */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              icon={FileText}
              label="Total Notes"
              value="5"
              description="Uploaded materials"
            />

            <SummaryCard
              icon={CheckCircle2}
              label="Approved"
              value="3"
              description="Available to students"
            />

            <SummaryCard
              icon={Clock3}
              label="Pending"
              value="1"
              description="Waiting for HOD review"
            />

            <SummaryCard
              icon={XCircle}
              label="Rejected"
              value="1"
              description="Needs modification"
            />
          </section>

          {/* Search / Filters */}
          <section className="mt-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Search */}
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  placeholder="Search notes, subjects or levels..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-pf-purple focus:bg-white"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <div className="mr-1 flex items-center text-gray-400">
                  <Filter className="h-4 w-4" />
                </div>

                {filters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                      activeFilter === filter
                        ? "bg-pf-purple text-white"
                        : "bg-gray-50 text-gray-500 hover:bg-pf-purple-light hover:text-pf-purple"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Notes */}
          <section className="mt-6 rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-4">
              <h3 className="font-semibold text-pf-purple-dark">
                Uploaded Materials
              </h3>

              <p className="mt-0.5 text-xs text-gray-400">
                {filteredNotes.length} note
                {filteredNotes.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredNotes.map((note) => (
                <NoteRow
                  key={note.id}
                  note={note}
                  onView={() => setSelectedNote(note)}
                />
              ))}
            </div>

            {filteredNotes.length === 0 && (
              <EmptyState
                search={search}
                onUpload={() => setShowUpload(true)}
              />
            )}
          </section>
        </div>
      </main>

      {/* Upload modal */}
      {showUpload && (
        <UploadNoteModal
          onClose={() => setShowUpload(false)}
        />
      )}

      {/* Note details */}
      {selectedNote && (
        <NoteDetailsModal
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
        />
      )}
    </div>
  );
}

/* ========================================================= */
/* NOTE ROW                                                   */
/* ========================================================= */

function NoteRow({ note, onView }) {
  return (
    <div className="px-5 py-5 transition hover:bg-gray-50/60">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* File */}
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-pf-purple-light text-pf-purple">
            <FileText className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="truncate font-medium text-pf-purple-dark">
                {note.title}
              </h4>

              <StatusBadge status={note.status} />
            </div>

            <p className="mt-1 text-sm text-gray-500">
              {note.subject} · {note.level}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              {note.file} · {note.size}
            </p>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-5 lg:justify-end">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-gray-400">
              Submitted
            </p>

            <p className="mt-1 text-sm font-medium text-pf-purple-dark">
              {note.date}
            </p>
          </div>

          <button
            type="button"
            onClick={onView}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-pf-purple transition hover:bg-pf-purple-light"
          >
            <Eye className="h-4 w-4" />
            View
          </button>

          <button
            type="button"
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            aria-label="More options"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Rejection message */}
      {note.status === "Rejected" &&
        note.rejectionReason && (
          <div className="mt-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3">
            <p className="text-xs font-semibold text-red-700">
              HOD feedback
            </p>

            <p className="mt-1 text-xs leading-5 text-red-600">
              {note.rejectionReason}
            </p>
          </div>
        )}
    </div>
  );
}

/* ========================================================= */
/* SUMMARY CARD                                               */
/* ========================================================= */

function SummaryCard({
  icon: Icon,
  label,
  value,
  description,
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-pf-purple-dark">
            {value}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            {description}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pf-purple-light text-pf-purple">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

/* ========================================================= */
/* STATUS BADGE                                               */
/* ========================================================= */

function StatusBadge({ status }) {
  const config = {
    Approved: {
      icon: CheckCircle2,
      className: "bg-green-50 text-green-700",
    },

    "Pending Review": {
      icon: Clock3,
      className: "bg-amber-50 text-amber-700",
    },

    Rejected: {
      icon: XCircle,
      className: "bg-red-50 text-red-700",
    },
  };

  const current = config[status] || {
    icon: Clock3,
    className: "bg-gray-100 text-gray-600",
  };

  const Icon = current.icon;

  return (
    <span
      className={`flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${current.className}`}
    >
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}

/* ========================================================= */
/* EMPTY STATE                                                */
/* ========================================================= */

function EmptyState({ search, onUpload }) {
  return (
    <div className="px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-pf-purple-light">
        <BookOpen className="h-5 w-5 text-pf-purple" />
      </div>

      <h3 className="mt-4 font-semibold text-pf-purple-dark">
        {search ? "No notes found" : "No lecture notes yet"}
      </h3>

      <p className="mx-auto mt-1 max-w-sm text-sm text-gray-400">
        {search
          ? "Try changing your search or filter."
          : "Upload your first lecture note to share educational material on the platform."}
      </p>

      {!search && (
        <button
          type="button"
          onClick={onUpload}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-pf-purple px-4 py-2.5 text-sm font-medium text-white"
        >
          <Upload className="h-4 w-4" />
          Upload Note
        </button>
      )}
    </div>
  );
}

/* ========================================================= */
/* UPLOAD MODAL                                               */
/* ========================================================= */

function UploadNoteModal({ onClose }) {
  const [fileName, setFileName] = useState("");

  return (
    <Modal title="Upload Lecture Note" onClose={onClose}>
      <p className="text-sm text-gray-500">
        Upload a course note or learning material. The HOD of
        the selected subject may review it before publication.
      </p>

      <div className="mt-5 space-y-4">
        <FormField label="Title">
          <input
            type="text"
            placeholder="e.g. Quadratic Equations"
            className="form-input"
          />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Subject">
            <select className="form-input">
              <option>Select subject</option>
              <option>Mathematics</option>
              <option>Physics</option>
              <option>Chemistry</option>
              <option>English</option>
            </select>
          </FormField>

          <FormField label="Level / Class">
            <select className="form-input">
              <option>Select level</option>
              <option>Class 5</option>
              <option>Class 6</option>
              <option>Form 3</option>
              <option>Form 4</option>
              <option>Form 5</option>
              <option>Lower Sixth</option>
              <option>Upper Sixth</option>
            </select>
          </FormField>
        </div>

        {/* File upload */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-500">
            File
          </label>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-8 text-center transition hover:border-pf-purple/30 hover:bg-pf-purple-light/30">
            <Upload className="h-7 w-7 text-pf-purple" />

            <p className="mt-3 text-sm font-medium text-pf-purple-dark">
              {fileName || "Click to upload your file"}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              PDF, DOC or DOCX · Maximum 10 MB
            </p>

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) =>
                setFileName(
                  e.target.files?.[0]?.name || ""
                )
              }
            />
          </label>
        </div>

        <FormField label="Description">
          <textarea
            rows="4"
            placeholder="Briefly describe this learning material..."
            className="form-input resize-none"
          />
        </FormField>
      </div>

      <div className="mt-6 rounded-lg bg-blue-50 px-4 py-3">
        <p className="text-xs leading-5 text-blue-700">
          After submission, the material can be reviewed by the
          Head of Department responsible for the selected subject.
        </p>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 rounded-lg bg-pf-purple px-4 py-2.5 text-sm font-medium text-white"
        >
          <Upload className="h-4 w-4" />
          Submit Note
        </button>
      </div>
    </Modal>
  );
}

/* ========================================================= */
/* NOTE DETAILS MODAL                                         */
/* ========================================================= */

function NoteDetailsModal({ note, onClose }) {
  return (
    <Modal title="Lecture Note Details" onClose={onClose}>
      <div className="rounded-xl bg-pf-purple-light p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-pf-purple text-white">
            <FileText className="h-6 w-6" />
          </div>

          <div>
            <h3 className="font-semibold text-pf-purple-dark">
              {note.title}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {note.subject} · {note.level}
            </p>

            <div className="mt-2">
              <StatusBadge status={note.status} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Detail label="File" value={note.file} />

        <Detail label="File Size" value={note.size} />

        <Detail label="Submitted" value={note.date} />

        <Detail label="Subject" value={note.subject} />
      </div>

      {note.status === "Rejected" && (
        <div className="mt-5 rounded-lg border border-red-100 bg-red-50 p-4">
          <p className="text-xs font-semibold text-red-700">
            HOD Feedback
          </p>

          <p className="mt-1 text-sm text-red-600">
            {note.rejectionReason}
          </p>
        </div>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-pf-purple"
        >
          <Eye className="h-4 w-4" />
          Preview
        </button>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg bg-pf-purple px-4 py-2.5 text-sm font-medium text-white"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}

/* ========================================================= */
/* GENERIC MODAL                                              */
/* ========================================================= */

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <h2 className="font-semibold text-pf-purple-dark">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-50 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

/* ========================================================= */
/* FORM FIELD                                                 */
/* ========================================================= */

function FormField({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-gray-500">
        {label}
      </span>

      {children}
    </label>
  );
}

/* ========================================================= */
/* DETAIL                                                     */
/* ========================================================= */

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-pf-purple-dark">
        {value}
      </p>
    </div>
  );
}