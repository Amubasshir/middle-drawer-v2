import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.log("[v0] Missing environment variables:", {
      supabaseUrl: !!supabaseUrl,
      supabaseAnonKey: !!supabaseAnonKey,
      nextPublicUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      nextPublicKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      serverUrl: !!process.env.SUPABASE_URL,
      serverKey: !!process.env.SUPABASE_ANON_KEY,
    })
    return {
      from: () => ({
        insert: () => Promise.resolve({ data: null, error: null }),
        select: () => Promise.resolve({ data: [], error: null }),
        update: () => Promise.resolve({ data: null, error: null }),
        delete: () => Promise.resolve({ data: null, error: null }),
      }),
    } as any
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
