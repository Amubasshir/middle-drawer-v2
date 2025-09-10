"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Bell, Mail, MessageSquare } from "lucide-react"

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailPassphrase: { enabled: false, frequency: "daily", passphrase: "" },
    appNotification: { enabled: true, frequency: "daily" },
    emailReminder: { enabled: true, frequency: "weekly" },
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
        {/* Email with Passphrase */}
        <div className="flex items-start justify-between p-4 border rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="w-3 h-3 bg-red-500 rounded-full mt-2"></div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <Label className="font-medium">Email with Secure Passphrase</Label>
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Least Secure</span>
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

        {/* App Notification */}
        <div className="flex items-start justify-between p-4 border rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mt-2"></div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <Label className="font-medium">Application Notification</Label>
              </div>
              <p className="text-sm text-muted-foreground">Click 'Yes' on push notifications from Middle Drawer app</p>
              {settings.appNotification.enabled && (
                <Select
                  value={settings.appNotification.frequency}
                  onValueChange={(value) => handleFrequencyChange("appNotification", value)}
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
            checked={settings.appNotification.enabled}
            onCheckedChange={(checked) => handleToggle("appNotification", checked)}
          />
        </div>

        {/* Email Reminder */}
        <div className="flex items-start justify-between p-4 border rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <Label className="font-medium">Email Reminder Confirmation</Label>
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

        {/* Text Message */}
        <div className="flex items-start justify-between p-4 border rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <Label className="font-medium">Automated Text Message</Label>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Most Secure</span>
              </div>
              <p className="text-sm text-muted-foreground">Respond 'Yes' to automated SMS verification</p>
              {settings.textMessage.enabled && (
                <div className="space-y-2">
                  <Input
                    placeholder="Phone number"
                    value={settings.textMessage.phone}
                    onChange={(e) => handleInputChange("textMessage", "phone", e.target.value)}
                    className="max-w-xs"
                  />
                  <Select
                    value={settings.textMessage.frequency}
                    onValueChange={(value) => handleFrequencyChange("textMessage", value)}
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
            checked={settings.textMessage.enabled}
            onCheckedChange={(checked) => handleToggle("textMessage", checked)}
          />
        </div>

        <div className="pt-4 border-t">
          <Button className="w-full">Save Notification Settings</Button>
        </div>
      </CardContent>
    </Card>
  )
}
