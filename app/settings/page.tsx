import { ContactSettings } from "@/components/contact-settings"

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Configure your WhichPoint preferences and contact settings</p>
        </div>

        <ContactSettings />
      </div>
    </div>
  )
}
