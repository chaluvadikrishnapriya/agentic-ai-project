"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"
import { DashboardLayout } from "@/components/dashboard-layout"
import { BillUploadSection } from "@/components/bill-upload-section"
import { HealthRecommendations } from "@/components/health-recommendations"
import { DashboardStats } from "@/components/dashboard-stats"
import { HealthInsights } from "@/components/health-insights"
import { CycleHistory } from "@/components/cycle-history"

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push("/auth/login")
          return
        }
        setUserId(user.id)
      } catch (e) {
        console.error("Failed to get user on client:", e)
        router.push("/auth/login")
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  if (!userId) return null

  return (
    <DashboardLayout>
      <div className="space-y-12">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Track your health and get personalized insights</p>
        </div>

        <DashboardStats />

        <HealthInsights />

        <HealthRecommendations />

        <BillUploadSection userId={userId} />

        <CycleHistory />
      </div>
    </DashboardLayout>
  )
}
