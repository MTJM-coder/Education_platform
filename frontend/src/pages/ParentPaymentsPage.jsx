import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ParentSidebar from "../components/parent/ParentSidebar";

import {
  WalletCards,
  CreditCard,
  Smartphone,
  Building2,
  Clock3,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Eye,
  Download,
  Search,
  Filter,
  X,
  ChevronRight,
  ShieldCheck,
  UserRound,
  GraduationCap,
  CalendarDays,
  Receipt,
  LockKeyhole,
} from "lucide-react";

/* =========================================================
   DEMO DATA
   À remplacer par les données Laravel/API
========================================================= */

const paymentsData = [
  {
    id: "PAY-2026-001",
    assignmentId: "ASSIGN-001",
    date: "2026-10-05",
    child: "Doly Junior",
    childId: 1,
    teacher: "Xavier Ndi",
    teacherId: 1,
    subject: "Mathematics",
    period: "Weekly",
    amount: 30000,
    commission: 3000,
    teacherAmount: 27000,
    currency: "FCFA",
    method: "Mobile Money",
    provider: "MTN Mobile Money",
    status: "escrow",
    escrowStatus: "held",
    releaseDate: "2026-10-12",
    reference: "MM-78451293",
  },
  {
    id: "PAY-2026-002",
    assignmentId: "ASSIGN-002",
    date: "2026-10-03",
    child: "Mireille Djoumesse",
    childId: 2,
    teacher: "Nfor Grace",
    teacherId: 2,
    subject: "Physics",
    period: "Weekly",
    amount: 35000,
    commission: 3500,
    teacherAmount: 31500,
    currency: "FCFA",
    method: "Orange Money",
    provider: "Orange Money",
    status: "released",
    escrowStatus: "released",
    releaseDate: "2026-10-10",
    reference: "OM-65218472",
  },
  {
    id: "PAY-2026-003",
    assignmentId: "ASSIGN-003",
    date: "2026-09-26",
    child: "Doly Junior",
    childId: 1,
    teacher: "Acha Mireille",
    teacherId: 3,
    subject: "English",
    period: "Monthly",
    amount: 90000,
    commission: 9000,
    teacherAmount: 81000,
    currency: "FCFA",
    method: "Bank Transfer",
    provider: "Bank",
    status: "released",
    escrowStatus: "released",
    releaseDate: "2026-10-03",
    reference: "BT-20260926-118",
  },
  {
    id: "PAY-2026-004",
    assignmentId: "ASSIGN-004",
    date: "2026-09-20",
    child: "Mireille Djoumesse",
    childId: 2,
    teacher: "Nfor Grace",
    teacherId: 2,
    subject: "Physics",
    period: "Weekly",
    amount: 35000,
    commission: 3500,
    teacherAmount: 31500,
    currency: "FCFA",
    method: "Mobile Money",
    provider: "MTN Mobile Money",
    status: "completed",
    escrowStatus: "released",
    releaseDate: "2026-09-27",
    reference: "MM-44782156",
  },
  {
    id: "PAY-2026-005",
    assignmentId: "ASSIGN-005",
    date: "2026-09-15",
    child: "Doly Junior",
    childId: 1,
    teacher: "Xavier Ndi",
    teacherId: 1,
    subject: "Mathematics",
    period: "Weekly",
    amount: 30000,
    commission: 3000,
    teacherAmount: 27000,
    currency: "FCFA",
    method: "Mobile Money",
    provider: "MTN Mobile Money",
    status: "completed",
    escrowStatus: "released",
    releaseDate: "2026-09-22",
    reference: "MM-33214587",
  },
  {
    id: "PAY-2026-006",
    assignmentId: "ASSIGN-006",
    date: "2026-09-08",
    child: "Doly Junior",
    childId: 1,
    teacher: "Xavier Ndi",
    teacherId: 1,
    subject: "Mathematics",
    period: "Weekly",
    amount: 30000,
    commission: 3000,
    teacherAmount: 27000,
    currency: "FCFA",
    method: "Mobile Money",
    provider: "MTN Mobile Money",
    status: "pending",
    escrowStatus: "pending",
    releaseDate: null,
    reference: null,
  },
];

const children = [
  { id: "all", name: "All children" },
  { id: 1, name: "Doly Junior" },
  { id: 2, name: "Mireille Djoumesse" },
];

const statusConfig = {
  pending: {
    label: "Pending",
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
  completed: {
    label: "Completed",
    className: "bg-green-50 text-green-700",
    icon: CheckCircle2,
  },
  failed: {
    label: "Failed",
    className: "bg-red-50 text-red-700",
    icon: XCircle,
  },
};

function formatMoney(amount) {
  return new Intl.NumberFormat("fr-FR").format(amount);
}

function formatDate(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function ParentPaymentsPage() {
  const [payments, setPayments] = useState(paymentsData);

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedChild, setSelectedChild] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [paymentStep, setPaymentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("mobile_money");

  /* -------------------------------------------------------
     STATISTICS
  ------------------------------------------------------- */

  const totalPaid = useMemo(() => {
    return payments
      .filter(
        (payment) =>
          payment.status === "completed" ||
          payment.status === "released" ||
          payment.status === "escrow"
      )
      .reduce((sum, payment) => sum + payment.amount, 0);
  }, [payments]);

  const inEscrow = useMemo(() => {
    return payments
      .filter(
        (payment) =>
          payment.status === "escrow" ||
          payment.escrowStatus === "held"
      )
      .reduce((sum, payment) => sum + payment.amount, 0);
  }, [payments]);

  const pendingAmount = useMemo(() => {
    return payments
      .filter((payment) => payment.status === "pending")
      .reduce((sum, payment) => sum + payment.amount, 0);
  }, [payments]);

  const totalCommission = useMemo(() => {
    return payments.reduce((sum, payment) => sum + payment.commission, 0);
  }, [payments]);

  /* -------------------------------------------------------
     FILTER
  ------------------------------------------------------- */

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        !search ||
        payment.id.toLowerCase().includes(searchText) ||
        payment.teacher.toLowerCase().includes(searchText) ||
        payment.subject.toLowerCase().includes(searchText) ||
        payment.reference?.toLowerCase().includes(searchText);

      const matchesChild =
        selectedChild === "all" ||
        payment.childId === Number(selectedChild);

      const matchesStatus =
        statusFilter === "all" || payment.status === statusFilter;

      return matchesSearch && matchesChild && matchesStatus;
    });
  }, [payments, search, selectedChild, statusFilter]);

  const resetFilters = () => {
    setSearch("");
    setSelectedChild("all");
    setStatusFilter("all");
  };

  /* -------------------------------------------------------
     OPEN PAYMENT
  ------------------------------------------------------- */

  const openPaymentModal = () => {
    setPaymentStep(1);
    setPaymentMethod("mobile_money");
    setShowPaymentModal(true);
  };

  /* -------------------------------------------------------
     DEMO PAYMENT CONFIRMATION
  ------------------------------------------------------- */

  const confirmPayment = () => {
    const newPayment = {
      id: `PAY-2026-${String(payments.length + 1).padStart(3, "0")}`,
      assignmentId: "ASSIGN-NEW",
      date: new Date().toISOString().split("T")[0],
      child: "Doly Junior",
      childId: 1,
      teacher: "Xavier Ndi",
      teacherId: 1,
      subject: "Mathematics",
      period: "Weekly",
      amount: 30000,
      commission: 3000,
      teacherAmount: 27000,
      currency: "FCFA",
      method:
        paymentMethod === "mobile_money"
          ? "Mobile Money"
          : paymentMethod === "bank_transfer"
          ? "Bank Transfer"
          : "Cash",
      provider:
        paymentMethod === "mobile_money"
          ? "Mobile Money"
          : "Bank",
      status: "pending",
      escrowStatus: "pending",
      releaseDate: null,
      reference: null,
    };

    setPayments((prev) => [newPayment, ...prev]);
    setShowPaymentModal(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F8FA]">
      <ParentSidebar />

      <main className="lg:ml-[260px]">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="border-b border-gray-100 bg-white">
          <div className="px-5 py-6 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                  <Link
                    to="/parent-dashboard"
                    className="hover:text-[#6D4AFF]"
                  >
                    Dashboard
                  </Link>

                  <span>/</span>

                  <span className="text-gray-700">Payments</span>
                </div>

                <h1 className="text-2xl font-bold text-gray-900">
                  Payments
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Manage your tutoring payments and payment history.
                </p>
              </div>

              <button
                onClick={openPaymentModal}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D4AFF] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5D3DE0]"
              >
                <CreditCard size={18} />
                Make a Payment
              </button>
            </div>
          </div>
        </div>

        <div className="px-5 py-6 sm:px-8 lg:px-10">
          {/* =================================================
              PAYMENT SECURITY BANNER
          ================================================= */}

          <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-[#DED7FF] bg-[#F5F2FF] p-5 sm:flex-row sm:items-center">
            <div className="rounded-xl bg-white p-3 shadow-sm">
              <ShieldCheck size={25} className="text-[#6D4AFF]" />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                Your payments are protected
              </h3>

              <p className="mt-1 text-sm leading-6 text-gray-600">
                Payments are held securely in escrow until the tutoring
                service conditions are fulfilled.
              </p>
            </div>

            <div className="text-sm font-semibold text-[#6D4AFF]">
              Secure payment
            </div>
          </div>

          {/* =================================================
              STATS
          ================================================= */}

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <PaymentStat
              icon={WalletCards}
              label="Total paid"
              value={`${formatMoney(totalPaid)} FCFA`}
            />

            <PaymentStat
              icon={LockKeyhole}
              label="Currently in escrow"
              value={`${formatMoney(inEscrow)} FCFA`}
            />

            <PaymentStat
              icon={Clock3}
              label="Pending"
              value={`${formatMoney(pendingAmount)} FCFA`}
            />

            <PaymentStat
              icon={Receipt}
              label="Platform fees"
              value={`${formatMoney(totalCommission)} FCFA`}
            />
          </div>

          {/* =================================================
              FILTERS
          ================================================= */}

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
                  placeholder="Search payment, teacher, subject or reference..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#6D4AFF] focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <select
                  value={selectedChild}
                  onChange={(e) => setSelectedChild(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#6D4AFF]"
                >
                  {children.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.name}
                    </option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#6D4AFF]"
                >
                  <option value="all">All statuses</option>
                  <option value="pending">Pending</option>
                  <option value="escrow">In escrow</option>
                  <option value="released">Released</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>

                {(search ||
                  selectedChild !== "all" ||
                  statusFilter !== "all") && (
                  <button
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

          {/* =================================================
              PAYMENT TABLE
          ================================================= */}

          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <div>
                <h2 className="font-semibold text-gray-900">
                  Payment History
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {filteredPayments.length} payment
                  {filteredPayments.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="hidden items-center gap-2 text-sm text-gray-500 sm:flex">
                <Filter size={16} />
                Filtered results
              </div>
            </div>

            {filteredPayments.length > 0 ? (
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
                    {filteredPayments.map((payment) => (
                      <PaymentRow
                        key={payment.id}
                        payment={payment}
                        onView={() => setSelectedPayment(payment)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyPayments resetFilters={resetFilters} />
            )}
          </div>

          {/* =================================================
              PAYMENT METHODS
          ================================================= */}

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-gray-900">
                Available Payment Methods
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Choose the method that works best for you.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <PaymentMethod
                  icon={Smartphone}
                  title="Mobile Money"
                  description="MTN / Orange"
                />

                <PaymentMethod
                  icon={Building2}
                  title="Bank Transfer"
                  description="Local banks"
                />

                <PaymentMethod
                  icon={CreditCard}
                  title="Other"
                  description="Coming soon"
                  disabled
                />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-gray-900">
                Payment Process
              </h2>

              <div className="mt-5 space-y-4">
                <ProcessStep
                  number="1"
                  title="Make payment"
                  text="Choose your preferred payment method."
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
                  text="Funds are released according to the platform rules."
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* =====================================================
          PAYMENT DETAIL MODAL
      ===================================================== */}

      {selectedPayment && (
        <PaymentDetailsModal
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}

      {/* =====================================================
          MAKE PAYMENT MODAL
      ===================================================== */}

      {showPaymentModal && (
        <MakePaymentModal
          step={paymentStep}
          setStep={setPaymentStep}
          method={paymentMethod}
          setMethod={setPaymentMethod}
          onClose={() => setShowPaymentModal(false)}
          onConfirm={confirmPayment}
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

          <p className="mt-1 truncate text-lg font-bold text-gray-900">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PAYMENT ROW
========================================================= */

function PaymentRow({ payment, onView }) {
  const config = statusConfig[payment.status] || statusConfig.pending;
  const StatusIcon = config.icon;

  return (
    <tr className="transition hover:bg-gray-50">
      <td className="px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {payment.id}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {formatDate(payment.date)}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            {payment.subject} · {payment.period}
          </p>
        </div>
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-[#F0ECFF] p-2">
            <GraduationCap size={15} className="text-[#6D4AFF]" />
          </div>

          <span className="text-sm font-medium text-gray-800">
            {payment.child}
          </span>
        </div>
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <UserRound size={15} className="text-gray-400" />

          <span className="text-sm text-gray-700">
            {payment.teacher}
          </span>
        </div>
      </td>

      <td className="px-5 py-4">
        <div>
          <p className="text-sm font-bold text-gray-900">
            {formatMoney(payment.amount)} FCFA
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Fee: {formatMoney(payment.commission)} FCFA
          </p>
        </div>
      </td>

      <td className="px-5 py-4">
        <span className="text-sm text-gray-700">
          {payment.method}
        </span>
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
   PAYMENT DETAILS MODAL
========================================================= */

function PaymentDetailsModal({ payment, onClose }) {
  const config = statusConfig[payment.status] || statusConfig.pending;
  const StatusIcon = config.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <div>
            <p className="text-xs font-medium text-gray-500">
              Payment reference
            </p>

            <h2 className="mt-1 text-xl font-bold text-gray-900">
              {payment.id}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
            <div>
              <p className="text-xs text-gray-500">Amount paid</p>

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

            <DetailItem
              icon={UserRound}
              label="Teacher"
              value={payment.teacher}
            />

            <DetailItem
              icon={GraduationCap}
              label="Child"
              value={payment.child}
            />

            <DetailItem
              icon={Receipt}
              label="Subject"
              value={payment.subject}
            />

            <DetailItem
              icon={CreditCard}
              label="Payment method"
              value={payment.method}
            />

            <DetailItem
              icon={Clock3}
              label="Period"
              value={payment.period}
            />
          </div>

          <div className="rounded-xl border border-gray-100">
            <div className="flex justify-between border-b border-gray-100 px-4 py-3 text-sm">
              <span className="text-gray-500">Service amount</span>

              <span className="font-medium text-gray-900">
                {formatMoney(payment.amount - payment.commission)} FCFA
              </span>
            </div>

            <div className="flex justify-between border-b border-gray-100 px-4 py-3 text-sm">
              <span className="text-gray-500">Platform commission</span>

              <span className="font-medium text-gray-900">
                {formatMoney(payment.commission)} FCFA
              </span>
            </div>

            <div className="flex justify-between px-4 py-3 text-sm font-semibold">
              <span className="text-gray-900">Total paid</span>

              <span className="text-gray-900">
                {formatMoney(payment.amount)} FCFA
              </span>
            </div>
          </div>

          {payment.status === "escrow" && (
            <div className="flex gap-3 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
              <LockKeyhole size={18} className="mt-0.5 shrink-0" />

              <div>
                <p className="font-semibold">
                  Payment currently protected in escrow
                </p>

                <p className="mt-1 leading-5">
                  Expected release date:{" "}
                  <strong>{formatDate(payment.releaseDate)}</strong>
                </p>
              </div>
            </div>
          )}

          {payment.reference && (
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-xs text-gray-500">
                Transaction reference
              </p>

              <p className="mt-1 font-mono text-sm font-semibold text-gray-800">
                {payment.reference}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={() => {
                alert(
                  "Receipt generation will be connected to the Laravel PDF endpoint."
                );
              }}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              <Download size={16} />
              Download Receipt
            </button>

            <button
              onClick={onClose}
              className="flex-1 rounded-xl bg-[#6D4AFF] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#5D3DE0]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAKE PAYMENT MODAL
========================================================= */

function MakePaymentModal({
  step,
  setStep,
  method,
  setMethod,
  onClose,
  onConfirm,
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Make a Payment
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Step {step} of 2
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          {step === 1 ? (
            <>
              <div className="mb-5">
                <h3 className="font-semibold text-gray-900">
                  Select payment method
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Choose how you want to pay for the tutoring service.
                </p>
              </div>

              <div className="space-y-3">
                <PaymentChoice
                  active={method === "mobile_money"}
                  icon={Smartphone}
                  title="Mobile Money"
                  description="MTN Mobile Money / Orange Money"
                  onClick={() => setMethod("mobile_money")}
                />

                <PaymentChoice
                  active={method === "bank_transfer"}
                  icon={Building2}
                  title="Bank Transfer"
                  description="Transfer from your bank account"
                  onClick={() => setMethod("bank_transfer")}
                />

                <PaymentChoice
                  active={method === "other"}
                  icon={CreditCard}
                  title="Other"
                  description="Other payment methods"
                  onClick={() => setMethod("other")}
                />
              </div>

              <button
                onClick={() => setStep(2)}
                className="mt-6 w-full rounded-xl bg-[#6D4AFF] px-4 py-3 text-sm font-semibold text-white hover:bg-[#5D3DE0]"
              >
                Continue
              </button>
            </>
          ) : (
            <>
              <div className="mb-5">
                <h3 className="font-semibold text-gray-900">
                  Confirm payment
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Review the payment information before proceeding.
                </p>
              </div>

              <div className="space-y-3 rounded-xl bg-gray-50 p-4">
                <SummaryRow label="Child" value="Doly Junior" />

                <SummaryRow label="Teacher" value="Xavier Ndi" />

                <SummaryRow label="Subject" value="Mathematics" />

                <SummaryRow label="Period" value="Weekly" />

                <div className="my-2 border-t border-gray-200" />

                <SummaryRow
                  label="Service"
                  value="27,000 FCFA"
                />

                <SummaryRow
                  label="Platform commission"
                  value="3,000 FCFA"
                />

                <SummaryRow
                  label="Total"
                  value="30,000 FCFA"
                  bold
                />
              </div>

              <div className="mt-4 flex gap-3 rounded-xl bg-[#F5F2FF] p-4 text-sm text-gray-700">
                <ShieldCheck
                  size={18}
                  className="mt-0.5 shrink-0 text-[#6D4AFF]"
                />

                <p>
                  The payment will be placed in escrow according to
                  the platform's payment rules.
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>

                <button
                  onClick={onConfirm}
                  className="flex-1 rounded-xl bg-[#6D4AFF] px-4 py-3 text-sm font-semibold text-white hover:bg-[#5D3DE0]"
                >
                  Confirm Payment
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PAYMENT CHOICE
========================================================= */

function PaymentChoice({
  active,
  icon: Icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
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
          active
            ? "border-[#6D4AFF] bg-[#6D4AFF]"
            : "border-gray-300"
        }`}
      >
        {active && (
          <div className="m-1 h-2 w-2 rounded-full bg-white" />
        )}
      </div>
    </button>
  );
}

/* =========================================================
   PAYMENT METHOD
========================================================= */

function PaymentMethod({
  icon: Icon,
  title,
  description,
  disabled = false,
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        disabled
          ? "border-gray-100 bg-gray-50 opacity-60"
          : "border-gray-200"
      }`}
    >
      <Icon size={21} className="text-[#6D4AFF]" />

      <p className="mt-3 text-sm font-semibold text-gray-900">
        {title}
      </p>

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

        <p className="mt-0.5 text-sm font-medium text-gray-800">
          {value}
        </p>
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
      <span className={bold ? "text-gray-900" : "text-gray-500"}>
        {label}
      </span>

      <span>{value}</span>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyPayments({ resetFilters }) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
      <div className="rounded-full bg-gray-100 p-4">
        <WalletCards size={28} className="text-gray-400" />
      </div>

      <h3 className="mt-4 font-semibold text-gray-900">
        No payments found
      </h3>

      <p className="mt-1 max-w-sm text-sm text-gray-500">
        No payment matches your current search and filters.
      </p>

      <button
        onClick={resetFilters}
        className="mt-5 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
      >
        Clear filters
      </button>
    </div>
  );
}