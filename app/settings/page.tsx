import { AccountSettings } from "@/components/settings/account-settings"

export default function SettingsPage() {
  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-foreground">Account settings</h2>
      <AccountSettings />
    </div>
  )
}
