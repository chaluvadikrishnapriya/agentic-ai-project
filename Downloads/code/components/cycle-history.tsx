"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/client"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

interface CycleEntry {
  id: string
  period_start_date: string
  period_end_date?: string
  flow_intensity: string
  symptoms: string[]
  notes?: string
}

export function CycleHistory() {
  const [history, setHistory] = useState<CycleEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data } = await supabase
          .from("cycle_data")
          .select("*")
          .eq("user_id", user.id)
          .order("period_start_date", { ascending: false })
          .limit(12)

        if (data) {
          setHistory(data)
        }
      }
      setIsLoading(false)
    }

    fetchHistory()
  }, [])

  if (isLoading) {
    return (
      <Card className="border-2 py-12 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </Card>
    )
  }

  if (history.length === 0) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Cycle History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-6">No cycle entries yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>Cycle History</CardTitle>
        <CardDescription>Your last 12 cycle entries</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {history.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start justify-between p-4 bg-secondary/5 border border-border rounded-lg hover:border-primary/30 transition-colors"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <p className="font-semibold text-foreground">
                    {new Date(entry.period_start_date).toLocaleDateString()}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded font-medium ${
                      entry.flow_intensity === "light"
                        ? "bg-blue-100 text-blue-900"
                        : entry.flow_intensity === "normal"
                          ? "bg-green-100 text-green-900"
                          : "bg-red-100 text-red-900"
                    }`}
                  >
                    {entry.flow_intensity.charAt(0).toUpperCase() + entry.flow_intensity.slice(1)}
                  </span>
                </div>

                {entry.symptoms && entry.symptoms.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {entry.symptoms.map((symptom, idx) => (
                      <span key={idx} className="text-xs bg-accent/20 text-accent-foreground px-2 py-1 rounded">
                        {symptom}
                      </span>
                    ))}
                  </div>
                )}

                {entry.notes && <p className="text-sm text-muted-foreground">{entry.notes}</p>}
              </div>

              {entry.period_end_date && (
                <div className="text-right ml-4">
                  <p className="text-xs text-muted-foreground">Ended</p>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(entry.period_end_date).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
