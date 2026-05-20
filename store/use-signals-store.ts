import { create } from 'zustand'
import type { Signal, SignalType } from '@/types'

interface SignalsFilter {
  symbol: string
  signalType: SignalType | 'ALL'
  minConfidence: number
}

interface SignalsState {
  signals: Signal[]
  filter: SignalsFilter
  lastRefresh: Date | null
  isLoading: boolean
  error: string

  fetchSignals: (symbol?: string) => Promise<void>
  setFilter: (filter: Partial<SignalsFilter>) => void
  getFiltered: () => Signal[]
  startAutoRefresh: (intervalMs?: number) => () => void
}

export const useSignalsStore = create<SignalsState>((set, get) => ({
  signals: [],
  filter: { symbol: 'ALL', signalType: 'ALL', minConfidence: 0 },
  lastRefresh: null,
  isLoading: false,
  error: '',

  fetchSignals: async (symbol) => {
    set({ isLoading: true, error: '' })
    try {
      const url = symbol
        ? `/api/signals?symbol=${encodeURIComponent(symbol)}`
        : '/api/signals'
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch signals')
      const { signals } = await res.json()
      set({ signals, lastRefresh: new Date(), isLoading: false })
    } catch (error) {
      set({ error: 'Failed to load signals', isLoading: false })
    }
  },

  setFilter: (filter) =>
    set((state) => ({ filter: { ...state.filter, ...filter } })),

  getFiltered: () => {
    const { signals, filter } = get()
    return signals.filter((s) => {
      if (filter.symbol !== 'ALL' && s.symbol !== filter.symbol) return false
      if (filter.signalType !== 'ALL' && s.signalType !== filter.signalType) return false
      if (s.confidence < filter.minConfidence) return false
      return true
    })
  },

  startAutoRefresh: (intervalMs = 60000) => {
    const id = setInterval(() => get().fetchSignals(), intervalMs)
    return () => clearInterval(id)
  },
}))
