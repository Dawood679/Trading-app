'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Zap, RefreshCw } from 'lucide-react'
import { useSignalsStore } from '@/store/use-signals-store'
import { SignalBadge } from '@/components/signals/signal-badge'
import { Skeleton } from '@/components/ui/skeleton'
import { timeAgo } from '@/lib/utils'

export function LiveSignalsFeed() {
  const { signals, isLoading, fetchSignals, lastRefresh } = useSignalsStore()

  useEffect(() => {
    fetchSignals()
    const cleanup = useSignalsStore.getState().startAutoRefresh(60000)
    return cleanup
  }, [fetchSignals])

  return (
    <div className="bg-[#1a1f2e] border border-[#1f2937] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1f2937]">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#f59e0b]" />
          <h3 className="text-sm font-semibold text-white">Live Signals</h3>
          {lastRefresh && (
            <span className="text-xs text-gray-500">• {timeAgo(lastRefresh)}</span>
          )}
        </div>
        <button
          onClick={() => fetchSignals()}
          disabled={isLoading}
          className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#1f2537] transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="divide-y divide-[#1f2937] max-h-80 overflow-y-auto">
        {isLoading && signals.length === 0 ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-16 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))
        ) : (
          signals.slice(0, 10).map((signal) => (
            <Link
              key={signal.id}
              href={`/charts/${signal.symbol.replace('/', '')}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-[#1f2537] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#0f1117] flex items-center justify-center text-sm">
                  {signal.symbol.split('/')[0].slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{signal.symbol}</p>
                  <p className="text-xs text-gray-500">{signal.confidence}% confidence</p>
                </div>
              </div>
              <SignalBadge signalType={signal.signalType} size="sm" />
            </Link>
          ))
        )}
      </div>

      <div className="px-4 py-2 border-t border-[#1f2937]">
        <Link href="/signals" className="text-xs text-[#3b82f6] hover:underline">
          View all signals →
        </Link>
      </div>
    </div>
  )
}
