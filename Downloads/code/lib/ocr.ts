// This uses a simple regex-based extraction pattern
// In production, integrate with Tesseract.js or cloud OCR services

export interface ExtractedBillData {
  dates: string[]
  medicines: string[]
  amounts: string[]
  rawText: string
}

const COMMON_MEDICINES = [
  "ibuprofen",
  "paracetamol",
  "aspirin",
  "naproxen",
  "iron",
  "vitamin",
  "supplement",
  "painkiller",
  "contraceptive",
  "hormone",
  "estrogen",
  "progesterone",
  "birth control",
  "pill",
  "menstrual",
  "period",
  "calcium",
  "magnesium",
  "zinc",
  "b12",
  "folic acid",
]

export async function extractBillData(text: string): Promise<ExtractedBillData> {
  const dates = extractDates(text)
  const medicines = extractMedicines(text)
  const amounts = extractAmounts(text)

  return {
    dates,
    medicines,
    amounts,
    rawText: text,
  }
}

function extractDates(text: string): string[] {
  const datePatterns = [
    /(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/g,
    /(\d{4}[-/]\d{1,2}[-/]\d{1,2})/g,
    /(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})/gi,
  ]

  const dates = new Set<string>()
  datePatterns.forEach((pattern) => {
    const matches = text.match(pattern)
    if (matches) matches.forEach((date) => dates.add(date))
  })

  return Array.from(dates)
}

function extractMedicines(text: string): string[] {
  const lowerText = text.toLowerCase()
  const foundMedicines = new Set<string>()

  COMMON_MEDICINES.forEach((medicine) => {
    const regex = new RegExp(`\\b${medicine}[a-z]*\\b`, "gi")
    const matches = text.match(regex)
    if (matches) {
      matches.forEach((match) => foundMedicines.add(match))
    }
  })

  return Array.from(foundMedicines)
}

function extractAmounts(text: string): string[] {
  const amountPattern = /\$?\d+(?:\.\d{2})?/g
  const matches = text.match(amountPattern)
  return matches ? Array.from(new Set(matches)) : []
}
