'use client'

import { useEffect, useState } from 'react'
import { RefreshCw, Filter, Clock } from 'lucide-react'
import { SignalCard } from '@/components/signals/signal-card'
import { SignalCardSkeleton } from '@/components/common/loading-skeleton'
import { useSignalsStore } from '@/store/use-signals-store'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SUPPORTED_SYMBOLS } from '@/lib/twelve-data'
import { timeAgo } from '@/lib/utils'
import type { SignalType } from '@/types'

const SIGNAL_TYPES: Array<{ value: SignalType | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'All Signals' },
  { value: 'STRONG_BUY', label: 'Strong Buy' },
  { value: 'BUY', label: 'Buy' },
  { value: 'NEUTRAL', label: 'Neutral' },
  { value: 'SELL', label: 'Sell' },
  { value: 'STRONG_SELL', label: 'Strong Sell' },
]

export default function SignalsPage() {
  const { signals, isLoading, lastRefresh, fetchSignals, setFilter, filter, getFiltered } = useSignalsStore()
  const [minConfidence, setMinConfidence] = useState(0)

  useEffect(() => {
    fetchSignals()
    const cleanup = useSignalsStore.getState().startAutoRefresh(60000)
    return cleanup
  }, [fetchSignals])

  useEffect(() => {
    setFilter({ minConfidence })
  }, [minConfidence, setFilter])

  const filtered = getFiltered()

  return (
    <div className="space-y-6 max-w-screen-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Live Trading Signals</h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-[#00d395] animate-pulse" />
            <p className="text-sm text-gray-400">
              Real-time signals • Auto-refreshes every 60s
              {lastRefresh && ` • Updated ${timeAgo(lastRefresh)}`}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchSignals()}
          disabled={isLoading}
          className="gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-[#1a1f2e] border border-[#1f2937] rounded-xl p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />

          {/* Symbol filter */}
          <Select
            value={filter.symbol}
            onValueChange={(v) => setFilter({ symbol: v })}
          >
            <SelectTrigger className="w-36 h-8 text-xs">
              <SelectValue placeholder="All symbols" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Symbols</SelectItem>
              {SUPPORTED_SYMBOLS.map((s) => (
                <SelectItem key={s.symbol} value={s.symbol}>
                  {s.flag} {s.symbol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Signal type filter */}
          <Select
            value={filter.signalType}
            onValueChange={(v) => setFilter({ signalType: v as SignalType | 'ALL' })}
          >
            <SelectTrigger className="w-36 h-8 text-xs">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              {SIGNAL_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Confidence filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Min confidence:</span>
            <select
              value={minConfidence}
              onChange={(e) => setMinConfidence(Number(e.target.value))}
              className="bg-[#0f1117] border border-[#1f2937] rounded-lg text-xs text-white px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
            >
              <option value={0}>Any</option>
              <option value={50}>50%+</option>
              <option value={65}>65%+</option>
              <option value={75}>75%+</option>
              <option value={85}>85%+</option>
            </select>
          </div>

          <div className="ml-auto text-xs text-gray-500">
            {filtered.length} signal{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Signal grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading && signals.length === 0 ? (
          [...Array(6)].map((_, i) => <SignalCardSkeleton key={i} />)
        ) : filtered.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <p className="text-gray-400 mb-2">No signals match your filters</p>
            <Button variant="ghost" size="sm" onClick={() => {
              setFilter({ symbol: 'ALL', signalType: 'ALL', minConfidence: 0 })
              setMinConfidence(0)
            }}>
              Clear filters
            </Button>
          </div>
        ) : (
          filtered.map((signal) => <SignalCard key={signal.id} signal={signal} />)
        )}
      </div>
    </div>
  )
}
