"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Info, Shield, Users, Zap, X, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"

export function WhichPointInfo() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasBeenSeen, setHasBeenSeen] = useState(false)
  const [currentScreen, setCurrentScreen] = useState(0)

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
    setCurrentScreen(0)
  }

  const handleDontShowAgain = () => {
    handleClose()
  }

  const nextScreen = () => {
    if (currentScreen < 3) setCurrentScreen(currentScreen + 1)
  }

  const prevScreen = () => {
    if (currentScreen > 0) setCurrentScreen(currentScreen - 1)
  }

  const screens = [
    {
      title: "Welcome to WhichPoint",
      content: (
        <div className="space-y-4">
          <p>
            <strong>WhichPoint</strong> is designed for individuals who manage a complex digital footprint and need a
            reliable system to remember what matters most.
          </p>
          <p>
            If you've ever forgotten a password, missed a payment, or lost track of an important account, WhichPoint is
            for you.
          </p>
          <p>
            In today's digital world, keeping track of accounts, credentials, payment schedules, and responsibilities
            requires a new platform and framework.
          </p>
        </div>
      ),
    },
    {
      title: "Activity Verification Methods",
      content: (
        <div className="space-y-4">
          <p className="font-semibold mb-3">
            WhichPoint offers multiple ways to verify you're actively using your account:
          </p>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-sm">Email with Secure Passphrase</h4>
                <p className="text-xs text-muted-foreground">
                  Least secure - respond to email with your unique passphrase
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-sm">Application Notification</h4>
                <p className="text-xs text-muted-foreground">
                  Click 'Yes' on push notifications from the WhichPoint app
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-sm">Email Reminder Confirmation</h4>
                <p className="text-xs text-muted-foreground">Click 'Yes' link in scheduled email reminders</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-sm">Automated Text Message</h4>
                <p className="text-xs text-muted-foreground">
                  Most secure - respond 'Yes' to automated SMS verification
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Key Features",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
              <Shield className="h-6 w-6 text-primary mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Privacy First</h4>
                <p className="text-sm text-muted-foreground">
                  You control what information to share. No sensitive data required.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
              <Users className="h-6 w-6 text-primary mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Fully Customizable</h4>
                <p className="text-sm text-muted-foreground">Choose who to contact, how often, and how aggressively.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
              <Zap className="h-6 w-6 text-primary mt-1" />
              <div>
                <h4 className="font-semibold mb-1">You're in Control</h4>
                <p className="text-sm text-muted-foreground">You decide when and how your contacts are notified.</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Your Privacy & Control",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
              <Shield className="h-6 w-6 text-primary mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Privacy First</h4>
                <p className="text-sm text-muted-foreground">
                  You control what information to share. No sensitive data required.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
              <Users className="h-6 w-6 text-primary mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Fully Customizable</h4>
                <p className="text-sm text-muted-foreground">Choose who to contact, how often, and how aggressively.</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
              <Zap className="h-6 w-6 text-primary mt-1" />
              <div>
                <h4 className="font-semibold mb-1">You're in Control</h4>
                <p className="text-sm text-muted-foreground">You decide when and how your contacts are notified.</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          <Info className="h-4 w-4 mr-2" />
          What is WhichPoint?
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[70vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-primary">{screens[currentScreen].title}</DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex justify-center space-x-2 mb-4">
          {screens.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${index === currentScreen ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>

        <div className="text-base leading-relaxed">{screens[currentScreen].content}</div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={prevScreen} disabled={currentScreen === 0}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            {currentScreen < 3 ? (
              <Button size="sm" onClick={nextScreen}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : null}
          </div>

          <div className="flex space-x-2">
            {currentScreen === 3 && (
              <Button variant="outline" onClick={handleDontShowAgain}>
                Don't show again
              </Button>
            )}
            <Button onClick={handleClose}>{currentScreen === 3 ? "Got it!" : "Skip"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
