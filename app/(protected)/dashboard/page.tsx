'use client'

import { useEffect, useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { DollarSign, TrendingUp, Zap, Target } from 'lucide-react'
import { StatsCard } from '@/components/dashboard/stats-card'
import { WatchlistWidget } from '@/components/dashboard/watchlist-widget'
import { LiveSignalsFeed } from '@/components/dashboard/live-signals-feed'
import { MarketOverview } from '@/components/dashboard/market-overview'
import { MiniChart } from '@/components/charts/mini-chart'
import { useSignalsStore } from '@/store/use-signals-store'
import { SUPPORTED_SYMBOLS } from '@/lib/twelve-data'
import { formatPrice } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { useSearchParams } from 'next/navigation'

interface SymbolData {
  symbol: string
  closes: number[]
  currentPrice: number
}

function DashboardContent() {
  const { data: session } = useSession()
  const { signals, fetchSignals } = useSignalsStore()
  const [symbolData, setSymbolData] = useState<SymbolData[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const searchParams = useSearchParams()

  useEffect(() => {
    const upgraded = searchParams.get('upgraded')
    if (upgraded) {
      toast.success(`Welcome to ${upgraded.toUpperCase()}! Your plan has been activated.`, { duration: 5000 })
    }
  }, [searchParams])

  useEffect(() => {
    fetchSignals()
  }, [fetchSignals])

  useEffect(() => {
    const fetchAll = async () => {
      setLoadingData(true)
      const results = await Promise.all(
        SUPPORTED_SYMBOLS.map(async (sym) => {
          try {
            const res = await fetch(`/api/market-data?symbol=${encodeURIComponent(sym.symbol)}&interval=1day&outputsize=30`)
            const { data } = await res.json()
            const closes = (data as any[]).map((d: any) => d.close)
            return { symbol: sym.symbol, closes, currentPrice: closes[closes.length - 1] ?? 0 }
          } catch {
            return { symbol: sym.symbol, closes: [], currentPrice: 0 }
          }
        })
      )
      setSymbolData(results)
      setLoadingData(false)
    }
    fetchAll()
  }, [])

  const prices = Object.fromEntries(symbolData.map((s) => [s.symbol, s.currentPrice]))

  const signalMap = new Map(signals.map((s) => [s.symbol, s]))
  const avgConfidence = signals.length > 0
    ? Math.round(signals.reduce((sum, s) => sum + s.confidence, 0) / signals.length)
    : 0

  const buySignals = signals.filter((s) => s.signalType === 'BUY' || s.signalType === 'STRONG_BUY').length

  return (
    <div className="space-y-6 max-w-screen-2xl" suppressHydrationWarning>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Welcome back{session?.user?.name ? `, ${session.user.name.split(' ')[0]}` : ''}! 👋
        </h1>
        <p className="text-gray-400 text-sm mt-1">Here's your market overview for today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Markets Tracked"
          value={`${SUPPORTED_SYMBOLS.length}`}
          change="Live"
          changeType="positive"
          icon={DollarSign}
          iconColor="#00d395"
          subtitle="Forex, Crypto, Commodity"
        />
        <StatsCard
          title="Active Signals"
          value={`${signals.length}`}
          change={`${buySignals} buy`}
          changeType="positive"
          icon={Zap}
          iconColor="#f59e0b"
          subtitle="Last 60s refresh"
        />
        <StatsCard
          title="Avg Confidence"
          value={`${avgConfidence}%`}
          change={avgConfidence >= 70 ? 'High' : avgConfidence >= 50 ? 'Moderate' : 'Low'}
          changeType={avgConfidence >= 70 ? 'positive' : 'neutral'}
          icon={Target}
          iconColor="#3b82f6"
          subtitle="Across all signals"
        />
        <StatsCard
          title="Your Plan"
          value={session?.user?.plan ?? 'FREE'}
          change={session?.user?.plan === 'FREE' ? 'Upgrade available' : 'Active'}
          changeType={session?.user?.plan !== 'FREE' ? 'positive' : 'neutral'}
          icon={TrendingUp}
          iconColor="#8b5cf6"
          subtitle={session?.user?.plan === 'FREE' ? 'Limited features' : 'Full access'}
        />
      </div>

      {/* Mini Charts */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 mb-3">Market Sparklines</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
          {SUPPORTED_SYMBOLS.map((sym) => {
            const data = symbolData.find((d) => d.symbol === sym.symbol)
            const signal = signalMap.get(sym.symbol)
            const isPositive = (signal?.signalType === 'BUY' || signal?.signalType === 'STRONG_BUY')
            const encodedSymbol = sym.symbol.replace('/', '')

            return (
              <Link key={sym.symbol} href={`/charts/${encodedSymbol}`} className="block">
                <div className="bg-[#1a1f2e] border border-[#1f2937] rounded-xl p-3 hover:border-[#374151] transition-colors">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-base">{sym.flag}</span>
                    <span className="text-xs font-medium text-white truncate">{sym.symbol.split('/')[0]}</span>
                  </div>
                  <p className="text-xs font-mono font-bold text-white mb-2">
                    {data?.currentPrice ? formatPrice(data.currentPrice, sym.symbol) : '—'}
                  </p>
                  {loadingData ? (
                    <Skeleton className="h-12 w-full" />
                  ) : (
                    <MiniChart data={data?.closes ?? []} positive={isPositive} height={48} />
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Signals + Market Overview */}
        <div className="lg:col-span-2 space-y-6">
          <MarketOverview signals={signals} prices={prices} />
        </div>

        {/* Sidebar widgets */}
        <div className="space-y-4">
          <LiveSignalsFeed />
          <WatchlistWidget />
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f1117]" />}>
      <DashboardContent />
    </Suspense>
  )
}
