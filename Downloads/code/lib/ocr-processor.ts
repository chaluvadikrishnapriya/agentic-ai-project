export interface ExtractedBillData {
  merchant_name?: string
  bill_date?: string
  amount?: number
  items?: Array<{
    name: string
    quantity?: number
    price?: number
  }>
  total?: number
  subtotal?: number
  tax?: number
  raw_text?: string
}

export async function extractBillData(imageFile: File): Promise<ExtractedBillData> {
  // This function will use Tesseract.js in client-side component
  // Returning placeholder for now
  return {
    merchant_name: "Extracted Merchant",
    bill_date: new Date().toISOString(),
    amount: 0,
    raw_text: "OCR extraction pending",
  }
}
