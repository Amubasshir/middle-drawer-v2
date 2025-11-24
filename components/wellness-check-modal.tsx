"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { CheckCircle, FileText, Folder } from "lucide-react"

interface WellnessCheckModalProps {
  isOpen: boolean
  onClose: () => void
}

export function WellnessCheckModal({ isOpen, onClose }: WellnessCheckModalProps) {
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [countdown, setCountdown] = useState(30) // 30 days default

  useEffect(() => {
    if (isConfirmed) {
      // Start countdown timer
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 86400000) // Update daily

      return () => clearInterval(timer)
    }
  }, [isConfirmed])

  const handleConfirm = () => {
    setIsConfirmed(true)
    // Save confirmation to backend/localStorage
    localStorage.setItem("last-wellness-check", new Date().toISOString())
    localStorage.setItem("next-wellness-check", new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString())
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card p-8 rounded-lg max-w-md w-full mx-4">
        {!isConfirmed ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">Wellness Check</h2>
            <p className="text-muted-foreground mb-6 text-center">
              Please confirm that you're still able to access your accounts and manage your financial responsibilities.
            </p>

            <div className="flex flex-col items-center space-y-3 mb-6">
              <div className="w-full bg-gradient-to-r from-amber-100 to-amber-50 border-2 border-amber-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                <Button
                  onClick={handleConfirm}
                  variant="ghost"
                  className="w-full h-16 bg-transparent hover:bg-amber-100/50 text-amber-800 font-bold text-lg flex items-center justify-start px-6"
                >
                  <Folder className="h-6 w-6 mr-4 text-amber-600" />
                  <div className="text-left">
                    <div className="font-bold">Confirm Access</div>
                    <div className="text-sm font-normal opacity-75">I can access my accounts</div>
                  </div>
                </Button>
              </div>

              <div className="w-full bg-gradient-to-r from-green-100 to-green-50 border-2 border-green-200 rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                <Button
                  onClick={handleConfirm}
                  variant="ghost"
                  className="w-full h-16 bg-transparent hover:bg-green-100/50 text-green-800 font-bold text-lg flex items-center justify-start px-6"
                >
                  <FileText className="h-6 w-6 mr-4 text-green-600" />
                  <div className="text-left">
                    <div className="font-bold">I'm Doing Well</div>
                    <div className="text-sm font-normal opacity-75">Everything is manageable</div>
                  </div>
                </Button>
              </div>
            </div>

            <div className="flex justify-center">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Thanks for confirming!</h2>
              <p className="text-muted-foreground mb-4">
                We'll check in again in <span className="font-bold text-primary">{countdown} days</span>.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                If you'd like to change these settings,{" "}
                <button
                  className="text-primary underline"
                  onClick={() => {
                    onClose()
                    // Navigate to settings
                    window.location.href = "/settings"
                  }}
                >
                  click here
                </button>
              </p>
              <Button onClick={onClose} className="w-full">
                Close
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
