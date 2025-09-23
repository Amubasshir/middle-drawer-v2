"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { ArrowLeft, CreditCard, Plus, Trash2, Shield, Mail, Calendar, Smartphone } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function BankAccountsPage() {
  const [showFreeTextInput, setShowFreeTextInput] = useState(false)
  const [freeText, setFreeText] = useState("")
  const [accounts, setAccounts] = useState([
    {
      id: 1,
      name: "Chase Checking",
      username: "john.doe.chase",
      email: "john@email.com",
      institution: "Chase Bank",
      twoFactorEnabled: true,
      twoFactorMethod: "app",
      associatedEmail: "john@email.com",
      paymentFrequency: "monthly",
    },
  ])

  const supabase = createClient()

  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data: accountsData } = await supabase
          .from("accounts")
          .select("*")
          .eq("user_id", user.id)
          .eq("account_type", "bank")

        if (accountsData) {
          setAccounts(
            accountsData.map((account) => ({
              id: account.id,
              name: account.account_name,
              username: account.account_details?.username || "",
              email: account.associated_email || "",
              institution: account.account_details?.institution || "",
              twoFactorEnabled: !!account.two_factor_method,
              twoFactorMethod: account.two_factor_method || "app",
              associatedEmail: account.associated_email || "",
              paymentFrequency: account.payment_frequency || "monthly",
            })),
          )
        }
      }
    } catch (error) {
      console.error("Error loading accounts:", error)
    }
  }

  const updateAccount = async (accountId: string, field: string, value: any) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const updateData: any = {}

        if (field === "paymentFrequency") {
          updateData.payment_frequency = value
        } else if (field === "twoFactorMethod") {
          updateData.two_factor_method = value
        } else if (field === "associatedEmail") {
          updateData.associated_email = value
        }

        await supabase.from("accounts").update(updateData).eq("id", accountId).eq("user_id", user.id)

        // Update local state
        setAccounts((prev) =>
          prev.map((account) => (account.id === accountId ? { ...account, [field]: value } : account)),
        )
      }
    } catch (error) {
      console.error("Error updating account:", error)
    }
  }

  const deleteAccount = async (accountId: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        await supabase.from("accounts").delete().eq("id", accountId).eq("user_id", user.id)

        setAccounts((prev) => prev.filter((account) => account.id !== accountId))
      }
    } catch (error) {
      console.error("Error deleting account:", error)
    }
  }

  const handleFreeTextSubmit = async () => {
    // This would integrate with OpenAI API to parse the free text
    console.log("Parsing free text:", freeText)
    // For now, just close the modal
    setShowFreeTextInput(false)
    setFreeText("")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <CreditCard className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Bank Accounts</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button onClick={() => setShowFreeTextInput(true)} className="mb-4">
            <Plus className="h-4 w-4 mr-2" />
            Add/Edit Accounts with Text
          </Button>
        </div>

        <div className="grid gap-6">
          {accounts.map((account) => (
            <Card key={account.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{account.name}</span>
                  <Button variant="destructive" size="sm" onClick={() => deleteAccount(account.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={account.username}
                      onChange={(e) => updateAccount(account.id, "username", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="institution">Institution</Label>
                    <Input
                      id="institution"
                      value={account.institution}
                      onChange={(e) => updateAccount(account.id, "institution", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="payment-frequency">Payment Frequency</Label>
                    <Select
                      value={account.paymentFrequency}
                      onValueChange={(value) => updateAccount(account.id, "paymentFrequency", value)}
                    >
                      <SelectTrigger>
                        <Calendar className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                        <SelectItem value="one-time">One-time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="2fa-method">2FA Method</Label>
                    <Select
                      value={account.twoFactorMethod}
                      onValueChange={(value) => updateAccount(account.id, "twoFactorMethod", value)}
                    >
                      <SelectTrigger>
                        <Smartphone className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Select 2FA method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="app">Authenticator App</SelectItem>
                        <SelectItem value="sms">Text Message</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="voice">Voice Call</SelectItem>
                        <SelectItem value="token">Hardware Token</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <Label htmlFor="2fa">2-Factor Authentication</Label>
                  </div>
                  <Switch
                    id="2fa"
                    checked={account.twoFactorEnabled}
                    onCheckedChange={(checked) => updateAccount(account.id, "twoFactorEnabled", checked)}
                  />
                </div>

                <div>
                  <Label htmlFor="associated-email">Associated Email</Label>
                  <div className="flex space-x-2">
                    <Mail className="h-4 w-4 mt-3" />
                    <Input
                      id="associated-email"
                      value={account.associatedEmail}
                      onChange={(e) => updateAccount(account.id, "associatedEmail", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Free Text Input Modal */}
        {showFreeTextInput && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card p-6 rounded-lg max-w-2xl w-full mx-4">
              <h2 className="text-xl font-bold mb-4">Add/Edit Bank Accounts</h2>
              <p className="text-muted-foreground mb-4">
                Describe your bank accounts in natural language. Our AI will parse and organize them for you.
              </p>
              <Textarea
                placeholder="Example: I have a Chase checking account with username john.doe, a Wells Fargo savings account, and a Capital One credit card..."
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                rows={6}
                className="mb-4"
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowFreeTextInput(false)}>
                  Cancel
                </Button>
                <Button onClick={handleFreeTextSubmit}>Parse & Add Accounts</Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
