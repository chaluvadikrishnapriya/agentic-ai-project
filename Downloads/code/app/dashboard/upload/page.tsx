"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function BillUploadPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [extractedText, setExtractedText] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/auth/login")
    }
  }, [router])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError("")
      setExtractedText("")
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.add("bg-primary/10")
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("bg-primary/10")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.remove("bg-primary/10")
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      setFile(droppedFile)
      setError("")
      setExtractedText("")
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file")
      return
    }

    setIsUploading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/bills/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      setExtractedText(data.extractedText)
      setUploadProgress(100)

      // Simulate processing
      setTimeout(() => {
        router.push("/dashboard/prediction?billId=" + data.billId)
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/dashboard" className="text-primary hover:underline mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-2">Upload Your Bill</h1>
          <p className="text-foreground/60">Upload a medical or pharmacy bill for AI analysis</p>
        </div>

        <Card className="p-8 mb-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className="border-2 border-dashed border-border rounded-lg p-12 text-center transition-colors cursor-pointer hover:border-primary/50 hover:bg-primary/5"
          >
            {file ? (
              <>
                <div className="text-4xl mb-4">📄</div>
                <p className="font-semibold text-foreground">{file.name}</p>
                <p className="text-sm text-foreground/60 mt-2">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </>
            ) : (
              <>
                <div className="text-4xl mb-4">📤</div>
                <p className="text-lg font-semibold text-foreground mb-2">Drag and drop your bill here</p>
                <p className="text-foreground/60 mb-4">or click to browse</p>
              </>
            )}
            <Input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.txt"
              onChange={handleFileChange}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className="cursor-pointer">
              {!file && (
                <Button variant="outline" type="button">
                  Choose File
                </Button>
              )}
            </label>
          </div>

          <p className="text-sm text-foreground/60 mt-6 text-center">
            Supported formats: PDF, JPG, PNG, TXT • Max 10MB
          </p>
        </Card>

        {error && (
          <Card className="p-4 bg-destructive/10 border-destructive/20 mb-6">
            <p className="text-destructive">{error}</p>
          </Card>
        )}

        {isUploading && (
          <Card className="p-6 mb-6">
            <p className="text-sm text-foreground/60 mb-3">Processing your bill...</p>
            <div className="w-full bg-border rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </Card>
        )}

        {extractedText && (
          <Card className="p-6 mb-6 bg-secondary/20">
            <h2 className="font-semibold text-foreground mb-3">Extracted Text</h2>
            <div className="bg-background p-4 rounded border border-border max-h-48 overflow-y-auto">
              <p className="text-sm text-foreground/70 whitespace-pre-wrap">{extractedText}</p>
            </div>
          </Card>
        )}

        <div className="flex gap-4">
          <Button variant="outline" onClick={() => setFile(null)} disabled={isUploading || !file} className="flex-1">
            Clear
          </Button>
          <Button onClick={handleUpload} disabled={isUploading || !file} className="flex-1">
            {isUploading ? `Processing... ${uploadProgress}%` : "Analyze Bill"}
          </Button>
        </div>
      </main>
    </div>
  )
}
