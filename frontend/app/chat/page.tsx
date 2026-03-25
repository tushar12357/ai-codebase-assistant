'use client'

import { ChatLayout } from '@/components/ChatLayout'
import { AuthGuard } from '@/components/AuthGuard'

export default function ChatPage() {
  return (
    <AuthGuard>
      <ChatLayout />
    </AuthGuard>
  )
}
