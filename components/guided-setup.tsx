"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Shield, Receipt, Car, Home, Smartphone, MessageCircle, Users, Loader2 } from "lucide-react"

interface GuidedSetupProps {
  isOpen: boolean
  onClose: () => void
}

interface ParsedAccountData {
  accounts: Array<{
    name: string
    type: string
    institution?: string
    category: string
  }>
}

export function GuidedSetup({ isOpen, onClose }: GuidedSetupProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [parsedData, setParsedData] = useState<Record<string, ParsedAccountData>>({})

  const totalSteps = 8 // Updated to 8 steps to include new Doctors/Lawyers/Personnel section

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
    {
      id: "professionals",
      title: "Doctors, Lawyers & Personnel",
      icon: Users,
      description: "Healthcare providers, legal counsel, financial advisors, contractors",
      placeholder:
        "e.g., Dr. Smith (primary care), Johnson Law Firm, financial advisor at Merrill Lynch, house cleaner...",
    },
  ]

  const handleInputChange = (categoryId: string, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [categoryId]: value,
    }))
  }

  const parseWithOpenAI = async (categoryId: string, userInput: string) => {
    if (!userInput.trim()) return null

    setIsProcessing(true)
    try {
      const response = await fetch("/api/parse-accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: categoryId,
          userInput: userInput,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to parse accounts")
      }

      const result = await response.json()
      setParsedData((prev) => ({
        ...prev,
        [categoryId]: result,
      }))
      return result
    } catch (error) {
      console.error("Error parsing accounts:", error)
      return null
    } finally {
      setIsProcessing(false)
    }
  }

  const handleNext = async () => {
    if (currentStep > 0 && currentStep < totalSteps) {
      const categoryIndex = currentStep - 1
      const currentCategory = categories[categoryIndex]
      const userInput = responses[currentCategory.id]

      if (userInput && userInput.trim()) {
        await parseWithOpenAI(currentCategory.id, userInput)
      }
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Process all responses and close
      console.log("Setup responses:", responses)
      console.log("Parsed data:", parsedData)
      onClose()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderExplanationScreen = () => (
    <Card className="border-primary/20 flex-1 flex flex-col">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-2">
          <MessageCircle className="h-5 w-5 text-primary" />
        </div>
        <CardTitle className="text-lg">Welcome to Middle Drawer Setup</CardTitle>
        <p className="text-xs text-muted-foreground">Let's get you organized in just a few minutes</p>
      </CardHeader>
      <CardContent className="space-y-3 flex-1 flex flex-col justify-center">
        <div className="space-y-2 text-center">
          <div className="bg-primary/5 p-3 rounded-lg">
            <h3 className="font-semibold text-sm mb-2">Here's how this works:</h3>
            <div className="space-y-1.5 text-left text-xs">
              <div className="flex items-start space-x-2">
                <div className="w-4 h-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                  1
                </div>
                <p>We'll ask about your most important accounts across 7 categories</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-4 h-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                  2
                </div>
                <p>Talk to us naturally - like you're explaining to a friend</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-4 h-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                  3
                </div>
                <p>We'll use AI to parse your information and organize it for you</p>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 p-2 rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>Remember:</strong> You don't need to share sensitive information like passwords or account
              numbers. Just tell us what accounts you have and we'll help you keep track of them.
            </p>
          </div>

          <div className="bg-secondary/20 p-2 rounded-lg border border-secondary/30">
            <p className="text-xs text-muted-foreground">
              <strong>Optional:</strong> You can also add a section to briefly check how your brain is doing with a
              simple game. Although it is in no way a diagnostic or clinical tool, you can have a very simple game be
              incorporated in your "check-ins" with Middle Drawer to help track your cognitive wellness over time.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderCategoryScreen = () => {
    const categoryIndex = currentStep - 1
    const currentCategory = categories[categoryIndex]
    const IconComponent = currentCategory.icon
    const categoryParsedData = parsedData[currentCategory.id]

    return (
      <Card className="border-primary/20 flex-1 flex flex-col">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <IconComponent className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-xl">{currentCategory.title}</CardTitle>
          <p className="text-muted-foreground text-sm">{currentCategory.description}</p>
        </CardHeader>
        <CardContent className="space-y-4 flex-1 flex flex-col">
          <div className="flex-1 flex flex-col">
            <Label htmlFor="response" className="text-base font-medium">
              Tell us about your {currentCategory.title.toLowerCase()}:
            </Label>
            <Textarea
              id="response"
              placeholder={currentCategory.placeholder}
              value={responses[currentCategory.id] || ""}
              onChange={(e) => handleInputChange(currentCategory.id, e.target.value)}
              className="mt-2 flex-1 resize-none"
            />
          </div>

          {categoryParsedData && categoryParsedData.accounts && categoryParsedData.accounts.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <h4 className="font-medium text-sm text-green-800 mb-2">AI Parsed Accounts:</h4>
              <div className="space-y-1">
                {categoryParsedData.accounts.map((account, index) => (
                  <div key={index} className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
                    {account.name} ({account.type}) {account.institution && `- ${account.institution}`}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded">
            <strong>Tip:</strong> Include as much or as little detail as you want. Our AI will automatically parse and
            organize your accounts. You can always add more accounts later.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center mb-3">Let's Set Up Your Middle Drawer</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 flex-1 flex flex-col">
          {/* Progress indicator */}
          <div className="flex justify-center space-x-2 mb-6">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div key={index} className={`w-3 h-3 rounded-full ${index <= currentStep ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>

          {currentStep === 0 ? renderExplanationScreen() : renderCategoryScreen()}

          {/* Navigation buttons */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
              Previous
            </Button>

            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {totalSteps}
            </div>

            <Button onClick={handleNext} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : currentStep === 0 ? (
                "Let's Start"
              ) : currentStep === totalSteps - 1 ? (
                "Finish Setup"
              ) : (
                "Next"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
