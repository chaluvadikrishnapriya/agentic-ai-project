"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ChatInterface } from "@/components/chat-interface"

export default function ChatPage() {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Health Assistant</h1>
          <p className="text-muted-foreground mt-2">Ask questions about your health, cycle, and wellness</p>
        </div>
        <ChatInterface />
      </div>
    </DashboardLayout>
  )
}
