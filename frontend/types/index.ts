export interface Chat {
  id: string
  title: string
  created_at: string
  updated_at?: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface AuthResponse {
  token: string
}

export interface SignupPayload {
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AskPayload {
  query: string
}

export interface AskResponse {
  answer: string
}

export interface RenamePayload {
  title: string
}

export interface ApiError {
  message: string
  status?: number
}

export type OptimisticMessage = Message & { isOptimistic?: boolean; isLoading?: boolean }
