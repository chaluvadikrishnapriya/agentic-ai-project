export interface CyclePredictionData {
  nextPeriodDate: Date
  cycleLength: number
  confidence: number
  insights: string[]
  recommendations: string[]
}

export interface MedicineAnalysis {
  medicines: string[]
  dates: string[]
  hasHormones: boolean
  hasPainRelief: boolean
  hasIron: boolean
}

export function analyzeMedicines(medicines: string[]): MedicineAnalysis {
  const lowerMedicines = medicines.map((m) => m.toLowerCase())

  return {
    medicines,
    dates: [],
    hasHormones: lowerMedicines.some(
      (m) =>
        m.includes("hormone") || m.includes("estrogen") || m.includes("progesterone") || m.includes("birth control"),
    ),
    hasPainRelief: lowerMedicines.some(
      (m) => m.includes("ibuprofen") || m.includes("paracetamol") || m.includes("naproxen") || m.includes("painkiller"),
    ),
    hasIron: lowerMedicines.some((m) => m.includes("iron")),
  }
}

export function predictCycle(analysis: MedicineAnalysis, lastPeriodDate?: Date): CyclePredictionData {
  // Default cycle length is 28 days
  const cycleLength = 28
  let confidence = 70

  // Adjust based on medicine patterns
  if (analysis.hasHormones) {
    confidence += 15
  }

  if (analysis.hasPainRelief && analysis.hasIron) {
    confidence += 10
  }

  // Calculate next period date
  const nextDate = lastPeriodDate || new Date()
  nextDate.setDate(nextDate.getDate() + cycleLength)

  // Generate insights
  const insights: string[] = []

  if (analysis.hasPainRelief) {
    insights.push("Your recent pain relief purchases suggest period management. Your cycle appears regular.")
  }

  if (analysis.hasIron) {
    insights.push("Iron supplement purchases align with typical supplementation patterns for cycle support.")
  }

  if (analysis.hasHormones) {
    insights.push("Hormonal medication detected. Your cycle may have specific patterns related to hormone use.")
  }

  if (insights.length === 0) {
    insights.push("Based on your health data, your cycle appears to follow a regular pattern.")
  }

  // Generate recommendations
  const recommendations = [
    "Stay hydrated throughout your cycle",
    "Maintain a balanced diet rich in iron and calcium",
    "Continue tracking your symptoms for better predictions",
  ]

  if (analysis.hasIron) {
    recommendations.push("Continue taking iron supplements as needed for energy support")
  }

  if (analysis.hasPainRelief) {
    recommendations.push("Consider using pain relief before symptoms become severe")
  }

  return {
    nextPeriodDate: nextDate,
    cycleLength,
    confidence,
    insights,
    recommendations,
  }
}

export function formatPredictionDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
