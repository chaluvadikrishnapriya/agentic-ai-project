import { DashboardLayout } from "@/components/dashboard-layout"
import { PredictionHistory } from "@/components/prediction-history"

export default function PredictionsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Prediction History</h1>
          <p className="text-muted-foreground mt-2">View your past cycle predictions and insights</p>
        </div>

        <PredictionHistory />
      </div>
    </DashboardLayout>
  )
}
