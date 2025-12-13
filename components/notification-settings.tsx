"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Bell, Mail, MessageSquare } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function NotificationSettings() {
  const {profiles} = useAuth();
  const [settings, setSettings] = useState({
    emailPassphrase: { enabled: false, frequency: "daily", passphrase: "" },
    emailReminder: { enabled: true, frequency: "weekly" },
    appNotification: { enabled: false, frequency: "daily" }, // Disabled by default since it's coming soon
    textMessage: { enabled: false, frequency: "daily", phone: "" },
  })

  const handleToggle = (method: string, enabled: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [method]: { ...prev[method as keyof typeof prev], enabled },
    }))
  }

  const handleFrequencyChange = (method: string, frequency: string) => {
    setSettings((prev) => ({
      ...prev,
      [method]: { ...prev[method as keyof typeof prev], frequency },
    }))
  }

  const handleInputChange = (method: string, field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [method]: { ...prev[method as keyof typeof prev], [field]: value },
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Notification Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email with Passphrase - Available */}
        <div className="flex items-start justify-between p-4 border rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <Label className="font-medium">Email with Secure Passphrase</Label>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Available</span>
              </div>
              <p className="text-sm text-muted-foreground">Respond to email with your unique passphrase</p>
              {settings.emailPassphrase.enabled && (
                <div className="space-y-2">
                  <Input
                    placeholder="Enter secure passphrase"
                    value={settings.emailPassphrase.passphrase}
                    onChange={(e) => handleInputChange("emailPassphrase", "passphrase", e.target.value)}
                    className="max-w-xs"
                  />
                  <Select
                    value={settings.emailPassphrase.frequency}
                    onValueChange={(value) => handleFrequencyChange("emailPassphrase", value)}
                  >
                    <SelectTrigger className="max-w-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
          <Switch
            checked={settings.emailPassphrase.enabled}
            onCheckedChange={(checked) => handleToggle("emailPassphrase", checked)}
          />
        </div>

        {/* Email Reminder - Available */}
        <div className="flex items-start justify-between p-4 border rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <Label className="font-medium">Email Reminder Confirmation</Label>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Available</span>
              </div>
              <p className="text-sm text-muted-foreground">Click 'Yes' link in scheduled email reminders</p>
              {settings.emailReminder.enabled && (
                <Select
                  value={settings.emailReminder.frequency}
                  onValueChange={(value) => handleFrequencyChange("emailReminder", value)}
                >
                  <SelectTrigger className="max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
          <Switch
            checked={settings.emailReminder.enabled}
            onCheckedChange={(checked) => handleToggle("emailReminder", checked)}
          />
        </div>

        {/* App Notification - Coming Soon */}
        <div className="flex items-start justify-between p-4 border rounded-lg opacity-50">
          <div className="flex items-start space-x-3">
            <div className="w-3 h-3 bg-gray-400 rounded-full mt-2"></div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <Label className="font-medium text-muted-foreground">Application Notification</Label>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Coming Soon</span>
              </div>
              <p className="text-sm text-muted-foreground">Click 'Yes' on push notifications from Middle Drawer app</p>
            </div>
          </div>
          <Switch checked={false} disabled />
        </div>

        {/* Text Message - Coming Soon */}
        <div className="flex items-start justify-between p-4 border rounded-lg opacity-50">
          <div className="flex items-start space-x-3">
            <div className="w-3 h-3 bg-gray-400 rounded-full mt-2"></div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <Label className="font-medium text-muted-foreground">Automated Text Messages</Label>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Coming Soon</span>
              </div>
              <p className="text-sm text-muted-foreground">Respond 'Yes' to automated SMS verification</p>
            </div>
          </div>
          <Switch checked={false} disabled />
        </div>

        <div className="pt-4 border-t">
          <Button className="w-full">Save Notification Settings</Button>
        </div>
      </CardContent>
    </Card>
  )
}
