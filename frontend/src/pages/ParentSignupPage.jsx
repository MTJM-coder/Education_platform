import { useState } from "react";
import FormField from "../components/ui/FormField";
import AuthLayout from "../components/Layout/AuthLayout";
import authPanels from '../content/authPanels';

const initialForm = {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    password: "",
    passwordConfirmation: "",
    acceptedTerms: false,
};

export default function ParentSignupPage() {
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
            setErrors({ passwordConfirmation: "Les mots de passe ne correspondent pas." });
            return;
        }
        if (!form.acceptedTerms) {
            setErrors({ acceptedTerms: "Vous devez accepter les conditions." });
            return;
        }

        setSubmitting(true);
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
            //     address: form.address,
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
        <AuthLayout {...authPanels.parent} maxWidth="440px">
            <p className="mb-1.5 font-serif text-xl font-medium text-pf-purple-dark">
                Créer votre compte parent
            </p>
            <p className="mb-2 text-[13px] text-gray-600">
                Vous pourrez ajouter vos enfants juste après la création du compte.
            </p>
            <p className="mb-6 text-xs text-gray-400">
                Chemin choisi :{" "}
                <span className="font-medium text-pf-purple-dark">Parent</span> ·{" "}
                <a href="/register" className="underline">
                    changer
                </a>
            </p>
            <form
                onSubmit={handleSubmit}>
               
                <div className="flex flex-col gap-3.5">
                    <div className="flex gap-2.5">
                        <FormField
                            label="Prénom"
                            placeholder="Odile"
                            value={form.firstName}
                            onChange={(e) => updateField("firstName", e.target.value)}
                            required
                        />
                        <FormField
                            label="Nom"
                            placeholder="Kamga"
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
                        placeholder="odile.kamga@email.com"
                        value={form.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        required
                    />

                    <FormField
                        label="Adresse"
                        placeholder="Bastos, Yaoundé"
                        value={form.address}
                        onChange={(e) => updateField("address", e.target.value)}
                    />

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
    </AuthLayout>
  );
}