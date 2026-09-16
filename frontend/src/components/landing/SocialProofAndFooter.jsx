const testimonials = [
  {
    quote:
      "On a trouvé un enseignant de maths disponible le mercredi, dans notre quartier, en deux jours.",
    name: "Odile K.",
    role: "Parent, Bastos, Yaoundé",
  },
  {
    quote:
      "Je ne reçois que des demandes que je peux vraiment honorer, selon ma zone et mes disponibilités.",
    name: "Serge A.",
    role: "Enseignant, Physique-Chimie, Douala",
  },
  {
    quote:
      "Les anciennes épreuves du concours de Polytechnique m'ont vraiment aidée à me situer avant l'examen.",
    name: "Pauline M.",
    role: "Élève, classe de terminale",
  },
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-14 sm:px-8">
      <p className="text-center text-xs font-medium text-pf-gold">Ce qu'on en dit</p>
      <h2 className="mt-1.5 text-center font-serif text-2xl font-medium text-pf-purple-dark">
        Des familles et des enseignants qui s'y retrouvent
      </h2>

      {/* 3 colonnes des sm (640px) etait trop serre : on passe par 2 colonnes. */}
      <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <blockquote
            key={t.name}
            className="rounded-xl border-t-2 border-pf-green bg-pf-purple-light p-5"
          >
            <p className="text-sm leading-relaxed text-gray-600">“{t.quote}”</p>
            <footer className="mt-3.5">
              <p className="text-sm font-medium text-pf-purple-dark">{t.name}</p>
              <p className="text-xs text-gray-500">{t.role}</p>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

export function TeacherCta() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-14 sm:px-8">
      <div className="rounded-xl bg-pf-purple-light p-10 text-center">
        {/* <h2> et non <p> : conserve la hierarchie des titres de la page. */}
        <h2 className="font-serif text-xl font-medium text-pf-purple-dark">
          Vous êtes enseignant ?
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Rejoignez la plateforme et développez votre activité de cours à
          domicile.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-5">
          <a
            href="/register/teacher"
            className="rounded-md bg-pf-green px-5 py-2.5 text-sm font-medium text-white hover:brightness-110"
          >
            Postuler comme enseignant
          </a>
          <a href="/search" className="text-sm text-pf-purple underline hover:text-pf-purple-dark">
            Trouver un enseignant plutôt →
          </a>
        </div>
      </div>
    </section>
  );
}

const footerLinks = [
  "Comment ça marche",
  "Enseignants",
  "Concours",
  "À propos",
  "Contact",
  "Confidentialité",
];

export function Footer() {
  return (
    <footer className="border-t border-gray-100">
      <div className="mx-auto max-w-6xl px-6 py-6 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <a href="/" className="flex items-center gap-2">
            <img
              src="/pathfinder-logo.png"
              alt="The Pathfinder Academic"
              className="h-7 w-7 object-contain"
            />
            <span className="flex flex-col leading-tight">
              <span className="font-serif text-[13px] font-medium text-pf-purple-dark">
                The Pathfinder Academic
              </span>
              <span className="text-[10px] text-gray-500">
                We pave the way to your academic success
              </span>
            </span>
          </a>
          <nav className="flex flex-wrap gap-5 text-sm text-gray-600">
            {footerLinks.map((label) => (
              <a key={label} href="#" className="hover:text-pf-purple-dark">
                {label}
              </a>
            ))}
          </nav>
        </div>
        <div className="mt-5 flex flex-col justify-between gap-1 text-xs text-gray-500 sm:flex-row">
          <span>© 2026 The Pathfinder Academic.</span>
          <span>Fait au Cameroun, pour les familles camerounaises.</span>
        </div>
      </div>
    </footer>
  );
}