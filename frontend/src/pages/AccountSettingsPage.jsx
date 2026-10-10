import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  LockKeyhole,
  Eye,
  EyeOff,
  Save,
  Pencil,
  LogOut,
  Globe,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import ParentSidebar from "../components/parent/ParentSidebar";
import { apiFetch } from "../lib/apiClient";

const LANGUAGE_KEY = "parent-language";

const emptyProfile = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
};

const inputClass ="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#6D4AFF] focus:ring-4 focus:ring-purple-100 disabled:bg-gray-50";

function readLanguage() {
  try {
    return localStorage.getItem(LANGUAGE_KEY) || "fr";
  } catch {
    return "fr";
  }
}

function SectionHeader({ icon: Icon, title, description, color = "purple" }) {
  const colors = {
    purple: "bg-purple-100 text-[#6D4AFF]",
    blue: "bg-blue-100 text-blue-600",
    orange: "bg-orange-100 text-orange-600",
  };

  return (
    <div className="flex items-start gap-3">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
          colors[color] || colors.purple
        }`}
      >
        <Icon size={21} />
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <p className="mt-1 text-sm leading-5 text-gray-500">{description}</p>
      </div>
    </div>
  );
}

export default function ParentAccountPage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(emptyProfile);
  const [profileDraft, setProfileDraft] = useState(emptyProfile);
  const [profileCurrentPassword, setProfileCurrentPassword] = useState("");
  const [editingProfile, setEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  const [language, setLanguage] = useState(readLanguage);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  const [signingOut, setSigningOut] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const feedbackTimer = useRef(null);

  const showFeedback = (type, message) => {
    window.clearTimeout(feedbackTimer.current);
    setFeedback({ type, message });

    // Les erreurs restent affichées jusqu'à ce qu'on les ferme.
    if (type !== "error") {
      feedbackTimer.current = window.setTimeout(() => setFeedback(null), 4500);
    }
  };

  useEffect(() => () => window.clearTimeout(feedbackTimer.current), []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await apiFetch("/auth/me");
        console.log(response.data)

        // Forme : { data: <profil parent>, user: { first_name, ... } } (brute ou enveloppée).
        const user = response?.user ?? response?.data?.user;
        const parentProfile = response?.data?.data ?? response?.data;

        if (!user) throw new Error("Unable to load your account.");
        if (cancelled) return;

        const loaded = {
          firstName: user.first_name ?? "",
          lastName: user.last_name ?? "",
          email: user.email ?? "",
          phone: user.phone ?? "",
          address: parentProfile?.address ?? "",
        };

        setProfile(loaded);
        setProfileDraft(loaded);
      } catch (err) {
        if (!cancelled) {
          showFeedback("error", err?.message || "Unable to load your account.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateProfileDraft = (field, value) => {
    setProfileDraft((current) => ({ ...current, [field]: value }));
  };

  // L'e-mail et le téléphone servent aussi à se connecter : les changer demande le mot de passe.
  const credentialsChanged =
    editingProfile &&
    (profileDraft.email.trim() !== profile.email ||
      profileDraft.phone.trim() !== profile.phone);

  const startEditing = () => {
    setProfileDraft({ ...profile });
    setProfileCurrentPassword("");
    setEditingProfile(true);
  };

  const cancelProfileEdit = () => {
    setProfileDraft({ ...profile });
    setProfileCurrentPassword("");
    setEditingProfile(false);
  };

  const saveProfile = async (event) => {
    event.preventDefault();

    if (
      !profileDraft.firstName.trim() ||
      !profileDraft.lastName.trim() ||
      !profileDraft.email.trim() ||
      !profileDraft.phone.trim()
    ) {
      showFeedback(
        "error",
        "Le prénom, le nom, l’adresse email et le téléphone sont obligatoires."
      );
      return;
    }

    if (credentialsChanged && !profileCurrentPassword) {
      showFeedback(
        "error",
        "Entre ton mot de passe actuel pour changer ton email ou ton téléphone."
      );
      return;
    }

    setSavingProfile(true);

    try {
      const response = await apiFetch("/me/account", {
        method: "PATCH",
        body: JSON.stringify({
          first_name: profileDraft.firstName.trim(),
          last_name: profileDraft.lastName.trim(),
          email: profileDraft.email.trim(),
          phone: profileDraft.phone.trim(),
          address: profileDraft.address.trim() || null,
          current_password: credentialsChanged ? profileCurrentPassword : undefined,
        }),
      });

      const body = response?.user ? response : response?.data ?? response;
      const user = body?.user;

      const saved = {
        firstName: user?.first_name ?? profileDraft.firstName.trim(),
        lastName: user?.last_name ?? profileDraft.lastName.trim(),
        email: user?.email ?? profileDraft.email.trim(),
        phone: user?.phone ?? profileDraft.phone.trim(),
        address: body?.address ?? profileDraft.address.trim(),
      };

      setProfile(saved);
      setProfileDraft(saved);
      setProfileCurrentPassword("");
      setEditingProfile(false);
      showFeedback("success", "Tes informations ont été enregistrées.");
    } catch (err) {
      showFeedback("error", err?.message || "Impossible d’enregistrer les modifications.");
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();

    if (!passwords.current || !passwords.next || !passwords.confirm) {
      showFeedback("error", "Remplis tous les champs du mot de passe.");
      return;
    }

    if (passwords.next.length < 8) {
      showFeedback(
        "error",
        "Le nouveau mot de passe doit contenir au moins 8 caractères."
      );
      return;
    }

    if (passwords.next !== passwords.confirm) {
      showFeedback("error", "Les deux nouveaux mots de passe ne correspondent pas.");
      return;
    }

    if (passwords.next === passwords.current) {
      showFeedback(
        "error",
        "Le nouveau mot de passe doit être différent de l’ancien."
      );
      return;
    }

    setSavingPassword(true);

    try {
      await apiFetch("/me/password", {
        method: "PUT",
        body: JSON.stringify({
          current_password: passwords.current,
          password: passwords.next,
          password_confirmation: passwords.confirm,
        }),
      });

      setPasswords({ current: "", next: "", confirm: "" });
      setShowPasswordForm(false);
      showFeedback(
        "success",
        "Mot de passe mis à jour. Tes autres appareils ont été déconnectés."
      );
    } catch (err) {
      showFeedback("error", err?.message || "Impossible de changer le mot de passe.");
    } finally {
      setSavingPassword(false);
    }
  };

  const changeLanguage = (value) => {
    setLanguage(value);

    try {
      localStorage.setItem(LANGUAGE_KEY, value);
    } catch {
      /* stockage indisponible : la préférence ne sera pas conservée */
    }

    showFeedback(
      "info",
      "Ta préférence est enregistrée sur cet appareil. La traduction complète n’est pas encore disponible."
    );
  };

  const signOut = async () => {
    setSigningOut(true);

    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch {
      // Le jeton est peut-être déjà expiré : on quitte quand même la session.
    } finally {
      navigate("/login");
    }
  };

  const passwordInput = (label, field, visible, toggleVisible, placeholder) => (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative">
        <input
          className={`${inputClass} pr-12`}
          type={visible ? "text" : "password"}
          value={passwords[field]}
          onChange={(event) =>
            setPasswords((current) => ({
              ...current,
              [field]: event.target.value,
            }))
          }
          placeholder={placeholder}
          autoComplete={field === "current" ? "current-password" : "new-password"}
          required
        />

        <button
          type="button"
          onClick={toggleVisible}
          aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );

  const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="min-h-screen bg-[#F8F8FA]">
      <ParentSidebar />

      <main className="min-w-0 px-4 py-6 sm:px-6 lg:ml-64 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Page header */}
          <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-[#6D4AFF]">PARENT PORTAL</p>
              <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                My Account
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Gère ton profil et la sécurité de ton compte.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 font-bold text-[#6D4AFF]">
                {loading ? "…" : initials || <UserRound size={18} />}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {loading ? "Chargement…" : `${profile.firstName} ${profile.lastName}`}
                </p>
                <p className="text-xs text-gray-500">Compte parent</p>
              </div>
            </div>
          </header>

          {/* Feedback */}
          {feedback && (
            <div
              role="status"
              className={`flex items-start gap-3 rounded-xl border p-4 ${
                feedback.type === "error"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : feedback.type === "info"
                  ? "border-blue-200 bg-blue-50 text-blue-700"
                  : "border-green-200 bg-green-50 text-green-700"
              }`}
            >
              {feedback.type === "error" ? (
                <AlertCircle size={20} className="shrink-0" />
              ) : (
                <CheckCircle2 size={20} className="shrink-0" />
              )}
              <p className="text-sm">{feedback.message}</p>
              <button
                type="button"
                onClick={() => setFeedback(null)}
                className="ml-auto text-sm font-semibold"
                aria-label="Fermer le message"
              >
                ×
              </button>
            </div>
          )}

          {/* Profile section */}
          <section
            id="profile"
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7"
          >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <SectionHeader
                icon={UserRound}
                title="Personal Information"
                description="Les informations utilisées pour ton compte parent."
              />

              {!editingProfile && (
                <button
                  type="button"
                  onClick={startEditing}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-[#6D4AFF] hover:text-[#6D4AFF] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Pencil size={16} />
                  Edit profile
                </button>
              )}
            </div>

            <div className="mt-6 flex flex-col items-center gap-4 rounded-xl bg-gray-50 p-5 sm:flex-row">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-purple-100 text-2xl font-bold text-[#6D4AFF]">
                {initials || <UserRound size={30} />}
              </div>

              <div className="text-center sm:text-left">
                <h3 className="font-semibold text-gray-900">
                  {profile.firstName} {profile.lastName}
                </h3>
                <p className="mt-1 break-all text-sm text-gray-500">{profile.email}</p>
              </div>
            </div>

            <form onSubmit={saveProfile} className="mt-6">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    First name *
                  </label>
                  <input
                    className={inputClass}
                    value={editingProfile ? profileDraft.firstName : profile.firstName}
                    onChange={(event) => updateProfileDraft("firstName", event.target.value)}
                    disabled={!editingProfile}
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Last name *
                  </label>
                  <input
                    className={inputClass}
                    value={editingProfile ? profileDraft.lastName : profile.lastName}
                    onChange={(event) => updateProfileDraft("lastName", event.target.value)}
                    disabled={!editingProfile}
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Email address *
                  </label>
                  <div className="relative">
                    <Mail
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      className={`${inputClass} pl-10`}
                      type="email"
                      value={editingProfile ? profileDraft.email : profile.email}
                      onChange={(event) => updateProfileDraft("email", event.target.value)}
                      disabled={!editingProfile}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Phone number *
                  </label>
                  <div className="relative">
                    <Phone
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      className={`${inputClass} pl-10`}
                      type="tel"
                      value={editingProfile ? profileDraft.phone : profile.phone}
                      onChange={(event) => updateProfileDraft("phone", event.target.value)}
                      disabled={!editingProfile}
                      placeholder="+237 6XX XXX XXX"
                      required
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Address / Location
                  </label>
                  <div className="relative">
                    <MapPin
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      className={`${inputClass} pl-10`}
                      value={editingProfile ? profileDraft.address : profile.address}
                      onChange={(event) => updateProfileDraft("address", event.target.value)}
                      disabled={!editingProfile}
                      placeholder="Quartier, ville"
                    />
                  </div>
                </div>

                {credentialsChanged && (
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Current password *
                    </label>
                    <input
                      className={inputClass}
                      type="password"
                      value={profileCurrentPassword}
                      onChange={(event) => setProfileCurrentPassword(event.target.value)}
                      placeholder="Enter your current password"
                      autoComplete="current-password"
                    />
                    <p className="mt-2 text-xs leading-5 text-gray-500">
                      Ton email et ton téléphone te servent aussi à te connecter :
                      pour ta sécurité, ton mot de passe actuel est demandé pour
                      les modifier.
                    </p>
                  </div>
                )}
              </div>

              {editingProfile && (
                <div className="mt-6 flex flex-col-reverse justify-end gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={cancelProfileEdit}
                    disabled={savingProfile}
                    className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D4AFF] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5938e8] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Save size={17} />
                    {savingProfile ? "Saving…" : "Save changes"}
                  </button>
                </div>
              )}
            </form>
          </section>

          {/* Security and preferences */}
          <section
            id="settings"
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7"
          >
            <SectionHeader
              icon={ShieldCheck}
              title="Security & Preferences"
              description="Gère la sécurité et les préférences de ton compte."
              color="orange"
            />

            {/* Password */}
            <div className="mt-6 rounded-xl border border-gray-100 p-4 sm:p-5">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                    <LockKeyhole size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Change password</p>
                    <p className="mt-1 text-sm text-gray-500">
                      Utilise un mot de passe fort et unique.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPasswordForm((value) => !value)}
                  className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-[#6D4AFF] hover:text-[#6D4AFF] sm:self-center"
                >
                  <Pencil size={16} />
                  {showPasswordForm ? "Cancel" : "Change password"}
                </button>
              </div>

              {showPasswordForm && (
                <form
                  onSubmit={changePassword}
                  className="mt-5 space-y-4 border-t border-gray-100 pt-5"
                >
                  {passwordInput(
                    "Current password",
                    "current",
                    showCurrentPassword,
                    () => setShowCurrentPassword((value) => !value),
                    "Enter current password"
                  )}

                  {passwordInput(
                    "New password",
                    "next",
                    showNewPassword,
                    () => setShowNewPassword((value) => !value),
                    "At least 8 characters"
                  )}

                  {passwordInput(
                    "Confirm new password",
                    "confirm",
                    showConfirmPassword,
                    () => setShowConfirmPassword((value) => !value),
                    "Repeat new password"
                  )}

                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#6D4AFF] px-5 py-3 text-sm font-semibold text-white hover:bg-[#5938e8] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    <LockKeyhole size={17} />
                    {savingPassword ? "Updating…" : "Update password"}
                  </button>

                  <p className="text-xs leading-5 text-gray-500">
                    Après le changement, tes autres appareils sont déconnectés.
                  </p>
                </form>
              )}
            </div>

            {/* Language */}
            <div className="mt-4 flex flex-col justify-between gap-4 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center sm:p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-[#6D4AFF]">
                  <Globe size={20} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Language preference</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Choisis ta langue préférée.
                  </p>
                </div>
              </div>

              <select
                value={language}
                onChange={(event) => changeLanguage(event.target.value)}
                aria-label="Language"
                className={`${inputClass} sm:max-w-48`}
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </div>
          </section>

          {/* Logout */}
          <section className="flex flex-col justify-between gap-4 rounded-2xl border border-red-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6">
            <div>
              <h2 className="font-bold text-gray-900">Sign out</h2>
              <p className="mt-1 text-sm text-gray-500">
                Déconnecte-toi de ton espace parent sur cet appareil.
              </p>
            </div>

            <button
              type="button"
              onClick={signOut}
              disabled={signingOut}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LogOut size={17} />
              {signingOut ? "Signing out…" : "Sign out"}
              <ChevronRight size={16} />
            </button>
          </section>

          <footer className="pb-4 text-center text-xs text-gray-400">
            Parent Portal · My Account
          </footer>
        </div>
      </main>
    </div>
  );
}