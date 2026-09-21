import { useState } from "react";
import {
  Bell,
  Check,
  DollarSign,
  Globe,
  Lock,
  Save,
  Settings as SettingsIcon,
  ShieldCheck,
  ToggleLeft,
  UsersRound,
} from "lucide-react";
import SidebarAdmin from "../components/admin/SidebarAdmin";

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState("General");

  const [settings, setSettings] = useState({
    platformName: "The Pathfinder",
    supportEmail: "support@thepathfinder.cm",
    supportPhone: "+237 6XX XXX XXX",
    language: "English",
    timezone: "Africa/Douala",

    commission: "15",
    currency: "FCFA",
    paymentBeforeService: true,
    escrowEnabled: true,

    emailNotifications: true,
    paymentNotifications: true,
    teacherApplications: true,
    disputeNotifications: true,

    maintenanceMode: false,
    allowTeacherRegistration: true,
    allowParentRegistration: true,
    allowStudentRegistration: true,
  });

  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const sections = [
    {
      label: "General",
      icon: SettingsIcon,
    },
    {
      label: "Payments",
      icon: DollarSign,
    },
    {
      label: "Notifications",
      icon: Bell,
    },
    {
      label: "Platform",
      icon: Globe,
    },
    {
      label: "Security",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9FB] font-sans text-[#302C38]">
      <SidebarAdmin activeItem="Settings" />

      <main className="lg:ml-64">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-5 sm:px-8">
          <p className="hidden text-sm text-gray-500 lg:block">
            Settings
          </p>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold text-pf-purple-dark">
                Super Admin
              </p>
              <p className="text-[11px] text-gray-400">
                Platform Administrator
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pf-purple text-xs font-semibold text-white">
              SA
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8">
          {/* Heading */}
          <section>
            <p className="text-sm font-medium text-pf-purple">
              PLATFORM CONFIGURATION
            </p>

            <h1 className="mt-1 font-serif text-2xl font-medium text-pf-purple-dark sm:text-3xl">
              Settings
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-gray-500">
              Configure the general behaviour and preferences of
              The Pathfinder platform.
            </p>
          </section>

          {/* Layout */}
          <section className="mt-7 grid gap-6 lg:grid-cols-[220px_1fr]">
            {/* Settings navigation */}
            <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-2">
              {sections.map((section) => {
                const Icon = section.icon;
                const active =
                  activeSection === section.label;

                return (
                  <button
                    key={section.label}
                    type="button"
                    onClick={() =>
                      setActiveSection(section.label)
                    }
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                      active
                        ? "bg-pf-purple text-white"
                        : "text-[#5D5A65] hover:bg-pf-purple-light hover:text-pf-purple-dark"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">
                      {section.label}
                    </span>
                  </button>
                );
              })}
            </aside>

            {/* Content */}
            <div className="space-y-5">
              {activeSection === "General" && (
                <GeneralSettings
                  settings={settings}
                  updateSetting={updateSetting}
                />
              )}

              {activeSection === "Payments" && (
                <PaymentSettings
                  settings={settings}
                  updateSetting={updateSetting}
                />
              )}

              {activeSection === "Notifications" && (
                <NotificationSettings
                  settings={settings}
                  updateSetting={updateSetting}
                />
              )}

              {activeSection === "Platform" && (
                <PlatformSettings
                  settings={settings}
                  updateSetting={updateSetting}
                />
              )}

              {activeSection === "Security" && (
                <SecuritySettings
                  settings={settings}
                  updateSetting={updateSetting}
                />
              )}

              <div className="flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg bg-pf-purple px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-pf-purple-dark"
                >
                  <Save className="h-4 w-4" />
                  Save changes
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* ========================================================= */
/* GENERAL SETTINGS                                           */
/* ========================================================= */

function GeneralSettings({ settings, updateSetting }) {
  return (
    <SettingsCard
      title="General settings"
      description="Basic information about your learning platform."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <InputField
          label="Platform name"
          value={settings.platformName}
          onChange={(value) =>
            updateSetting("platformName", value)
          }
        />

        <InputField
          label="Support email"
          value={settings.supportEmail}
          onChange={(value) =>
            updateSetting("supportEmail", value)
          }
        />

        <InputField
          label="Support phone"
          value={settings.supportPhone}
          onChange={(value) =>
            updateSetting("supportPhone", value)
          }
        />

        <SelectField
          label="Default language"
          value={settings.language}
          options={["English", "French"]}
          onChange={(value) =>
            updateSetting("language", value)
          }
        />

        <SelectField
          label="Timezone"
          value={settings.timezone}
          options={["Africa/Douala", "UTC"]}
          onChange={(value) =>
            updateSetting("timezone", value)
          }
        />
      </div>
    </SettingsCard>
  );
}

/* ========================================================= */
/* PAYMENT SETTINGS                                           */
/* ========================================================= */

function PaymentSettings({ settings, updateSetting }) {
  return (
    <SettingsCard
      title="Payment settings"
      description="Configure commissions, currency and payment behaviour."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <InputField
          label="Platform commission (%)"
          type="number"
          value={settings.commission}
          onChange={(value) =>
            updateSetting("commission", value)
          }
        />

        <SelectField
          label="Currency"
          value={settings.currency}
          options={["FCFA", "EUR", "USD"]}
          onChange={(value) =>
            updateSetting("currency", value)
          }
        />
      </div>

      <div className="mt-6 space-y-3">
        <ToggleRow
          icon={DollarSign}
          title="Payment before service"
          description="Parents must pay before a tutoring service begins."
          enabled={settings.paymentBeforeService}
          onChange={(value) =>
            updateSetting("paymentBeforeService", value)
          }
        />

        <ToggleRow
          icon={Lock}
          title="Escrow / secure payment"
          description="Keep the payment secured until the service conditions are fulfilled."
          enabled={settings.escrowEnabled}
          onChange={(value) =>
            updateSetting("escrowEnabled", value)
          }
        />
      </div>
    </SettingsCard>
  );
}

/* ========================================================= */
/* NOTIFICATION SETTINGS                                      */
/* ========================================================= */

function NotificationSettings({
  settings,
  updateSetting,
}) {
  return (
    <SettingsCard
      title="Notification settings"
      description="Choose which platform events generate notifications."
    >
      <div className="space-y-3">
        <ToggleRow
          icon={Bell}
          title="Email notifications"
          description="Send important platform notifications by email."
          enabled={settings.emailNotifications}
          onChange={(value) =>
            updateSetting("emailNotifications", value)
          }
        />

        <ToggleRow
          icon={DollarSign}
          title="Payment notifications"
          description="Notify administrators when important payment events occur."
          enabled={settings.paymentNotifications}
          onChange={(value) =>
            updateSetting("paymentNotifications", value)
          }
        />

        <ToggleRow
          icon={UsersRound}
          title="Teacher applications"
          description="Notify administrators when a new teacher applies."
          enabled={settings.teacherApplications}
          onChange={(value) =>
            updateSetting("teacherApplications", value)
          }
        />

        <ToggleRow
          icon={ShieldCheck}
          title="Dispute notifications"
          description="Notify administrators when a new dispute is opened."
          enabled={settings.disputeNotifications}
          onChange={(value) =>
            updateSetting("disputeNotifications", value)
          }
        />
      </div>
    </SettingsCard>
  );
}

/* ========================================================= */
/* PLATFORM SETTINGS                                          */
/* ========================================================= */

function PlatformSettings({
  settings,
  updateSetting,
}) {
  return (
    <SettingsCard
      title="Platform settings"
      description="Control registration and platform availability."
    >
      <div className="space-y-3">
        <ToggleRow
          icon={UsersRound}
          title="Teacher registration"
          description="Allow new teachers to register on the platform."
          enabled={settings.allowTeacherRegistration}
          onChange={(value) =>
            updateSetting(
              "allowTeacherRegistration",
              value
            )
          }
        />

        <ToggleRow
          icon={UsersRound}
          title="Parent registration"
          description="Allow parents to create new accounts."
          enabled={settings.allowParentRegistration}
          onChange={(value) =>
            updateSetting(
              "allowParentRegistration",
              value
            )
          }
        />

        <ToggleRow
          icon={UsersRound}
          title="Student registration"
          description="Allow independent learners to create accounts."
          enabled={settings.allowStudentRegistration}
          onChange={(value) =>
            updateSetting(
              "allowStudentRegistration",
              value
            )
          }
        />

        <ToggleRow
          icon={SettingsIcon}
          title="Maintenance mode"
          description="Temporarily restrict access while administrators perform maintenance."
          enabled={settings.maintenanceMode}
          onChange={(value) =>
            updateSetting("maintenanceMode", value)
          }
        />
      </div>
    </SettingsCard>
  );
}

/* ========================================================= */
/* SECURITY SETTINGS                                          */
/* ========================================================= */

function SecuritySettings({
  settings,
  updateSetting,
}) {
  return (
    <SettingsCard
      title="Security"
      description="Security-related platform controls."
    >
      <div className="rounded-xl border border-gray-100 bg-[#FAF9FB] p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pf-purple-light">
            <ShieldCheck className="h-5 w-5 text-pf-purple" />
          </div>

          <div>
            <p className="text-sm font-medium text-pf-purple-dark">
              Administrator security
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Sensitive administrator controls such as permissions,
              roles and access management are handled from the
              Permissions page.
            </p>

            <a
              href="/admin-permissions"
              className="mt-3 inline-block text-xs font-semibold text-pf-purple hover:underline"
            >
              Manage permissions →
            </a>
          </div>
        </div>
      </div>
    </SettingsCard>
  );
}

/* ========================================================= */
/* SETTINGS CARD                                              */
/* ========================================================= */

function SettingsCard({
  title,
  description,
  children,
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
      <div className="border-b border-gray-100 pb-5">
        <h2 className="font-serif text-xl text-pf-purple-dark">
          {title}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {description}
        </p>
      </div>

      <div className="pt-5">{children}</div>
    </section>
  );
}

/* ========================================================= */
/* INPUT                                                       */
/* ========================================================= */

function InputField({
  label,
  value,
  onChange,
  type = "text",
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-gray-600">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-pf-purple focus:ring-2 focus:ring-pf-purple/10"
      />
    </label>
  );
}

/* ========================================================= */
/* SELECT                                                      */
/* ========================================================= */

function SelectField({
  label,
  value,
  options,
  onChange,
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-gray-600">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-pf-purple focus:ring-2 focus:ring-pf-purple/10"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ========================================================= */
/* TOGGLE                                                      */
/* ========================================================= */

function ToggleRow({
  icon: Icon,
  title,
  description,
  enabled,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 p-4">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-pf-purple-light">
          <Icon className="h-4 w-4 text-pf-purple" />
        </div>

        <div>
          <p className="text-sm font-medium text-pf-purple-dark">
            {title}
          </p>

          <p className="mt-1 text-xs leading-5 text-gray-500">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onChange(!enabled)}
        aria-pressed={enabled}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled
            ? "bg-pf-purple"
            : "bg-gray-200"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />

        <span className="sr-only">
          {enabled ? "Enabled" : "Disabled"}
        </span>
      </button>
    </div>
  );
}