"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PriorityDashboard } from "@/components/priority-dashboard"
import { DetailViewModal } from "@/components/detail-view-modal"
import { TrendingUp, ArrowLeft, Filter, ToggleLeft, ToggleRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

// Mock data combining accounts and bills
const mockPriorityItems = [
  // Critical Priority Items
  {
    id: "1",
    name: "Chase Checking",
    type: "account" as const,
    priority: 1,
    status: "good",
    amount: 2450.0,
    category: "checking",
    institutionName: "Chase Bank",
    accountNumber: "1234",
    username: "john.doe",
    email: "john@email.com",
    phone: "(555) 123-4567",
    notes: "Primary checking account for daily expenses",
    isActive: true,
  },
  {
    id: "2",
    name: "Health Insurance",
    type: "bill" as const,
    priority: 1,
    status: "overdue",
    amount: 320.0,
    category: "insurance",
    frequency: "monthly",
    dueDate: new Date("2024-01-08"),
    autoPay: false,
    isEstimate: false,
    paymentMethod: "Credit Card",
    reminderDays: 3,
    notes: "Blue Cross Blue Shield premium",
    isActive: true,
  },
  {
    id: "3",
    name: "Mortgage Payment",
    type: "bill" as const,
    priority: 1,
    status: "upcoming",
    amount: 2440.0,
    category: "mortgage",
    frequency: "monthly",
    dueDate: new Date("2024-02-01"),
    autoPay: true,
    isEstimate: false,
    paymentMethod: "Auto-pay from Chase",
    reminderDays: 7,
    notes: "30-year fixed rate mortgage",
    isActive: true,
  },

  // Important Priority Items
  {
    id: "4",
    name: "Emergency Savings",
    type: "account" as const,
    priority: 2,
    status: "good",
    amount: 15000.0,
    category: "savings",
    institutionName: "Ally Bank",
    accountNumber: "9012",
    username: "john.ally",
    email: "john@email.com",
    phone: "(555) 123-4567",
    notes: "6-month emergency fund",
    isActive: true,
  },
  {
    id: "5",
    name: "Credit Card Payment",
    type: "bill" as const,
    priority: 2,
    status: "upcoming",
    amount: 450.0,
    category: "credit_card",
    frequency: "monthly",
    dueDate: new Date("2024-01-12"),
    autoPay: false,
    isEstimate: true,
    paymentMethod: "Bank Transfer",
    reminderDays: 3,
    notes: "Capital One Venture card",
    isActive: true,
  },

  // Normal Priority Items
  {
    id: "6",
    name: "401(k) - Fidelity",
    type: "account" as const,
    priority: 3,
    status: "good",
    amount: 85000.0,
    category: "retirement",
    institutionName: "Fidelity",
    notes: "Employer 401(k) plan",
    isActive: true,
  },
  {
    id: "7",
    name: "Electric Bill",
    type: "bill" as const,
    priority: 3,
    status: "upcoming",
    amount: 89.5,
    category: "utilities",
    frequency: "monthly",
    dueDate: new Date("2024-01-10"),
    autoPay: false,
    isEstimate: false,
    paymentMethod: "Chase Checking",
    reminderDays: 3,
    notes: "Usually around $80-100 depending on season",
    isActive: true,
  },

  // Low Priority Items
  {
    id: "8",
    name: "Netflix Subscription",
    type: "bill" as const,
    priority: 4,
    status: "upcoming",
    amount: 15.99,
    category: "subscription",
    frequency: "monthly",
    dueDate: new Date("2024-01-15"),
    autoPay: true,
    isEstimate: false,
    paymentMethod: "Credit Card",
    reminderDays: 1,
    notes: "Premium plan",
    isActive: true,
  },
  {
    id: "9",
    name: "Robinhood Portfolio",
    type: "account" as const,
    priority: 4,
    status: "good",
    amount: 40000.0,
    category: "investment",
    institutionName: "Robinhood",
    notes: "Individual investment account",
    isActive: true,
  },
]

export default function PriorityPage() {
  const [items, setItems] = useState(mockPriorityItems)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [viewMode, setViewMode] = useState<"priority" | "detailed">("priority")
  const [filterType, setFilterType] = useState<"all" | "account" | "bill">("all")
  const [filterPriority, setFilterPriority] = useState<"all" | "1" | "2" | "3" | "4">("all")

  const filteredItems = items.filter((item) => {
    const matchesType = filterType === "all" || item.type === filterType
    const matchesPriority = filterPriority === "all" || item.priority.toString() === filterPriority
    return matchesType && matchesPriority
  })

  const handleViewDetails = (item: any) => {
    setSelectedItem(item)
    setShowDetailModal(true)
  }

  const handleEditItem = (item: any) => {
    setShowDetailModal(false)
    // Navigate to edit form based on item type
    console.log("Edit item:", item)
  }

  const handleDeleteItem = (itemId: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setItems(items.filter((item) => item.id !== itemId))
      setShowDetailModal(false)
    }
  }

  const handleQuickAction = (itemId: string, action: string) => {
    if (action === "mark-paid") {
      setItems(items.map((item) => (item.id === itemId ? { ...item, status: "paid" } : item)))
    }
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
                <h1 className="text-xl font-bold">Priority & Detail Views</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                  <SelectTrigger className="w-32">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Items</SelectItem>
                    <SelectItem value="account">Accounts</SelectItem>
                    <SelectItem value="bill">Bills</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterPriority} onValueChange={(value: any) => setFilterPriority(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="1">Critical</SelectItem>
                    <SelectItem value="2">Important</SelectItem>
                    <SelectItem value="3">Normal</SelectItem>
                    <SelectItem value="4">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" onClick={() => setViewMode(viewMode === "priority" ? "detailed" : "priority")}>
                {viewMode === "priority" ? (
                  <ToggleLeft className="h-4 w-4 mr-2" />
                ) : (
                  <ToggleRight className="h-4 w-4 mr-2" />
                )}
                {viewMode === "priority" ? "Priority View" : "Detailed View"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">
            {viewMode === "priority" ? "Priority-Based Organization" : "Detailed Financial Overview"}
          </h2>
          <p className="text-muted-foreground">
            {viewMode === "priority"
              ? "Focus on what matters most - critical accounts and bills that require immediate attention."
              : "Comprehensive view of all your financial accounts and bills with complete details."}
          </p>
        </div>

        <PriorityDashboard items={filteredItems} onViewDetails={handleViewDetails} onQuickAction={handleQuickAction} />

        <DetailViewModal
          item={selectedItem}
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
          onQuickAction={handleQuickAction}
        />
      </main>
    </div>
  )
}
