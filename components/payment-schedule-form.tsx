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
import { Calendar } from "lucide-react"

interface PaymentScheduleFormProps {
  accountName: string
  onSubmit: (schedule: any) => void
  onCancel: () => void
  initialData?: any
}

export function PaymentScheduleForm({ accountName, onSubmit, onCancel, initialData }: PaymentScheduleFormProps) {
  const [formData, setFormData] = useState({
    paymentName: initialData?.paymentName || "",
    dueType: initialData?.dueType || "monthly_day",
    dueDay: initialData?.dueDay || "",
    dueDate: initialData?.dueDate || "",
    approximateTiming: initialData?.approximateTiming || "",
    frequency: initialData?.frequency || "monthly",
    autoPay: initialData?.autoPay ?? false,
    reminderEnabled: initialData?.reminderEnabled ?? true,
    reminderDays: initialData?.reminderDays || "3",
    isActive: initialData?.isActive ?? true,
    notes: initialData?.notes || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          {initialData ? "Edit Payment Schedule" : "Add Payment Schedule"}
          <span className="text-sm text-muted-foreground">for {accountName}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="paymentName">Payment Name *</Label>
              <Input
                id="paymentName"
                value={formData.paymentName}
                onChange={(e) => setFormData({ ...formData, paymentName: e.target.value })}
                placeholder="e.g., Monthly Payment, Annual Premium"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency *</Label>
              <Select
                value={formData.frequency}
                onValueChange={(value) => setFormData({ ...formData, frequency: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="How often?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly (Every 3 months)</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                  <SelectItem value="one-time">One-time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <Label>When is this due? *</Label>
            <Select value={formData.dueType} onValueChange={(value) => setFormData({ ...formData, dueType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select timing type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly_day">Specific day of the month</SelectItem>
                <SelectItem value="exact_date">Exact date</SelectItem>
                <SelectItem value="approximate">Approximate timing</SelectItem>
              </SelectContent>
            </Select>

            {formData.dueType === "monthly_day" && (
              <div className="space-y-2">
                <Label htmlFor="dueDay">Day of Month (1-31)</Label>
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

            {formData.dueType === "exact_date" && (
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
            )}

            {formData.dueType === "approximate" && (
              <div className="space-y-2">
                <Label htmlFor="approximateTiming">Approximate Timing</Label>
                <Select
                  value={formData.approximateTiming}
                  onValueChange={(value) => setFormData({ ...formData, approximateTiming: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select approximate timing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginning">Beginning of month (1st-5th)</SelectItem>
                    <SelectItem value="mid-month">Mid-month (around 15th)</SelectItem>
                    <SelectItem value="end">End of month (25th-31st)</SelectItem>
                    <SelectItem value="custom">Custom description</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {formData.dueType === "approximate" && formData.approximateTiming === "custom" && (
              <div className="space-y-2">
                <Label htmlFor="customTiming">Custom Timing Description</Label>
                <Input
                  id="customTiming"
                  value={formData.approximateTiming}
                  onChange={(e) => setFormData({ ...formData, approximateTiming: e.target.value })}
                  placeholder="e.g., Around the 20th, After payday, When I remember"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                id="reminderEnabled"
                checked={formData.reminderEnabled}
                onCheckedChange={(checked) => setFormData({ ...formData, reminderEnabled: checked })}
              />
              <Label htmlFor="reminderEnabled">Enable reminders</Label>
            </div>
          </div>

          {formData.reminderEnabled && (
            <div className="space-y-2">
              <Label htmlFor="reminderDays">Remind me how many days before?</Label>
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
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes about this payment schedule"
              rows={3}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1">
              {initialData ? "Update Schedule" : "Add Schedule"}
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
