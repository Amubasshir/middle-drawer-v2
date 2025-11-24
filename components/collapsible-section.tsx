"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight } from "lucide-react"

interface CollapsibleSectionProps {
  title: string
  icon?: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  defaultExpanded?: boolean
}

export function CollapsibleSection({ title, icon: Icon, children, defaultExpanded = false }: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <Card>
      <CardHeader className="pb-2">
        <Button
          variant="ghost"
          className="w-full justify-between p-0 h-auto hover:bg-transparent"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <CardTitle className="flex items-center gap-2 text-left">
            {Icon && <Icon className="h-5 w-5" />}
            {title}
          </CardTitle>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </CardHeader>
      {isExpanded && <CardContent className="pt-0">{children}</CardContent>}
    </Card>
  )
}
