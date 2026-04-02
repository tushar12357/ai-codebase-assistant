'use client'

import { useState, useRef, useEffect } from 'react'
import { Plus, MessageSquare, Pencil, Check, X, Sparkles, LogOut, PanelLeftClose, PanelLeftOpen, Loader2 } from 'lucide-react'
import { useRenameChat } from '@/hooks/useChats'
import { useLogout } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import type { Chat } from '@/types'

interface SidebarProps {
  chats: Chat[]
  activeChatId: string | null
  onSelectChat: (id: string) => void
  onNewChat: () => void
  isCreating: boolean
  isLoading: boolean
  isOpen: boolean
  onToggle: () => void
}

function ChatItem({
  chat,
  isActive,
  onSelect,
}: {
  chat: Chat
  isActive: boolean
  onSelect: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(chat.title)
  const inputRef = useRef<HTMLInputElement>(null)
  const renameChat = useRenameChat()

  useEffect(() => {
    setTitle(chat.title)
  }, [chat.title])

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const handleRename = async () => {
    const trimmed = title.trim()
    if (!trimmed || trimmed === chat.title) {
      setTitle(chat.title)
      setEditing(false)
      return
    }
    try {
      await renameChat.mutateAsync({ chatId: chat.id, title: trimmed })
    } catch {
      setTitle(chat.title)
    }
    setEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleRename()
    if (e.key === 'Escape') {
      setTitle(chat.title)
      setEditing(false)
    }
  }

  return (
    <div
      onClick={() => !editing && onSelect()}
      className={cn(
        'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all',
        isActive
          ? 'text-white'
          : 'hover:text-white'
      )}
      style={{
        background: isActive ? 'var(--accent-dim)' : 'transparent',
        border: isActive ? '1px solid rgba(124,106,255,0.2)' : '1px solid transparent',
        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
      }}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.background = 'transparent'
      }}
    >
      <MessageSquare size={14} className="shrink-0 opacity-60" />

      {editing ? (
        <input
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 bg-transparent outline-none text-sm min-w-0"
          style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--accent)' }}
        />
      ) : (
        <span className="flex-1 text-sm truncate">{chat.title || 'Untitled chat'}</span>
      )}

      {editing ? (
        <div className="flex gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button onClick={handleRename} className="p-0.5 rounded transition-colors hover:text-green-400">
            {renameChat.isPending ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
          </button>
          <button onClick={() => { setTitle(chat.title); setEditing(false) }} className="p-0.5 rounded hover:text-red-400 transition-colors">
            <X size={13} />
          </button>
        </div>
      ) : (
        <button
          onClick={(e) => { e.stopPropagation(); setEditing(true) }}
          className="shrink-0 p-1 rounded opacity-0 group-hover:opacity-100 transition-all"
          style={{ color: 'var(--text-muted)' }}
          title="Rename chat"
        >
          <Pencil size={12} />
        </button>
      )}
    </div>
  )
}

export function Sidebar({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  isCreating,
  isLoading,
  isOpen,
  onToggle,
}: SidebarProps) {
  const logout = useLogout()

  return (
    <div
      className="flex flex-col shrink-0 h-full transition-all duration-300 overflow-hidden"
      style={{
        width: isOpen ? '260px' : '0px',
        background: 'var(--surface-1)',
        borderRight: '1px solid var(--border)',
      }}
    >
      <div className="flex flex-col h-full" style={{ minWidth: '260px' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-5 pb-4 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent)' }}>
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="font-semibold text-sm" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              AIDA
            </span>
          </div>
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <PanelLeftClose size={16} />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="px-3 pb-3 shrink-0">
          <button
            onClick={onNewChat}
            disabled={isCreating}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{
              background: 'var(--accent)',
              color: 'white',
              opacity: isCreating ? 0.7 : 1,
            }}
            onMouseEnter={(e) => !isCreating && (e.currentTarget.style.background = 'var(--accent-hover)')}
            onMouseLeave={(e) => !isCreating && (e.currentTarget.style.background = 'var(--accent)')}
          >
            {isCreating ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
            New Chat
          </button>
        </div>

        {/* Divider */}
        <div className="mx-4 mb-3 shrink-0" style={{ height: '1px', background: 'var(--border)' }} />

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-2 space-y-0.5 pb-2">
          {isLoading ? (
            <div className="flex flex-col gap-2 px-2 pt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-9 rounded-xl animate-pulse" style={{ background: 'var(--surface-3)' }} />
              ))}
            </div>
          ) : chats.length === 0 ? (
            <div className="px-3 py-8 text-center">
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No conversations yet.</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Click &quot;New Chat&quot; to start.</p>
            </div>
          ) : (
            chats.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                isActive={chat.id === activeChatId}
                onSelect={() => onSelectChat(chat.id)}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-3 py-4 shrink-0" style={{ borderTop: '1px solid var(--border)' }}>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.08)'
              e.currentTarget.style.color = '#f87171'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--text-muted)'
            }}
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
