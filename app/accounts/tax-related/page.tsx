"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { ArrowLeft, Receipt, Plus, Trash2, Shield, Mail } from "lucide-react"
import Link from "next/link"

export default function TaxRelatedPage() {
  const [showFreeTextInput, setShowFreeTextInput] = useState(false)
  const [freeText, setFreeText] = useState("")
  const [accounts, setAccounts] = useState([
    {
      id: 1,
      name: "H&R Block",
      username: "john.doe.hrblock",
      email: "john@email.com",
      institution: "H&R Block",
      twoFactorEnabled: true,
      associatedEmail: "john@email.com",
    },
  ])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/accounts">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Accounts
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <Receipt className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Tax-Related Accounts</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button onClick={() => setShowFreeTextInput(true)} className="mb-4">
            <Plus className="h-4 w-4 mr-2" />
            Add/Edit Tax Accounts with Text
          </Button>
        </div>

        <div className="grid gap-6">
          {accounts.map((account) => (
            <Card key={account.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{account.name}</span>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username">Username/Account ID</Label>
                    <Input id="username" value={account.username} />
                  </div>
                  <div>
                    <Label htmlFor="institution">Tax Service/Institution</Label>
                    <Input id="institution" value={account.institution} />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <Label htmlFor="2fa">2-Factor Authentication</Label>
                  </div>
                  <Switch id="2fa" checked={account.twoFactorEnabled} />
                </div>

                <div>
                  <Label htmlFor="associated-email">Associated Email</Label>
                  <div className="flex space-x-2">
                    <Mail className="h-4 w-4 mt-3" />
                    <Input id="associated-email" value={account.associatedEmail} />
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
              <h2 className="text-xl font-bold mb-4">Add/Edit Tax-Related Accounts</h2>
              <p className="text-muted-foreground mb-4">
                Describe your tax-related accounts in natural language. Our AI will parse and organize them for you.
              </p>
              <Textarea
                placeholder="Example: I use H&R Block for tax prep, have a Fidelity 401k account, and an HSA with HealthEquity..."
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                rows={6}
                className="mb-4"
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowFreeTextInput(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowFreeTextInput(false)}>Parse & Add Accounts</Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
