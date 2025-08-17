"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Calendar, Clock, AlertCircle, CheckCircle } from "lucide-react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns"

interface Bill {
  id: string
  name: string
  amount: number
  dueDate: Date
  category: string
  priority: number
  status: string
  autoPay: boolean
}

interface BillCalendarProps {
  bills: Bill[]
  onBillClick: (bill: Bill) => void
}

export function BillCalendar({ bills, onBillClick }: BillCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getBillsForDate = (date: Date) => {
    return bills.filter((bill) => isSameDay(bill.dueDate, date))
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return CheckCircle
      case "overdue":
        return AlertCircle
      case "upcoming":
        return Clock
      default:
        return Clock
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const today = new Date()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Bill Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-semibold min-w-[140px] text-center">{format(currentDate, "MMMM yyyy")}</h3>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {monthDays.map((day) => {
            const dayBills = getBillsForDate(day)
            const isToday = isSameDay(day, today)
            const isCurrentMonth = isSameMonth(day, currentDate)

            return (
              <div
                key={day.toISOString()}
                className={`min-h-[100px] p-1 border border-border rounded-lg ${
                  isCurrentMonth ? "bg-background" : "bg-muted/30"
                } ${isToday ? "ring-2 ring-primary" : ""}`}
              >
                <div
                  className={`text-sm font-medium mb-1 ${
                    isCurrentMonth ? "text-foreground" : "text-muted-foreground"
                  } ${isToday ? "text-primary" : ""}`}
                >
                  {format(day, "d")}
                </div>

                <div className="space-y-1">
                  {dayBills.slice(0, 2).map((bill) => {
                    const StatusIcon = getStatusIcon(bill.status)

                    return (
                      <div
                        key={bill.id}
                        onClick={() => onBillClick(bill)}
                        className="text-xs p-1 rounded cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-1 mb-1">
                          <StatusIcon className="h-3 w-3" />
                          <span className="truncate font-medium">{bill.name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{formatCurrency(bill.amount)}</span>
                          <Badge className={`${getPriorityColor(bill.priority)} text-xs px-1 py-0`}>
                            {bill.priority === 1 ? "C" : bill.priority === 2 ? "I" : bill.priority === 3 ? "N" : "L"}
                          </Badge>
                        </div>
                      </div>
                    )
                  })}

                  {dayBills.length > 2 && (
                    <div className="text-xs text-muted-foreground text-center">+{dayBills.length - 2} more</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-destructive rounded"></div>
            <span>Critical</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-secondary rounded"></div>
            <span>Important</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-muted rounded"></div>
            <span>Normal</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-primary" />
            <span>Paid</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3 text-destructive" />
            <span>Overdue</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
