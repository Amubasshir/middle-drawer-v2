"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Shield, Receipt, Car, Home, Smartphone } from "lucide-react"

interface GuidedSetupProps {
  isOpen: boolean
  onClose: () => void
}

export function GuidedSetup({ isOpen, onClose }: GuidedSetupProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [responses, setResponses] = useState<Record<string, string>>({})

  const categories = [
    {
      id: "banking",
      title: "Bank Accounts",
      icon: CreditCard,
      description: "Checking, savings, credit cards, investment accounts",
      placeholder: "e.g., 2 checking accounts, 1 savings, 3 credit cards...",
    },
    {
      id: "insurance",
      title: "Insurance Policies",
      icon: Shield,
      description: "Health, auto, home, life insurance",
      placeholder: "e.g., Health insurance through work, auto with GEICO, homeowners...",
    },
    {
      id: "taxes",
      title: "Tax-Related Accounts",
      icon: Receipt,
      description: "Tax preparation services, retirement accounts, HSA",
      placeholder: "e.g., TurboTax account, 401k with Fidelity, HSA...",
    },
    {
      id: "housing",
      title: "Housing & Utilities",
      icon: Home,
      description: "Mortgage/rent, electricity, gas, water, internet",
      placeholder: "e.g., Mortgage with Wells Fargo, electric with PG&E, Comcast internet...",
    },
    {
      id: "transportation",
      title: "Transportation",
      icon: Car,
      description: "Car payments, gas cards, public transit, rideshare",
      placeholder: "e.g., Car loan with Toyota Financial, Shell gas card...",
    },
    {
      id: "subscriptions",
      title: "Subscriptions & Services",
      icon: Smartphone,
      description: "Phone, streaming, software, memberships",
      placeholder: "e.g., Verizon phone, Netflix, Spotify, gym membership...",
    },
  ]

  const handleInputChange = (categoryId: string, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [categoryId]: value,
    }))
  }

  const handleNext = () => {
    if (currentStep < categories.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Process responses and close
      console.log("Setup responses:", responses)
      onClose()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const currentCategory = categories[currentStep]
  const IconComponent = currentCategory.icon

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">Let's Set Up Your WhichPoint</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="flex justify-center space-x-2 mb-6">
            {categories.map((_, index) => (
              <div key={index} className={`w-3 h-3 rounded-full ${index <= currentStep ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>

          {/* Current category */}
          <Card className="border-primary/20">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <IconComponent className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">{currentCategory.title}</CardTitle>
              <p className="text-muted-foreground text-sm">{currentCategory.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="response" className="text-base font-medium">
                  Tell us about your {currentCategory.title.toLowerCase()}:
                </Label>
                <Textarea
                  id="response"
                  placeholder={currentCategory.placeholder}
                  value={responses[currentCategory.id] || ""}
                  onChange={(e) => handleInputChange(currentCategory.id, e.target.value)}
                  className="mt-2 min-h-[150px]"
                />
              </div>

              <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded">
                <strong>Tip:</strong> Include as much or as little detail as you want. You can always add more accounts
                later, but this helps us get you started quickly.
              </div>
            </CardContent>
          </Card>

          {/* Navigation buttons */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
              Previous
            </Button>

            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {categories.length}
            </div>

            <Button onClick={handleNext}>{currentStep === categories.length - 1 ? "Finish Setup" : "Next"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
