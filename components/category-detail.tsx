"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Plus, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react"

interface Account {
  id: string
  name: string
  type: string
  institution: string
  balance: number
  priority: number
  status: string
  monthlyExpense?: number
  dueDate?: string
}

interface CategoryDetailProps {
  category: {
    id: string
    name: string
    icon: any
    color: string
    description: string
    accounts: Account[]
    totalBalance: number
    monthlyExpenses: number
    criticalAccounts: number
  }
  onBack: () => void
  onAddAccount: () => void
  onEditAccount: (account: Account) => void
}

export function CategoryDetail({ category, onBack, onAddAccount, onEditAccount }: CategoryDetailProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Math.abs(amount))
  }

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
      case "current":
        return CheckCircle
      case "warning":
        return AlertTriangle
      case "overdue":
        return AlertTriangle
      default:
        return CheckCircle
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
      case "current":
        return "text-primary"
      case "warning":
        return "text-secondary"
      case "overdue":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  const IconComponent = category.icon
  const totalAccounts = category.accounts.length
  const healthScore = Math.round(
    (category.accounts.filter((acc) => acc.status === "good" || acc.status === "current").length /
      Math.max(totalAccounts, 1)) *
      100,
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Categories
          </Button>
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${category.color}`}>
              <IconComponent className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{category.name}</h1>
              <p className="text-muted-foreground">{category.description}</p>
            </div>
          </div>
        </div>
        <Button onClick={onAddAccount}>
          <Plus className="h-4 w-4 mr-2" />
          Add Account
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAccounts}</div>
            <p className="text-xs text-muted-foreground">{category.criticalAccounts} critical</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold flex items-center ${category.totalBalance >= 0 ? "text-primary" : "text-destructive"}`}
            >
              {category.totalBalance >= 0 ? (
                <TrendingUp className="h-5 w-5 mr-1" />
              ) : (
                <TrendingDown className="h-5 w-5 mr-1" />
              )}
              {formatCurrency(category.totalBalance)}
            </div>
            <p className="text-xs text-muted-foreground">{category.totalBalance >= 0 ? "Assets" : "Liabilities"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(category.monthlyExpenses)}</div>
            <p className="text-xs text-muted-foreground">Estimated total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Health Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{healthScore}%</div>
            <Progress value={healthScore} className="h-2" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Accounts in this Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {category.accounts.map((account) => {
              const StatusIcon = getStatusIcon(account.status)

              return (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <StatusIcon className={`h-4 w-4 ${getStatusColor(account.status)}`} />
                    </div>
                    <div>
                      <h3 className="font-medium">{account.name}</h3>
                      <p className="text-sm text-muted-foreground">{account.institution}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className={`font-medium ${account.balance >= 0 ? "text-primary" : "text-destructive"}`}>
                        {formatCurrency(account.balance)}
                      </p>
                      {account.monthlyExpense && (
                        <p className="text-xs text-muted-foreground">{formatCurrency(account.monthlyExpense)}/month</p>
                      )}
                      {account.dueDate && <p className="text-xs text-muted-foreground">Due: {account.dueDate}</p>}
                    </div>

                    <Badge className={getPriorityColor(account.priority)}>{getPriorityLabel(account.priority)}</Badge>

                    <Button variant="outline" size="sm" onClick={() => onEditAccount(account)}>
                      Edit
                    </Button>
                  </div>
                </div>
              )
            })}

            {category.accounts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No accounts in this category yet.</p>
                <Button onClick={onAddAccount}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Account
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
