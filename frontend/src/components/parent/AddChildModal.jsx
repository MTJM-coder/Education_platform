import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { apiFetch } from "../../lib/apiClient";

// Accepte [..], { data: [..] } ou { data: { data: [..] } } selon apiFetch.
function toList(response) {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.data?.data)) return response.data.data;
    return [];
}

// Composant partagé (page My Children + tableau de bord).
// onAdded(fullName) est appelé après la création ; la page se charge de se recharger.
export default function AddChildModal({ onClose, onAdded }) {
    const [levels, setLevels] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState(true);

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        section: "",
        level_id: "",
        class_id: "",
        school_name: "",
        location: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                const [levelsRes, classesRes] = await Promise.all([
                    apiFetch("/levels"),
                    apiFetch("/levels/classes"),
                ]);

                if (cancelled) return;
                setLevels(toList(levelsRes));
                setClasses(toList(classesRes));
            } catch (err) {
                if (!cancelled) {
                    setError(err?.message || "Unable to load levels and classes.");
                }
            } finally {
                if (!cancelled) setLoadingOptions(false);
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, []);

    function updateField(event) {
        setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    }

    // Si les classes portent un level_id, on ne propose que celles du niveau choisi.
    const classOptions = form.level_id
        ? classes.filter(
            (item) => item.level_id === undefined || item.level_id === form.level_id
        )
        : [];

    async function submit(event) {
        event.preventDefault();
        setError("");

        if (
            !form.first_name.trim() ||
            !form.last_name.trim() ||
            !form.section ||
            !form.level_id ||
            !form.class_id
        ) {
            setError("First name, last name, section, level and class are required.");
            return;
        }

        setSubmitting(true);

        try {
            await apiFetch("/me/children", {
                method: "POST",
                body: JSON.stringify({
                    first_name: form.first_name.trim(),
                    last_name: form.last_name.trim(),
                    section: form.section,
                    level_id: form.level_id,
                    class_id: form.class_id,
                    school_name: form.school_name.trim() || undefined,
                    location: form.location.trim() || undefined,
                }),
            });

            await onAdded(`${form.first_name.trim()} ${form.last_name.trim()}`);
        } catch (err) {
            setError(err?.message || "Unable to add this child.");
            setSubmitting(false);
        }
    }

    const inputClass =
        "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100";
    const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";

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
                aria-labelledby="add-child-title"
                className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h2 id="add-child-title" className="text-lg font-semibold text-gray-900">
                            Add a child
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Enter the learner's basic information.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close form"
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={submit} className="mt-6 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="child-first-name" className={labelClass}>
                                First name *
                            </label>
                            <input
                                id="child-first-name"
                                name="first_name"
                                value={form.first_name}
                                onChange={updateField}
                                className={inputClass}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="child-last-name" className={labelClass}>
                                Last name *
                            </label>
                            <input
                                id="child-last-name"
                                name="last_name"
                                value={form.last_name}
                                onChange={updateField}
                                className={inputClass}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                            <label htmlFor="child-section" className={labelClass}>
                                Section *
                            </label>
                            <select
                                id="child-section"
                                name="section"
                                value={form.section}
                                onChange={updateField}
                                className={inputClass}
                            >
                                <option value="">Select</option>
                                <option value="english">English</option>
                                <option value="french">French</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="child-level" className={labelClass}>
                                School level *
                            </label>
                            <select
                                id="child-level"
                                name="level_id"
                                value={form.level_id}
                                disabled={loadingOptions}
                                onChange={(event) =>
                                    setForm((current) => ({
                                        ...current,
                                        level_id: event.target.value,
                                        class_id: "",
                                    }))
                                }
                                className={inputClass}
                            >
                                <option value="">Select</option>
                                {levels.map((level) => (
                                    <option key={level.id} value={level.id}>
                                        {level.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="child-class" className={labelClass}>
                                Class *
                            </label>
                            <select
                                id="child-class"
                                name="class_id"
                                value={form.class_id}
                                disabled={loadingOptions || !form.level_id}
                                onChange={updateField}
                                className={inputClass}
                            >
                                <option value="">Select</option>
                                {classOptions.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="child-school" className={labelClass}>
                            School (optional)
                        </label>
                        <input
                            id="child-school"
                            name="school_name"
                            value={form.school_name}
                            onChange={updateField}
                            placeholder="School name"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label htmlFor="child-location" className={labelClass}>
                            Location (optional)
                        </label>
                        <input
                            id="child-location"
                            name="location"
                            value={form.location}
                            onChange={updateField}
                            placeholder="e.g. Bonamoussadi, Douala"
                            className={inputClass}
                        />
                    </div>

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
                            {submitting ? "Adding…" : "Add child"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}