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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Bell, Shield } from "lucide-react"

export function AlertNowButton() {
  const [isFirstConfirmOpen, setIsFirstConfirmOpen] = useState(false)
  const [isSecondConfirmOpen, setIsSecondConfirmOpen] = useState(false)
  const [isAlertSent, setIsAlertSent] = useState(false)

  const handleFirstConfirm = () => {
    setIsFirstConfirmOpen(false)
    setIsSecondConfirmOpen(true)
  }

  const handleFinalConfirm = () => {
    // TODO: Send emergency alert to all contacts
    console.log("[v0] Emergency alert triggered!")
    setIsSecondConfirmOpen(false)
    setIsAlertSent(true)

    // Reset after 5 seconds
    setTimeout(() => setIsAlertSent(false), 5000)
  }

  if (isAlertSent) {
    return (
      <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8">
        <Shield className="h-6 w-6 mr-2" />
        Alert Sent Successfully
      </Button>
    )
  }

  return (
    <>
      <Dialog open={isFirstConfirmOpen} onOpenChange={setIsFirstConfirmOpen}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 shadow-md relative"
          >
            <div className="flex items-center">
              <div className="h-0.5 w-3 bg-white mr-2 animate-pulse"></div>
              <Bell className="h-6 w-6" />
              <div className="h-0.5 w-3 bg-white ml-2 animate-pulse"></div>
            </div>
            <span className="ml-3">Alert Contacts</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-600">
              <Bell className="h-5 w-5" />
              Contact Alert Confirmation
            </DialogTitle>
            <DialogDescription>
              This will notify all your emergency contacts that you need assistance. Are you sure you want to send a
              contact alert?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFirstConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleFirstConfirm} className="bg-blue-600 hover:bg-blue-700">
              Yes, Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSecondConfirmOpen} onOpenChange={setIsSecondConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-600">
              <Bell className="h-5 w-5" />
              FINAL CONFIRMATION
            </DialogTitle>
            <DialogDescription className="text-base">
              <strong>This is your final confirmation.</strong> Clicking "SEND ALERT" will immediately contact:
              <ul className="mt-2 space-y-1 text-sm">
                <li>• All emergency contacts in your list</li>
                <li>• Include your location and account information</li>
                <li>• Cannot be undone once sent</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSecondConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleFinalConfirm} className="bg-blue-600 hover:bg-blue-700 font-bold">
              SEND ALERT
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
