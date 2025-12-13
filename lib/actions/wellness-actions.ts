"use server"

import { createClient } from "@/lib/supabase/server"

// export async function saveWellnessCheck(data: {
//   question: string
//   answer: string
//   score: number
// }) {
//   try {
//     const supabase = await createClient()

//     // Since we're using local authentication, we'll use a consistent user ID
//     // In a real app, this would come from the authenticated user context
//     const userId = "local-user-1" // This could be passed from the client or derived from session

//     const { data: result, error } = await supabase.from("wellness_checks").insert({
//       user_id: userId,
//       question: data.question,
//       answer: data.answer,
//       score: data.score,
//     })

//     if (error) {
//       console.log("[v0] Supabase error:", error.message)
//       return { success: false, error: error.message }
//     }

//     console.log("[v0] Wellness check saved successfully")
//     return { success: true, data: result }
//   } catch (error) {
//     console.log("[v0] Server action error:", error)
//     return { success: false, error: "Failed to save wellness check" }
//   }
// }


export async function saveWellnessCheck(data: {
  check_type: string
  correctAnswer: string
  selectedWord: string
  timeTaken: number
  currentWords: string[]
  delegates: string[]
  question: number
  answer: string
  score: number
  userId: string
}) {
  try {
    const supabase = await createClient()

    // Static user id (replace with session user id in real app)
    // const userId = "6fedd312-d6dc-4482-ad12-731bfa42d4ec"

    const { data: result, error } = await supabase
      .from("wellness_checks")
      .insert([
        {
          check_type: data.check_type,
          is_correct: data.correctAnswer === data.selectedWord,
          response_time: data.timeTaken,
          response_data: {
            test_time: new Date().toISOString(),
            words: data.currentWords,
            selected_answer: data.selectedWord,
            correct_answer: data.correctAnswer,
            delegates: {
              emails: data.delegates
            }
          },
          user_id: userId,
          question, 
          answer,
          score,
        }
      ]);

      console.log({result, error})


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
