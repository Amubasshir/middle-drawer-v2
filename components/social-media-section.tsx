"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Facebook, Instagram, Twitter, Linkedin, Youtube, MessageCircle } from "lucide-react"

interface SocialMediaAccount {
  id: number
  platform: string
  username: string
  email: string
  phone: string
  recoveryEmail: string
  twoFactorEnabled: boolean
  priority: number
  status: string
}

const platformIcons = {
  Facebook: Facebook,
  Instagram: Instagram,
  Twitter: Twitter,
  LinkedIn: Linkedin,
  YouTube: Youtube,
  TikTok: MessageCircle,
  Snapchat: MessageCircle,
  WhatsApp: MessageCircle,
}

export function SocialMediaSection() {
  const [accounts, setAccounts] = useState<SocialMediaAccount[]>([
    {
      id: 1,
      platform: "Facebook",
      username: "john.doe",
      email: "john@email.com",
      phone: "+1-555-0123",
      recoveryEmail: "backup@email.com",
      twoFactorEnabled: true,
      priority: 2,
      status: "active",
    },
    {
      id: 2,
      platform: "Instagram",
      username: "@johndoe",
      email: "john@email.com",
      phone: "+1-555-0123",
      recoveryEmail: "",
      twoFactorEnabled: false,
      priority: 3,
      status: "active",
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<SocialMediaAccount | null>(null)

  const handleAddAccount = () => {
    setEditingAccount(null)
    setIsDialogOpen(true)
  }

  const handleEditAccount = (account: SocialMediaAccount) => {
    setEditingAccount(account)
    setIsDialogOpen(true)
  }

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return "bg-red-100 text-red-800"
      case 2:
        return "bg-orange-100 text-orange-800"
      case 3:
        return "bg-blue-100 text-blue-800"
      case 4:
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1:
        return "Critical"
      case 2:
        return "Important"
      case 3:
        return "Normal"
      case 4:
        return "Low"
      default:
        return "Normal"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Social Media Accounts</CardTitle>
            <CardDescription>Manage your social media accounts and recovery information</CardDescription>
          </div>
          <Button onClick={handleAddAccount} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Account
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {accounts.map((account) => {
            const IconComponent = platformIcons[account.platform as keyof typeof platformIcons] || MessageCircle
            return (
              <div key={account.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <IconComponent className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium">{account.platform}</div>
                    <div className="text-sm text-gray-600">@{account.username}</div>
                    <div className="text-xs text-gray-500">{account.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getPriorityColor(account.priority)}>{getPriorityLabel(account.priority)}</Badge>
                  {account.twoFactorEnabled && (
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      2FA
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => handleEditAccount(account)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingAccount ? "Edit Social Media Account" : "Add Social Media Account"}</DialogTitle>
            <DialogDescription>Add your social media account details and recovery information.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="platform">Platform</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="Twitter">Twitter</SelectItem>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="YouTube">YouTube</SelectItem>
                    <SelectItem value="TikTok">TikTok</SelectItem>
                    <SelectItem value="Snapchat">Snapchat</SelectItem>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="@username" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="account@email.com" />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+1-555-0123" />
              </div>
            </div>

            <div>
              <Label htmlFor="recovery-email">Recovery Email</Label>
              <Input id="recovery-email" type="email" placeholder="backup@email.com" />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="two-factor">Two-Factor Authentication</Label>
              <Switch id="two-factor" />
            </div>

            <div>
              <Label htmlFor="priority">Priority Level</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Critical</SelectItem>
                  <SelectItem value="2">Important</SelectItem>
                  <SelectItem value="3">Normal</SelectItem>
                  <SelectItem value="4">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" placeholder="Additional notes or backup codes..." />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsDialogOpen(false)}>{editingAccount ? "Update" : "Add"} Account</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
