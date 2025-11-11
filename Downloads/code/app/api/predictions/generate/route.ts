import { createClient } from "@/lib/server"
import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's profile and cycle data
    const { data: profile } = await supabase
      .from("profiles")
      .select("cycle_length, period_length")
      .eq("id", user.id)
      .single()

    const { data: cycleData } = await supabase
      .from("cycle_data")
      .select("*")
      .eq("user_id", user.id)
      .order("period_start_date", { ascending: false })
      .limit(6)

    if (!profile || !cycleData || cycleData.length === 0) {
      return NextResponse.json({ error: "Insufficient data for predictions" }, { status: 400 })
    }

    // Prepare data for AI analysis
    const cycleHistory = cycleData
      .map((entry) => `Date: ${entry.period_start_date}, Flow: ${entry.flow_intensity}`)
      .join("\n")

    // Generate prediction using AI
    const prompt = `
Based on the following menstrual cycle data:
- Average cycle length: ${profile.cycle_length} days
- Average period length: ${profile.period_length} days
- Recent cycle history:
${cycleHistory}

Generate a JSON prediction with the following structure:
{
  "next_period_date": "YYYY-MM-DD",
  "fertile_window_start": "YYYY-MM-DD",
  "fertile_window_end": "YYYY-MM-DD",
  "predicted_phase": "menstrual|follicular|ovulation|luteal",
  "confidence": 0-100,
  "health_insights": ["insight1", "insight2", "insight3"]
}

Return ONLY valid JSON, no markdown or additional text.
`

    const { text } = await generateText({
      model: "openai/gpt-4-turbo",
      prompt: prompt,
    })

    // Parse AI response
    let predictionData
    try {
      predictionData = JSON.parse(text)
    } catch {
      // Fallback calculation if AI response is invalid
      const lastCycle = cycleData[0]
      const lastPeriodStart = new Date(lastCycle.period_start_date)
      const nextPeriodStart = new Date(lastPeriodStart.getTime() + profile.cycle_length * 24 * 60 * 60 * 1000)
      const fertileStart = new Date(nextPeriodStart.getTime() - 14 * 24 * 60 * 60 * 1000)
      const fertileEnd = new Date(fertileStart.getTime() + 5 * 24 * 60 * 60 * 1000)

      predictionData = {
        next_period_date: nextPeriodStart.toISOString().split("T")[0],
        fertile_window_start: fertileStart.toISOString().split("T")[0],
        fertile_window_end: fertileEnd.toISOString().split("T")[0],
        predicted_phase: "follicular",
        confidence: 75,
        health_insights: [
          "Track symptoms for better predictions",
          "Stay hydrated during your cycle",
          "Regular sleep improves cycle regularity",
        ],
      }
    }

    // Save prediction to database
    const { data: savedPrediction, error } = await supabase
      .from("predictions")
      .insert({
        user_id: user.id,
        prediction_date: new Date().toISOString().split("T")[0],
        next_period_date: predictionData.next_period_date,
        fertile_window_start: predictionData.fertile_window_start,
        fertile_window_end: predictionData.fertile_window_end,
        predicted_phase: predictionData.predicted_phase,
        confidence: predictionData.confidence,
        health_insights: predictionData.health_insights,
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to save prediction" }, { status: 500 })
    }

    return NextResponse.json(savedPrediction)
  } catch (error) {
    console.error("Prediction error:", error)
    return NextResponse.json({ error: "Failed to generate prediction" }, { status: 500 })
  }
}
