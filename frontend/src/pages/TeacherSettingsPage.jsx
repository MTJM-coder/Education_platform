import {
  Bell,
  ChevronRight,
  Eye,
  Globe,
  KeyRound,
  Lock,
  LogOut,
  Mail,
  Save,
  ShieldCheck,
  Smartphone,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import TeacherSidebar from "../components/teacher/TeacherSidebar";

export default function TeacherSettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [evaluationNotifications, setEvaluationNotifications] =
    useState(true);
  const [paymentNotifications, setPaymentNotifications] =
    useState(true);

  return (
    <div className="min-h-screen bg-[#FAFAFC]">
      <TeacherSidebar activeItem="Settings" />

      <main className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center border-b border-gray-100 bg-white/95 px-6 backdrop-blur lg:px-8">
          <div className="ml-12 lg:ml-0">
            <p className="text-xs text-gray-400">
              Teacher Portal
            </p>

            <h1 className="text-lg font-semibold text-pf-purple-dark">
              Settings
            </h1>
          </div>
        </header>

        <div className="p-6 lg:p-8">
          {/* Intro */}
          <section className="mb-7">
            <h2 className="font-serif text-2xl font-semibold text-pf-purple-dark">
              Account Settings
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage your account, security and notification
              preferences.
            </p>
          </section>

          <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              {/* Account information */}
              <SettingsSection
                icon={UserRound}
                title="Account Information"
                description="Update the information associated with your teacher account."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField
                    label="First Name"
                    defaultValue="John"
                  />

                  <InputField
                    label="Last Name"
                    defaultValue="Doe"
                  />

                  <InputField
                    label="Email"
                    defaultValue="john@example.com"
                    type="email"
                  />

                  <InputField
                    label="Phone"
                    defaultValue="+237 6XX XXX XXX"
                  />
                </div>

                <div className="mt-5 flex justify-end">
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-lg bg-pf-purple px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </button>
                </div>
              </SettingsSection>

              {/* Security */}
              <SettingsSection
                icon={ShieldCheck}
                title="Security"
                description="Keep your account protected."
              >
                <SettingAction
                  icon={KeyRound}
                  title="Change Password"
                  description="Update your account password."
                  action="Change"
                />

                <SettingAction
                  icon={Smartphone}
                  title="Phone Verification"
                  description="Your phone number is currently verified."
                  action="Verified"
                  verified
                />

                <SettingAction
                  icon={Lock}
                  title="Two-Factor Authentication"
                  description="Add an additional layer of security."
                  action="Enable"
                />
              </SettingsSection>

              {/* Notifications */}
              <SettingsSection
                icon={Bell}
                title="Notifications"
                description="Choose which notifications you want to receive."
              >
                <ToggleSetting
                  title="Email Notifications"
                  description="Receive important platform notifications by email."
                  enabled={emailNotifications}
                  onChange={() =>
                    setEmailNotifications(!emailNotifications)
                  }
                />

                <ToggleSetting
                  title="SMS Notifications"
                  description="Receive important updates by SMS."
                  enabled={smsNotifications}
                  onChange={() =>
                    setSmsNotifications(!smsNotifications)
                  }
                />

                <ToggleSetting
                  title="Evaluation Notifications"
                  description="Get notified when a student or parent evaluates you."
                  enabled={evaluationNotifications}
                  onChange={() =>
                    setEvaluationNotifications(
                      !evaluationNotifications
                    )
                  }
                />

                <ToggleSetting
                  title="Payment Notifications"
                  description="Receive notifications about payments and escrow releases."
                  enabled={paymentNotifications}
                  onChange={() =>
                    setPaymentNotifications(
                      !paymentNotifications
                    )
                  }
                />
              </SettingsSection>

              {/* Preferences */}
              <SettingsSection
                icon={Globe}
                title="Preferences"
                description="Customize your platform experience."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <SelectField
                    label="Language"
                    value="English"
                    options={[
                      "English",
                      "French",
                    ]}
                  />

                  <SelectField
                    label="Timezone"
                    value="Africa/Douala"
                    options={[
                      "Africa/Douala",
                      "Africa/Yaoundé",
                    ]}
                  />
                </div>
              </SettingsSection>

              {/* Danger zone */}
              <section className="rounded-xl border border-red-100 bg-white shadow-sm">
                <div className="border-b border-red-100 px-6 py-5">
                  <h3 className="font-semibold text-red-700">
                    Account Actions
                  </h3>

                  <p className="mt-1 text-xs text-gray-400">
                    These actions may affect your access to the
                    platform.
                  </p>
                </div>

                <div className="p-6">
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </button>
                </div>
              </section>
            </div>

            {/* Right column */}
            <aside className="space-y-6">
              {/* Profile summary */}
              <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pf-purple-light text-pf-purple">
                    <UserRound className="h-7 w-7" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-pf-purple-dark">
                      John Doe
                    </h3>

                    <p className="mt-1 text-xs text-gray-400">
                      Teacher
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      Account status
                    </span>

                    <span className="rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-medium text-green-700">
                      Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Privacy */}
              <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-pf-purple" />

                    <h3 className="text-sm font-semibold text-pf-purple-dark">
                      Privacy
                    </h3>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-xs leading-5 text-gray-500">
                    Your personal information is only shared
                    with authorized users when necessary for
                    tutoring services.
                  </p>

                  <button
                    type="button"
                    className="mt-4 flex items-center gap-1 text-xs font-medium text-pf-purple"
                  >
                    Privacy details
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Support */}
              <div className="rounded-xl bg-pf-purple p-5 text-white">
                <Mail className="h-5 w-5" />

                <h3 className="mt-4 font-semibold">
                  Need help?
                </h3>

                <p className="mt-1 text-xs leading-5 text-white/70">
                  Contact the platform administration if you
                  have a problem with your account.
                </p>

                <button
                  type="button"
                  className="mt-4 rounded-lg bg-white px-3.5 py-2 text-xs font-semibold text-pf-purple"
                >
                  Contact Support
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ========================================================= */
/* SETTINGS SECTION                                           */
/* ========================================================= */

function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
}) {
  return (
    <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="flex gap-3 border-b border-gray-100 px-6 py-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-pf-purple-light text-pf-purple">
          <Icon className="h-4 w-4" />
        </div>

        <div>
          <h3 className="font-semibold text-pf-purple-dark">
            {title}
          </h3>

          <p className="mt-1 text-xs text-gray-400">
            {description}
          </p>
        </div>
      </div>

      <div className="p-6">
        {children}
      </div>
    </section>
  );
}

/* ========================================================= */
/* INPUT FIELD                                                */
/* ========================================================= */

function InputField({
  label,
  defaultValue,
  type = "text",
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-600">
        {label}
      </label>

      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none transition focus:border-pf-purple focus:ring-2 focus:ring-pf-purple/10"
      />
    </div>
  );
}

/* ========================================================= */
/* SELECT FIELD                                               */
/* ========================================================= */

function SelectField({
  label,
  value,
  options,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-600">
        {label}
      </label>

      <select
        defaultValue={value}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-pf-purple"
      >
        {options.map((option) => (
          <option key={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ========================================================= */
/* SETTING ACTION                                             */
/* ========================================================= */

function SettingAction({
  icon: Icon,
  title,
  description,
  action,
  verified = false,
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 py-4 last:border-0 last:pb-0 first:pt-0">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
          <Icon className="h-4 w-4" />
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700">
            {title}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium ${
          verified
            ? "bg-green-50 text-green-700"
            : "border border-gray-200 text-pf-purple hover:bg-pf-purple-light"
        }`}
      >
        {action}
      </button>
    </div>
  );
}

/* ========================================================= */
/* TOGGLE                                                      */
/* ========================================================= */

function ToggleSetting({
  title,
  description,
  enabled,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between gap-5 border-b border-gray-100 py-4 last:border-0 last:pb-0 first:pt-0">
      <div>
        <p className="text-sm font-medium text-gray-700">
          {title}
        </p>

        <p className="mt-1 max-w-xl text-xs leading-5 text-gray-400">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={onChange}
        aria-pressed={enabled}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled
            ? "bg-pf-purple"
            : "bg-gray-200"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            enabled
              ? "left-6"
              : "left-1"
          }`}
        />
      </button>
    </div>
  );
}