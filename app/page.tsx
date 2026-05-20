'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  TrendingUp, Zap, BarChart2, Bot, BookOpen, FlaskConical,
  Check, ArrowRight, Shield, Star, ChevronRight, Activity,
  Globe, Lock, Cpu
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// ── Scroll reveal hook ──────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.12 }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

// ── Animated counter ────────────────────────────────────────────────────────
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      obs.disconnect()
      let start = 0
      const step = Math.ceil(to / 60)
      const timer = setInterval(() => {
        start += step
        if (start >= to) { setVal(to); clearInterval(timer) }
        else setVal(start)
      }, 16)
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [to])

  return <span ref={ref}>{val}{suffix}</span>
}

// ── Ticker tape data ────────────────────────────────────────────────────────
const tickers = [
  { sym: 'EUR/USD', price: '1.0852', change: '+0.12%', up: true },
  { sym: 'BTC/USD', price: '67,420', change: '+2.34%', up: true },
  { sym: 'GBP/USD', price: '1.2741', change: '-0.08%', up: false },
  { sym: 'ETH/USD', price: '3,512', change: '+1.87%', up: true },
  { sym: 'USD/JPY', price: '154.32', change: '+0.21%', up: true },
  { sym: 'XAU/USD', price: '2,318', change: '-0.15%', up: false },
  { sym: 'EUR/USD', price: '1.0852', change: '+0.12%', up: true },
  { sym: 'BTC/USD', price: '67,420', change: '+2.34%', up: true },
  { sym: 'GBP/USD', price: '1.2741', change: '-0.08%', up: false },
  { sym: 'ETH/USD', price: '3,512', change: '+1.87%', up: true },
  { sym: 'USD/JPY', price: '154.32', change: '+0.21%', up: true },
  { sym: 'XAU/USD', price: '2,318', change: '-0.15%', up: false },
]

const features = [
  { icon: BarChart2,    title: 'Real-Time Charts',      desc: 'Professional TradingView-powered charts with live OHLCV data for Forex, Crypto & Commodities.', color: '#3b82f6' },
  { icon: Zap,          title: 'Live Signals',           desc: 'AI signals combining RSI, MACD, Bollinger Bands & EMA — refreshed every 30 seconds.', color: '#f59e0b' },
  { icon: Bot,          title: 'AI Trading Advisor',     desc: 'Chat with Gemini AI about market setups, entry points, and risk management in real time.', color: '#00d395' },
  { icon: BookOpen,     title: 'Trading Education',      desc: 'Interactive modules, quizzes and progress tracking to level up your trading knowledge.', color: '#8b5cf6' },
  { icon: FlaskConical, title: 'Strategy Backtesting',   desc: 'Test strategies on historical data. View equity curves, max drawdown & Sharpe ratios.', color: '#f97316' },
  { icon: Shield,       title: 'Risk Management',        desc: 'Position sizing, stop-loss calculator and portfolio risk tools built into every trade.', color: '#ef4444' },
]

const steps = [
  { n: '01', icon: Globe,    title: 'Sign Up Free',       desc: 'Create your account in seconds with Google or email OTP. No credit card required.' },
  { n: '02', icon: Activity, title: 'Get Live Signals',   desc: 'Our engine analyses 6 markets every 30s — RSI, MACD, Bollinger Bands combined.' },
  { n: '03', icon: Cpu,      title: 'Trade with AI',      desc: 'Use AI-powered analysis, pro charts and backtested strategies to trade smarter.' },
]

const plans = [
  {
    name: 'Free', price: '$0', period: 'forever', highlight: false,
    color: '#6b7280', badge: null,
    features: ['RSI signals for 6 pairs', 'Basic candlestick charts', 'Live price feed', '3 watchlist items'],
  },
  {
    name: 'Pro', price: '$9.99', period: '/month', highlight: true,
    color: '#3b82f6', badge: 'Most Popular',
    features: ['All Free features', 'MACD + Bollinger Band signals', 'AI Trading Advisor', 'Full learn curriculum', '20 watchlist items'],
  },
  {
    name: 'Premium', price: '$24.99', period: '/month', highlight: false,
    color: '#8b5cf6', badge: 'Best Value',
    features: ['All Pro features', 'Full backtesting engine', 'Stochastic + Fibonacci', 'Unlimited watchlist', 'Priority support'],
  },
]

const testimonials = [
  { name: 'Alex R.', role: 'Forex Trader', text: 'The signal confidence scores are spot-on. My win rate improved significantly after switching to TradingPro.', stars: 5 },
  { name: 'Sarah K.', role: 'Crypto Investor', text: 'The AI Advisor feels like having a personal analyst available 24/7. Absolutely worth the Pro plan.', stars: 5 },
  { name: 'Mike T.', role: 'Day Trader', text: 'Backtesting on 6 months of BTC data gave me the confidence to run my strategy live. Game changer.', stars: 5 },
]

export default function LandingPage() {
  useReveal()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#0f1117] text-white overflow-x-hidden">

      {/* ── Background orbs ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
        <div className="animate-glow-pulse absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#3b82f6]/8 blur-[120px]" />
        <div className="animate-glow-pulse animate-delay-500 absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#00d395]/8 blur-[120px]" />
        <div className="animate-glow-pulse animate-delay-300 absolute top-1/2 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-[#8b5cf6]/5 blur-[100px]" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 border-b border-[#1f2937]/80 bg-[#0f1117]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#00d395] flex items-center justify-center shadow-lg shadow-[#3b82f6]/30 group-hover:shadow-[#3b82f6]/50 transition-shadow">
                <TrendingUp className="w-4.5 h-4.5 text-white" />
                <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="font-bold text-lg tracking-tight">TradingPro</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {['Features', 'How It Works', 'Pricing'].map((item) => (
                <Link key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200 relative group">
                  {item}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-[#3b82f6] to-[#00d395] group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">Sign in</Button>
              </Link>
              <Link href="/login">
                <Button size="sm" className="bg-gradient-to-r from-[#3b82f6] to-[#00d395] hover:opacity-90 text-white border-0 shadow-lg shadow-[#3b82f6]/25 transition-all hover:shadow-[#3b82f6]/40">
                  Start Free →
                </Button>
              </Link>
            </div>

            <button className="md:hidden p-2 text-gray-400" onClick={() => setMenuOpen(!menuOpen)}>
              <div className="space-y-1.5">
                <span className={`block w-5 h-0.5 bg-current transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block w-5 h-0.5 bg-current transition-all ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-5 h-0.5 bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="md:hidden border-t border-[#1f2937] py-4 space-y-3">
              {['Features', 'How It Works', 'Pricing'].map((item) => (
                <Link key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm text-gray-400 hover:text-white px-2 py-1.5">
                  {item}
                </Link>
              ))}
              <div className="flex gap-3 pt-2">
                <Link href="/login" className="flex-1"><Button variant="outline" size="sm" className="w-full">Sign in</Button></Link>
                <Link href="/login" className="flex-1"><Button size="sm" className="w-full bg-gradient-to-r from-[#3b82f6] to-[#00d395] border-0">Start Free</Button></Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ── Ticker tape ── */}
      <div className="border-b border-[#1f2937]/60 bg-[#0f1117]/80 py-2.5 overflow-hidden">
        <div className="flex animate-ticker whitespace-nowrap">
          {tickers.map((t, i) => (
            <div key={i} className="flex items-center gap-3 mx-8 flex-shrink-0">
              <span className="text-xs font-semibold text-gray-300">{t.sym}</span>
              <span className="text-xs font-mono text-white">{t.price}</span>
              <span className={`text-xs font-semibold ${t.up ? 'text-[#00d395]' : 'text-[#ff4444]'}`}>{t.change}</span>
              <span className="text-[#1f2937]">|</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="relative pt-24 pb-32 px-4 z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="animate-slide-up inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[#1f2937] bg-[#1a1f2e]/80 backdrop-blur-sm text-xs text-gray-400 mb-8 shadow-xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-[#00d395] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00d395]" />
            </span>
            Live signals — 6 markets updated every 30 seconds
            <ChevronRight className="w-3.5 h-3.5 text-[#00d395]" />
          </div>

          {/* Headline */}
          <h1 className="animate-slide-up animate-delay-100 text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight mb-6">
            Trade Smarter
            <br />
            <span className="gradient-animated">with AI Signals</span>
          </h1>

          <p className="animate-slide-up animate-delay-200 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Real-time trading signals for Forex, Crypto & Commodities. Backed by RSI, MACD, Bollinger Bands and Gemini AI analysis — all in one professional platform.
          </p>

          <div className="animate-slide-up animate-delay-300 flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/login">
              <Button size="xl" className="group w-full sm:w-auto gap-2 bg-gradient-to-r from-[#00d395] to-[#3b82f6] hover:opacity-95 text-white border-0 shadow-xl shadow-[#00d395]/20 hover:shadow-[#00d395]/40 transition-all px-8 text-base">
                Start Trading Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="xl" variant="outline" className="w-full sm:w-auto text-base px-8 border-[#1f2937] hover:border-[#374151] bg-[#1a1f2e]/50 backdrop-blur-sm">
                Explore Features
              </Button>
            </Link>
          </div>

          {/* Stats row */}
          <div className="animate-slide-up animate-delay-400 grid grid-cols-3 gap-6 max-w-sm mx-auto pt-10 border-t border-[#1f2937]/60">
            {[
              { to: 6, suffix: '', label: 'Markets' },
              { to: 5, suffix: '+', label: 'Strategies' },
              { to: 30, suffix: 's', label: 'Refresh Rate' },
            ].map((s) => (
              <div key={s.label} className="text-center group">
                <p className="text-3xl font-extrabold gradient-animated tabular-nums">
                  <Counter to={s.to} suffix={s.suffix} />
                </p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Floating chart mockup */}
        <div className="relative max-w-4xl mx-auto mt-20 px-4">
          <div className="animate-float animate-border-glow rounded-2xl border bg-gradient-to-b from-[#1a1f2e] to-[#0f1117] p-1 shadow-2xl shadow-black/50">
            <div className="rounded-xl overflow-hidden bg-[#0f1117] p-5">
              {/* Fake chart header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center">
                    <span className="text-base">₿</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">BTC/USD</p>
                    <p className="text-xs text-[#00d395]">$67,420 <span className="text-gray-500">+2.34%</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {['1m','5m','1h','1D'].map((t) => (
                    <button key={t} className={`text-xs px-2.5 py-1 rounded-md ${t==='1D' ? 'bg-[#3b82f6] text-white' : 'text-gray-500 hover:text-white'}`}>{t}</button>
                  ))}
                  <div className="ml-2 px-2.5 py-1 rounded-md bg-[#00d395]/10 border border-[#00d395]/30 text-[#00d395] text-xs font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00d395] animate-pulse" />
                    STRONG BUY · 87%
                  </div>
                </div>
              </div>
              {/* Fake SVG candlestick chart */}
              <div className="relative h-48 w-full">
                <svg className="w-full h-full" viewBox="0 0 800 180" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Area fill */}
                  <path d="M0,140 C50,130 80,120 120,115 C160,110 190,125 230,118 C270,111 300,100 340,90 C380,80 410,95 450,85 C490,75 520,60 560,50 C600,40 630,55 670,45 C710,35 750,25 800,20 L800,180 L0,180 Z"
                    fill="url(#areaGrad)" />
                  {/* Price line */}
                  <path d="M0,140 C50,130 80,120 120,115 C160,110 190,125 230,118 C270,111 300,100 340,90 C380,80 410,95 450,85 C490,75 520,60 560,50 C600,40 630,55 670,45 C710,35 750,25 800,20"
                    fill="none" stroke="#3b82f6" strokeWidth="2" />
                  {/* Bollinger bands */}
                  <path d="M0,120 C80,110 160,130 240,110 C320,90 400,105 480,88 C560,71 640,85 720,70 C760,63 780,55 800,50"
                    fill="none" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="4,3" opacity="0.5" />
                  <path d="M0,160 C80,150 160,165 240,148 C320,131 400,145 480,130 C560,115 640,128 720,115 C760,108 780,100 800,95"
                    fill="none" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="4,3" opacity="0.5" />
                  {/* RSI line (below) */}
                  <line x1="0" y1="170" x2="800" y2="170" stroke="#1f2937" strokeWidth="0.5" />
                </svg>
                {/* Indicators overlay */}
                <div className="absolute top-2 right-2 flex gap-2">
                  <span className="text-xs px-2 py-0.5 rounded bg-[#8b5cf6]/15 text-[#8b5cf6] border border-[#8b5cf6]/20">BB</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/20">MACD</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/20">RSI 42</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating signal cards */}
          <div className="animate-float-delayed absolute -left-4 top-12 hidden lg:block">
            <div className="bg-[#1a1f2e] border border-[#1f2937] rounded-xl p-3.5 shadow-2xl w-44">
              <p className="text-xs text-gray-500 mb-1">EUR/USD Signal</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">STRONG BUY</span>
                <span className="w-2 h-2 rounded-full bg-[#00d395] animate-pulse" />
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-[#1f2937]">
                <div className="h-full w-[87%] rounded-full bg-gradient-to-r from-[#00d395] to-[#3b82f6]" />
              </div>
              <p className="text-xs text-[#00d395] mt-1.5">87% confidence</p>
            </div>
          </div>

          <div className="animate-float absolute -right-4 bottom-8 hidden lg:block" style={{ animationDelay: '2s' }}>
            <div className="bg-[#1a1f2e] border border-[#1f2937] rounded-xl p-3.5 shadow-2xl w-48">
              <p className="text-xs text-gray-500 mb-2">AI Insight</p>
              <p className="text-xs text-gray-300 leading-relaxed">RSI oversold at 32.4 · MACD bullish crossover forming ↗</p>
              <div className="flex items-center gap-1.5 mt-2">
                <Bot className="w-3.5 h-3.5 text-[#00d395]" />
                <span className="text-xs text-[#00d395]">Gemini AI</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="relative py-28 px-4 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="reveal text-center mb-16">
            <span className="inline-block text-xs font-semibold text-[#3b82f6] tracking-widest uppercase mb-4">Platform Features</span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything you need to trade smarter</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Professional-grade tools built for active traders — from live signals to AI-powered advice.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div key={f.title}
                className={`reveal card-glow group relative bg-[#1a1f2e] border border-[#1f2937] rounded-2xl p-6 transition-all duration-300 cursor-default overflow-hidden`}
                style={{ transitionDelay: `${i * 80}ms` }}>
                {/* Subtle corner glow */}
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
                  style={{ background: `${f.color}20`, transform: 'translate(30%, -30%)' }} />
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${f.color}18`, border: `1px solid ${f.color}30` }}>
                  <f.icon className="w-6 h-6" style={{ color: f.color }} />
                </div>
                <h3 className="text-base font-semibold mb-2 text-white">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="relative py-28 px-4 border-t border-[#1f2937]/60 z-10">
        <div className="max-w-5xl mx-auto">
          <div className="reveal text-center mb-16">
            <span className="inline-block text-xs font-semibold text-[#00d395] tracking-widest uppercase mb-4">Simple Process</span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Get started in 3 steps</h2>
            <p className="text-gray-400">No experience needed. Be live in under 2 minutes.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-[#1f2937] to-transparent" />

            {steps.map((step, i) => (
              <div key={step.n} className={`reveal text-center group`} style={{ transitionDelay: `${i * 120}ms` }}>
                <div className="relative inline-flex">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1a1f2e] to-[#0f1117] border border-[#1f2937] flex flex-col items-center justify-center mx-auto mb-5 shadow-xl group-hover:border-[#3b82f6]/50 transition-colors duration-300">
                    <step.icon className="w-7 h-7 text-[#3b82f6] mb-0.5" />
                    <span className="text-[10px] font-bold text-gray-600">{step.n}</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#00d395] flex items-center justify-center text-[9px] font-bold text-white shadow-lg">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social proof ── */}
      <section className="relative py-20 px-4 border-t border-[#1f2937]/60 z-10 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="reveal text-center mb-12">
            <span className="inline-block text-xs font-semibold text-[#8b5cf6] tracking-widest uppercase mb-4">Testimonials</span>
            <h2 className="text-3xl font-bold">Traders love TradingPro</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <div key={t.name} className="reveal card-glow bg-[#1a1f2e] border border-[#1f2937] rounded-2xl p-6 transition-all duration-300"
                style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-[#f59e0b] text-[#f59e0b]" />
                  ))}
                </div>
                <p className="text-sm text-gray-300 leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3b82f6] to-[#00d395] flex items-center justify-center text-sm font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="relative py-28 px-4 border-t border-[#1f2937]/60 z-10">
        <div className="max-w-5xl mx-auto">
          <div className="reveal text-center mb-16">
            <span className="inline-block text-xs font-semibold text-[#f59e0b] tracking-widest uppercase mb-4">Pricing</span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-gray-400">Start free. Upgrade when you need more power.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <div key={plan.name}
                className={`reveal relative rounded-2xl border p-7 flex flex-col transition-all duration-500 card-glow ${
                  plan.highlight
                    ? 'border-[#3b82f6]/60 bg-gradient-to-b from-[#3b82f6]/8 to-[#1a1f2e] shadow-2xl shadow-[#3b82f6]/15'
                    : 'border-[#1f2937] bg-[#1a1f2e]'
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}>

                {plan.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1 rounded-full ${
                    plan.highlight ? 'bg-[#3b82f6] text-white' : 'bg-[#8b5cf6] text-white'
                  } shadow-lg`}>
                    {plan.badge}
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${plan.color}20` }}>
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: plan.color }} />
                    </div>
                    <h3 className="text-lg font-bold">{plan.name}</h3>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    <span className="text-gray-400 text-sm">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className="w-4 h-4 text-[#00d395] mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/login">
                  <Button className={`w-full font-semibold transition-all ${
                    plan.highlight
                      ? 'bg-gradient-to-r from-[#3b82f6] to-[#00d395] border-0 text-white hover:opacity-90 shadow-lg shadow-[#3b82f6]/20'
                      : plan.name === 'Premium'
                      ? 'bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] border-0 text-white hover:opacity-90'
                      : ''
                  }`}
                    variant={plan.highlight || plan.name === 'Premium' ? 'default' : 'outline'}>
                    {plan.name === 'Free' ? 'Get Started Free' : `Start ${plan.name}`}
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          <p className="reveal text-center text-xs text-gray-600 mt-8">
            30-day money-back guarantee · Cancel anytime · No hidden fees
          </p>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative py-28 px-4 border-t border-[#1f2937]/60 z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00d395]/30 bg-[#00d395]/5 text-xs text-[#00d395] mb-8">
              <Lock className="w-3.5 h-3.5" />
              Secure · No credit card required to start
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-5 leading-tight">
              Ready to trade
              <br />
              <span className="gradient-animated">with an edge?</span>
            </h2>
            <p className="text-gray-400 text-lg mb-10">
              Join traders using TradingPro for professional signals and AI-powered market analysis.
            </p>
            <Link href="/login">
              <Button size="xl" className="group gap-3 text-base px-10 bg-gradient-to-r from-[#00d395] to-[#3b82f6] hover:opacity-95 text-white border-0 shadow-2xl shadow-[#00d395]/25 hover:shadow-[#00d395]/40 transition-all">
                Start Trading Free — It's Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#1f2937]/60 py-10 px-4 z-10 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#00d395] flex items-center justify-center shadow-lg shadow-[#3b82f6]/20">
                <TrendingUp className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-sm">TradingPro</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-gray-500">
              <Link href="/login" className="hover:text-white transition-colors">Dashboard</Link>
              <Link href="#features" className="hover:text-white transition-colors">Features</Link>
              <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
            </div>
            <p className="text-xs text-gray-600 text-center">
              ⚠️ Trading involves risk. Past performance is not indicative of future results.<br />
              <span className="text-gray-700">© 2025 TradingPro · All rights reserved</span>
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}
