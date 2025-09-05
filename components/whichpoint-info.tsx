"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Info, Shield, Users, Zap, ChevronLeft, ChevronRight } from "lucide-react"
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
    if (currentScreen < 2) setCurrentScreen(currentScreen + 1)
  }

  const prevScreen = () => {
    if (currentScreen > 0) setCurrentScreen(currentScreen - 1)
  }

  const screens = [
    {
      title: "Welcome to WhichPoint",
      content: (
        <div className="space-y-3">
          <p className="text-sm">
            <strong>WhichPoint</strong> is designed for individuals who manage a complex digital footprint and need a
            reliable system to remember what matters most.
          </p>
          <p className="text-sm">
            If you've ever forgotten a password, missed a payment, or lost track of an important account, WhichPoint is
            for you.
          </p>
          <p className="text-sm">
            In today's digital world, keeping track of accounts, credentials, payment schedules, and responsibilities
            requires a new platform and framework.
          </p>
        </div>
      ),
    },
    {
      title: "Activity Verification & Cognitive Tracking",
      content: (
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-sm mb-2">Verification Methods:</p>
            <div className="space-y-2">
              <div className="flex items-start space-x-2 p-2 bg-muted/30 rounded text-xs">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5"></div>
                <div>
                  <span className="font-medium">Email Passphrase</span> - Least secure
                </div>
              </div>
              <div className="flex items-start space-x-2 p-2 bg-muted/30 rounded text-xs">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5"></div>
                <div>
                  <span className="font-medium">SMS Verification</span> - Most secure
                </div>
              </div>
            </div>
          </div>
          <div>
            <p className="font-semibold text-sm mb-2">Optional Cognitive Tracking:</p>
            <p className="text-xs text-muted-foreground">
              Non-invasive puzzles to track vision, reaction timing, and memory changes. Completely optional and not a
              clinical tool.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Your Digital Safety Net",
      content: (
        <div className="space-y-3">
          <p className="font-semibold text-sm mb-2">
            WhichPoint acts as an independent safety net to ensure your accounts and digital footprint remain secure:
          </p>
          <div className="space-y-2">
            <div className="flex items-start space-x-2 p-2 bg-muted/30 rounded">
              <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-sm">Privacy First</h4>
                <p className="text-xs text-muted-foreground">
                  You control what information to share. No sensitive data required.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2 p-2 bg-muted/30 rounded">
              <Users className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-sm">Fully Customizable</h4>
                <p className="text-xs text-muted-foreground">Choose who to contact, how often, and how aggressively.</p>
              </div>
            </div>
            <div className="flex items-start space-x-2 p-2 bg-muted/30 rounded">
              <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-sm">You're in Control</h4>
                <p className="text-xs text-muted-foreground">You decide when and how your contacts are notified.</p>
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
      <DialogContent className="max-w-md max-h-[85vh] mx-4">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-primary">{screens[currentScreen].title}</DialogTitle>
        </DialogHeader>

        <div className="flex justify-center space-x-2 mb-3">
          {screens.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${index === currentScreen ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>

        <div className="text-sm leading-relaxed overflow-y-auto flex-1">{screens[currentScreen].content}</div>

        <div className="flex justify-between items-center pt-3 border-t">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={prevScreen} disabled={currentScreen === 0}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            {currentScreen < 2 ? (
              <Button size="sm" onClick={nextScreen}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : null}
          </div>

          <div className="flex space-x-2">
            {currentScreen === 2 && (
              <Button variant="outline" onClick={handleDontShowAgain}>
                Don't show again
              </Button>
            )}
            <Button onClick={handleClose}>{currentScreen === 2 ? "Got it!" : "Skip"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
