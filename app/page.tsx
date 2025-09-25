"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Plus,
  CreditCard,
  Home,
  Car,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  FileText,
  Shield,
  Users,
  Share2,
  LucideShield as FileShield,
  Receipt,
  Compass,
  Bell,
  ChevronDown,
  ChevronUp,
  Brain,
  Smartphone,
  Menu,
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
import { BrainTrackingOptions } from "@/components/brain-tracking-options"
import { WellnessCheckModal } from "@/components/wellness-check-modal"

export default function AccountCredentialsDashboard() {
  const { user, logout, setGuestMode, isLoading } = useAuth() // Added setGuestMode from useAuth
  const [showGuidedSetup, setShowGuidedSetup] = useState(false)
  const [showSampleReport, setShowSampleReport] = useState(false)
  const [showAuthForms, setShowAuthForms] = useState(false)
  const [showCognitiveWellness, setShowCognitiveWellness] = useState(false)
  const [showWellnessCheck, setShowWellnessCheck] = useState(false)

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
    console.log("[v0] No user found, showing auth screen")

    if (showAuthForms) {
      return <AuthForms />
    }

    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-6">
          <div className="text-center mb-8">
            <User className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to Middle Drawer</h1>
            <p className="text-lg text-muted-foreground">Manage your accounts and payment schedules</p>
          </div>

          <div className="space-y-4">
            <Button
              className="w-full text-lg py-6"
              size="lg"
              onClick={setGuestMode} // Use setGuestMode function instead of manual localStorage manipulation
            >
              Continue as Guest
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-sm uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full bg-transparent text-lg py-6"
              size="lg"
              onClick={() => setShowAuthForms(true)}
            >
              Sign In / Sign Up
            </Button>
          </div>

          <p className="text-sm text-muted-foreground text-center mt-6">
            Guest mode lets you try Middle Drawer without creating an account. Your data won't be saved.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {user && (
        <div className="bg-primary/10 border-b border-primary/20">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Status: Active</span>
                </div>
                <div className="text-muted-foreground">Last wellness check: 2 days ago</div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-muted-foreground">12 accounts monitored</div>
                <div className="text-muted-foreground">3 delegates configured</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-4">
            <div className="flex items-center space-x-2">
              <User className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-5xl font-bold text-foreground">Middle Drawer</h1>
                <p className="text-2xl font-medium text-primary/80 -mt-1 italic">So They Know</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1 bg-muted rounded-lg">
              <User className="h-4 w-4 text-primary" />
              <span className="text-xl font-medium text-foreground">{user?.name || "User"}</span>
              <Button variant="ghost" size="sm" onClick={logout} className="ml-2 h-6 px-2 text-xl">
                Logout
              </Button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2 lg:gap-4">
            <div className="lg:hidden">
              <Button
                variant="outline"
                size="lg"
                className="justify-start bg-card hover:bg-muted text-2xl py-6 px-8 w-full font-bold"
              >
                <Menu className="h-8 w-8 mr-3" />
                Menu
              </Button>
            </div>
            <div className="hidden lg:flex lg:flex-row lg:items-center lg:gap-4">
              <EmailSyncButton />
              <Button
                variant="outline"
                size="lg"
                className="justify-start bg-card hover:bg-muted text-2xl py-6 px-8 font-bold"
                asChild
              >
                <a href="/accounts">
                  <User className="h-8 w-8 mr-3" />
                  Accounts
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="justify-start bg-card hover:bg-muted text-2xl py-6 px-8 font-bold"
                asChild
              >
                <a href="/delegates">
                  <Users className="h-8 w-8 mr-3" />
                  Trusted Delegates
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="justify-start bg-card hover:bg-muted text-2xl py-6 px-8 font-bold"
                asChild
              >
                <a href="/settings">
                  <Shield className="h-8 w-8 mr-3" />
                  Settings
                </a>
              </Button>
              <Button size="lg" className="justify-start text-2xl py-6 px-8 font-bold">
                <Plus className="h-8 w-8 mr-3" />
                Add Account
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="border-b border-border bg-green-50">
        <div className="container mx-auto px-4 py-4">
          <div className="mb-8">
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={() => setShowGuidedSetup(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-12 py-8 text-3xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Compass className="h-8 w-8 mr-3" />
                Walk me through it
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <h2 className="text-4xl font-semibold text-center text-foreground">Why use Middle Drawer?</h2>
              <WhichPointInfo />
            </div>
            <p className="text-center text-muted-foreground mb-6 max-w-3xl mx-auto text-2xl leading-relaxed">
              Middle Drawer is the first brain health-centric financial and account platform, developed with
              consideration for how everyone can benefit. It acts as your independent safety net, ensuring your accounts
              and digital footprint remain secure and accessible while monitoring cognitive wellness. It organizes your
              credentials, tracks payment schedules, and connects trusted delegates who can help when you need it most.
            </p>

            <div className="mb-8">
              <div className="flex flex-wrap justify-center items-center gap-4 max-w-4xl mx-auto">
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-lg font-medium shadow-sm">
                  💰 Money & Accounts
                </div>
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-lg font-medium shadow-sm">
                  📅 Appointments
                </div>
                <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-lg font-medium shadow-sm">
                  📝 Notes & Documents
                </div>
                <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-lg font-medium shadow-sm">
                  🚗 Transportation
                </div>
                <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-lg font-medium shadow-sm">
                  🏠 Housing & Utilities
                </div>
                <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-lg font-medium shadow-sm">
                  🛡️ Insurance
                </div>
                <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-lg font-medium shadow-sm">
                  📱 Subscriptions
                </div>
                <div className="bg-pink-100 text-pink-800 px-4 py-2 rounded-full text-lg font-medium shadow-sm">
                  👥 Professional Contacts
                </div>
                <div className="bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-lg font-medium shadow-sm">
                  🧠 Cognitive Wellness Tracking
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-muted/30 rounded-lg">
                <Users className="h-12 w-12 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-3 text-2xl">For Families</h3>
                <p className="text-xl text-muted-foreground">
                  Keep all accounts accessible when life changes occur - buying a car, starting school, or major
                  transitions
                </p>
              </div>
              <div className="text-center p-6 bg-muted/30 rounded-lg">
                <Compass className="h-12 w-12 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-3 text-2xl">For Travelers</h3>
                <p className="text-xl text-muted-foreground">
                  Stay protected when you might be unavailable or lose phone/internet access during trips
                </p>
              </div>
              <div className="text-center p-6 bg-muted/30 rounded-lg">
                <Shield className="h-12 w-12 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-3 text-2xl">For Retirement</h3>
                <p className="text-xl text-muted-foreground">
                  Manage accounts and passwords safely while ensuring protection from scams and fraud as you age
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border-2 border-primary/20 rounded-lg p-8 max-w-2xl mx-auto shadow-lg">
            <div className="flex flex-col space-y-6">
              <div className="flex justify-center space-x-4">
                <Button
                  size="lg"
                  variant="ghost"
                  className="font-bold px-8 py-8 text-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-muted flex-1"
                >
                  <div className="flex items-center justify-center">
                    <span className="text-primary animate-pulse mr-2">((( </span>
                    <Bell className="h-6 w-6 text-primary" />
                    <span className="text-primary animate-pulse ml-2"> )))</span>
                    <span className="ml-3">Inform Delegates Now</span>
                  </div>
                </Button>

                <Button
                  size="lg"
                  variant="ghost"
                  onClick={() => setShowWellnessCheck(true)}
                  className="font-bold px-6 py-8 text-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-muted flex-1"
                >
                  <Clock className="h-6 w-6 mr-2" />
                  Preview Wellness Check
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="space-y-4">
            {/* Accounts Tab */}
            <div className="w-full">
              <CollapsibleSection title="Accounts" icon={CreditCard} defaultOpen>
                <div className="space-y-4">
                  {/* Added account types section at the top */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-semibold mb-4 text-foreground">Account Types</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Link href="/accounts/bank-accounts">
                        <div className="bg-muted/30 p-4 rounded-lg text-center hover:bg-muted/50 transition-colors cursor-pointer">
                          <CreditCard className="h-8 w-8 text-primary mx-auto mb-2" />
                          <p className="text-lg font-medium">Bank Accounts</p>
                          <p className="text-sm text-muted-foreground">Checking, savings, credit cards</p>
                        </div>
                      </Link>
                      <Link href="/accounts/insurance">
                        <div className="bg-muted/30 p-4 rounded-lg text-center hover:bg-muted/50 transition-colors cursor-pointer">
                          <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                          <p className="text-lg font-medium">Insurance</p>
                          <p className="text-sm text-muted-foreground">Health, auto, home, life</p>
                        </div>
                      </Link>
                      <Link href="/accounts/tax-related">
                        <div className="bg-muted/30 p-4 rounded-lg text-center hover:bg-muted/50 transition-colors cursor-pointer">
                          <Receipt className="h-8 w-8 text-primary mx-auto mb-2" />
                          <p className="text-lg font-medium">Tax-Related</p>
                          <p className="text-sm text-muted-foreground">Tax prep, retirement, HSA</p>
                        </div>
                      </Link>
                      <Link href="/accounts/housing-utilities">
                        <div className="bg-muted/30 p-4 rounded-lg text-center hover:bg-muted/50 transition-colors cursor-pointer">
                          <Home className="h-8 w-8 text-primary mx-auto mb-2" />
                          <p className="text-lg font-medium">Housing & Utilities</p>
                          <p className="text-sm text-muted-foreground">Mortgage, electricity, internet</p>
                        </div>
                      </Link>
                      <Link href="/accounts/transportation">
                        <div className="bg-muted/30 p-4 rounded-lg text-center hover:bg-muted/50 transition-colors cursor-pointer">
                          <Car className="h-8 w-8 text-primary mx-auto mb-2" />
                          <p className="text-lg font-medium">Transportation</p>
                          <p className="text-sm text-muted-foreground">Car payments, gas cards</p>
                        </div>
                      </Link>
                      <Link href="/accounts/subscriptions">
                        <div className="bg-muted/30 p-4 rounded-lg text-center hover:bg-muted/50 transition-colors cursor-pointer">
                          <Smartphone className="h-8 w-8 text-primary mx-auto mb-2" />
                          <p className="text-lg font-medium">Subscriptions</p>
                          <p className="text-sm text-muted-foreground">Phone, streaming, software</p>
                        </div>
                      </Link>
                      <Link href="/accounts/professionals">
                        <div className="bg-muted/30 p-4 rounded-lg text-center hover:bg-muted/50 transition-colors cursor-pointer">
                          <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                          <p className="text-lg font-medium">Professionals</p>
                          <p className="text-sm text-muted-foreground">Doctors, lawyers, advisors</p>
                        </div>
                      </Link>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium text-muted-foreground">Total Accounts</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold text-primary">12</div>
                        <p className="text-base text-muted-foreground">Active accounts tracked</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium text-muted-foreground">Payments Due Soon</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold text-secondary">3</div>
                        <p className="text-base text-muted-foreground">Next 7 days</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium text-muted-foreground">Critical Accounts</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold text-foreground">5</div>
                        <p className="text-base text-muted-foreground">Essential for daily life</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                                  <h3 className="font-medium text-foreground text-lg">{account.name}</h3>
                                  <p className="text-base text-muted-foreground">{account.type}</p>
                                  <p className="text-sm text-muted-foreground">@{account.username}</p>
                                </div>
                              </div>

                              <div className="text-right">
                                <div className="flex items-center space-x-2">
                                  <Badge className={getStatusColor(account.status)}>
                                    <StatusIcon className="h-3 w-3 mr-1" />
                                    {account.status}
                                  </Badge>
                                </div>
                                <p className="text-base font-medium mt-1 text-foreground">{account.institution}</p>
                                <p className="text-sm text-muted-foreground mt-1">{account.email}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              </CollapsibleSection>
            </div>

            {/* Delegates Tab */}
            <div className="w-full">
              <CollapsibleSection title="Trusted Delegates" icon={Users}>
                <div className="space-y-4">
                  <DelegatesSection />

                  <div className="space-y-2">
                    <p className="text-xl font-medium">Emergency Contacts</p>
                    {contactSettings.emergencyContacts.map((contact, index) => (
                      <div key={index} className="flex justify-between items-center text-xl p-2 bg-muted/50 rounded">
                        <span>
                          {contact.name} ({contact.relationship})
                        </span>
                        <Badge variant="outline">{contact.daysToContact} days</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CollapsibleSection>
            </div>

            {/* Settings Tab */}
            <div className="w-full">
              <CollapsibleSection title="Settings" icon={Shield}>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Contact Settings</h3>
                    <div className="grid grid-cols-2 gap-4 text-xl">
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
                    <Button variant="outline" className="w-full bg-transparent text-xl py-4" asChild>
                      <a href="/settings">Manage Contact Settings</a>
                    </Button>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-xl font-semibold mb-4">Notification Settings</h3>
                    <NotificationSettings />
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-xl font-semibold mb-4">Encryption Settings</h3>
                    <EncryptionSettings />
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-xl font-semibold mb-4">Additional Sections</h3>
                    <div className="space-y-4">
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
                  </div>
                </div>
              </CollapsibleSection>
            </div>
          </div>
        </div>

        <div className="border-t border-border bg-card/30 mt-12">
          <div className="container mx-auto px-4 py-6">
            <Button
              variant="ghost"
              onClick={() => setShowCognitiveWellness(!showCognitiveWellness)}
              className="w-full justify-between text-xl font-semibold py-8 hover:bg-muted/50"
            >
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-primary" />
                <span>Cognitive Wellness Tracking</span>
              </div>
              {showCognitiveWellness ? <ChevronUp className="h-8 w-8" /> : <ChevronDown className="h-8 w-8" />}
            </Button>

            {showCognitiveWellness && (
              <div className="mt-4 pb-2">
                <BrainTrackingOptions />
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="lg"
              className="font-semibold py-8 px-10 shadow-md bg-transparent text-2xl"
              onClick={() => setShowSampleReport(true)}
            >
              <FileText className="h-6 w-6 mr-2" />
              Preview Sample Report
            </Button>
          </div>
        </div>
      </main>

      <GuidedSetup isOpen={showGuidedSetup} onClose={() => setShowGuidedSetup(false)} />
      <SampleReport isOpen={showSampleReport} onClose={() => setShowSampleReport(false)} />
      <WellnessCheckModal isOpen={showWellnessCheck} onClose={() => setShowWellnessCheck(false)} />
    </div>
  )
}
