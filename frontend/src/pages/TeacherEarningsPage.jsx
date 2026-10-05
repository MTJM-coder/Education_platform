import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDownToLine,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Coins,
  CreditCard,
  DollarSign,
  Download,
  LockKeyhole,
  TrendingUp,
  Wallet,
  X,
  XCircle,
} from "lucide-react";
import TeacherSidebar from "../components/teacher/TeacherSidebar";
import { apiFetch } from "../lib/apiClient";

function toList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  return [];
}

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
  const own = getUserName(learner?.user);
  if (own) return own;

  const parent = getUserName(learner?.parent_profile?.user);
  if (parent) return `Child of ${parent}`;

  return "Student";
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
  return `${number.toLocaleString("fr-FR")} FCFA`;
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function monthKey(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key) {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}

// Statut affiché = combinaison de payments.status et payments.escrow_status.
function paymentState(payment) {
  if (payment.status === "paid") {
    return payment.escrow_status === "released" ? "released" : "escrow";
  }
  return payment.status; // pending | failed | refunded
}

function toRow(payment) {
  const request = payment.assignment?.tutoring_request;
  const paid = payment.status === "paid";

  return {
    id: payment.id,
    shortId: String(payment.id).slice(0, 8),
    date: payment.created_at,
    period: capitalize(payment.period),
    student: getLearnerName(request?.learner),
    subject: request?.subject?.name ?? "—",
    gross: Number(payment.amount),
    commission: paid ? Number(payment.commission_amount) : null,
    net: paid ? Number(payment.teacher_amount) : null,
    state: paymentState(payment),
  };
}

const METHODS = [
  { value: "mobile_money", label: "Mobile Money" },
  { value: "bank_transfer", label: "Bank transfer" },
  { value: "other", label: "Other" },
];

function methodLabel(value) {
  return METHODS.find((method) => method.value === value)?.label ?? value;
}

// Export CSV du tableau affiché (généré dans le navigateur).
function exportCsv(rows) {
  const escape = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

  const header = [
    "Payment",
    "Date",
    "Period",
    "Student",
    "Subject",
    "Gross (FCFA)",
    "Commission (FCFA)",
    "Net (FCFA)",
    "Status",
  ];

  const lines = rows.map((row) =>
    [
      row.shortId,
      formatDate(row.date),
      row.period,
      row.student,
      row.subject,
      row.gross,
      row.commission ?? "",
      row.net ?? "",
      PAYMENT_STATES[row.state]?.label ?? row.state,
    ]
      .map(escape)
      .join(",")
  );

  const blob = new Blob(["\uFEFF" + [header.map(escape).join(","), ...lines].join("\n")], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "payment-history.csv";
  link.click();
  URL.revokeObjectURL(url);
}


export default function TeacherEarningsPage() {
  const [earnings, setEarnings] = useState(null);
  const [payments, setPayments] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [month, setMonth] = useState("all");
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  // Recharge les chiffres et les retraits (après une demande ou une annulation).
  const reloadMoney = useCallback(async () => {
    const [earningsRes, withdrawalsRes] = await Promise.all([
      apiFetch("/me/earnings"),
      apiFetch("/me/withdrawals"),
    ]);
    setEarnings(toObject(earningsRes));
    setWithdrawals(toList(withdrawalsRes));
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [earningsRes, paymentsRes, withdrawalsRes] = await Promise.all([
          apiFetch("/me/earnings"),
          apiFetch("/me/payments"),
          apiFetch("/me/withdrawals"),
        ]);

        if (cancelled) return;
        setEarnings(toObject(earningsRes));
        setPayments(toList(paymentsRes));
        setWithdrawals(toList(withdrawalsRes));
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Unable to load your earnings.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const rows = useMemo(() => payments.map(toRow), [payments]);

  const monthOptions = useMemo(() => {
    const keys = new Set(rows.map((row) => monthKey(row.date)).filter(Boolean));
    return Array.from(keys).sort().reverse();
  }, [rows]);

  const visibleRows = useMemo(
    () =>
      month === "all" ? rows : rows.filter((row) => monthKey(row.date) === month),
    [rows, month]
  );

  // Totaux calculés sur les paiements effectivement payés (libérés ou en séquestre).
  const totals = useMemo(() => {
    const paid = rows.filter(
      (row) => row.state === "released" || row.state === "escrow"
    );
    const sum = (key) => paid.reduce((total, row) => total + (row[key] || 0), 0);

    return { gross: sum("gross"), commission: sum("commission"), net: sum("net") };
  }, [rows]);

  const available = Number(earnings?.available_balance ?? 0);
  const minimum = Number(earnings?.min_withdrawal ?? 0);
  const rate = Number(earnings?.commission_rate ?? 0);
  const percentChange = earnings?.percent_change;
  const canWithdraw = !loading && available >= Math.max(minimum, 0.01);

  const handleCancel = async (withdrawal) => {
    if (!window.confirm("Cancel this withdrawal request?")) return;

    setCancellingId(withdrawal.id);
    setError("");

    try {
      await apiFetch(`/me/withdrawals/${withdrawal.id}/cancel`, {
        method: "PATCH",
      });
      await reloadMoney();
    } catch (err) {
      setError(err?.message || "Unable to cancel this withdrawal.");
    } finally {
      setCancellingId(null);
    }
  };

  const feeExample = Math.round((50000 * rate) / 100);

  return (
    <div className="min-h-screen bg-[#FAFAFC]">
      <TeacherSidebar activeItem="Earnings" />

      <main className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-100 bg-white/95 px-6 backdrop-blur lg:px-8">
          <div className="ml-12 lg:ml-0">
            <p className="text-xs text-gray-400">Teacher Portal</p>

            <h1 className="text-lg font-semibold text-pf-purple-dark">
              Earnings
            </h1>
          </div>

          <button
            type="button"
            onClick={() => exportCsv(visibleRows)}
            disabled={visibleRows.length === 0}
            className="hidden items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </header>

        <div className="p-6 lg:p-8">
          {/* Intro */}
          <section className="mb-7">
            <h2 className="font-serif text-2xl font-semibold text-pf-purple-dark">
              My Earnings
            </h2>

            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Track your teaching income, platform commissions, escrow funds
              and payment history.
            </p>
          </section>

          {error && (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600"
            >
              {error}
            </div>
          )}

          {/* Main balance */}
          <section className="grid gap-5 lg:grid-cols-3">
            <div className="rounded-xl bg-pf-purple p-6 text-white shadow-sm lg:col-span-2">
              <div className="flex flex-col justify-between gap-6 sm:flex-row">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-white/60">
                    Available Balance
                  </p>

                  <p className="mt-3 text-4xl font-bold">
                    {loading ? "—" : formatMoney(available)}
                  </p>

                  <p className="mt-2 text-sm text-white/70">
                    Amount currently available for withdrawal
                  </p>

                  {Number(earnings?.pending_withdrawals) > 0 && (
                    <p className="mt-1 text-xs text-white/60">
                      {formatMoney(earnings.pending_withdrawals)} already
                      requested and being processed
                    </p>
                  )}
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10">
                  <Wallet className="h-7 w-7" />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowWithdraw(true)}
                disabled={!canWithdraw}
                className="mt-6 flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-pf-purple hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ArrowDownToLine className="h-4 w-4" />
                Request Withdrawal
              </button>

              {!loading && !canWithdraw && (
                <p className="mt-2 text-xs text-white/60">
                  {minimum > 0
                    ? `The minimum withdrawal is ${formatMoney(minimum)}.`
                    : "You have no funds available yet."}
                </p>
              )}
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <LockKeyhole className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    In Escrow
                  </p>

                  <p className="mt-1 text-xl font-bold text-pf-purple-dark">
                    {loading ? "—" : formatMoney(earnings?.in_escrow)}
                  </p>
                </div>
              </div>

              <p className="mt-5 text-xs leading-5 text-gray-400">
                These funds are temporarily held by the platform and will be
                released by the administration after review.
              </p>

              <div className="mt-4 flex items-center gap-2 text-xs font-medium text-amber-600">
                <Clock3 className="h-4 w-4" />
                Awaiting release
              </div>
            </div>
          </section>

          {/* Statistics */}
          <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <EarningCard
              icon={TrendingUp}
              label="Total Gross"
              value={loading ? "—" : formatMoney(totals.gross)}
              description="Before commission"
            />

            <EarningCard
              icon={Coins}
              label="Platform Commission"
              value={loading ? "—" : formatMoney(totals.commission)}
              description="Automatically deducted"
            />

            <EarningCard
              icon={DollarSign}
              label="Total Net"
              value={loading ? "—" : formatMoney(totals.net)}
              description="Teacher earnings"
            />

            <EarningCard
              icon={CalendarDays}
              label="This Month"
              value={loading ? "—" : formatMoney(earnings?.this_month)}
              description={
                percentChange === null || percentChange === undefined
                  ? "Net earnings"
                  : `${percentChange > 0 ? "+" : ""}${percentChange}% vs last month`
              }
            />
          </section>

          {/* Commission information */}
          <section className="mt-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-pf-purple" />

                  <h3 className="font-semibold text-pf-purple-dark">
                    Platform Commission
                  </h3>
                </div>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                  The platform automatically deducts its configured commission
                  before your payment is released.
                </p>
              </div>

              <div className="rounded-xl bg-pf-purple-light px-6 py-4 text-center">
                <p className="text-xs text-gray-400">Current rate</p>

                <p className="mt-1 text-2xl font-bold text-pf-purple">
                  {loading ? "—" : `${rate}%`}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <MoneyExample label="Parent pays" value={formatMoney(50000)} />
              <MoneyExample label="Platform fee" value={formatMoney(feeExample)} />
              <MoneyExample
                label="You receive"
                value={formatMoney(50000 - feeExample)}
              />
            </div>
          </section>

          {/* Transactions */}
          <section className="mt-6 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-gray-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold text-pf-purple-dark">
                  Payment History
                </h3>

                <p className="mt-1 text-xs text-gray-400">
                  Your recent teaching payments
                </p>
              </div>

              <label className="flex items-center gap-2 text-xs font-medium text-pf-purple">
                <CalendarDays className="h-4 w-4" />

                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  aria-label="Filter by month"
                  className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-medium text-pf-purple outline-none focus:border-pf-purple"
                >
                  <option value="all">All payments</option>
                  {monthOptions.map((key) => (
                    <option key={key} value={key}>
                      {monthLabel(key)}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {loading ? (
              <p className="px-6 py-12 text-center text-sm text-gray-400">
                Loading your payments…
              </p>
            ) : visibleRows.length === 0 ? (
              <p className="px-6 py-12 text-center text-sm text-gray-400">
                No payment to display.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px]">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60">
                      <Th>Payment</Th>
                      <Th>Student</Th>
                      <Th>Gross</Th>
                      <Th>Commission</Th>
                      <Th>Net</Th>
                      <Th>Status</Th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {visibleRows.map((row) => (
                      <TransactionRow key={row.id} transaction={row} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Withdrawals */}
          <section className="mt-6 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-5">
              <h3 className="font-semibold text-pf-purple-dark">
                Withdrawal History
              </h3>

              <p className="mt-1 text-xs text-gray-400">
                Your withdrawal requests and their status
              </p>
            </div>

            {loading ? (
              <p className="px-6 py-12 text-center text-sm text-gray-400">
                Loading your withdrawals…
              </p>
            ) : withdrawals.length === 0 ? (
              <p className="px-6 py-12 text-center text-sm text-gray-400">
                You have not requested any withdrawal yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[750px]">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60">
                      <Th>Requested</Th>
                      <Th>Amount</Th>
                      <Th>Sent to</Th>
                      <Th>Status</Th>
                      <Th>Details</Th>
                      <th className="px-6 py-4" />
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {withdrawals.map((withdrawal) => (
                      <WithdrawalRow
                        key={withdrawal.id}
                        withdrawal={withdrawal}
                        cancelling={cancellingId === withdrawal.id}
                        onCancel={() => handleCancel(withdrawal)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Escrow explanation */}
          <section className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-5">
            <div className="flex gap-3">
              <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

              <div>
                <h3 className="text-sm font-semibold text-blue-800">
                  How escrow protects you
                </h3>

                <p className="mt-1 text-xs leading-5 text-blue-700">
                  Parents pay before the service begins, but the teacher's
                  money is not immediately released. The platform temporarily
                  holds the funds and the administration releases your share
                  after review, as long as no dispute is open on your lessons.
                  This protects both the parent and the teacher.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {showWithdraw && (
        <WithdrawModal
          available={available}
          minimum={minimum}
          onClose={() => setShowWithdraw(false)}
          onRequested={async () => {
            setShowWithdraw(false);
            setError("");
            try {
              await reloadMoney();
            } catch (err) {
              setError(
                err?.message ||
                  "Withdrawal requested, but the page could not be refreshed."
              );
            }
          }}
        />
      )}
    </div>
  );
}

/* ========================================================= */
/* EARNING CARD                                                */
/* ========================================================= */

function EarningCard({ icon: Icon, label, value, description }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {label}
          </p>

          <p className="mt-2 text-xl font-bold text-pf-purple-dark">{value}</p>

          <p className="mt-1 text-xs text-gray-400">{description}</p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pf-purple-light text-pf-purple">
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

function Th({ children }) {
  return (
    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
      {children}
    </th>
  );
}

/* ========================================================= */
/* TRANSACTION ROW                                             */
/* ========================================================= */

function TransactionRow({ transaction }) {
  return (
    <tr className="transition hover:bg-gray-50/60">
      <td className="px-6 py-4">
        <div>
          <p className="text-sm font-medium text-pf-purple-dark">
            #{transaction.shortId}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            {formatDate(transaction.date)}
            {transaction.period ? ` · ${transaction.period}` : ""}
          </p>
        </div>
      </td>

      <td className="px-6 py-4">
        <p className="text-sm font-medium text-gray-600">
          {transaction.student}
        </p>

        <p className="mt-1 text-xs text-gray-400">{transaction.subject}</p>
      </td>

      <td className="px-6 py-4 text-sm text-gray-600">
        {formatMoney(transaction.gross)}
      </td>

      <td className="px-6 py-4 text-sm text-red-500">
        {transaction.commission === null
          ? "—"
          : `-${formatMoney(transaction.commission)}`}
      </td>

      <td className="px-6 py-4 text-sm font-semibold text-pf-purple-dark">
        {formatMoney(transaction.net)}
      </td>

      <td className="px-6 py-4">
        <StatusPill states={PAYMENT_STATES} value={transaction.state} />
      </td>
    </tr>
  );
}

/* ========================================================= */
/* WITHDRAWAL ROW                                              */
/* ========================================================= */

function WithdrawalRow({ withdrawal, cancelling, onCancel }) {
  const details =
    withdrawal.status === "completed"
      ? withdrawal.reference
        ? `Ref. ${withdrawal.reference}`
        : "—"
      : withdrawal.admin_note || "—";

  return (
    <tr className="transition hover:bg-gray-50/60">
      <td className="px-6 py-4 text-sm text-gray-600">
        {formatDate(withdrawal.requested_at)}
      </td>

      <td className="px-6 py-4 text-sm font-semibold text-pf-purple-dark">
        {formatMoney(withdrawal.amount)}
      </td>

      <td className="px-6 py-4">
        <p className="text-sm text-gray-600">{withdrawal.account_number}</p>
        <p className="mt-1 text-xs text-gray-400">
          {methodLabel(withdrawal.method)}
        </p>
      </td>

      <td className="px-6 py-4">
        <StatusPill states={WITHDRAWAL_STATES} value={withdrawal.status} />
      </td>

      <td className="px-6 py-4 text-xs text-gray-500">{details}</td>

      <td className="px-6 py-4 text-right">
        {withdrawal.status === "pending" && (
          <button
            type="button"
            onClick={onCancel}
            disabled={cancelling}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelling ? "Cancelling…" : "Cancel"}
          </button>
        )}
      </td>
    </tr>
  );
}

/* ========================================================= */
/* STATUS PILLS                                                */
/* ========================================================= */

const PAYMENT_STATES = {
  released: {
    label: "Released",
    icon: CheckCircle2,
    className: "bg-green-50 text-green-700",
  },
  escrow: {
    label: "In Escrow",
    icon: Clock3,
    className: "bg-amber-50 text-amber-700",
  },
  pending: {
    label: "Awaiting payment",
    icon: Clock3,
    className: "bg-gray-100 text-gray-600",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    className: "bg-red-50 text-red-700",
  },
  refunded: {
    label: "Refunded",
    icon: XCircle,
    className: "bg-gray-100 text-gray-600",
  },
};

const WITHDRAWAL_STATES = {
  pending: {
    label: "Pending",
    icon: Clock3,
    className: "bg-amber-50 text-amber-700",
  },
  completed: {
    label: "Paid",
    icon: CheckCircle2,
    className: "bg-green-50 text-green-700",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    className: "bg-red-50 text-red-700",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "bg-gray-100 text-gray-600",
  },
};

function StatusPill({ states, value }) {
  const config = states[value] ?? {
    label: capitalize(value) || "Unknown",
    icon: Clock3,
    className: "bg-gray-100 text-gray-600",
  };
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${config.className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

/* ========================================================= */
/* MONEY EXAMPLE                                               */
/* ========================================================= */

function MoneyExample({ label, value }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
      <p className="text-xs text-gray-400">{label}</p>

      <p className="mt-1 text-sm font-semibold text-pf-purple-dark">{value}</p>
    </div>
  );
}

/* ========================================================= */
/* WITHDRAW MODAL                                              */
/* ========================================================= */

function WithdrawModal({ available, minimum, onClose, onRequested }) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("mobile_money");
  const [account, setAccount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async () => {
    setFormError("");

    const value = Number(amount);

    if (!amount || !Number.isFinite(value) || value <= 0) {
      setFormError("Enter a valid amount.");
      return;
    }

    if (minimum > 0 && value < minimum) {
      setFormError(`The minimum withdrawal is ${formatMoney(minimum)}.`);
      return;
    }

    if (value > available) {
      setFormError(
        `You can withdraw at most ${formatMoney(available)} right now.`
      );
      return;
    }

    if (!account.trim()) {
      setFormError("Enter the account that should receive the money.");
      return;
    }

    setSubmitting(true);

    try {
      await apiFetch("/me/withdrawals", {
        method: "POST",
        body: JSON.stringify({
          amount: value,
          method,
          account_number: account.trim(),
        }),
      });

      await onRequested();
    } catch (err) {
      setFormError(err?.message || "Unable to request this withdrawal.");
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Request a withdrawal"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <h2 className="font-semibold text-pf-purple-dark">
            Request Withdrawal
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

        <div className="p-6">
          <div className="rounded-xl bg-pf-purple-light p-4">
            <p className="text-xs text-gray-400">Available balance</p>

            <p className="mt-1 text-xl font-bold text-pf-purple">
              {formatMoney(available)}
            </p>
          </div>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-gray-500">
                Amount (FCFA)
              </span>

              <input
                type="number"
                min={minimum || 0}
                max={available}
                step="any"
                inputMode="decimal"
                placeholder={minimum > 0 ? `Minimum ${minimum}` : "Amount"}
                className="form-input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-gray-500">
                  Method
                </span>

                <select
                  className="form-input"
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                >
                  {METHODS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-gray-500">
                  {method === "mobile_money" ? "Phone number" : "Account number"}
                </span>

                <input
                  type="text"
                  placeholder={
                    method === "mobile_money" ? "e.g. 670000000" : "Account number"
                  }
                  className="form-input"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                />
              </label>
            </div>
          </div>

          <p className="mt-4 text-xs leading-5 text-gray-400">
            The amount is reserved as soon as you submit. The administration
            sends the money and confirms it here. You can cancel while the
            request is pending.
          </p>

          {formError && (
            <p role="alert" className="mt-4 text-sm text-red-600">
              {formError}
            </p>
          )}

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
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 rounded-lg bg-pf-purple px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowDownToLine className="h-4 w-4" />
              {submitting ? "Submitting…" : "Request Withdrawal"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}