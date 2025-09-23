"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { AlertTriangle, Mail } from "lucide-react"

interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DeleteAccountModal({ isOpen, onClose }: DeleteAccountModalProps) {
  const [step, setStep] = useState<"confirm" | "email" | "sent">("confirm")
  const [email, setEmail] = useState("")
  const [confirmationCode, setConfirmationCode] = useState("")

  const handleSendEmail = () => {
    // This would send an email with confirmation code
    console.log("Sending deletion confirmation email to:", email)
    setStep("sent")
  }

  const handleConfirmDeletion = () => {
    // This would verify the code and delete the account
    console.log("Confirming account deletion with code:", confirmationCode)
    // After successful deletion, redirect to login
    localStorage.removeItem("whichpoint-user")
    localStorage.removeItem("whichpoint-guest")
    window.location.href = "/"
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card p-8 rounded-lg max-w-md w-full mx-4">
        {step === "confirm" && (
          <>
            <div className="text-center mb-6">
              <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Delete Account</h2>
              <p className="text-muted-foreground">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Enter your email to confirm</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleSendEmail} disabled={!email} className="flex-1">
                  Send Confirmation Email
                </Button>
              </div>
            </div>
          </>
        )}

        {step === "sent" && (
          <>
            <div className="text-center mb-6">
              <Mail className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
              <p className="text-muted-foreground">
                We've sent a confirmation code to <strong>{email}</strong>. Enter the code below to permanently delete
                your account.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="code">Confirmation Code</Label>
                <Input
                  id="code"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                />
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleConfirmDeletion}
                  disabled={confirmationCode.length !== 6}
                  className="flex-1"
                >
                  Delete Account
                </Button>
              </div>

              <Button variant="ghost" onClick={handleSendEmail} className="w-full text-sm">
                Resend Code
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
