"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { Loader2, ArrowLeft } from "lucide-react"

export function AuthForms() {
  const { login, signup, isLoading } = useAuth()
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [signupForm, setSignupForm] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState("")
  const [showTwoFA, setShowTwoFA] = useState(false)
  const [twoFACode, setTwoFACode] = useState("")
  const [pendingAuth, setPendingAuth] = useState<{ type: "login" | "signup"; data: any } | null>(null)

  const generateTwoFACode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  const sendTwoFACode = (email: string) => {
    const code = generateTwoFACode()
    console.log(`[v0] Sending 2FA code ${code} to ${email}`)
    // In a real app, this would send an email
    return code
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const code = sendTwoFACode(loginForm.email)
    setPendingAuth({ type: "login", data: { ...loginForm, expectedCode: code } })
    setShowTwoFA(true)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (signupForm.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    const code = sendTwoFACode(signupForm.email)
    setPendingAuth({ type: "signup", data: { ...signupForm, expectedCode: code } })
    setShowTwoFA(true)
  }

  const handleTwoFAVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!pendingAuth) return

    if (twoFACode !== pendingAuth.data.expectedCode) {
      setError("Invalid verification code")
      return
    }

    if (pendingAuth.type === "login") {
      const success = await login(pendingAuth.data.email, pendingAuth.data.password)
      if (!success) {
        setError("Invalid email or password")
        setShowTwoFA(false)
        setPendingAuth(null)
        setTwoFACode("")
      }
    } else {
      const success = await signup(pendingAuth.data.name, pendingAuth.data.email, pendingAuth.data.password)
      if (!success) {
        setError("User with this email already exists")
        setShowTwoFA(false)
        setPendingAuth(null)
        setTwoFACode("")
      }
    }
  }

  const handleBackToAuth = () => {
    setShowTwoFA(false)
    setPendingAuth(null)
    setTwoFACode("")
    setError("")
  }

  if (showTwoFA) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-orange-600">Email Verification</CardTitle>
            <CardDescription className="text-lg">
              We've sent a 6-digit code to {pendingAuth?.data.email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTwoFAVerification} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="twofa-code" className="text-lg">
                  Verification Code
                </Label>
                <Input
                  id="twofa-code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={twoFACode}
                  onChange={(e) => setTwoFACode(e.target.value)}
                  maxLength={6}
                  className="text-2xl text-center py-4"
                  required
                />
              </div>
              {error && <p className="text-base text-red-600">{error}</p>}
              <div className="space-y-3">
                <Button type="submit" className="w-full text-lg py-4" disabled={isLoading || twoFACode.length !== 6}>
                  {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                  Verify & Continue
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full text-lg py-4 bg-transparent"
                  onClick={handleBackToAuth}
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back to Login
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-orange-600">Middle Drawer</CardTitle>
          <CardDescription className="text-lg">
            Manage your digital footprint and financial responsibilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" className="text-lg py-3">
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="text-lg py-3">
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="login-email" className="text-lg">
                    Email
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="text-lg py-3"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="login-password" className="text-lg">
                    Password
                  </Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="text-lg py-3"
                    required
                  />
                </div>
                {error && <p className="text-base text-red-600">{error}</p>}
                <Button type="submit" className="w-full text-lg py-4" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                  Login with 2FA
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="signup-name" className="text-lg">
                    Full Name
                  </Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={signupForm.name}
                    onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                    className="text-lg py-3"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="signup-email" className="text-lg">
                    Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    className="text-lg py-3"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="signup-password" className="text-lg">
                    Password
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password (min 6 characters)"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    className="text-lg py-3"
                    required
                  />
                </div>
                {error && <p className="text-base text-red-600">{error}</p>}
                <Button type="submit" className="w-full text-lg py-4" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                  Sign Up with 2FA
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
