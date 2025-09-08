"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, name?: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log("[v0] AuthProvider initializing...")
    const isGuest = localStorage.getItem("whichpoint-guest")
    const storedUser = localStorage.getItem("whichpoint-user")

    console.log("[v0] Guest mode flag:", isGuest)
    console.log("[v0] Stored user:", storedUser)

    if (isGuest === "true") {
      console.log("[v0] Setting guest user")
      setUser({
        id: "guest",
        name: "Guest User",
        email: "guest@middledrawer.com",
      })
      setIsLoading(false)
      return
    }

    // Check for stored user session on mount
    if (storedUser) {
      console.log("[v0] Setting stored user")
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, name?: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user exists in localStorage
    const existingUsers = JSON.parse(localStorage.getItem("whichpoint-users") || "[]")
    const existingUser = existingUsers.find((u: any) => u.email === email)

    if (existingUser && existingUser.password === password) {
      const userData = { id: existingUser.id, name: existingUser.name, email: existingUser.email }
      setUser(userData)
      localStorage.setItem("whichpoint-user", JSON.stringify(userData))
      localStorage.removeItem("whichpoint-guest")
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem("whichpoint-users") || "[]")
    const userExists = existingUsers.some((u: any) => u.email === email)

    if (userExists) {
      setIsLoading(false)
      return false
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
    }

    const updatedUsers = [...existingUsers, newUser]
    localStorage.setItem("whichpoint-users", JSON.stringify(updatedUsers))

    const userData = { id: newUser.id, name: newUser.name, email: newUser.email }
    setUser(userData)
    localStorage.setItem("whichpoint-user", JSON.stringify(userData))
    localStorage.removeItem("whichpoint-guest")

    setIsLoading(false)
    return true
  }

  const logout = () => {
    console.log("[v0] Logging out user")
    setUser(null)
    localStorage.removeItem("whichpoint-user")
    localStorage.removeItem("whichpoint-guest")
    window.location.href = "/"
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
