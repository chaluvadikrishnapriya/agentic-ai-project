import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { extractBillData } from "@/lib/ocr"
import { analyzeMedicines, predictCycle } from "@/lib/prediction"

export async function POST(request: NextRequest) {
  try {
    const { extractedText, billId } = await request.json()

    if (!extractedText) {
      return NextResponse.json({ error: "No extracted text provided" }, { status: 400 })
    }

    // Extract bill data
    const billData = await extractBillData(extractedText)

    // Analyze medicines
    const medicineAnalysis = analyzeMedicines(billData.medicines)

    // Generate prediction
    const prediction = predictCycle(medicineAnalysis)

    // Save to MongoDB
    const db = await getDatabase()
    const billsCollection = db.collection("bills")

    const billRecord = {
      _id: billId,
      extractedText,
      medicines: billData.medicines,
      dates: billData.dates,
      amounts: billData.amounts,
      createdAt: new Date(),
    }

    await billsCollection.insertOne(billRecord)

    // Save prediction
    const predictionsCollection = db.collection("predictions")
    const predictionRecord = {
      billId,
      nextPeriodDate: prediction.nextPeriodDate,
      cycleLength: prediction.cycleLength,
      confidence: prediction.confidence,
      insights: prediction.insights,
      recommendations: prediction.recommendations,
      createdAt: new Date(),
    }

    const predResult = await predictionsCollection.insertOne(predictionRecord)

    return NextResponse.json({
      billId,
      prediction: {
        nextPeriodDate: prediction.nextPeriodDate.toISOString().split("T")[0],
        cycleLength: prediction.cycleLength,
        confidence: prediction.confidence,
        insights: prediction.insights,
        recommendations: prediction.recommendations,
      },
      predictionId: predResult.insertedId,
    })
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}
