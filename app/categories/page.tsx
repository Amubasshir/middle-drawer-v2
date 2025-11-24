"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CategoryOverview } from "@/components/category-overview"
import { CategoryDetail } from "@/components/category-detail"
import { TrendingUp, ArrowLeft } from "lucide-react"
import { CreditCard, PiggyBank, Shield, Indent as Investment, Zap } from "lucide-react"
import Link from "next/link"
import { StatusBar } from "@/components/status-bar"
import { useAuth } from "@/contexts/auth-context"

// Mock data for demonstration
const mockCategories = [
  {
    id: "banking",
    name: "Banking & Cash",
    icon: PiggyBank,
    color: "bg-primary",
    description: "Checking accounts, savings accounts, and cash management",
    totalAccounts: 3,
    criticalAccounts: 1,
    totalBalance: 17450.0,
    monthlyExpenses: 0,
    accounts: [
      {
        id: "1",
        name: "Chase Checking",
        type: "checking",
        institution: "Chase Bank",
        balance: 2450.0,
        priority: 1,
        status: "good",
      },
      {
        id: "2",
        name: "Emergency Savings",
        type: "savings",
        institution: "Ally Bank",
        balance: 15000.0,
        priority: 2,
        status: "good",
      },
    ],
  },
  {
    id: "credit-loans",
    name: "Credit & Loans",
    icon: CreditCard,
    color: "bg-secondary",
    description: "Credit cards, mortgages, auto loans, and personal loans",
    totalAccounts: 3,
    criticalAccounts: 3,
    totalBalance: -246250.0,
    monthlyExpenses: 2890.0,
    accounts: [
      {
        id: "3",
        name: "Capital One Venture",
        type: "credit",
        institution: "Capital One",
        balance: -1250.0,
        priority: 1,
        status: "good",
        monthlyExpense: 450.0,
        dueDate: "2024-01-12",
      },
      {
        id: "4",
        name: "Mortgage - Wells Fargo",
        type: "mortgage",
        institution: "Wells Fargo",
        balance: -245000.0,
        priority: 1,
        status: "current",
        monthlyExpense: 2440.0,
        dueDate: "2024-01-01",
      },
    ],
  },
  {
    id: "insurance",
    name: "Insurance",
    icon: Shield,
    color: "bg-accent",
    description: "Health, auto, life, and property insurance policies",
    totalAccounts: 3,
    criticalAccounts: 2,
    totalBalance: 0,
    monthlyExpenses: 890.0,
    accounts: [
      {
        id: "5",
        name: "Health Insurance",
        type: "health-insurance",
        institution: "Blue Cross Blue Shield",
        balance: 0,
        priority: 1,
        status: "current",
        monthlyExpense: 320.0,
        dueDate: "2024-01-08",
      },
      {
        id: "6",
        name: "Auto Insurance",
        type: "auto-insurance",
        institution: "State Farm",
        balance: 0,
        priority: 1,
        status: "good",
        monthlyExpense: 156.0,
        dueDate: "2024-01-15",
      },
      {
        id: "7",
        name: "Life Insurance",
        type: "life-insurance",
        institution: "Northwestern Mutual",
        balance: 0,
        priority: 3,
        status: "good",
        monthlyExpense: 85.0,
        dueDate: "2024-01-20",
      },
    ],
  },
  {
    id: "investments",
    name: "Investments",
    icon: Investment,
    color: "bg-chart-1",
    description: "Investment accounts, retirement funds, and portfolios",
    totalAccounts: 2,
    criticalAccounts: 0,
    totalBalance: 125000.0,
    monthlyExpenses: 500.0,
    accounts: [
      {
        id: "8",
        name: "401(k) - Fidelity",
        type: "retirement",
        institution: "Fidelity",
        balance: 85000.0,
        priority: 2,
        status: "good",
        monthlyExpense: 500.0,
      },
      {
        id: "9",
        name: "Robinhood Portfolio",
        type: "investment",
        institution: "Robinhood",
        balance: 40000.0,
        priority: 3,
        status: "good",
      },
    ],
  },
  {
    id: "utilities",
    name: "Utilities & Services",
    icon: Zap,
    color: "bg-chart-2",
    description: "Electric, gas, water, internet, phone, and subscription services",
    totalAccounts: 4,
    criticalAccounts: 2,
    totalBalance: 0,
    monthlyExpenses: 420.0,
    accounts: [
      {
        id: "10",
        name: "Electric Bill",
        type: "utilities",
        institution: "ConEd",
        balance: 0,
        priority: 1,
        status: "good",
        monthlyExpense: 89.5,
        dueDate: "2024-01-10",
      },
      {
        id: "11",
        name: "Internet & Cable",
        type: "phone",
        institution: "Verizon",
        balance: 0,
        priority: 1,
        status: "good",
        monthlyExpense: 120.0,
        dueDate: "2024-01-05",
      },
    ],
  },
]

export default function CategoriesPage() {
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const handleViewCategory = (categoryId: string) => {
    setSelectedCategory(categoryId)
  }

  const handleBack = () => {
    setSelectedCategory(null)
  }

  const selectedCategoryData = selectedCategory ? mockCategories.find((cat) => cat.id === selectedCategory) : null

  if (selectedCategoryData) {
    return (
      <div className="min-h-screen bg-background">
        {user && <StatusBar />}

        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Financial Categories</h1>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <CategoryDetail
            category={selectedCategoryData}
            onBack={handleBack}
            onAddAccount={() => {
              /* Handle add account */
            }}
            onEditAccount={(account) => {
              /* Handle edit account */
            }}
          />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {user && <StatusBar />}

      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">Financial Categories</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Your Financial Overview</h2>
          <p className="text-muted-foreground">
            Organize and track your financial responsibilities by category. Click on any category to view detailed
            information and manage accounts.
          </p>
        </div>

        <CategoryOverview categories={mockCategories} onViewCategory={handleViewCategory} />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-lg border border-primary/20">
            <h3 className="font-semibold text-primary mb-2">Critical Accounts</h3>
            <p className="text-2xl font-bold mb-1">
              {mockCategories.reduce((sum, cat) => sum + cat.criticalAccounts, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Accounts essential for daily functioning</p>
          </div>

          <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 p-6 rounded-lg border border-secondary/20">
            <h3 className="font-semibold text-secondary mb-2">Monthly Expenses</h3>
            <p className="text-2xl font-bold mb-1">
              ${mockCategories.reduce((sum, cat) => sum + cat.monthlyExpenses, 0).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Total recurring monthly costs</p>
          </div>

          <div className="bg-gradient-to-br from-accent/10 to-accent/5 p-6 rounded-lg border border-accent/20">
            <h3 className="font-semibold text-accent mb-2">Net Worth</h3>
            <p className="text-2xl font-bold mb-1">
              ${mockCategories.reduce((sum, cat) => sum + cat.totalBalance, 0).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Total assets minus liabilities</p>
          </div>
        </div>
      </main>
    </div>
  )
}
