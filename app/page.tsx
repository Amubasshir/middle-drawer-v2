import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, CreditCard, Home, Car, AlertCircle, CheckCircle, Clock, User, Calendar, FileText } from "lucide-react"

export default function AccountCredentialsDashboard() {
  const criticalAccounts = [
    {
      id: 1,
      name: "Chase Checking",
      type: "Bank Account",
      username: "john.doe.chase",
      email: "john@email.com",
      institution: "Chase Bank",
      status: "active",
      icon: CreditCard,
    },
    {
      id: 2,
      name: "Mortgage - Wells Fargo",
      type: "Mortgage/Rent",
      username: "john.doe.wf",
      email: "john@email.com",
      institution: "Wells Fargo",
      status: "active",
      icon: Home,
    },
    {
      id: 3,
      name: "Auto Insurance",
      type: "Insurance",
      username: "john.doe.geico",
      email: "john@email.com",
      institution: "GEICO",
      status: "active",
      icon: Car,
    },
  ]

  const upcomingPayments = [
    {
      id: 1,
      accountName: "Electric Bill",
      paymentName: "Monthly Electric",
      timing: "Around the 10th",
      frequency: "Monthly",
      status: "upcoming",
      autoPay: false,
    },
    {
      id: 2,
      accountName: "Chase Credit Card",
      paymentName: "Credit Card Payment",
      timing: "15th of each month",
      frequency: "Monthly",
      status: "upcoming",
      autoPay: true,
    },
    {
      id: 3,
      accountName: "Health Insurance",
      paymentName: "Premium Payment",
      timing: "1st of each month",
      frequency: "Monthly",
      status: "overdue",
      autoPay: false,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "current":
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
      case "active":
      case "current":
        return CheckCircle
      case "upcoming":
        return Clock
      case "overdue":
        return AlertCircle
      default:
        return Clock
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">WhichPoint</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <a href="/accounts">
                  <User className="h-4 w-4 mr-2" />
                  Manage Accounts
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/schedules">
                  <Calendar className="h-4 w-4 mr-2" />
                  Payment Schedules
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/notes">
                  <FileText className="h-4 w-4 mr-2" />
                  Personal Notes
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/settings">Settings</a>
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Account
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">12</div>
              <p className="text-xs text-muted-foreground">Active accounts tracked</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Payments Due Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">3</div>
              <p className="text-xs text-muted-foreground">Next 7 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Critical Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">5</div>
              <p className="text-xs text-muted-foreground">Essential for daily life</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Your Accounts & Credentials</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {criticalAccounts.map((account) => {
                const IconComponent = account.icon
                const StatusIcon = getStatusIcon(account.status)

                return (
                  <Card key={account.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-muted rounded-lg">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground">{account.name}</h3>
                            <p className="text-sm text-muted-foreground">{account.type}</p>
                            <p className="text-xs text-muted-foreground">@{account.username}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(account.status)}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {account.status}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium mt-1 text-foreground">{account.institution}</p>
                          <p className="text-xs text-muted-foreground mt-1">{account.email}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Payment Schedules</h2>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Schedule
              </Button>
            </div>

            <div className="space-y-4">
              {upcomingPayments.map((payment) => {
                const StatusIcon = getStatusIcon(payment.status)

                return (
                  <Card key={payment.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-foreground">{payment.accountName}</h3>
                          <p className="text-sm text-muted-foreground">{payment.paymentName}</p>
                          {payment.autoPay && (
                            <Badge variant="outline" className="text-xs mt-1">
                              Auto-pay
                            </Badge>
                          )}
                        </div>

                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge className={getStatusColor(payment.status)}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {payment.status}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-foreground">{payment.timing}</p>
                          <p className="text-xs text-muted-foreground">{payment.frequency}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
