import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
    ArrowLeft,
    Award,
    BookOpen,
    CalendarDays,
    CheckCircle2,
    ChevronRight,
    Clock,
    Download,
    Eye,
    FileText,
    Mail,
    MapPin,
    MoreHorizontal,
    Phone,
    ShieldCheck,
    Star,
    UserRound,
    UsersRound,
    Wallet,
    X,
    XCircle,
} from "lucide-react";
import SidebarAdmin from "../components/admin/SidebarAdmin";
import { apiFetch } from "../lib/apiClient";

// Statuts reels cote backend (teachers.validation_status). "Suspended"
// retire : n'existe pas dans la contrainte CHECK de la table.
const STATUS_CONFIG = {
    pending: { label: "Pending", tone: "amber" },
    approved: { label: "Approved", tone: "green" },
    rejected: { label: "Rejected", tone: "red" },
};

// Les 4 colonnes de Teacher, pas une relation "documents" — le controleur
// show() ne renvoie pas ca sous cette forme, on la construit ici.
const DOCUMENT_FIELDS = [
    { key: "id_card_url", name: "Pièce d'identité" },
    { key: "cv_url", name: "CV" },
    { key: "degrees_url", name: "Diplômes" },
    { key: "location_plan_url", name: "Plan de localisation" },
];

function getDocuments(teacher) {
    return DOCUMENT_FIELDS.filter(({ key }) => teacher?.[key]).map(({ key, name }) => ({
        name,
        url: teacher[key],
    }));
}

function getUniqueLearnerCount(teacher) {
    const uniqueLearnerIds = new Set(
        (teacher?.assignments ?? [])
            .map((assignment) => assignment?.tutoring_request?.learner_id)
            .filter(Boolean)
    );
    return uniqueLearnerIds.size;
}

function getFlattenedSessions(teacher) {
    return (teacher?.assignments ?? []).flatMap((assignment) =>
        (assignment?.sessions ?? []).map((session) => ({
            ...session,
            subjectName: assignment?.tutoring_request?.subject?.name ?? "—",
            // TODO: learners n'a pas encore first_name/last_name en base
            // (cf. discussion sur le schema) — placeholder en attendant.
            learnerLabel: assignment?.tutoring_request?.learner_id
                ? `Élève #${assignment.tutoring_request.learner_id}`
                : "—",
        }))
    );
}

function getUniqueSessionCount(teacher) {
    return getFlattenedSessions(teacher).length;
}

function getSessionCompletedCount(teacher) {
    return getFlattenedSessions(teacher).filter((s) => s.status === "completed").length;
}

function getEarningsCount(teacher) {
    return (teacher?.assignments ?? [])
        .flatMap((assignment) => assignment?.payments ?? [])
        .filter((payment) => payment?.status === "paid")
        .reduce((total, payment) => total + Number(payment.teacher_amount ?? 0), 0);
}

export default function AdminTeacherDetailsPage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [teacherError, setTeacherError] = useState("");
    const [teacher, setTeacher] = useState(null);
    const [status, setStatus] = useState(null);
    const [savingStatus, setSavingStatus] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const { id } = useParams();

    useEffect(() => {
        const fetchTeacher = async () => {
            try {
                const response = await apiFetch(`/admin/teachers/${id}`);
                setTeacher(response.teacher);
                setStatus(response.teacher?.validation_status ?? "pending");
            } catch (error) {
                setTeacherError(error.message);
                setShowErrorModal(true);
            }
        };
        fetchTeacher();
    }, [id]);

    async function handleValidate(newStatus, reason = "") {
        setSavingStatus(true);
        try {
            await apiFetch(`/admin/teachers/${id}/validate`, {
                method: "PATCH",
                body: JSON.stringify({ status: newStatus, ...(reason && { reason }) }),
            });
            setStatus(newStatus);
            setShowRejectModal(false);
            setRejectionReason("");
        } catch (error) {
            setTeacherError(error.message);
            setShowErrorModal(true);
        } finally {
            setSavingStatus(false);
        }
    }

    async function handleRejectSubmit(event) {
        event.preventDefault();
        const reason = rejectionReason.trim();

        if (!reason) {
            return;
        }

        await handleValidate("rejected", reason);
    }

    const documents = useMemo(() => getDocuments(teacher), [teacher]);
    const recentSessions = useMemo(() => getFlattenedSessions(teacher), [teacher]);
    const levels = useMemo(() => {
        const names = (teacher?.classrooms ?? []).map((c) => c?.level?.name).filter(Boolean);
        return [...new Set(names)];
    }, [teacher]);

    const errorModal = (
        showErrorModal && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4" role="dialog" aria-modal="true">
                <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

                    {/* Header */}
                    <div className="flex items-center justify-between border-b px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                                <XCircle className="h-5 w-5 text-red-600" />
                            </div>

                            <h2 className="text-lg font-semibold text-gray-900">
                                Validation impossible
                            </h2>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowErrorModal(false)}
                            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Message */}
                    <div className="px-6 py-5">
                        <p className="text-sm leading-6 text-gray-600">
                            {teacherError}
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end border-t px-6 py-4">
                        <button
                            type="button"
                            onClick={() => setShowErrorModal(false)}
                            className="rounded-lg bg-[#5B2A9D] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#3F1F70]"
                        >
                            Compris
                        </button>
                    </div>
                </div>
            </div>
        )
    );

    if (!teacher) {
        return (
            <>
                {errorModal}
                <div className="min-h-screen bg-[#FAF9FB] font-sans">
                    <SidebarAdmin activeItem="Teacher Management" />
                    <main className="p-8 lg:ml-64">
                        <p className="text-sm text-gray-400">Chargement…</p>
                    </main>
                </div>
            </>
        );
    }

    return (
        <>
            {errorModal}
            <div className="min-h-screen bg-[#FAF9FB] font-sans text-[#302C38]">
                <SidebarAdmin activeItem="Teacher Management" />

                <main className="lg:ml-64">
                    {/* HEADER */}
                    <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-5 sm:px-8">
                        <div className="flex items-center gap-3">
                            <a
                                href="/admin-teachers"
                                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-pf-purple"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </a>
                            <p className="hidden text-sm text-gray-500 sm:block">
                                Teacher Management / Teacher #{teacher?.user_id}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden text-right sm:block">
                                <p className="text-xs font-semibold text-pf-purple-dark">Super Admin</p>
                                <p className="text-[11px] text-gray-400">Platform Administrator</p>
                            </div>
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pf-purple text-xs font-semibold text-white">
                                SA
                            </div>
                        </div>
                    </header>

                    <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8">
                        {/* PAGE HEADER */}
                        <section className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                            <div className="flex items-start gap-4">
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-pf-purple text-xl font-semibold text-white">
                                    {(teacher?.user?.first_name?.[0] ?? "") + (teacher?.user?.last_name?.[0] ?? "")}
                                </div>

                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h1 className="font-serif text-2xl font-medium text-pf-purple-dark sm:text-3xl">
                                            {teacher?.user?.first_name} {teacher?.user?.last_name}
                                        </h1>
                                        <StatusBadge status={status} />
                                    </div>

                                    <p className="mt-1 text-sm text-gray-500">
                                        {teacher?.rank ?? "—"} · Teacher #{teacher?.user_id}
                                    </p>

                                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-400">
                                        <span className="flex items-center gap-1.5">
                                            <MapPin className="h-3.5 w-3.5" />
                                            {teacher?.location ?? "—"}
                                        </span>
                                        {teacher?.user?.created_at && (
                                            <span className="flex items-center gap-1.5">
                                                <CalendarDays className="h-3.5 w-3.5" />
                                                Joined {new Date(teacher.user.created_at).toLocaleDateString("fr-FR")}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="relative flex gap-2">
                                {status === "approved" ? (
                                    <button
                                        type="button"
                                        disabled={savingStatus}
                                        onClick={() => setShowRejectModal(true)}
                                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3.5 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50 disabled:opacity-60"
                                    >
                                        <XCircle className="h-4 w-4" />
                                        Reject teacher
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        disabled={savingStatus}
                                        onClick={() => handleValidate("approved")}
                                        className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-white px-3.5 py-2.5 text-sm font-medium text-green-600 transition hover:bg-green-50 disabled:opacity-60"
                                    >
                                        <CheckCircle2 className="h-4 w-4" />
                                        Approve teacher
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className="rounded-lg border border-gray-200 bg-white p-2.5 text-gray-500 hover:bg-gray-50"
                                >
                                    <MoreHorizontal className="h-5 w-5" />
                                </button>

                                {menuOpen && (
                                    <div className="absolute right-0 top-12 z-20 w-48 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg">

                                        <button type="button" onClick={()=>window.location.href=`/teacher-public-profile/${teacher?.user?.id}`} className="w-full rounded-lg px-3 py-2 text-left text-xs text-gray-600 hover:bg-gray-50">
                                            View public profile
                                        </button>

                                        {status === "approved" && <button type="button"
                                            disabled={savingStatus}
                                            onClick={() => {
                                                setMenuOpen(false);
                                                setShowRejectModal(true);
                                            }} className="w-full rounded-lg px-3 py-2 text-left text-xs text-red-500 hover:bg-red-50 disabled:opacity-60">
                                            Reject teacher
                                        </button>}
                                        {/* <button type="button" className="w-full rounded-lg px-3 py-2 text-left text-xs text-red-500 hover:bg-red-50">
                                            block teacher
                                        </button> */}
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* STATISTICS */}
                        <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                            <StatCard icon={UsersRound} label="Students" value={getUniqueLearnerCount(teacher)} />
                            <StatCard icon={CalendarDays} label="Sessions" value={getUniqueSessionCount(teacher)} />
                            <StatCard icon={CheckCircle2} label="Completed" value={getSessionCompletedCount(teacher)} />
                            <StatCard icon={Star} label="Rating" value={teacher?.stars ?? "—"} />
                            <StatCard icon={Wallet} label="Earnings" value={getEarningsCount(teacher)} />
                        </section>

                        {/* CONTENT */}
                        <div className="mt-7 grid gap-5 xl:grid-cols-[1.4fr_0.75fr]">
                            {/* LEFT */}
                            <div className="space-y-5">
                                {/* PROFILE */}
                                <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                                    <SectionTitle icon={UserRound} title="Teacher information" />
                                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                                        <InfoItem icon={Mail} label="Email" value={teacher?.user?.email} />
                                        <InfoItem icon={Phone} label="Phone" value={teacher?.user?.phone} />
                                        <InfoItem icon={MapPin} label="Location" value={teacher?.location} />
                                        <InfoItem icon={Clock} label="Experience" value={teacher?.experience_years ?? "-"} />
                                    </div>
                                    <div className="mt-5 border-t border-gray-100 pt-5">
                                        <p className="text-xs font-medium text-gray-400">Biography</p>
                                        <p className="mt-2 text-sm leading-6 text-gray-600">{teacher?.bio ?? "-"}</p>
                                    </div>
                                </section>

                                {/* ACADEMIC */}
                                <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                                    <SectionTitle icon={BookOpen} title="Teaching profile" />

                                    <div className="mt-5">
                                        <Label>Subjects</Label>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {teacher?.teacher_subjects?.map((subject) => (
                                                <span key={subject.id} className="rounded-full bg-pf-purple-light px-3 py-1.5 text-xs font-medium text-pf-purple">
                                                    {subject?.subject?.name ?? subject.id}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-5">
                                        <Label>Levels</Label>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {levels.map((level) => (
                                                <span key={level} className="rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-600">
                                                    {level}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-5">
                                        <Label>Classes</Label>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {teacher?.classrooms?.map((item) => (
                                                <span key={item.id} className="rounded-full border border-gray-200 px-3 py-1.5 text-xs text-gray-600">
                                                    {item.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </section>

                                {/* DOCUMENTS */}
                                <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                                    <div className="flex items-center justify-between">
                                        <SectionTitle icon={FileText} title="Verification documents" />
                                        <span className="text-xs text-gray-400">{documents.length} documents</span>
                                    </div>
                                    <div className="mt-5 divide-y divide-gray-100">
                                        {documents.map((doc) => (
                                            <DocumentRow key={doc.name} doc={doc} />
                                        ))}
                                    </div>
                                </section>

                                {/* RECENT SESSIONS */}
                                <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                                    <div className="flex items-center justify-between">
                                        <SectionTitle icon={CalendarDays} title="Recent sessions" />
                                        <a href="/admin-tutoring" className="inline-flex items-center gap-1 text-xs font-semibold text-pf-purple hover:underline">
                                            View all
                                            <ChevronRight className="h-3.5 w-3.5" />
                                        </a>
                                    </div>

                                    <div className="mt-5 overflow-x-auto">
                                        <table className="w-full min-w-[650px]">
                                            <thead>
                                                <tr className="border-b border-gray-100 text-left">
                                                    <th className="pb-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">Student</th>
                                                    <th className="pb-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">Subject</th>
                                                    <th className="pb-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">Date</th>
                                                    <th className="pb-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">Duration</th>
                                                    <th className="pb-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">Amount</th>
                                                    <th className="pb-3 text-right text-[10px] font-semibold uppercase tracking-wide text-gray-400">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {recentSessions.map((session, index) => (
                                                    <tr key={session.id ?? index} className="border-b border-gray-100 last:border-0">
                                                        <td className="py-3.5 text-xs font-medium text-pf-purple-dark">{session.learnerLabel}</td>
                                                        <td className="py-3.5 text-xs text-gray-500">{session.subjectName}</td>
                                                        <td className="py-3.5 text-xs text-gray-500">{session.session_date}</td>
                                                        <td className="py-3.5 text-xs text-gray-500">
                                                            {session.start_time}–{session.end_time}
                                                        </td>
                                                        <td className="py-3.5 text-xs font-medium text-pf-purple-dark">{session.amount ?? "—"}</td>
                                                        <td className="py-3.5 text-right">
                                                            <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-medium text-green-600">
                                                                {session.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </section>
                            </div>

                            {/* RIGHT */}
                            <aside className="space-y-5">
                                {/* RANK */}
                                <section className="rounded-2xl bg-pf-purple p-5 text-white">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-xs font-medium tracking-wide text-purple-200">TEACHER RANK</p>
                                            <h2 className="mt-2 font-serif text-2xl">{teacher?.rank ?? "—"}</h2>
                                            <p className="mt-1 text-xs text-purple-100">Based on performance and reliability</p>
                                        </div>
                                        <div className="rounded-xl bg-white/15 p-2.5">
                                            <Award className="h-5 w-5" />
                                        </div>
                                    </div>
                                </section>

                                {/* REPUTATION */}
                                <section className="rounded-2xl border border-gray-200 bg-white p-5">
                                    <SectionTitle icon={Star} title="Reputation" />
                                    <div className="mt-5 flex items-center gap-4">
                                        <div>
                                            <p className="font-serif text-3xl text-pf-purple-dark">{teacher?.stars ?? "—"}</p>
                                            <div className="mt-1 flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`h-3.5 w-3.5 ${star <= Math.round(teacher?.stars ?? 0) ? "fill-pf-gold text-pf-gold" : "text-gray-200"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="border-l border-gray-100 pl-4">
                                            <p className="text-sm font-semibold text-pf-purple-dark">{teacher?.reviews ?? 0}</p>
                                            <p className="text-[10px] text-gray-400">Reviews</p>
                                        </div>
                                    </div>
                                </section>

                                {/* EARNINGS */}
                                <section className="rounded-2xl border border-gray-200 bg-white p-5">
                                    <SectionTitle icon={Wallet} title="Financial overview" />
                                    <div className="mt-5">
                                        <p className="text-2xl font-semibold text-pf-purple-dark">{getEarningsCount(teacher)}</p>
                                        <p className="mt-1 text-xs text-gray-400">Total teacher earnings</p>
                                    </div>
                                    <div className="mt-5 space-y-3 border-t border-gray-100 pt-4">
                                        <DetailRow label="Completed sessions" value={getSessionCompletedCount(teacher)} />
                                        {/* TODO: getSessionCancelledCount(teacher) une fois defini */}
                                        <DetailRow label="Cancelled sessions" value={0} />
                                        <a href="/admin-finance" className="flex items-center justify-between pt-2 text-xs font-semibold text-pf-purple hover:underline">
                                            View financial details
                                            <ChevronRight className="h-3.5 w-3.5" />
                                        </a>
                                    </div>
                                </section>
                            </aside>
                        </div>
                    </div>
                </main>
            </div>

            {showRejectModal && (
                <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 px-4" role="dialog" aria-modal="true" aria-labelledby="reject-teacher-title">
                    <form onSubmit={handleRejectSubmit} className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b px-6 py-4">
                            <h2 id="reject-teacher-title" className="text-lg font-semibold text-gray-900">
                                Reject teacher
                            </h2>
                            <button
                                type="button"
                                onClick={() => setShowRejectModal(false)}
                                disabled={savingStatus}
                                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-60"
                                aria-label="Close"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="px-6 py-5">
                            <label htmlFor="rejection-reason" className="text-sm font-medium text-gray-700">
                                Reason for rejection
                            </label>
                            <textarea
                                id="rejection-reason"
                                value={rejectionReason}
                                onChange={(event) => setRejectionReason(event.target.value)}
                                maxLength={1000}
                                rows={5}
                                required
                                autoFocus
                                placeholder="Explain why this teacher is being rejected..."
                                className="mt-2 w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-pf-purple focus:ring-2 focus:ring-pf-purple/20"
                            />
                            <p className="mt-1 text-right text-xs text-gray-400">
                                {rejectionReason.length}/1000
                            </p>
                        </div>

                        <div className="flex justify-end gap-3 border-t px-6 py-4">
                            <button
                                type="button"
                                onClick={() => setShowRejectModal(false)}
                                disabled={savingStatus}
                                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-60"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={savingStatus || !rejectionReason.trim()}
                                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {savingStatus ? "Rejecting..." : "Reject teacher"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}

/* ========================================================= */
/* COMPONENTS                                                 */
/* ========================================================= */

function StatCard({ icon: Icon, label, value }) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pf-purple-light">
                    <Icon className="h-5 w-5 text-pf-purple" />
                </div>
                <span className="font-serif text-xl text-pf-purple-dark">{value}</span>
            </div>
            <p className="mt-4 text-xs text-gray-500">{label}</p>
        </div>
    );
}

function SectionTitle({ icon: Icon, title }) {
    return (
        <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pf-purple-light">
                <Icon className="h-4 w-4 text-pf-purple" />
            </div>
            <h2 className="font-serif text-lg text-pf-purple-dark">{title}</h2>
        </div>
    );
}

function InfoItem({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FAF9FB]">
                <Icon className="h-4 w-4 text-pf-purple" />
            </div>
            <div className="min-w-0">
                <p className="text-[10px] text-gray-400">{label}</p>
                <p className="mt-1 break-words text-sm font-medium text-pf-purple-dark">{value || "—"}</p>
            </div>
        </div>
    );
}

function Label({ children }) {
    return <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{children}</p>;
}

function DetailRow({ label, value, children }) {
    return (
        <div className="grid gap-1 border-b border-gray-100 py-3 last:border-0 sm:grid-cols-[160px_1fr] sm:gap-4">
            <p className="text-xs font-medium text-gray-400">{label}</p>
            <div className="text-sm text-[#302C38]">{children || value || "—"}</div>
        </div>
    );
}

function StatusBadge({ status }) {
    const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
    const toneClass =
        config.tone === "green"
            ? "bg-green-50 text-green-600"
            : config.tone === "red"
                ? "bg-red-50 text-red-500"
                : "bg-amber-50 text-amber-600";
    const Icon = config.tone === "green" ? CheckCircle2 : config.tone === "red" ? XCircle : ShieldCheck;

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${toneClass}`}>
            <Icon className="h-3 w-3" />
            {config.label}
        </span>
    );
}

function DocumentRow({ doc }) {
    const [previewOpen, setPreviewOpen] = useState(false);

    const documentUrl = `${import.meta.env.VITE_API_URL.replace("/api", "")}/storage/${doc.url}`;
    const isPdf = doc.url?.toLowerCase().endsWith(".pdf");
    const isImage = /\.(jpg|jpeg|png|webp)$/i.test(doc.url || "");


    return (
        <>
            <div className="flex items-center gap-3 py-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pf-purple-light">
                    <FileText className="h-5 w-5 text-pf-purple" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-pf-purple-dark">{doc.name}</p>
                    <p className="mt-0.5 text-[10px] text-gray-400">Document disponible</p>
                </div>
                <span className="hidden items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-medium text-green-600 sm:inline-flex">
                    <CheckCircle2 className="h-3 w-3" />
                    Disponible
                </span>
                <button
                    type="button"
                    onClick={() => setPreviewOpen(true)}
                    className="rounded-lg p-2 text-gray-400 transition hover:bg-pf-purple-light hover:text-pf-purple"
                    title="Voir le document"
                >
                    <Eye className="h-4 w-4" />
                </button>
                <a
                    href={documentUrl}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-pf-purple"
                    title="Télécharger"
                >
                    <Download className="h-4 w-4" />
                </a>
            </div>

            {previewOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4" onClick={() => setPreviewOpen(false)}>
                    <div
                        className="relative flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
                            <div>
                                <p className="text-sm font-semibold text-pf-purple-dark">{doc.name}</p>
                                <p className="text-[11px] text-gray-400">Vérification du document</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <a
                                    href={documentUrl}
                                    download
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-pf-purple"
                                    title="Télécharger"
                                >
                                    <Download className="h-4 w-4" />
                                </a>
                                <button
                                    type="button"
                                    onClick={() => setPreviewOpen(false)}
                                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-red-500"
                                    title="Fermer"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-1 items-center justify-center overflow-auto bg-[#F5F5F7] p-4">
                            {isImage ? (
                                <img src={documentUrl} alt={doc.name} className="max-h-full max-w-full rounded-lg object-contain shadow-md" />
                            ) : isPdf ? (
                                <iframe src={documentUrl} title={doc.name} className="h-full w-full rounded-lg border-0 bg-white" />
                            ) : (
                                <div className="text-center">
                                    <FileText className="mx-auto h-12 w-12 text-gray-300" />
                                    <p className="mt-3 text-sm text-gray-500">Aperçu non disponible pour ce type de fichier.</p>
                                    <a
                                        href={documentUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mt-4 inline-flex rounded-lg bg-pf-purple px-4 py-2 text-xs font-medium text-white hover:bg-pf-purple-dark"
                                    >
                                        Ouvrir le document
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}