"use client";

import { Sparkles, User } from "lucide-react";
import type { OptimisticMessage } from "@/types";

interface MessageBubbleProps {
  message: OptimisticMessage;
}

function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center px-1 py-1">
      <div className="typing-dot" />
      <div className="typing-dot" />
      <div className="typing-dot" />
    </div>
  );
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  function renderContent(content: any) {
    try {
      // Try parsing JSON string
      const parsed =
        typeof content === "string" ? JSON.parse(content) : content;

      if (Array.isArray(parsed)) {
        return (
          <div className="space-y-2">
            {parsed.map((item, i) => (
              <div
                key={i}
                className="p-3 rounded-lg border"
                style={{ borderColor: "var(--border)" }}
              >
                <a
                  href={item.url}
                  target="_blank"
                  className="font-medium underline"
                >
                  {item.name}
                </a>
                <div className="text-xs opacity-70">⭐ {item.stars}</div>
              </div>
            ))}
          </div>
        );
      }

      return parsed;
    } catch {
      return content; // fallback
    }
  }

  if (isUser) {
    return (
      <div className="flex justify-end animate-slide-up">
        <div className="flex items-end gap-2 max-w-[75%]">
          <div
            className="px-4 py-3 rounded-2xl rounded-br-sm text-sm leading-relaxed"
            style={{
              background: "var(--accent)",
              color: "white",
              opacity: (message as any).isOptimistic ? 0.8 : 1,
            }}
          >
            {renderContent(message.content)}
          </div>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mb-0.5"
            style={{
              background: "var(--surface-4)",
              border: "1px solid var(--border)",
            }}
          >
            <User size={13} style={{ color: "var(--text-secondary)" }} />
          </div>
        </div>
      </div>
    );
  }

  // Assistant
  return (
    <div className="flex items-start gap-3 animate-slide-up">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
        style={{
          background: "var(--accent)",
          boxShadow: "0 0 12px rgba(124,106,255,0.4)",
        }}
      >
        <Sparkles size={13} className="text-white" />
      </div>
      <div
        className="px-4 py-3 rounded-2xl rounded-tl-sm text-sm leading-relaxed max-w-[75%]"
        style={{
          background: "var(--surface-3)",
          border: "1px solid var(--border)",
          color: "var(--text-primary)",
        }}
      >
        {(message as any).isLoading ? (
          <TypingIndicator />
        ) : (
          <div className="message-content whitespace-pre-wrap">
            {message.content}
          </div>
        )}
      </div>
    </div>
  );
}
