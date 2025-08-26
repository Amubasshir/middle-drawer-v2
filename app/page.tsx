"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import {
  Plus,
  CreditCard,
  Home,
  Car,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Calendar,
  FileText,
  Shield,
  Users,
  Share2,
  LucideShield as FileShield,
  Receipt,
  Compass,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { AlertNowButton } from "@/components/alert-now-button"
import { EncryptionSettings } from "@/components/encryption-settings"
import { DelegatesSection } from "@/components/delegates-section"
import { EmailSyncButton } from "@/components/email-sync-button"
import { SocialMediaSection } from "@/components/social-media-section"
import { InsuranceSection } from "@/components/insurance-section"
import { TaxSection } from "@/components/tax-section"
import { CollapsibleSection } from "@/components/collapsible-section"
import { WhichPointInfo } from "@/components/whichpoint-info"
import { GuidedSetup } from "@/components/guided-setup"

export default function AccountCredentialsDashboard() {
  const { user, logout, isLoading } = useAuth()
  const [showGuidedSetup, setShowGuidedSetup] = useState(false)

  useEffect(() => {
    const savedMode = localStorage.getItem("whichpoint-mode")
    if (savedMode) {
      // setShowAdvancedMode(savedMode === "advanced")
    }
  }, [])

  const criticalAccounts = [
    {
      id: 1,
      name: "Chase Checking",
      type: "Bank Account",
      username: "john.doe.chase",
      email: "john@email.com",
      institution: "Chase Bank",
      status: "active",
      icon: CreditCard,
    },
    {
      id: 2,
      name: "Mortgage - Wells Fargo",
      type: "Mortgage/Rent",
      username: "john.doe.wf",
      email: "john@email.com",
      institution: "Wells Fargo",
      status: "active",
      icon: Home,
    },
    {
      id: 3,
      name: "Auto Insurance",
      type: "Insurance",
      username: "john.doe.geico",
      email: "john@email.com",
      institution: "GEICO",
      status: "active",
      icon: Car,
    },
  ]

  const upcomingPayments = [
    {
      id: 1,
      accountName: "Electric Bill",
      paymentName: "Monthly Electric",
      timing: "Around the 10th",
      frequency: "Monthly",
      status: "upcoming",
      autoPay: false,
    },
    {
      id: 2,
      accountName: "Chase Credit Card",
      paymentName: "Credit Card Payment",
      timing: "15th of each month",
      frequency: "Monthly",
      status: "upcoming",
      autoPay: true,
    },
    {
      id: 3,
      accountName: "Health Insurance",
      paymentName: "Premium Payment",
      timing: "1st of each month",
      frequency: "Monthly",
      status: "overdue",
      autoPay: false,
    },
  ]

  const contactSettings = {
    reminderFrequency: "weekly",
    reminderMethod: "both",
    userEmail: "john@email.com",
    userPhone: "(555) 123-4567",
    emergencyContacts: [
      { name: "Sarah Doe", relationship: "spouse", daysToContact: 3 },
      { name: "Mike Johnson", relationship: "family", daysToContact: 14 },
    ],
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "current":
        return "bg-primary text-primary-foreground"
      case "upcoming":
        return "bg-secondary text-secondary-foreground"
      case "overdue":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
      case "current":
        return CheckCircle
      case "upcoming":
        return Clock
      case "overdue":
        return AlertCircle
      default:
        return Clock
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Please log in to continue.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <User className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">WhichPoint</h1>
              <WhichPointInfo />
            </div>
            <div className="flex items-center space-x-2 px-3 py-1 bg-muted rounded-lg">
              <User className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{user?.name || "User"}</span>
              <Button variant="ghost" size="sm" onClick={logout} className="ml-2 h-6 px-2">
                Logout
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <EmailSyncButton />
              <Button variant="outline" size="sm" asChild>
                <a href="/accounts">
                  <User className="h-4 w-4 mr-2" />
                  Manage Accounts
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/schedules">
                  <Calendar className="h-4 w-4 mr-2" />
                  Payment Schedules
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/notes">
                  <FileText className="h-4 w-4 mr-2" />
                  Personal Notes
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/settings">Settings</a>
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Account
              </Button>
            </div>

            <Button
              size="lg"
              onClick={() => setShowGuidedSetup(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6"
            >
              <Compass className="h-5 w-5 mr-2" />
              Walk me through it
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">12</div>
              <p className="text-xs text-muted-foreground">Active accounts tracked</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Payments Due Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">3</div>
              <p className="text-xs text-muted-foreground">Next 7 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Critical Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">5</div>
              <p className="text-xs text-muted-foreground">Essential for daily life</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8 flex justify-center">
          <AlertNowButton />
        </div>

        <div className="space-y-4 mb-8">
          <CollapsibleSection title="Contact Settings" icon={User}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Reminders</p>
                  <p className="font-medium capitalize">{contactSettings.reminderFrequency}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Method</p>
                  <p className="font-medium capitalize">{contactSettings.reminderMethod}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{contactSettings.userEmail}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium">{contactSettings.userPhone}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Emergency Contacts</p>
                {contactSettings.emergencyContacts.map((contact, index) => (
                  <div key={index} className="flex justify-between items-center text-sm p-2 bg-muted/50 rounded">
                    <span>
                      {contact.name} ({contact.relationship})
                    </span>
                    <Badge variant="outline">{contact.daysToContact} days</Badge>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full bg-transparent" asChild>
                <a href="/settings">Manage Contact Settings</a>
              </Button>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Encryption Settings" icon={Shield}>
            <EncryptionSettings />
          </CollapsibleSection>

          <CollapsibleSection title="Delegates" icon={Users}>
            <DelegatesSection />
          </CollapsibleSection>

          <CollapsibleSection title="Social Media Accounts" icon={Share2}>
            <SocialMediaSection />
          </CollapsibleSection>

          <CollapsibleSection title="Insurance Policies" icon={FileShield}>
            <InsuranceSection />
          </CollapsibleSection>

          <CollapsibleSection title="Tax Information" icon={Receipt}>
            <TaxSection />
          </CollapsibleSection>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Your Accounts & Credentials</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {criticalAccounts.map((account) => {
                const IconComponent = account.icon
                const StatusIcon = getStatusIcon(account.status)

                return (
                  <Card key={account.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-muted rounded-lg">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground">{account.name}</h3>
                            <p className="text-sm text-muted-foreground">{account.type}</p>
                            <p className="text-xs text-muted-foreground">@{account.username}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(account.status)}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {account.status}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium mt-1 text-foreground">{account.institution}</p>
                          <p className="text-xs text-muted-foreground mt-1">{account.email}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Payment Schedules</h2>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Schedule
              </Button>
            </div>

            <div className="space-y-4">
              {upcomingPayments.map((payment) => {
                const StatusIcon = getStatusIcon(payment.status)

                return (
                  <Card key={payment.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-foreground">{payment.accountName}</h3>
                          <p className="text-sm text-muted-foreground">{payment.paymentName}</p>
                          {payment.autoPay && (
                            <Badge variant="outline" className="text-xs mt-1">
                              Auto-pay
                            </Badge>
                          )}
                        </div>

                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge className={getStatusColor(payment.status)}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {payment.status}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-foreground">{payment.timing}</p>
                          <p className="text-xs text-muted-foreground">{payment.frequency}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </main>

      <GuidedSetup isOpen={showGuidedSetup} onClose={() => setShowGuidedSetup(false)} />
    </div>
  )
}
