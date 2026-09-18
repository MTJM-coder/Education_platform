import { useState } from "react";
import { ArrowLeft, MapPin, Star, Clock, ShieldCheck, Check } from "lucide-react";
import AppHeader from "../components/layout/AppHeader";
import RequestProgress from "../components/parent/RequestProgress";
import { Pill } from "../components/ui/StatusUi";

// TODO: remplacer par GET /tutoring-requests/{id}
const mockRequest = {
  id: "req-42",
  childName: "Aline",
  subject: "Physique-Chimie",
  level: "Secondaire",
  section: "Française",
  location: "Bastos, Yaoundé",
  availability: "Mercredi et Vendredi après 15h",
};

// TODO: remplacer par GET /tutoring-requests/{id}/matches
// Deja trie par l'algorithme de matching (section > niveau > classe > matiere >
// localisation > disponibilite > qualifications) — l'ordre du tableau EST le rang.
const mockRecommendations = [
  {
    id: 2,
    initials: "SA",
    name: "Serge Ateba",
    subjects: "Physique-Chimie",
    level: "Secondaire · Section française",
    location: "Bastos, Yaoundé",
    rating: 4.9,
    reviewCount: 41,
    price: "4 500 FCFA / h",
    availability: "Disponible Mer. et Ven.",
  },
  {
    id: 4,
    initials: "MK",
    name: "Marlène Kamdem",
    subjects: "Physique-Chimie · SVT",
    level: "Secondaire · Section française",
    location: "Nlongkak, Yaoundé",
    rating: 4.6,
    reviewCount: 12,
    price: "4 000 FCFA / h",
    availability: "Disponible Mer. après 14h",
  },
  {
    id: 5,
    initials: "PT",
    name: "Paul Tchoua",
    subjects: "Physique-Chimie",
    level: "Secondaire",
    location: "Mvan, Yaoundé",
    rating: 4.4,
    reviewCount: 8,
    price: "3 800 FCFA / h",
    availability: "Disponible tous les jours",
  },
];

// Selectionne par defaut, pour rester coherent avec le tableau de bord
// (Aline a deja choisi Serge Ateba, en attente de validation Admin).
const INITIALLY_SELECTED_ID = 2;

export default function SuiviDemandePage() {
  const [selectedId, setSelectedId] = useState(INITIALLY_SELECTED_ID);

  const selectedTeacher = mockRecommendations.find((t) => t.id === selectedId);

  function handleSelect(teacherId) {
    // TODO: POST /tutoring-requests/{id}/select { teacher_id }
    setSelectedId(teacherId);
  }

  return (
    <div className="mi *:n-h-screen bg-[#FAF9FB] font-sans">
      <AppHeader links={["Mes enfants", "Paiements", "Litiges"]} />

      <main className="px-2 py-8 sm:px-8">
        <a
          href="/parent/dashboard"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-pf-purple-dark"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Retour au tableau de bord
        </a>

        {/* ---------- Resume de la demande ---------- */}
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-pf-gold">Suivi de la demande</p>
              <h1 className="mt-1 font-serif text-xl font-medium text-pf-purple-dark">
                {mockRequest.childName} — {mockRequest.subject}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                {mockRequest.level} · Section {mockRequest.section} · {mockRequest.location}
              </p>
              <p className="mt-0.5 text-sm text-gray-500">
                Disponibilité souhaitée : {mockRequest.availability}
              </p>
            </div>
            <Pill tone={selectedTeacher ? "gold" : "gray"}>
              {selectedTeacher ? "En attente de validation" : "Recherche en cours"}
            </Pill>
          </div>

          <div className="mt-5">
            <RequestProgress currentStep={selectedTeacher ? 1 : 0} />
          </div>
        </div>

        {/* ---------- Enseignant selectionne ---------- */}
        {selectedTeacher && (
          <div className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-pf-gold bg-pf-purple-light p-4">
            <p className="text-sm text-gray-700">
              Vous avez sélectionné{" "}
              <span className="font-medium text-pf-purple-dark">{selectedTeacher.name}</span> —
              l'administration doit encore valider cette affectation avant le premier cours.
            </p>
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="shrink-0 whitespace-nowrap text-xs font-medium text-pf-purple underline hover:text-pf-purple-dark"
            >
              Choisir un autre enseignant
            </button>
          </div>
        )}

        {/* ---------- Liste des enseignants recommandes ---------- */}
        <div className="mt-7">
          <p className="mb-3 font-serif text-lg font-medium text-pf-purple-dark">
            Enseignants recommandés
          </p>
          <ul className="flex flex-col gap-4">
            {mockRecommendations.map((teacher, i) => (
              <RecommendedTeacherCard
                key={teacher.id}
                teacher={teacher}
                rank={i + 1}
                isSelected={teacher.id === selectedId}
                onSelect={() => handleSelect(teacher.id)}
              />
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

function RecommendedTeacherCard({ teacher, rank, isSelected, onSelect }) {
  return (
    <li
      className={`flex flex-col gap-4 rounded-xl border p-5 sm:flex-row sm:items-start ${
        isSelected ? "border-pf-gold bg-pf-purple-light" : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-pf-purple font-serif text-lg font-medium text-white">
        {teacher.initials}
      </div>

      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-pf-purple px-2 py-0.5 text-xs font-medium text-white">
            #{rank} recommandé
          </span>
          <p className="font-serif text-lg font-medium text-pf-purple-dark">{teacher.name}</p>
          <span className="flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-xs font-medium text-pf-green">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Vérifié
          </span>
        </div>

        <p className="mt-1 text-sm text-gray-700">{teacher.subjects}</p>
        <p className="text-sm text-gray-500">{teacher.level}</p>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-gray-400" aria-hidden="true" />
            {teacher.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-gray-400" aria-hidden="true" />
            {teacher.availability}
          </span>
          <span className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-pf-gold text-pf-gold" aria-hidden="true" />
            {teacher.rating} <span className="text-gray-400">({teacher.reviewCount} avis)</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 sm:min-w-[160px]">
        <p className="font-serif text-lg font-medium text-pf-purple-dark">{teacher.price}</p>
        <a
          href={`/teachers/${teacher.id}`}
          className="text-xs font-medium text-pf-purple underline hover:text-pf-purple-dark"
        >
          Voir le profil
        </a>
        <button
          type="button"
          onClick={onSelect}
          disabled={isSelected}
          className={`mt-1 flex w-full items-center justify-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors sm:w-auto ${
            isSelected
              ? "bg-pf-green text-white"
              : "bg-pf-purple text-white hover:bg-pf-purple-dark"
          }`}
        >
          {isSelected && <Check className="h-4 w-4" aria-hidden="true" />}
          {isSelected ? "Sélectionné" : "Sélectionner cet enseignant"}
        </button>
      </div>
    </li>
  );
}