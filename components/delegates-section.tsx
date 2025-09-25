"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Plus, Edit, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Delegate {
  id: string
  name: string
  relationship: string
  permissions: string[]
  notes: string
  emails: { address: string; verified: boolean }[]
  phones: { number: string; verified: boolean }[]
}

export function DelegatesSection() {
  const [delegates, setDelegates] = useState<Delegate[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      relationship: "Spouse",
      permissions: ["Full Access", "Financial", "Medical"],
      notes: "Primary contact for all decisions",
      emails: [{ address: "sarah@email.com", verified: true }],
      phones: [{ number: "(555) 123-4567", verified: true }],
    },
    {
      id: "2",
      name: "Mike Chen",
      relationship: "Brother",
      permissions: ["Emergency Only", "Medical"],
      notes: "Backup contact if Sarah unavailable",
      emails: [{ address: "mike@email.com", verified: false }],
      phones: [{ number: "(555) 987-6543", verified: true }],
    },
  ])

  const [isAddingDelegate, setIsAddingDelegate] = useState(false)
  const [editingDelegate, setEditingDelegate] = useState<Delegate | null>(null)
  const [newDelegate, setNewDelegate] = useState({
    name: "",
    relationship: "",
    permissions: "",
    notes: "",
    notificationMessage: "",
    emails: [{ address: "", verified: false }],
    phones: [{ number: "", verified: false }],
  })

  const [verificationCode, setVerificationCode] = useState("")
  const [pendingVerification, setPendingVerification] = useState<{
    delegateId: string
    contactType: "email" | "phone"
    contactValue: string
  } | null>(null)

  const addEmailField = () => {
    setNewDelegate({
      ...newDelegate,
      emails: [...newDelegate.emails, { address: "", verified: false }],
    })
  }

  const addPhoneField = () => {
    setNewDelegate({
      ...newDelegate,
      phones: [...newDelegate.phones, { number: "", verified: false }],
    })
  }

  const removeEmailField = (index: number) => {
    setNewDelegate({
      ...newDelegate,
      emails: newDelegate.emails.filter((_, i) => i !== index),
    })
  }

  const removePhoneField = (index: number) => {
    setNewDelegate({
      ...newDelegate,
      phones: newDelegate.phones.filter((_, i) => i !== index),
    })
  }

  const updateEmailField = (index: number, value: string) => {
    const updatedEmails = [...newDelegate.emails]
    updatedEmails[index].address = value
    setNewDelegate({ ...newDelegate, emails: updatedEmails })
  }

  const updatePhoneField = (index: number, value: string) => {
    const updatedPhones = [...newDelegate.phones]
    updatedPhones[index].number = value
    setNewDelegate({ ...newDelegate, phones: updatedPhones })
  }

  const sendVerificationCode = (delegateId: string, contactType: "email" | "phone", contactValue: string) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    console.log(`[v0] Sending verification code ${code} to ${contactValue}`)
    setPendingVerification({ delegateId, contactType, contactValue })
  }

  const verifyCode = () => {
    if (verificationCode.length === 6) {
      setDelegates((prev) =>
        prev.map((delegate) => {
          if (delegate.id === pendingVerification?.delegateId) {
            if (pendingVerification.contactType === "email") {
              return {
                ...delegate,
                emails: delegate.emails.map((email) =>
                  email.address === pendingVerification.contactValue ? { ...email, verified: true } : email,
                ),
              }
            } else {
              return {
                ...delegate,
                phones: delegate.phones.map((phone) =>
                  phone.number === pendingVerification.contactValue ? { ...phone, verified: true } : phone,
                ),
              }
            }
          }
          return delegate
        }),
      )
      setPendingVerification(null)
      setVerificationCode("")
    }
  }

  const handleAddDelegate = () => {
    const delegate: Delegate = {
      id: Date.now().toString(),
      name: newDelegate.name,
      relationship: newDelegate.relationship,
      permissions: newDelegate.permissions.split(",").map((p) => p.trim()),
      notes: newDelegate.notes,
      emails: newDelegate.emails.filter((email) => email.address.trim() !== ""),
      phones: newDelegate.phones.filter((phone) => phone.number.trim() !== ""),
    }
    setDelegates([...delegates, delegate])

    if (newDelegate.notificationMessage.trim()) {
      console.log(`[v0] Sending notification to ${delegate.name}: ${newDelegate.notificationMessage}`)
    }

    setNewDelegate({
      name: "",
      relationship: "",
      permissions: "",
      notes: "",
      notificationMessage: "",
      emails: [{ address: "", verified: false }],
      phones: [{ number: "", verified: false }],
    })
    setIsAddingDelegate(false)
  }

  const handleEditDelegate = (delegate: Delegate) => {
    setEditingDelegate(delegate)
    setNewDelegate({
      name: delegate.name,
      relationship: delegate.relationship,
      permissions: delegate.permissions.join(", "),
      notes: delegate.notes,
      notificationMessage: "",
      emails: [...delegate.emails],
      phones: [...delegate.phones],
    })
  }

  const handleUpdateDelegate = () => {
    if (!editingDelegate) return

    const updatedDelegate: Delegate = {
      ...editingDelegate,
      name: newDelegate.name,
      relationship: newDelegate.relationship,
      permissions: newDelegate.permissions.split(",").map((p) => p.trim()),
      notes: newDelegate.notes,
      emails: newDelegate.emails.filter((email) => email.address.trim() !== ""),
      phones: newDelegate.phones.filter((phone) => phone.number.trim() !== ""),
    }

    setDelegates((prev) => prev.map((d) => (d.id === editingDelegate.id ? updatedDelegate : d)))

    if (newDelegate.notificationMessage.trim()) {
      console.log(`[v0] Sending update notification to ${updatedDelegate.name}: ${newDelegate.notificationMessage}`)
    }

    setEditingDelegate(null)
    setNewDelegate({
      name: "",
      relationship: "",
      permissions: "",
      notes: "",
      notificationMessage: "",
      emails: [{ address: "", verified: false }],
      phones: [{ number: "", verified: false }],
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-emerald-600" />
            <CardTitle className="text-2xl">Authorized Delegates</CardTitle>
          </div>
          <Dialog open={isAddingDelegate} onOpenChange={setIsAddingDelegate}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-xl py-4 px-6">
                <Plus className="h-5 w-5 mr-2" />
                Add Delegate
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">Add New Delegate</DialogTitle>
                <DialogDescription className="text-lg">
                  Add someone who can act on your behalf in specific situations.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-lg">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newDelegate.name}
                    onChange={(e) => setNewDelegate({ ...newDelegate, name: e.target.value })}
                    placeholder="Full name"
                    className="text-lg py-3"
                  />
                </div>
                <div>
                  <Label htmlFor="relationship" className="text-lg">
                    Relationship
                  </Label>
                  <Input
                    id="relationship"
                    value={newDelegate.relationship}
                    onChange={(e) => setNewDelegate({ ...newDelegate, relationship: e.target.value })}
                    placeholder="Spouse, Family, Friend, etc."
                    className="text-lg py-3"
                  />
                </div>
                <div>
                  <Label className="text-lg">Email Addresses (at least 1 required)</Label>
                  {newDelegate.emails.map((email, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <Input
                        value={email.address}
                        onChange={(e) => updateEmailField(index, e.target.value)}
                        placeholder="email@example.com"
                        className="text-lg py-3"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => sendVerificationCode("new", "email", email.address)}
                        disabled={!email.address.includes("@")}
                        className="text-lg"
                      >
                        Verify
                      </Button>
                      {newDelegate.emails.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => removeEmailField(index)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addEmailField}
                    className="mt-2 text-lg bg-transparent"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Email
                  </Button>
                </div>
                <div>
                  <Label className="text-lg">Phone Numbers (at least 1 required)</Label>
                  {newDelegate.phones.map((phone, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <Input
                        value={phone.number}
                        onChange={(e) => updatePhoneField(index, e.target.value)}
                        placeholder="(555) 123-4567"
                        className="text-lg py-3"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => sendVerificationCode("new", "phone", phone.number)}
                        disabled={phone.number.length < 10}
                        className="text-lg"
                      >
                        Verify
                      </Button>
                      {newDelegate.phones.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => removePhoneField(index)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addPhoneField}
                    className="mt-2 text-lg bg-transparent"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Phone
                  </Button>
                </div>
                <div>
                  <Label htmlFor="permissions" className="text-lg">
                    Permissions (comma separated)
                  </Label>
                  <Input
                    id="permissions"
                    value={newDelegate.permissions}
                    onChange={(e) => setNewDelegate({ ...newDelegate, permissions: e.target.value })}
                    placeholder="Financial, Medical, Emergency Only, Full Access"
                    className="text-lg py-3"
                  />
                </div>
                <div>
                  <Label htmlFor="notes" className="text-lg">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    value={newDelegate.notes}
                    onChange={(e) => setNewDelegate({ ...newDelegate, notes: e.target.value })}
                    placeholder="Special instructions or limitations"
                    className="text-lg"
                  />
                </div>
                <div>
                  <Label htmlFor="notificationMessage" className="text-lg">
                    Notification Message (optional)
                  </Label>
                  <Textarea
                    id="notificationMessage"
                    value={newDelegate.notificationMessage}
                    onChange={(e) => setNewDelegate({ ...newDelegate, notificationMessage: e.target.value })}
                    placeholder="Message to send to the delegate about their new role"
                    className="text-lg"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingDelegate(false)} className="text-lg py-3 px-6">
                  Cancel
                </Button>
                <Button onClick={handleAddDelegate} className="bg-emerald-600 hover:bg-emerald-700 text-lg py-3 px-6">
                  Add Delegate
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription className="text-lg">
          People authorized to access your accounts and make decisions on your behalf
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {delegates.map((delegate) => (
            <div key={delegate.id} className="flex items-start justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-xl">{delegate.name}</span>
                  <Badge variant="outline" className="text-sm">
                    {delegate.relationship}
                  </Badge>
                </div>
                <div className="mb-2">
                  <p className="text-lg font-medium mb-1">Contact Information:</p>
                  <div className="space-y-1">
                    {delegate.emails.map((email, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-base">{email.address}</span>
                        <Badge variant={email.verified ? "default" : "secondary"} className="text-xs">
                          {email.verified ? "Verified" : "Unverified"}
                        </Badge>
                      </div>
                    ))}
                    {delegate.phones.map((phone, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-base">{phone.number}</span>
                        <Badge variant={phone.verified ? "default" : "secondary"} className="text-xs">
                          {phone.verified ? "Verified" : "Unverified"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {delegate.permissions.map((permission, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {permission}
                    </Badge>
                  ))}
                </div>
                {delegate.notes && <p className="text-base text-muted-foreground">{delegate.notes}</p>}
              </div>
              <div className="flex gap-2">
                <Button size="lg" variant="ghost" onClick={() => handleEditDelegate(delegate)} className="text-lg">
                  <Edit className="h-5 w-5" />
                </Button>
                <Button size="lg" variant="ghost" className="text-red-600 hover:text-red-700 text-lg">
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <Dialog open={!!pendingVerification} onOpenChange={() => setPendingVerification(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">Verify Contact Information</DialogTitle>
            <DialogDescription className="text-lg">
              Enter the 6-digit code sent to {pendingVerification?.contactValue}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="text-2xl text-center py-4"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingVerification(null)} className="text-lg py-3 px-6">
              Cancel
            </Button>
            <Button onClick={verifyCode} disabled={verificationCode.length !== 6} className="text-lg py-3 px-6">
              Verify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={!!editingDelegate} onOpenChange={() => setEditingDelegate(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Edit Delegate</DialogTitle>
            <DialogDescription className="text-lg">Update delegate information and permissions.</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <Label htmlFor="edit-name" className="text-lg">
                Name
              </Label>
              <Input
                id="edit-name"
                value={newDelegate.name}
                onChange={(e) => setNewDelegate({ ...newDelegate, name: e.target.value })}
                placeholder="Full name"
                className="text-lg py-3"
              />
            </div>
            <div>
              <Label htmlFor="edit-relationship" className="text-lg">
                Relationship
              </Label>
              <Input
                id="edit-relationship"
                value={newDelegate.relationship}
                onChange={(e) => setNewDelegate({ ...newDelegate, relationship: e.target.value })}
                placeholder="Spouse, Family, Friend, etc."
                className="text-lg py-3"
              />
            </div>
            <div>
              <Label htmlFor="edit-permissions" className="text-lg">
                Permissions (comma separated)
              </Label>
              <Input
                id="edit-permissions"
                value={newDelegate.permissions}
                onChange={(e) => setNewDelegate({ ...newDelegate, permissions: e.target.value })}
                placeholder="Financial, Medical, Emergency Only, Full Access"
                className="text-lg py-3"
              />
            </div>
            <div>
              <Label htmlFor="edit-notes" className="text-lg">
                Notes
              </Label>
              <Textarea
                id="edit-notes"
                value={newDelegate.notes}
                onChange={(e) => setNewDelegate({ ...newDelegate, notes: e.target.value })}
                placeholder="Special instructions or limitations"
                className="text-lg"
              />
            </div>
            <div>
              <Label htmlFor="edit-notificationMessage" className="text-lg">
                Update Notification Message (optional)
              </Label>
              <Textarea
                id="edit-notificationMessage"
                value={newDelegate.notificationMessage}
                onChange={(e) => setNewDelegate({ ...newDelegate, notificationMessage: e.target.value })}
                placeholder="Message to send to the delegate about the updates"
                className="text-lg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingDelegate(null)} className="text-lg py-3 px-6">
              Cancel
            </Button>
            <Button onClick={handleUpdateDelegate} className="bg-emerald-600 hover:bg-emerald-700 text-lg py-3 px-6">
              Update Delegate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
