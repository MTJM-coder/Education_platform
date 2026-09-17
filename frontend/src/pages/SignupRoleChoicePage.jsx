import { Users, Presentation, Backpack } from "lucide-react";

const roles = [
  {
    key: "parent",
    icon: Users,
    title: "Je suis parent",
    text: "Je cherche un enseignant à domicile pour mon enfant.",
    href: "/register/parent",
    dark: false,
  },
  {
    key: "teacher",
    icon: Presentation,
    title: "Je suis enseignant",
    text: "Je veux proposer mes cours et développer mon activité.",
    href: "/register/teacher",
    dark: true,
  },
  {
    key: "student",
    icon: Backpack,
    title: "Je suis élève",
    text: "Je m'inscris moi-même pour suivre des cours et réviser.",
    href: "/register/student",
    dark: false,
  },
];

export default function SignupRoleChoicePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-12 font-sans">
      <img
        src="/pathfinder-logo.png"
        alt="The Pathfinder Academic"
        className="mb-4.5 h-10 w-10 object-contain"
      />

      <p className="mb-2 text-xs font-medium text-pf-gold">
        Trois chemins, une même destination
      </p>
      <h1 className="mb-2 max-w-md text-center font-serif text-2xl font-medium text-pf-purple-dark">
        Comment voulez-vous rejoindre l'aventure ?
      </h1>
      <p className="mb-8 text-[13px] text-gray-600">
        Choisissez votre profil pour commencer.
      </p>

      <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-3">
        {roles.map(({ key, icon: Icon, title, text, href, dark }) => (
          <a
            key={key}
            href={href}
            className={`rounded-2xl border p-5.5 text-left ${
              dark
                ? "border-pf-purple bg-pf-purple"
                : "border-gray-200 bg-white"
            }`}
          >
            <div
              className={`mb-3.5 flex h-9.5 w-9.5 items-center justify-center rounded-[10px] ${
                dark ? "bg-white/15" : "bg-pf-purple-light"
              }`}
            >
              <Icon
                className={`h-[19px] w-[19px] ${dark ? "text-pf-gold" : "text-pf-purple"}`}
                aria-hidden="true"
              />
            </div>
            <p
              className={`mb-1 font-serif text-[15px] font-medium ${
                dark ? "text-white" : "text-pf-purple-dark"
              }`}
            >
              {title}
            </p>
            <p className={`text-xs ${dark ? "text-purple-100" : "text-gray-600"}`}>
              {text}
            </p>
          </a>
        ))}
      </div>

      <p className="mt-7 text-[13px] text-gray-600">
        Déjà un compte ?{" "}
        <a href="/login" className="text-pf-blue underline">
          Se connecter
        </a>
      </p>
    </div>
  );
}