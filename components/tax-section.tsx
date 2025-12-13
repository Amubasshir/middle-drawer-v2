"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, FileText, Building, Calculator } from "lucide-react"

interface TaxAccount {
  id: number
  accountType: string
  entityName: string
  accountNumber: string
  contactPerson: string
  contactEmail: string
  contactPhone: string
  taxYear: number
  importantDates: string
  priority: number
  status: string
}

const taxIcons = {
  irs: Building,
  state_tax: Building,
  cpa: Calculator,
  tax_software: FileText,
  payroll: Building,
}

export function TaxSection() {
  const [accounts, setAccounts] = useState<TaxAccount[]>([
    // {
    //   id: 1,
    //   accountType: "cpa",
    //   entityName: "Johnson & Associates CPA",
    //   accountNumber: "CLIENT-2024-789",
    //   contactPerson: "Michael Johnson, CPA",
    //   contactEmail: "mjohnson@johnsoncpa.com",
    //   contactPhone: "+1-555-0167",
    //   taxYear: 2024,
    //   importantDates: "Tax filing: April 15th, Quarterly estimates: Jan 15, Apr 15, Jun 15, Sep 15",
    //   priority: 1,
    //   status: "active",
    // },
    // {
    //   id: 2,
    //   accountType: "tax_software",
    //   entityName: "TurboTax",
    //   accountNumber: "",
    //   contactPerson: "Customer Support",
    //   contactEmail: "support@turbotax.com",
    //   contactPhone: "+1-800-446-8848",
    //   taxYear: 2024,
    //   importantDates: "Filing deadline: April 15th, Extension deadline: October 15th",
    //   priority: 2,
    //   status: "active",
    // },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<TaxAccount | null>(null)

  const handleAddAccount = () => {
    setEditingAccount(null)
    setIsDialogOpen(true)
  }

  const handleEditAccount = (account: TaxAccount) => {
    setEditingAccount(account)
    setIsDialogOpen(true)
  }

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return "bg-red-100 text-red-800"
      case 2:
        return "bg-orange-100 text-orange-800"
      case 3:
        return "bg-blue-100 text-blue-800"
      case 4:
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1:
        return "Critical"
      case 2:
        return "Important"
      case 3:
        return "Normal"
      case 4:
        return "Low"
      default:
        return "Normal"
    }
  }

  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case "irs":
        return "IRS"
      case "state_tax":
        return "State Tax"
      case "cpa":
        return "CPA/Tax Preparer"
      case "tax_software":
        return "Tax Software"
      case "payroll":
        return "Payroll Service"
      default:
        return type
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Tax Accounts</CardTitle>
            <CardDescription>Manage your tax-related accounts and professional contacts</CardDescription>
          </div>
          <Button onClick={handleAddAccount} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Account
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {accounts.map((account) => {
            const IconComponent = taxIcons[account.accountType as keyof typeof taxIcons] || FileText
            return (
              <div key={account.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <IconComponent className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium">{account.entityName}</div>
                    <div className="text-sm text-gray-600">{getAccountTypeLabel(account.accountType)}</div>
                    <div className="text-xs text-gray-500">
                      Contact: {account.contactPerson} • {account.contactPhone}
                    </div>
                    <div className="text-xs text-gray-500">{account.importantDates}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="font-medium text-sm">Tax Year {account.taxYear}</div>
                  </div>
                  <Badge className={getPriorityColor(account.priority)}>{getPriorityLabel(account.priority)}</Badge>
                  <Button variant="ghost" size="sm" onClick={() => handleEditAccount(account)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingAccount ? "Edit Tax Account" : "Add Tax Account"}</DialogTitle>
            <DialogDescription>Add your tax-related account details and professional contacts.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="account-type">Account Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="irs">IRS</SelectItem>
                    <SelectItem value="state_tax">State Tax Agency</SelectItem>
                    <SelectItem value="cpa">CPA/Tax Preparer</SelectItem>
                    <SelectItem value="tax_software">Tax Software</SelectItem>
                    <SelectItem value="payroll">Payroll Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="entity-name">Entity/Company Name</Label>
                <Input id="entity-name" placeholder="IRS, H&R Block, etc." />
              </div>
            </div>

            <div>
              <Label htmlFor="account-number">Account/Client Number</Label>
              <Input id="account-number" placeholder="SSN, EIN, Client ID, etc." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact-person">Contact Person</Label>
                <Input id="contact-person" placeholder="CPA name, agent, etc." />
              </div>
              <div>
                <Label htmlFor="contact-phone">Contact Phone</Label>
                <Input id="contact-phone" placeholder="+1-555-0123" />
              </div>
            </div>

            <div>
              <Label htmlFor="contact-email">Contact Email</Label>
              <Input id="contact-email" type="email" placeholder="contact@company.com" />
            </div>

            <div>
              <Label htmlFor="tax-year">Tax Year</Label>
              <Input id="tax-year" type="number" placeholder="2024" />
            </div>

            <div>
              <Label htmlFor="important-dates">Important Dates</Label>
              <Textarea
                id="important-dates"
                placeholder="Filing deadlines, quarterly payment dates, appointment schedules..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="priority">Priority Level</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Critical</SelectItem>
                  <SelectItem value="2">Important</SelectItem>
                  <SelectItem value="3">Normal</SelectItem>
                  <SelectItem value="4">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Document Location & Notes</Label>
              <Textarea id="notes" placeholder="Where tax documents are stored, special instructions..." rows={3} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsDialogOpen(false)}>{editingAccount ? "Update" : "Add"} Account</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
