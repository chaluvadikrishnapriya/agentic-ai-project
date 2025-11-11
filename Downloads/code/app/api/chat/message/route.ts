export const runtime = "nodejs"
import { createClient } from "@/lib/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { userId, message } = await request.json()
    if (!message) return NextResponse.json({ error: "Message is required" }, { status: 400 })

    // Supabase client
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.id !== userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // Fetch user data
    const [profileRes, predictionsRes, cycleDataRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("predictions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).single(),
      supabase.from("cycle_data").select("*").eq("user_id", user.id).order("period_start_date", { ascending: false }).limit(3),
    ])

    // Build AI context
    let context = "You are a helpful menstrual health assistant. "
    if (profileRes.data) context += `Cycle: ${profileRes.data.cycle_length} days, Period: ${profileRes.data.period_length} days. `
    if (predictionsRes.data) context += `Next period: ${predictionsRes.data.next_period_date}, Phase: ${predictionsRes.data.predicted_phase}. `
    if (cycleDataRes.data?.length) {
      const recentSymptoms = cycleDataRes.data.flatMap(d => d.symptoms || []).filter((v, i, a) => a.indexOf(v) === i).slice(0, 5).join(", ")
      if (recentSymptoms) context += `Recent symptoms: ${recentSymptoms}. `
    }
    context += "Provide helpful, evidence-based advice."

    // Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
    const result = await model.generateContent(`${context}\n\nUser: ${message}\nAssistant:`)
    const text = result.response.text()

    // Save to Supabase
    const { data: savedMessage, error } = await supabase.from("chat_history").insert({
      user_id: user.id,
      message_type: "assistant",
      content: text,
      context_data: { user_message: message, timestamp: new Date().toISOString() }
    }).select().single()
    if (error) return NextResponse.json({ error: "Failed to save message" }, { status: 500 })

    return NextResponse.json(savedMessage)
  } catch (err) {
    console.error("Chat error:", err)
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 })
  }
}
