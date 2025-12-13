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
import { Plus, Edit, Shield, Car, Home, Heart, User } from "lucide-react"

interface InsurancePolicy {
  id: number
  policyType: string
  companyName: string
  policyNumber: string
  agentName: string
  agentEmail: string
  agentPhone: string
  premiumAmount: number
  paymentFrequency: string
  dueDescription: string
  priority: number
  status: string
}

const policyIcons = {
  health: Heart,
  auto: Car,
  home: Home,
  life: User,
  disability: Shield,
  renters: Home,
  umbrella: Shield,
}

export function InsuranceSection() {
  const [policies, setPolicies] = useState<InsurancePolicy[]>([
    // {
    //   id: 1,
    //   policyType: "auto",
    //   companyName: "State Farm",
    //   policyNumber: "SF-123456789",
    //   agentName: "Sarah Johnson",
    //   agentEmail: "sarah.johnson@statefarm.com",
    //   agentPhone: "+1-555-0199",
    //   premiumAmount: 1200,
    //   paymentFrequency: "semi-annually",
    //   dueDescription: "January 15th and July 15th",
    //   priority: 1,
    //   status: "active",
    // },
    // {
    //   id: 2,
    //   policyType: "health",
    //   companyName: "Blue Cross Blue Shield",
    //   policyNumber: "BCBS-987654321",
    //   agentName: "Customer Service",
    //   agentEmail: "support@bcbs.com",
    //   agentPhone: "+1-800-555-0123",
    //   premiumAmount: 450,
    //   paymentFrequency: "monthly",
    //   dueDescription: "1st of each month",
    //   priority: 1,
    //   status: "active",
    // },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPolicy, setEditingPolicy] = useState<InsurancePolicy | null>(null)

  const handleAddPolicy = () => {
    setEditingPolicy(null)
    setIsDialogOpen(true)
  }

  const handleEditPolicy = (policy: InsurancePolicy) => {
    setEditingPolicy(policy)
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Insurance Policies</CardTitle>
            <CardDescription>Manage your insurance policies and agent contact information</CardDescription>
          </div>
          <Button onClick={handleAddPolicy} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Policy
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {policies.map((policy) => {
            const IconComponent = policyIcons[policy.policyType as keyof typeof policyIcons] || Shield
            return (
              <div key={policy.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <IconComponent className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium">{policy.companyName}</div>
                    <div className="text-sm text-gray-600 capitalize">{policy.policyType} Insurance</div>
                    <div className="text-xs text-gray-500">
                      Agent: {policy.agentName} • {policy.agentPhone}
                    </div>
                    <div className="text-xs text-gray-500">Due: {policy.dueDescription}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="font-medium text-sm">{formatCurrency(policy.premiumAmount)}</div>
                    <div className="text-xs text-gray-500">{policy.paymentFrequency}</div>
                  </div>
                  <Badge className={getPriorityColor(policy.priority)}>{getPriorityLabel(policy.priority)}</Badge>
                  <Button variant="ghost" size="sm" onClick={() => handleEditPolicy(policy)}>
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
            <DialogTitle>{editingPolicy ? "Edit Insurance Policy" : "Add Insurance Policy"}</DialogTitle>
            <DialogDescription>Add your insurance policy details and agent contact information.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="policy-type">Policy Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="renters">Renters</SelectItem>
                    <SelectItem value="life">Life</SelectItem>
                    <SelectItem value="disability">Disability</SelectItem>
                    <SelectItem value="umbrella">Umbrella</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="company">Insurance Company</Label>
                <Input id="company" placeholder="State Farm, Geico, etc." />
              </div>
            </div>

            <div>
              <Label htmlFor="policy-number">Policy Number</Label>
              <Input id="policy-number" placeholder="Policy or member ID" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="agent-name">Agent Name</Label>
                <Input id="agent-name" placeholder="Agent or contact person" />
              </div>
              <div>
                <Label htmlFor="agent-phone">Agent Phone</Label>
                <Input id="agent-phone" placeholder="+1-555-0123" />
              </div>
            </div>

            <div>
              <Label htmlFor="agent-email">Agent Email</Label>
              <Input id="agent-email" type="email" placeholder="agent@company.com" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="premium">Premium Amount</Label>
                <Input id="premium" type="number" placeholder="1200" />
              </div>
              <div>
                <Label htmlFor="frequency">Payment Frequency</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="How often" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="semi-annually">Semi-Annually</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="due-description">Payment Due</Label>
              <Input id="due-description" placeholder="1st of each month, January 15th, etc." />
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
              <Label htmlFor="notes">Coverage Details & Notes</Label>
              <Textarea id="notes" placeholder="Coverage limits, deductibles, special notes..." />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsDialogOpen(false)}>{editingPolicy ? "Update" : "Add"} Policy</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
