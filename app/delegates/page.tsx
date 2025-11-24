"use client"

import { DelegatesSection } from "@/components/delegates-section"
import { StatusBar } from "@/components/status-bar"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function DelegatesPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      {user && <StatusBar />}

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-2">Trusted Delegates</h1>
          <p className="text-xl text-muted-foreground">
            Manage people who are authorized to access your accounts and make decisions on your behalf
          </p>
        </div>

        <DelegatesSection />
      </div>
    </div>
  )
}
