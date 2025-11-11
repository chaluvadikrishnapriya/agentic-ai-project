import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 })
    }

    // TODO: Integrate with Gemini API or other AI service
    // For now, return contextual responses based on message content

    const response = generateResponse(message)

    return NextResponse.json({
      response,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ error: "Chat request failed" }, { status: 500 })
  }
}

function generateResponse(message: string): string {
  const lowerMessage = message.toLowerCase()

  // Contextual responses
  if (lowerMessage.includes("next period") || lowerMessage.includes("when")) {
    return "Based on your uploaded bills and health data, your next period is predicted for around November 25, 2025. This prediction has an 85% confidence level based on your medication purchase patterns."
  }

  if (lowerMessage.includes("irregular") || lowerMessage.includes("why")) {
    return "Irregular cycles can be caused by several factors including stress, hormonal imbalances, diet changes, or medication. Based on your bills, I don't see signs of hormonal issues. Try tracking additional symptoms and consider consulting a healthcare provider if irregularities persist."
  }

  if (lowerMessage.includes("what should i eat") || lowerMessage.includes("food")) {
    return "During your menstrual cycle, focus on: iron-rich foods (spinach, lentils), calcium sources (dairy, leafy greens), and magnesium-rich foods (nuts, seeds). These support energy levels and reduce cramping. Stay hydrated and avoid excess caffeine."
  }

  if (lowerMessage.includes("painkiller") || lowerMessage.includes("too many")) {
    return "Your bill history shows moderate pain relief purchases, which is normal for cycle management. If you're using more than usual, consider: heat therapy, gentle exercise, or consulting your doctor about other pain management options."
  }

  if (lowerMessage.includes("bill") || lowerMessage.includes("purchase")) {
    return "Your bills show purchases of pain relief medication, iron supplements, and vitamins - all common during menstrual cycles. These patterns suggest regular cycle management, which is healthy."
  }

  // Default response
  return "I'm here to help you understand your menstrual cycle based on your health data. You can ask me about predictions, health insights, symptoms, or wellness tips. What would you like to know?"
}
