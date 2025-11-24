"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { CreditCard, Home, Car, Shield, Zap, Phone, Play, Activity, TrendingUp, FileText, Heart } from "lucide-react"

interface AccountFormProps {
  onSubmit: (account: any) => void
  onCancel: () => void
  initialData?: any
}

const accountTypes = [
  { id: "bank", name: "Bank Account", icon: CreditCard, critical: true },
  { id: "credit", name: "Credit Card", icon: CreditCard, critical: true },
  { id: "mortgage", name: "Mortgage/Rent", icon: Home, critical: true },
  { id: "auto-loan", name: "Auto Loan", icon: Car, critical: true },
  { id: "insurance", name: "Insurance", icon: Shield, critical: true },
  { id: "utilities", name: "Utilities", icon: Zap, critical: true },
  { id: "phone", name: "Phone/Internet", icon: Phone, critical: true },
  { id: "streaming", name: "Streaming Service", icon: Play, critical: false },
  { id: "gym", name: "Gym/Fitness", icon: Activity, critical: false },
  { id: "investment", name: "Investment Account", icon: TrendingUp, critical: false },
  { id: "government", name: "Government/Tax", icon: FileText, critical: true },
  { id: "healthcare", name: "Medical/Healthcare", icon: Heart, critical: false },
]

export function AccountCredentialsForm({ onSubmit, onCancel, initialData }: AccountFormProps) {
  const [formData, setFormData] = useState({
    accountName: initialData?.accountName || "",
    accountType: initialData?.accountType || "",
    institutionName: initialData?.institutionName || "",
    username: initialData?.username || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    websiteUrl: initialData?.websiteUrl || "",
    accountNumberLast4: initialData?.accountNumberLast4 || "",
    isCritical: initialData?.isCritical ?? false,
    isActive: initialData?.isActive ?? true,
    notes: initialData?.notes || "",
  })

  const selectedAccountType = accountTypes.find((type) => type.id === formData.accountType)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
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
                placeholder="e.g., Chase Checking, Netflix, Electric Bill"
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
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="institutionName">Company/Institution</Label>
              <Input
                id="institutionName"
                value={formData.institutionName}
                onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                placeholder="e.g., Chase Bank, Netflix, ComEd"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username/Login *</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Your login username"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
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
              <Label htmlFor="websiteUrl">Website/Login URL</Label>
              <Input
                id="websiteUrl"
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                placeholder="https://www.chase.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumberLast4">Account # (Last 4 digits)</Label>
              <Input
                id="accountNumberLast4"
                value={formData.accountNumberLast4}
                onChange={(e) => setFormData({ ...formData, accountNumberLast4: e.target.value })}
                placeholder="1234"
                maxLength={4}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="isCritical"
                checked={formData.isCritical}
                onCheckedChange={(checked) => setFormData({ ...formData, isCritical: checked })}
              />
              <Label htmlFor="isCritical">Critical for daily functioning</Label>
            </div>

            <div className="flex items-center space-x-2">
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
              placeholder="Additional notes about this account or login details"
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
