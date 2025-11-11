"use client"

import { createClient } from "@/lib/client"
import { DashboardLayout } from "@/components/dashboard-layout"
import { CycleTracker } from "@/components/cycle-tracker"
import { CyclePredictions } from "@/components/cycle-predictions"
import { useEffect, useState } from "react"

interface Profile {
  cycle_length: number
  period_length: number
}

export default function CyclePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("cycle_length, period_length")
          .eq("id", user.id)
          .single()

        if (data) {
          setProfile(data)
        }
      }
      setIsLoading(false)
    }

    fetchProfile()
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Cycle Tracker</h1>
          <p className="text-muted-foreground mt-2">Log your cycle and get accurate predictions</p>
        </div>

        {!isLoading && profile && (
          <>
            <CycleTracker cycleLength={profile.cycle_length} periodLength={profile.period_length} />
            <CyclePredictions cycleLength={profile.cycle_length} />
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
