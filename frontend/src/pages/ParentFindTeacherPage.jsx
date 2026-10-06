import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Clock3,
  GraduationCap,
  Heart,
  MapPin,
  Search,
  Star,
  UsersRound,
  X,
} from "lucide-react";
import ParentSidebar from "../components/parent/ParentSidebar";

const initialTeachers = [
  {
    id: 1,
    name: "Xavier Ndi",
    title: "Mathematics Teacher",
    subjects: ["Mathematics", "Physics"],
    levels: ["Secondary"],
    experience: "6 years",
    rating: 4.9,
    reviews: 38,
    rate: 5000,
    location: "Bonamoussadi, Douala",
    distance: "2.4 km",
    availability: "Available today",
    verified: true,
    students: 18,
    initials: "XN",
  },
  {
    id: 2,
    name: "Nfor Grace",
    title: "Physics & Mathematics Teacher",
    subjects: ["Physics", "Mathematics"],
    levels: ["Secondary"],
    experience: "8 years",
    rating: 4.8,
    reviews: 31,
    rate: 6000,
    location: "Makepe, Douala",
    distance: "4.1 km",
    availability: "Available tomorrow",
    verified: true,
    students: 24,
    initials: "NG",
  },
  {
    id: 3,
    name: "Acha Mireille",
    title: "English Teacher",
    subjects: ["English", "French"],
    levels: ["Primary", "Secondary"],
    experience: "5 years",
    rating: 4.7,
    reviews: 26,
    rate: 4500,
    location: "Akwa, Douala",
    distance: "6.2 km",
    availability: "Available today",
    verified: true,
    students: 15,
    initials: "AM",
  },
  {
    id: 4,
    name: "Bih Patrick",
    title: "Computer Science Teacher",
    subjects: ["Computer Science", "Mathematics"],
    levels: ["Secondary"],
    experience: "4 years",
    rating: 4.6,
    reviews: 19,
    rate: 5000,
    location: "Bonapriso, Douala",
    distance: "7.3 km",
    availability: "Available this week",
    verified: true,
    students: 12,
    initials: "BP",
  },
  {
    id: 5,
    name: "Ngoe Laure",
    title: "Primary School Teacher",
    subjects: ["Mathematics", "French", "English"],
    levels: ["Primary"],
    experience: "7 years",
    rating: 4.9,
    reviews: 42,
    rate: 4000,
    location: "Bépanda, Douala",
    distance: "5.6 km",
    availability: "Available today",
    verified: true,
    students: 21,
    initials: "NL",
  },
  {
    id: 6,
    name: "Talla Eric",
    title: "Science Teacher",
    subjects: ["Physics", "Chemistry", "Mathematics"],
    levels: ["Secondary"],
    experience: "9 years",
    rating: 4.8,
    reviews: 35,
    rate: 6500,
    location: "Deido, Douala",
    distance: "8.1 km",
    availability: "Available tomorrow",
    verified: true,
    students: 27,
    initials: "TE",
  },
];

const subjects = [
  "All subjects",
  "Mathematics",
  "Physics",
  "Chemistry",
  "English",
  "French",
  "Computer Science",
];

const levels = ["All levels", "Primary", "Secondary"];

function formatPrice(value) {
  return new Intl.NumberFormat("fr-FR").format(value);
}

function TeacherCard({ teacher, favorite, onFavorite, onRequest }) {
  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-pf-purple-light text-lg font-bold text-pf-purple">
          {teacher.initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate font-semibold text-gray-900">
              {teacher.name}
            </h2>

            {teacher.verified && (
              <CheckCircle2
                size={16}
                className="shrink-0 text-green-500"
              />
            )}
          </div>

          <p className="mt-1 text-sm text-gray-500">{teacher.title}</p>

          <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
            <MapPin size={13} />
            {teacher.location}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onFavorite(teacher.id)}
          aria-label={
            favorite ? `Remove ${teacher.name} from favorites` : `Add ${teacher.name} to favorites`
          }
          className={`rounded-lg p-2 transition ${
            favorite
              ? "bg-red-50 text-red-500"
              : "text-gray-400 hover:bg-gray-50 hover:text-red-500"
          }`}
        >
          <Heart
            size={18}
            className={favorite ? "fill-current" : ""}
          />
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {teacher.subjects.map((subject) => (
          <span
            key={subject}
            className="rounded-full bg-gray-50 px-2.5 py-1 text-xs text-gray-600"
          >
            {subject}
          </span>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-gray-50 p-3">
          <div className="flex items-center gap-1 text-amber-500">
            <Star size={14} className="fill-current" />
            <span className="text-sm font-semibold">{teacher.rating}</span>
          </div>
          <p className="mt-1 text-[11px] text-gray-400">
            {teacher.reviews} reviews
          </p>
        </div>

        <div className="rounded-xl bg-gray-50 p-3">
          <div className="flex items-center gap-1 text-pf-purple">
            <GraduationCap size={14} />
            <span className="text-sm font-semibold">
              {teacher.experience}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-gray-400">Experience</p>
        </div>

        <div className="rounded-xl bg-gray-50 p-3">
          <div className="flex items-center gap-1 text-pf-purple">
            <UsersRound size={14} />
            <span className="text-sm font-semibold">
              {teacher.students}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-gray-400">Students</p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {formatPrice(teacher.rate)} FCFA
          </p>
          <p className="text-[11px] text-gray-400">per session</p>
        </div>

        <span className="flex items-center gap-1 text-xs font-medium text-green-600">
          <Clock3 size={13} />
          {teacher.availability}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Link
          to={`/teacher-profile/${teacher.id}`}
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          View profile
          <ArrowRight size={15} />
        </Link>

        <button
          type="button"
          onClick={() => onRequest(teacher)}
          className="rounded-lg bg-pf-purple px-3 py-2.5 text-sm font-medium text-white transition hover:bg-pf-purple-dark"
        >
          Request teacher
        </button>
      </div>
    </article>
  );
}

function RequestModal({ teacher, onClose, onSubmit }) {
  const [child, setChild] = useState("");
  const [subject, setSubject] = useState(teacher.subjects[0] || "");
  const [frequency, setFrequency] = useState("Weekly");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function submit(event) {
    event.preventDefault();

    if (!child) {
      setError("Please select a child.");
      return;
    }

    onSubmit({
      teacher,
      child,
      subject,
      frequency,
      message,
    });
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-pf-purple">
              Tutoring request
            </p>

            <h2 className="mt-1 text-lg font-semibold text-gray-900">
              Request {teacher.name}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Send a tutoring request for one of your children.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="request-child"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Child
            </label>

            <select
              id="request-child"
              value={child}
              onChange={(event) => {
                setChild(event.target.value);
                setError("");
              }}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-purple-400"
            >
              <option value="">Select a child</option>
              <option value="Doly Junior">Doly Junior</option>
              <option value="Mireille Djoumesse">
                Mireille Djoumesse
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="request-subject"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Subject
            </label>

            <select
              id="request-subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-purple-400"
            >
              {teacher.subjects.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="request-frequency"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Frequency
            </label>

            <select
              id="request-frequency"
              value={frequency}
              onChange={(event) => setFrequency(event.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-purple-400"
            >
              <option>One-time</option>
              <option>Weekly</option>
              <option>Twice a week</option>
              <option>Monthly</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="request-message"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Message <span className="font-normal text-gray-400">(optional)</span>
            </label>

            <textarea
              id="request-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={3}
              placeholder="Tell the teacher what your child needs help with..."
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-purple-400"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-pf-purple px-4 py-2.5 text-sm font-medium text-white hover:bg-pf-purple-dark"
            >
              Send request
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default function ParentFindTeacherPage() {
  const navigate = useNavigate();

  const [teachers, setTeachers] = useState(initialTeachers);
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("All subjects");
  const [level, setLevel] = useState("All levels");
  const [availabilityOnly, setAvailabilityOnly] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [notice, setNotice] = useState("");

  const filteredTeachers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return teachers.filter((teacher) => {
      const matchesSearch =
        !query ||
        teacher.name.toLowerCase().includes(query) ||
        teacher.title.toLowerCase().includes(query) ||
        teacher.location.toLowerCase().includes(query) ||
        teacher.subjects.some((item) =>
          item.toLowerCase().includes(query)
        );

      const matchesSubject =
        subject === "All subjects" ||
        teacher.subjects.includes(subject);

      const matchesLevel =
        level === "All levels" ||
        teacher.levels.includes(level);

      const matchesAvailability =
        !availabilityOnly ||
        teacher.availability.toLowerCase().includes("today") ||
        teacher.availability.toLowerCase().includes("tomorrow");

      return (
        matchesSearch &&
        matchesSubject &&
        matchesLevel &&
        matchesAvailability
      );
    });
  }, [teachers, search, subject, level, availabilityOnly]);

  function toggleFavorite(id) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function clearFilters() {
    setSearch("");
    setSubject("All subjects");
    setLevel("All levels");
    setAvailabilityOnly(false);
  }

  function handleRequestSubmit(data) {
    setSelectedTeacher(null);

    setNotice(
      `Your tutoring request for ${data.child} has been prepared for ${data.teacher.name}.`
    );

    // Pour l'instant l'interface est prête.
    // Ici viendra l'appel POST Laravel.
    //
    // Exemple futur :
    // await api.post("/tutoring-requests", {
    //   teacher_id: data.teacher.id,
    //   learner_id: data.child,
    //   subject: data.subject,
    //   frequency: data.frequency,
    //   message: data.message,
    // });

    navigate("/suivi-demande");
  }

  function updateTeacherAvailability() {
    // Exemple d'endroit où brancher les données API.
    // Aucun bouton ne simule une disponibilité réelle.
    setTeachers((current) => [...current]);
  }

  return (
    <div className="min-h-screen bg-[#F8F8FA]">
      <ParentSidebar />

      <main className="min-h-screen lg:ml-64">
        <div className="mx-auto max-w-[1500px] px-5 py-6 sm:px-7 lg:px-10 lg:py-8">
          {/* HEADER */}
          <header className="mb-8">
            <p className="text-sm text-gray-500">
              Parent Portal / Find a Teacher
            </p>

            <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Find a Teacher
                </h1>

                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Find a qualified teacher based on your child's subject,
                  level, location and availability.
                </p>
              </div>

              <Link
                to="/suivi-demande"
                className="flex w-fit items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                My tutoring requests
                <ArrowRight size={16} />
              </Link>
            </div>
          </header>

          {/* NOTICE */}
          {notice && (
            <div className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
              <div className="flex items-start gap-2">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                <p>{notice}</p>
              </div>

              <button
                type="button"
                onClick={() => setNotice("")}
                className="rounded p-1 hover:bg-green-100"
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* SEARCH */}
          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="grid gap-3 lg:grid-cols-[1fr_210px_180px_auto]">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search teacher, subject or location..."
                  className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-10 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="relative">
                <select
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-3 pr-9 text-sm outline-none focus:border-purple-400"
                >
                  {subjects.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>

              <div className="relative">
                <select
                  value={level}
                  onChange={(event) => setLevel(event.target.value)}
                  className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-3 pr-9 text-sm outline-none focus:border-purple-400"
                >
                  {levels.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>

              <button
                type="button"
                onClick={clearFilters}
                className="rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Reset
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={availabilityOnly}
                  onChange={(event) =>
                    setAvailabilityOnly(event.target.checked)
                  }
                  className="h-4 w-4 rounded border-gray-300 accent-purple-600"
                />
                Available today or tomorrow
              </label>

              <span className="text-xs text-gray-400">
                {filteredTeachers.length} teacher
                {filteredTeachers.length !== 1 ? "s" : ""} found
              </span>
            </div>
          </section>

          {/* RESULTS */}
          <section className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Recommended Teachers
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Teachers matching your current criteria
                </p>
              </div>

              <div className="hidden items-center gap-2 text-xs text-gray-400 sm:flex">
                <BookOpen size={14} />
                Verified teachers
              </div>
            </div>

            {filteredTeachers.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredTeachers.map((teacher) => (
                  <TeacherCard
                    key={teacher.id}
                    teacher={teacher}
                    favorite={favorites.includes(teacher.id)}
                    onFavorite={toggleFavorite}
                    onRequest={setSelectedTeacher}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
                <Search
                  size={40}
                  className="mx-auto text-gray-300"
                />

                <h2 className="mt-4 font-semibold text-gray-900">
                  No teachers found
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                  Try changing the subject, school level, search term or
                  availability filter.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 rounded-lg bg-pf-purple px-4 py-2.5 text-sm font-medium text-white hover:bg-pf-purple-dark"
                >
                  Clear filters
                </button>
              </div>
            )}
          </section>

          {/* FAVORITES */}
          {favorites.length > 0 && (
            <section className="mt-6 rounded-2xl border border-red-100 bg-red-50/50 p-5">
              <div className="flex items-center gap-2">
                <Heart size={17} className="fill-red-500 text-red-500" />
                <h2 className="text-sm font-semibold text-gray-900">
                  Your favorite teachers
                </h2>
              </div>

              <p className="mt-1 text-xs text-gray-500">
                You have {favorites.length} favorite teacher
                {favorites.length > 1 ? "s" : ""}.
              </p>
            </section>
          )}
        </div>
      </main>

      {selectedTeacher && (
        <RequestModal
          teacher={selectedTeacher}
          onClose={() => setSelectedTeacher(null)}
          onSubmit={handleRequestSubmit}
        />
      )}
    </div>
  );
}