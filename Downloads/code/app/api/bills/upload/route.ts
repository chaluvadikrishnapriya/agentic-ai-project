import { createClient } from "@/lib/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const userId = formData.get("userId") as string

    if (!file || userId !== user.id) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    // For now, just store the file metadata
    // OCR processing will be added in the next phase
    const fileName = file.name
    const fileSize = file.size
    const uploadedAt = new Date().toISOString()

    // Store in database
    const { data: bill, error } = await supabase
      .from("bills")
      .insert({
        user_id: user.id,
        file_name: fileName,
        file_path: `bills/${user.id}/${Date.now()}-${fileName}`,
        merchant_name: "Processing...",
        extracted_data: {
          status: "pending",
          uploaded_at: uploadedAt,
          file_size: fileSize,
        },
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to save bill" }, { status: 500 })
    }

    return NextResponse.json(bill)
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
