import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Read file content
    const buffer = await file.arrayBuffer()
    const text = new TextDecoder().decode(buffer)

    // For actual PDFs, you would use a library like pdfjs-dist
    // For now, we handle text and image uploads with simple extraction

    return NextResponse.json({
      billId: "bill_" + Date.now(),
      extractedText: text,
      fileName: file.name,
      fileType: file.type,
    })
  } catch (error) {
    console.error("File processing error:", error)
    return NextResponse.json({ error: "File processing failed" }, { status: 500 })
  }
}
