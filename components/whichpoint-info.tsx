"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Info, Shield, Users, Zap, X } from "lucide-react"
import { useState, useEffect } from "react"

export function WhichPointInfo() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasBeenSeen, setHasBeenSeen] = useState(false)

  useEffect(() => {
    const seen = localStorage.getItem("whichpoint-info-seen")
    if (!seen) {
      setIsOpen(true)
    } else {
      setHasBeenSeen(true)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem("whichpoint-info-seen", "true")
    setHasBeenSeen(true)
  }

  const handleDontShowAgain = () => {
    handleClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          <Info className="h-4 w-4 mr-2" />
          What is WhichPoint?
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-primary">Welcome to WhichPoint</DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="text-base leading-relaxed space-y-4 mt-4">
          <p>
            <strong>WhichPoint</strong> is designed for individuals who manage a complex digital footprint and need a
            reliable system to remember what matters most. If you've ever forgotten a password, missed a payment, or
            lost track of an important account, WhichPoint is for you.
          </p>

          <p>
            In today's digital world, keeping track of accounts, credentials, payment schedules, and responsibilities
            requires a new platform and framework. WhichPoint organizes your entire digital life in one secure,
            accessible place.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Privacy First</h4>
              <p className="text-sm text-muted-foreground">
                You control what information to share. No sensitive data required.
              </p>
            </div>

            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Fully Customizable</h4>
              <p className="text-sm text-muted-foreground">Choose who to contact, how often, and how aggressively.</p>
            </div>

            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold mb-1">You're in Control</h4>
              <p className="text-sm text-muted-foreground">You decide when and how your contacts are notified.</p>
            </div>
          </div>

          <p>
            <strong>Your Privacy Matters:</strong> WhichPoint values your privacy above all else. You don't need to
            provide any sensitive information if you don't want to. The platform is completely adaptable to your comfort
            level and security preferences.
          </p>

          <p>
            <strong>Complete Control:</strong> You control the trigger for when individuals get contacted. Whether it's
            daily check-ins or emergency situations, the timing and method of contact is entirely up to you.
          </p>

          <div className="flex justify-between items-center pt-4 border-t">
            <Button variant="outline" onClick={handleDontShowAgain}>
              Don't show this again
            </Button>
            <Button onClick={handleClose}>Got it!</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
