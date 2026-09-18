import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, MapPin, Video } from "lucide-react";
import AppHeader from "../components/layout/AppHeader";
import { Pill, StatCard } from "../components/ui/StatusUi";

const sessions = [
  { day: "Mercredi 18 septembre", time: "16h00 – 17h30", status: "À venir", mode: "À domicile" },
  { day: "Vendredi 20 septembre", time: "15h00 – 16h30", status: "À venir", mode: "En ligne" },
  { day: "Mercredi 11 septembre", time: "16h00 – 17h30", status: "Terminée", mode: "À domicile" },
];

export default function AssignmentDetailPage() {
  return (
    <div className="min-h-screen bg-[#FAF9FB] font-sans">
      <AppHeader links={["Mes enfants", "Paiements", "Litiges"]} />
      <main className="px-4 py-8 sm:px-8">
        <a href="/parent-dashboard" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-pf-purple-dark">
          <ArrowLeft className="h-4 w-4" /> Retour au tableau de bord
        </a>
        <div className="mt-5 flex flex-wrap items-start justify-between gap-4 rounded-xl border border-gray-200 bg-white p-6">
          <div>
            <p className="text-xs font-medium text-pf-green">Affectation active</p>
            <h1 className="mt-1 font-serif text-2xl font-medium text-pf-purple-dark">Yannick · Mathématiques</h1>
            <p className="mt-1 text-sm text-gray-600">Avec Marguerite Fokou · CM2 · À Yaoundé</p>
          </div>
          <Pill tone="green" icon={CheckCircle2}>En cours</Pill>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <StatCard label="Prix par séance" value="6 000 FCFA" />
          <StatCard label="Séances réalisées" value="1 / 8" />
          <StatCard label="Prochaine séance" value="Mer. 16h00" />
        </div>

        <div className="mt-7 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between"><h2 className="font-serif text-lg font-medium text-pf-purple-dark">Planning des séances</h2><button className="text-xs font-medium text-pf-purple underline">Voir le calendrier</button></div>
            <ul className="mt-4 divide-y divide-gray-100">
              {sessions.map((session) => (
                <li key={session.day} className="flex items-center justify-between gap-3 py-4">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-5 w-5 text-pf-purple" />
                    <div><p className="text-sm font-medium text-pf-purple-dark">{session.day}</p><p className="mt-0.5 text-xs text-gray-500">{session.time} · {session.mode}</p></div>
                  </div>
                  <Pill tone={session.status === "Terminée" ? "green" : "purple"}>{session.status}</Pill>
                </li>
              ))}
            </ul>
          </section>
          <aside className="space-y-5">
            <section className="rounded-xl border border-gray-200 bg-white p-5"><h2 className="font-serif text-lg font-medium text-pf-purple-dark">Enseignante</h2><p className="mt-3 text-sm font-medium text-pf-purple-dark">Marguerite Fokou</p><p className="mt-1 text-xs text-gray-500">Mathématiques · Enseignante vérifiée</p><button className="mt-4 w-full rounded-md border border-pf-purple px-3 py-2 text-sm font-medium text-pf-purple">Contacter l’enseignante</button></section>
            <section className="rounded-xl border border-gray-200 bg-white p-5"><h2 className="font-serif text-lg font-medium text-pf-purple-dark">Informations</h2><p className="mt-3 flex items-center gap-2 text-sm text-gray-600"><Clock3 className="h-4 w-4" /> 2 séances par semaine</p><p className="mt-2 flex items-center gap-2 text-sm text-gray-600"><MapPin className="h-4 w-4" /> Bastos, Yaoundé</p><p className="mt-2 flex items-center gap-2 text-sm text-gray-600"><Video className="h-4 w-4" /> Présentiel et en ligne</p></section>
          </aside>
        </div>
      </main>
    </div>
  );
}
