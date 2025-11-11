import { DashboardLayout } from "@/components/dashboard-layout"
import { CycleHistory } from "@/components/cycle-history"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/server"
import { redirect } from "next/navigation"

export default async function HistoryPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch bill history
  const { data: bills } = await supabase
    .from("bills")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20)

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">History & Records</h1>
          <p className="text-muted-foreground mt-2">View your complete health tracking history</p>
        </div>

        <CycleHistory />

        {/* Medical Bills History */}
        {bills && bills.length > 0 && (
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Medical Bills & Receipts</CardTitle>
              <CardDescription>Your tracked medical expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {bills.map((bill) => (
                  <div
                    key={bill.id}
                    className="flex items-center justify-between p-3 bg-secondary/5 border border-border rounded hover:border-primary/30 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground">{bill.merchant_name || bill.file_name}</p>
                      <p className="text-xs text-muted-foreground">{new Date(bill.created_at).toLocaleDateString()}</p>
                    </div>
                    {bill.amount && (
                      <p className="font-semibold text-foreground">
                        ${Number.parseFloat(bill.amount.toString()).toFixed(2)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
