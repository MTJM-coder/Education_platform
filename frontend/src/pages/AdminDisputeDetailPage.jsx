import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
  UserRound,
  UsersRound,
  Wallet,
  XCircle,
} from "lucide-react";
import { useParams, useSearchParams } from "react-router-dom";
import SidebarAdmin from "../components/admin/SidebarAdmin";
import { apiFetch } from "../lib/apiClient";

const decisionLabels = {
  refund: "Refund student",
  release: "Release to teacher",
  dismiss: "Dismiss dispute",
};

export default function AdminDisputeDetailsPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [dispute, setDispute] = useState(null);
  const [decision, setDecision] = useState(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchDispute() {
      try {
        // adminShow charge session.assignment.teacher/payments/tutoringRequest —
        // le show() standard (parent/enseignant) ne charge pas tout ca.
        const response = await apiFetch(`/admin/disputes/${id}`);
        setDispute(response?.data ?? response);
      } catch (fetchError) {
        setError(fetchError.message || "Unable to load this dispute.");
      }
    }

    if (id) fetchDispute();
  }, [id]);

  useEffect(() => {
    if (searchParams.get("action") === "resolve") {
      setDecision("dismiss");
    }
  }, [searchParams]);

  const caseData = useMemo(() => {
    if (!dispute) return null;

    const session = dispute?.session ?? {};
    const assignment = session?.assignment ?? {};
    const teacher = assignment?.teacher?.user ?? {};
    // Laravel serialise les relations en snake_case : tutoring_request, pas tutoringRequest.
    const request = assignment?.tutoring_request ?? {};
    const learner = request?.learner ?? {};
    const learnerUser = learner?.user ?? {};
    const subject = request?.subject ?? {};
    // La table payments n'a pas de session_id — on ne peut pas savoir avec
    // certitude quel paiement couvre CETTE seance si l'affectation en a
    // plusieurs (paiement par periode). On prend le plus recent en attendant
    // que la question "agreed_price par seance ou par periode" soit tranchee.
    const payments = assignment?.payments ?? [];
    const payment = payments.length
      ? [...payments].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]
      : {};
    const status = normalizeDisputeStatus(dispute?.status);
    const priority = normalizeDisputePriority(status);
    const raisedBy = dispute?.raised_by ?? {};

    let duration = "—";
    if (session?.start_time && session?.end_time) {
      const [sh, sm] = session.start_time.split(":").map(Number);
      const [eh, em] = session.end_time.split(":").map(Number);
      const minutes = eh * 60 + em - (sh * 60 + sm);
      if (minutes > 0) duration = `${Math.floor(minutes / 60)}h${String(minutes % 60).padStart(2, "0")}`;
    }

    return {
      id: dispute?.id,
      status,
      priority,
      resolved: status === "Resolved",
      reason: dispute?.reason || "Dispute case",
      createdAt: dispute?.created_at ? new Date(dispute.created_at).toLocaleDateString("fr-FR") : "—",
      resolution: dispute?.resolution || null,
      resolvedAt: dispute?.resolved_at ? new Date(dispute.resolved_at).toLocaleDateString("fr-FR") : null,
      student: {
        name: [learnerUser?.first_name, learnerUser?.last_name].filter(Boolean).join(" ") || "Élève",
        email: learnerUser?.email || "",
        class: learner?.classroom?.name || "—",
      },
      teacher: {
        name: [teacher?.first_name, teacher?.last_name].filter(Boolean).join(" ") || "Enseignant",
        email: teacher?.email || "",
        subject: subject?.name || "—",
      },
      session: {
        date: session?.session_date ? new Date(session.session_date).toLocaleDateString("fr-FR") : "—",
        time: session?.start_time && session?.end_time ? `${session.start_time} – ${session.end_time}` : "—",
        duration,
        subject: subject?.name || "—",
        amount: payment?.amount ? `${Number(payment.amount).toLocaleString("fr-FR")} FCFA` : "—",
      },
      payment: {
        reference: payment?.id || "—",
        method: payment?.method ? payment.method.replace(/_/g, " ") : "—",
        status: payment?.escrow_status ? payment.escrow_status.replace(/_/g, " ") : "—",
        note: payments.length > 1 ? `${payments.length} paiements sur cette affectation — le plus récent est affiché.` : null,
      },
      description: dispute?.reason || "No description available.",
      raisedByLabel: [raisedBy?.first_name, raisedBy?.last_name].filter(Boolean).join(" ") || "Utilisateur",
      raisedByRole: raisedBy?.role || "—",
    };
  }, [dispute]);

  const handleResolve = async () => {
    if (!decision || !id || caseData?.resolved) return;

    setSaving(true);
    setError("");

    try {
      const resolutionText = note
        ? `${decisionLabels[decision] || "Resolved"} — ${note}`
        : decisionLabels[decision] || "Resolved";

      await apiFetch(`/admin/disputes/${id}/resolve`, {
        method: "PATCH",
        body: JSON.stringify({ resolution: resolutionText }),
      });

      setDispute((current) => ({
        ...current,
        status: "resolved",
        resolution: resolutionText,
        resolved_at: new Date().toISOString(),
      }));
      setDecision(null);
      setNote("");
    } catch (resolveError) {
      setError(resolveError.message || "Unable to resolve the dispute.");
    } finally {
      setSaving(false);
    }
  };

  if (!caseData) {
    return (
      <div className="min-h-screen bg-[#FAF9FB] font-sans text-[#302C38]">
        <SidebarAdmin activeItem="Disputes" />
        <main className="lg:ml-64">
          <header className="flex h-16 items-center border-b border-gray-100 bg-white px-5 sm:px-8">
            <a href="/admin-disputes" className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-pf-purple" aria-label="Back to disputes">
              <ArrowLeft className="h-5 w-5" />
            </a>
          </header>
          <div className="mx-auto max-w-7xl px-5 py-12 text-sm text-gray-500">
            {error || "Loading dispute..."}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9FB] font-sans text-[#302C38]">
      <SidebarAdmin activeItem="Disputes" />

      <main className="lg:ml-64">
        <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <a href="/admin-disputes" className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-pf-purple">
              <ArrowLeft className="h-5 w-5" />
            </a>
            <p className="hidden text-sm text-gray-500 sm:block">Disputes / {caseData.id}</p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pf-purple text-xs font-semibold text-white">
            SA
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8">
          <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-pf-purple">DISPUTE CASE</p>
              <div className="mt-1 flex flex-wrap items-center gap-3">
                <h1 className="font-serif text-2xl font-medium text-pf-purple-dark sm:text-3xl">{caseData.id}</h1>
                <StatusBadge status={caseData.status} />
                <PriorityBadge priority={caseData.priority} />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {caseData.reason} · Ouvert par {caseData.raisedByLabel} ({caseData.raisedByRole}) · Créé le {caseData.createdAt}
              </p>
            </div>

            <a href="/admin-disputes" className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
              <ArrowLeft className="h-4 w-4" />
              Back to disputes
            </a>
          </section>

          {error && (
            <p role="alert" className="mt-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="mt-7 grid gap-5 xl:grid-cols-[1.45fr_0.75fr]">
            <div className="space-y-5">
              <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                <SectionTitle icon={AlertTriangle} title="Case summary" />
                <div className="mt-5 rounded-xl bg-[#FAF9FB] p-4">
                  <p className="text-sm leading-6 text-gray-600">{caseData.description}</p>
                </div>
              </section>

              <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                <SectionTitle icon={UsersRound} title="People involved" />
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <PersonCard type="Student" person={caseData.student} />
                  <PersonCard type="Teacher" person={caseData.teacher} />
                </div>
              </section>

              <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                <SectionTitle icon={CalendarDays} title="Disputed session" />
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <InfoBox icon={CalendarDays} label="Date" value={caseData.session.date} />
                  <InfoBox icon={Clock} label="Time" value={caseData.session.time} />
                  <InfoBox icon={Clock} label="Duration" value={caseData.session.duration} />
                  <InfoBox icon={FileText} label="Subject" value={caseData.session.subject} />
                </div>
              </section>

              {/* Le seul message reel dont on dispose est le motif du litige.
                  Pas de fausse conversation multi-messages inventee. */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                <SectionTitle icon={MessageSquare} title="Report" />
                <div className="mt-5 rounded-xl border border-gray-100 bg-[#FCFBFD] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pf-purple-light">
                      <UserRound className="h-4 w-4 text-pf-purple" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-pf-purple-dark">{caseData.raisedByLabel}</p>
                      <p className="text-[10px] text-gray-400">{caseData.raisedByRole}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-600">{caseData.reason}</p>

                  {caseData.resolution && (
                    <div className="mt-4 border-t border-gray-100 pt-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                        Admin resolution {caseData.resolvedAt && `· ${caseData.resolvedAt}`}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-gray-600">{caseData.resolution}</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            <aside className="space-y-5">
              <section className="rounded-2xl border border-gray-200 bg-white p-5">
                <SectionTitle icon={Wallet} title="Payment" />
                <div className="mt-5">
                  <p className="text-2xl font-semibold text-pf-purple-dark">{caseData.session.amount}</p>
                  <p className="mt-1 text-xs text-gray-400">Session amount</p>
                </div>
                <div className="mt-5 space-y-3 border-t border-gray-100 pt-4">
                  <DetailRow label="Reference" value={caseData.payment.reference} />
                  <DetailRow label="Method" value={caseData.payment.method} />
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-gray-400">Status</span>
                    <span className="rounded-full bg-yellow-50 px-2.5 py-1 text-[10px] font-medium text-yellow-600">{caseData.payment.status}</span>
                  </div>
                  {caseData.payment.note && (
                    <p className="text-[11px] leading-4 text-amber-600">{caseData.payment.note}</p>
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-gray-200 bg-white p-5">
                <SectionTitle icon={CheckCircle2} title="Admin decision" />

                {caseData.resolved && (
                  <p className="mt-3 rounded-lg bg-green-50 px-3 py-2.5 text-xs leading-5 text-green-700">
                    Ce litige est déjà résolu le {caseData.resolvedAt || "—"}. Reconfirmer
                    écraserait la résolution précédente.
                  </p>
                )}

                <p className="mt-3 text-xs leading-5 text-gray-500">
                  Cette décision enregistre uniquement la résolution du litige. Elle ne
                  libère ni ne rembourse automatiquement le paiement — utilisez la page
                  Paiements pour ça.
                </p>

                <div className="mt-5 space-y-2">
                  <DecisionButton
                    disabled={caseData.resolved}
                    active={decision === "refund"}
                    onClick={() => setDecision("refund")}
                    icon={CheckCircle2}
                    title="Refund student"
                    description="Recommande un remboursement (à faire ensuite sur Paiements)."
                  />
                  <DecisionButton
                    disabled={caseData.resolved}
                    active={decision === "release"}
                    onClick={() => setDecision("release")}
                    icon={CheckCircle2}
                    title="Release to teacher"
                    description="Recommande la libération (à faire ensuite sur Paiements)."
                  />
                  <DecisionButton
                    disabled={caseData.resolved}
                    active={decision === "dismiss"}
                    onClick={() => setDecision("dismiss")}
                    icon={XCircle}
                    title="Dismiss dispute"
                    description="Clôture le dossier sans recommandation de paiement."
                  />
                </div>

                <div className="mt-5">
                  <label className="text-xs font-medium text-gray-500">Admin note</label>
                  <textarea
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    rows={4}
                    disabled={caseData.resolved}
                    placeholder="Add a reason for your decision..."
                    className="mt-2 w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-xs outline-none focus:border-pf-purple focus:ring-2 focus:ring-pf-purple/10 disabled:bg-gray-50 disabled:text-gray-400"
                  />
                </div>

                <button
                  type="button"
                  disabled={!decision || saving || caseData.resolved}
                  onClick={handleResolve}
                  className="mt-4 w-full rounded-lg bg-pf-purple px-4 py-2.5 text-sm font-medium text-white transition hover:bg-pf-purple-dark disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {saving ? "Processing..." : caseData.resolved ? "Already resolved" : "Confirm decision"}
                </button>
              </section>

              <section className="rounded-2xl border border-gray-200 bg-white p-5">
                <SectionTitle icon={Clock} title="Case timeline" />
                <div className="mt-5 space-y-4">
                  <TimelineItem title="Dispute created" date={caseData.createdAt} active />
                  {caseData.resolved && (
                    <TimelineItem title="Resolved by admin" date={caseData.resolvedAt || "—"} active />
                  )}
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>
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

function PersonCard({ type, person }) {
  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{type}</p>
      <div className="mt-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pf-purple-light">
          <UserRound className="h-5 w-5 text-pf-purple" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-pf-purple-dark">{person.name}</p>
          <p className="truncate text-[11px] text-gray-400">{person.email || "No email"}</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-gray-500">{type === "Student" ? person.class : person.subject}</p>
    </div>
  );
}

function InfoBox({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl bg-[#FAF9FB] p-3">
      <Icon className="h-4 w-4 text-pf-purple" />
      <p className="mt-2 text-[10px] text-gray-400">{label}</p>
      <p className="mt-1 text-xs font-semibold text-pf-purple-dark">{value}</p>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-right text-xs font-medium text-pf-purple-dark">{value}</span>
    </div>
  );
}

function DecisionButton({ active, disabled, onClick, icon: Icon, title, description }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${active ? "border-pf-purple bg-pf-purple-light" : "border-gray-200 hover:bg-[#FCFBFD]"}`}
    >
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${active ? "text-pf-purple" : "text-gray-400"}`} />
      <div>
        <p className="text-xs font-semibold text-pf-purple-dark">{title}</p>
        <p className="mt-0.5 text-[10px] leading-4 text-gray-400">{description}</p>
      </div>
    </button>
  );
}

function StatusBadge({ status }) {
  const config = {
    Open: { className: "bg-red-50 text-red-500" },
    "Under Review": { className: "bg-amber-50 text-amber-600" },
    Resolved: { className: "bg-green-50 text-green-600" },
    Closed: { className: "bg-gray-100 text-gray-500" },
  };
  const current = config[status] || config.Open;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${current.className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const styles = {
    High: "bg-red-50 text-red-500",
    Medium: "bg-amber-50 text-amber-600",
    Low: "bg-gray-100 text-gray-500",
  };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium ${styles[priority]}`}>{priority} priority</span>;
}

function TimelineItem({ title, date, active = false }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <span className={`mt-1 h-2.5 w-2.5 rounded-full ${active ? "bg-pf-purple" : "bg-gray-300"}`} />
        <span className="mt-1 h-full w-px bg-gray-200" />
      </div>
      <div className="pb-3">
        <p className="text-xs font-medium text-pf-purple-dark">{title}</p>
        <p className="mt-1 text-[10px] text-gray-400">{date}</p>
      </div>
    </div>
  );
}

function normalizeDisputeStatus(rawStatus) {
  const value = String(rawStatus || "open").toLowerCase();
  if (value.includes("review")) return "Under Review";
  if (value.includes("resolved")) return "Resolved";
  if (value.includes("closed")) return "Closed";
  return "Open";
}

function normalizeDisputePriority(status) {
  const value = String(status || "Open").toLowerCase();
  if (value.includes("review")) return "Medium";
  if (value.includes("resolved") || value.includes("closed")) return "Low";
  return "High";
}