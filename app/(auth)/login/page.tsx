'use client'

import { useState, useRef, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { TrendingUp, Zap, BarChart2, Bot, Mail, ArrowRight, RotateCcw, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

type Step = 'email' | 'otp' | 'success'

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  const otpValue = otp.join('')

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Failed to send OTP')
        return
      }
      setStep('otp')
      setCountdown(60)
      toast.success('OTP sent! Check your inbox.')
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (countdown > 0 || loading) return
    setOtp(['', '', '', '', '', ''])
    setLoading(true)
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? 'Failed to resend')
        return
      }
      setCountdown(60)
      toast.success('New OTP sent!')
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return
    const next = [...otp]
    next[index] = value
    setOtp(next)
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (text.length === 6) {
      setOtp(text.split(''))
      inputRefs.current[5]?.focus()
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otpValue.length !== 6 || loading) return
    setLoading(true)
    try {
      const res = await signIn('email-otp', {
        email,
        otp: otpValue,
        redirect: false,
      })
      if (res?.error) {
        toast.error('Invalid or expired OTP. Please try again.')
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
        return
      }
      setStep('success')
      setTimeout(() => router.push('/dashboard'), 1200)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    await signIn('google', { callbackUrl: '/dashboard' })
  }

  return (
    <div className="min-h-screen bg-[#0f1117] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-[#0f1117] to-[#1a1f2e] border-r border-[#1f2937] flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#00d395] flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">TradingPro</span>
        </Link>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Professional Trading
              <br />
              <span className="bg-gradient-to-r from-[#00d395] to-[#3b82f6] bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed max-w-md">
              Get AI-powered signals, real-time charts, and professional analysis tools — all in one platform.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Zap, label: 'Live Signals', desc: '6 markets, 30s refresh', color: '#f59e0b' },
              { icon: BarChart2, label: 'Pro Charts', desc: 'TradingView powered', color: '#3b82f6' },
              { icon: Bot, label: 'AI Advisor', desc: 'Powered by Claude', color: '#00d395' },
              { icon: TrendingUp, label: 'Backtesting', desc: 'Historical analysis', color: '#8b5cf6' },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3 p-4 bg-[#1a1f2e] rounded-xl border border-[#1f2937]">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${item.color}20` }}>
                  <item.icon className="w-4 h-4" style={{ color: item.color }} />
                </div>
                <div>
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-600">
          ⚠️ Trading involves risk. Past performance is not indicative of future results.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#00d395] flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">TradingPro</span>
          </Link>

          {/* ── Step: email ── */}
          {step === 'email' && (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
                <p className="text-gray-400 text-sm">Sign in with your email or Google account</p>
              </div>

              {/* Google */}
              <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-medium py-3 px-6 rounded-xl hover:bg-gray-100 transition-colors shadow-sm mb-4"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-[#1f2937]" />
                <span className="text-xs text-gray-500">or continue with email</span>
                <div className="flex-1 h-px bg-[#1f2937]" />
              </div>

              {/* Email OTP */}
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-[#1a1f2e] border border-[#1f2937] rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#3b82f6] transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full flex items-center justify-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-xl transition-colors"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Send OTP
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {/* ── Step: OTP ── */}
          {step === 'otp' && (
            <>
              <div className="mb-8">
                <div className="w-12 h-12 rounded-2xl bg-[#3b82f6]/10 border border-[#3b82f6]/30 flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-[#3b82f6]" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Check your inbox</h2>
                <p className="text-gray-400 text-sm">
                  We sent a 6-digit code to{' '}
                  <span className="text-white font-medium">{email}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                {/* OTP inputs */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Enter your 6-digit code
                  </label>
                  <div className="flex gap-2" onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { inputRefs.current[i] = el }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className="flex-1 aspect-square text-center text-xl font-bold bg-[#1a1f2e] border border-[#1f2937] rounded-xl text-white focus:outline-none focus:border-[#3b82f6] focus:bg-[#1f2937] transition-colors"
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || otpValue.length !== 6}
                  className="w-full flex items-center justify-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-xl transition-colors"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Verify & Sign In
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-5 flex items-center justify-between text-sm">
                <button
                  onClick={() => { setStep('email'); setOtp(['', '', '', '', '', '']) }}
                  className="text-gray-500 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  ← Change email
                </button>
                <button
                  onClick={handleResend}
                  disabled={countdown > 0 || loading}
                  className="text-gray-500 hover:text-[#3b82f6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend code'}
                </button>
              </div>

              <div className="mt-6 p-3 bg-[#1a1f2e] rounded-xl border border-[#1f2937]">
                <p className="text-xs text-gray-500 text-center">
                  Code expires in 10 minutes. Check spam if not received.
                </p>
              </div>
            </>
          )}

          {/* ── Step: success ── */}
          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-[#00d395]/10 border border-[#00d395]/30 flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-8 h-8 text-[#00d395]" />
              </div>
              <h2 className="text-2xl font-bold mb-2">You're in!</h2>
              <p className="text-gray-400 text-sm">Redirecting to your dashboard…</p>
              <div className="mt-5 flex justify-center">
                <span className="w-5 h-5 border-2 border-[#00d395]/30 border-t-[#00d395] rounded-full animate-spin" />
              </div>
            </div>
          )}

          {step !== 'success' && (
            <div className="mt-6 text-center">
              <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors">
                ← Back to home
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
