"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface TrendData {
  month: string
  spending: number
  predictions: number
}

interface Medicine {
  name: string
  frequency: number
  lastPurchased: string
}

export default function InsightsPage() {
  const router = useRouter()
  const [trends, setTrends] = useState<TrendData[]>([])
  const [topMedicines, setTopMedicines] = useState<Medicine[]>([])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/auth/login")
      return
    }

    // Mock data for trends
    setTrends([
      { month: "Sep", spending: 45, predictions: 1 },
      { month: "Oct", spending: 62, predictions: 2 },
      { month: "Nov", spending: 58, predictions: 3 },
    ])

    // Mock data for medicines
    setTopMedicines([
      { name: "Ibuprofen", frequency: 12, lastPurchased: "2025-11-08" },
      { name: "Iron Supplement", frequency: 8, lastPurchased: "2025-11-05" },
      { name: "Vitamin B12", frequency: 6, lastPurchased: "2025-11-01" },
    ])
  }, [router])

  const maxSpending = Math.max(...trends.map((t) => t.spending), 100)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/dashboard" className="text-primary hover:underline mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-2">Health Insights</h1>
          <p className="text-foreground/60">Track your spending patterns and cycle trends</p>
        </div>

        {/* Spending Trend Chart */}
        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Monthly Spending Trend</h2>
          <div className="space-y-6">
            {trends.map((trend) => (
              <div key={trend.month}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">{trend.month}</span>
                  <span className="text-sm text-foreground/60">${trend.spending}</span>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${(trend.spending / maxSpending) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 bg-primary/5 border-primary/20">
            <p className="text-sm text-foreground/60 mb-2">Total Spending (3 months)</p>
            <p className="text-3xl font-bold text-primary">$165</p>
            <p className="text-xs text-foreground/60 mt-4">On health and wellness</p>
          </Card>
          <Card className="p-6 bg-accent/5 border-accent/20">
            <p className="text-sm text-foreground/60 mb-2">Average Cycle Length</p>
            <p className="text-3xl font-bold text-accent">28 days</p>
            <p className="text-xs text-foreground/60 mt-4">Regular cycle pattern</p>
          </Card>
          <Card className="p-6 bg-secondary/5 border-secondary/20">
            <p className="text-sm text-foreground/60 mb-2">Predictions Made</p>
            <p className="text-3xl font-bold text-secondary">6</p>
            <p className="text-xs text-foreground/60 mt-4">With avg 82% confidence</p>
          </Card>
        </div>

        {/* Top Medicines */}
        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Most Purchased Medicines</h2>
          <div className="space-y-6">
            {topMedicines.map((medicine, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-foreground">{medicine.name}</p>
                    <p className="text-xs text-foreground/60">Last purchased: {medicine.lastPurchased}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary">{medicine.frequency}x</p>
                  </div>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${(medicine.frequency / 12) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Wellness Tips */}
        <Card className="p-8 bg-secondary/20">
          <h2 className="text-2xl font-bold text-foreground mb-6">Personalized Wellness Tips</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="text-2xl flex-shrink-0">💪</div>
              <div>
                <p className="font-semibold text-foreground mb-1">Stay Active</p>
                <p className="text-sm text-foreground/70">
                  Regular exercise can help regulate your cycle and reduce symptoms
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl flex-shrink-0">🥗</div>
              <div>
                <p className="font-semibold text-foreground mb-1">Balanced Nutrition</p>
                <p className="text-sm text-foreground/70">Continue your iron and B12 supplementation for energy</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl flex-shrink-0">😴</div>
              <div>
                <p className="font-semibold text-foreground mb-1">Quality Sleep</p>
                <p className="text-sm text-foreground/70">Aim for 7-8 hours to support hormonal balance</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl flex-shrink-0">💧</div>
              <div>
                <p className="font-semibold text-foreground mb-1">Stay Hydrated</p>
                <p className="text-sm text-foreground/70">Drink 8-10 glasses of water daily for better cycle health</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="mt-12 flex gap-4 flex-wrap">
          <Button asChild>
            <Link href="/dashboard/upload">Upload New Bill</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/chat">Chat with AI</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
