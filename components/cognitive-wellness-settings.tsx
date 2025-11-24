"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Brain, Clock } from "lucide-react"

export function CognitiveWellnessSettings() {
  const [settings, setSettings] = useState({
    enabled: true,
    checkType: "memory",
    frequency: "daily",
    reminderTime: "09:00",
    difficulty: "medium",
    trackingGoals: true,
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    console.log("[v0] Saving cognitive wellness settings:", settings)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Cognitive Wellness Settings
        </CardTitle>
        <CardDescription>Configure your cognitive wellness tracking preferences and check types</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable/Disable Tracking */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="font-medium">Enable Cognitive Wellness Tracking</Label>
            <p className="text-sm text-muted-foreground">Turn on regular cognitive wellness checks and monitoring</p>
          </div>
          <Switch checked={settings.enabled} onCheckedChange={(checked) => handleSettingChange("enabled", checked)} />
        </div>

        {settings.enabled && (
          <>
            {/* Check Type Selection */}
            <div className="space-y-2">
              <Label className="font-medium">Type of Cognitive Check</Label>
              <Select value={settings.checkType} onValueChange={(value) => handleSettingChange("checkType", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="memory">Memory & Recall Tests</SelectItem>
                  <SelectItem value="attention">Attention & Focus Tests</SelectItem>
                  <SelectItem value="processing">Processing Speed Tests</SelectItem>
                  <SelectItem value="mixed">Mixed Cognitive Tests</SelectItem>
                  <SelectItem value="custom">Custom Test Battery</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Choose the type of cognitive assessments you'd like to perform regularly
              </p>
            </div>

            {/* Frequency */}
            <div className="space-y-2">
              <Label className="font-medium">Check Frequency</Label>
              <Select value={settings.frequency} onValueChange={(value) => handleSettingChange("frequency", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reminder Time */}
            <div className="space-y-2">
              <Label className="font-medium">Preferred Reminder Time</Label>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="time"
                  value={settings.reminderTime}
                  onChange={(e) => handleSettingChange("reminderTime", e.target.value)}
                  className="max-w-xs"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                When would you like to receive reminders for cognitive wellness checks?
              </p>
            </div>

            {/* Difficulty Level */}
            <div className="space-y-2">
              <Label className="font-medium">Difficulty Level</Label>
              <Select value={settings.difficulty} onValueChange={(value) => handleSettingChange("difficulty", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                  <SelectItem value="adaptive">Adaptive (Adjusts to Performance)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tracking Goals */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="font-medium">Enable Progress Tracking</Label>
                <p className="text-sm text-muted-foreground">
                  Track your cognitive wellness progress over time and set improvement goals
                </p>
              </div>
              <Switch
                checked={settings.trackingGoals}
                onCheckedChange={(checked) => handleSettingChange("trackingGoals", checked)}
              />
            </div>
          </>
        )}

        <div className="pt-4 border-t">
          <Button onClick={handleSave} className="w-full">
            Save Cognitive Wellness Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
