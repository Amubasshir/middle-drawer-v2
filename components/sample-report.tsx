"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, CreditCard, Home, Shield, Share2, User, Calendar } from "lucide-react"

interface SampleReportProps {
  isOpen: boolean
  onClose: () => void
}

export function SampleReport({ isOpen, onClose }: SampleReportProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const sampleData = {
    user: {
      name: "John Doe",
      email: "john@email.com",
      phone: "(555) 123-4567",
      reportDate: new Date().toLocaleDateString(),
    },
    accounts: [
      {
        category: "Banking",
        accounts: [
          { name: "Chase Checking", username: "john.doe.chase", institution: "Chase Bank", status: "Active" },
          { name: "Savings Account", username: "john.doe.chase.sav", institution: "Chase Bank", status: "Active" },
        ],
      },
      {
        category: "Insurance",
        accounts: [
          { name: "Auto Insurance", username: "john.doe.geico", institution: "GEICO", status: "Active" },
          { name: "Health Insurance", username: "john.doe.bcbs", institution: "Blue Cross", status: "Active" },
        ],
      },
      {
        category: "Housing",
        accounts: [
          { name: "Mortgage", username: "john.doe.wf", institution: "Wells Fargo", status: "Active" },
          { name: "Electric Bill", username: "john.doe.pge", institution: "PG&E", status: "Active" },
        ],
      },
      {
        category: "Social Media",
        accounts: [
          { name: "Facebook", username: "john.doe.fb", institution: "Meta", status: "Active" },
          { name: "LinkedIn", username: "john.doe.li", institution: "LinkedIn", status: "Active" },
        ],
      },
    ],
    paymentSchedules: [
      { name: "Mortgage Payment", timing: "1st of each month", frequency: "Monthly", autoPay: true },
      { name: "Electric Bill", timing: "Around the 10th", frequency: "Monthly", autoPay: false },
      { name: "Auto Insurance", timing: "15th of each month", frequency: "Monthly", autoPay: true },
    ],
    emergencyContacts: [
      { name: "Sarah Doe", relationship: "Spouse", contactAfter: "3 days" },
      { name: "Mike Johnson", relationship: "Family", contactAfter: "14 days" },
    ],
  }

  const generatePDF = async () => {
    setIsGeneratingPDF(true)

    // Create a simple HTML content for PDF generation
    const reportContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>WhichPoint Account Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #ea580c; padding-bottom: 20px; }
            .section { margin-bottom: 25px; }
            .section h2 { color: #ea580c; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
            .account-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
            .account-item { border: 1px solid #ddd; padding: 10px; border-radius: 5px; }
            .account-item h4 { margin: 0 0 5px 0; color: #ea580c; }
            .account-item p { margin: 2px 0; font-size: 14px; }
            .status-active { color: #16a34a; font-weight: bold; }
            .contact-info { background: #f8f9fa; padding: 15px; border-radius: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f8f9fa; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>WhichPoint Account Report</h1>
            <p>Generated for: ${sampleData.user.name}</p>
            <p>Report Date: ${sampleData.user.reportDate}</p>
          </div>

          <div class="section">
            <h2>Contact Information</h2>
            <div class="contact-info">
              <p><strong>Name:</strong> ${sampleData.user.name}</p>
              <p><strong>Email:</strong> ${sampleData.user.email}</p>
              <p><strong>Phone:</strong> ${sampleData.user.phone}</p>
            </div>
          </div>

          <div class="section">
            <h2>Account Summary</h2>
            ${sampleData.accounts
              .map(
                (category) => `
              <h3>${category.category}</h3>
              <div class="account-grid">
                ${category.accounts
                  .map(
                    (account) => `
                  <div class="account-item">
                    <h4>${account.name}</h4>
                    <p><strong>Username:</strong> ${account.username}</p>
                    <p><strong>Institution:</strong> ${account.institution}</p>
                    <p><strong>Status:</strong> <span class="status-active">${account.status}</span></p>
                  </div>
                `,
                  )
                  .join("")}
              </div>
            `,
              )
              .join("")}
          </div>

          <div class="section">
            <h2>Payment Schedules</h2>
            <table>
              <thead>
                <tr>
                  <th>Payment</th>
                  <th>Timing</th>
                  <th>Frequency</th>
                  <th>Auto-Pay</th>
                </tr>
              </thead>
              <tbody>
                ${sampleData.paymentSchedules
                  .map(
                    (payment) => `
                  <tr>
                    <td>${payment.name}</td>
                    <td>${payment.timing}</td>
                    <td>${payment.frequency}</td>
                    <td>${payment.autoPay ? "Yes" : "No"}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>

          <div class="section">
            <h2>Emergency Contacts</h2>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Relationship</th>
                  <th>Contact After</th>
                </tr>
              </thead>
              <tbody>
                ${sampleData.emergencyContacts
                  .map(
                    (contact) => `
                  <tr>
                    <td>${contact.name}</td>
                    <td>${contact.relationship}</td>
                    <td>${contact.contactAfter}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `

    // Create a new window and print
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(reportContent)
      printWindow.document.close()

      // Wait for content to load then trigger print dialog
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 500)
    }

    setIsGeneratingPDF(false)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Banking":
        return CreditCard
      case "Insurance":
        return Shield
      case "Housing":
        return Home
      case "Social Media":
        return Share2
      default:
        return FileText
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>Sample Account Report Preview</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-primary">WhichPoint Account Report</CardTitle>
              <div className="text-center text-sm text-muted-foreground">
                <p>Generated for: {sampleData.user.name}</p>
                <p>Report Date: {sampleData.user.reportDate}</p>
              </div>
            </CardHeader>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Contact Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium">{sampleData.user.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{sampleData.user.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Phone</p>
                <p className="font-medium">{sampleData.user.phone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Accounts by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Account Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sampleData.accounts.map((category, index) => {
                const IconComponent = getCategoryIcon(category.category)
                return (
                  <div key={index}>
                    <h4 className="flex items-center space-x-2 font-semibold mb-2">
                      <IconComponent className="h-4 w-4 text-primary" />
                      <span>{category.category}</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-6">
                      {category.accounts.map((account, accountIndex) => (
                        <div key={accountIndex} className="border rounded p-3 text-sm">
                          <p className="font-medium text-primary">{account.name}</p>
                          <p className="text-muted-foreground">@{account.username}</p>
                          <p className="text-muted-foreground">{account.institution}</p>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {account.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Payment Schedules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Payment Schedules</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sampleData.paymentSchedules.map((payment, index) => (
                  <div key={index} className="flex justify-between items-center p-2 border rounded text-sm">
                    <div>
                      <p className="font-medium">{payment.name}</p>
                      <p className="text-muted-foreground">
                        {payment.timing} • {payment.frequency}
                      </p>
                    </div>
                    {payment.autoPay && <Badge variant="outline">Auto-pay</Badge>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sampleData.emergencyContacts.map((contact, index) => (
                  <div key={index} className="flex justify-between items-center p-2 border rounded text-sm">
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-muted-foreground">{contact.relationship}</p>
                    </div>
                    <Badge variant="outline">Contact after {contact.contactAfter}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Generate PDF Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={generatePDF}
              disabled={isGeneratingPDF}
              size="lg"
              className="bg-primary hover:bg-primary/90"
            >
              <Download className="h-4 w-4 mr-2" />
              {isGeneratingPDF ? "Generating PDF..." : "Generate PDF Report"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
