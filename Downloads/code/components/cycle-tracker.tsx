"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/client"
import { useState } from "react"
import { CheckCircle2, AlertCircle } from "lucide-react"

interface TrackerProps {
  cycleLength: number
  periodLength: number
}

export function CycleTracker({ cycleLength, periodLength }: TrackerProps) {
  const [periodStartDate, setPeriodStartDate] = useState("")
  const [periodEndDate, setPeriodEndDate] = useState("")
  const [flowIntensity, setFlowIntensity] = useState("normal")
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null)

  const symptomOptions = [
    "Cramps",
    "Headache",
    "Mood swings",
    "Fatigue",
    "Bloating",
    "Acne",
    "Breast tenderness",
    "Nausea",
  ]

  const toggleSymptom = (symptom: string) => {
    setSymptoms((prev) => (prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { error } = await supabase.from("cycle_data").insert({
        user_id: user.id,
        period_start_date: periodStartDate,
        period_end_date: periodEndDate || null,
        flow_intensity: flowIntensity,
        symptoms: symptoms,
        notes: notes || null,
      })

      if (error) throw error

      setMessage({ type: "success", text: "Cycle entry recorded successfully!" })
      setPeriodStartDate("")
      setPeriodEndDate("")
      setFlowIntensity("normal")
      setSymptoms([])
      setNotes("")

      // Trigger prediction refresh
      setTimeout(() => window.location.reload(), 1500)
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to record cycle entry",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle>Log Your Period</CardTitle>
        <CardDescription>Track your cycle to improve prediction accuracy</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startDate">Period Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={periodStartDate}
                onChange={(e) => setPeriodStartDate(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endDate">Period End Date (Optional)</Label>
              <Input
                id="endDate"
                type="date"
                value={periodEndDate}
                onChange={(e) => setPeriodEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-3">
            <Label>Flow Intensity</Label>
            <div className="flex gap-3">
              {["light", "normal", "heavy"].map((intensity) => (
                <button
                  key={intensity}
                  type="button"
                  onClick={() => setFlowIntensity(intensity)}
                  className={`px-4 py-2 rounded border-2 transition-colors ${
                    flowIntensity === intensity
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {intensity.charAt(0).toUpperCase() + intensity.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            <Label>Symptoms</Label>
            <div className="grid grid-cols-2 gap-2">
              {symptomOptions.map((symptom) => (
                <button
                  key={symptom}
                  type="button"
                  onClick={() => toggleSymptom(symptom)}
                  className={`px-3 py-2 rounded border text-sm transition-colors ${
                    symptoms.includes(symptom)
                      ? "bg-accent text-accent-foreground border-accent"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {symptom}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any other observations..."
              className="px-3 py-2 border border-border rounded bg-input text-foreground"
              rows={3}
            />
          </div>

          {message && (
            <div
              className={`flex items-start gap-3 p-4 rounded-lg ${
                message.type === "success"
                  ? "bg-accent/10 border border-accent/30"
                  : "bg-destructive/10 border border-destructive/30"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              )}
              <p className={`text-sm ${message.type === "success" ? "text-accent-foreground" : "text-destructive"}`}>
                {message.text}
              </p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Recording..." : "Record Cycle Entry"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
