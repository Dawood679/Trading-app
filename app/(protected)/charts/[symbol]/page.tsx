'use client'

import { useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { RefreshCw, Clock, Plus, Minus } from 'lucide-react'
import { ChartErrorBoundary } from '@/components/charts/chart-error-boundary'
import { RSIPanel } from '@/components/charts/rsi-panel'
import { MACDPanel } from '@/components/charts/macd-panel'
import { SignalBadge } from '@/components/signals/signal-badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { ChartSkeleton } from '@/components/common/loading-skeleton'
import { useWatchlistStore } from '@/store/use-watchlist-store'
import { SUPPORTED_SYMBOLS } from '@/lib/twelve-data'
import { generateSignal } from '@/lib/signals-engine'
import { formatPrice, timeAgo, getSignalBgColor } from '@/lib/utils'
import type { OHLCV } from '@/types'
import toast from 'react-hot-toast'

const TradingChart = dynamic(
  () => import('@/components/charts/trading-chart').then((m) => m.TradingChart),
  { ssr: false, loading: () => <ChartSkeleton height={500} /> }
)

const TIMEFRAMES = [
  { label: '1m', value: '1m' },
  { label: '5m', value: '5m' },
  { label: '15m', value: '15m' },
  { label: '1H', value: '1h' },
  { label: '4H', value: '4h' },
  { label: '1D', value: '1D' },
]

function decodeSymbol(encoded: string): string {
  // EURUSD -> EUR/USD, BTCUSD -> BTC/USD
  if (encoded.length === 6) {
    return `${encoded.slice(0, 3)}/${encoded.slice(3)}`
  }
  if (encoded.length === 7) {
    // XAUUSD -> XAU/USD
    return `${encoded.slice(0, 3)}/${encoded.slice(3)}`
  }
  return encoded
}

export default function ChartPage({ params }: { params: { symbol: string } }) {
  const symbol = decodeSymbol(params.symbol)
  const symbolInfo = SUPPORTED_SYMBOLS.find((s) => s.symbol === symbol)

  const [data, setData] = useState<OHLCV[]>([])
  const [timeframe, setTimeframe] = useState('1D')
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [signal, setSignal] = useState<ReturnType<typeof generateSignal> | null>(null)

  const { items, fetchWatchlist, addSymbol, removeSymbol, hasSymbol } = useWatchlistStore()
  const inWatchlist = hasSymbol(symbol)

  useEffect(() => {
    fetchWatchlist()
  }, [fetchWatchlist])

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/market-data?symbol=${encodeURIComponent(symbol)}&interval=${timeframe}&outputsize=200`)
      const { data: candles } = await res.json()
      setData(candles)
      setLastUpdate(new Date())

      const closes = (candles as OHLCV[]).map((c) => c.close)
      setSignal(generateSignal(symbol, closes))
    } catch {
      toast.error('Failed to load chart data')
    } finally {
      setIsLoading(false)
    }
  }, [symbol, timeframe])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [fetchData])

  const currentPrice = data.length > 0 ? data[data.length - 1].close : 0
  const prevPrice = data.length > 1 ? data[data.length - 2].close : currentPrice
  const priceChange = currentPrice - prevPrice
  const priceChangePct = prevPrice > 0 ? (priceChange / prevPrice) * 100 : 0

  const handleWatchlist = async () => {
    if (inWatchlist) {
      await removeSymbol(symbol)
    } else {
      await addSymbol(symbol, symbolInfo?.name ?? symbol)
    }
  }

  return (
    <div className="space-y-4 max-w-screen-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-4 justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{symbolInfo?.flag ?? '📈'}</span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{symbol}</h1>
              <span className="text-sm text-gray-400 capitalize">{symbolInfo?.type}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-mono font-bold">
                {currentPrice ? formatPrice(currentPrice, symbol) : '—'}
              </span>
              <span className={`text-sm font-medium ${priceChange >= 0 ? 'text-[#00d395]' : 'text-[#ff4444]'}`}>
                {priceChange >= 0 ? '+' : ''}{formatPrice(Math.abs(priceChange), symbol)} ({priceChangePct >= 0 ? '+' : ''}{priceChangePct.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={inWatchlist ? 'secondary' : 'outline'}
            onClick={handleWatchlist}
            className="gap-1.5"
          >
            {inWatchlist ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            {inWatchlist ? 'Unwatch' : 'Watch'}
          </Button>
          <Button size="sm" variant="ghost" onClick={fetchData} disabled={isLoading} className="gap-1.5">
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      <div className="grid xl:grid-cols-4 gap-4">
        {/* Chart area */}
        <div className="xl:col-span-3 space-y-3">
          {/* Timeframe buttons */}
          <div className="flex items-center gap-2">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setTimeframe(tf.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  timeframe === tf.value
                    ? 'bg-[#3b82f6] text-white'
                    : 'text-gray-400 hover:text-white hover:bg-[#1f2537]'
                }`}
              >
                {tf.label}
              </button>
            ))}
            {lastUpdate && (
              <span className="ml-auto text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {timeAgo(lastUpdate)}
              </span>
            )}
          </div>

          {/* Main chart */}
          <ChartErrorBoundary>
            {isLoading && data.length === 0 ? (
              <ChartSkeleton height={500} />
            ) : (
              <TradingChart data={data} symbol={symbol} height={500} />
            )}
          </ChartErrorBoundary>

          {/* Indicator panels */}
          {data.length >= 20 && (
            <div className="space-y-3">
              <RSIPanel data={data} height={120} />
              {data.length >= 35 && <MACDPanel data={data} height={120} />}
            </div>
          )}
        </div>

        {/* Signal sidebar */}
        <div className="space-y-4">
          {signal && (
            <>
              {/* Signal box */}
              <div className="bg-[#1a1f2e] border border-[#1f2937] rounded-xl p-5">
                <h3 className="text-sm font-semibold text-gray-400 mb-4">Current Signal</h3>
                <div className="text-center mb-5">
                  <SignalBadge signalType={signal.signalType} size="lg" className="mx-auto" />
                </div>

                {/* Confidence */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-gray-400">Confidence</span>
                    <span className="font-bold text-white">{signal.confidence}%</span>
                  </div>
                  <Progress
                    value={signal.confidence}
                    indicatorColor={
                      signal.confidence >= 80 ? '#00d395' :
                      signal.confidence >= 60 ? '#3b82f6' :
                      signal.confidence >= 40 ? '#f59e0b' : '#ff4444'
                    }
                  />
                </div>

                {/* Strategy */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Active Strategies</p>
                  <div className="flex flex-wrap gap-1.5">
                    {signal.strategy.split(' + ').map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 bg-[#0f1117] rounded-full text-gray-400 border border-[#1f2937]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Reason */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1.5">Analysis</p>
                  <p className="text-xs text-gray-300 leading-relaxed">{signal.reason}</p>
                </div>

                {/* Hints */}
                {signal.hints.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Key Observations</p>
                    <ul className="space-y-1.5">
                      {signal.hints.map((hint, i) => (
                        <li key={i} className="text-xs text-gray-400 flex items-start gap-1.5">
                          <span className="text-[#3b82f6] mt-0.5">•</span>
                          {hint}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Indicators */}
              <div className="bg-[#1a1f2e] border border-[#1f2937] rounded-xl p-5">
                <h3 className="text-sm font-semibold text-gray-400 mb-4">Indicators</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">RSI (14)</span>
                    <span
                      className="text-sm font-bold"
                      style={{
                        color: signal.rsi < 30 ? '#00d395' : signal.rsi > 70 ? '#ff4444' : '#9ca3af',
                      }}
                    >
                      {signal.rsi.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">MACD</span>
                    <span className={`text-sm font-bold ${signal.macd >= 0 ? 'text-[#00d395]' : 'text-[#ff4444]'}`}>
                      {signal.macd >= 0 ? '+' : ''}{signal.macd.toFixed(6)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Price</span>
                    <span className="text-sm font-mono font-bold text-white">
                      {formatPrice(currentPrice, symbol)}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Auto-refresh notice */}
          <div className="bg-[#0f1117] border border-[#1f2937] rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500">
              🔄 Auto-refreshes every <strong className="text-gray-300">30 seconds</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
