'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSignup } from '@/hooks/useAuth'
import { Loader2, Sparkles, Eye, EyeOff } from 'lucide-react'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const { signup, loading, error } = useSignup()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    if (password !== confirm) {
      setLocalError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.')
      return
    }
    await signup(email, password)
  }

  const displayError = localError || error

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'var(--surface-0)' }}>
      <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full opacity-10 blur-[120px]" style={{ background: 'var(--accent)' }} />
      <div className="absolute bottom-1/3 left-1/4 w-64 h-64 rounded-full opacity-8 blur-[100px]" style={{ background: '#ff9f6a' }} />

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent)' }}>
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="text-xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>ChatApp</span>
          </div>
          <h1 className="text-2xl font-semibold mb-1" style={{ fontFamily: 'var(--font-display)' }}>Create an account</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Start chatting with AI today</p>
        </div>

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
                style={{ background: 'var(--surface-4)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
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
                  placeholder="Min. 6 characters"
                  required
                  className="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none transition-all"
                  style={{ background: 'var(--surface-4)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 font-medium" style={{ color: 'var(--text-secondary)' }}>Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat your password"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{ background: 'var(--surface-4)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
              />
            </div>

            {displayError && (
              <div className="text-sm px-3 py-2 rounded-lg animate-fade-in"
                style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                {displayError}
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
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--accent)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--accent)')}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
