"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function PredictionPage() {
  const searchParams = useSearchParams()
  const billId = searchParams.get("billId")

  // Mock prediction data - will be replaced with real API call
  const mockPrediction = {
    nextPeriodDate: "November 25, 2025",
    cycleLength: 28,
    confidence: 85,
    medicines: ["Ibuprofen", "Iron Supplement", "Vitamin B12"],
    insights: [
      "Your recent purchases suggest you've been managing period pain effectively.",
      "Iron supplement purchases align with typical supplementation patterns.",
      "Based on your patterns, your cycle appears regular.",
    ],
    recommendations: [
      "Continue taking iron supplements if experiencing fatigue",
      "Stay hydrated during your predicted cycle",
      "Consider tracking additional symptoms for better predictions",
    ],
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/dashboard" className="text-primary hover:underline mb-4 inline-block">
          ← Back to Dashboard
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Your Cycle Prediction</h1>
          <p className="text-foreground/60">Based on your health bill analysis</p>
        </div>

        {/* Main Prediction Card */}
        <Card className="p-8 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 mb-8">
          <p className="text-sm text-foreground/60 mb-2">Next Expected Period</p>
          <h2 className="text-5xl font-bold text-primary mb-6">{mockPrediction.nextPeriodDate}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-foreground/60">Cycle Length</p>
              <p className="text-3xl font-bold text-foreground">{mockPrediction.cycleLength} days</p>
            </div>
            <div>
              <p className="text-sm text-foreground/60">Prediction Confidence</p>
              <p className="text-3xl font-bold text-accent">{mockPrediction.confidence}%</p>
            </div>
            <div>
              <p className="text-sm text-foreground/60">Medicines Detected</p>
              <p className="text-3xl font-bold text-foreground">{mockPrediction.medicines.length}</p>
            </div>
          </div>
        </Card>

        {/* Medicines Found */}
        <Card className="p-6 mb-8">
          <h3 className="text-xl font-bold text-foreground mb-4">Medicines Detected</h3>
          <div className="flex flex-wrap gap-3">
            {mockPrediction.medicines.map((med, idx) => (
              <span key={idx} className="bg-primary/10 text-primary px-4 py-2 rounded-full font-medium">
                {med}
              </span>
            ))}
          </div>
        </Card>

        {/* Health Insights */}
        <Card className="p-6 mb-8">
          <h3 className="text-xl font-bold text-foreground mb-4">Health Insights</h3>
          <div className="space-y-4">
            {mockPrediction.insights.map((insight, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2" />
                <p className="text-foreground/80">{insight}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Recommendations */}
        <Card className="p-6 mb-8 bg-secondary/20">
          <h3 className="text-xl font-bold text-foreground mb-4">Wellness Recommendations</h3>
          <div className="space-y-4">
            {mockPrediction.recommendations.map((rec, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="flex-shrink-0 text-xl">💡</div>
                <p className="text-foreground/80">{rec}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-4 flex-wrap">
          <Button asChild>
            <Link href="/dashboard/chat">Ask AI Assistant</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/upload">Upload Another Bill</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
