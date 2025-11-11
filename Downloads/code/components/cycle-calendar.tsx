"use client"
import { Card } from "@/components/ui/card"

interface CalendarProps {
  currentMonth?: Date
  predictedPeriodDates?: Date[]
}

export function CycleCalendar({ currentMonth = new Date(), predictedPeriodDates = [] }: CalendarProps) {
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())

  const days = []
  const currentDate = new Date(startDate)

  while (currentDate <= lastDay || currentDate.getDay() !== 0) {
    days.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }

  const monthName = firstDay.toLocaleString("default", { month: "long", year: "numeric" })

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-foreground mb-6">{monthName}</h3>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-foreground/60 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, idx) => {
          const isCurrentMonth = day.getMonth() === month
          const isPredicted = predictedPeriodDates.some((pd) => pd.toDateString() === day.toDateString())

          return (
            <div
              key={idx}
              className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium ${
                isCurrentMonth
                  ? isPredicted
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/20 text-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {day.getDate()}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
