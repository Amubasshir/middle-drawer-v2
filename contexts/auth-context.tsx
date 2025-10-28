"use client";

import { createClient } from "@/lib/supabase/client";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
  logout: () => void;
  setGuestMode: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("[v0] AuthProvider initializing...");

    const initializeAuth = async () => {
      try {
        const supabase = createClient();

        // Check for guest mode first
        const isGuest = localStorage.getItem("whichpoint-guest");
        console.log("[v0] Guest mode flag:", isGuest);

        if (isGuest === "true") {
          console.log("[v0] Setting guest user");
          setUser({
            id: "guest",
            name: "Guest User",
            email: "guest@middledrawer.com",
          });
          setIsLoading(false);
          return;
        }

        // Get current session from Supabase
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.log("[v0] Error getting session:", error);
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          console.log("[v0] Found active session");
          const userData = {
            id: session.user.id,
            name:
              session.user.user_metadata?.full_name ||
              session.user.email?.split("@")[0] ||
              "User",
            email: session.user.email || "",
          };
          setUser(userData);
          localStorage.setItem("whichpoint-user", JSON.stringify(userData));
        } else {
          console.log("[v0] No active session found");
          localStorage.removeItem("whichpoint-user");
        }
      } catch (error) {
        console.log("[v0] Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: string, session: any) => {
      console.log("[v0] Auth state changed:", event, session?.user?.email);

      if (session?.user) {
        const userData = {
          id: session.user.id,
          name:
            session.user.user_metadata?.full_name ||
            session.user.email?.split("@")[0] ||
            "User",
          email: session.user.email || "",
        };
        setUser(userData);
        localStorage.setItem("whichpoint-user", JSON.stringify(userData));
        localStorage.removeItem("whichpoint-guest");
      } else {
        setUser(null);
        localStorage.removeItem("whichpoint-user");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const setGuestMode = () => {
    console.log("[v0] Setting guest mode");
    try {
      localStorage.setItem("whichpoint-guest", "true");
      localStorage.removeItem("whichpoint-user");
      setUser({
        id: "guest",
        name: "Guest User",
        email: "guest@middledrawer.com",
      });
      setIsLoading(false);
    } catch (error) {
      console.log("[v0] Error setting guest mode:", error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.log("[v0] Login error:", error.message);
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        const userData = {
          id: data.user.id,
          name:
            data.user.user_metadata?.full_name ||
            data.user.email?.split("@")[0] ||
            "User",
          email: data.user.email || "",
        };
        setUser(userData);
        localStorage.setItem("whichpoint-user", JSON.stringify(userData));
        localStorage.removeItem("whichpoint-guest");
        setIsLoading(false);
        return true;
      }

      setIsLoading(false);
      return false;
    } catch (error) {
      console.log("[v0] Login error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        console.log("[v0] Signup error:", error.message);
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        const userData = {
          id: data.user.id,
          name: data.user.user_metadata?.full_name || name,
          email: data.user.email || email,
        };
        setUser(userData);
        localStorage.setItem("whichpoint-user", JSON.stringify(userData));
        localStorage.removeItem("whichpoint-guest");
        setIsLoading(false);
        return true;
      }

      setIsLoading(false);
      return false;
    } catch (error) {
      console.log("[v0] Signup error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const signInWithGoogle = async (): Promise<boolean> => {
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        console.log("[v0] Google signin error:", error.message);
        setIsLoading(false);
        return false;
      }

      // The actual signin will be handled by the auth state change listener
      return true;
    } catch (error) {
      console.log("[v0] Google signin error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    console.log("[v0] Logging out user");

    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (error) {
      console.log("[v0] Logout error:", error);
    }

    setUser(null);
    localStorage.removeItem("whichpoint-user");
    localStorage.removeItem("whichpoint-guest");
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        signInWithGoogle,
        logout,
        setGuestMode,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
