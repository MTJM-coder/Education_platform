import { useState } from "react";
import AuthLayout from "../components/Layout/AuthLayout";
import FormField from "../components/ui/FormField";
import authPanels from "../content/authPanels";
import { apiFetch, setToken } from "../lib/apiClient";

const initialForm = { login: "", password: "" };

export default function LoginPage() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      // TODO: POST /api/auth/login
      const response = await apiFetch("/auth/login", {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          login: form.login,
          password: form.password
        })

      })
    
      setToken(response.token)
      const role = response?.user?.role
      if (role) {
        window.location.href = `/${role}-dashboard`
      } else {
        setError("Rôle utilisateur non reconnu.");
      }
    } catch {
      setError("Identifiants invalides. Vérifiez votre email/téléphone et votre mot de passe.");
    } finally {
      setForm(initialForm);
      setSubmitting(false);

    }
  }

  return (
    <AuthLayout {...authPanels.login}>
      <p className="mb-1.5 font-serif text-xl font-medium text-pf-purple-dark">
        Bon retour sur le sentier
      </p>
      <p className="mb-6 text-[13px] text-gray-600">
        Connectez-vous pour retrouver votre parcours.
      </p>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 rounded-md bg-red-50 px-3 py-2.5 text-xs text-red-600">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3.5">
          <FormField
            label="Email ou téléphone"
            placeholder="vous@email.com ou 6XX XXX XXX"
            value={form.login}
            onChange={(e) => updateField("login", e.target.value)}
            required
          />

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-xs text-gray-600">Mot de passe</label>
              <a href="/forgot-password" className="text-xs text-pf-blue underline">
                Mot de passe oublié ?
              </a>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-1.5 h-[42px] bg-pf-purple text-white disabled:opacity-60"
          >
            {submitting ? "Connexion…" : "Se connecter"}
          </button>
        </div>
      </form>

      <p className="mt-5.5 text-center text-[13px] text-gray-600">
        Pas encore de compte ?{" "}
        <a href="/register" className="text-pf-blue underline">
          S'inscrire
        </a>
      </p>
    </AuthLayout>
  );
}