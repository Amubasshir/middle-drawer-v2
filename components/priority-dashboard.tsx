"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, CheckCircle, Clock, Eye, TrendingUp, TrendingDown } from "lucide-react"

interface PriorityItem {
  id: string
  name: string
  type: "account" | "bill"
  priority: number
  status: string
  amount: number
  dueDate?: Date
  category: string
  notes?: string
}

interface PriorityDashboardProps {
  items: PriorityItem[]
  onViewDetails: (item: PriorityItem) => void
  onQuickAction: (itemId: string, action: string) => void
}

export function PriorityDashboard({ items, onViewDetails, onQuickAction }: PriorityDashboardProps) {
  const criticalItems = items.filter((item) => item.priority === 1)
  const importantItems = items.filter((item) => item.priority === 2)
  const normalItems = items.filter((item) => item.priority === 3)
  const lowItems = items.filter((item) => item.priority === 4)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
      case "current":
      case "paid":
        return CheckCircle
      case "warning":
      case "upcoming":
        return Clock
      case "overdue":
      case "critical":
        return AlertTriangle
      default:
        return Clock
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
      case "current":
      case "paid":
        return "text-primary"
      case "warning":
      case "upcoming":
        return "text-secondary"
      case "overdue":
      case "critical":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount))
  }

  const getDaysUntilDue = (dueDate?: Date) => {
    if (!dueDate) return null
    const today = new Date()
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const PrioritySection = ({
    title,
    items,
    color,
    bgColor,
    description,
  }: {
    title: string
    items: PriorityItem[]
    color: string
    bgColor: string
    description: string
  }) => (
    <Card className={`${bgColor} border-l-4 ${color}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {items.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.slice(0, 3).map((item) => {
          const StatusIcon = getStatusIcon(item.status)
          const daysUntilDue = getDaysUntilDue(item.dueDate)

          return (
            <div key={item.id} className="flex items-center justify-between p-3 bg-background rounded-lg border">
              <div className="flex items-center space-x-3">
                <StatusIcon className={`h-4 w-4 ${getStatusColor(item.status)}`} />
                <div>
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-muted-foreground capitalize">{item.category}</p>
                  {daysUntilDue !== null && (
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
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className={`font-semibold ${item.amount >= 0 ? "text-primary" : "text-destructive"}`}>
                    {item.amount >= 0 ? "+" : ""}
                    {formatCurrency(item.amount)}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {item.type}
                  </Badge>
                </div>
                <Button variant="outline" size="sm" onClick={() => onViewDetails(item)}>
                  <Eye className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )
        })}

        {items.length > 3 && (
          <Button variant="ghost" className="w-full text-sm">
            View {items.length - 3} more {title.toLowerCase()} items
          </Button>
        )}

        {items.length === 0 && <p className="text-center text-muted-foreground py-4">No {title.toLowerCase()} items</p>}
      </CardContent>
    </Card>
  )

  const totalBalance = items.reduce((sum, item) => sum + item.amount, 0)
  const criticalBalance = criticalItems.reduce((sum, item) => sum + item.amount, 0)
  const overdueBills = items.filter((item) => item.type === "bill" && item.status === "overdue").length

  return (
    <div className="space-y-6">
      {/* Priority Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{criticalItems.length}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue Bills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{overdueBills}</div>
            <p className="text-xs text-muted-foreground">Past due date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold flex items-center ${criticalBalance >= 0 ? "text-primary" : "text-destructive"}`}
            >
              {criticalBalance >= 0 ? (
                <TrendingUp className="h-5 w-5 mr-1" />
              ) : (
                <TrendingDown className="h-5 w-5 mr-1" />
              )}
              {formatCurrency(criticalBalance)}
            </div>
            <p className="text-xs text-muted-foreground">Critical accounts total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Health Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              {Math.round(
                (items.filter((item) => item.status === "good" || item.status === "current" || item.status === "paid")
                  .length /
                  Math.max(items.length, 1)) *
                  100,
              )}
              %
            </div>
            <Progress
              value={Math.round(
                (items.filter((item) => item.status === "good" || item.status === "current" || item.status === "paid")
                  .length /
                  Math.max(items.length, 1)) *
                  100,
              )}
              className="h-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Priority Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PrioritySection
          title="Critical Priority"
          items={criticalItems}
          color="border-l-destructive"
          bgColor="bg-destructive/5"
          description="Essential for daily functioning - handle immediately"
        />

        <PrioritySection
          title="Important Priority"
          items={importantItems}
          color="border-l-secondary"
          bgColor="bg-secondary/5"
          description="Important but not critical - handle soon"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PrioritySection
          title="Normal Priority"
          items={normalItems}
          color="border-l-muted"
          bgColor="bg-muted/5"
          description="Regular priority - handle when convenient"
        />

        <PrioritySection
          title="Low Priority"
          items={lowItems}
          color="border-l-accent"
          bgColor="bg-accent/5"
          description="Low priority - can be delayed if needed"
        />
      </div>
    </div>
  )
}
