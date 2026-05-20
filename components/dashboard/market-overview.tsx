'use client'

import Link from 'next/link'
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import { SignalBadge } from '@/components/signals/signal-badge'
import { formatPrice, formatPercent } from '@/lib/utils'
import { SUPPORTED_SYMBOLS } from '@/lib/twelve-data'
import type { Signal } from '@/types'

interface MarketOverviewProps {
  signals: Signal[]
  prices: Record<string, number>
}

export function MarketOverview({ signals, prices }: MarketOverviewProps) {
  const signalMap = new Map(signals.map((s) => [s.symbol, s]))

  return (
    <div className="bg-[#1a1f2e] border border-[#1f2937] rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-[#1f2937]">
        <h3 className="text-sm font-semibold text-white">Market Overview</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-gray-500 border-b border-[#1f2937]">
              <th className="text-left px-4 py-2.5 font-medium">Symbol</th>
              <th className="text-right px-4 py-2.5 font-medium">Price</th>
              <th className="text-right px-4 py-2.5 font-medium hidden sm:table-cell">RSI</th>
              <th className="text-right px-4 py-2.5 font-medium hidden md:table-cell">Confidence</th>
              <th className="text-right px-4 py-2.5 font-medium">Signal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1f2937]">
            {SUPPORTED_SYMBOLS.map((sym) => {
              const signal = signalMap.get(sym.symbol)
              const price = prices[sym.symbol] ?? signal?.price ?? 0
              const encodedSymbol = sym.symbol.replace('/', '')

              return (
                <tr key={sym.symbol} className="hover:bg-[#1f2537] transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/charts/${encodedSymbol}`} className="flex items-center gap-2 group">
                      <span className="text-lg">{sym.flag}</span>
                      <div>
                        <p className="text-sm font-medium text-white group-hover:text-[#3b82f6] transition-colors">
                          {sym.symbol}
                        </p>
                        <p className="text-[10px] text-gray-500">{sym.type}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <p className="text-sm font-mono font-medium text-white">
                      {price ? formatPrice(price, sym.symbol) : '—'}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-right hidden sm:table-cell">
                    {signal ? (
                      <span
                        className="text-xs font-medium"
                        style={{
                          color: signal.rsi < 30 ? '#00d395' : signal.rsi > 70 ? '#ff4444' : '#9ca3af',
                        }}
                      >
                        {signal.rsi.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-600">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right hidden md:table-cell">
                    {signal ? (
                      <span className="text-xs text-gray-300">{signal.confidence}%</span>
                    ) : (
                      <span className="text-xs text-gray-600">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {signal ? (
                      <SignalBadge signalType={signal.signalType} size="sm" />
                    ) : (
                      <span className="text-xs text-gray-600">Loading...</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
