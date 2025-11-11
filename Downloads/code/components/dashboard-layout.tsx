"use client"

import type React from "react"

import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSigningOut, setIsSigningOut] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    setIsSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-primary/5">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="text-2xl font-bold text-primary">CyclePredict</div>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/dashboard" className="text-foreground hover:text-primary transition">
                Dashboard
              </Link>
              <Link href="/dashboard/cycle" className="text-foreground hover:text-primary transition">
                Cycle Tracker
              </Link>
              <Link href="/dashboard/wellness" className="text-foreground hover:text-primary transition">
                Wellness
              </Link>
              <Link href="/dashboard/history" className="text-foreground hover:text-primary transition">
                History
              </Link>
              <Link href="/dashboard/chat" className="text-foreground hover:text-primary transition">
                AI Chat
              </Link>
              <Button variant="outline" size="sm" onClick={handleSignOut} disabled={isSigningOut}>
                {isSigningOut ? "Signing out..." : "Sign Out"}
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">{children}</main>
    </div>
  )
}
