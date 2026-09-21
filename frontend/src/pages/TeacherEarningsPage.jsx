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
} from "lucide-react";
import TeacherSidebar from "../components/teacher/TeacherSidebar";

const transactions = [
  {
    id: "PAY-001",
    student: "Student A",
    subject: "Mathematics",
    date: "Sep 18, 2026",
    period: "Weekly",
    gross: 25000,
    commission: 2500,
    net: 22500,
    status: "Released",
  },
  {
    id: "PAY-002",
    student: "Student B",
    subject: "Physics",
    date: "Sep 17, 2026",
    period: "Monthly",
    gross: 60000,
    commission: 6000,
    net: 54000,
    status: "Released",
  },
  {
    id: "PAY-003",
    student: "Student C",
    subject: "Mathematics",
    date: "Sep 20, 2026",
    period: "Weekly",
    gross: 20000,
    commission: 2000,
    net: 18000,
    status: "In Escrow",
  },
  {
    id: "PAY-004",
    student: "Student D",
    subject: "Chemistry",
    date: "Sep 15, 2026",
    period: "Hourly",
    gross: 10000,
    commission: 1000,
    net: 9000,
    status: "Released",
  },
];

export default function TeacherEarningsPage() {
  const totalGross = transactions.reduce(
    (sum, item) => sum + item.gross,
    0
  );

  const totalCommission = transactions.reduce(
    (sum, item) => sum + item.commission,
    0
  );

  const totalNet = transactions.reduce(
    (sum, item) => sum + item.net,
    0
  );

  const inEscrow = transactions
    .filter((item) => item.status === "In Escrow")
    .reduce((sum, item) => sum + item.net, 0);

  const availableBalance = transactions
    .filter((item) => item.status === "Released")
    .reduce((sum, item) => sum + item.net, 0);

  return (
    <div className="min-h-screen bg-[#FAFAFC]">
      <TeacherSidebar activeItem="Earnings" />

      <main className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-100 bg-white/95 px-6 backdrop-blur lg:px-8">
          <div className="ml-12 lg:ml-0">
            <p className="text-xs text-gray-400">
              Teacher Portal
            </p>

            <h1 className="text-lg font-semibold text-pf-purple-dark">
              Earnings
            </h1>
          </div>

          <button
            type="button"
            className="hidden items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 sm:flex"
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
              Track your teaching income, platform commissions,
              escrow funds and payment history.
            </p>
          </section>

          {/* Main balance */}
          <section className="grid gap-5 lg:grid-cols-3">
            <div className="rounded-xl bg-pf-purple p-6 text-white shadow-sm lg:col-span-2">
              <div className="flex flex-col justify-between gap-6 sm:flex-row">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-white/60">
                    Available Balance
                  </p>

                  <p className="mt-3 text-4xl font-bold">
                    {formatMoney(availableBalance)}
                  </p>

                  <p className="mt-2 text-sm text-white/70">
                    Amount currently available for withdrawal
                  </p>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10">
                  <Wallet className="h-7 w-7" />
                </div>
              </div>

              <button
                type="button"
                className="mt-6 flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-pf-purple hover:bg-gray-50"
              >
                <ArrowDownToLine className="h-4 w-4" />
                Request Withdrawal
              </button>
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
                    {formatMoney(inEscrow)}
                  </p>
                </div>
              </div>

              <p className="mt-5 text-xs leading-5 text-gray-400">
                These funds are temporarily held by the
                platform and will be released after the
                corresponding sessions are confirmed.
              </p>

              <div className="mt-4 flex items-center gap-2 text-xs font-medium text-amber-600">
                <Clock3 className="h-4 w-4" />
                Awaiting session confirmation
              </div>
            </div>
          </section>

          {/* Statistics */}
          <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <EarningCard
              icon={TrendingUp}
              label="Total Gross"
              value={formatMoney(totalGross)}
              description="Before commission"
            />

            <EarningCard
              icon={Coins}
              label="Platform Commission"
              value={formatMoney(totalCommission)}
              description="Automatically deducted"
            />

            <EarningCard
              icon={DollarSign}
              label="Total Net"
              value={formatMoney(totalNet)}
              description="Teacher earnings"
            />

            <EarningCard
              icon={CalendarDays}
              label="Paid Sessions"
              value="42"
              description="This month"
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
                  The platform automatically deducts its configured
                  commission before your payment is released.
                </p>
              </div>

              <div className="rounded-xl bg-pf-purple-light px-6 py-4 text-center">
                <p className="text-xs text-gray-400">
                  Current rate
                </p>

                <p className="mt-1 text-2xl font-bold text-pf-purple">
                  10%
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <MoneyExample
                label="Parent pays"
                value="50,000 FCFA"
              />

              <MoneyExample
                label="Platform fee"
                value="5,000 FCFA"
              />

              <MoneyExample
                label="You receive"
                value="45,000 FCFA"
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

              <button
                type="button"
                className="flex items-center gap-2 text-xs font-medium text-pf-purple"
              >
                <CalendarDays className="h-4 w-4" />
                September 2026
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Payment
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Student
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Gross
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Commission
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Net
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {transactions.map((transaction) => (
                    <TransactionRow
                      key={transaction.id}
                      transaction={transaction}
                    />
                  ))}
                </tbody>
              </table>
            </div>
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
                  Parents pay before the service begins, but the
                  teacher's money is not immediately released.
                  The platform temporarily holds the funds and
                  releases your share after the session has been
                  confirmed. This protects both the parent and
                  the teacher.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* ========================================================= */
/* EARNING CARD                                               */
/* ========================================================= */

function EarningCard({
  icon: Icon,
  label,
  value,
  description,
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {label}
          </p>

          <p className="mt-2 text-xl font-bold text-pf-purple-dark">
            {value}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            {description}
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pf-purple-light text-pf-purple">
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

/* ========================================================= */
/* TRANSACTION ROW                                            */
/* ========================================================= */

function TransactionRow({ transaction }) {
  return (
    <tr className="transition hover:bg-gray-50/60">
      <td className="px-6 py-4">
        <div>
          <p className="text-sm font-medium text-pf-purple-dark">
            {transaction.id}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            {transaction.date} · {transaction.period}
          </p>
        </div>
      </td>

      <td className="px-6 py-4">
        <p className="text-sm font-medium text-gray-600">
          {transaction.student}
        </p>

        <p className="mt-1 text-xs text-gray-400">
          {transaction.subject}
        </p>
      </td>

      <td className="px-6 py-4 text-sm text-gray-600">
        {formatMoney(transaction.gross)}
      </td>

      <td className="px-6 py-4 text-sm text-red-500">
        -{formatMoney(transaction.commission)}
      </td>

      <td className="px-6 py-4 text-sm font-semibold text-pf-purple-dark">
        {formatMoney(transaction.net)}
      </td>

      <td className="px-6 py-4">
        <PaymentStatus status={transaction.status} />
      </td>
    </tr>
  );
}

/* ========================================================= */
/* PAYMENT STATUS                                             */
/* ========================================================= */

function PaymentStatus({ status }) {
  if (status === "Released") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-medium text-green-700">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Released
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700">
      <Clock3 className="h-3.5 w-3.5" />
      In Escrow
    </span>
  );
}

/* ========================================================= */
/* MONEY EXAMPLE                                              */
/* ========================================================= */

function MoneyExample({ label, value }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
      <p className="text-xs text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-pf-purple-dark">
        {value}
      </p>
    </div>
  );
}

/* ========================================================= */
/* FORMAT MONEY                                               */
/* ========================================================= */

function formatMoney(amount) {
  return `${amount.toLocaleString("fr-FR")} FCFA`;
}