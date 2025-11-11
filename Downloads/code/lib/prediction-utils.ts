export interface CycleEntry {
  period_start_date: string
  flow_intensity: string
  symptoms?: string[]
}

export function calculateNextPeriod(lastPeriodStart: Date, cycleLength: number): Date {
  return new Date(lastPeriodStart.getTime() + cycleLength * 24 * 60 * 60 * 1000)
}

export function calculateFertileWindow(nextPeriodDate: Date): { start: Date; end: Date } {
  const ovulationDate = new Date(nextPeriodDate.getTime() - 14 * 24 * 60 * 60 * 1000)
  const fertileStart = new Date(ovulationDate.getTime() - 5 * 24 * 60 * 60 * 1000)
  const fertileEnd = new Date(ovulationDate.getTime() + 24 * 60 * 60 * 1000)

  return { start: fertileStart, end: fertileEnd }
}

export function predictPhase(
  currentDate: Date,
  nextPeriodDate: Date,
  cycleLength: number,
  periodLength: number,
): string {
  const daysUntilPeriod = Math.floor((nextPeriodDate.getTime() - currentDate.getTime()) / (24 * 60 * 60 * 1000))

  if (daysUntilPeriod <= 0 && daysUntilPeriod > -periodLength) {
    return "menstrual"
  } else if (daysUntilPeriod > 14) {
    return "follicular"
  } else if (daysUntilPeriod > 8 && daysUntilPeriod <= 14) {
    return "ovulation"
  } else {
    return "luteal"
  }
}
