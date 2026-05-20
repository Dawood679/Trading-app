import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { SignalType } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, symbol: string): string {
  if (symbol.includes('JPY')) return price.toFixed(3)
  if (symbol.includes('BTC') || symbol.includes('ETH') || symbol.includes('XAU')) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  return price.toFixed(5)
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value)
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

export function formatCompact(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return value.toFixed(2)
}

export function timeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export function getSignalColor(signalType: SignalType): string {
  switch (signalType) {
    case 'STRONG_BUY': return 'text-emerald-400'
    case 'BUY': return 'text-green-400'
    case 'NEUTRAL': return 'text-yellow-400'
    case 'SELL': return 'text-orange-400'
    case 'STRONG_SELL': return 'text-red-400'
    default: return 'text-gray-400'
  }
}

export function getSignalBgColor(signalType: SignalType): string {
  switch (signalType) {
    case 'STRONG_BUY': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    case 'BUY': return 'bg-green-500/20 text-green-400 border-green-500/30'
    case 'NEUTRAL': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    case 'SELL': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    case 'STRONG_SELL': return 'bg-red-500/20 text-red-400 border-red-500/30'
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }
}

export function getSignalLabel(signalType: SignalType): string {
  switch (signalType) {
    case 'STRONG_BUY': return 'STRONG BUY'
    case 'BUY': return 'BUY'
    case 'NEUTRAL': return 'NEUTRAL'
    case 'SELL': return 'SELL'
    case 'STRONG_SELL': return 'STRONG SELL'
    default: return 'UNKNOWN'
  }
}

export function getPlanColor(plan: string): string {
  switch (plan) {
    case 'PREMIUM': return 'text-trading-purple bg-purple-500/10 border-purple-500/30'
    case 'PRO': return 'text-trading-blue bg-blue-500/10 border-blue-500/30'
    default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30'
  }
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case 'beginner': return 'text-trading-green bg-green-500/10'
    case 'intermediate': return 'text-trading-yellow bg-yellow-500/10'
    case 'advanced': return 'text-trading-red bg-red-500/10'
    default: return 'text-gray-400 bg-gray-500/10'
  }
}

export function getRSIColor(rsi: number): string {
  if (rsi < 30) return '#00d395'
  if (rsi < 45) return '#22c55e'
  if (rsi > 70) return '#ff4444'
  if (rsi > 55) return '#f97316'
  return '#6b7280'
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 3) + '...'
}
