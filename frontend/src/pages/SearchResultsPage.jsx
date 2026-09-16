import { useState } from "react";
import { SlidersHorizontal, MapPin, ShieldCheck, Star, Clock, X } from "lucide-react";
import Header from "../components/landing/Header";
import { Footer } from "../components/landing/SocialProofAndFooter";

// Donnees factices — a remplacer par la reponse de GET /tutoring-requests/{id}/matches
// (section 7 du cahier des charges : Section > Niveau > Classe > Matiere > Localisation > ...)
const MOCK_RESULTS = [
  {
    id: 1,
    initials: "EM",
    name: "Émile M.",
    subjects: "Mathématiques",
    level: "Classe 5ᵉ · Section anglaise",
    location: "Mvan, Yaoundé",
    rating: 4.8,
    reviewCount: 23,
    price: "4 000 FCFA / h",
    availability: "Disponible Lun 16h–18h",
    experience: "4 ans d'expérience",
    verified: true,
  },
  {
    id: 2,
    initials: "JN",
    name: "Jeanne N.",
    subjects: "Physique · Chimie",
    level: "Terminale · Section française",
    location: "Bastos, Yaoundé",
    rating: 4.6,
    reviewCount: 15,
    price: "5 500 FCFA / h",
    availability: "Disponible Lun · Mer",
    experience: "7 ans d'expérience",
    verified: true,
  },
  {
    id: 3,
    initials: "SA",
    name: "Serge A.",
    subjects: "Mathématiques · Physique",
    level: "Primaire à Secondaire",
    location: "Akwa, Douala",
    rating: 4.9,
    reviewCount: 41,
    price: "4 500 FCFA / h",
    availability: "Disponible tous les jours",
    experience: "9 ans d'expérience",
    verified: true,
  },
];

const SECTIONS = ["Toutes", "Anglaise", "Française"];
const LEVELS = ["Tous niveaux", "Primaire", "Secondaire"];
const SUBJECTS = ["Toutes matières", "Mathématiques", "Physique-Chimie", "Anglais", "Français"];

export default function SearchResultsPage() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const results = MOCK_RESULTS; // remplacer par l'etat reel (fetch + query params)

  return (
    <div className="font-sans">
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-8 sm:px-8">
        {/* Resume de la recherche */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-pf-gold">Résultats de recherche</p>
            <h1 className="mt-1 font-serif text-2xl font-medium text-pf-purple-dark">
              Mathématiques · Primaire · Anglais · Bastos
            </h1>
          </div>
         
        </div>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row">
          {/* ---------- Filtres ---------- */}
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="flex items-center gap-2 self-start rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-pf-purple-dark lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Filtres
          </button>

          <aside
            className={`
              ${filtersOpen ? "fixed inset-0 z-40 flex bg-black/40 lg:static lg:bg-transparent" : "hidden"}
              lg:block lg:w-64 lg:flex-none
            `}
          >
            <div className="ml-auto flex h-full w-full max-w-xs flex-col gap-5 bg-white p-6 lg:h-auto lg:max-w-none lg:rounded-xl lg:border lg:border-gray-200 lg:p-5">
              <div className="flex items-center justify-between lg:hidden">
                <p className="font-serif text-lg font-medium text-pf-purple-dark">Filtres</p>
                <button type="button" onClick={() => setFiltersOpen(false)} aria-label="Fermer les filtres">
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <FilterField label="Section">
                {SECTIONS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </FilterField>
              <FilterField label="Niveau">
                {LEVELS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </FilterField>
              <FilterField label="Matière">
                {SUBJECTS.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </FilterField>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-500">
                  Quartier
                </label>
                <input
                  type="text"
                  defaultValue="Bastos"
                  placeholder="Ex. Bastos"
                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-pf-purple focus:outline-none focus:ring-1 focus:ring-pf-purple"
                />
              </div>

              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="mt-1 rounded-md bg-pf-purple px-4 py-2.5 text-sm font-medium text-white hover:bg-pf-purple-dark"
              >
                Voir les résultats
              </button>
            </div>
          </aside>

          {/* ---------- Liste des resultats ---------- */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-pf-purple-dark">{results.length}</span>{" "}
                enseignant{results.length > 1 ? "s" : ""} trouvé{results.length > 1 ? "s" : ""}
              </p>
              <select className="rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-600 focus:border-pf-purple focus:outline-none">
                <option>Pertinence</option>
                <option>Note la plus haute</option>
                <option>Tarif croissant</option>
                <option>Plus proche</option>
              </select>
            </div>

            {results.length === 0 ? (
              <EmptyState />
            ) : (
              <ul className="mt-4 flex flex-col gap-4">
                {results.map((teacher) => (
                  <TeacherResultCard key={teacher.id} teacher={teacher} />
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function FilterField({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-500">{label}</label>
      <select className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-pf-purple focus:outline-none focus:ring-1 focus:ring-pf-purple">
        {children}
      </select>
    </div>
  );
}

function TeacherResultCard({ teacher }) {
  return (
    <li className="flex flex-col gap-4 rounded-xl border border-gray-200 p-5 sm:flex-row sm:items-start">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-pf-purple font-serif text-lg font-medium text-white">
        {teacher.initials}
      </div>

      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-serif text-lg font-medium text-pf-purple-dark">{teacher.name}</p>
          {teacher.verified && (
            <span className="flex items-center gap-1 rounded-full bg-pf-purple-light px-2 py-0.5 text-xs font-medium text-pf-green">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Profil vérifié
            </span>
          )}
        </div>

        <p className="mt-1 text-sm text-gray-700">{teacher.subjects}</p>
        <p className="text-sm text-gray-500">{teacher.level}</p>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-gray-400" aria-hidden="true" />
            {teacher.location}
          </span>
          {/* <span className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-gray-400" aria-hidden="true" />
            {teacher.availability}
          </span> */}
          <span className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-pf-gold text-pf-gold" aria-hidden="true" />
            {teacher.rating}{" "}
            <span className="text-gray-400">({teacher.reviewCount} avis)</span>
          </span>
        </div>

        <p className="mt-2 text-xs text-gray-500">{teacher.experience}</p>
      </div>

      <div className="flex flex-col items-end justify-between gap-3 sm:min-w-[140px]">
        <p className="font-serif text-lg font-medium text-pf-purple-dark">{teacher.price}</p>
        <a
          href={`/teachers/${teacher.id}`}
          className="w-full rounded-md bg-pf-purple px-4 py-2 text-center text-sm font-medium text-white hover:bg-pf-purple-dark sm:w-auto"
        >
          Voir le profil
        </a>
      </div>
    </li>
  );
}

function EmptyState() {
  return (
    <div className="mt-6 rounded-xl border border-dashed border-gray-300 p-10 text-center">
      <p className="font-serif text-lg font-medium text-pf-purple-dark">
        Aucun enseignant ne correspond à ces critères
      </p>
      <p className="mt-2 text-sm text-gray-600">
        Essayez d'élargir la zone ou la disponibilité recherchée.
      </p>
      <a
        href="/search"
        className="mt-4 inline-block rounded-md bg-pf-purple px-4 py-2 text-sm font-medium text-white hover:bg-pf-purple-dark"
      >
        Modifier la recherche
      </a>
    </div>
  );
}