"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowRight } from "lucide-react"

interface CategoryData {
  id: string
  name: string
  icon: any
  totalAccounts: number
  criticalAccounts: number
  totalBalance: number
  monthlyExpenses: number
  accounts: Array<{
    id: string
    name: string
    type: string
    balance: number
    priority: number
    status: string
  }>
  color: string
}

interface CategoryOverviewProps {
  categories: CategoryData[]
  onViewCategory: (categoryId: string) => void
}

export function CategoryOverview({ categories, onViewCategory }: CategoryOverviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
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

  const getHealthScore = (category: CategoryData) => {
    const criticalRatio = category.criticalAccounts / Math.max(category.totalAccounts, 1)
    const balanceHealth = category.totalBalance >= 0 ? 100 : Math.max(0, 100 + category.totalBalance / 1000)
    return Math.round((100 - criticalRatio * 30 + balanceHealth) / 2)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => {
        const IconComponent = category.icon
        const healthScore = getHealthScore(category)

        return (
          <Card
            key={category.id}
            className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
            onClick={() => onViewCategory(category.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${category.color}`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {category.totalAccounts} account{category.totalAccounts !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Total Balance</p>
                  <p className={`font-semibold ${category.totalBalance >= 0 ? "text-primary" : "text-destructive"}`}>
                    {category.totalBalance >= 0 ? "+" : "-"}
                    {formatCurrency(category.totalBalance)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Monthly Cost</p>
                  <p className="font-semibold text-foreground">{formatCurrency(category.monthlyExpenses)}</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs text-muted-foreground">Health Score</p>
                  <p className="text-xs font-medium">{healthScore}%</p>
                </div>
                <Progress value={healthScore} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">Critical Accounts</p>
                  <Badge className={getPriorityColor(1)} variant="secondary">
                    {category.criticalAccounts}
                  </Badge>
                </div>

                <div className="space-y-1">
                  {category.accounts.slice(0, 2).map((account) => (
                    <div key={account.id} className="flex justify-between items-center text-xs">
                      <span className="truncate flex-1 mr-2">{account.name}</span>
                      <span className={account.balance >= 0 ? "text-primary" : "text-destructive"}>
                        {formatCurrency(account.balance)}
                      </span>
                    </div>
                  ))}
                  {category.accounts.length > 2 && (
                    <p className="text-xs text-muted-foreground">
                      +{category.accounts.length - 2} more account{category.accounts.length - 2 !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
