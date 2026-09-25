import { useEffect, useMemo, useState } from "react";
import { BookOpen, Check, Edit3, GraduationCap, Plus, Search, Trash2, UsersRound, X } from "lucide-react";
import SidebarAdmin from "../components/admin/SidebarAdmin";
import { apiFetch } from "../lib/apiClient";

const TABS = ["Subjects", "Levels", "Classes"];

export default function AdminAcademicPage() {
    const [activeTab, setActiveTab] = useState("Subjects");
    const [subjects, setSubjects] = useState([]);
    const [levels, setLevels] = useState([]);
    const [classes, setClasses] = useState([]);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const [modal, setModal] = useState(null);

    useEffect(() => {
        async function loadAcademicData() {
            try {
                const [subjectsResponse, levelsResponse, classesResponse] = await Promise.all([
                    apiFetch("/subjects"),
                    apiFetch("/levels"),
                    apiFetch("/levels/classes"),
                ]);
                setSubjects(subjectsResponse?.data ?? []);
                setLevels(levelsResponse?.data ?? []);
                setClasses(classesResponse?.data ?? []);
            } catch (loadError) {
                setError(loadError.message);
            }
        }
        loadAcademicData();
    }, []);

    const query = search.toLowerCase().trim();
    const filteredSubjects = useMemo(() => subjects.filter((item) => !query || item.name?.toLowerCase().includes(query)), [subjects, query]);
    const filteredLevels = useMemo(() => levels.filter((item) => !query || item.name?.toLowerCase().includes(query)), [levels, query]);
    const filteredClasses = useMemo(() => classes.filter((item) => !query || item.name?.toLowerCase().includes(query) || item.level?.name?.toLowerCase().includes(query)), [classes, query]);

    async function deleteItem(type, id) {
        if (!window.confirm(`Delete this ${type}?`)) return;
        try {
            const path = type === "subject" ? `/admin/subjects/${id}` : type === "level" ? `/admin/levels/${id}` : `/admin/classes/${id}`;
            await apiFetch(path, { method: "DELETE" });
            if (type === "subject") setSubjects((items) => items.filter((item) => item.id !== id));
            if (type === "level") setLevels((items) => items.filter((item) => item.id !== id));
            if (type === "class") setClasses((items) => items.filter((item) => item.id !== id));
        } catch (deleteError) {
            setError(deleteError.message);
        }
    }
    const resource = activeTab === "Subjects" ? "subject" : activeTab === "Levels" ? "level" : "class";
    const items = activeTab === "Subjects" ? filteredSubjects : activeTab === "Levels" ? filteredLevels : filteredClasses;

    function refreshItem(type, savedItem, editingId) {
        if (type === "subject") {
            setSubjects((current) => editingId ? current.map((item) => item.id === editingId ? { ...item, ...savedItem } : item) : [...current, savedItem]);
        }
        if (type === "level") {
            setLevels((current) => editingId ? current.map((item) => item.id === editingId ? { ...item, ...savedItem } : item) : [...current, savedItem]);
        }
        if (type === "class") {
            setClasses((current) => editingId ? current.map((item) => item.id === editingId ? { ...item, ...savedItem } : item) : [...current, savedItem]);
        }
        setModal(null);
    }

    return (
        <div className="min-h-screen bg-[#FAF9FB] font-sans text-[#302C38]">
            <SidebarAdmin activeItem="Academic" />
            <main className="lg:ml-64">
                <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-5 sm:px-8">
                    <p className="hidden text-sm text-gray-500 lg:block">Academic Management</p>
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pf-purple text-xs font-semibold text-white">SA</div>
                </header>
                <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8">
                    <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-medium text-pf-purple">ACADEMIC MANAGEMENT</p>
                            <h1 className="mt-1 font-serif text-2xl font-medium text-pf-purple-dark sm:text-3xl">Academic Structure</h1>
                            <p className="mt-2 max-w-2xl text-sm text-gray-500">Manage subjects, school levels and classes available on the platform.</p>
                        </div>
                        <button type="button" onClick={() => setModal({ type: resource, item: null })} className="inline-flex items-center justify-center gap-2 rounded-lg bg-pf-purple px-4 py-2.5 text-sm font-medium text-white hover:bg-pf-purple-dark">
                            <Plus className="h-4 w-4" /> Add {resource}
                        </button>
                    </section>

                    <section className="mt-7 grid gap-4 sm:grid-cols-3">
                        <StatCard icon={BookOpen} label="Subjects" value={subjects.length} />
                        <StatCard icon={GraduationCap} label="School levels" value={levels.length} />
                        <StatCard icon={UsersRound} label="Classes" value={classes.length} />
                    </section>

                    <section className="mt-7 rounded-2xl border border-gray-200 bg-white">
                        <div className="border-b border-gray-100 px-5 sm:px-6">
                            <div className="flex gap-6 overflow-x-auto">
                                {TABS.map((tab) => <button key={tab} type="button" onClick={() => { setActiveTab(tab); setSearch(""); }} className={`relative whitespace-nowrap py-4 text-sm font-medium ${activeTab === tab ? "text-pf-purple" : "text-gray-400 hover:text-gray-600"}`}>{tab}{activeTab === tab && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-pf-purple" />}</button>)}
                            </div>
                        </div>
                        <div className="border-b border-gray-100 p-5 sm:p-6">
                            <div className="relative max-w-md">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${activeTab.toLowerCase()}...`} className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-pf-purple" />
                            </div>
                        </div>
                        {error && <p className="m-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
                        <AcademicTable type={resource} items={items} onEdit={(item) => setModal({ type: resource, item })} onDelete={deleteItem} />
                    </section>
                </div>
            </main>
            {modal && <AcademicModal type={modal.type} item={modal.item} levels={levels} onClose={() => setModal(null)} onSaved={refreshItem} />}
        </div>
    );
}

function StatCard({ icon: Icon, label, value }) {
    return <div className="rounded-2xl border border-gray-200 bg-white p-5"><div className="flex items-center justify-between"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pf-purple-light"><Icon className="h-5 w-5 text-pf-purple" /></div><span className="font-serif text-2xl text-pf-purple-dark">{value}</span></div><p className="mt-4 text-xs text-gray-500">{label}</p></div>;
}

function AcademicTable({ type, items, onEdit, onDelete }) {
    const labels = type === "subject" ? ["Subject", "Levels"] : type === "level" ? ["Level", "Classes"] : ["Class", "Level"];
    return <div className="overflow-x-auto">
        <table className="w-full min-w-[650px]">
            <thead>
                <tr className="border-b border-gray-100 bg-[#FCFBFD] text-left">
                    <TableHead>{labels[0]}</TableHead><TableHead>{labels[1]}</TableHead>
                    <TableHead>Actions</TableHead>
                </tr>
            </thead>
            <tbody>
                {items.map((item) =>
                    <tr key={item.id} className="border-b border-gray-100 last:border-0 hover:bg-[#FCFBFD]">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pf-purple-light">
                                    <BookOpen className="h-5 w-5 text-pf-purple" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-pf-purple-dark">{item.name}</p>
                                    <p className="text-[10px] text-gray-400">{item.code ?? item.name.slice(0,4)}</p>
                                </div>
                            </div>
                        </td>
                        <td className="px-4 py-4 text-xs font-medium">{type === "subject" ? <div className="flex flex-wrap gap-1">{(item.levels ?? []).map((level) => <span key={level.id ?? level} className="rounded-full bg-pf-purple-light px-2 py-1 text-[10px] text-pf-purple">{level.name ?? level}</span>)}</div> : type === "level" ? item.classrooms?.length ?? 0 : item.level?.name ?? item.level ?? "—"}</td>
                        <td className="px-4 py-4"><div className="flex items-center gap-1">
                            <button type="button" onClick={() => onEdit(item)} title="Edit" className="rounded-lg p-2 text-gray-400 hover:bg-pf-purple-light hover:text-pf-purple"><Edit3 className="h-4 w-4" /></button>
                            <button type="button" onClick={() => onDelete(type, item.id)} title="Delete" className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                        </div>
                        </td>
                    </tr>)}
            </tbody>
        </table>
        {items.length === 0 &&
            <div className="py-16 text-center">
                <BookOpen className="mx-auto h-8 w-8 text-gray-300" />
                <p className="mt-4 text-sm text-gray-400">Nothing found</p>
            </div>}
    </div>;
}

function TableHead({ children }) {
    return <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">{children}</th>;
}

function AcademicModal({ type, item, levels, onClose, onSaved }) {
    const [name, setName] = useState(item?.name ?? "");
    const [levelId, setLevelId] = useState(String(item?.level_id ?? item?.level?.id ?? ""));
    const [levelIds, setLevelIds] = useState((item?.levels ?? []).map((level) => String(level.id)));
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    async function submit(event) {
        event.preventDefault();
        setError("");
        const editingId = item?.id;
        let path;
        let body = { name: name.trim() };

        if (type === "subject") {
            if (!levelIds.length) {
                setError("Select at least one level.");
                return;
            }
            body.level_ids = levelIds;
            path = editingId ? `/admin/subjects/${editingId}` : "/admin/subjects";
        } else if (type === "level") {
            path = editingId ? `/admin/levels/${editingId}` : "/admin/levels";
        } else {
            if (!levelId) {
                setError("Select a level.");
                return;
            }
            path = editingId ? `/admin/classes/${editingId}` : `/admin/levels/${levelId}/classes`;
        }

        setSaving(true);
        try {
            const response = await apiFetch(path, { method: editingId ? "PATCH" : "POST", body: JSON.stringify(body) });
            onSaved(type, response?.data ?? response, editingId);
        } catch (saveError) {
            setError(saveError.message);
        } finally {
            setSaving(false);
        }
    }

    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true"><form onSubmit={submit} className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"><div className="flex items-center justify-between border-b border-gray-100 px-5 py-4"><h2 className="font-serif text-xl text-pf-purple-dark">{item ? "Edit" : "Add"} {type}</h2><button type="button" onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100" title="Close"><X className="h-5 w-5" /></button></div><div className="space-y-5 p-5"><div><label htmlFor="academic-name" className="text-xs font-medium text-gray-600">Name</label><input id="academic-name" value={name} onChange={(event) => setName(event.target.value)} required autoFocus className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-pf-purple" /></div>{type === "subject" && <div><p className="text-xs font-medium text-gray-600">Levels</p><div className="mt-2 grid gap-2 sm:grid-cols-2">{levels.map((level) => <label key={level.id} className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm"><input type="checkbox" checked={levelIds.includes(String(level.id))} onChange={() => setLevelIds((current) => current.includes(String(level.id)) ? current.filter((id) => id !== String(level.id)) : [...current, String(level.id)])} className="h-4 w-4 accent-pf-purple" />{level.name}</label>)}</div></div>}{type === "class" && <div><label htmlFor="academic-level" className="text-xs font-medium text-gray-600">Level</label><select id="academic-level" value={levelId} onChange={(event) => setLevelId(event.target.value)} required className="mt-1.5 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-pf-purple"><option value="">Select a level</option>{levels.map((level) => <option key={level.id} value={level.id}>{level.name}</option>)}</select></div>}{error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}</div><div className="flex justify-end border-t border-gray-100 px-5 py-4"><button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-pf-purple px-4 py-2.5 text-sm font-medium text-white hover:bg-pf-purple-dark disabled:opacity-60"><Check className="h-4 w-4" />{saving ? "Saving..." : item ? "Save changes" : `Add ${type}`}</button></div></form></div>;
}
