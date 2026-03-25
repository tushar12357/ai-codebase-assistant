# ChatApp — AI Chatbot Frontend

A modern, production-ready chatbot UI built with Next.js 14, TypeScript, TailwindCSS, and TanStack Query v5.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript** — fully typed
- **Tailwind CSS** — utility-first styling with custom design tokens
- **TanStack Query v5** — server state management with optimistic updates
- **Axios** — HTTP client with JWT interceptor

## Design

- Dark theme with a deep navy/indigo palette (`#0a0a0f` base)
- Accent color: `#7c6aff` (purple)
- Fonts: **Syne** (headings) + **DM Sans** (body)
- Smooth animations, noise texture, glassmorphism details
- Responsive sidebar with collapse toggle

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set environment variables

```bash
cp .env.local.example .env.local
# Edit NEXT_PUBLIC_API_URL to point to your backend
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Folder Structure

```
chatbot-app/
├── app/
│   ├── layout.tsx          # Root layout + metadata
│   ├── globals.css         # Design tokens, custom styles
│   ├── page.tsx            # Redirect → /chat
│   ├── chat/
│   │   └── page.tsx        # Main chat UI (auth-gated)
│   ├── login/
│   │   └── page.tsx        # Login page
│   └── signup/
│       └── page.tsx        # Signup page
│
├── components/
│   ├── Providers.tsx       # TanStack Query provider
│   ├── AuthGuard.tsx       # Auth redirect wrapper
│   ├── ChatLayout.tsx      # 2-column layout controller
│   ├── Sidebar.tsx         # Chat list, new chat, rename
│   ├── ChatWindow.tsx      # Messages + input area
│   ├── MessageBubble.tsx   # Individual message component
│   └── ChatInput.tsx       # Auto-resize textarea + send button
│
├── hooks/
│   ├── useChats.ts         # useChats, useCreateChat, useRenameChat
│   ├── useMessages.ts      # useMessages(chatId)
│   ├── useAsk.ts           # useAskQuestion with optimistic updates
│   └── useAuth.ts          # useLogin, useSignup, useLogout
│
├── lib/
│   ├── axios.ts            # Axios instance with JWT interceptor
│   ├── auth.ts             # Token helpers (get/set/remove)
│   └── utils.ts            # cn() utility
│
└── types/
    └── index.ts            # All shared TypeScript types
```

## API Endpoints Expected

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/signup` | `{ email, password }` |
| POST | `/auth/login` | `{ email, password }` → `{ token }` |
| POST | `/chat/create` | Creates new chat → `Chat` |
| GET | `/chat` | List all chats → `Chat[]` |
| GET | `/chat/:id/messages` | Get messages → `Message[]` |
| POST | `/chat/:id/ask` | `{ query }` → `{ answer }` |
| PUT | `/chat/:id/rename` | `{ title }` |

## Features

- ✅ JWT auth with localStorage + Axios interceptor
- ✅ Auto-redirect on 401
- ✅ Optimistic UI for messages (instant feedback)
- ✅ Typing indicator while waiting for response
- ✅ Auto-scroll to latest message
- ✅ Inline chat rename (click pencil icon)
- ✅ Sidebar collapse toggle
- ✅ Auto-select first chat on load
- ✅ Empty state with suggestion prompts
- ✅ Enter to send, Shift+Enter for newline
- ✅ Auto-resize textarea
- ✅ Responsive dark UI
