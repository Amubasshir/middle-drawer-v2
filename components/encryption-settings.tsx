"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Lock, Key, Shield, Eye, EyeOff, Copy, RefreshCw } from "lucide-react"

export function EncryptionSettings() {
  const [encryptionType, setEncryptionType] = useState<"e2ee" | "site">("site")
  const [masterPassword, setMasterPassword] = useState("")
  const [generatedPassword, setGeneratedPassword] = useState("WP-7K9M-X3R8-Q2N5-F6H1")
  const [showPassword, setShowPassword] = useState(false)
  const [isPasswordCopied, setIsPasswordCopied] = useState(false)

  const generateNewPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    const segments = []
    for (let i = 0; i < 4; i++) {
      let segment = ""
      for (let j = 0; j < 4; j++) {
        segment += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      segments.push(segment)
    }
    setGeneratedPassword(`WP-${segments.join("-")}`)
  }

  const copyPassword = () => {
    navigator.clipboard.writeText(generatedPassword)
    setIsPasswordCopied(true)
    setTimeout(() => setIsPasswordCopied(false), 2000)
  }

  const handleSave = () => {
    console.log("[v0] Saving encryption settings:", {
      encryptionType,
      masterPassword: masterPassword ? "[HIDDEN]" : "",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Data Encryption
        </CardTitle>
        <CardDescription>Choose how your sensitive account information is protected</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={encryptionType} onValueChange={(value: "e2ee" | "site") => setEncryptionType(value)}>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <RadioGroupItem value="site" id="site" className="mt-1" />
              <div className="space-y-2 flex-1">
                <Label htmlFor="site" className="flex items-center gap-2 font-medium">
                  <Lock className="h-4 w-4" />
                  Site Encryption (Recommended)
                </Label>
                <p className="text-sm text-muted-foreground">
                  Standard user authentication with secure server-side encryption. Your data is protected with
                  industry-standard security measures.
                </p>
                <Badge variant="secondary">Easy to use</Badge>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 border rounded-lg">
              <RadioGroupItem value="e2ee" id="e2ee" className="mt-1" />
              <div className="space-y-2 flex-1">
                <Label htmlFor="e2ee" className="flex items-center gap-2 font-medium">
                  <Key className="h-4 w-4" />
                  End-to-End Encryption (E2EE)
                </Label>
                <p className="text-sm text-muted-foreground">
                  Maximum security with client-side encryption. Only you can decrypt your data using a master password.
                  Even we cannot access your information.
                </p>
                <Badge variant="outline">Maximum security</Badge>
              </div>
            </div>
          </div>
        </RadioGroup>

        {encryptionType === "e2ee" && (
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium flex items-center gap-2">
              <Key className="h-4 w-4" />
              E2EE Configuration
            </h4>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Generated Master Password</Label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={generatedPassword}
                      readOnly
                      className="font-mono pr-20"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                      <Button type="button" variant="ghost" size="sm" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={copyPassword}>
                    {isPasswordCopied ? "Copied!" : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={generateNewPassword}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  <strong>Important:</strong> Write this password down and store it safely. If you lose it, your data
                  cannot be recovered.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Master Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Re-enter the master password"
                  value={masterPassword}
                  onChange={(e) => setMasterPassword(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        <Button onClick={handleSave} className="w-full">
          Save Encryption Settings
        </Button>
      </CardContent>
    </Card>
  )
}
