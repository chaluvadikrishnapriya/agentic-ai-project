import { createClient } from "@/lib/server"
import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user || user.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch user data
    const [profileRes, predictionsRes, cycleDataRes, billsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase
        .from("predictions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single(),
      supabase
        .from("cycle_data")
        .select("*")
        .eq("user_id", user.id)
        .order("period_start_date", { ascending: false })
        .limit(6),
      supabase.from("bills").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
    ])

    // Build context
    let context = "Current cycle phase: "
    const currentPhase = predictionsRes.data?.predicted_phase || "unknown"
    context += currentPhase + "\n"

    if (cycleDataRes.data && cycleDataRes.data.length > 0) {
      const symptoms = cycleDataRes.data.flatMap((d) => d.symptoms || []).filter((v, i, a) => a.indexOf(v) === i)
      if (symptoms.length > 0) {
        context += `Recent symptoms: ${symptoms.join(", ")}\n`
      }
    }

    if (billsRes.data && billsRes.data.length > 0) {
      context += `Has tracked medical expenses\n`
    }

    // Generate recommendations
    const prompt = `Based on the following user data:
${context}

Generate 8-10 personalized health recommendations in JSON format. Include recommendations for:
- Nutrition (based on cycle phase)
- Exercise (based on cycle phase)
- Wellness/lifestyle (based on cycle phase and symptoms)
- Medical/health (based on tracked symptoms or expenses)

Return a JSON object with this structure:
{
  "recommendations": [
    {
      "id": "rec_1",
      "category": "nutrition|exercise|wellness|medical",
      "title": "Recommendation title",
      "description": "Brief description",
      "details": ["detail1", "detail2", "detail3"],
      "phase": "${currentPhase}",
      "priority": "high|medium|low"
    }
  ]
}

Focus on evidence-based recommendations for menstrual health and wellness.`

    const { text } = await generateText({
      model: "openai/gpt-4-turbo",
      prompt: prompt,
      temperature: 0.7,
      maxTokens: 1500,
    })

    // Parse and return recommendations
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Invalid response format")
    }

    const result = JSON.parse(jsonMatch[0])
    return NextResponse.json(result)
  } catch (error) {
    console.error("Recommendations error:", error)
    return NextResponse.json({ error: "Failed to generate recommendations", recommendations: [] }, { status: 500 })
  }
}
