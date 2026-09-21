import { useMemo, useState } from "react";
import {
  ArrowDownToLine,
  Banknote,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  CreditCard,
  Filter,
  LockKeyhole,
  MoreHorizontal,
  Search,
  Settings2,
  ShieldCheck,
  TriangleAlert,
  WalletCards,
  XCircle,
} from "lucide-react";
import SidebarAdmin from "../components/admin/SidebarAdmin";

const payments = [
  {
    id: "PAY-2026-001",
    parent: "Marie Acha",
    learner: "Kevin Acha",
    teacher: "Xavier Ndi",
    subject: "Mathematics",
    amount: 25000,
    commission: 2500,
    teacherAmount: 22500,
    method: "Mobile Money",
    status: "Escrow",
    date: "18 Sept. 2026",
  },
  {
    id: "PAY-2026-002",
    parent: "Pauline Ekane",
    learner: "Sarah Ekane",
    teacher: "Patrick Bih",
    subject: "Computer Science",
    amount: 30000,
    commission: 3000,
    teacherAmount: 27000,
    method: "Bank Transfer",
    status: "Released",
    date: "17 Sept. 2026",
  },
  {
    id: "PAY-2026-003",
    parent: "Claudine Ngo",
    learner: "David Ngo",
    teacher: "Marie Acha",
    subject: "Biology",
    amount: 20000,
    commission: 2000,
    teacherAmount: 18000,
    method: "Mobile Money",
    status: "Pending",
    date: "17 Sept. 2026",
  },
  {
    id: "PAY-2026-004",
    parent: "John Tamba",
    learner: "Michael Tamba",
    teacher: "Daniel Nfor",
    subject: "English",
    amount: 15000,
    commission: 1500,
    teacherAmount: 13500,
    method: "Mobile Money",
    status: "Released",
    date: "16 Sept. 2026",
  },
  {
    id: "PAY-2026-005",
    parent: "Sarah Mballa",
    learner: "Sarah Mballa Jr.",
    teacher: "Xavier Ndi",
    subject: "Physics",
    amount: 35000,
    commission: 3500,
    teacherAmount: 31500,
    method: "Bank Transfer",
    status: "Escrow",
    date: "16 Sept. 2026",
  },
  {
    id: "PAY-2026-006",
    parent: "Daniel Fongang",
    learner: "Emmanuel Fongang",
    teacher: "Patrick Bih",
    subject: "Computer Science",
    amount: 18000,
    commission: 1800,
    teacherAmount: 16200,
    method: "Mobile Money",
    status: "Refunded",
    date: "15 Sept. 2026",
  },
  {
    id: "PAY-2026-007",
    parent: "Marie Acha",
    learner: "Kevin Acha",
    teacher: "Xavier Ndi",
    subject: "Mathematics",
    amount: 25000,
    commission: 2500,
    teacherAmount: 22500,
    method: "Mobile Money",
    status: "Released",
    date: "14 Sept. 2026",
  },
  {
    id: "PAY-2026-008",
    parent: "Pauline Ekane",
    learner: "Sarah Ekane",
    teacher: "Marie Acha",
    subject: "Biology",
    amount: 22000,
    commission: 2200,
    teacherAmount: 19800,
    method: "Mobile Money",
    status: "Escrow",
    date: "14 Sept. 2026",
  },
];

const statusFilters = [
  "All",
  "Escrow",
  "Pending",
  "Released",
  "Refunded",
];

const methods = [
  "All methods",
  "Mobile Money",
  "Bank Transfer",
];

export default function AdminPaymentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] =
    useState("All methods");
  const [openMenu, setOpenMenu] = useState(null);

  const filteredPayments = useMemo(() => {
    const query = search.toLowerCase().trim();

    return payments.filter((payment) => {
      const matchesSearch =
        !query ||
        payment.id.toLowerCase().includes(query) ||
        payment.parent.toLowerCase().includes(query) ||
        payment.learner.toLowerCase().includes(query) ||
        payment.teacher.toLowerCase().includes(query) ||
        payment.subject.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        payment.status === statusFilter;

      const matchesMethod =
        methodFilter === "All methods" ||
        payment.method === methodFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesMethod
      );
    });
  }, [search, statusFilter, methodFilter]);

  const totalVolume = payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  const totalCommission = payments.reduce(
    (sum, payment) => sum + payment.commission,
    0
  );

  const escrowAmount = payments
    .filter((payment) => payment.status === "Escrow")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const releasedAmount = payments
    .filter((payment) => payment.status === "Released")
    .reduce((sum, payment) => sum + payment.teacherAmount, 0);

  return (
    <div className="min-h-screen bg-[#FAF9FB] font-sans text-[#302C38]">
      <SidebarAdmin activeItem="Payments & Finance" />

      <main className="lg:ml-64">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-5 sm:px-8">
          <p className="hidden text-sm text-gray-500 lg:block">
            Payments & Commissions
          </p>

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
          {/* Heading */}
          <section>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-pf-purple">
                  FINANCIAL MANAGEMENT
                </p>

                <h1 className="mt-1 font-serif text-2xl font-medium text-pf-purple-dark sm:text-3xl">
                  Payments & Commissions
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-gray-500">
                  Monitor payments, escrow funds, teacher payouts
                  and platform commissions.
                </p>
              </div>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-pf-purple-dark hover:bg-gray-50"
              >
                <Settings2 className="h-4 w-4 text-pf-purple" />
                Commission settings
              </button>
            </div>
          </section>

          {/* Financial stats */}
          <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={WalletCards}
              label="Total payment volume"
              value={formatFCFA(totalVolume)}
            />

            <StatCard
              icon={Banknote}
              label="Platform commissions"
              value={formatFCFA(totalCommission)}
            />

            <StatCard
              icon={LockKeyhole}
              label="Currently in escrow"
              value={formatFCFA(escrowAmount)}
            />

            <StatCard
              icon={CheckCircle2}
              label="Teacher payouts"
              value={formatFCFA(releasedAmount)}
            />
          </section>

          {/* Escrow information */}
          <section className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="rounded-2xl border border-pf-purple/10 bg-pf-purple-light p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white">
                  <ShieldCheck className="h-5 w-5 text-pf-purple" />
                </div>

                <div>
                  <h2 className="font-serif text-lg text-pf-purple-dark">
                    Escrow protection
                  </h2>

                  <p className="mt-1 max-w-2xl text-xs leading-5 text-gray-600">
                    Parent payments are held securely until the
                    corresponding tutoring service is completed
                    and the payment can be released to the
                    teacher.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <InfoPill
                  icon={LockKeyhole}
                  label="Held in escrow"
                  value={formatFCFA(escrowAmount)}
                />

                <InfoPill
                  icon={Clock3}
                  label="Pending release"
                  value={`${payments.filter(
                    (payment) => payment.status === "Pending"
                  ).length} payments`}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                    Current commission
                  </p>

                  <p className="mt-2 font-serif text-3xl text-pf-purple-dark">
                    10%
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pf-purple-light">
                  <Banknote className="h-5 w-5 text-pf-purple" />
                </div>
              </div>

              <button
                type="button"
                className="mt-4 text-xs font-semibold text-pf-purple hover:underline"
              >
                Change commission rate →
              </button>
            </div>
          </section>

          {/* Payments table */}
          <section className="mt-7 rounded-2xl border border-gray-200 bg-white">
            {/* Toolbar */}
            <div className="border-b border-gray-100 p-5 sm:p-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <h2 className="font-serif text-xl text-pf-purple-dark">
                    Payment transactions
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {filteredPayments.length} transaction
                    {filteredPayments.length !== 1
                      ? "s"
                      : ""}{" "}
                    displayed
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />

                    <input
                      type="text"
                      value={search}
                      onChange={(event) =>
                        setSearch(event.target.value)
                      }
                      placeholder="Search transaction..."
                      className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-pf-purple focus:ring-2 focus:ring-pf-purple/10"
                    />
                  </div>

                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
                  >
                    <ArrowDownToLine className="h-4 w-4" />
                    Export
                  </button>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {statusFilters.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      statusFilter === status
                        ? "bg-pf-purple text-white"
                        : "bg-[#FAF9FB] text-gray-500 hover:bg-pf-purple-light hover:text-pf-purple"
                    }`}
                  >
                    {status}
                  </button>
                ))}

                <div className="relative ml-auto">
                  <select
                    value={methodFilter}
                    onChange={(event) =>
                      setMethodFilter(event.target.value)
                    }
                    className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-9 text-xs text-gray-600 outline-none focus:border-pf-purple"
                  >
                    {methods.map((method) => (
                      <option
                        key={method}
                        value={method}
                      >
                        {method}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[1100px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-[#FCFBFD] text-left">
                    <th className="px-6 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Transaction
                    </th>

                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Participants
                    </th>

                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Amount
                    </th>

                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Commission
                    </th>

                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Teacher payout
                    </th>

                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Method
                    </th>

                    <th className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Status
                    </th>

                    <th className="px-6 py-3 text-right text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPayments.map((payment) => (
                    <PaymentRow
                      key={payment.id}
                      payment={payment}
                      openMenu={openMenu}
                      setOpenMenu={setOpenMenu}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="divide-y divide-gray-100 md:hidden">
              {filteredPayments.map((payment) => (
                <PaymentMobileCard
                  key={payment.id}
                  payment={payment}
                  openMenu={openMenu}
                  setOpenMenu={setOpenMenu}
                />
              ))}
            </div>

            {filteredPayments.length === 0 && (
              <div className="py-16 text-center">
                <WalletCards className="mx-auto h-8 w-8 text-gray-300" />

                <h3 className="mt-4 font-serif text-lg text-pf-purple-dark">
                  No payments found
                </h3>

                <p className="mt-1 text-sm text-gray-400">
                  Try changing your search or filters.
                </p>
              </div>
            )}

            {filteredPayments.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-5 py-4 sm:px-6">
                <p className="text-xs text-gray-400">
                  Showing {filteredPayments.length} of{" "}
                  {payments.length} transactions
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled
                    className="rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-300"
                  >
                    Previous
                  </button>

                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-pf-purple text-xs font-semibold text-white">
                    1
                  </span>

                  <button
                    type="button"
                    className="rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-500 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

/* ========================================================= */
/* STAT CARD                                                   */
/* ========================================================= */

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pf-purple-light">
          <Icon className="h-5 w-5 text-pf-purple" />
        </div>

        <span className="text-right font-serif text-xl text-pf-purple-dark">
          {value}
        </span>
      </div>

      <p className="mt-4 text-xs text-gray-500">
        {label}
      </p>
    </div>
  );
}

/* ========================================================= */
/* INFO PILL                                                    */
/* ========================================================= */

function InfoPill({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5">
      <Icon className="h-4 w-4 text-pf-purple" />

      <div>
        <p className="text-[10px] text-gray-400">
          {label}
        </p>

        <p className="text-xs font-semibold text-pf-purple-dark">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ========================================================= */
/* PAYMENT ROW                                                  */
/* ========================================================= */

function PaymentRow({
  payment,
  openMenu,
  setOpenMenu,
}) {
  return (
    <tr className="border-b border-gray-100 last:border-0 hover:bg-[#FCFBFD]">
      <td className="px-6 py-4">
        <p className="text-xs font-semibold text-pf-purple-dark">
          {payment.id}
        </p>

        <p className="mt-1 text-[10px] text-gray-400">
          {payment.date}
        </p>
      </td>

      <td className="px-4 py-4">
        <p className="text-xs font-medium text-gray-600">
          {payment.parent}
        </p>

        <p className="mt-1 text-[10px] text-gray-400">
          → {payment.teacher}
        </p>

        <p className="mt-1 text-[10px] text-gray-400">
          {payment.learner} · {payment.subject}
        </p>
      </td>

      <td className="px-4 py-4">
        <p className="text-xs font-semibold text-pf-purple-dark">
          {formatFCFA(payment.amount)}
        </p>
      </td>

      <td className="px-4 py-4">
        <p className="text-xs font-medium text-pf-green">
          +{formatFCFA(payment.commission)}
        </p>

        <p className="mt-1 text-[10px] text-gray-400">
          10%
        </p>
      </td>

      <td className="px-4 py-4">
        <p className="text-xs font-semibold text-gray-600">
          {formatFCFA(payment.teacherAmount)}
        </p>
      </td>

      <td className="px-4 py-4">
        <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
          <CreditCard className="h-3.5 w-3.5" />
          {payment.method}
        </span>
      </td>

      <td className="px-4 py-4">
        <PaymentStatus status={payment.status} />
      </td>

      <td className="relative px-6 py-4 text-right">
        <button
          type="button"
          onClick={() =>
            setOpenMenu(
              openMenu === payment.id
                ? null
                : payment.id
            )
          }
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-pf-purple"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>

        {openMenu === payment.id && (
          <PaymentActionMenu payment={payment} />
        )}
      </td>
    </tr>
  );
}

/* ========================================================= */
/* MOBILE CARD                                                  */
/* ========================================================= */

function PaymentMobileCard({
  payment,
  openMenu,
  setOpenMenu,
}) {
  return (
    <div className="relative p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-pf-purple-dark">
            {payment.id}
          </p>

          <p className="mt-1 text-[10px] text-gray-400">
            {payment.date}
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setOpenMenu(
              openMenu === payment.id
                ? null
                : payment.id
            )
          }
          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 rounded-xl bg-[#FAF9FB] p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-600">
              {payment.parent}
            </p>

            <p className="mt-1 text-[10px] text-gray-400">
              Learner: {payment.learner}
            </p>
          </div>

          <p className="text-sm font-semibold text-pf-purple-dark">
            {formatFCFA(payment.amount)}
          </p>
        </div>

        <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-400">
          <span>{payment.subject}</span>
          <span>•</span>
          <span>{payment.teacher}</span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <MiniFinancialStat
          label="Commission"
          value={formatFCFA(payment.commission)}
        />

        <MiniFinancialStat
          label="Teacher payout"
          value={formatFCFA(payment.teacherAmount)}
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[11px] text-gray-400">
          {payment.method}
        </span>

        <PaymentStatus status={payment.status} />
      </div>

      {openMenu === payment.id && (
        <PaymentActionMenu
          payment={payment}
          mobile
        />
      )}
    </div>
  );
}

/* ========================================================= */
/* MINI FINANCIAL STAT                                         */
/* ========================================================= */

function MiniFinancialStat({ label, value }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-white p-2.5">
      <p className="text-[10px] text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-xs font-semibold text-pf-purple-dark">
        {value}
      </p>
    </div>
  );
}

/* ========================================================= */
/* PAYMENT STATUS                                               */
/* ========================================================= */

function PaymentStatus({ status }) {
  const config = {
    Escrow: {
      icon: LockKeyhole,
      className: "bg-blue-50 text-blue-600",
    },

    Pending: {
      icon: Clock3,
      className: "bg-amber-50 text-amber-600",
    },

    Released: {
      icon: CheckCircle2,
      className: "bg-green-50 text-green-600",
    },

    Refunded: {
      icon: XCircle,
      className: "bg-red-50 text-red-600",
    },
  };

  const current = config[status] || config.Pending;
  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${current.className}`}
    >
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}

/* ========================================================= */
/* ACTION MENU                                                  */
/* ========================================================= */

function PaymentActionMenu({
  payment,
  mobile = false,
}) {
  return (
    <div
      className={`absolute z-30 w-48 rounded-xl border border-gray-200 bg-white p-1.5 text-left shadow-lg ${
        mobile
          ? "right-5 top-16"
          : "right-6 top-12"
      }`}
    >
      <a
        href={`/admin-payments/${payment.id}`}
        className="flex items-center justify-between rounded-lg px-3 py-2 text-xs text-gray-600 hover:bg-pf-purple-light hover:text-pf-purple"
      >
        View transaction
        <ChevronRight className="h-3.5 w-3.5" />
      </a>

      {payment.status === "Escrow" && (
        <button
          type="button"
          className="w-full rounded-lg px-3 py-2 text-left text-xs text-green-600 hover:bg-green-50"
        >
          Release payment
        </button>
      )}

      {payment.status === "Pending" && (
        <button
          type="button"
          className="w-full rounded-lg px-3 py-2 text-left text-xs text-pf-purple hover:bg-pf-purple-light"
        >
          Review payment
        </button>
      )}

      {payment.status !== "Refunded" && (
        <button
          type="button"
          className="w-full rounded-lg px-3 py-2 text-left text-xs text-red-500 hover:bg-red-50"
        >
          Issue refund
        </button>
      )}
    </div>
  );
}

/* ========================================================= */
/* HELPERS                                                      */
/* ========================================================= */

function formatFCFA(amount) {
  return `${amount.toLocaleString("fr-FR")} FCFA`;
}