"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Clock, Zap, X } from "lucide-react"
import { useState } from "react"
import CognitiveWellnessModal from "./cognitive-wellness-modal"

export function BrainTrackingOptions() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showCognitiveModal, setShowCognitiveModal] = useState(false)
  const [showSampleTest, setShowSampleTest] = useState(false)

  const options = [
    {
      id: "quick",
      title: "Quick Check",
      duration: "1 minute",
      description: "Simple cognitive assessment with word memory tasks",
      icon: Zap,
      color: "bg-green-50 border-green-200 hover:bg-green-100",
    },
    {
      id: "comprehensive",
      title: "Comprehensive Test",
      duration: "5-10 minutes",
      description: "Detailed cognitive evaluation with multiple test types",
      icon: Brain,
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    },
    {
      id: "none",
      title: "Skip for Now",
      duration: "0 minutes",
      description: "Continue without cognitive tracking",
      icon: X,
      color: "bg-gray-50 border-gray-200 hover:bg-gray-100",
    },
  ]

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId)
    // Quick Check no longer brings up the walkthrough window
  }

  return (
    <>
      <Card className="border-2 border-primary/20">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Brain className="h-6 w-6 text-primary" />
            <CardTitle className="text-lg">Cognitive Wellness Options</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Optional brain health tracking to monitor cognitive wellness over time
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {options.map((option) => {
              const IconComponent = option.icon
              return (
                <Button
                  key={option.id}
                  variant="outline"
                  className={`h-auto p-4 flex flex-col items-center space-y-2 ${option.color} ${
                    selectedOption === option.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => handleOptionSelect(option.id)}
                >
                  <IconComponent className="h-8 w-8 text-primary" />
                  <div className="text-center">
                    <p className="font-semibold text-sm">{option.title}</p>
                    <Badge variant="secondary" className="text-xs mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {option.duration}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
                  </div>
                </Button>
              )
            })}
          </div>

          {selectedOption && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  {selectedOption === "quick" &&
                    "Quick cognitive check selected - simple puzzles to track basic cognitive function"}
                  {selectedOption === "comprehensive" &&
                    "Comprehensive test selected - detailed assessment of memory, reaction time, and visual processing"}
                  {selectedOption === "none" && "Cognitive tracking disabled - you can enable this later in settings"}
                </p>

                {(selectedOption === "quick" || selectedOption === "comprehensive") && (
                  <Button variant="outline" size="sm" onClick={() => setShowSampleTest(true)} className="mt-2">
                    <Brain className="h-4 w-4 mr-2" />
                    Try Sample Test
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <CognitiveWellnessModal isOpen={showCognitiveModal} onClose={() => setShowCognitiveModal(false)} />
      <CognitiveWellnessModal isOpen={showSampleTest} onClose={() => setShowSampleTest(false)} />
    </>
  )
}
