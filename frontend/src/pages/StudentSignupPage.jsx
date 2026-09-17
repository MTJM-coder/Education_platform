import { useState, useMemo } from "react";
import AuthLayout from "../components/Layout/AuthLayout";
import FormField from "../components/ui/FormField";
import SelectField from "../components/ui/SelectField";
import authPanels from "../content/authPanels";

// TODO: remplacer par GET /levels (les classes viennent avec, imbriquees)
const LEVELS = [
  { id: "primary", name: "Primaire", classes: ["CE1", "CE2", "CM1", "CM2"] },
  {
    id: "secondary",
    name: "Secondaire",
    classes: ["6ème", "5ème", "4ème", "3ème", "2nde", "1ère", "Terminale"],
  },
];

const initialForm = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  section: "",
  levelId: "",
  classId: "",
  schoolName: "",
  location: "",
  password: "",
  passwordConfirmation: "",
  acceptedTerms: false,
};

export default function StudentSignupPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const availableClasses = useMemo(
    () => LEVELS.find((level) => level.id === form.levelId)?.classes ?? [],
    [form.levelId]
  );

  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      // Changer de niveau invalide la classe deja choisie
      ...(field === "levelId" ? { classId: "" } : {}),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});

    if (form.password !== form.passwordConfirmation) {
      setErrors({ passwordConfirmation: "Les mots de passe ne correspondent pas." });
      return;
    }
    if (!form.acceptedTerms) {
      setErrors({ acceptedTerms: "Vous devez accepter les conditions." });
      return;
    }

    setSubmitting(true);
    try {
      // TODO: POST /api/auth/register/teacher
      // await fetch("/api/auth/register/teacher", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     first_name: form.firstName,
      //     last_name: form.lastName,
      //     phone: form.phone,
      //     email: form.email,
      //     section: form.section,
      //     level_id: form.levelId,
      //     class_id: form.classId,
      //     school_name: form.schoolName,
      //     location: form.location,
      //     password: form.password,
      //     password_confirmation: form.passwordConfirmation,
      //   }),
      // });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    // maxWidth elargi : 340px etait pense pour un formulaire court (connexion),
    // pas pour 10 champs dont 2 selects dependants. Le vrai probleme n'etait pas
    // l'agencement des champs mais le conteneur trop etroit pour ce contenu.
    <AuthLayout {...authPanels.teacher} maxWidth="440px">
     <p className="mb-1.5 font-serif text-xl font-medium text-pf-purple-dark">
        Créer votre compte enseignant
      </p>
      <p className="mb-2 text-[13px] text-gray-600">
        Pour accéder aux cours, aux ressources et à votre suivi personnel.
      </p>
      <p className="mb-6 text-xs text-gray-400">
        Chemin choisi :{" "}
        <span className="font-medium text-pf-purple-dark">Enseignant</span> ·{" "}
        <a href="/register" className="underline">
          changer
        </a>
      </p> 

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-3.5">
          <div className="flex gap-2.5">
            <FormField
              label="Prénom"
              placeholder="Pauline"
              value={form.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              required
            />
            <FormField
              label="Nom"
              placeholder="Meka"
              value={form.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              required
            />
          </div>

          <div className="flex gap-2.5">
            <FormField
              label="Téléphone"
              placeholder="6XX XXX XXX"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              required
            />
            <FormField
              label="Email"
              type="email"
              placeholder="pauline.meka@email.com"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              required
            />
          </div>

          {/* Section thematique "Scolarite" — separateur leger plutot qu'un
              bloc supplementaire, pour aerer sans reprendre de la hauteur. */}
          <p className="mt-1 border-t border-gray-100 pt-3.5 text-[11px] font-medium uppercase tracking-wide text-gray-400">
            Scolarité
          </p>

          <div className="flex gap-2.5">
            <SelectField
              label="Section"
              value={form.section}
              onChange={(e) => updateField("section", e.target.value)}
              required
            >
              <option value="" disabled>
                Choisir…
              </option>
              <option value="english">Anglais</option>
              <option value="french">Français</option>
            </SelectField>

            <FormField
              label="École (facultatif)"
              placeholder="Collège Vogt"
              value={form.schoolName}
              onChange={(e) => updateField("schoolName", e.target.value)}
            />
          </div>

          <div className="flex gap-2.5">
            <SelectField
              label="Niveau"
              value={form.levelId}
              onChange={(e) => updateField("levelId", e.target.value)}
              required
            >
              <option value="" disabled>
                Choisir…
              </option>
              {LEVELS.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </SelectField>

            <SelectField
              label="Classe"
              value={form.classId}
              onChange={(e) => updateField("classId", e.target.value)}
              disabled={!form.levelId}
              required
            >
              <option value="" disabled>
                {form.levelId ? "Choisir…" : "Choisir un niveau d'abord"}
              </option>
              {availableClasses.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </SelectField>
          </div>

          <FormField
            label="Localisation (facultatif)"
            placeholder="Bastos, Yaoundé"
            value={form.location}
            onChange={(e) => updateField("location", e.target.value)}
          />

          <p className="mt-1 border-t border-gray-100 pt-3.5 text-[11px] font-medium uppercase tracking-wide text-gray-400">
            Sécurité
          </p>

          <div className="flex gap-2.5">
            <FormField
              label="Mot de passe"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              minLength={8}
              required
            />
            <div className="flex-1">
              <FormField
                label="Confirmer"
                type="password"
                placeholder="••••••••"
                value={form.passwordConfirmation}
                onChange={(e) => updateField("passwordConfirmation", e.target.value)}
                required
              />
              {errors.passwordConfirmation && (
                <p className="mt-1 text-[11px] text-red-600">
                  {errors.passwordConfirmation}
                </p>
              )}
            </div>
          </div>

          <label className="mt-1 flex items-start gap-2">
            <input
              type="checkbox"
              className="mt-0.5"
              checked={form.acceptedTerms}
              onChange={(e) => updateField("acceptedTerms", e.target.checked)}
            />
            <span className="text-xs leading-relaxed text-gray-600">
              J'accepte les conditions d'utilisation et la politique de confidentialité.
            </span>
          </label>
          {errors.acceptedTerms && (
            <p className="-mt-2 text-[11px] text-red-600">{errors.acceptedTerms}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-1.5 flex h-11 w-full items-center justify-center rounded-md bg-pf-purple text-sm font-medium text-white transition-colors hover:bg-pf-purple-dark disabled:opacity-60"
          >
            {submitting ? "Création en cours…" : "Créer mon compte"}
          </button>
        </div>
      </form>

      <p className="mt-4 text-center text-[13px] text-gray-600">
        Déjà un compte ?{" "}
        <a href="/login" className="font-medium text-pf-purple underline hover:text-pf-purple-dark">
          Se connecter
        </a>
      </p>
    </AuthLayout>
  );
}