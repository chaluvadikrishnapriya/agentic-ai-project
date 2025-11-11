"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { BillList } from "./bill-list"

interface ExtractedData {
  merchant_name?: string
  bill_date?: string
  amount?: string
  items?: Array<{
    name: string
    quantity: number
    price: number
  }>
}

export function BillUploadSection({ userId }: { userId: string }) {
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedBills, setUploadedBills] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    setFiles((prev) => [...prev, ...selectedFiles].slice(0, 10)) // Max 10 files
    setError(null)
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      setError("Please select at least one file")
      return
    }

    setIsUploading(true)
    setError(null)
    setSuccess(null)

    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("userId", userId)

        const response = await fetch("/api/bills/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`)
        }

        const bill = await response.json()
        setUploadedBills((prev) => [bill, ...prev])
      }

      setSuccess(`Successfully uploaded ${files.length} bill(s)`)
      setFiles([])
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setIsUploading(false)
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Upload Medical Bills
          </CardTitle>
          <CardDescription>
            Upload medical bills or receipts. Our AI will extract relevant health and cost information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
            />
            <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="w-full">
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">Click to select files or drag and drop</p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG, or PDF • Max 10 files</p>
            </button>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Selected files ({files.length}):</p>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-secondary/10 rounded border border-border"
                  >
                    <span className="text-sm text-foreground truncate">{file.name}</span>
                    <button
                      onClick={() => removeFile(index)}
                      disabled={isUploading}
                      className="text-xs text-destructive hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alerts */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-3 p-4 bg-accent/10 border border-accent/30 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <p className="text-sm text-accent-foreground">{success}</p>
            </div>
          )}

          {/* Upload Button */}
          <Button onClick={handleUpload} disabled={isUploading || files.length === 0} size="lg" className="w-full">
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing {files.length} file(s)...
              </>
            ) : (
              `Upload ${files.length > 0 ? `${files.length} File(s)` : "Files"}`
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Uploaded Bills List */}
      {uploadedBills.length > 0 && <BillList bills={uploadedBills} />}
    </div>
  )
}
