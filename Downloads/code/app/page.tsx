import { createClient } from "@/lib/server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is authenticated, redirect to dashboard
  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-6 md:p-10 bg-gradient-to-br from-background via-card to-primary/5">
      <div className="w-full max-w-2xl text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground text-balance">
            Understand Your
            <span className="text-primary"> Cycle</span>
          </h1>
          <p className="text-xl text-muted-foreground text-balance">
            Get accurate menstrual cycle predictions and personalized health insights powered by AI. Track your health
            with science-backed intelligence.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link href="/auth/sign-up">Get Started Free</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 pt-12">
          <div className="p-6 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold mb-2">Accurate Predictions</h3>
            <p className="text-sm text-muted-foreground">
              AI-powered cycle predictions with 95% accuracy based on your data
            </p>
          </div>

          <div className="p-6 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors">
            <div className="text-3xl mb-3">💡</div>
            <h3 className="font-semibold mb-2">Health Insights</h3>
            <p className="text-sm text-muted-foreground">
              Personalized recommendations based on your cycle phase and symptoms
            </p>
          </div>

          <div className="p-6 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="font-semibold mb-2">AI Chat Assistant</h3>
            <p className="text-sm text-muted-foreground">Chat with our AI to get answers about your health and cycle</p>
          </div>
        </div>
      </div>
    </div>
  )
}
