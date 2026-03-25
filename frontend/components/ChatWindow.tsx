'use client'

import { useEffect, useRef } from 'react'
import { PanelLeftOpen, MessageSquare, Sparkles } from 'lucide-react'
import { MessageBubble } from './MessageBubble'
import { ChatInput } from './ChatInput'
import { useMessages } from '@/hooks/useMessages'
import { useAskQuestion } from '@/hooks/useAsk'
import type { Chat, OptimisticMessage } from '@/types'

interface ChatWindowProps {
  chat: Chat | null
  onToggleSidebar: () => void
  sidebarOpen: boolean
}

function EmptyState({ onNew }: { onNew?: () => void }) {
  const suggestions = [
    'Explain quantum computing in simple terms',
    'Write a Python function to parse JSON',
    'Give me ideas for a side project',
    'Help me improve this email draft',
  ]

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 animate-fade-in">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: 'var(--accent)', boxShadow: '0 0 40px rgba(124,106,255,0.3)' }}
      >
        <Sparkles size={24} className="text-white" />
      </div>
      <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
        How can I help you today?
      </h2>
      <p className="text-sm mb-8 text-center max-w-sm" style={{ color: 'var(--text-secondary)' }}>
        Start a conversation below, or try one of these prompts
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl">
        {suggestions.map((s) => (
          <button
            key={s}
            className="px-4 py-3 rounded-xl text-sm text-left transition-all"
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(124,106,255,0.3)'
              e.currentTarget.style.color = 'var(--text-primary)'
              e.currentTarget.style.background = 'var(--surface-3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.color = 'var(--text-secondary)'
              e.currentTarget.style.background = 'var(--surface-2)'
            }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}

function NoChatSelected() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 animate-fade-in">
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ background: 'var(--surface-3)', border: '1px solid var(--border)' }}
      >
        <MessageSquare size={20} style={{ color: 'var(--text-muted)' }} />
      </div>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Select or create a chat to get started</p>
    </div>
  )
}

export function ChatWindow({ chat, onToggleSidebar, sidebarOpen }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const { data: messages, isLoading: loadingMessages } = useMessages(chat?.id ?? null)
  const askQuestion = useAskQuestion(chat?.id ?? null)

  const isAsking = askQuestion.isPending

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (query: string) => {
    if (!chat) return
    try {
      await askQuestion.mutateAsync(query)
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }

  const typedMessages = (messages ?? []) as OptimisticMessage[]

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden" style={{ background: 'var(--surface-0)' }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-4 shrink-0"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-1)' }}
      >
        {!sidebarOpen && (
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-lg transition-colors mr-1"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <PanelLeftOpen size={17} />
          </button>
        )}

        <div className="flex-1 min-w-0">
          {chat ? (
            <h1
              className="font-semibold text-sm truncate"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              {chat.title || 'New Conversation'}
            </h1>
          ) : (
            <h1 className="font-semibold text-sm" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-muted)' }}>
              ChatApp
            </h1>
          )}
        </div>

        {/* Status indicator */}
        {isAsking && (
          <div className="flex items-center gap-2 animate-fade-in">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: 'var(--accent)' }}
            />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Generating…</span>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {!chat ? (
          <NoChatSelected />
        ) : loadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex gap-1">
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          </div>
        ) : typedMessages.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
            {typedMessages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      {chat && (
        <div
          className="shrink-0 px-4 pb-4 pt-3 animate-slide-up"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <ChatInput
            onSend={handleSend}
            isLoading={isAsking}
            disabled={!chat}
          />
        </div>
      )}
    </div>
  )
}
