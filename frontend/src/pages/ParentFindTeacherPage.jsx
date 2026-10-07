import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Clock3,
  GraduationCap,
  MapPin,
  Search,
  Star,
  X,
} from "lucide-react";
import ParentSidebar from "../components/parent/ParentSidebar";
import { apiFetch } from "../lib/apiClient";

/* ========================================================= */
/* HELPERS                                                     */
/* ========================================================= */

// Accepte [..], { data: [..] } ou { data: { data: [..] } } selon apiFetch.
function toList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  return [];
}

// Réponse paginée { data: [..], meta: {..} } (brute ou enveloppée).
function toPage(response) {
  const body = Array.isArray(response?.data) ? response : response?.data ?? response;
  return {
    items: Array.isArray(body?.data) ? body.data : [],
    meta: body?.meta ?? null,
  };
}

// Accepte { ... }, { data: { ... } } ou { data: { data: { ... } } }.
function toObject(response) {
  return response?.data?.data ?? response?.data ?? response ?? null;
}

function getUserName(user) {
  if (!user) return null;
  if (user.name) return user.name;
  const full = [user.first_name, user.last_name].filter(Boolean).join(" ");
  return full || null;
}

function getLearnerName(learner) {
  if (!learner) return "Student";
  const own = [learner.first_name, learner.last_name].filter(Boolean).join(" ");
  if (own) return own;
  return getUserName(learner.user) ?? "Student";
}

function formatPrice(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  return new Intl.NumberFormat("fr-FR").format(number);
}

function formatRank(rank) {
  if (!rank) return null;
  return String(rank)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Mêmes valeurs que celles attendues par l'API (minuscules anglaises).
const DAYS = [
  { value: "monday", label: "Monday", short: "Mon" },
  { value: "tuesday", label: "Tuesday", short: "Tue" },
  { value: "wednesday", label: "Wednesday", short: "Wed" },
  { value: "thursday", label: "Thursday", short: "Thu" },
  { value: "friday", label: "Friday", short: "Fri" },
  { value: "saturday", label: "Saturday", short: "Sat" },
  { value: "sunday", label: "Sunday", short: "Sun" },
];

function shortDay(value) {
  return DAYS.find((day) => day.value === value)?.short ?? value;
}

function dayLabel(value) {
  return DAYS.find((day) => day.value === value)?.label ?? value;
}

function initialsOf(displayName) {
  const parts = String(displayName ?? "")
    .replace(/\./g, "")
    .split(" ")
    .filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

function sectionLabel(section) {
  if (section === "english") return "English section";
  if (section === "french") return "French section";
  if (section === "bilingual") return "Bilingual";
  return null;
}

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100";

/* ========================================================= */
/* TEACHER CARD                                                */
/* ========================================================= */

function TeacherCard({ teacher, onProfile, onRequest }) {
  const days = teacher.available_days ?? [];
  const subjects = teacher.subjects ?? [];
  const rate = formatPrice(teacher.expected_rate);
  const rank = formatRank(teacher.rank);

  return (
    <article className="flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-pf-purple-light text-lg font-bold text-pf-purple">
          {initialsOf(teacher.display_name)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate font-semibold text-gray-900">
              {teacher.display_name || "Teacher"}
            </h2>

            {/* Tous les enseignants listés ont un profil approuvé par l'administration. */}
            <CheckCircle2 size={16} className="shrink-0 text-green-500" />
          </div>

          {rank && <p className="mt-1 text-sm text-gray-500">{rank}</p>}

          {teacher.location && (
            <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
              <MapPin size={13} />
              {teacher.location}
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {subjects.length === 0 ? (
          <span className="text-xs text-gray-400">No validated subject yet</span>
        ) : (
          subjects.map((subject) => (
            <span
              key={subject.id}
              className="rounded-full bg-gray-50 px-2.5 py-1 text-xs text-gray-600"
            >
              {subject.name}
            </span>
          ))
        )}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-gray-50 p-3">
          <div className="flex items-center gap-1 text-amber-500">
            <Star size={14} className="fill-current" />
            <span className="text-sm font-semibold">
              {teacher.average_rating ?? "New"}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-gray-400">
            {teacher.reviews_count} review{teacher.reviews_count !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="rounded-xl bg-gray-50 p-3">
          <div className="flex items-center gap-1 text-pf-purple">
            <GraduationCap size={14} />
            <span className="text-sm font-semibold">
              {teacher.experience_years !== null && teacher.experience_years !== undefined
                ? `${teacher.experience_years} yr${Number(teacher.experience_years) !== 1 ? "s" : ""}`
                : "—"}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-gray-400">Experience</p>
        </div>

        <div className="rounded-xl bg-gray-50 p-3">
          <div className="flex items-center gap-1 text-pf-purple">
            <Star size={14} />
            <span className="text-sm font-semibold">{Number(teacher.stars || 0)}</span>
          </div>
          <p className="mt-1 text-[11px] text-gray-400">Stars</p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {rate ? `${rate} FCFA` : "—"}
          </p>
          <p className="text-[11px] text-gray-400">
            Indicative rate · final price set by the administration
          </p>
        </div>

        <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-green-600">
          <Clock3 size={13} />
          {days.length > 0 ? days.map(shortDay).join(" · ") : "No availability set"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onProfile(teacher)}
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          View profile
          <ArrowRight size={15} />
        </button>

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

/* ========================================================= */
/* PROFILE MODAL                                               */
/* ========================================================= */

function ProfileModal({ teacher, onClose, onRequest }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await apiFetch(`/teachers/${teacher.teacher_id}/profile`);
        if (!cancelled) setProfile(toObject(response));
      } catch (err) {
        if (!cancelled) setError(err?.message || "Unable to load this profile.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [teacher.teacher_id]);

  const availability = useMemo(() => {
    const slots = profile?.availability ?? [];
    return DAYS.map((day) => ({
      ...day,
      slots: slots.filter((slot) => slot.day_of_week === day.value),
    })).filter((day) => day.slots.length > 0);
  }, [profile]);

  const data = profile ?? teacher;
  const rate = formatPrice(data.expected_rate);

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
        aria-label={`Profile of ${teacher.display_name}`}
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-pf-purple-light text-xl font-bold text-pf-purple">
              {initialsOf(data.display_name)}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  {data.display_name}
                </h2>
                <CheckCircle2 size={16} className="text-green-500" />
              </div>

              <p className="mt-1 text-sm text-gray-500">
                {[formatRank(data.rank), sectionLabel(data.section)]
                  .filter(Boolean)
                  .join(" · ") || "Teacher"}
              </p>

              {data.location && (
                <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                  <MapPin size={13} />
                  {data.location}
                </p>
              )}
            </div>
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

        <div className="mt-5 grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-gray-50 p-3">
            <div className="flex items-center gap-1 text-amber-500">
              <Star size={14} className="fill-current" />
              <span className="text-sm font-semibold">
                {data.average_rating ?? "New"}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-gray-400">
              {data.reviews_count} review{data.reviews_count !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-3">
            <p className="text-sm font-semibold text-pf-purple">
              {data.experience_years !== null && data.experience_years !== undefined
                ? `${data.experience_years} yrs`
                : "—"}
            </p>
            <p className="mt-1 text-[11px] text-gray-400">Experience</p>
          </div>

          <div className="rounded-xl bg-gray-50 p-3">
            <p className="text-sm font-semibold text-pf-purple">
              {rate ? `${rate} FCFA` : "—"}
            </p>
            <p className="mt-1 text-[11px] text-gray-400">Indicative rate</p>
          </div>
        </div>

        {loading && (
          <p className="py-8 text-center text-sm text-gray-400">Loading profile…</p>
        )}

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-600">
            {error}
          </p>
        )}

        {profile && (
          <>
            {profile.bio && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-900">About</h3>
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-600">
                  {profile.bio}
                </p>
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-900">Subjects</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {(profile.subjects ?? []).length === 0 ? (
                  <span className="text-xs text-gray-400">No validated subject yet</span>
                ) : (
                  profile.subjects.map((subject) => (
                    <span
                      key={subject.id}
                      className="rounded-full bg-gray-50 px-2.5 py-1 text-xs text-gray-600"
                    >
                      {subject.name}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-900">Availability</h3>

              {availability.length === 0 ? (
                <p className="mt-2 text-xs text-gray-400">No availability set.</p>
              ) : (
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {availability.map((day) => (
                    <div
                      key={day.value}
                      className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2"
                    >
                      <span className="text-sm text-gray-700">{day.label}</span>
                      <span className="text-xs text-gray-500">
                        {day.slots
                          .map((slot) => `${slot.start_time}–${slot.end_time}`)
                          .join(", ")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-900">Recent reviews</h3>

              {(profile.recent_reviews ?? []).length === 0 ? (
                <p className="mt-2 text-xs text-gray-400">No review yet.</p>
              ) : (
                <div className="mt-2 divide-y divide-gray-100">
                  {profile.recent_reviews.map((review, index) => (
                    <div key={index} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={13}
                              className={
                                star <= Number(review.rating)
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-gray-200"
                              }
                            />
                          ))}
                        </div>

                        <span className="text-xs text-gray-400">
                          {[review.reviewer, formatDate(review.created_at)]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                      </div>

                      {review.comment && (
                        <p className="mt-1.5 text-sm text-gray-600">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>

          <button
            type="button"
            onClick={() => onRequest(data)}
            className="rounded-lg bg-pf-purple px-4 py-2.5 text-sm font-medium text-white hover:bg-pf-purple-dark"
          >
            Request teacher
          </button>
        </div>
      </section>
    </div>
  );
}

/* ========================================================= */
/* REQUEST MODAL                                               */
/* ========================================================= */

function RequestModal({ teacher, children, preferredSubjectId, onClose }) {
  const navigate = useNavigate();
  const subjects = teacher.subjects ?? [];

  const [form, setForm] = useState({
    learner_id: "",
    subject_id: subjects.some((s) => s.id === preferredSubjectId)
      ? preferredSubjectId
      : subjects.length === 1
        ? subjects[0].id
        : "",
    location: "",
    day: "",
    start: "",
    end: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const child = children.find((item) => item.id === form.learner_id);

  // Simple avertissement : le serveur reste l'autorité sur l'éligibilité.
  const sectionMismatch =
    child?.section &&
    teacher.section &&
    teacher.section !== "bilingual" &&
    teacher.section !== child.section;

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  }

  function handleChildChange(learnerId) {
    const selected = children.find((item) => item.id === learnerId);
    setForm((current) => ({
      ...current,
      learner_id: learnerId,
      location: current.location || selected?.location || "",
    }));
    setError("");
  }

  async function submit(event) {
    event.preventDefault();
    setError("");

    if (!form.learner_id || !form.subject_id || !form.location.trim()) {
      setError("Please choose a child, a subject and a location.");
      return;
    }

    if (form.day) {
      if (!form.start || !form.end) {
        setError("Please enter the start and end times for the chosen day.");
        return;
      }
      if (form.end <= form.start) {
        setError("The end time must be after the start time.");
        return;
      }
    }

    setSubmitting(true);

    try {
      await apiFetch(`/teachers/${teacher.teacher_id}/request`, {
        method: "POST",
        body: JSON.stringify({
          learner_id: form.learner_id,
          subject_id: form.subject_id,
          location: form.location.trim(),
          preferred_day: form.day || undefined,
          preferred_start_time: form.day ? form.start : undefined,
          preferred_end_time: form.day ? form.end : undefined,
        }),
      });

      navigate("/suivi-demande");
    } catch (err) {
      // Rien n'a été enregistré si le serveur refuse (éligibilité, doublon…).
      setError(err?.message || "Unable to send this request.");
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-pf-purple">
              Tutoring request
            </p>

            <h2 className="mt-1 text-lg font-semibold text-gray-900">
              Request {teacher.display_name}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Nothing is saved until you send this request.
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

        {children.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-gray-500">
              Add a child first to request a teacher.
            </p>

            <Link
              to="/parent-children"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-pf-purple px-4 py-2.5 text-sm font-medium text-white hover:bg-pf-purple-dark"
            >
              Go to My Children
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
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
                value={form.learner_id}
                onChange={(event) => handleChildChange(event.target.value)}
                className={inputClass}
              >
                <option value="">Select a child</option>
                {children.map((item) => (
                  <option key={item.id} value={item.id}>
                    {getLearnerName(item)}
                  </option>
                ))}
              </select>

              {sectionMismatch && (
                <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
                  This teacher works in the {teacher.section} section, your child
                  is in the {child.section} section. The request will probably be
                  refused.
                </p>
              )}
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
                value={form.subject_id}
                onChange={(event) => update("subject_id", event.target.value)}
                className={inputClass}
              >
                <option value="">Select a subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="request-location"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Where should the lessons take place?
              </label>

              <input
                id="request-location"
                value={form.location}
                onChange={(event) => update("location", event.target.value)}
                placeholder="e.g. Bonamoussadi"
                className={inputClass}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="relative">
                <select
                  aria-label="Preferred day"
                  value={form.day}
                  onChange={(event) => update("day", event.target.value)}
                  className={`${inputClass} appearance-none pr-9`}
                >
                  <option value="">Preferred day (optional)</option>
                  {DAYS.map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>

              <input
                type="time"
                aria-label="Start time"
                disabled={!form.day}
                value={form.start}
                onChange={(event) => update("start", event.target.value)}
                className={`${inputClass} disabled:bg-gray-50`}
              />

              <input
                type="time"
                aria-label="End time"
                disabled={!form.day}
                value={form.end}
                onChange={(event) => update("end", event.target.value)}
                className={`${inputClass} disabled:bg-gray-50`}
              />
            </div>

            <p className="text-xs leading-5 text-gray-500">
              The administration will validate this assignment and set the final
              price. You will be able to pay once the price is confirmed.
            </p>

            {error && (
              <p role="alert" className="text-sm text-red-600">
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
                disabled={submitting}
                className="rounded-lg bg-pf-purple px-4 py-2.5 text-sm font-medium text-white hover:bg-pf-purple-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Sending…" : "Send request"}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}

/* ========================================================= */
/* PAGE                                                        */
/* ========================================================= */

export default function ParentFindTeacherPage() {
  const [subjects, setSubjects] = useState([]);
  const [children, setChildren] = useState([]);

  // Filtres : tous facultatifs. Sans filtre, tous les enseignants approuvés.
  const [location, setLocation] = useState("");
  const [appliedLocation, setAppliedLocation] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [section, setSection] = useState("");
  const [day, setDay] = useState("");
  const [page, setPage] = useState(1);

  const [teachers, setTeachers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [profileTeacher, setProfileTeacher] = useState(null);
  const [requestTeacher, setRequestTeacher] = useState(null);

  const latestRequest = useRef(0);

  // Listes de référence : un échec (ex. /me/children) ne bloque pas la page.
  useEffect(() => {
    let cancelled = false;

    Promise.allSettled([apiFetch("/subjects"), apiFetch("/me/children")]).then(
      ([subjectsRes, childrenRes]) => {
        if (cancelled) return;
        if (subjectsRes.status === "fulfilled") setSubjects(toList(subjectsRes.value));
        if (childrenRes.status === "fulfilled") setChildren(toList(childrenRes.value));
      }
    );

    return () => {
      cancelled = true;
    };
  }, []);

  // Recherche du quartier : on attend la fin de la frappe.
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppliedLocation(location.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [location]);

  const loadTeachers = useCallback(async () => {
    const params = new URLSearchParams();
    if (appliedLocation) params.set("location", appliedLocation);
    if (subjectId) params.set("subject_id", subjectId);
    if (section) params.set("section", section);
    if (day) params.set("day", day);
    params.set("page", String(page));

    const requestId = ++latestRequest.current;
    setLoading(true);
    setError("");

    try {
      const response = await apiFetch(`/teachers?${params.toString()}`);
      if (requestId !== latestRequest.current) return; // réponse périmée

      const result = toPage(response);
      setTeachers(result.items);
      setMeta(result.meta);
    } catch (err) {
      if (requestId !== latestRequest.current) return;
      setError(err?.message || "Unable to load the teachers.");
    } finally {
      if (requestId === latestRequest.current) setLoading(false);
    }
  }, [appliedLocation, subjectId, section, day, page]);

  useEffect(() => {
    loadTeachers();
  }, [loadTeachers]);

  const hasFilters = Boolean(location || subjectId || section || day);

  function resetFilters() {
    setLocation("");
    setAppliedLocation("");
    setSubjectId("");
    setSection("");
    setDay("");
    setPage(1);
  }

  function changeFilter(setter) {
    return (value) => {
      setter(value);
      setPage(1);
    };
  }

  const lastPage = meta?.last_page ?? 1;

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
                  Browse our validated teachers and open their profile. Nothing
                  is created until you send a request.
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

          {/* FILTERS (tous facultatifs) */}
          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="grid gap-3 lg:grid-cols-[1fr_210px_170px_190px_auto]">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Search by neighbourhood..."
                  aria-label="Search by neighbourhood"
                  className={`${inputClass} pl-10 pr-10`}
                />

                {location && (
                  <button
                    type="button"
                    onClick={() => setLocation("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="relative">
                <select
                  aria-label="Subject"
                  value={subjectId}
                  onChange={(event) => changeFilter(setSubjectId)(event.target.value)}
                  className={`${inputClass} appearance-none pr-9`}
                >
                  <option value="">All subjects</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>

              <div className="relative">
                <select
                  aria-label="Section"
                  value={section}
                  onChange={(event) => changeFilter(setSection)(event.target.value)}
                  className={`${inputClass} appearance-none pr-9`}
                >
                  <option value="">All sections</option>
                  <option value="english">English</option>
                  <option value="french">French</option>
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>

              <div className="relative">
                <select
                  aria-label="Available on"
                  value={day}
                  onChange={(event) => changeFilter(setDay)(event.target.value)}
                  className={`${inputClass} appearance-none pr-9`}
                >
                  <option value="">Any day</option>
                  {DAYS.map((item) => (
                    <option key={item.value} value={item.value}>
                      Available {item.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>

              <button
                type="button"
                onClick={resetFilters}
                disabled={!hasFilters}
                className="rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Reset
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-400">
                {meta
                  ? `${meta.total} teacher${meta.total !== 1 ? "s" : ""} found`
                  : "\u00A0"}
              </p>

              <div className="hidden items-center gap-2 text-xs text-gray-400 sm:flex">
                <BookOpen size={14} />
                Verified teachers
              </div>
            </div>
          </section>

          {error && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600"
            >
              {error}
            </div>
          )}

          {/* RESULTS */}
          <section className="mt-6">
            {loading && teachers.length === 0 ? (
              <p className="py-16 text-center text-sm text-gray-400">
                Loading teachers…
              </p>
            ) : teachers.length > 0 ? (
              <div
                className={`grid gap-5 transition-opacity md:grid-cols-2 xl:grid-cols-3 ${
                  loading ? "opacity-60" : ""
                }`}
              >
                {teachers.map((teacher) => (
                  <TeacherCard
                    key={teacher.teacher_id}
                    teacher={teacher}
                    onProfile={setProfileTeacher}
                    onRequest={setRequestTeacher}
                  />
                ))}
              </div>
            ) : (
              !error && (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
                  <Search size={40} className="mx-auto text-gray-300" />

                  <h2 className="mt-4 font-semibold text-gray-900">
                    No teacher found
                  </h2>

                  <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                    {hasFilters
                      ? "Try removing a filter to see more teachers."
                      : "No validated teacher is available yet."}
                  </p>

                  {hasFilters && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="mt-5 rounded-lg bg-pf-purple px-4 py-2.5 text-sm font-medium text-white hover:bg-pf-purple-dark"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              )
            )}

            {lastPage > 1 && (
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page <= 1 || loading}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>

                <span className="text-sm text-gray-500">
                  Page {page} of {lastPage}
                </span>

                <button
                  type="button"
                  onClick={() => setPage((current) => Math.min(lastPage, current + 1))}
                  disabled={page >= lastPage || loading}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      {profileTeacher && (
        <ProfileModal
          teacher={profileTeacher}
          onClose={() => setProfileTeacher(null)}
          onRequest={(teacher) => {
            setProfileTeacher(null);
            setRequestTeacher(teacher);
          }}
        />
      )}

      {requestTeacher && (
        <RequestModal
          teacher={requestTeacher}
          children={children}
          preferredSubjectId={subjectId}
          onClose={() => setRequestTeacher(null)}
        />
      )}
    </div>
  );
}