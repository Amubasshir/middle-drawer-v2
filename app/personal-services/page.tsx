"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Briefcase,
  Stethoscope,
  Scale,
  DollarSign,
  HomeIcon,
  Wrench,
  Calendar,
  Phone,
  Mail,
  MapPin,
  ArrowLeft,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { StatusBar } from "@/components/status-bar"
import Link from "next/link"

export default function PersonalServicesPage() {
  const { user } = useAuth()
  const [services, setServices] = useState([
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      type: "Primary Care Physician",
      phone: "(555) 123-4567",
      email: "sjohnson@healthcenter.com",
      address: "123 Medical Plaza, Suite 200",
      nextAppt: "March 15, 2024",
      icon: Stethoscope,
    },
    {
      id: 2,
      name: "Michael Chen, Esq.",
      type: "Attorney",
      phone: "(555) 234-5678",
      email: "mchen@legalfirm.com",
      address: "456 Law Building, Floor 5",
      nextAppt: "April 2, 2024",
      icon: Scale,
    },
    {
      id: 3,
      name: "Jennifer Martinez",
      type: "Financial Advisor",
      phone: "(555) 345-6789",
      email: "jmartinez@wealthmanagement.com",
      address: "789 Finance Tower, Suite 1200",
      nextAppt: "March 28, 2024",
      icon: DollarSign,
    },
  ])

  const serviceCategories = [
    { name: "Medical", icon: Stethoscope, count: 4 },
    { name: "Legal", icon: Scale, count: 2 },
    { name: "Financial", icon: DollarSign, count: 3 },
    { name: "Home Services", icon: HomeIcon, count: 5 },
    { name: "Contractors", icon: Wrench, count: 2 },
  ]

  return (
    <div className="min-h-screen bg-background">
      {user && <StatusBar />}

      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Briefcase className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold text-foreground">Personal Services</h1>
              </div>
            </div>
            <Button size="lg" className="text-xl py-6 px-8 font-bold">
              <Plus className="h-6 w-6 mr-2" />
              Add Service Provider
            </Button>
          </div>
          <p className="text-lg text-muted-foreground">
            Manage your doctors, lawyers, financial advisors, and other professional service providers
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Service Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {serviceCategories.map((category) => {
              const IconComponent = category.icon
              return (
                <Card key={category.name} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <IconComponent className="h-10 w-10 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                    <Badge variant="secondary">{category.count} providers</Badge>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Your Service Providers</h2>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-lg px-4 py-2">
                {services.length} Total Providers
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const IconComponent = service.icon
              return (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{service.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{service.type}</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{service.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{service.email}</span>
                    </div>
                    <div className="flex items-start space-x-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span>{service.address}</span>
                    </div>
                    {service.nextAppt && (
                      <div className="flex items-center space-x-2 text-sm pt-2 border-t">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="font-medium">Next: {service.nextAppt}</span>
                      </div>
                    )}
                    <div className="flex space-x-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-xl">Why Track Personal Services?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>
              • <strong>Emergency Access:</strong> Your delegates can quickly contact your doctors, lawyers, or other
              professionals if needed
            </p>
            <p>
              • <strong>Appointment Management:</strong> Keep track of upcoming appointments and important contacts in
              one place
            </p>
            <p>
              • <strong>Continuity of Care:</strong> Ensure your trusted contacts know who to reach out to for medical,
              legal, or financial matters
            </p>
            <p>
              • <strong>Peace of Mind:</strong> Know that your important professional relationships are documented and
              accessible
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
