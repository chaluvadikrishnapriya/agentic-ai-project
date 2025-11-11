import { createClient } from "@/lib/server"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { BillUploadSection } from "@/components/bill-upload-section"
import { HealthRecommendations } from "@/components/health-recommendations"
import { DashboardStats } from "@/components/dashboard-stats"
import { HealthInsights } from "@/components/health-insights"
import { CycleHistory } from "@/components/cycle-history"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

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

        <BillUploadSection userId={user.id} />

        <CycleHistory />
      </div>
    </DashboardLayout>
  )
}
