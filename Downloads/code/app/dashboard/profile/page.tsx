"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function ProfilePage() {
  const router = useRouter()
  const [userStats, setUserStats] = useState({
    billsUploaded: 0,
    predictionsGenerated: 0,
    totalMedicinesTracked: 0,
    accountCreated: new Date(),
  })

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/auth/login")
      return
    }

    // TODO: Fetch user statistics from API
    setUserStats({
      billsUploaded: 3,
      predictionsGenerated: 3,
      totalMedicinesTracked: 12,
      accountCreated: new Date("2025-11-01"),
    })
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/dashboard" className="text-primary hover:underline mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-foreground">Your Profile</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          <Card className="p-6">
            <p className="text-sm text-foreground/60 mb-2">Bills Uploaded</p>
            <p className="text-4xl font-bold text-primary">{userStats.billsUploaded}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-foreground/60 mb-2">Predictions Generated</p>
            <p className="text-4xl font-bold text-accent">{userStats.predictionsGenerated}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-foreground/60 mb-2">Medicines Tracked</p>
            <p className="text-4xl font-bold text-primary">{userStats.totalMedicinesTracked}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-foreground/60 mb-2">Member Since</p>
            <p className="text-lg font-bold text-foreground">{userStats.accountCreated.toLocaleDateString()}</p>
          </Card>
        </div>

        {/* Settings Section */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Account Settings</h2>
          <div className="space-y-4">
            <button className="w-full text-left p-4 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors">
              <p className="font-semibold text-foreground">Change Password</p>
              <p className="text-sm text-foreground/60">Update your account password</p>
            </button>
            <button className="w-full text-left p-4 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors">
              <p className="font-semibold text-foreground">Notification Preferences</p>
              <p className="text-sm text-foreground/60">Manage how you receive updates</p>
            </button>
            <button className="w-full text-left p-4 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors">
              <p className="font-semibold text-foreground">Privacy Settings</p>
              <p className="text-sm text-foreground/60">Control your data and privacy</p>
            </button>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-8 bg-destructive/5 border-destructive/20">
          <h2 className="text-2xl font-bold text-destructive mb-6">Account Actions</h2>
          <div className="space-y-4">
            <Button variant="outline" onClick={handleLogout} className="w-full bg-transparent">
              Log Out
            </Button>
            <Button variant="outline" className="w-full text-destructive hover:text-destructive bg-transparent">
              Delete Account
            </Button>
          </div>
        </Card>
      </main>
    </div>
  )
}
