'use client'

import { useState } from 'react'
import { FlaskConical, Play, TrendingUp, TrendingDown, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { EquityCurve } from '@/components/charts/equity-curve'
import { SUPPORTED_SYMBOLS } from '@/lib/twelve-data'
import { runBacktest } from '@/lib/signals-engine'
import { formatCurrency, formatPercent, cn } from '@/lib/utils'
import type { OHLCV } from '@/types'
import toast from 'react-hot-toast'

const STRATEGIES = [
  { value: 'combined', label: 'RSI + MACD (Default)' },
  { value: 'RSI', label: 'RSI Only' },
  { value: 'MACD', label: 'MACD Only' },
  { value: 'BB', label: 'Bollinger Bands' },
]

interface BacktestStats {
  totalReturn: number
  totalReturnPct: number
  winRate: number
  totalTrades: number
  winningTrades: number
  losingTrades: number
  maxDrawdown: number
  sharpeRatio: number
  finalEquity: number
}

export default function BacktestingPage() {
  const [symbol, setSymbol] = useState('EUR/USD')
  const [strategy, setStrategy] = useState('combined')
  const [capital, setCapital] = useState('10000')
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<{
    stats: BacktestStats
    equityCurve: { date: string; equity: number }[]
    trades: any[]
  } | null>(null)

  const handleRun = async () => {
    setIsRunning(true)
    try {
      // Fetch historical data
      const res = await fetch(`/api/market-data?symbol=${encodeURIComponent(symbol)}&interval=1day&outputsize=200`)
      const { data: candles } = await res.json()

      if (!candles || candles.length < 50) {
        toast.error('Insufficient data for backtesting')
        return
      }

      const closes = candles.map((c: OHLCV) => c.close)
      const dates = candles.map((c: OHLCV) => String(c.time))
      const initialCapital = parseFloat(capital) || 10000

      const result = runBacktest(closes, dates, initialCapital, strategy)
      setResults({
        stats: result.stats,
        equityCurve: result.equityCurve,
        trades: result.trades,
      })

      toast.success(`Backtest complete! ${result.stats.totalTrades} trades analyzed.`)
    } catch {
      toast.error('Backtest failed — please try again')
    } finally {
      setIsRunning(false)
    }
  }

  const stats = results?.stats

  return (
    <div className="space-y-6 max-w-screen-xl">
      <div>
        <h1 className="text-2xl font-bold">Strategy Backtesting</h1>
        <p className="text-gray-400 text-sm mt-1">
          Test your strategies against historical price data to evaluate performance.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Configuration panel */}
        <div className="lg:col-span-1">
          <div className="bg-[#1a1f2e] border border-[#1f2937] rounded-xl p-5 space-y-4 sticky top-6">
            <h3 className="font-semibold flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-[#f97316]" />
              Configuration
            </h3>

            <div className="space-y-2">
              <Label className="text-xs">Symbol</Label>
              <Select value={symbol} onValueChange={setSymbol}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_SYMBOLS.map((s) => (
                    <SelectItem key={s.symbol} value={s.symbol}>
                      {s.flag} {s.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Strategy</Label>
              <Select value={strategy} onValueChange={setStrategy}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STRATEGIES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Initial Capital (USD)</Label>
              <Input
                type="number"
                value={capital}
                onChange={(e) => setCapital(e.target.value)}
                placeholder="10000"
                min="100"
              />
            </div>

            <div className="pt-2">
              <p className="text-xs text-gray-500 mb-3">Data: Last 200 daily candles</p>
              <Button
                className="w-full gap-2"
                onClick={handleRun}
                disabled={isRunning}
              >
                <Play className={`w-4 h-4 ${isRunning ? 'animate-pulse' : ''}`} />
                {isRunning ? 'Running...' : 'Run Backtest'}
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-5">
          {!results && !isRunning && (
            <div className="flex items-center justify-center h-64 bg-[#1a1f2e] border border-[#1f2937] rounded-xl">
              <div className="text-center">
                <FlaskConical className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">Configure and run a backtest to see results</p>
              </div>
            </div>
          )}

          {stats && (
            <>
              {/* Key metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {
                    label: 'Total Return',
                    value: formatPercent(stats.totalReturnPct),
                    sub: formatCurrency(stats.totalReturn),
                    color: stats.totalReturn >= 0 ? '#00d395' : '#ff4444',
                    icon: stats.totalReturn >= 0 ? TrendingUp : TrendingDown,
                  },
                  {
                    label: 'Win Rate',
                    value: `${stats.winRate.toFixed(1)}%`,
                    sub: `${stats.winningTrades}/${stats.totalTrades} trades`,
                    color: stats.winRate >= 50 ? '#00d395' : '#ff4444',
                    icon: Activity,
                  },
                  {
                    label: 'Max Drawdown',
                    value: `${stats.maxDrawdown.toFixed(1)}%`,
                    sub: 'Peak to trough',
                    color: stats.maxDrawdown < 20 ? '#3b82f6' : stats.maxDrawdown < 40 ? '#f59e0b' : '#ff4444',
                    icon: TrendingDown,
                  },
                  {
                    label: 'Sharpe Ratio',
                    value: stats.sharpeRatio.toFixed(2),
                    sub: stats.sharpeRatio > 1 ? 'Good' : stats.sharpeRatio > 0 ? 'Moderate' : 'Poor',
                    color: stats.sharpeRatio > 2 ? '#00d395' : stats.sharpeRatio > 1 ? '#3b82f6' : '#f59e0b',
                    icon: Activity,
                  },
                ].map((stat) => (
                  <div key={stat.label} className="bg-[#1a1f2e] border border-[#1f2937] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-gray-400">{stat.label}</p>
                      <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                    </div>
                    <p className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{stat.sub}</p>
                  </div>
                ))}
              </div>

              {/* Summary stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Initial Capital', value: formatCurrency(parseFloat(capital) || 10000) },
                  { label: 'Final Equity', value: formatCurrency(stats.finalEquity) },
                  { label: 'Total Trades', value: `${stats.totalTrades}` },
                ].map((item) => (
                  <div key={item.label} className="bg-[#1a1f2e] border border-[#1f2937] rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                    <p className="text-lg font-bold text-white">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Equity curve */}
              <EquityCurve
                data={results.equityCurve}
                initialCapital={parseFloat(capital) || 10000}
                height={280}
              />

              {/* Trade history */}
              {results.trades.length > 0 && (
                <div className="bg-[#1a1f2e] border border-[#1f2937] rounded-xl overflow-hidden">
                  <div className="px-5 py-3 border-b border-[#1f2937]">
                    <h3 className="text-sm font-semibold text-white">Trade History</h3>
                  </div>
                  <div className="overflow-x-auto max-h-64 overflow-y-auto">
                    <table className="w-full text-xs">
                      <thead className="sticky top-0 bg-[#1a1f2e]">
                        <tr className="text-gray-500 border-b border-[#1f2937]">
                          <th className="text-left px-4 py-2">Date</th>
                          <th className="text-center px-4 py-2">Action</th>
                          <th className="text-right px-4 py-2">Price</th>
                          <th className="text-right px-4 py-2">P&L</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1f2937]">
                        {results.trades.map((trade, i) => (
                          <tr key={i} className="hover:bg-[#1f2537]">
                            <td className="px-4 py-2 text-gray-400">{trade.date}</td>
                            <td className="px-4 py-2 text-center">
                              <span className={cn(
                                'px-2 py-0.5 rounded-full font-semibold',
                                trade.action === 'BUY'
                                  ? 'bg-[#00d395]/20 text-[#00d395]'
                                  : 'bg-[#ff4444]/20 text-[#ff4444]'
                              )}>
                                {trade.action}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-right font-mono text-gray-300">
                              {trade.price.toFixed(5)}
                            </td>
                            <td className={cn('px-4 py-2 text-right font-medium', trade.pnl >= 0 ? 'text-[#00d395]' : 'text-[#ff4444]')}>
                              {trade.action === 'SELL' ? (trade.pnl >= 0 ? '+' : '') + formatCurrency(trade.pnl) : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
