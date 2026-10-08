import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ParentSidebar from "../components/parent/ParentSidebar";
import { apiFetch } from "../lib/apiClient";

import {
  AlertCircle,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Eye,
  Filter,
  GraduationCap,
  LockKeyhole,
  Receipt,
  Search,
  ShieldCheck,
  Smartphone,
  UserRound,
  WalletCards,
  X,
  XCircle,
} from "lucide-react";

/* =========================================================
   HELPERS
========================================================= */

// Accepte [..], { data: [..] } ou { data: { data: [..] } } selon apiFetch.
function toList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  return [];
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

function capitalize(value) {
  if (!value) return "";
  const text = String(value);
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatMoney(amount) {
  const number = Number(amount);
  if (amount === null || amount === undefined || !Number.isFinite(number)) {
    return "—";
  }
  return new Intl.NumberFormat("fr-FR").format(number);
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Même vocabulaire que payments.method en base.
const METHODS = [
  {
    value: "mobile_money",
    label: "Mobile Money",
    description: "MTN Mobile Money / Orange Money",
    icon: Smartphone,
  },
  {
    value: "bank_transfer",
    label: "Bank Transfer",
    description: "Transfer from your bank account",
    icon: Building2,
  },
  {
    value: "other",
    label: "Other",
    description: "Other payment methods",
    icon: CreditCard,
  },
];

// À confirmer avec CreatePaymentRequest (valeurs acceptées pour `period`).
const PERIODS = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

function methodLabel(value) {
  return METHODS.find((method) => method.value === value)?.label ?? value;
}

// Le bouton de simulation n'existe qu'en développement : en production, aucun
// parent ne doit pouvoir déclarer son propre paiement comme réussi.
const TEST_MODE = Boolean(import.meta.env.DEV);

// État affiché = combinaison de payments.status et payments.escrow_status.
function paymentState(payment) {
  if (payment.status === "paid") {
    return payment.escrow_status === "released" ? "released" : "escrow";
  }
  return payment.status; // pending | failed | refunded
}

function toRow(payment) {
  const assignment = payment.assignment;
  const request = assignment?.tutoring_request;
  const learner = request?.learner;

  return {
    id: payment.id,
    shortId: String(payment.id).slice(0, 8),
    assignmentId: payment.assignment_id,
    date: payment.created_at,
    child: getLearnerName(learner),
    childId: learner?.id ?? request?.learner_id ?? null,
    teacher: getUserName(assignment?.teacher?.user) ?? "Teacher",
    subject: request?.subject?.name ?? "—",
    period: capitalize(payment.period),
    amount: Number(payment.amount),
    commission:
      payment.commission_amount === null || payment.commission_amount === undefined
        ? null
        : Number(payment.commission_amount),
    teacherAmount:
      payment.teacher_amount === null || payment.teacher_amount === undefined
        ? null
        : Number(payment.teacher_amount),
    method: payment.method,
    state: paymentState(payment),
    releaseDate: payment.escrow_release_date,
  };
}

const statusConfig = {
  pending: {
    label: "Awaiting payment",
    className: "bg-amber-50 text-amber-700",
    icon: Clock3,
  },
  escrow: {
    label: "In escrow",
    className: "bg-blue-50 text-blue-700",
    icon: LockKeyhole,
  },
  released: {
    label: "Released",
    className: "bg-green-50 text-green-700",
    icon: CheckCircle2,
  },
  failed: {
    label: "Failed",
    className: "bg-red-50 text-red-700",
    icon: XCircle,
  },
  refunded: {
    label: "Refunded",
    className: "bg-gray-100 text-gray-600",
    icon: AlertCircle,
  },
};

/* =========================================================
   MAIN PAGE
========================================================= */

export default function ParentPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [children, setChildren] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedChild, setSelectedChild] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadAll = useCallback(async () => {
    const [paymentsRes, childrenRes, requestsRes] = await Promise.all([
      apiFetch("/me/payments"),
      apiFetch("/me/children"),
      apiFetch("/me/tutoring-requests"),
    ]);

    setPayments(toList(paymentsRes));
    setChildren(toList(childrenRes));
    setRequests(toList(requestsRes));
  }, []);

  useEffect(() => {
    loadAll()
      .catch((err) => setError(err?.message || "Unable to load your payments."))
      .finally(() => setLoading(false));
  }, [loadAll]);

  const rows = useMemo(() => payments.map(toRow), [payments]);

  const childOptions = useMemo(
    () => [
      { id: "all", name: "All children" },
      ...children.map((child) => ({ id: child.id, name: getLearnerName(child) })),
    ],
    [children]
  );

  /* ------- Statistiques ------- */

  const totals = useMemo(() => {
    const sum = (list, key) => list.reduce((total, row) => total + (row[key] || 0), 0);
    const paid = rows.filter((row) => row.state === "escrow" || row.state === "released");

    return {
      paid: sum(paid, "amount"),
      escrow: sum(rows.filter((row) => row.state === "escrow"), "amount"),
      pending: sum(rows.filter((row) => row.state === "pending"), "amount"),
    };
  }, [rows]);

  /* ------- Filtres ------- */

  const filteredRows = useMemo(() => {
    const text = search.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesSearch =
        !text ||
        row.shortId.toLowerCase().includes(text) ||
        row.teacher.toLowerCase().includes(text) ||
        row.subject.toLowerCase().includes(text);

      const matchesChild = selectedChild === "all" || row.childId === selectedChild;
      const matchesStatus = statusFilter === "all" || row.state === statusFilter;

      return matchesSearch && matchesChild && matchesStatus;
    });
  }, [rows, search, selectedChild, statusFilter]);

  const resetFilters = () => {
    setSearch("");
    setSelectedChild("all");
    setStatusFilter("all");
  };

  /* ------- Affectations payables ------- */

  const activeAssignments = useMemo(
    () =>
      requests.flatMap((request) =>
        (request.assignments ?? [])
          .filter((assignment) => assignment.status === "active")
          .map((assignment) => ({
            id: assignment.id,
            price: Number(assignment.agreed_price),
            child: getLearnerName(request.learner),
            teacher: getUserName(assignment.teacher?.user) ?? "Teacher",
            subject: request.subject?.name ?? "—",
          }))
      ),
    [requests]
  );

  const pendingAssignmentIds = useMemo(
    () =>
      new Set(rows.filter((row) => row.state === "pending").map((row) => row.assignmentId)),
    [rows]
  );

  const selectedPayment = rows.find((row) => row.id === selectedPaymentId) ?? null;

  const refresh = async () => {
    try {
      await loadAll();
    } catch (err) {
      setError(err?.message || "Unable to refresh your payments.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8FA]">
      <ParentSidebar />

      <main className="lg:ml-[260px]">
        {/* HEADER */}
        <div className="border-b border-gray-100 bg-white">
          <div className="px-5 py-6 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                  <Link to="/parent-dashboard" className="hover:text-[#6D4AFF]">
                    Dashboard
                  </Link>

                  <span>/</span>

                  <span className="text-gray-700">Payments</span>
                </div>

                <h1 className="text-2xl font-bold text-gray-900">Payments</h1>

                <p className="mt-1 text-sm text-gray-500">
                  Manage your tutoring payments and payment history.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPaymentModal(true)}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D4AFF] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5D3DE0] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CreditCard size={18} />
                Make a Payment
              </button>
            </div>
          </div>
        </div>

        <div className="px-5 py-6 sm:px-8 lg:px-10">
          {error && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600"
            >
              {error}
            </div>
          )}

          {/* PAYMENT SECURITY BANNER */}
          <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-[#DED7FF] bg-[#F5F2FF] p-5 sm:flex-row sm:items-center">
            <div className="rounded-xl bg-white p-3 shadow-sm">
              <ShieldCheck size={25} className="text-[#6D4AFF]" />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                Your payments are protected
              </h3>

              <p className="mt-1 text-sm leading-6 text-gray-600">
                Payments are held securely in escrow. The administration
                releases them to the teacher after review, as long as no
                dispute is open on the lessons.
              </p>
            </div>

            <div className="text-sm font-semibold text-[#6D4AFF]">
              Secure payment
            </div>
          </div>

          {/* STATS */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <PaymentStat
              icon={WalletCards}
              label="Total paid"
              value={loading ? "—" : `${formatMoney(totals.paid)} FCFA`}
            />

            <PaymentStat
              icon={LockKeyhole}
              label="Currently in escrow"
              value={loading ? "—" : `${formatMoney(totals.escrow)} FCFA`}
            />

            <PaymentStat
              icon={Clock3}
              label="Awaiting payment"
              value={loading ? "—" : `${formatMoney(totals.pending)} FCFA`}
            />
          </div>

          {/* FILTERS */}
          <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search payment, teacher or subject..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#6D4AFF] focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <select
                  value={selectedChild}
                  onChange={(e) => setSelectedChild(e.target.value)}
                  aria-label="Child"
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#6D4AFF]"
                >
                  {childOptions.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.name}
                    </option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  aria-label="Status"
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#6D4AFF]"
                >
                  <option value="all">All statuses</option>
                  <option value="pending">Awaiting payment</option>
                  <option value="escrow">In escrow</option>
                  <option value="released">Released</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>

                {(search || selectedChild !== "all" || statusFilter !== "all") && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    <X size={16} />
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* PAYMENT TABLE */}
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <div>
                <h2 className="font-semibold text-gray-900">Payment History</h2>

                <p className="mt-1 text-sm text-gray-500">
                  {filteredRows.length} payment
                  {filteredRows.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="hidden items-center gap-2 text-sm text-gray-500 sm:flex">
                <Filter size={16} />
                Filtered results
              </div>
            </div>

            {loading ? (
              <p className="px-5 py-16 text-center text-sm text-gray-400">
                Loading your payments…
              </p>
            ) : filteredRows.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      <th className="px-5 py-4">Payment</th>
                      <th className="px-5 py-4">Child</th>
                      <th className="px-5 py-4">Teacher</th>
                      <th className="px-5 py-4">Amount</th>
                      <th className="px-5 py-4">Method</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredRows.map((row) => (
                      <PaymentRow
                        key={row.id}
                        payment={row}
                        onView={() => setSelectedPaymentId(row.id)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyPayments
                hasPayments={rows.length > 0}
                resetFilters={resetFilters}
              />
            )}
          </div>

          {/* PAYMENT METHODS */}
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-gray-900">
                Available Payment Methods
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Choose the method that works best for you.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {METHODS.map((method) => (
                  <PaymentMethod
                    key={method.value}
                    icon={method.icon}
                    title={method.label}
                    description={method.description}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-gray-900">Payment Process</h2>

              <div className="mt-5 space-y-4">
                <ProcessStep
                  number="1"
                  title="Make payment"
                  text="Choose the assignment and your preferred payment method."
                />

                <ProcessStep
                  number="2"
                  title="Funds are secured"
                  text="Your payment is placed in escrow."
                />

                <ProcessStep
                  number="3"
                  title="Tutoring takes place"
                  text="The teacher provides the agreed service."
                />

                <ProcessStep
                  number="4"
                  title="Teacher receives payment"
                  text="The administration releases the funds after review."
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {selectedPayment && (
        <PaymentDetailsModal
          payment={selectedPayment}
          onClose={() => setSelectedPaymentId(null)}
          onChanged={refresh}
        />
      )}

      {showPaymentModal && (
        <MakePaymentModal
          assignments={activeAssignments}
          pendingAssignmentIds={pendingAssignmentIds}
          onClose={() => setShowPaymentModal(false)}
          onChanged={refresh}
        />
      )}
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function PaymentStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-[#F0ECFF] p-2.5">
          <Icon size={20} className="text-[#6D4AFF]" />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-500">{label}</p>

          <p className="mt-1 truncate text-lg font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PAYMENT ROW
========================================================= */

function PaymentRow({ payment, onView }) {
  const config = statusConfig[payment.state] || statusConfig.pending;
  const StatusIcon = config.icon;

  return (
    <tr className="transition hover:bg-gray-50">
      <td className="px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-gray-900">#{payment.shortId}</p>

          <p className="mt-1 text-xs text-gray-500">{formatDate(payment.date)}</p>

          <p className="mt-1 text-xs text-gray-400">
            {payment.subject}
            {payment.period ? ` · ${payment.period}` : ""}
          </p>
        </div>
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-[#F0ECFF] p-2">
            <GraduationCap size={15} className="text-[#6D4AFF]" />
          </div>

          <span className="text-sm font-medium text-gray-800">{payment.child}</span>
        </div>
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <UserRound size={15} className="text-gray-400" />

          <span className="text-sm text-gray-700">{payment.teacher}</span>
        </div>
      </td>

      <td className="px-5 py-4">
        <div>
          <p className="text-sm font-bold text-gray-900">
            {formatMoney(payment.amount)} FCFA
          </p>
        </div>
      </td>

      <td className="px-5 py-4">
        <span className="text-sm text-gray-700">{methodLabel(payment.method)}</span>
      </td>

      <td className="px-5 py-4">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
        >
          <StatusIcon size={13} />
          {config.label}
        </span>
      </td>

      <td className="px-5 py-4 text-right">
        <button
          type="button"
          onClick={onView}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
        >
          <Eye size={14} />
          Details
        </button>
      </td>
    </tr>
  );
}

/* =========================================================
   TEST MODE : SIMULATION DE LA RÉPONSE DU FOURNISSEUR
========================================================= */

function SimulationButtons({ paymentId, onDone }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const run = async (result) => {
    setBusy(true);
    setError("");

    try {
      await apiFetch(`/payments/${paymentId}/simulate`, {
        method: "POST",
        body: JSON.stringify({ result }),
      });
      await onDone();
    } catch (err) {
      setError(err?.message || "Simulation failed.");
      setBusy(false);
    }
  };

  return (
    <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
        Test mode only
      </p>

      <p className="mt-1 text-xs leading-5 text-amber-700">
        No real payment provider is connected yet. Simulate its answer.
      </p>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => run("success")}
          className="flex-1 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
        >
          Simulate success
        </button>

        <button
          type="button"
          disabled={busy}
          onClick={() => run("failure")}
          className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
        >
          Simulate failure
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-2 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

/* =========================================================
   PAYMENT DETAILS MODAL
========================================================= */

function PaymentDetailsModal({ payment, onClose, onChanged }) {
  const config = statusConfig[payment.state] || statusConfig.pending;
  const StatusIcon = config.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <div>
            <p className="text-xs font-medium text-gray-500">Payment reference</p>

            <h2 className="mt-1 text-xl font-bold text-gray-900">
              #{payment.shortId}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
            <div>
              <p className="text-xs text-gray-500">Amount</p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {formatMoney(payment.amount)} FCFA
              </p>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${config.className}`}
            >
              <StatusIcon size={14} />
              {config.label}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <DetailItem
              icon={CalendarDays}
              label="Payment date"
              value={formatDate(payment.date)}
            />

            <DetailItem icon={UserRound} label="Teacher" value={payment.teacher} />

            <DetailItem icon={GraduationCap} label="Child" value={payment.child} />

            <DetailItem icon={Receipt} label="Subject" value={payment.subject} />

            <DetailItem
              icon={CreditCard}
              label="Payment method"
              value={methodLabel(payment.method)}
            />

            <DetailItem icon={Clock3} label="Period" value={payment.period || "—"} />
          </div>

          {payment.commission !== null && (
            <div className="rounded-xl border border-gray-100">
              <div className="flex justify-between border-b border-gray-100 px-4 py-3 text-sm">
                <span className="text-gray-500">Service amount</span>

                <span className="font-medium text-gray-900">
                  {formatMoney(payment.amount)} FCFA
                </span>
              </div>

              <div className="flex justify-between px-4 py-3 text-sm font-semibold">
                <span className="text-gray-900">Total paid</span>

                <span className="text-gray-900">
                  {formatMoney(payment.amount)} FCFA
                </span>
              </div>
            </div>
          )}

          {payment.state === "escrow" && (
            <div className="flex gap-3 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
              <LockKeyhole size={18} className="mt-0.5 shrink-0" />

              <div>
                <p className="font-semibold">Payment protected in escrow</p>

                <p className="mt-1 leading-5">
                  The administration will release it to the teacher after
                  review.
                </p>
              </div>
            </div>
          )}

          {payment.state === "released" && payment.releaseDate && (
            <div className="rounded-xl bg-green-50 p-4 text-sm text-green-800">
              Released to the teacher on{" "}
              <strong>{formatDate(payment.releaseDate)}</strong>.
            </div>
          )}

          {payment.state === "pending" && TEST_MODE && (
            <SimulationButtons
              paymentId={payment.id}
              onDone={async () => {
                await onChanged();
                onClose();
              }}
            />
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-[#6D4AFF] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#5D3DE0]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAKE PAYMENT MODAL
========================================================= */

function MakePaymentModal({ assignments, pendingAssignmentIds, onClose, onChanged }) {
  const [step, setStep] = useState(1);
  const [assignmentId, setAssignmentId] = useState("");
  const [method, setMethod] = useState("mobile_money");
  const [period, setPeriod] = useState(PERIODS[0].value);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(null);

  const payable = assignments.filter((a) => Number.isFinite(a.price) && a.price > 0);
  const awaitingPrice = assignments.filter((a) => !(a.price > 0));
  const selected = payable.find((a) => a.id === assignmentId);

  const goToSummary = () => {
    setError("");

    if (!selected) {
      setError("Please choose the assignment you want to pay for.");
      return;
    }

    setStep(2);
  };

  const confirm = async () => {
    setSubmitting(true);
    setError("");

    try {
      const response = await apiFetch(`/assignments/${assignmentId}/payments`, {
        method: "POST",
        body: JSON.stringify({ method, period }),
      });

      setCreated(toObject(response));
      setStep(3);
      await onChanged(); // la liste derrière le modal se met à jour
    } catch (err) {
      setError(err?.message || "Unable to create this payment.");
    } finally {
      setSubmitting(false);
    }
  };

  const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";
  const fieldClass =
    "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#6D4AFF]";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Make a Payment</h2>

            <p className="mt-1 text-sm text-gray-500">
              {step === 3 ? "Payment created" : `Step ${step} of 2`}
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

        <div className="p-5">
          {step === 1 && (
            <>
              {payable.length === 0 ? (
                <div className="rounded-xl bg-gray-50 p-5 text-center text-sm text-gray-600">
                  <p className="font-medium text-gray-900">
                    Nothing to pay for the moment
                  </p>

                  <p className="mt-2 leading-6">
                    {awaitingPrice.length > 0
                      ? "Your assignment is active, but the administration has not set its price yet. You will be able to pay as soon as it is confirmed."
                      : "You can pay once a teacher assignment has been validated and its price confirmed by the administration."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="pay-assignment" className={labelClass}>
                      Assignment
                    </label>

                    <select
                      id="pay-assignment"
                      value={assignmentId}
                      onChange={(e) => setAssignmentId(e.target.value)}
                      className={fieldClass}
                    >
                      <option value="">Select an assignment</option>
                      {payable.map((assignment) => {
                        const blocked = pendingAssignmentIds.has(assignment.id);

                        return (
                          <option
                            key={assignment.id}
                            value={assignment.id}
                            disabled={blocked}
                          >
                            {assignment.child} · {assignment.subject} ·{" "}
                            {assignment.teacher} — {formatMoney(assignment.price)} FCFA
                            {blocked ? " (payment awaiting)" : ""}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="pay-period" className={labelClass}>
                      Period
                    </label>

                    <select
                      id="pay-period"
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                      className={fieldClass}
                    >
                      {PERIODS.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <p className={labelClass}>Payment method</p>

                    <div className="space-y-3">
                      {METHODS.map((item) => (
                        <PaymentChoice
                          key={item.value}
                          active={method === item.value}
                          icon={item.icon}
                          title={item.label}
                          description={item.description}
                          onClick={() => setMethod(item.value)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <p role="alert" className="mt-4 text-sm text-red-600">
                  {error}
                </p>
              )}

              {payable.length > 0 && (
                <button
                  type="button"
                  onClick={goToSummary}
                  className="mt-6 w-full rounded-xl bg-[#6D4AFF] px-4 py-3 text-sm font-semibold text-white hover:bg-[#5D3DE0]"
                >
                  Continue
                </button>
              )}
            </>
          )}

          {step === 2 && selected && (
            <>
              <div className="mb-5">
                <h3 className="font-semibold text-gray-900">Confirm payment</h3>

                <p className="mt-1 text-sm text-gray-500">
                  Review the payment information before proceeding.
                </p>
              </div>

              <div className="space-y-3 rounded-xl bg-gray-50 p-4">
                <SummaryRow label="Child" value={selected.child} />
                <SummaryRow label="Teacher" value={selected.teacher} />
                <SummaryRow label="Subject" value={selected.subject} />
                <SummaryRow
                  label="Period"
                  value={PERIODS.find((p) => p.value === period)?.label ?? period}
                />
                <SummaryRow label="Method" value={methodLabel(method)} />

                <div className="my-2 border-t border-gray-200" />

                <SummaryRow
                  label="Total (commission included)"
                  value={`${formatMoney(selected.price)} FCFA`}
                  bold
                />
              </div>

              <div className="mt-4 flex gap-3 rounded-xl bg-[#F5F2FF] p-4 text-sm text-gray-700">
                <ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#6D4AFF]" />

                <p>
                  The payment will be placed in escrow according to the
                  platform's payment rules.
                </p>
              </div>

              {error && (
                <p role="alert" className="mt-4 text-sm text-red-600">
                  {error}
                </p>
              )}

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={submitting}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={confirm}
                  disabled={submitting}
                  className="flex-1 rounded-xl bg-[#6D4AFF] px-4 py-3 text-sm font-semibold text-white hover:bg-[#5D3DE0] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "Creating…" : "Confirm Payment"}
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex gap-3 rounded-xl bg-green-50 p-4 text-sm text-green-800">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0" />

                <p>
                  Your payment request has been created and is awaiting
                  confirmation.
                </p>
              </div>

              {TEST_MODE && created?.id && (
                <SimulationButtons
                  paymentId={created.id}
                  onDone={async () => {
                    await onChanged();
                    onClose();
                  }}
                />
              )}

              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl bg-[#6D4AFF] px-4 py-3 text-sm font-semibold text-white hover:bg-[#5D3DE0]"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PAYMENT CHOICE
========================================================= */

function PaymentChoice({ active, icon: Icon, title, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
        active
          ? "border-[#6D4AFF] bg-[#F5F2FF]"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div
        className={`rounded-xl p-3 ${
          active ? "bg-[#6D4AFF] text-white" : "bg-gray-100 text-gray-600"
        }`}
      >
        <Icon size={20} />
      </div>

      <div className="flex-1">
        <p className="font-semibold text-gray-900">{title}</p>

        <p className="mt-1 text-xs text-gray-500">{description}</p>
      </div>

      <div
        className={`h-5 w-5 rounded-full border-2 ${
          active ? "border-[#6D4AFF] bg-[#6D4AFF]" : "border-gray-300"
        }`}
      >
        {active && <div className="m-1 h-2 w-2 rounded-full bg-white" />}
      </div>
    </button>
  );
}

/* =========================================================
   PAYMENT METHOD
========================================================= */

function PaymentMethod({ icon: Icon, title, description }) {
  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <Icon size={21} className="text-[#6D4AFF]" />

      <p className="mt-3 text-sm font-semibold text-gray-900">{title}</p>

      <p className="mt-1 text-xs text-gray-500">{description}</p>
    </div>
  );
}

/* =========================================================
   PROCESS STEP
========================================================= */

function ProcessStep({ number, title, text }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F0ECFF] text-sm font-bold text-[#6D4AFF]">
        {number}
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-900">{title}</p>

        <p className="mt-1 text-xs leading-5 text-gray-500">{text}</p>
      </div>
    </div>
  );
}

/* =========================================================
   DETAIL ITEM
========================================================= */

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-3">
      <div className="rounded-lg bg-[#F0ECFF] p-2">
        <Icon size={16} className="text-[#6D4AFF]" />
      </div>

      <div>
        <p className="text-xs text-gray-400">{label}</p>

        <p className="mt-0.5 text-sm font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );
}

/* =========================================================
   SUMMARY ROW
========================================================= */

function SummaryRow({ label, value, bold = false }) {
  return (
    <div
      className={`flex items-center justify-between text-sm ${
        bold ? "font-bold text-gray-900" : ""
      }`}
    >
      <span className={bold ? "text-gray-900" : "text-gray-500"}>{label}</span>

      <span>{value}</span>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyPayments({ hasPayments, resetFilters }) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
      <div className="rounded-full bg-gray-100 p-4">
        <WalletCards size={28} className="text-gray-400" />
      </div>

      <h3 className="mt-4 font-semibold text-gray-900">
        {hasPayments ? "No payments found" : "No payment yet"}
      </h3>

      <p className="mt-1 max-w-sm text-sm text-gray-500">
        {hasPayments
          ? "No payment matches your current search and filters."
          : "Your payments will appear here once you have paid for a lesson."}
      </p>

      {hasPayments && (
        <button
          type="button"
          onClick={resetFilters}
          className="mt-5 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}