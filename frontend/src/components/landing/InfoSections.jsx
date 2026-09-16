import { ShieldCheck, Check } from "lucide-react";

export function TrustBanner() {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-5 sm:px-8">
      <div className="flex items-start gap-3 rounded-xl bg-pf-purple-light p-4 sm:p-5">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-pf-green" aria-hidden="true" />
        <p className="text-sm leading-relaxed text-gray-600">
          <span className="font-medium text-pf-purple-dark">
            Chaque affectation est validée par notre équipe
          </span>{" "}
          avant le premier cours — le système recommande, vous choisissez,
          l'administration confirme. Aucun enseignant non vérifié ne peut
          être mis en relation avec un élève.
        </p>
      </div>
    </div>
  );
}

const steps = [
  {
    title: "Créez un profil",
    text: "Pour votre enfant ou pour vous-même — section, niveau, matière, quartier.",
  },
  {
    title: "Trouvez un enseignant",
    text: "Recommandé selon vos critères, puis validé par notre équipe.",
  },
  {
    title: "Planifiez les cours",
    text: "À domicile, selon les disponibilités déclarées par l'enseignant.",
  },
  {
    title: "Suivez les progrès",
    text: "Résultats, avis et paiement sécurisé — tout au même endroit.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-14 sm:px-8">
      <p className="text-xs font-medium text-pf-gold">Le parcours</p>
      <h2 className="mt-1.5 font-serif text-2xl font-medium text-pf-purple-dark">
        Comment ça marche
      </h2>

      <ol className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <li key={step.title} className="relative">
            {/* Trait de liaison entre les etapes — evoque le "chemin" du logo. */}
            {i < steps.length - 1 && (
              <span
                className="absolute left-10 top-4 hidden h-px w-[calc(100%-2.5rem)] bg-pf-lime/40 lg:block"
                aria-hidden="true"
              />
            )}
            <div className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-md bg-pf-purple-light text-sm font-medium text-pf-purple-dark">
              {i + 1}
            </div>
            <p className="text-sm font-medium text-pf-purple-dark">{step.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-gray-600">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function AudienceSection() {
  return (
    <section className="bg-gray-50 py-14">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <p className="text-xs font-medium text-pf-gold">
          Deux publics, une même confiance
        </p>
        <h2 className="mt-1.5 max-w-lg font-serif text-2xl font-medium text-pf-purple-dark">
          Conçu pour les familles et pour les enseignants
        </h2>

        <div className="mt-7 grid items-stretch gap-5 lg:grid-cols-2">
          <AudienceCard
            eyebrow="Pour les parents"
            accent="purple"
            title="Un accompagnement sans mauvaise surprise"
            text="Vous choisissez, l'administration valide, votre argent reste protégé jusqu'à la fin du cours."
            items={[
              "Enseignants vérifiés : identité, diplômes, expérience",
              "Paiement en séquestre, libéré après confirmation",
              "Enseignant absent ? Vous êtes remboursé",
            ]}
            cta={{ label: "Créer un compte parent", href: "/register/parent" }}
          />
          <AudienceCard
            eyebrow="Pour les enseignants"
            accent="green"
            title="Des élèves près de chez vous, un revenu suivi"
            text="Déclarez vos matières et votre zone — le reste suit automatiquement."
            items={[
              "Élèves recommandés selon matière, zone, emploi du temps",
              "Commission transparente, connue avant chaque cours",
              "Progression : Enseignant → Senior → Head Teacher",
            ]}
            cta={{ label: "Créer un compte enseignant", href: "/register/teacher" }}
          />
        </div>
      </div>
    </section>
  );
}

// Un seul point de verite pour les couleurs d'accent.
const ACCENTS = {
  purple: {
    eyebrow: "text-pf-purple",
    icon: "text-pf-purple",
    cta: "bg-pf-purple hover:bg-pf-purple-dark",
  },
  green: {
    eyebrow: "text-pf-green",
    icon: "text-pf-green",
    cta: "bg-pf-green hover:brightness-110",
  },
};

function AudienceCard({ eyebrow, accent, title, text, items, cta }) {
  const c = ACCENTS[accent] ?? ACCENTS.purple;

  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-6">
      <p className={`text-xs font-medium ${c.eyebrow}`}>{eyebrow}</p>
      <p className="mt-1.5 font-serif text-lg font-medium text-pf-purple-dark">
        {title}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">{text}</p>

      <ul className="mt-4 flex flex-col gap-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
            <Check className={`mt-0.5 h-4 w-4 shrink-0 ${c.icon}`} aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>

      {/* mt-auto pousse le bouton en bas : les deux cartes restent alignees
          meme si l'une a plus de texte. pt-6 assure un espace minimum. */}
      <div className="mt-auto pt-6">
        <a
          href={cta.href}
          className={`inline-block rounded-md px-4 py-2 text-sm font-medium text-white ${c.cta}`}
        >
          {cta.label}
        </a>
      </div>
    </div>
  );
}