"use client"

import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/client"
import { useEffect, useState } from "react"
import { Calendar, TrendingUp, Zap, BarChart3 } from "lucide-react"

interface Stats {
  cycleCount: number
  averageCycleLength: number
  nextPeriod: string | null
  currentPhase: string | null
}

export function DashboardStats() {
  const [stats, setStats] = useState<Stats>({
    cycleCount: 0,
    averageCycleLength: 0,
    nextPeriod: null,
    currentPhase: null,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const [cycleRes, predRes] = await Promise.all([
          supabase
            .from("cycle_data")
            .select("period_start_date")
            .eq("user_id", user.id)
            .order("period_start_date", { ascending: false }),
          supabase
            .from("predictions")
            .select("next_period_date, predicted_phase")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single(),
        ])

        if (cycleRes.data && cycleRes.data.length > 0) {
          const cycles = cycleRes.data
          const cycleLengths: number[] = []

          for (let i = 0; i < cycles.length - 1; i++) {
            const date1 = new Date(cycles[i].period_start_date).getTime()
            const date2 = new Date(cycles[i + 1].period_start_date).getTime()
            const length = Math.floor((date1 - date2) / (1000 * 60 * 60 * 24))
            if (length > 0) cycleLengths.push(length)
          }

          const avgLength =
            cycleLengths.length > 0 ? Math.round(cycleLengths.reduce((a, b) => a + b) / cycleLengths.length) : 28

          setStats({
            cycleCount: cycles.length,
            averageCycleLength: avgLength,
            nextPeriod: predRes.data?.next_period_date || null,
            currentPhase: predRes.data?.predicted_phase || null,
          })
        }
      }

      setIsLoading(false)
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      icon: Calendar,
      label: "Cycles Tracked",
      value: stats.cycleCount,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: TrendingUp,
      label: "Average Cycle",
      value: `${stats.averageCycleLength} days`,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: Zap,
      label: "Current Phase",
      value: stats.currentPhase ? stats.currentPhase.charAt(0).toUpperCase() + stats.currentPhase.slice(1) : "—",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      icon: BarChart3,
      label: "Next Period",
      value: stats.nextPeriod ? new Date(stats.nextPeriod).toLocaleDateString() : "—",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
  ]

  return (
    <div className="grid md:grid-cols-4 gap-4">
      {statCards.map((stat, idx) => {
        const Icon = stat.icon
        return (
          <Card key={idx} className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
