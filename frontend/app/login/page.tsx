'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useLogin } from '@/hooks/useAuth'
import { Loader2, Sparkles, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login, loading, error } = useLogin()
  const searchParams = useSearchParams()
  const registered = searchParams.get('registered')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    await login(email, password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'var(--surface-0)' }}>
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-[120px]" style={{ background: 'var(--accent)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-8 blur-[100px]" style={{ background: '#ff6a9b' }} />

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent)' }}>
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="text-xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>ChatApp</span>
          </div>
          <h1 className="text-2xl font-semibold mb-1" style={{ fontFamily: 'var(--font-display)' }}>Welcome back</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sign in to continue your conversations</p>
        </div>

        {/* Success message */}
        {registered && (
          <div className="mb-4 p-3 rounded-xl text-sm text-center animate-slide-up"
            style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', color: '#4ade80' }}>
            Account created! Please sign in.
          </div>
        )}

        {/* Card */}
        <div className="rounded-2xl p-8" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-2 font-medium" style={{ color: 'var(--text-secondary)' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: 'var(--surface-4)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
              />
            </div>

            <div>
              <label className="block text-sm mb-2 font-medium" style={{ color: 'var(--text-secondary)' }}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: 'var(--surface-4)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm px-3 py-2 rounded-lg animate-fade-in"
                style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 mt-2"
              style={{
                background: loading ? 'rgba(124,106,255,0.5)' : 'var(--accent)',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.background = 'var(--accent-hover)')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.background = 'var(--accent)')}
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-muted)' }}>
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="transition-colors" style={{ color: 'var(--accent)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--accent)')}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
