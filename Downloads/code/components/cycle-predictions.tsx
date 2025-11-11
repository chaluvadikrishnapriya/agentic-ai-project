"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/client"
import { useEffect, useState } from "react"
import { Loader2, Calendar, TrendingUp } from "lucide-react"

interface Prediction {
  id: string
  next_period_date: string
  fertile_window_start: string
  fertile_window_end: string
  predicted_phase: string
  confidence: number
  health_insights: string[]
  created_at: string
}

interface CyclePredictionsProps {
  cycleLength: number
}

export function CyclePredictions({ cycleLength }: CyclePredictionsProps) {
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPredictions = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data } = await supabase
          .from("predictions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (data) {
          setPrediction(data)
        }
      }
      setIsLoading(false)
    }

    fetchPredictions()
  }, [])

  if (isLoading) {
    return (
      <Card className="border-2">
        <CardContent className="py-8 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (!prediction) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Next Predictions</CardTitle>
          <CardDescription>Log your cycle to generate AI predictions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Start by logging your cycle data above to get personalized predictions.
          </p>
        </CardContent>
      </Card>
    )
  }

  const phaseColors: Record<string, string> = {
    menstrual: "bg-red-100 text-red-900 border-red-200",
    follicular: "bg-blue-100 text-blue-900 border-blue-200",
    ovulation: "bg-pink-100 text-pink-900 border-pink-200",
    luteal: "bg-yellow-100 text-yellow-900 border-yellow-200",
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Next Period Prediction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Predicted Date</p>
            <p className="text-2xl font-bold text-primary">
              {new Date(prediction.next_period_date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Current Phase</p>
            <div
              className={`inline-block px-3 py-1 rounded-full border ${phaseColors[prediction.predicted_phase] || phaseColors.menstrual}`}
            >
              {prediction.predicted_phase.charAt(0).toUpperCase() + prediction.predicted_phase.slice(1)}
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Prediction Confidence</p>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary rounded-full h-2 transition-all"
                style={{ width: `${prediction.confidence}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{prediction.confidence}% confident</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            Fertile Window
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Fertile Period</p>
            <p className="text-base font-semibold text-foreground">
              {new Date(prediction.fertile_window_start).toLocaleDateString()} -{" "}
              {new Date(prediction.fertile_window_end).toLocaleDateString()}
            </p>
          </div>
          {prediction.health_insights && prediction.health_insights.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Health Insights</p>
              <ul className="space-y-2">
                {prediction.health_insights.map((insight, idx) => (
                  <li key={idx} className="text-sm text-foreground flex gap-2">
                    <span className="text-primary">•</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
