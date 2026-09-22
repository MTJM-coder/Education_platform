import { useEffect, useState } from "react";
import {
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  Camera,
  CheckCircle2,
  FileText,
  MapPin,
  Pencil,
  Phone,
  Mail,
  UserRound,
  Upload,
  Clock3,
} from "lucide-react";
import TeacherSidebar from "../components/teacher/TeacherSidebar";

const subjects = [
  {
    name: "Mathematics",
    level: "Primary, Secondary",
    status: "Validated",
    validatedBy: "Head of Mathematics",
  },
  {
    name: "Physics",
    level: "Secondary",
    status: "Validated",
    validatedBy: "Head of Physics",
  },
  {
    name: "Chemistry",
    level: "Secondary",
    status: "Pending",
    validatedBy: null,
  },
];

const documents = [
  {
    name: "National ID Card",
    file: "john-id-card.pdf",
    status: "Verified",
  },
  {
    name: "CV",
    file: "john-cv.pdf",
    status: "Verified",
  },
  {
    name: "Degree Certificate",
    file: "degree-certificate.pdf",
    status: "Verified",
  },
  {
    name: "Localization Plan",
    file: "localization-plan.pdf",
    status: "Verified",
  },
];

export default function TeacherProfilePage() {
  const [showSuccess, setShowSuccess] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("registered") === "true") {
      setShowSuccess(true);

      // On retire le paramètre de l'URL
      window.history.replaceState({}, "", "/teacher-profile");

      // Facultatif : faire disparaître le message après quelques secondes
       setTimeout(() => {
        setShowSuccess(false);
      }, 6000);

      return 
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFC]">
      <TeacherSidebar activeItem="My Profile" />

      <main className="lg:ml-64">

        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-100 bg-white/95 px-6 backdrop-blur lg:px-8">
          <div className="ml-12 lg:ml-0">
            <p className="text-xs text-gray-400">Teacher Portal</p>

            <h1 className="text-lg font-semibold text-pf-purple-dark">
              My Profile
            </h1>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5">
            <CheckCircle2 className="h-4 w-4 text-green-600" />

            <span className="text-xs font-medium text-green-700">
              Profile Verified
            </span>
          </div>
        </header>
        {showSuccess && (
          <div className="mx-auto max-w-7xl px-6 pt-6">
            <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-4">
              <h2 className="font-medium text-green-800">
                Compte créé avec succès 🎉
              </h2>

              <p className="mt-1 text-sm text-green-700">
               Votre compte enseignant a bien été créé. Votre profil est actuellement en attente de validation. Veuillez compléter les documents requis afin de finaliser votre profil.
              </p>
            </div>
          </div>
        )}
        <div className="p-6 lg:p-8">

          {/* Profile header */}
          <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-5">
                {/* Avatar */}
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-pf-purple-light">
                    <UserRound className="h-10 w-10 text-pf-purple" />
                  </div>

                  <button
                    type="button"
                    className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-pf-purple text-white shadow-sm"
                    aria-label="Change profile photo"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-pf-purple-dark">
                    John Doe
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Mathematics & Physics Teacher
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-pf-purple-light px-2.5 py-1 text-xs font-medium text-pf-purple">
                      Senior Teacher
                    </span>

                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <MapPin className="h-3.5 w-3.5" />
                      Bonamoussadi, Douala
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-lg bg-pf-purple px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
              >
                <Pencil className="h-4 w-4" />
                Edit Profile
              </button>
            </div>
          </section>

          {/* Personal information */}
          <section className="mt-6 rounded-xl border border-gray-100 bg-white shadow-sm">
            <SectionHeader
              icon={UserRound}
              title="Personal Information"
              description="Your basic personal and contact information"
            />

            <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
              <InfoItem
                icon={UserRound}
                label="Full Name"
                value="John Doe"
              />

              <InfoItem
                icon={Phone}
                label="Phone"
                value="+237 6XX XXX XXX"
              />

              <InfoItem
                icon={Mail}
                label="Email"
                value="john.doe@email.com"
              />

              <InfoItem
                icon={UserRound}
                label="Gender"
                value="Male"
              />

              <InfoItem
                icon={MapPin}
                label="Location"
                value="Bonamoussadi, Douala"
              />

              <InfoItem
                icon={MapPin}
                label="Teaching Radius"
                value="10 km"
              />
            </div>
          </section>

          {/* Professional information */}
          <section className="mt-6 rounded-xl border border-gray-100 bg-white shadow-sm">
            <SectionHeader
              icon={BriefcaseBusiness}
              title="Professional Information"
              description="Your teaching experience and professional details"
            />

            <div className="grid gap-6 p-6 sm:grid-cols-2">
              <InfoItem
                icon={BriefcaseBusiness}
                label="Teaching Experience"
                value="5 years"
              />

              <InfoItem
                icon={Clock3}
                label="Expected Rate"
                value="3,500 FCFA / hour"
              />

              <div className="sm:col-span-2">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                  Biography
                </p>

                <p className="max-w-3xl text-sm leading-6 text-gray-600">
                  Experienced teacher passionate about helping students
                  understand Mathematics and Physics through practical
                  explanations and personalized learning.
                </p>
              </div>
            </div>
          </section>

          {/* Subjects */}
          <section className="mt-6 rounded-xl border border-gray-100 bg-white shadow-sm">
            <SectionHeader
              icon={BookOpen}
              title="My Subjects"
              description="Subjects you teach and their validation status"
              action={
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-pf-purple transition hover:bg-pf-purple-light"
                >
                  <BookOpen className="h-4 w-4" />
                  Request Subject
                </button>
              }
            />

            <div className="divide-y divide-gray-100">
              {subjects.map((subject) => (
                <div
                  key={subject.name}
                  className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-pf-purple-dark">
                        {subject.name}
                      </h3>

                      {subject.status === "Validated" ? (
                        <BadgeCheck className="h-4 w-4 text-green-600" />
                      ) : (
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                          Pending
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs text-gray-400">
                      {subject.level}
                    </p>

                    {subject.validatedBy && (
                      <p className="mt-1 text-xs text-gray-400">
                        Validated by {subject.validatedBy}
                      </p>
                    )}
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1.5 text-xs font-medium ${subject.status === "Validated"
                      ? "bg-green-50 text-green-700"
                      : "bg-amber-50 text-amber-700"
                      }`}
                  >
                    {subject.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Documents */}
          <section className="mt-6 rounded-xl border border-gray-100 bg-white shadow-sm">
            <SectionHeader
              icon={FileText}
              title="Documents"
              description="Documents submitted for profile verification"
              action={
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-pf-purple transition hover:bg-pf-purple-light"
                >
                  <Upload className="h-4 w-4" />
                  Upload
                </button>
              }
            />

            <div className="grid gap-3 p-6 md:grid-cols-2">
              {documents.map((document) => (
                <div
                  key={document.name}
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pf-purple-light text-pf-purple">
                      <FileText className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-pf-purple-dark">
                        {document.name}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-gray-400">
                        {document.file}
                      </p>
                    </div>
                  </div>

                  <span className="ml-3 flex shrink-0 items-center gap-1 text-xs font-medium text-green-600">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {document.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Availability summary */}
          <section className="mt-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold text-pf-purple-dark">
                  Teaching Availability
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Your weekly availability is managed from your calendar.
                </p>
              </div>

              <a
                href="/teacher-calendar"
                className="flex w-fit items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-pf-purple transition hover:bg-pf-purple-light"
              >
                <Clock3 className="h-4 w-4" />
                Manage Availability
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* ---------------------------------- */
/* Reusable components                */
/* ---------------------------------- */

function SectionHeader({
  icon: Icon,
  title,
  description,
  action,
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-gray-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-pf-purple-light text-pf-purple">
          <Icon className="h-4.5 w-4.5" />
        </div>

        <div>
          <h3 className="font-semibold text-pf-purple-dark">{title}</h3>

          <p className="mt-0.5 text-xs text-gray-400">{description}</p>
        </div>
      </div>

      {action}
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-gray-400">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </p>

      <p className="text-sm font-medium text-pf-purple-dark">{value}</p>
    </div>
  );
}