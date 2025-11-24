"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  CreditCard,
  Home,
  Car,
  Zap,
  Phone,
  Heart,
  Shield,
  DollarSign,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  Calendar,
  User,
  Building,
  Hash,
  Mail,
  MapPin,
  FileText,
} from "lucide-react"
import { format } from "date-fns"

interface DetailItem {
  id: string
  name: string
  type: "account" | "bill"
  priority: number
  status: string
  amount: number
  category: string

  // Account specific fields
  institutionName?: string
  accountNumber?: string
  username?: string
  email?: string
  phone?: string
  address?: string
  creditLimit?: number
  interestRate?: number

  // Bill specific fields
  frequency?: string
  dueDate?: Date
  autoPay?: boolean
  isEstimate?: boolean
  paymentMethod?: string
  reminderDays?: number

  notes?: string
  isActive?: boolean
}

interface DetailViewModalProps {
  item: DetailItem | null
  isOpen: boolean
  onClose: () => void
  onEdit: (item: DetailItem) => void
  onDelete: (itemId: string) => void
  onQuickAction?: (itemId: string, action: string) => void
}

const categoryIcons: Record<string, any> = {
  checking: CreditCard,
  savings: CreditCard,
  credit: CreditCard,
  mortgage: Home,
  "auto-loan": Car,
  "personal-loan": DollarSign,
  "health-insurance": Heart,
  "auto-insurance": Car,
  "life-insurance": Shield,
  investment: DollarSign,
  retirement: DollarSign,
  utilities: Zap,
  phone: Phone,
  subscription: Heart,
  credit_card: CreditCard,
  loan: DollarSign,
  insurance: Shield,
  other: DollarSign,
}

export function DetailViewModal({ item, isOpen, onClose, onEdit, onDelete, onQuickAction }: DetailViewModalProps) {
  if (!item) return null

  const IconComponent = categoryIcons[item.category] || DollarSign

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
    }).format(Math.abs(amount))
  }

  const StatusIcon = getStatusIcon(item.status)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-lg">
              <IconComponent className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{item.name}</h2>
              <p className="text-sm text-muted-foreground capitalize">
                {item.type} • {item.category.replace("_", " ").replace("-", " ")}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Priority Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <StatusIcon className={`h-6 w-6 mx-auto mb-2 ${getStatusColor(item.status)}`} />
                <p className="text-sm font-medium capitalize">{item.status}</p>
                <p className="text-xs text-muted-foreground">Status</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Badge className={`${getPriorityColor(item.priority)} mb-2`}>{getPriorityLabel(item.priority)}</Badge>
                <p className="text-xs text-muted-foreground">Priority</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <p className={`text-lg font-bold ${item.amount >= 0 ? "text-primary" : "text-destructive"}`}>
                  {formatCurrency(item.amount)}
                </p>
                <p className="text-xs text-muted-foreground">{item.type === "account" ? "Balance" : "Amount"}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Badge variant={item.isActive ? "default" : "secondary"} className="mb-2">
                  {item.isActive ? "Active" : "Inactive"}
                </Badge>
                <p className="text-xs text-muted-foreground">Status</p>
              </CardContent>
            </Card>
          </div>

          {/* Account Details */}
          {item.type === "account" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {item.institutionName && (
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Institution</p>
                        <p className="text-sm text-muted-foreground">{item.institutionName}</p>
                      </div>
                    </div>
                  )}

                  {item.accountNumber && (
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Account Number</p>
                        <p className="text-sm text-muted-foreground font-mono">****{item.accountNumber}</p>
                      </div>
                    </div>
                  )}

                  {item.creditLimit && (
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Credit Limit</p>
                        <p className="text-sm text-muted-foreground">{formatCurrency(item.creditLimit)}</p>
                      </div>
                    </div>
                  )}

                  {item.interestRate && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Interest Rate</p>
                        <p className="text-sm text-muted-foreground">{item.interestRate}% APR</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bill Details */}
          {item.type === "bill" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Bill Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {item.frequency && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Frequency</p>
                        <p className="text-sm text-muted-foreground capitalize">{item.frequency}</p>
                      </div>
                    </div>
                  )}

                  {item.dueDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Due Date</p>
                        <p className="text-sm text-muted-foreground">{format(item.dueDate, "PPP")}</p>
                      </div>
                    </div>
                  )}

                  {item.paymentMethod && (
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Payment Method</p>
                        <p className="text-sm text-muted-foreground">{item.paymentMethod}</p>
                      </div>
                    </div>
                  )}

                  {item.reminderDays && (
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Reminder</p>
                        <p className="text-sm text-muted-foreground">{item.reminderDays} days before</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {item.autoPay && <Badge variant="outline">Auto-pay Enabled</Badge>}
                  {item.isEstimate && <Badge variant="outline">Estimate</Badge>}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact Information */}
          {(item.username || item.email || item.phone || item.address) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {item.username && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Username</p>
                        <p className="text-sm text-muted-foreground">{item.username}</p>
                      </div>
                    </div>
                  )}

                  {item.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{item.email}</p>
                      </div>
                    </div>
                  )}

                  {item.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <p className="text-sm text-muted-foreground">{item.phone}</p>
                      </div>
                    </div>
                  )}
                </div>

                {item.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">{item.address}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {item.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.notes}</p>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={() => onEdit(item)} className="flex-1">
              <Edit className="h-4 w-4 mr-2" />
              Edit {item.type === "account" ? "Account" : "Bill"}
            </Button>

            {item.type === "bill" && item.status !== "paid" && onQuickAction && (
              <Button variant="outline" onClick={() => onQuickAction(item.id, "mark-paid")}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark Paid
              </Button>
            )}

            <Button variant="outline" onClick={() => onDelete(item.id)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
