"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-background to-secondary/20">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-primary mb-2">CyclePredict</h1>
            <p className="text-muted-foreground">Welcome to your health journey</p>
          </div>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl text-accent">Check Your Email</CardTitle>
              <CardDescription>We&apos;ve sent a confirmation link</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-foreground/80">
                Please check your email and click the confirmation link to complete your signup. This helps us keep your
                account secure.
              </p>

              <p className="text-xs text-muted-foreground">
                Didn&apos;t receive an email? Check your spam folder or try signing up again.
              </p>

              <Button asChild className="w-full mt-2">
                <Link href="/auth/login">Back to Login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
