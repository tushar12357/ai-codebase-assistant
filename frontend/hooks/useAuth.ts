'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'
import { setToken, removeToken } from '@/lib/auth'

export function useLogin() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      setToken(data.token)
      router.push('/chat')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return { login, loading, error }
}

export function useSignup() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const signup = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      await api.post('/auth/signup', { email, password })
      router.push('/login?registered=true')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return { signup, loading, error }
}

export function useLogout() {
  const router = useRouter()
  return () => {
    removeToken()
    router.push('/login')
  }
}
