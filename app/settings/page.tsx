"use client"

import { ContactSettings } from "@/components/contact-settings"
import { DeleteAccountModal } from "@/components/delete-account-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { ArrowLeft, Settings, AlertTriangle, Shield, Smartphone } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Settings className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">Settings</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-2">Configure your Middle Drawer preferences and contact settings</p>
          </div>

          <ContactSettings />

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage your two-factor authentication methods and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href="/settings/two-factor">
                    <Smartphone className="h-4 w-4 mr-2" />
                    Manage 2FA Methods
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 pt-8 border-t border-destructive/20">
            <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <AlertTriangle className="h-6 w-6 text-destructive mt-1" />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-destructive mb-2">Danger Zone</h3>
                  <p className="text-muted-foreground mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button variant="destructive" onClick={() => setShowDeleteModal(true)} className="font-semibold">
                    Please Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteAccountModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} />
    </div>
  )
}
