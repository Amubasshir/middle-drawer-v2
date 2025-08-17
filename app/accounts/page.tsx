"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AccountForm } from "@/components/account-form"
import { AccountList } from "@/components/account-list"
import { Plus, ArrowLeft, TrendingUp } from "lucide-react"
import Link from "next/link"

// Mock data for demonstration
const mockAccounts = [
  {
    id: "1",
    accountName: "Chase Checking",
    accountType: "checking",
    institutionName: "Chase Bank",
    accountNumber: "1234",
    username: "john.doe",
    email: "john@email.com",
    phone: "(555) 123-4567",
    currentBalance: 2450.0,
    priorityLevel: 1,
    isActive: true,
    notes: "Primary checking account for daily expenses",
  },
  {
    id: "2",
    accountName: "Mortgage - Wells Fargo",
    accountType: "mortgage",
    institutionName: "Wells Fargo",
    accountNumber: "5678",
    username: "john.doe.wf",
    email: "john@email.com",
    phone: "(555) 123-4567",
    currentBalance: -245000.0,
    creditLimit: 250000.0,
    priorityLevel: 1,
    isActive: true,
    notes: "30-year fixed mortgage",
  },
  {
    id: "3",
    accountName: "Emergency Savings",
    accountType: "savings",
    institutionName: "Ally Bank",
    accountNumber: "9012",
    username: "john.ally",
    email: "john@email.com",
    phone: "(555) 123-4567",
    currentBalance: 15000.0,
    priorityLevel: 2,
    isActive: true,
    notes: "6-month emergency fund",
  },
  {
    id: "4",
    accountName: "Capital One Venture",
    accountType: "credit",
    institutionName: "Capital One",
    accountNumber: "3456",
    username: "john.cap1",
    email: "john@email.com",
    phone: "(555) 123-4567",
    currentBalance: -1250.0,
    creditLimit: 10000.0,
    priorityLevel: 1,
    isActive: true,
    notes: "Travel rewards credit card",
  },
]

export default function AccountsPage() {
  const [accounts, setAccounts] = useState(mockAccounts)
  const [showForm, setShowForm] = useState(false)
  const [editingAccount, setEditingAccount] = useState<any>(null)
  const [viewingAccount, setViewingAccount] = useState<any>(null)

  const handleAddAccount = (accountData: any) => {
    const newAccount = {
      ...accountData,
      id: Date.now().toString(),
      currentBalance: Number.parseFloat(accountData.currentBalance) || 0,
      creditLimit: Number.parseFloat(accountData.creditLimit) || undefined,
      priorityLevel: Number.parseInt(accountData.priorityLevel),
    }
    setAccounts([...accounts, newAccount])
    setShowForm(false)
  }

  const handleEditAccount = (accountData: any) => {
    const updatedAccount = {
      ...accountData,
      currentBalance: Number.parseFloat(accountData.currentBalance) || 0,
      creditLimit: Number.parseFloat(accountData.creditLimit) || undefined,
      priorityLevel: Number.parseInt(accountData.priorityLevel),
    }
    setAccounts(
      accounts.map((acc) => (acc.id === editingAccount.id ? { ...updatedAccount, id: editingAccount.id } : acc)),
    )
    setEditingAccount(null)
  }

  const handleDeleteAccount = (accountId: string) => {
    if (confirm("Are you sure you want to delete this account?")) {
      setAccounts(accounts.filter((acc) => acc.id !== accountId))
    }
  }

  const handleViewDetails = (account: any) => {
    setViewingAccount(account)
  }

  if (viewingAccount) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={() => setViewingAccount(null)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Accounts
                </Button>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  <h1 className="text-xl font-bold">Account Details</h1>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">{viewingAccount.accountName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">Account Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Type:</span> {viewingAccount.accountType}
                    </div>
                    <div>
                      <span className="font-medium">Institution:</span> {viewingAccount.institutionName}
                    </div>
                    <div>
                      <span className="font-medium">Account Number:</span> ****{viewingAccount.accountNumber}
                    </div>
                    <div>
                      <span className="font-medium">Balance:</span> ${viewingAccount.currentBalance.toLocaleString()}
                    </div>
                    {viewingAccount.creditLimit && (
                      <div>
                        <span className="font-medium">Credit Limit:</span> $
                        {viewingAccount.creditLimit.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">Contact Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Username:</span> {viewingAccount.username}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {viewingAccount.email}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span> {viewingAccount.phone}
                    </div>
                  </div>
                </div>
              </div>

              {viewingAccount.notes && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">Notes</h3>
                  <p className="text-sm">{viewingAccount.notes}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => {
                    setEditingAccount(viewingAccount)
                    setViewingAccount(null)
                  }}
                  className="flex-1"
                >
                  Edit Account
                </Button>
                <Button variant="outline" onClick={() => setViewingAccount(null)} className="flex-1">
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (showForm || editingAccount) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowForm(false)
                    setEditingAccount(null)
                  }}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Accounts
                </Button>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  <h1 className="text-xl font-bold">{editingAccount ? "Edit Account" : "Add Account"}</h1>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <AccountForm
            onSubmit={editingAccount ? handleEditAccount : handleAddAccount}
            onCancel={() => {
              setShowForm(false)
              setEditingAccount(null)
            }}
            initialData={editingAccount}
          />
        </main>
      </div>
    )
  }

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
                <TrendingUp className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">Account Management</h1>
              </div>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Account
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Your Financial Accounts</h2>
          <p className="text-muted-foreground">
            Manage all your financial accounts, contact information, and account details in one place.
          </p>
        </div>

        <AccountList
          accounts={accounts}
          onEdit={setEditingAccount}
          onDelete={handleDeleteAccount}
          onViewDetails={handleViewDetails}
        />
      </main>
    </div>
  )
}
