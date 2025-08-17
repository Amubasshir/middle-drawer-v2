"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BillForm } from "@/components/bill-form"
import { BillList } from "@/components/bill-list"
import { BillCalendar } from "@/components/bill-calendar"
import { Plus, ArrowLeft, TrendingUp, Calendar, List } from "lucide-react"
import Link from "next/link"

// Mock data for demonstration
const mockBills = [
  {
    id: "1",
    name: "Electric Bill",
    category: "utilities",
    amount: 89.5,
    frequency: "monthly",
    dueDate: new Date("2024-01-10"),
    priority: 1,
    status: "upcoming",
    autoPay: false,
    isEstimate: false,
    paymentMethod: "Chase Checking",
    notes: "Usually around $80-100 depending on season",
  },
  {
    id: "2",
    name: "Mortgage Payment",
    category: "mortgage",
    amount: 2440.0,
    frequency: "monthly",
    dueDate: new Date("2024-01-01"),
    priority: 1,
    status: "paid",
    autoPay: true,
    isEstimate: false,
    paymentMethod: "Auto-pay from Chase",
    notes: "30-year fixed rate mortgage",
  },
  {
    id: "3",
    name: "Health Insurance",
    category: "insurance",
    amount: 320.0,
    frequency: "monthly",
    dueDate: new Date("2024-01-08"),
    priority: 1,
    status: "overdue",
    autoPay: false,
    isEstimate: false,
    paymentMethod: "Credit Card",
    notes: "Blue Cross Blue Shield premium",
  },
  {
    id: "4",
    name: "Credit Card Payment",
    category: "credit_card",
    amount: 450.0,
    frequency: "monthly",
    dueDate: new Date("2024-01-12"),
    priority: 2,
    status: "upcoming",
    autoPay: false,
    isEstimate: true,
    paymentMethod: "Bank Transfer",
    notes: "Capital One Venture card",
  },
  {
    id: "5",
    name: "Netflix Subscription",
    category: "subscription",
    amount: 15.99,
    frequency: "monthly",
    dueDate: new Date("2024-01-15"),
    priority: 4,
    status: "upcoming",
    autoPay: true,
    isEstimate: false,
    paymentMethod: "Credit Card",
    notes: "Premium plan",
  },
]

export default function BillsPage() {
  const [bills, setBills] = useState(mockBills)
  const [showForm, setShowForm] = useState(false)
  const [editingBill, setEditingBill] = useState<any>(null)
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")

  const handleAddBill = (billData: any) => {
    const newBill = {
      ...billData,
      id: Date.now().toString(),
      status: "upcoming",
    }
    setBills([...bills, newBill])
    setShowForm(false)
  }

  const handleEditBill = (billData: any) => {
    const updatedBill = {
      ...billData,
      id: editingBill.id,
    }
    setBills(bills.map((bill) => (bill.id === editingBill.id ? updatedBill : bill)))
    setEditingBill(null)
  }

  const handleDeleteBill = (billId: string) => {
    if (confirm("Are you sure you want to delete this bill?")) {
      setBills(bills.filter((bill) => bill.id !== billId))
    }
  }

  const handleMarkPaid = (billId: string) => {
    setBills(bills.map((bill) => (bill.id === billId ? { ...bill, status: "paid" } : bill)))
  }

  if (showForm || editingBill) {
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
                    setEditingBill(null)
                  }}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Bills
                </Button>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  <h1 className="text-xl font-bold">{editingBill ? "Edit Bill" : "Add Bill"}</h1>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <BillForm
            onSubmit={editingBill ? handleEditBill : handleAddBill}
            onCancel={() => {
              setShowForm(false)
              setEditingBill(null)
            }}
            initialData={editingBill}
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
                <h1 className="text-xl font-bold">Bill Tracking & Reminders</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-muted rounded-lg p-1">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4 mr-1" />
                  List
                </Button>
                <Button
                  variant={viewMode === "calendar" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("calendar")}
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Calendar
                </Button>
              </div>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Bill
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Your Bills & Recurring Expenses</h2>
          <p className="text-muted-foreground">
            Track all your recurring bills, set reminders, and never miss a payment.
          </p>
        </div>

        {viewMode === "calendar" ? (
          <BillCalendar bills={bills} onBillClick={(bill) => setEditingBill(bill)} />
        ) : (
          <BillList
            bills={bills}
            onEdit={setEditingBill}
            onDelete={handleDeleteBill}
            onMarkPaid={handleMarkPaid}
            onViewCalendar={() => setViewMode("calendar")}
          />
        )}
      </main>
    </div>
  )
}
