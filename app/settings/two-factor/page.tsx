"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Smartphone, MessageSquare, Mail, Phone, Key, Settings } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { StatusBar } from "@/components/status-bar"
import { useAuth } from "@/contexts/auth-context"

const TWO_FACTOR_METHODS = [
  {
    id: "app",
    label: "Authenticator App",
    icon: Smartphone,
    description: "Use an app like Google Authenticator or Authy",
  },
  { id: "sms", label: "Text Message", icon: MessageSquare, description: "Receive codes via SMS" },
  { id: "email", label: "Email", icon: Mail, description: "Receive codes via email" },
  { id: "voice", label: "Voice Call", icon: Phone, description: "Receive codes via automated voice call" },
  { id: "token", label: "Hardware Token", icon: Key, description: "Use a physical security key" },
  { id: "other", label: "Other", icon: Settings, description: "Custom 2FA method" },
]

export default function TwoFactorPage() {
  const { user } = useAuth()
  const [selectedMethods, setSelectedMethods] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadUserSettings()
  }, [])

  const loadUserSettings = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data: settings } = await supabase
          .from("user_settings")
          .select("two_factor_methods")
          .eq("user_id", user.id)
          .single()

        if (settings?.two_factor_methods) {
          setSelectedMethods(settings.two_factor_methods)
        }
      }
    } catch (error) {
      console.error("Error loading settings:", error)
    }
  }

  const handleMethodToggle = (methodId: string) => {
    setSelectedMethods((prev) => (prev.includes(methodId) ? prev.filter((id) => id !== methodId) : [...prev, methodId]))
  }

  const saveSettings = async () => {
    setIsLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { error } = await supabase.from("user_settings").upsert({
          user_id: user.id,
          two_factor_methods: selectedMethods,
          updated_at: new Date().toISOString(),
        })

        if (error) throw error
        alert("Settings saved successfully!")
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      alert("Error saving settings")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {user && <StatusBar />}

      <div className="container mx-auto p-6 max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/settings">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Settings
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Two-Factor Authentication Methods</CardTitle>
            <CardDescription>
              Select the methods you'd like to use for two-factor authentication when logging in
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {TWO_FACTOR_METHODS.map((method) => {
              const Icon = method.icon
              return (
                <div key={method.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                  <Checkbox
                    id={method.id}
                    checked={selectedMethods.includes(method.id)}
                    onCheckedChange={() => handleMethodToggle(method.id)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="h-4 w-4" />
                      <label htmlFor={method.id} className="font-medium cursor-pointer">
                        {method.label}
                      </label>
                    </div>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                </div>
              )
            })}

            <div className="pt-4">
              <Button onClick={saveSettings} disabled={isLoading} className="w-full">
                {isLoading ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
