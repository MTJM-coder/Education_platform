import { ArrowRight } from "lucide-react";

const flowSteps = [
  "Le parent paie",
  "Fonds en séquestre",
  "Cours effectué",
  "Confirmation",
  "Commission déduite",
  "Enseignant payé",
];

const flowDetails = [
  {
    title: "Enseignant absent",
    text: "Si l'enseignant ne se présente pas le jour convenu, le parent est remboursé.",
  },
  {
    title: "Commission connue à l'avance",
    text: "Le taux est visible avant tout engagement — aucun frais qui apparaît après coup.",
  },
  {
    title: "Litige = fonds bloqués",
    text: "Un cours contesté est examiné par l'administration avant toute libération de paiement.",
  },
];

export function PaymentFlow() {
  return (
    <section className="bg-pf-purple-dark py-14">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <p className="text-xs font-medium text-pf-gold">Paiement sécurisé</p>
        <h2 className="mt-1.5 max-w-lg font-serif text-2xl font-medium text-white">
          L'enseignant n'est payé qu'une fois le cours confirmé
        </h2>
        <p className="mt-2.5 max-w-lg text-sm text-purple-100">
          Un séquestre Mobile Money simple : personne n'est payé pour un cours
          qui n'a pas eu lieu.
        </p>

        {/* <ol> plutot que <div> : c'est une sequence ordonnee, pas une liste plate. */}
        <ol className="mt-7 flex flex-wrap items-center gap-2.5">
          {flowSteps.map((step, i) => (
            <li key={step} className="flex items-center gap-2.5">
              <span className="rounded-md bg-white/10 px-4 py-2.5 text-sm font-medium text-white">
                {step}
              </span>
              {i < flowSteps.length - 1 && (
                <ArrowRight className="h-4 w-4 shrink-0 text-pf-gold" aria-hidden="true" />
              )}
            </li>
          ))}
        </ol>

        <div className="mt-7 grid gap-5 border-t border-white/15 pt-5 sm:grid-cols-3">
          {flowDetails.map((detail) => (
            <div key={detail.title}>
              <p className="text-sm font-medium text-white">{detail.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-purple-100">{detail.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const exams = [
  { city: "Douala", name: "Polytechnique de Douala" },
  { city: "Yaoundé", name: "Polytechnique de Yaoundé" },
  { city: "Maroua", name: "Polytechnique de Maroua" },
  { city: "Yaoundé", name: "FMSB" },
  { city: "Buea", name: "FET Buea" },
  { city: "Buea", name: "IUT / COT Buea" },
];

export function LearningPlatform() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-14 sm:px-8">
      <p className="text-xs font-medium text-pf-gold">Au-delà du cours à domicile</p>
      <h2 className="mt-1.5 max-w-lg font-serif text-2xl font-medium text-pf-purple-dark">
        Learning platform et préparation aux concours
      </h2>
      <p className="mt-2.5 max-w-lg text-sm leading-relaxed text-gray-600">
        Notes de cours, anciennes épreuves et corrigés validés par l'équipe
        pédagogique — et une préparation ciblée aux concours d'entrée.
      </p>

      <ul className="mt-7 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {exams.map((exam) => (
          <li
            key={exam.name}
            className="rounded-xl border border-gray-200 p-4 transition-colors hover:border-pf-lime"
          >
            <p className="text-xs text-pf-green">{exam.city}</p>
            <p className="mt-1 font-serif text-sm font-medium text-pf-purple-dark">
              {exam.name}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}