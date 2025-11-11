"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/client"
import { useEffect, useState } from "react"
import { AlertCircle, CheckCircle2, TrendingUp } from "lucide-react"

interface Insight {
  title: string
  description: string
  type: "tip" | "alert" | "positive"
  icon: React.ReactNode
}

export function HealthInsights() {
  const [insights, setInsights] = useState<Insight[]>([])

  useEffect(() => {
    const generateInsights = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const [cycleRes, symptomsRes, predRes] = await Promise.all([
          supabase
            .from("cycle_data")
            .select("*")
            .eq("user_id", user.id)
            .order("period_start_date", { ascending: false })
            .limit(3),
          supabase.from("cycle_data").select("symptoms").eq("user_id", user.id).not("symptoms", "is", null),
          supabase
            .from("predictions")
            .select("predicted_phase")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single(),
        ])

        const newInsights: Insight[] = []

        // Consistency check
        if (cycleRes.data && cycleRes.data.length > 1) {
          const consistent = cycleRes.data
            .slice(0, 2)
            .every((d) => d.flow_intensity === cycleRes.data![0].flow_intensity)
          if (consistent) {
            newInsights.push({
              title: "Consistent Cycle",
              description: "Your recent cycles show consistent patterns, which helps improve prediction accuracy.",
              type: "positive",
              icon: <CheckCircle2 className="w-5 h-5 text-accent" />,
            })
          }
        }

        // Symptom tracking
        if (symptomsRes.data && symptomsRes.data.length > 2) {
          const commonSymptoms = symptomsRes.data
            .flatMap((d) => d.symptoms || [])
            .filter((v, i, a) => a.indexOf(v) === i)
          if (commonSymptoms.length > 0) {
            newInsights.push({
              title: "Tracked Symptoms",
              description: `You've been tracking ${commonSymptoms.length} different symptoms. This helps personalize your health insights.`,
              type: "tip",
              icon: <TrendingUp className="w-5 h-5 text-primary" />,
            })
          }
        }

        // Phase info
        if (predRes.data?.predicted_phase === "menstrual") {
          newInsights.push({
            title: "Menstrual Phase",
            description: "Consider extra rest and increase iron-rich foods. Stay hydrated and manage pain as needed.",
            type: "tip",
            icon: <AlertCircle className="w-5 h-5 text-orange-600" />,
          })
        } else if (predRes.data?.predicted_phase === "ovulation") {
          newInsights.push({
            title: "Ovulation Phase",
            description: "High energy levels are common now. Great time for intense workouts and important decisions.",
            type: "positive",
            icon: <TrendingUp className="w-5 h-5 text-accent" />,
          })
        }

        setInsights(newInsights)
      }
    }

    generateInsights()
  }, [])

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>Health Insights</CardTitle>
        <CardDescription>Personalized insights based on your data</CardDescription>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <p className="text-muted-foreground text-center py-6">Log more data to unlock personalized insights.</p>
        ) : (
          <div className="space-y-3">
            {insights.map((insight, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-2 ${
                  insight.type === "positive"
                    ? "border-accent/30 bg-accent/10"
                    : insight.type === "alert"
                      ? "border-destructive/30 bg-destructive/10"
                      : "border-primary/30 bg-primary/10"
                }`}
              >
                <div className="flex gap-3">
                  {insight.icon}
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{insight.title}</h4>
                    <p className="text-sm text-foreground/80 mt-1">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
