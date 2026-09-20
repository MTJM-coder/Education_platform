import { ShieldCheck, MapPin, Star, Clock, Award, Check } from "lucide-react";
import Header from "../components/landing/Header";
import { Footer } from "../components/landing/SocialProofAndFooter";

const MOCK_TEACHER = {
  id: 1,
  initials: "EM",
  name: "Émile M.",
  section: "Anglaise & Française (bilingue)",
  location: "Mvan, Yaoundé",
  radiusKm: 8,
  rating: 4.8,
  reviewCount: 23,
  experienceYears: 4,
  rank: "Senior Teacher",
  expectedRate: "4 000 FCFA / h",
  bio:
    "Enseignant de mathématiques depuis 4 ans, diplômé de l'ENS Yaoundé. " +
    "J'aide surtout les élèves en difficulté à reprendre confiance avant les examens, " +
    "avec une pédagogie basée sur beaucoup d'exercices pratiques.",
  subjects: [
    { name: "Mathématiques", level: "Primaire à Secondaire" },
    { name: "Physique", level: "Secondaire" },
  ],
  availability: [
    { day: "Lundi", time: "16h – 18h" },
    { day: "Mercredi", time: "14h – 17h" },
    { day: "Samedi", time: "9h – 12h" },
  ],
  reviews: [
    {
      rating: 5,
      comment: "Très patient avec mon fils, les notes ont vite remonté.",
      author: "Parent d'élève, Bastos",
    },
    {
      rating: 4,
      comment: "Ponctuel et sérieux, explique bien les exercices.",
      author: "Parent d'élève, Mvan",
    },
  ],
};

export default function TeacherProfilePublicPage() {
  const teacher = MOCK_TEACHER;

  return (
    <div className="font-sans">
      <Header />

      <main className="max-w-7xl px-7 py-10 sm:px-8">
        {/* ---------- En-tete du profil ---------- */}
        <div className="flex flex-col gap-6 rounded-xl border border-gray-200 p-6 sm:flex-row sm:items-start sm:p-8">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-pf-purple font-serif text-2xl font-medium text-white">
            {teacher.initials}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-serif text-2xl font-medium text-pf-purple-dark">
                {teacher.name}
              </h1>
              <span className="flex items-center gap-1 rounded-full bg-pf-purple-light px-2.5 py-0.5 text-xs font-medium text-pf-green">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                Profil vérifié
              </span>
              <span className="flex items-center gap-1 rounded-full bg-pf-purple-light px-2.5 py-0.5 text-xs font-medium text-pf-purple">
                <Award className="h-3.5 w-3.5" aria-hidden="true" />
                {teacher.rank}
              </span>
            </div>

            <p className="mt-1.5 text-sm text-gray-600">{teacher.section}</p>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-gray-400" aria-hidden="true" />
                {teacher.location} · rayon {teacher.radiusKm} km
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-pf-gold text-pf-gold" aria-hidden="true" />
                {teacher.rating}{" "}
                <span className="text-gray-400">({teacher.reviewCount} avis)</span>
              </span>
              <span>{teacher.experienceYears} ans d'expérience</span>
            </div>
          </div>

          {/* CTA vers connexion/inscription — pas d'action directe avant d'etre authentifie */}
          <a
            href={`/login?redirect=/teachers/${teacher.id}/request`}
            className="w-full shrink-0 rounded-md bg-pf-purple px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-pf-purple-dark sm:w-auto"
          >
            Demander cet enseignant
          </a>
        </div>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row">
          {/* ---------- Contenu principal ---------- */}
          <div className="flex-1 space-y-8">
            <section>
              <h2 className="font-serif text-lg font-medium text-pf-purple-dark">
                À propos
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{teacher.bio}</p>
            </section>

            <section>
              <h2 className="font-serif text-lg font-medium text-pf-purple-dark">
                Matières enseignées
              </h2>
              <ul className="mt-3 flex flex-col gap-2">
                {teacher.subjects.map((s) => (
                  <li
                    key={s.name}
                    className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-pf-purple-dark">{s.name}</p>
                      <p className="text-xs text-gray-500">{s.level}</p>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-medium text-pf-green">
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      Validée
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-lg font-medium text-pf-purple-dark">
                Avis des familles
              </h2>
              <ul className="mt-3 flex flex-col gap-3">
                {teacher.reviews.map((review, i) => (
                  <li key={i} className="rounded-lg bg-pf-purple-light p-4">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <Star
                          key={starIndex}
                          className={`h-3.5 w-3.5 ${
                            starIndex < review.rating
                              ? "fill-pf-gold text-pf-gold"
                              : "text-gray-300"
                          }`}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-gray-700">“{review.comment}”</p>
                    <p className="mt-1.5 text-xs text-gray-500">{review.author}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* ---------- Colonne laterale ---------- */}
          <aside className="w-full space-y-5 lg:w-64 lg:flex-none">
            <div className="rounded-xl border border-gray-200 p-5">
              <p className="text-xs font-medium text-gray-500">Tarif indicatif</p>
              <p className="mt-1 font-serif text-xl font-medium text-pf-purple-dark">
                {teacher.expectedRate}
              </p>
              <p className="mt-1.5 text-xs text-gray-500">
                Le prix final est fixé lors de la validation de l'affectation par
                notre équipe.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 p-5">
              <p className="text-xs font-medium text-gray-500">Disponibilités déclarées</p>
              <ul className="mt-2 flex flex-col gap-1.5">
                {teacher.availability.map((slot) => (
                  <li
                    key={slot.day}
                    className="flex items-center justify-between text-sm text-gray-600"
                  >
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-gray-400" aria-hidden="true" />
                      {slot.day}
                    </span>
                    <span className="font-medium text-pf-purple-dark">{slot.time}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-gray-500">
                Peut évoluer — confirmé au moment de la planification des séances.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}