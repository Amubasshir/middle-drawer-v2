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
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, CreditCard, Home, Zap, Phone, Heart, Shield, DollarSign } from "lucide-react"
import { format } from "date-fns"

interface BillFormProps {
  onSubmit: (bill: any) => void
  onCancel: () => void
  initialData?: any
}

const billCategories = [
  { id: "mortgage", name: "Mortgage/Rent", icon: Home, color: "bg-primary" },
  { id: "utilities", name: "Utilities", icon: Zap, color: "bg-secondary" },
  { id: "insurance", name: "Insurance", icon: Shield, color: "bg-accent" },
  { id: "credit_card", name: "Credit Card", icon: CreditCard, color: "bg-chart-1" },
  { id: "loan", name: "Loan Payment", icon: DollarSign, color: "bg-chart-2" },
  { id: "phone", name: "Phone/Internet", icon: Phone, color: "bg-chart-3" },
  { id: "subscription", name: "Subscription", icon: Heart, color: "bg-chart-4" },
  { id: "other", name: "Other", icon: DollarSign, color: "bg-muted" },
]

const frequencies = [
  { value: "monthly", label: "Monthly" },
  { value: "weekly", label: "Weekly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
  { value: "bi-weekly", label: "Bi-weekly" },
]

export function BillForm({ onSubmit, onCancel, initialData }: BillFormProps) {
  const [formData, setFormData] = useState({
    billName: initialData?.billName || "",
    category: initialData?.category || "",
    amount: initialData?.amount || "",
    isEstimate: initialData?.isEstimate ?? false,
    frequency: initialData?.frequency || "monthly",
    dueDay: initialData?.dueDay || "",
    dueDate: initialData?.dueDate ? new Date(initialData.dueDate) : undefined,
    autoPay: initialData?.autoPay ?? false,
    priorityLevel: initialData?.priorityLevel || "3",
    reminderDays: initialData?.reminderDays || "3",
    paymentMethod: initialData?.paymentMethod || "",
    accountId: initialData?.accountId || "",
    notes: initialData?.notes || "",
    isActive: initialData?.isActive ?? true,
  })

  const selectedCategory = billCategories.find((cat) => cat.id === formData.category)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      amount: Number.parseFloat(formData.amount),
      dueDay: formData.dueDay ? Number.parseInt(formData.dueDay) : null,
      priorityLevel: Number.parseInt(formData.priorityLevel),
      reminderDays: Number.parseInt(formData.reminderDays),
    })
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
          {selectedCategory && <selectedCategory.icon className="h-5 w-5 text-primary" />}
          {initialData ? "Edit Bill" : "Add New Bill"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="billName">Bill Name *</Label>
              <Input
                id="billName"
                value={formData.billName}
                onChange={(e) => setFormData({ ...formData, billName: e.target.value })}
                placeholder="e.g., Electric Bill, Mortgage Payment"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {billCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <category.icon className="h-4 w-4" />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className="pl-8"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency *</Label>
              <Select
                value={formData.frequency}
                onValueChange={(value) => setFormData({ ...formData, frequency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {frequencies.map((freq) => (
                    <SelectItem key={freq.value} value={freq.value}>
                      {freq.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.frequency === "monthly" && (
              <div className="space-y-2">
                <Label htmlFor="dueDay">Due Day of Month</Label>
                <Input
                  id="dueDay"
                  type="number"
                  min="1"
                  max="31"
                  value={formData.dueDay}
                  onChange={(e) => setFormData({ ...formData, dueDay: e.target.value })}
                  placeholder="15"
                />
              </div>
            )}

            {formData.frequency !== "monthly" && (
              <div className="space-y-2">
                <Label>Next Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dueDate ? format(formData.dueDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.dueDate}
                      onSelect={(date) => setFormData({ ...formData, dueDate: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Input
                id="paymentMethod"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                placeholder="e.g., Chase Checking, Auto-pay"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reminderDays">Reminder Days</Label>
              <Select
                value={formData.reminderDays}
                onValueChange={(value) => setFormData({ ...formData, reminderDays: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 day before</SelectItem>
                  <SelectItem value="3">3 days before</SelectItem>
                  <SelectItem value="7">1 week before</SelectItem>
                  <SelectItem value="14">2 weeks before</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                      <span>Must pay on time</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="2">
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor("2")}>Important</Badge>
                      <span>Important but flexible</span>
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
                      <span>Can be delayed if needed</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-4 pt-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isEstimate"
                  checked={formData.isEstimate}
                  onCheckedChange={(checked) => setFormData({ ...formData, isEstimate: checked })}
                />
                <Label htmlFor="isEstimate">This is an estimate</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="autoPay"
                  checked={formData.autoPay}
                  onCheckedChange={(checked) => setFormData({ ...formData, autoPay: checked })}
                />
                <Label htmlFor="autoPay">Auto-pay enabled</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Bill is active</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes about this bill"
              rows={3}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1">
              {initialData ? "Update Bill" : "Add Bill"}
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
