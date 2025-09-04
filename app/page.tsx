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
  Bell,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { EncryptionSettings } from "@/components/encryption-settings"
import { DelegatesSection } from "@/components/delegates-section"
import { EmailSyncButton } from "@/components/email-sync-button"
import { SocialMediaSection } from "@/components/social-media-section"
import { InsuranceSection } from "@/components/insurance-section"
import { TaxSection } from "@/components/tax-section"
import { CollapsibleSection } from "@/components/collapsible-section"
import { WhichPointInfo } from "@/components/whichpoint-info"
import { GuidedSetup } from "@/components/guided-setup"
import { NotificationSettings } from "@/components/notification-settings"
import { SampleReport } from "@/components/sample-report"
import { AuthForms } from "@/components/auth-forms"

export default function AccountCredentialsDashboard() {
  const { user, logout, isLoading } = useAuth()
  const [showGuidedSetup, setShowGuidedSetup] = useState(false)
  const [showSampleReport, setShowSampleReport] = useState(false)
  const [showAuthForms, setShowAuthForms] = useState(false)

  const presetDays = 14 // This would come from user settings

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
    if (showAuthForms) {
      return <AuthForms />
    }

    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-6">
          <div className="text-center mb-8">
            <User className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Welcome to WhichPoint</h1>
            <p className="text-muted-foreground">Manage your accounts and payment schedules</p>
          </div>

          <div className="space-y-4">
            <Button
              className="w-full"
              size="lg"
              onClick={() => {
                // Set a temporary guest user to bypass authentication
                const guestUser = { name: "Guest User", email: "guest@whichpoint.com" }
                localStorage.setItem("whichpoint-guest", "true")
                window.location.reload()
              }}
            >
              Continue as Guest
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full bg-transparent"
              size="lg"
              onClick={() => setShowAuthForms(true)}
            >
              Sign In / Sign Up
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Guest mode lets you try WhichPoint without creating an account. Your data won't be saved.
          </p>
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
          </div>
        </div>
      </header>

      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-center mb-4 text-foreground">Why use WhichPoint?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-2">For Families</h3>
                <p className="text-sm text-muted-foreground">
                  Keep all accounts accessible when life changes occur - buying a car, starting school, or major
                  transitions
                </p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <Compass className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-2">For Travelers</h3>
                <p className="text-sm text-muted-foreground">
                  Stay protected when you might be unavailable or lose phone/internet access during trips
                </p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-2">For Retirement</h3>
                <p className="text-sm text-muted-foreground">
                  Manage accounts and passwords safely while ensuring protection from scams and fraud as you age
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mb-4">
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <CheckCircle className="h-4 w-4" />
              <span>
                Everything looks complete! If WhichPoint doesn't hear from you in {presetDays} days, your delegates will
                be contacted.
              </span>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <Button
              size="lg"
              onClick={() => setShowGuidedSetup(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-12 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Compass className="h-6 w-6 mr-3" />
              Walk me through it
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="font-bold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200 border-2 bg-transparent"
            >
              <div className="flex items-center">
                <span className="text-primary animate-pulse mr-2">((( </span>
                <Bell className="h-5 w-5 text-primary" />
                <span className="text-primary animate-pulse ml-2"> )))</span>
                <span className="ml-3">Inform Delegates Now</span>
              </div>
            </Button>
          </div>
        </div>
      </div>

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

          <CollapsibleSection title="Notification Settings" icon={Bell}>
            <NotificationSettings />
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

      <div className="mt-12 pt-8 border-t border-border">
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="lg"
            className="font-semibold py-4 px-8 shadow-md bg-transparent"
            onClick={() => setShowSampleReport(true)}
          >
            <FileText className="h-5 w-5 mr-2" />
            Preview Sample Report
          </Button>
        </div>
      </div>

      <GuidedSetup isOpen={showGuidedSetup} onClose={() => setShowGuidedSetup(false)} />
      <SampleReport isOpen={showSampleReport} onClose={() => setShowSampleReport(false)} />
    </div>
  )
}
