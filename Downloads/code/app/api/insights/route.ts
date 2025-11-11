import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // TODO: Verify JWT token
    const db = await getDatabase()

    // Fetch bills collection
    const billsCollection = db.collection("bills")
    const bills = await billsCollection.find({}).toArray()

    // Calculate spending trends
    const trends = calculateSpendingTrends(bills)

    // Fetch top medicines
    const topMedicines = getTopMedicines(bills)

    // Fetch predictions
    const predictionsCollection = db.collection("predictions")
    const predictions = await predictionsCollection.find({}).toArray()

    return NextResponse.json({
      trends,
      topMedicines,
      totalPredictions: predictions.length,
      averageConfidence:
        predictions.length > 0
          ? (predictions.reduce((sum: number, p: any) => sum + p.confidence, 0) / predictions.length).toFixed(1)
          : 0,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch insights" }, { status: 500 })
  }
}

function calculateSpendingTrends(bills: any[]): any[] {
  const months: { [key: string]: number } = {}

  bills.forEach((bill) => {
    const date = new Date(bill.createdAt)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

    if (!months[key]) {
      months[key] = 0
    }

    // TODO: Extract actual amount from bill
    months[key] += 50
  })

  return Object.entries(months).map(([key, spending]) => ({
    month: key,
    spending,
  }))
}

function getTopMedicines(bills: any[]): any[] {
  const medicineCount: { [key: string]: number } = {}

  bills.forEach((bill) => {
    bill.medicines?.forEach((med: string) => {
      medicineCount[med] = (medicineCount[med] || 0) + 1
    })
  })

  return Object.entries(medicineCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, frequency]) => ({
      name,
      frequency,
      lastPurchased: new Date().toISOString().split("T")[0],
    }))
}
