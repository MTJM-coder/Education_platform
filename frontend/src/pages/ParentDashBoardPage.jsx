import { useState, useEffect } from "react";
import AppHeader from "../components/layout/AppHeader";
import { StatCard, Pill } from "../components/ui/StatusUi";
import ChildCard from "../components/parent/ChildCard";
import RequestProgress from "../components/parent/RequestProgress";

// TODO: remplacer par les vrais appels API :
// GET /parents/{id}/learners, GET /tutoring-requests, GET /assignments/{id}/sessions, GET /parents/{id}/payments
const mockChildren = [
  { id: 1, name: "Yannick", age: 10, details: "Primaire · Anglais · Mathématiques", status: "active" },
  { id: 2, name: "Aline", age: 14, details: "Secondaire · Français · Physique-Chimie", status: "searching" },
];

const mockUpcomingSessions = [
  { id: 1, child: "Yannick", subject: "Mathématiques", teacher: "Marguerite Fokou", when: "Mer. 16h" },
  { id: 2, child: "Yannick", subject: "Anglais", teacher: "Marguerite Fokou", when: "Ven. 15h" },
];

const mockPayments = [
  { id: 1, amount: "12 000 FCFA", label: "Yannick — Septembre", status: "held" },
];

// TODO: remplacer par GET /levels (les classes viennent avec, imbriquées)
const LEVELS = [
  { id: "primary", name: "Primaire", classes: ["CE1", "CE2", "CM1", "CM2"] },
  {
    id: "secondary",
    name: "Secondaire",
    classes: ["6ème", "5ème", "4ème", "3ème", "2nde", "1ère", "Terminale"],
  },
];

export default function ParentDashboardPage() {
  const [showSuccess, setShowSuccess] = useState(false)
  const [showForm, setShowForm] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("registered") === "true") {
      setShowSuccess(true)
      window.history.replaceState({}, "", "/parent-dashboard")
      setTimeout(() => {
        setShowSuccess(false)
      }, 6000);
    }
  }, [])
  return (
    <div className="min-h-screen bg-[#FAF9FB] font-sans">
      <AppHeader links={["Mes enfants", "Paiements", "Litiges"]} />
      {showSuccess && (
        <div className="mx-auto max-w-7xl px-6 pt-6 lg:ml-64">
          <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-4">
            <h2 className="font-medium text-green-800">
              Compte créé avec succès 🎉
            </h2>

            <p className="mt-1 text-sm text-green-700">
              Votre compte parent a bien été créé. 
            </p>
          </div>
        </div>
      )}
      <div className="px-2 py-6 pb-12 sm:px-8 lg:ml-64">
        <h1 className="font-serif text-xl font-medium text-pf-purple-dark sm:text-2xl">
          Bonjour, Odile
        </h1>
        <p className="mt-1 text-[13px] text-gray-600">
          Voici où en est le parcours de vos enfants.
        </p>

        <div className="mt-6 flex flex-wrap gap-3.5">
          <StatCard label="Enfants inscrits" value={mockChildren.length} />
          <StatCard
            label="Affectations actives"
            value={mockChildren.filter((c) => c.status === "active").length}
          />
          <StatCard label="Prochaine séance" value={mockUpcomingSessions[0]?.when ?? "—"} />
        </div>

        <div className="mt-7 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="mb-3 font-serif text-[15px] font-medium text-pf-purple-dark">
              Mes enfants
            </p>
            <div className="flex flex-col gap-2.5">
              {mockChildren.map((child) => (
                <ChildCard key={child.id} child={child} />
              ))}
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="h-11 border border-dashed border-gray-300 bg-transparent text-sm text-gray-600"
              >
                + Ajouter un enfant
              </button>
            </div>

            <p className="mb-3 mt-6 font-serif text-[15px] font-medium text-pf-purple-dark">
              Demande en cours — Aline
            </p>
            <div className="rounded-xl border border-gray-200 bg-white p-4.5">
              <div className="mb-3.5">
                <RequestProgress currentStep={1} />
              </div>
              <p className="mb-3 text-[13px] text-gray-600">
                Vous avez sélectionné{" "}
                <span className="font-medium text-pf-purple-dark">Serge Ateba</span> — en
                attente de validation par l'administration.
              </p>
              <button className="h-8 border border-gray-300 bg-transparent px-3 text-xs text-gray-700">
                Voir la demande
              </button>
            </div>
          </div>

          <div>
            <p className="mb-3 font-serif text-[15px] font-medium text-pf-purple-dark">
              Séances à venir
            </p>
            <div className="mb-5 rounded-xl border border-gray-200 bg-white p-3.5">
              {mockUpcomingSessions.map((session, i) => (
                <div
                  key={session.id}
                  className={`flex items-center justify-between ${i < mockUpcomingSessions.length - 1
                      ? "mb-2.5 border-b border-gray-100 pb-2.5"
                      : ""
                    }`}
                >
                  <div>
                    <p className="text-[13px] text-pf-purple-dark">
                      {session.child} · {session.subject}
                    </p>
                    <p className="mt-0.5 text-[11px] text-gray-400">avec {session.teacher}</p>
                  </div>
                  <p className="text-xs text-gray-600">{session.when}</p>
                </div>
              ))}
            </div>

            <p className="mb-3 font-serif text-[15px] font-medium text-pf-purple-dark">
              Paiements récents
            </p>
            <div className="rounded-xl border border-gray-200 bg-white p-3.5">
              {mockPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] text-pf-purple-dark">{payment.amount}</p>
                    <p className="mt-0.5 text-[11px] text-gray-400">{payment.label}</p>
                  </div>
                  <Pill tone="green">En séquestre</Pill>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl sm:p-6">
            <AddStudentForm onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

function AddStudentForm({ onClose }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    section: "",
    levelId: "",
    className: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const availableClasses =
    LEVELS.find((level) => level.id === form.levelId)?.classes ?? [];

  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      // Changer de niveau invalide la classe déjà choisie
      ...(field === "levelId" ? { className: "" } : {}),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      // TODO: POST /parents/{id}/learners
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="mb-4 font-serif text-lg font-medium text-pf-purple-dark">
        Ajouter un enfant
      </p>

      <div className="flex flex-col gap-3.5">
        <div className="flex flex-col gap-3.5 sm:flex-row">
          <div className="flex-1">
            <label className="mb-1.5 block text-xs text-gray-600">Prénom</label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-pf-purple focus:outline-none"
              required
            />
          </div>
          <div className="flex-1">
            <label className="mb-1.5 block text-xs text-gray-600">Nom</label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-pf-purple focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs text-gray-600">Section</label>
          <select
            value={form.section}
            onChange={(e) => updateField("section", e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-pf-purple focus:outline-none"
            required
          >
            <option value="" disabled>
              Choisir une section
            </option>
            <option value="english">Anglophone</option>
            <option value="french">Francophone</option>
          </select>
        </div>

        <div className="flex flex-col gap-3.5 sm:flex-row">
          <div className="flex-1">
            <label className="mb-1.5 block text-xs text-gray-600">Niveau</label>
            <select
              value={form.levelId}
              onChange={(e) => updateField("levelId", e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-pf-purple focus:outline-none"
              required
            >
              <option value="" disabled>
                Choisir un niveau
              </option>
              {LEVELS.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="mb-1.5 block text-xs text-gray-600">Classe</label>
            <select
              value={form.className}
              onChange={(e) => updateField("className", e.target.value)}
              disabled={!form.levelId}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-pf-purple focus:outline-none disabled:bg-gray-50 disabled:text-gray-400"
              required
            >
              <option value="" disabled>
                {form.levelId ? "Choisir une classe" : "Choisir un niveau d'abord"}
              </option>
              {availableClasses.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col-reverse gap-2.5 sm:flex-row">
        <button
          type="button"
          onClick={onClose}
          className="h-10 flex-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="h-10 flex-1 rounded-md bg-pf-purple text-sm font-medium text-white transition-colors hover:bg-pf-purple-dark disabled:opacity-60"
        >
          {submitting ? "Ajout en cours…" : "Ajouter"}
        </button>
      </div>
    </form>
  );
}
