"use client"

import { createClient } from "@/lib/client"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

interface Prediction {
  id: string
  next_period_date: string
  predicted_phase: string
  confidence: number
  created_at: string
}

export function PredictionHistory() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
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
          .limit(20)

        if (data) {
          setPredictions(data)
        }
      }
      setIsLoading(false)
    }

    fetchPredictions()
  }, [])

  if (isLoading) {
    return (
      <Card className="border-2 py-12 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </Card>
    )
  }

  if (predictions.length === 0) {
    return (
      <Card className="border-2">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No predictions yet. Log your cycle to get started.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {predictions.map((prediction) => (
        <Card key={prediction.id} className="border">
          <CardContent className="pt-6">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase">Next Period</p>
                <p className="font-semibold text-foreground">
                  {new Date(prediction.next_period_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">Phase</p>
                <p className="font-semibold text-foreground capitalize">{prediction.predicted_phase}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">Confidence</p>
                <p className="font-semibold text-primary">{prediction.confidence}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">Predicted</p>
                <p className="font-semibold text-muted-foreground text-sm">
                  {new Date(prediction.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
