'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading: boolean
  disabled?: boolean
}

export function ChatInput({ onSend, isLoading, disabled }: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 180) + 'px'
  }, [value])

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || isLoading || disabled) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const canSend = value.trim().length > 0 && !isLoading && !disabled

  return (
    <div
      className="mx-auto w-full max-w-3xl"
    >
      <div
        className="flex items-end gap-3 px-4 py-3 rounded-2xl transition-all"
        style={{
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
        }}
        onFocusCapture={(e) => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = 'rgba(124,106,255,0.4)'
          el.style.boxShadow = '0 0 0 3px rgba(124,106,255,0.08)'
        }}
        onBlurCapture={(e) => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = 'var(--border)'
          el.style.boxShadow = 'none'
        }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message AIDA... (Enter to send, Shift+Enter for newline)"
          rows={1}
          disabled={disabled}
          className="flex-1 bg-transparent resize-none outline-none text-sm leading-relaxed"
          style={{
            color: 'var(--text-primary)',
            maxHeight: '180px',
            overflowY: 'auto',
          }}
        />
        <button
          onClick={handleSend}
          disabled={!canSend}
          className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all"
          style={{
            background: canSend ? 'var(--accent)' : 'var(--surface-4)',
            color: canSend ? 'white' : 'var(--text-muted)',
            cursor: canSend ? 'pointer' : 'not-allowed',
            transform: canSend ? 'scale(1)' : 'scale(0.95)',
          }}
        >
          {isLoading ? <Loader2 size={15} className="animate-spin" /> : <Send size={14} />}
        </button>
      </div>
      <p className="text-center mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
        AI can make mistakes. Verify important information.
      </p>
    </div>
  )
}
