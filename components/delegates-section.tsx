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
}

export function DelegatesSection() {
  const [delegates, setDelegates] = useState<Delegate[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      relationship: "Spouse",
      permissions: ["Full Access", "Financial", "Medical"],
      notes: "Primary contact for all decisions",
    },
    {
      id: "2",
      name: "Mike Chen",
      relationship: "Brother",
      permissions: ["Emergency Only", "Medical"],
      notes: "Backup contact if Sarah unavailable",
    },
  ])

  const [isAddingDelegate, setIsAddingDelegate] = useState(false)
  const [newDelegate, setNewDelegate] = useState({
    name: "",
    relationship: "",
    permissions: "",
    notes: "",
  })

  const handleAddDelegate = () => {
    const delegate: Delegate = {
      id: Date.now().toString(),
      name: newDelegate.name,
      relationship: newDelegate.relationship,
      permissions: newDelegate.permissions.split(",").map((p) => p.trim()),
      notes: newDelegate.notes,
    }
    setDelegates([...delegates, delegate])
    setNewDelegate({ name: "", relationship: "", permissions: "", notes: "" })
    setIsAddingDelegate(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-emerald-600" />
            <CardTitle>Authorized Delegates</CardTitle>
          </div>
          <Dialog open={isAddingDelegate} onOpenChange={setIsAddingDelegate}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-1" />
                Add Delegate
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Delegate</DialogTitle>
                <DialogDescription>Add someone who can act on your behalf in specific situations.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newDelegate.name}
                    onChange={(e) => setNewDelegate({ ...newDelegate, name: e.target.value })}
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <Label htmlFor="relationship">Relationship</Label>
                  <Input
                    id="relationship"
                    value={newDelegate.relationship}
                    onChange={(e) => setNewDelegate({ ...newDelegate, relationship: e.target.value })}
                    placeholder="Spouse, Family, Friend, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="permissions">Permissions (comma separated)</Label>
                  <Input
                    id="permissions"
                    value={newDelegate.permissions}
                    onChange={(e) => setNewDelegate({ ...newDelegate, permissions: e.target.value })}
                    placeholder="Financial, Medical, Emergency Only, Full Access"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newDelegate.notes}
                    onChange={(e) => setNewDelegate({ ...newDelegate, notes: e.target.value })}
                    placeholder="Special instructions or limitations"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingDelegate(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddDelegate} className="bg-emerald-600 hover:bg-emerald-700">
                  Add Delegate
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription>People authorized to access your accounts and make decisions on your behalf</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {delegates.map((delegate) => (
            <div key={delegate.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{delegate.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {delegate.relationship}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {delegate.permissions.map((permission, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {permission}
                    </Badge>
                  ))}
                </div>
                {delegate.notes && <p className="text-sm text-muted-foreground">{delegate.notes}</p>}
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
