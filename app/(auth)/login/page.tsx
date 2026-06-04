'use client'

import { signIn } from 'next-auth/react'
import { TrendingUp, Zap, BarChart2, Bot } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
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
          <span className="text-xl font-bold">TradeOnix</span>
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
            <span className="font-bold text-lg">TradeOnix</span>
          </Link>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
            <p className="text-gray-400 text-sm">Sign in to your TradeOnix account</p>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-medium py-3 px-6 rounded-xl hover:bg-gray-100 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
