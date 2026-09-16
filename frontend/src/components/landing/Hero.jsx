import { MapPin } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-pf-purple-dark px-6 pb-10 pt-16 sm:px-8 sm:pt-20">
      {/* Fond video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster=""
          className="h-full w-full object-cover motion-reduce:hidden"
        >
          <source src="/mainvideo2.mp4" type="video/mp4" />
        </video>
        {/* Overlay plat (pas de degrade) pour garder le texte lisible sur la video */}
        <div className="absolute inset-0 bg-pf-purple-dark/60" />
      </div>

      <DotPattern className="pointer-events-none absolute inset-0 z-10 opacity-[0.15]" />

      <div className="relative z-20 max-w-xl">
        <span className="mb-4 inline-block rounded-md bg-white/10 px-3 py-1 text-xs text-purple-100">
          Cameroun • Anglophone &amp; francophone
        </span>

        <h1 className="font-serif text-3xl font-medium leading-tight text-white sm:text-4xl">
          Trouvez le bon enseignant à domicile pour votre enfant
        </h1>

        <p className="mt-4 max-w-md text-base leading-relaxed text-purple-100">
          Mise en relation, suivi des résultats et préparation aux concours,
          sur une seule plateforme pensée pour la réussite scolaire.
        </p>

        <form className="mt-7 flex max-w-lg items-center gap-2 rounded-full bg-white py-1.5 pl-5 pr-1.5">
          <MapPin className="h-4 w-4 shrink-0 text-pf-purple" aria-hidden="true" />
          <input
            type="text"
            placeholder="Quartier, ex. Bastos, Yaoundé"
            className="w-full border-none text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0"
          />
          <button
            onClick={() => window.location.href = "/search"}
            type="button"
            className="shrink-0 rounded-full bg-pf-gold px-5 py-2.5 text-sm font-medium text-pf-purple-dark hover:brightness-95"
          >
            Chercher
          </button>
        </form>

        <div className="mt-3.5 flex gap-5 text-sm">
          <a href="/search" className="text-purple-100 underline hover:text-white">
            Filtres avancés (matière, niveau…) →
          </a>
          <a href="/register/teacher" className="text-purple-100 underline hover:text-white">
            Devenir enseignant →
          </a>
        </div>

        <dl className="mt-8 flex gap-8 border-t border-white/20 pt-5">
          <Stat value="1 200+" label="Enseignants validés" />
          <Stat value="4.7/5" label="Note moyenne" />
          <Stat value="Yaoundé, Douala…" label="Villes couvertes" />
        </dl>
      </div>
    </section>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd className="text-lg font-medium text-white">{value}</dd>
      <p className="text-xs text-purple-100">{label}</p>
    </div>
  );
}

function DotPattern({ className }) {
  return (
    <svg className={className} aria-hidden="true">
      <defs>
        <pattern id="pf-dots" width="26" height="26" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.6" fill="#ffffff" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#pf-dots)" />
    </svg>
  );
}