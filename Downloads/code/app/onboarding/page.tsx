"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function OnboardingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Welcome to CyclePredict AI</h1>
          <p className="text-lg text-foreground/70">Let's get you set up to start predicting your cycle</p>
        </div>

        <div className="space-y-6">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4 text-foreground">How It Works</h2>
            <div className="space-y-4 text-foreground/80">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Upload Your Bills</h3>
                  <p>Share medical or pharmacy bills (PDF, images, or text)</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">AI Analysis</h3>
                  <p>Our AI extracts medicines and health patterns from your bills</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Get Predictions</h3>
                  <p>Receive personalized cycle predictions and health insights</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-primary/5 border-primary/20">
            <h2 className="text-xl font-bold mb-4 text-foreground">Privacy & Security</h2>
            <p className="text-foreground/70 mb-6">
              Your health data is encrypted and stored securely. We never share your information with third parties. All
              analysis happens with respect to your privacy.
            </p>
          </Card>

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => router.push("/dashboard")} className="flex-1">
              Skip for Now
            </Button>
            <Button onClick={() => router.push("/dashboard/upload")} className="flex-1">
              Upload Your First Bill
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
