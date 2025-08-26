"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { RefreshCw, Mail, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SyncResult {
  emailsProcessed: number
  accountsFound: number
  accountsUpdated: number
  newAccounts: Array<{
    type: string
    name: string
    email?: string
  }>
}

export function EmailSyncButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null)

  const handleSync = async () => {
    setIsScanning(true)
    setProgress(0)
    setSyncResult(null)

    // Simulate email scanning process
    const steps = [
      { message: "Connecting to email...", duration: 1000 },
      { message: "Scanning recent emails...", duration: 2000 },
      { message: "Identifying billing notices...", duration: 1500 },
      { message: "Extracting account information...", duration: 1000 },
      { message: "Updating account database...", duration: 800 },
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, steps[i].duration))
      setProgress((i + 1) * 20)
    }

    // Simulate results
    const mockResult: SyncResult = {
      emailsProcessed: 47,
      accountsFound: 8,
      accountsUpdated: 3,
      newAccounts: [
        { type: "Insurance", name: "State Farm Auto", email: "billing@statefarm.com" },
        { type: "Utility", name: "Pacific Gas & Electric", email: "noreply@pge.com" },
        { type: "Subscription", name: "Netflix", email: "info@netflix.com" },
      ],
    }

    setSyncResult(mockResult)
    setIsScanning(false)
  }

  const resetSync = () => {
    setProgress(0)
    setSyncResult(null)
    setIsScanning(false)
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Sync from Email
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              Email Account Sync
            </DialogTitle>
            <DialogDescription>
              Scan your email for billing notices and automatically populate account information.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {!isScanning && !syncResult && (
              <div className="text-sm text-gray-600 space-y-2">
                <p>This will scan your recent emails for:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Billing statements and invoices</li>
                  <li>Account notifications</li>
                  <li>Payment reminders</li>
                  <li>Service provider communications</li>
                </ul>
                <p className="text-xs text-gray-500 mt-3">Your email content remains private and secure.</p>
              </div>
            )}

            {isScanning && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                  Scanning emails...
                </div>
                <Progress value={progress} className="w-full" />
                <p className="text-xs text-gray-500">This may take a few moments depending on your email volume.</p>
              </div>
            )}

            {syncResult && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Sync Complete!</span>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{syncResult.emailsProcessed}</div>
                    <div className="text-xs text-gray-600">Emails Scanned</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{syncResult.accountsFound}</div>
                    <div className="text-xs text-gray-600">Accounts Found</div>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{syncResult.accountsUpdated}</div>
                    <div className="text-xs text-gray-600">Updated</div>
                  </div>
                </div>

                {syncResult.newAccounts.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">New Accounts Discovered:</h4>
                    <div className="space-y-2">
                      {syncResult.newAccounts.map((account, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div>
                            <div className="font-medium text-sm">{account.name}</div>
                            {account.email && <div className="text-xs text-gray-500">{account.email}</div>}
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {account.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            {!isScanning && !syncResult && (
              <>
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSync}>Start Sync</Button>
              </>
            )}

            {isScanning && (
              <Button variant="outline" disabled>
                Scanning...
              </Button>
            )}

            {syncResult && (
              <>
                <Button variant="outline" onClick={resetSync}>
                  Sync Again
                </Button>
                <Button onClick={() => setIsOpen(false)}>Done</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
