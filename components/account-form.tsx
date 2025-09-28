"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { CreditCard, Home, Car, PiggyBank, Shield, TrendingUp, Zap, Phone, Heart, DollarSign } from "lucide-react"

interface AccountFormProps {
  onSubmit: (account: any) => void
  onCancel: () => void
  initialData?: any
  selectedCategory?: string
}

const accountTypes = [
  { id: "checking", name: "Checking Account", category: "banking", icon: CreditCard, critical: true },
  { id: "savings", name: "Savings Account", category: "banking", icon: PiggyBank, critical: false },
  { id: "credit", name: "Credit Card", category: "credit", icon: CreditCard, critical: true },
  { id: "mortgage", name: "Mortgage", category: "credit", icon: Home, critical: true },
  { id: "auto-loan", name: "Auto Loan", category: "credit", icon: Car, critical: true },
  { id: "personal-loan", name: "Personal Loan", category: "credit", icon: DollarSign, critical: false },
  { id: "health-insurance", name: "Health Insurance", category: "insurance", icon: Heart, critical: true },
  { id: "auto-insurance", name: "Auto Insurance", category: "insurance", icon: Car, critical: true },
  { id: "life-insurance", name: "Life Insurance", category: "insurance", icon: Shield, critical: false },
  { id: "investment", name: "Investment Account", category: "investment", icon: TrendingUp, critical: false },
  { id: "retirement", name: "Retirement Account", category: "investment", icon: PiggyBank, critical: false },
  { id: "utilities", name: "Utility Account", category: "utilities", icon: Zap, critical: true },
  { id: "phone", name: "Phone/Internet", category: "utilities", icon: Phone, critical: true },
]

export function AccountForm({ onSubmit, onCancel, initialData, selectedCategory }: AccountFormProps) {
  const [formData, setFormData] = useState({
    accountName: initialData?.accountName || "",
    accountType: initialData?.accountType || "",
    institutionName: initialData?.institutionName || "",
    accountNumber: initialData?.accountNumber || "",
    username: initialData?.username || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    currentBalance: initialData?.currentBalance || "",
    creditLimit: initialData?.creditLimit || "",
    interestRate: initialData?.interestRate || "",
    priorityLevel: initialData?.priorityLevel || "3",
    isActive: initialData?.isActive ?? true,
    notes: initialData?.notes || "",
  })

  const selectedAccountType = accountTypes.find((type) => type.id === formData.accountType)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const getPriorityColor = (level: string) => {
    switch (level) {
      case "1":
        return "bg-destructive text-destructive-foreground"
      case "2":
        return "bg-secondary text-secondary-foreground"
      case "3":
        return "bg-muted text-muted-foreground"
      case "4":
        return "bg-accent text-accent-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getPriorityLabel = (level: string) => {
    switch (level) {
      case "1":
        return "Critical"
      case "2":
        return "Important"
      case "3":
        return "Normal"
      case "4":
        return "Low"
      default:
        return "Normal"
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {selectedAccountType && <selectedAccountType.icon className="h-5 w-5 text-primary" />}
          {initialData ? "Edit Account" : "Add New Account"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accountName">Account Name *</Label>
              <Input
                id="accountName"
                value={formData.accountName}
                onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                placeholder="e.g., Chase Checking"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountType">Account Type *</Label>
              <Select
                value={formData.accountType}
                onValueChange={(value) => setFormData({ ...formData, accountType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  {accountTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        {type.name}
                        {type.critical && (
                          <Badge variant="secondary" className="text-xs">
                            Critical
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="institutionName">Institution Name</Label>
              <Input
                id="institutionName"
                value={formData.institutionName}
                onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                placeholder="e.g., Chase Bank"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number (Last 4 digits)</Label>
              <Input
                id="accountNumber"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                placeholder="****1234"
                maxLength={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username/Login</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Your login username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="account@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentBalance">Current Balance</Label>
              <Input
                id="currentBalance"
                type="number"
                step="0.01"
                value={formData.currentBalance}
                onChange={(e) => setFormData({ ...formData, currentBalance: e.target.value })}
                placeholder="0.00"
              />
            </div>

            {(formData.accountType === "credit" ||
              formData.accountType === "mortgage" ||
              formData.accountType === "auto-loan") && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="creditLimit">Credit Limit / Loan Amount</Label>
                  <Input
                    id="creditLimit"
                    type="number"
                    step="0.01"
                    value={formData.creditLimit}
                    onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interestRate">Interest Rate (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.01"
                    value={formData.interestRate}
                    onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                    placeholder="4.25"
                  />
                </div>
              </>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Full address for this account"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priorityLevel">Priority Level</Label>
              <Select
                value={formData.priorityLevel}
                onValueChange={(value) => setFormData({ ...formData, priorityLevel: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor("1")}>Critical</Badge>
                      <span>Essential for daily functioning</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="2">
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor("2")}>Important</Badge>
                      <span>Important but not critical</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="3">
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor("3")}>Normal</Badge>
                      <span>Regular priority</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="4">
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor("4")}>Low</Badge>
                      <span>Low priority</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive">Account is active</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes about this account"
              rows={3}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1">
              {initialData ? "Update Account" : "Add Account"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
