"use server"

import { createClient } from "@/lib/supabase/server"

export async function saveWellnessCheck(data: {
  question: string
  answer: string
  score: number
}) {
  try {
    const supabase = await createClient()

    // Since we're using local authentication, we'll use a consistent user ID
    // In a real app, this would come from the authenticated user context
    const userId = "local-user-1" // This could be passed from the client or derived from session

    const { data: result, error } = await supabase.from("wellness_checks").insert({
      user_id: userId,
      question: data.question,
      answer: data.answer,
      score: data.score,
    })

    if (error) {
      console.log("[v0] Supabase error:", error.message)
      return { success: false, error: error.message }
    }

    console.log("[v0] Wellness check saved successfully")
    return { success: true, data: result }
  } catch (error) {
    console.log("[v0] Server action error:", error)
    return { success: false, error: "Failed to save wellness check" }
  }
}
