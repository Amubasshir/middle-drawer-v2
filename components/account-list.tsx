"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CreditCard,
  Home,
  Car,
  PiggyBank,
  Shield,
  TrendingUp,
  Zap,
  Phone,
  Heart,
  DollarSign,
  Edit,
  Trash2,
  Search,
  Filter,
  Eye,
  EyeOff,
} from "lucide-react"

interface Account {
  id: string
  accountName: string
  accountType: string
  institutionName: string
  accountNumber: string
  username: string
  email: string
  phone: string
  currentBalance: number
  creditLimit?: number
  priorityLevel: number
  isActive: boolean
  notes: string
}

interface AccountListProps {
  accounts: Account[]
  onEdit: (account: Account) => void
  onDelete: (accountId: string) => void
  onViewDetails: (account: Account) => void
}

const accountTypeIcons: Record<string, any> = {
  checking: CreditCard,
  savings: PiggyBank,
  credit: CreditCard,
  mortgage: Home,
  "auto-loan": Car,
  "personal-loan": DollarSign,
  "health-insurance": Heart,
  "auto-insurance": Car,
  "life-insurance": Shield,
  investment: TrendingUp,
  retirement: PiggyBank,
  utilities: Zap,
  phone: Phone,
}

const accountTypeNames: Record<string, string> = {
  checking: "Checking Account",
  savings: "Savings Account",
  credit: "Credit Card",
  mortgage: "Mortgage",
  "auto-loan": "Auto Loan",
  "personal-loan": "Personal Loan",
  "health-insurance": "Health Insurance",
  "auto-insurance": "Auto Insurance",
  "life-insurance": "Life Insurance",
  investment: "Investment Account",
  retirement: "Retirement Account",
  utilities: "Utility Account",
  phone: "Phone/Internet",
}

export function AccountList({ accounts, onEdit, onDelete, onViewDetails }: AccountListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [showInactive, setShowInactive] = useState(false)

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.accountName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      account.institutionName?.toLowerCase().includes(searchTerm?.toLowerCase())

    const matchesCategory =
      filterCategory === "all" ||
      (filterCategory === "banking" && ["checking", "savings"].includes(account.accountType)) ||
      (filterCategory === "credit" &&
        ["credit", "mortgage", "auto-loan", "personal-loan"].includes(account.accountType)) ||
      (filterCategory === "insurance" && account.accountType.includes("insurance")) ||
      (filterCategory === "investment" && ["investment", "retirement"].includes(account.accountType)) ||
      (filterCategory === "utilities" && ["utilities", "phone"].includes(account.accountType))

    const matchesPriority = filterPriority === "all" || account.priorityLevel.toString() === filterPriority

    const matchesActive = showInactive || account.isActive

    return matchesSearch && matchesCategory && matchesPriority && matchesActive
  })

  const getPriorityColor = (level: number) => {
    switch (level) {
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

  const getPriorityLabel = (level: number) => {
    switch (level) {
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

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(balance)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search accounts..."
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
            <SelectItem value="banking">Banking</SelectItem>
            <SelectItem value="credit">Credit & Loans</SelectItem>
            <SelectItem value="insurance">Insurance</SelectItem>
            <SelectItem value="investment">Investment</SelectItem>
            <SelectItem value="utilities">Utilities</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="1">Critical</SelectItem>
            <SelectItem value="2">Important</SelectItem>
            <SelectItem value="3">Normal</SelectItem>
            <SelectItem value="4">Low</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={() => setShowInactive(!showInactive)} className="w-full sm:w-auto">
          {showInactive ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
          {showInactive ? "Hide Inactive" : "Show Inactive"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAccounts.map((account) => {
          const IconComponent = accountTypeIcons[account.accountType] || CreditCard
          const typeName = accountTypeNames[account.accountType] || account.accountType

          return (
            <Card
              key={account.id}
              className={`hover:shadow-md transition-shadow ${!account.isActive ? "opacity-60" : ""}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-muted rounded-lg">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{account.accountName}</CardTitle>
                      <p className="text-sm text-muted-foreground">{typeName}</p>
                    </div>
                  </div>
                  <Badge className={getPriorityColor(account.priorityLevel)}>
                    {getPriorityLabel(account.priorityLevel)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Institution:</span>
                    <span className="text-sm font-medium">{account.institutionName || "N/A"}</span>
                  </div>

                  {account.accountNumber && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Account:</span>
                      <span className="text-sm font-mono">****{account.accountNumber}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Balance:</span>
                    <span
                      className={`text-sm font-medium ${account.currentBalance >= 0 ? "text-primary" : "text-destructive"}`}
                    >
                      {formatBalance(account.currentBalance)}
                    </span>
                  </div>

                  {account.creditLimit && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Limit:</span>
                      <span className="text-sm font-medium">{formatBalance(account.creditLimit)}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => onViewDetails(account)} className="flex-1">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onEdit(account)} className="flex-1">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onDelete(account.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredAccounts.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No accounts found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
