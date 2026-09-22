import { useState } from "react";
import FormField from "../components/ui/FormField";
import SelectField from "../components/ui/SelectField";
import FileField from "../components/ui/FileField";
import AuthLayout from "../components/Layout/AuthLayout";
import authPanels from "../content/authPanels";
import { apiFetch } from "../lib/apiClient";

const initialForm = {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    section: "",
    location: "",
    password: "",
    passwordConfirmation: "",
    idCard: null,
    acceptedTerms: false,
};

export default function TeacherSignupPage() {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    function updateField(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setErrors({});

        if (form.password !== form.passwordConfirmation) {
            setErrors({
                passwordConfirmation:
                    "Les mots de passe ne correspondent pas.",
            });
            return;
        }

        if (!form.idCard) {
            setErrors({
                idCard: "La pièce d'identité est obligatoire.",
            });
            return;
        }

        if (!form.acceptedTerms) {
            setErrors({
                acceptedTerms:
                    "Vous devez accepter les conditions.",
            });
            return;
        }

        setSubmitting(true);

        try {
            const formData = new FormData();

            formData.append("first_name", form.firstName);
            formData.append("last_name", form.lastName);
            formData.append("phone", form.phone);
            formData.append("email", form.email);
            formData.append("section", form.section);
            formData.append("location", form.location);
            formData.append("password", form.password);
            formData.append(
                "password_confirmation",
                form.passwordConfirmation
            );

            // IMPORTANT : le fichier est ajouté directement
            formData.append("id_card", form.idCard);
            console.log(form)
            console.log(formData)
            await apiFetch("/auth/register/teacher", {
                method: "POST",
                body: formData,
            });

            // Succès
            setForm(initialForm);
            // rediriger vers la page de connexion
            window.location.href = "/teacher-profile?registered=true";
        } catch (error) {
            console.error("Erreur inscription enseignant :", error);

            // Erreurs Laravel 422
            if (error.status === 422) {
                const validationErrors = error.body?.errors || {};

                const formattedErrors = {};

                Object.entries(validationErrors).forEach(
                    ([field, messages]) => {
                        formattedErrors[field] = Array.isArray(messages)
                            ? messages[0]
                            : messages;
                    }
                );

                setErrors(formattedErrors);

                // Si Laravel renvoie seulement "message"
                if (
                    Object.keys(formattedErrors).length === 0 &&
                    error.body?.message
                ) {
                    setErrors({
                        general: error.body.message,
                    });
                }

                return;
            }

            // Autres erreurs
            setErrors({
                general:
                    error.message ||
                    "Une erreur est survenue. Veuillez réessayer.",
            });
        } finally {
            setSubmitting(false);
        }
    }
    return (
        <AuthLayout {...authPanels.teacher} maxWidth="440px">
            <p className="mb-1.5 font-serif text-xl font-medium text-pf-purple-dark">
                Créer votre compte enseignant
            </p>
            {/* <p className="mb-2 text-[13px] text-gray-600">
                Pour accéder aux cours, aux ressources et à votre suivi personnel.
            </p> */}
            <p className="mb-6 text-xs text-gray-400">
                Chemin choisi :{" "}
                <span className="font-medium text-pf-purple-dark">Enseignant</span> ·{" "}
                <a href="/register" className="underline">
                    changer
                </a>
            </p>

            <form onSubmit={handleSubmit} >
                {errors.general && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {errors.general}
                    </div>
                )}

                <p className="mb-5 text-xs text-gray-600">
                    Seule votre pièce d'identité est nécessaire pour commencer — vous
                    ajouterez CV, diplômes et matières depuis votre profil ensuite.
                </p>

                <div className="flex flex-col gap-3.5">
                    <div className="flex gap-2.5">
                        <FormField
                            label="Prénom"
                            placeholder="Marguerite"
                            value={form.firstName}
                            onChange={(e) => updateField("firstName", e.target.value)}
                            required
                        />

                        <FormField
                            label="Nom"
                            placeholder="Fokou"
                            value={form.lastName}
                            onChange={(e) => updateField("lastName", e.target.value)}
                            required
                        />
                    </div>

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
                        placeholder="marguerite.fokou@email.com"
                        value={form.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        required
                    />

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
                            <option value="bilingual">Bilingue</option>
                        </SelectField>
                        <FormField
                            label="Localisation"
                            placeholder="Bastos, Yaoundé"
                            value={form.location}
                            onChange={(e) => updateField("location", e.target.value)}
                            required
                        />
                        {errors.email && (
                            <p className="mt-1 text-[11px] text-red-600">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <FileField
                            label="Pièce d'identité"
                            hint="PDF, JPG ou PNG, 4 Mo max."
                            file={form.idCard}
                            onChange={(file) => updateField("idCard", file)}
                            required
                        />
                        {errors.idCard && (
                            <p className="mt-1 text-[11px] text-red-600">{errors.idCard}</p>
                        )}
                    </div>

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
                        className="mt-1.5 h-[42px] bg-pf-purple text-white disabled:opacity-60"
                    >
                        {submitting ? "Création en cours…" : "Créer mon compte"}
                    </button>
                </div>
            </form>

            <p className="mt-4.5 text-center text-[13px] text-gray-600">
                Déjà un compte ?{" "}
                <a href="/login" className="text-pf-blue underline">
                    Se connecter
                </a>
            </p>
        </AuthLayout >
    );
}