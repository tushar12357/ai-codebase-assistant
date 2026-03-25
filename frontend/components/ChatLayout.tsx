'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { ChatWindow } from './ChatWindow'
import { useChats, useCreateChat } from '@/hooks/useChats'

export function ChatLayout() {
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const { data: chats, isLoading } = useChats()
  const createChat = useCreateChat()

  // Auto-select first chat on load
  useEffect(() => {
    if (chats && chats.length > 0 && !activeChatId) {
      setActiveChatId(chats[0].id)
    }
  }, [chats, activeChatId])

  const handleNewChat = async () => {
    try {
      const newChat = await createChat.mutateAsync()
      setActiveChatId(newChat.id)
    } catch (err) {
      console.error('Failed to create chat:', err)
    }
  }

  const activeChat = chats?.find((c) => c.id === activeChatId) ?? null

  return (
    <div className="flex h-screen w-screen overflow-hidden relative" style={{ background: 'var(--surface-0)' }}>
      <Sidebar
        chats={chats ?? []}
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
        onNewChat={handleNewChat}
        isCreating={createChat.isPending}
        isLoading={isLoading}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
      />
      <ChatWindow
        chat={activeChat}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        sidebarOpen={sidebarOpen}
      />
    </div>
  )
}
