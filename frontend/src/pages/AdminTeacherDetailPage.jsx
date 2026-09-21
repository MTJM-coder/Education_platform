import { useState } from "react";
import {
    ArrowLeft,
    Award,
    BookOpen,
    CalendarDays,
    CheckCircle2,
    ChevronRight,
    Clock,
    Download,
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
    XCircle,
} from "lucide-react";
import SidebarAdmin from "../components/admin/SidebarAdmin";

const teacher = {
    id: 1,
    name: "Mr. Xavier Ndi",
    email: "xavier.ndi@gmail.com",
    phone: "+237 6 90 12 34 56",
    location: "Douala, Cameroon",
    status: "Approved",
    joinedAt: "12 March 2026",
    rank: "Senior Tutor",
    stars: 4.8,
    reviews: 47,

    subjects: [
        "Mathematics",
        "Physics",
    ],

    levels: [
        "Secondary",
    ],

    classes: [
        "Form 1",
        "Form 2",
        "Form 3",
        "Form 4",
    ],

    experience: "5 years",

    bio:
        "Experienced mathematics and physics teacher focused on helping learners build strong academic foundations and improve their problem-solving skills.",

    statistics: {
        students: 38,
        sessions: 124,
        completed: 116,
        cancelled: 8,
        earnings: "486,500 FCFA",
    },

    documents: [
        {
            name: "National ID Card",
            file: "national_id_card.pdf",
            status: "Verified",
        },
        {
            name: "Bachelor Degree",
            file: "bachelor_degree.pdf",
            status: "Verified",
        },
        {
            name: "Curriculum Vitae",
            file: "xavier_ndi_cv.pdf",
            status: "Verified",
        },
        {
            name: "Localisation Plan",
            file: "localisation_plan.pdf",
            status: "Verified",
        },
    ],

    recentSessions: [
        {
            student: "Junior Mbarga",
            subject: "Mathematics",
            date: "18 Sept. 2026",
            duration: "1h 30min",
            status: "Completed",
            amount: "7,500 FCFA",
        },
        {
            student: "Sarah Nfor",
            subject: "Physics",
            date: "17 Sept. 2026",
            duration: "1h",
            status: "Completed",
            amount: "5,000 FCFA",
        },
        {
            student: "Kevin Tchana",
            subject: "Mathematics",
            date: "16 Sept. 2026",
            duration: "1h 30min",
            status: "Completed",
            amount: "7,500 FCFA",
        },
    ],
};

export default function AdminTeacherDetailsPage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [status, setStatus] = useState(teacher.status);

    const toggleStatus = () => {
        setStatus(
            status === "Approved"
                ? "Suspended"
                : "Approved"
        );
    };
    function DetailRow({ label, value, children }) {
        return (
            <div className="grid gap-1 border-b border-gray-100 py-3 last:border-0 sm:grid-cols-[160px_1fr] sm:gap-4">
                <p className="text-xs font-medium text-gray-400">
                    {label}
                </p>

                <div className="text-sm text-[#302C38]">
                    {children || value || "—"}
                </div>
            </div>
        );
    }
    return (
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
                            Teacher Management / Teacher #{teacher.id}
                        </p>
                    </div>

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
                    {/* PAGE HEADER */}
                    <section className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-pf-purple text-xl font-semibold text-white">
                                XN
                            </div>

                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="font-serif text-2xl font-medium text-pf-purple-dark sm:text-3xl">
                                        {teacher.name}
                                    </h1>

                                    <StatusBadge status={status} />
                                </div>

                                <p className="mt-1 text-sm text-gray-500">
                                    {teacher.rank} · Teacher #{teacher.id}
                                </p>

                                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-400">
                                    <span className="flex items-center gap-1.5">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {teacher.location}
                                    </span>

                                    <span className="flex items-center gap-1.5">
                                        <CalendarDays className="h-3.5 w-3.5" />
                                        Joined {teacher.joinedAt}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="relative flex gap-2">
                            <button
                                type="button"
                                onClick={toggleStatus}
                                className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2.5 text-sm font-medium transition ${status === "Approved"
                                        ? "border-red-200 bg-white text-red-500 hover:bg-red-50"
                                        : "border-green-200 bg-white text-green-600 hover:bg-green-50"
                                    }`}
                            >
                                {status === "Approved" ? (
                                    <>
                                        <XCircle className="h-4 w-4" />
                                        Suspend teacher
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="h-4 w-4" />
                                        Approve teacher
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="rounded-lg border border-gray-200 bg-white p-2.5 text-gray-500 hover:bg-gray-50"
                            >
                                <MoreHorizontal className="h-5 w-5" />
                            </button>

                            {menuOpen && (
                                <div className="absolute right-0 top-12 z-20 w-48 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg">
                                    <button
                                        type="button"
                                        className="w-full rounded-lg px-3 py-2 text-left text-xs text-gray-600 hover:bg-gray-50"
                                    >
                                        Edit teacher
                                    </button>

                                    <button
                                        type="button"
                                        className="w-full rounded-lg px-3 py-2 text-left text-xs text-gray-600 hover:bg-gray-50"
                                    >
                                        View public profile
                                    </button>

                                    <button
                                        type="button"
                                        className="w-full rounded-lg px-3 py-2 text-left text-xs text-gray-600 hover:bg-gray-50"
                                    >
                                        Reset password
                                    </button>

                                    <button
                                        type="button"
                                        className="w-full rounded-lg px-3 py-2 text-left text-xs text-red-500 hover:bg-red-50"
                                    >
                                        Delete teacher
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* STATISTICS */}
                    <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                        <StatCard
                            icon={UsersRound}
                            label="Students"
                            value={teacher.statistics.students}
                        />

                        <StatCard
                            icon={CalendarDays}
                            label="Sessions"
                            value={teacher.statistics.sessions}
                        />

                        <StatCard
                            icon={CheckCircle2}
                            label="Completed"
                            value={teacher.statistics.completed}
                        />

                        <StatCard
                            icon={Star}
                            label="Rating"
                            value={teacher.stars}
                        />

                        <StatCard
                            icon={Wallet}
                            label="Earnings"
                            value={teacher.statistics.earnings}
                        />
                    </section>

                    {/* CONTENT */}
                    <div className="mt-7 grid gap-5 xl:grid-cols-[1.4fr_0.75fr]">
                        {/* LEFT */}
                        <div className="space-y-5">
                            {/* PROFILE */}
                            <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                                <SectionTitle
                                    icon={UserRound}
                                    title="Teacher information"
                                />

                                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                                    <InfoItem
                                        icon={Mail}
                                        label="Email"
                                        value={teacher.email}
                                    />

                                    <InfoItem
                                        icon={Phone}
                                        label="Phone"
                                        value={teacher.phone}
                                    />

                                    <InfoItem
                                        icon={MapPin}
                                        label="Location"
                                        value={teacher.location}
                                    />

                                    <InfoItem
                                        icon={Clock}
                                        label="Experience"
                                        value={teacher.experience}
                                    />
                                </div>

                                <div className="mt-5 border-t border-gray-100 pt-5">
                                    <p className="text-xs font-medium text-gray-400">
                                        Biography
                                    </p>

                                    <p className="mt-2 text-sm leading-6 text-gray-600">
                                        {teacher.bio}
                                    </p>
                                </div>
                            </section>

                            {/* ACADEMIC */}
                            <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                                <SectionTitle
                                    icon={BookOpen}
                                    title="Teaching profile"
                                />

                                <div className="mt-5">
                                    <Label>Subjects</Label>

                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {teacher.subjects.map((subject) => (
                                            <span
                                                key={subject}
                                                className="rounded-full bg-pf-purple-light px-3 py-1.5 text-xs font-medium text-pf-purple"
                                            >
                                                {subject}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <Label>Levels</Label>

                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {teacher.levels.map((level) => (
                                            <span
                                                key={level}
                                                className="rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-600"
                                            >
                                                {level}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <Label>Classes</Label>

                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {teacher.classes.map((item) => (
                                            <span
                                                key={item}
                                                className="rounded-full border border-gray-200 px-3 py-1.5 text-xs text-gray-600"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* DOCUMENTS */}
                            <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                                <div className="flex items-center justify-between">
                                    <SectionTitle
                                        icon={FileText}
                                        title="Verification documents"
                                    />

                                    <span className="text-xs text-gray-400">
                                        {teacher.documents.length} documents
                                    </span>
                                </div>

                                <div className="mt-5 divide-y divide-gray-100">
                                    {teacher.documents.map((document) => (
                                        <div
                                            key={document.name}
                                            className="flex items-center gap-3 py-3.5"
                                        >
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pf-purple-light">
                                                <FileText className="h-5 w-5 text-pf-purple" />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-pf-purple-dark">
                                                    {document.name}
                                                </p>

                                                <p className="mt-0.5 truncate text-[10px] text-gray-400">
                                                    {document.file}
                                                </p>
                                            </div>

                                            <span className="hidden items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-medium text-green-600 sm:inline-flex">
                                                <CheckCircle2 className="h-3 w-3" />
                                                {document.status}
                                            </span>

                                            <button
                                                type="button"
                                                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-pf-purple"
                                            >
                                                <Download className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* RECENT SESSIONS */}
                            <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                                <div className="flex items-center justify-between">
                                    <SectionTitle
                                        icon={CalendarDays}
                                        title="Recent sessions"
                                    />

                                    <a
                                        href="/admin-tutoring"
                                        className="inline-flex items-center gap-1 text-xs font-semibold text-pf-purple hover:underline"
                                    >
                                        View all
                                        <ChevronRight className="h-3.5 w-3.5" />
                                    </a>
                                </div>

                                <div className="mt-5 overflow-x-auto">
                                    <table className="w-full min-w-[650px]">
                                        <thead>
                                            <tr className="border-b border-gray-100 text-left">
                                                <th className="pb-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                                                    Student
                                                </th>

                                                <th className="pb-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                                                    Subject
                                                </th>

                                                <th className="pb-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                                                    Date
                                                </th>

                                                <th className="pb-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                                                    Duration
                                                </th>

                                                <th className="pb-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                                                    Amount
                                                </th>

                                                <th className="pb-3 text-right text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {teacher.recentSessions.map(
                                                (session, index) => (
                                                    <tr
                                                        key={index}
                                                        className="border-b border-gray-100 last:border-0"
                                                    >
                                                        <td className="py-3.5 text-xs font-medium text-pf-purple-dark">
                                                            {session.student}
                                                        </td>

                                                        <td className="py-3.5 text-xs text-gray-500">
                                                            {session.subject}
                                                        </td>

                                                        <td className="py-3.5 text-xs text-gray-500">
                                                            {session.date}
                                                        </td>

                                                        <td className="py-3.5 text-xs text-gray-500">
                                                            {session.duration}
                                                        </td>

                                                        <td className="py-3.5 text-xs font-medium text-pf-purple-dark">
                                                            {session.amount}
                                                        </td>

                                                        <td className="py-3.5 text-right">
                                                            <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-medium text-green-600">
                                                                {session.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
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
                                        <p className="text-xs font-medium tracking-wide text-purple-200">
                                            TEACHER RANK
                                        </p>

                                        <h2 className="mt-2 font-serif text-2xl">
                                            {teacher.rank}
                                        </h2>

                                        <p className="mt-1 text-xs text-purple-100">
                                            Based on performance and reliability
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-white/15 p-2.5">
                                        <Award className="h-5 w-5" />
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-purple-100">
                                            Progress to next rank
                                        </span>

                                        <span className="font-semibold">
                                            72%
                                        </span>
                                    </div>

                                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/20">
                                        <div
                                            className="h-full rounded-full bg-white"
                                            style={{ width: "72%" }}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* REPUTATION */}
                            <section className="rounded-2xl border border-gray-200 bg-white p-5">
                                <SectionTitle
                                    icon={Star}
                                    title="Reputation"
                                />

                                <div className="mt-5 flex items-center gap-4">
                                    <div>
                                        <p className="font-serif text-3xl text-pf-purple-dark">
                                            {teacher.stars}
                                        </p>

                                        <div className="mt-1 flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`h-3.5 w-3.5 ${star <= Math.round(teacher.stars)
                                                            ? "fill-pf-gold text-pf-gold"
                                                            : "text-gray-200"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="border-l border-gray-100 pl-4">
                                        <p className="text-sm font-semibold text-pf-purple-dark">
                                            {teacher.reviews}
                                        </p>

                                        <p className="text-[10px] text-gray-400">
                                            Reviews
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* PERFORMANCE */}
                            <section className="rounded-2xl border border-gray-200 bg-white p-5">
                                <SectionTitle
                                    icon={ShieldCheck}
                                    title="Performance"
                                />

                                <div className="mt-5 space-y-4">
                                    <PerformanceRow
                                        label="Session completion"
                                        value="93.5%"
                                        progress={93.5}
                                    />

                                    <PerformanceRow
                                        label="Student satisfaction"
                                        value="96%"
                                        progress={96}
                                    />

                                    <PerformanceRow
                                        label="Reliability"
                                        value="91%"
                                        progress={91}
                                    />

                                    <PerformanceRow
                                        label="Response rate"
                                        value="88%"
                                        progress={88}
                                    />
                                </div>
                            </section>

                            {/* EARNINGS */}
                            <section className="rounded-2xl border border-gray-200 bg-white p-5">
                                <SectionTitle
                                    icon={Wallet}
                                    title="Financial overview"
                                />

                                <div className="mt-5">
                                    <p className="text-2xl font-semibold text-pf-purple-dark">
                                        {teacher.statistics.earnings}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-400">
                                        Total teacher earnings
                                    </p>
                                </div>

                                <div className="mt-5 space-y-3 border-t border-gray-100 pt-4">
                                    <DetailRow
                                        label="Completed sessions"
                                        value={teacher.statistics.completed}
                                    />

                                    <DetailRow
                                        label="Cancelled sessions"
                                        value={teacher.statistics.cancelled}
                                    />

                                    <a
                                        href="/admin-finance"
                                        className="flex items-center justify-between pt-2 text-xs font-semibold text-pf-purple hover:underline"
                                    >
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

                <span className="font-serif text-xl text-pf-purple-dark">
                    {value}
                </span>
            </div>

            <p className="mt-4 text-xs text-gray-500">
                {label}
            </p>
        </div>
    );
}

function SectionTitle({ icon: Icon, title }) {
    return (
        <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pf-purple-light">
                <Icon className="h-4 w-4 text-pf-purple" />
            </div>

            <h2 className="font-serif text-lg text-pf-purple-dark">
                {title}
            </h2>
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
                <p className="text-[10px] text-gray-400">
                    {label}
                </p>

                <p className="mt-1 break-words text-sm font-medium text-pf-purple-dark">
                    {value}
                </p>
            </div>
        </div>
    );
}

function Label({ children }) {
    return (
        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            {children}
        </p>
    );
}

function StatusBadge({ status }) {
    const approved = status === "Approved";

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${approved
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-500"
                }`}
        >
            {approved ? (
                <CheckCircle2 className="h-3 w-3" />
            ) : (
                <XCircle className="h-3 w-3" />
            )}

            {status}
        </span>
    );
}

function PerformanceRow({
    label,
    value,
    progress,
}) {
    return (
        <div>
            <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                    {label}
                </span>

                <span className="text-xs font-semibold text-pf-purple-dark">
                    {value}
                </span>
            </div>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                <div
                    className="h-full rounded-full bg-pf-purple"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}