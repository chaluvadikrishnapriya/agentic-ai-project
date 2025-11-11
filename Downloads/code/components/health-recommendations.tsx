"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/client"
import { Loader2, Lightbulb, Activity, Utensils, Moon } from "lucide-react"

interface Recommendation {
  id: string
  category: "nutrition" | "exercise" | "wellness" | "medical"
  title: string
  description: string
  details: string[]
  phase: string
  priority: "high" | "medium" | "low"
}

export function HealthRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) return

        const response = await fetch("/api/recommendations/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        })

        if (response.ok) {
          const data = await response.json()
          setRecommendations(data.recommendations || [])
        }
      } catch (error) {
        console.error("Failed to fetch recommendations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendations()
  }, [])

  if (isLoading) {
    return (
      <Card className="border-2 py-12 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </Card>
    )
  }

  const categoryIcons: Record<string, React.ReactNode> = {
    nutrition: <Utensils className="w-5 h-5" />,
    exercise: <Activity className="w-5 h-5" />,
    wellness: <Moon className="w-5 h-5" />,
    medical: <Lightbulb className="w-5 h-5" />,
  }

  const categoryColors: Record<string, string> = {
    nutrition: "bg-blue-50 border-blue-200 text-blue-900",
    exercise: "bg-green-50 border-green-200 text-green-900",
    wellness: "bg-purple-50 border-purple-200 text-purple-900",
    medical: "bg-orange-50 border-orange-200 text-orange-900",
  }

  const groupedByCategory = recommendations.reduce(
    (acc, rec) => {
      if (!acc[rec.category]) acc[rec.category] = []
      acc[rec.category].push(rec)
      return acc
    },
    {} as Record<string, Recommendation[]>,
  )

  return (
    <div className="space-y-4">
      {Object.entries(groupedByCategory).map(([category, recs]) => (
        <div key={category} className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground capitalize flex items-center gap-2">
            {categoryIcons[category]}
            {category} Recommendations
          </h3>

          <div className="grid gap-3">
            {recs.map((rec) => (
              <Card key={rec.id} className={`border-2 ${categoryColors[category]}`}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{rec.title}</h4>
                      <p className="text-sm text-foreground/80 mt-1">{rec.description}</p>

                      {rec.details && rec.details.length > 0 && (
                        <ul className="mt-3 space-y-1">
                          {rec.details.map((detail, idx) => (
                            <li key={idx} className="text-sm text-foreground/70 flex gap-2">
                              <span className="text-primary">•</span>
                              {detail}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="flex flex-col gap-1 text-right">
                      <span className="text-xs font-medium text-muted-foreground capitalize">{rec.phase}</span>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          rec.priority === "high"
                            ? "bg-destructive/20 text-destructive"
                            : rec.priority === "medium"
                              ? "bg-primary/20 text-primary"
                              : "bg-secondary/20 text-muted-foreground"
                        }`}
                      >
                        {rec.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {recommendations.length === 0 && (
        <Card className="border-2">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Log your cycle data to receive personalized recommendations.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
