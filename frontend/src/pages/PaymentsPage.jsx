import { ArrowLeft, CreditCard, LockKeyhole } from "lucide-react";
import AppHeader from "../components/layout/AppHeader";
import { Pill, StatCard } from "../components/ui/StatusUi";

const payments = [
  { reference: "PAY-2024-091", child: "Yannick · Mathématiques", date: "16 septembre 2024", amount: "12 000 FCFA", status: "En séquestre", tone: "gold" },
  { reference: "PAY-2024-074", child: "Yannick · Mathématiques", date: "30 août 2024", amount: "12 000 FCFA", status: "Libéré", tone: "green" },
  { reference: "PAY-2024-060", child: "Aline · Physique-Chimie", date: "12 août 2024", amount: "8 000 FCFA", status: "Remboursé", tone: "purple" },
];

export default function PaymentsPage() {
  return <div className="min-h-screen bg-[#FAF9FB] font-sans"><AppHeader links={["Mes enfants", "Paiements", "Litiges"]} /><main className="px-4 py-8 sm:px-8">
    <a href="/parent-dashboard" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-pf-purple-dark"><ArrowLeft className="h-4 w-4" /> Retour au tableau de bord</a>
    <div className="mt-5 flex flex-wrap items-center justify-between gap-4"><div><h1 className="font-serif text-2xl font-medium text-pf-purple-dark">Paiements</h1><p className="mt-1 text-sm text-gray-600">Suivez vos paiements et leur statut de séquestre.</p></div><button className="inline-flex items-center gap-2 rounded-md bg-pf-purple px-4 py-2.5 text-sm font-medium text-white hover:bg-pf-purple-dark"><CreditCard className="h-4 w-4" /> Initier un paiement</button></div>
    <div className="mt-6 grid gap-4 sm:grid-cols-3"><StatCard label="En séquestre" value="12 000 FCFA" /><StatCard label="Paiements ce mois" value="2" /><StatCard label="Total réglé" value="32 000 FCFA" /></div>
    <section className="mt-7 rounded-xl border border-gray-200 bg-white"><div className="flex items-center gap-2 border-b border-gray-100 p-5"><LockKeyhole className="h-5 w-5 text-pf-green" /><div><h2 className="font-serif text-lg font-medium text-pf-purple-dark">Historique des paiements</h2><p className="text-xs text-gray-500">Les montants en séquestre sont libérés après confirmation de la séance.</p></div></div><div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left"><thead className="bg-gray-50 text-xs text-gray-500"><tr><th className="px-5 py-3 font-medium">Référence</th><th className="px-5 py-3 font-medium">Pour</th><th className="px-5 py-3 font-medium">Date</th><th className="px-5 py-3 font-medium">Montant</th><th className="px-5 py-3 font-medium">Statut</th></tr></thead><tbody>{payments.map((payment) => <tr key={payment.reference} className="border-t border-gray-100 text-sm"><td className="px-5 py-4 font-medium text-pf-purple-dark">{payment.reference}</td><td className="px-5 py-4 text-gray-600">{payment.child}</td><td className="px-5 py-4 text-gray-500">{payment.date}</td><td className="px-5 py-4 font-medium text-pf-purple-dark">{payment.amount}</td><td className="px-5 py-4"><Pill tone={payment.tone}>{payment.status}</Pill></td></tr>)}</tbody></table></div></section>
  </main></div>;
}
