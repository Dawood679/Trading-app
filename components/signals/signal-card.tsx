import Link from 'next/link'
import { TrendingUp, Clock } from 'lucide-react'
import { SignalBadge } from './signal-badge'
import { Progress } from '@/components/ui/progress'
import { cn, formatPrice, timeAgo, getSignalColor } from '@/lib/utils'
import { SUPPORTED_SYMBOLS } from '@/lib/twelve-data'
import type { Signal } from '@/types'

interface SignalCardProps {
  signal: Signal
}

function getConfidenceColor(confidence: number): string {
  if (confidence >= 80) return '#00d395'
  if (confidence >= 60) return '#3b82f6'
  if (confidence >= 40) return '#f59e0b'
  return '#ff4444'
}

export function SignalCard({ signal }: SignalCardProps) {
  const symbolInfo = SUPPORTED_SYMBOLS.find((s) => s.symbol === signal.symbol)
  const priceStr = formatPrice(signal.price, signal.symbol)
  const confidenceColor = getConfidenceColor(signal.confidence)
  const encodedSymbol = signal.symbol.replace('/', '')

  return (
    <Link href={`/charts/${encodedSymbol}`} className="block group">
      <div className="bg-[#1a1f2e] border border-[#1f2937] rounded-xl p-5 hover:border-[#374151] hover:bg-[#1f2537] transition-all duration-200 h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{symbolInfo?.flag ?? '📈'}</span>
            <div>
              <p className="font-bold text-white">{signal.symbol}</p>
              <p className="text-xs text-gray-500">{symbolInfo?.name}</p>
            </div>
          </div>
          <SignalBadge signalType={signal.signalType} size="md" />
        </div>

        {/* Price */}
        <div className="mb-4">
          <p className="text-xl font-mono font-bold text-white">{priceStr}</p>
        </div>

        {/* Confidence */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs text-gray-400">Confidence</span>
            <span className="text-xs font-bold" style={{ color: confidenceColor }}>
              {signal.confidence}%
            </span>
          </div>
          <Progress value={signal.confidence} indicatorColor={confidenceColor} />
        </div>

        {/* Strategy badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {signal.strategy.split(' + ').map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 bg-[#0f1117] rounded-full text-gray-400 border border-[#1f2937]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Reason */}
        <p className="text-xs text-gray-400 leading-relaxed mb-3 line-clamp-2">{signal.reason}</p>

        {/* Hints */}
        {signal.hints?.length > 0 && (
          <ul className="space-y-1 mb-3">
            {signal.hints.slice(0, 2).map((hint, i) => (
              <li key={i} className="flex items-center gap-1.5 text-xs text-gray-500">
                <TrendingUp className="w-3 h-3 text-[#3b82f6] flex-shrink-0" />
                {hint}
              </li>
            ))}
          </ul>
        )}

        {/* Indicators */}
        <div className="flex gap-4 pt-3 border-t border-[#1f2937]">
          <div>
            <p className="text-[10px] text-gray-500">RSI</p>
            <p className={cn('text-xs font-bold', getSignalColor(signal.rsi < 30 ? 'BUY' : signal.rsi > 70 ? 'SELL' : 'NEUTRAL'))}>
              {signal.rsi.toFixed(1)}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500">MACD</p>
            <p className={cn('text-xs font-bold', signal.macd >= 0 ? 'text-[#00d395]' : 'text-[#ff4444]')}>
              {signal.macd >= 0 ? '+' : ''}{signal.macd.toFixed(5)}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1 text-[10px] text-gray-500">
            <Clock className="w-3 h-3" />
            {timeAgo(signal.createdAt)}
          </div>
        </div>
      </div>
    </Link>
  )
}
