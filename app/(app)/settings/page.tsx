"use client";

import { useState } from "react";
import { Save, User, Bell, Palette, Database } from "lucide-react";

interface SettingsSectionProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

function SettingsSection({ title, icon: Icon, children }: SettingsSectionProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
        <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <Icon className="w-4 h-4" />
        </div>
        <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

interface FieldProps { label: string; description?: string; children: React.ReactNode }
function Field({ label, description, children }: FieldProps) {
  return (
    <div className="flex items-start justify-between gap-6">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

interface ToggleProps { checked: boolean; onChange: (v: boolean) => void }
function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={"relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 " + (checked ? "bg-indigo-600" : "bg-gray-200")}
    >
      <span
        className={"inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform " + (checked ? "translate-x-6" : "translate-x-1")}
      />
    </button>
  );
}

const inputCls = "border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800 w-48";

export default function SettingsPage() {
  // Profile
  const [name,     setName]     = useState("John Adeyemi");
  const [role,     setRole]     = useState("Event Coordinator");
  const [email,    setEmail]    = useState("john.adeyemi@email.com");

  // Notifications
  const [emailNotif,  setEmailNotif]  = useState(true);
  const [smsNotif,    setSmsNotif]    = useState(false);
  const [pushNotif,   setPushNotif]   = useState(true);
  const [reminderLog, setReminderLog] = useState(true);

  // Appearance
  const [theme,    setTheme]    = useState<"light" | "dark" | "system">("light");
  const [accentColor, setAccentColor] = useState("#e94560");

  // Data
  const [autoBackup, setAutoBackup] = useState(false);

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-gray-900"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Settings
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage your preferences and account details.</p>
        </div>
        <button
          onClick={handleSave}
          className={"flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all " + (saved ? "bg-emerald-500 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white")}
        >
          <Save className="w-4 h-4" />
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="max-w-2xl space-y-5">
        {/* Profile */}
        <SettingsSection title="Profile" icon={User}>
          <Field label="Full Name">
            <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Role / Title">
            <input value={role} onChange={(e) => setRole(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Email">
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className={inputCls} />
          </Field>
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection title="Notifications" icon={Bell}>
          <Field label="Email Reminders" description="Receive reminders via email">
            <Toggle checked={emailNotif} onChange={setEmailNotif} />
          </Field>
          <Field label="SMS Reminders" description="Receive reminders via SMS">
            <Toggle checked={smsNotif} onChange={setSmsNotif} />
          </Field>
          <Field label="Push Notifications" description="In-app push reminders">
            <Toggle checked={pushNotif} onChange={setPushNotif} />
          </Field>
          <Field label="Notification Log" description="Keep a log of all sent notifications">
            <Toggle checked={reminderLog} onChange={setReminderLog} />
          </Field>
        </SettingsSection>

        {/* Appearance */}
        <SettingsSection title="Appearance" icon={Palette}>
          <Field label="Theme">
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as typeof theme)}
              className={inputCls}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </Field>
          <Field label="Accent Colour" description="Used in invitation cards and highlights">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer p-0.5"
              />
              <span className="text-xs text-gray-500 font-mono">{accentColor}</span>
            </div>
          </Field>
        </SettingsSection>

        {/* Data */}
        <SettingsSection title="Data & Storage" icon={Database}>
          <Field label="Auto Backup" description="Periodically export db.json to downloads">
            <Toggle checked={autoBackup} onChange={setAutoBackup} />
          </Field>
          <Field label="Export Data" description="Download a copy of your db.json">
            <button
              onClick={() => {
                const a = document.createElement("a");
                a.href = "http://localhost:3001/db";
                a.download = "eventcraft-backup.json";
                a.click();
              }}
              className="px-3 py-1.5 border border-gray-200 hover:border-gray-300 text-gray-700 text-sm rounded-lg transition-colors hover:bg-gray-50"
            >
              Export JSON
            </button>
          </Field>
        </SettingsSection>

        {/* App info */}
        <div className="text-center text-xs text-gray-400 pb-4 space-y-0.5">
          <p className="font-semibold text-gray-500">EventCraft v1.0.0</p>
          <p>Automated Invitation Card & Event Reminder System</p>
          <p>Research project — NOUN Faculty of Education</p>
        </div>
      </div>
    </div>
  );
}
