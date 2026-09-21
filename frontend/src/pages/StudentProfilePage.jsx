import { useState } from "react";
import {
  Camera,
  Check,
  Edit3,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  School,
  UserRound,
} from "lucide-react";
import SidebarStudent from "../components/student/SidebarStudent";

export default function StudentProfilePage() {
  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState({
    firstName: "Jaudel",
    lastName: "Merlando",
    email: "student@example.com",
    phone: "+237 6 77 00 00 00",
    section: "English",
    level: "Secondary",
    className: "Form 5",
    school: "The Pathfinder Academy",
    location: "Douala, Cameroon",
  });

  const handleChange = (field, value) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-[#FAF9FB] font-sans text-[#302C38]">
      <SidebarStudent activeItem="My Profile" />

      <main className="lg:ml-64">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-5 sm:px-8">
          <div className="flex items-center gap-2 lg:hidden">
            <GraduationCap className="h-6 w-6 text-pf-purple" />

            <span className="font-serif text-sm text-pf-purple-dark">
              Student Portal
            </span>
          </div>

          <p className="hidden text-sm text-gray-500 lg:block">
            My Profile
          </p>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pf-purple-light text-xs font-semibold text-pf-purple">
            JM
          </div>
        </header>

        <div className="mx-auto max-w-5xl px-5 py-7 sm:px-8">
          {/* Heading */}
          <section className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-pf-purple">
                ACCOUNT
              </p>

              <h1 className="mt-1 font-serif text-2xl font-medium text-pf-purple-dark sm:text-3xl">
                My Profile
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Manage your personal and academic information.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setEditing(!editing)}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                editing
                  ? "bg-pf-purple text-white hover:bg-pf-purple-dark"
                  : "border border-gray-200 bg-white text-pf-purple-dark hover:bg-gray-50"
              }`}
            >
              {editing ? (
                <>
                  <Check className="h-4 w-4" />
                  Save changes
                </>
              ) : (
                <>
                  <Edit3 className="h-4 w-4 text-pf-purple" />
                  Edit profile
                </>
              )}
            </button>
          </section>

          {/* Profile header */}
          <section className="mt-7 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="h-28 bg-pf-purple" />

            <div className="px-5 pb-6 sm:px-7">
              <div className="-mt-12 flex flex-wrap items-end justify-between gap-4">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-pf-purple-light text-2xl font-semibold text-pf-purple shadow-sm">
                    JM
                  </div>

                  {editing && (
                    <button
                      type="button"
                      aria-label="Change profile photo"
                      className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-pf-purple text-white shadow-sm"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="pb-1">
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                    Active Student
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <h2 className="font-serif text-2xl text-pf-purple-dark">
                  {profile.firstName} {profile.lastName}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {profile.level} · {profile.className} ·{" "}
                  {profile.section}
                </p>
              </div>
            </div>
          </section>

          {/* Personal information */}
          <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pf-purple-light">
                <UserRound className="h-5 w-5 text-pf-purple" />
              </div>

              <div>
                <h2 className="font-serif text-xl text-pf-purple-dark">
                  Personal information
                </h2>

                <p className="mt-0.5 text-xs text-gray-500">
                  Your basic account information.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <ProfileField
                label="First name"
                value={profile.firstName}
                editing={editing}
                onChange={(value) =>
                  handleChange("firstName", value)
                }
              />

              <ProfileField
                label="Last name"
                value={profile.lastName}
                editing={editing}
                onChange={(value) =>
                  handleChange("lastName", value)
                }
              />

              <ProfileField
                label="Email address"
                value={profile.email}
                editing={editing}
                type="email"
                icon={Mail}
                onChange={(value) =>
                  handleChange("email", value)
                }
              />

              <ProfileField
                label="Phone number"
                value={profile.phone}
                editing={editing}
                icon={Phone}
                onChange={(value) =>
                  handleChange("phone", value)
                }
              />

              <ProfileField
                label="Location"
                value={profile.location}
                editing={editing}
                icon={MapPin}
                onChange={(value) =>
                  handleChange("location", value)
                }
              />
            </div>
          </section>

          {/* Academic information */}
          <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pf-purple-light">
                <GraduationCap className="h-5 w-5 text-pf-purple" />
              </div>

              <div>
                <h2 className="font-serif text-xl text-pf-purple-dark">
                  Academic information
                </h2>

                <p className="mt-0.5 text-xs text-gray-500">
                  Your current educational information.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <SelectField
                label="Section"
                value={profile.section}
                editing={editing}
                options={["English", "French"]}
                onChange={(value) =>
                  handleChange("section", value)
                }
              />

              <SelectField
                label="Level"
                value={profile.level}
                editing={editing}
                options={["Primary", "Secondary"]}
                onChange={(value) =>
                  handleChange("level", value)
                }
              />

              <ProfileField
                label="Class"
                value={profile.className}
                editing={editing}
                onChange={(value) =>
                  handleChange("className", value)
                }
              />

              <ProfileField
                label="School"
                value={profile.school}
                editing={editing}
                icon={School}
                onChange={(value) =>
                  handleChange("school", value)
                }
              />
            </div>
          </section>

          {/* Learning summary */}
          <section className="mt-6 grid gap-4 sm:grid-cols-3">
            <StatCard
              value="4"
              label="Active subjects"
            />

            <StatCard
              value="78%"
              label="Overall progress"
            />

            <StatCard
              value="12"
              label="Completed assessments"
            />
          </section>

          {/* Account information */}
          <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
            <h2 className="font-serif text-xl text-pf-purple-dark">
              Account information
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-[#FAF9FB] p-4">
                <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                  Account type
                </p>

                <p className="mt-1 text-sm font-medium text-pf-purple-dark">
                  Student
                </p>
              </div>

              <div className="rounded-xl bg-[#FAF9FB] p-4">
                <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                  Account status
                </p>

                <p className="mt-1 text-sm font-medium text-green-600">
                  Active
                </p>
              </div>
            </div>

            <div className="mt-5 border-t border-gray-100 pt-5">
              <button
                type="button"
                className="text-sm font-semibold text-pf-purple hover:underline"
              >
                Change password →
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* ========================================================= */
/* PROFILE FIELD                                              */
/* ========================================================= */

function ProfileField({
  label,
  value,
  editing,
  onChange,
  type = "text",
  icon: Icon,
}) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-500">
        {label}
      </label>

      <div className="relative mt-2">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        )}

        {editing ? (
          <input
            type={type}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className={`w-full rounded-xl border border-gray-200 bg-white py-3 text-sm text-pf-purple-dark outline-none transition focus:border-pf-purple focus:ring-2 focus:ring-pf-purple/10 ${
              Icon ? "pl-10 pr-3" : "px-3"
            }`}
          />
        ) : (
          <div
            className={`rounded-xl bg-[#FAF9FB] py-3 text-sm text-pf-purple-dark ${
              Icon ? "pl-10 pr-3" : "px-3"
            }`}
          >
            {value}
          </div>
        )}
      </div>
    </div>
  );
}

/* ========================================================= */
/* SELECT FIELD                                               */
/* ========================================================= */

function SelectField({
  label,
  value,
  editing,
  options,
  onChange,
}) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-500">
        {label}
      </label>

      <div className="mt-2">
        {editing ? (
          <select
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-pf-purple-dark outline-none focus:border-pf-purple focus:ring-2 focus:ring-pf-purple/10"
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <div className="rounded-xl bg-[#FAF9FB] px-3 py-3 text-sm text-pf-purple-dark">
            {value}
          </div>
        )}
      </div>
    </div>
  );
}

/* ========================================================= */
/* STAT CARD                                                  */
/* ========================================================= */

function StatCard({ value, label }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <p className="font-serif text-2xl text-pf-purple-dark">
        {value}
      </p>

      <p className="mt-1 text-xs text-gray-500">
        {label}
      </p>
    </div>
  );
}