'use client'

import { useSession } from 'next-auth/react'
import { TrendingUp, Activity, BarChart3, GitBranch, CircleDot, Triangle, Lock } from 'lucide-react'
import { PlanLockOverlay } from '@/components/common/plan-lock-overlay'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const strategies = [
  {
    id: 'rsi',
    name: 'RSI Strategy',
    shortName: 'RSI',
    icon: Activity,
    description: 'Relative Strength Index measures momentum to identify overbought and oversold conditions. Enter long when RSI crosses below 30, exit when it reaches 70.',
    winRate: 62,
    activePairs: 6,
    plan: 'FREE' as const,
    color: '#00d395',
    parameters: [
      { name: 'Period', value: '14' },
      { name: 'Overbought', value: '70' },
      { name: 'Oversold', value: '30' },
    ],
    performance: '+12.4% avg monthly',
    tags: ['Momentum', 'Oscillator', 'Mean Reversion'],
  },
  {
    id: 'macd',
    name: 'MACD Crossover',
    shortName: 'MACD',
    icon: TrendingUp,
    description: 'Moving Average Convergence Divergence signals trend changes through EMA crossovers. Trade the cross of the MACD line above/below the signal line.',
    winRate: 58,
    activePairs: 6,
    plan: 'FREE' as const,
    color: '#3b82f6',
    parameters: [
      { name: 'Fast EMA', value: '12' },
      { name: 'Slow EMA', value: '26' },
      { name: 'Signal', value: '9' },
    ],
    performance: '+9.8% avg monthly',
    tags: ['Trend Following', 'Momentum', 'Crossover'],
  },
  {
    id: 'bollinger',
    name: 'Bollinger Bands',
    shortName: 'BB',
    icon: BarChart3,
    description: 'Trade mean reversion using Bollinger Bands. Buy when price touches the lower band and sell when it reaches the upper band in ranging markets.',
    winRate: 65,
    activePairs: 6,
    plan: 'PRO' as const,
    color: '#f59e0b',
    parameters: [
      { name: 'Period', value: '20' },
      { name: 'Std Dev', value: '2.0' },
      { name: 'Signal', value: 'Touch' },
    ],
    performance: '+14.2% avg monthly',
    tags: ['Volatility', 'Mean Reversion', 'Range Trading'],
  },
  {
    id: 'ema',
    name: 'EMA Crossover',
    shortName: 'EMA',
    icon: GitBranch,
    description: 'Dual EMA crossover system using 20 and 50-period EMAs. Enter long when the fast EMA crosses above the slow EMA, confirming trend direction.',
    winRate: 55,
    activePairs: 6,
    plan: 'PRO' as const,
    color: '#8b5cf6',
    parameters: [
      { name: 'Fast EMA', value: '20' },
      { name: 'Slow EMA', value: '50' },
      { name: 'Timeframe', value: '4H+' },
    ],
    performance: '+11.6% avg monthly',
    tags: ['Trend Following', 'Crossover', 'EMA'],
  },
  {
    id: 'stochastic',
    name: 'Stochastic Oscillator',
    shortName: 'Stoch',
    icon: CircleDot,
    description: 'Stochastic combines %K and %D lines to identify momentum reversals. Enter on %K crossover of %D in overbought/oversold zones for high probability setups.',
    winRate: 61,
    activePairs: 6,
    plan: 'PREMIUM' as const,
    color: '#f97316',
    parameters: [
      { name: '%K Period', value: '14' },
      { name: '%D Period', value: '3' },
      { name: 'Smooth', value: '3' },
    ],
    performance: '+16.8% avg monthly',
    tags: ['Momentum', 'Oscillator', 'Reversal'],
  },
  {
    id: 'fibonacci',
    name: 'Fibonacci Retracement',
    shortName: 'Fib',
    icon: Triangle,
    description: 'Use Fibonacci retracement levels (23.6%, 38.2%, 61.8%) to identify potential support/resistance zones. Enter on bounce from key Fibonacci levels with confirmation.',
    winRate: 67,
    activePairs: 6,
    plan: 'PREMIUM' as const,
    color: '#ec4899',
    parameters: [
      { name: 'Levels', value: '23.6/38.2/61.8%' },
      { name: 'Lookback', value: '50 bars' },
      { name: 'Confirmation', value: 'Required' },
    ],
    performance: '+19.3% avg monthly',
    tags: ['Support/Resistance', 'Reversal', 'Technical'],
  },
]

export default function StrategiesPage() {
  const { data: session } = useSession()
  const userPlan = session?.user?.plan ?? 'FREE'

  const canAccess = (plan: 'FREE' | 'PRO' | 'PREMIUM') => {
    if (plan === 'FREE') return true
    if (plan === 'PRO') return userPlan === 'PRO' || userPlan === 'PREMIUM'
    return userPlan === 'PREMIUM'
  }

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div>
        <h1 className="text-2xl font-bold">Trading Strategies</h1>
        <p className="text-gray-400 text-sm mt-1">
          Professional strategies powering our signal engine. Upgrade to unlock all strategies.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {strategies.map((strategy) => {
          const Icon = strategy.icon
          const accessible = canAccess(strategy.plan)

          return (
            <div
              key={strategy.id}
              className={cn(
                'relative bg-[#1a1f2e] border border-[#1f2937] rounded-xl p-5 overflow-hidden',
                !accessible && 'opacity-75'
              )}
            >
              {!accessible && (
                <PlanLockOverlay requiredPlan={strategy.plan === 'PRO' ? 'PRO' : 'PREMIUM'} />
              )}

              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${strategy.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: strategy.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{strategy.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Badge
                        variant={strategy.plan === 'FREE' ? 'outline' : strategy.plan === 'PRO' ? 'pro' : 'premium'}
                        className="text-[10px] px-1.5 py-0"
                      >
                        {strategy.plan}
                      </Badge>
                      <span className="text-[10px] text-gray-500">{strategy.activePairs} pairs</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">{strategy.winRate}%</p>
                  <p className="text-[10px] text-gray-500">Win Rate</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-3">{strategy.description}</p>

              {/* Performance */}
              <div className="flex items-center gap-2 mb-4 p-2.5 bg-[#0f1117] rounded-lg">
                <TrendingUp className="w-4 h-4 text-[#00d395]" />
                <span className="text-xs text-[#00d395] font-medium">{strategy.performance}</span>
              </div>

              {/* Parameters */}
              <div className="mb-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Parameters</p>
                <div className="grid grid-cols-3 gap-2">
                  {strategy.parameters.map((param) => (
                    <div key={param.name} className="bg-[#0f1117] rounded-lg p-2 text-center">
                      <p className="text-xs font-bold text-white">{param.value}</p>
                      <p className="text-[10px] text-gray-500">{param.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {strategy.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 bg-[#0f1117] rounded-full text-gray-500 border border-[#1f2937]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
