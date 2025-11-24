"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Shield, Receipt, Car, Home, Smartphone, Users } from "lucide-react"

interface CategorySelectorProps {
  onCategorySelect: (category: string) => void
  selectedCategory?: string
}

export function CategorySelector({ onCategorySelect, selectedCategory }: CategorySelectorProps) {
  const categories = [
    {
      id: "banking",
      title: "Bank Accounts",
      icon: CreditCard,
      description: "Checking, savings, credit cards, investment accounts",
    },
    {
      id: "insurance",
      title: "Insurance Policies",
      icon: Shield,
      description: "Health, auto, home, life insurance",
    },
    {
      id: "taxes",
      title: "Tax-Related Accounts",
      icon: Receipt,
      description: "Tax preparation services, retirement accounts, HSA",
    },
    {
      id: "housing",
      title: "Housing & Utilities",
      icon: Home,
      description: "Mortgage/rent, electricity, gas, water, internet",
    },
    {
      id: "transportation",
      title: "Transportation",
      icon: Car,
      description: "Car payments, gas cards, public transit, rideshare",
    },
    {
      id: "subscriptions",
      title: "Subscriptions & Services",
      icon: Smartphone,
      description: "Phone, streaming, software, memberships",
    },
    {
      id: "professionals",
      title: "Doctors, Lawyers & Personnel",
      icon: Users,
      description: "Healthcare providers, legal counsel, financial advisors, contractors",
    },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Choose Account Category</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => {
          const IconComponent = category.icon
          const isSelected = selectedCategory === category.id

          return (
            <Card
              key={category.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? "ring-2 ring-primary bg-primary/5" : ""
              }`}
              onClick={() => onCategorySelect(category.id)}
            >
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <IconComponent className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-base">{category.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground text-center">{category.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
