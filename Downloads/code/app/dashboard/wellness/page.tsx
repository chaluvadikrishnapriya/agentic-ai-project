"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { HealthRecommendations } from "@/components/health-recommendations"

export default function WellnessPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Wellness Center</h1>
          <p className="text-muted-foreground mt-2">Personalized health recommendations based on your cycle</p>
        </div>

        <HealthRecommendations />
      </div>
    </DashboardLayout>
  )
}
