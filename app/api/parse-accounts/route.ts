import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

const AccountSchema = z.object({
  accounts: z.array(
    z.object({
      name: z.string().describe("The name or description of the account"),
      type: z.string().describe("The type of account (checking, savings, credit card, insurance, etc.)"),
      institution: z.string().optional().describe("The financial institution or company name"),
      category: z.string().describe("The category this account belongs to"),
    }),
  ),
})

export async function POST(request: NextRequest) {
  try {
    const { category, userInput } = await request.json()

    if (!userInput || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const categoryDescriptions = {
      banking: "bank accounts, checking, savings, credit cards, investment accounts",
      insurance: "insurance policies including health, auto, home, life insurance",
      taxes: "tax-related accounts, retirement accounts, HSA, tax preparation services",
      housing: "housing and utilities including mortgage, rent, electricity, gas, water, internet",
      transportation: "transportation including car payments, gas cards, public transit, rideshare",
      subscriptions: "subscriptions and services including phone, streaming, software, memberships",
      professionals:
        "doctors, lawyers, and personnel including healthcare providers, legal counsel, financial advisors, contractors",
    }

    const result = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: AccountSchema,
      prompt: `Parse the following user input about their ${categoryDescriptions[category as keyof typeof categoryDescriptions] || category} and extract structured account information:

User input: "${userInput}"

Extract each account mentioned and categorize them appropriately. For each account, identify:
- The name or description of the account
- The type of account (be specific: checking, savings, credit card, auto insurance, health insurance, etc.)
- The institution or company name if mentioned
- Assign the category as "${category}"

Be thorough but only extract accounts that are clearly mentioned. If the user mentions quantities (like "2 checking accounts"), create separate entries if possible, or use descriptive names.`,
    })

    return NextResponse.json(result.object)
  } catch (error) {
    console.error("Error parsing accounts:", error)
    return NextResponse.json({ error: "Failed to parse accounts" }, { status: 500 })
  }
}
