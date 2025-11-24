"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Mail, Phone, Plus, Trash2, Users } from "lucide-react"

interface EmergencyContact {
  id: string
  name: string
  email: string
  phone: string
  daysToContact: number
  relationship: string
}

interface ContactPreferences {
  reminderFrequency: string
  reminderMethod: string
  userEmail: string
  userPhone: string
  emergencyContacts: EmergencyContact[]
}

export function ContactSettings() {
  const [preferences, setPreferences] = useState<ContactPreferences>({
    reminderFrequency: "weekly",
    reminderMethod: "email",
    userEmail: "",
    userPhone: "",
    emergencyContacts: [
      {
        id: "1",
        name: "",
        email: "",
        phone: "",
        daysToContact: 3,
        relationship: "spouse",
      },
    ],
  })

  const addEmergencyContact = () => {
    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      name: "",
      email: "",
      phone: "",
      daysToContact: 7,
      relationship: "family",
    }
    setPreferences((prev) => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, newContact],
    }))
  }

  const removeEmergencyContact = (id: string) => {
    setPreferences((prev) => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((contact) => contact.id !== id),
    }))
  }

  const updateEmergencyContact = (id: string, field: keyof EmergencyContact, value: string | number) => {
    setPreferences((prev) => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.map((contact) =>
        contact.id === id ? { ...contact, [field]: value } : contact,
      ),
    }))
  }

  const handleSave = () => {
    // TODO: Save to database
    console.log("Saving contact preferences:", preferences)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Reminder Settings
          </CardTitle>
          <CardDescription>Configure how often WhichPoint should remind you about upcoming payments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="frequency">Reminder Frequency</Label>
              <Select
                value={preferences.reminderFrequency}
                onValueChange={(value) => setPreferences((prev) => ({ ...prev, reminderFrequency: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">Contact Method</Label>
              <Select
                value={preferences.reminderMethod}
                onValueChange={(value) => setPreferences((prev) => ({ ...prev, reminderMethod: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email Only</SelectItem>
                  <SelectItem value="text">Text Only</SelectItem>
                  <SelectItem value="both">Both Email & Text</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Your Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={preferences.userEmail}
                onChange={(e) => setPreferences((prev) => ({ ...prev, userEmail: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Your Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={preferences.userPhone}
                onChange={(e) => setPreferences((prev) => ({ ...prev, userPhone: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Emergency Contact Escalation
          </CardTitle>
          <CardDescription>
            Set up multiple contacts to be notified at different intervals if you don't respond
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {preferences.emergencyContacts.map((contact, index) => (
            <div key={contact.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Contact {index + 1}</h4>
                {preferences.emergencyContacts.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEmergencyContact(contact.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    placeholder="Contact name"
                    value={contact.name}
                    onChange={(e) => updateEmergencyContact(contact.id, "name", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Relationship</Label>
                  <Select
                    value={contact.relationship}
                    onValueChange={(value) => updateEmergencyContact(contact.id, "relationship", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spouse">Spouse/Partner</SelectItem>
                      <SelectItem value="family">Family Member</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="neighbor">Neighbor</SelectItem>
                      <SelectItem value="colleague">Colleague</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="contact@email.com"
                    value={contact.email}
                    onChange={(e) => updateEmergencyContact(contact.id, "email", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={contact.phone}
                    onChange={(e) => updateEmergencyContact(contact.id, "phone", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Contact after how many days of no response?</Label>
                <Select
                  value={contact.daysToContact.toString()}
                  onValueChange={(value) => updateEmergencyContact(contact.id, "daysToContact", Number.parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 day</SelectItem>
                    <SelectItem value="2">2 days</SelectItem>
                    <SelectItem value="3">3 days</SelectItem>
                    <SelectItem value="5">5 days</SelectItem>
                    <SelectItem value="7">1 week</SelectItem>
                    <SelectItem value="14">2 weeks</SelectItem>
                    <SelectItem value="21">3 weeks</SelectItem>
                    <SelectItem value="30">1 month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}

          <Button variant="outline" onClick={addEmergencyContact} className="w-full bg-transparent">
            <Plus className="h-4 w-4 mr-2" />
            Add Another Emergency Contact
          </Button>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full">
        Save Contact Settings
      </Button>
    </div>
  )
}
