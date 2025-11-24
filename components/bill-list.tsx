"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CreditCard,
  Home,
  Zap,
  Phone,
  Heart,
  Shield,
  DollarSign,
  Edit,
  Trash2,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
} from "lucide-react"
import { format } from "date-fns"

interface Bill {
  id: string
  name: string
  category: string
  amount: number
  frequency: string
  dueDate: Date
  priority: number
  status: string
  autoPay: boolean
  isEstimate: boolean
  paymentMethod: string
  notes: string
}

interface BillListProps {
  bills: Bill[]
  onEdit: (bill: Bill) => void
  onDelete: (billId: string) => void
  onMarkPaid: (billId: string) => void
  onViewCalendar: () => void
}

const categoryIcons: Record<string, any> = {
  mortgage: Home,
  utilities: Zap,
  insurance: Shield,
  credit_card: CreditCard,
  loan: DollarSign,
  phone: Phone,
  subscription: Heart,
  other: DollarSign,
}

const categoryNames: Record<string, string> = {
  mortgage: "Mortgage/Rent",
  utilities: "Utilities",
  insurance: "Insurance",
  credit_card: "Credit Card",
  loan: "Loan Payment",
  phone: "Phone/Internet",
  subscription: "Subscription",
  other: "Other",
}

export function BillList({ bills, onEdit, onDelete, onMarkPaid, onViewCalendar }: BillListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("dueDate")

  const filteredBills = bills
    .filter((bill) => {
      const matchesSearch = bill.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = filterCategory === "all" || bill.category === filterCategory
      const matchesStatus = filterStatus === "all" || bill.status === filterStatus
      return matchesSearch && matchesCategory && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          return a.dueDate.getTime() - b.dueDate.getTime()
        case "amount":
          return b.amount - a.amount
        case "priority":
          return a.priority - b.priority
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return "bg-destructive text-destructive-foreground"
      case 2:
        return "bg-secondary text-secondary-foreground"
      case 3:
        return "bg-muted text-muted-foreground"
      case 4:
        return "bg-accent text-accent-foreground"
      default:
        return "bg-muted text-muted-foreground"
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-primary text-primary-foreground"
      case "upcoming":
        return "bg-secondary text-secondary-foreground"
      case "overdue":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return CheckCircle
      case "upcoming":
        return Clock
      case "overdue":
        return AlertCircle
      default:
        return Clock
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getDaysUntilDue = (dueDate: Date) => {
    const today = new Date()
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="mortgage">Mortgage/Rent</SelectItem>
            <SelectItem value="utilities">Utilities</SelectItem>
            <SelectItem value="insurance">Insurance</SelectItem>
            <SelectItem value="credit_card">Credit Card</SelectItem>
            <SelectItem value="loan">Loan Payment</SelectItem>
            <SelectItem value="phone">Phone/Internet</SelectItem>
            <SelectItem value="subscription">Subscription</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dueDate">Due Date</SelectItem>
            <SelectItem value="amount">Amount</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={onViewCalendar}>
          <Calendar className="h-4 w-4 mr-2" />
          Calendar
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredBills.map((bill) => {
          const IconComponent = categoryIcons[bill.category] || DollarSign
          const StatusIcon = getStatusIcon(bill.status)
          const categoryName = categoryNames[bill.category] || bill.category
          const daysUntilDue = getDaysUntilDue(bill.dueDate)

          return (
            <Card key={bill.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-muted rounded-lg">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{bill.name}</h3>
                        {bill.isEstimate && (
                          <Badge variant="outline" className="text-xs">
                            Estimate
                          </Badge>
                        )}
                        {bill.autoPay && (
                          <Badge variant="outline" className="text-xs">
                            Auto-pay
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{categoryName}</p>
                      {bill.paymentMethod && <p className="text-xs text-muted-foreground">via {bill.paymentMethod}</p>}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold text-lg">{formatCurrency(bill.amount)}</p>
                      <p className="text-sm text-muted-foreground">Due: {format(bill.dueDate, "MMM d, yyyy")}</p>
                      <p
                        className={`text-xs ${
                          daysUntilDue < 0
                            ? "text-destructive"
                            : daysUntilDue <= 3
                              ? "text-secondary"
                              : "text-muted-foreground"
                        }`}
                      >
                        {daysUntilDue < 0
                          ? `${Math.abs(daysUntilDue)} days overdue`
                          : daysUntilDue === 0
                            ? "Due today"
                            : `${daysUntilDue} days left`}
                      </p>
                    </div>

                    <div className="flex flex-col items-center space-y-2">
                      <Badge className={getStatusColor(bill.status)}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {bill.status}
                      </Badge>
                      <Badge className={getPriorityColor(bill.priority)}>{getPriorityLabel(bill.priority)}</Badge>
                    </div>

                    <div className="flex flex-col space-y-1">
                      {bill.status !== "paid" && (
                        <Button variant="outline" size="sm" onClick={() => onMarkPaid(bill.id)}>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Mark Paid
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => onEdit(bill)}>
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => onDelete(bill.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredBills.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No bills found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
