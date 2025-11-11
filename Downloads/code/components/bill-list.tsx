"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Calendar, DollarSign } from "lucide-react"

interface Bill {
  id: string
  file_name: string
  merchant_name?: string
  bill_date?: string
  amount?: number
  extracted_data?: Record<string, any>
  created_at: string
}

export function BillList({ bills }: { bills: Bill[] }) {
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Uploaded Bills
        </CardTitle>
        <CardDescription>Your processed medical bills and receipts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {bills.map((bill) => (
            <div
              key={bill.id}
              className="flex items-start justify-between p-4 bg-secondary/5 border border-border rounded-lg hover:border-primary/30 transition-colors"
            >
              <div className="flex-1 space-y-1">
                <p className="font-medium text-foreground">{bill.merchant_name || bill.file_name}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {bill.bill_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(bill.bill_date).toLocaleDateString()}
                    </div>
                  )}
                  {bill.amount && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />${Number.parseFloat(bill.amount.toString()).toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
