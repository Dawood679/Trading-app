import { create } from 'zustand'
import type { OHLCV } from '@/types'

interface MarketState {
  priceData: Record<string, OHLCV[]>
  currentPrices: Record<string, number>
  selectedSymbol: string
  selectedTimeframe: string
  isLoading: Record<string, boolean>
  errors: Record<string, string>

  setSymbol: (symbol: string) => void
  setTimeframe: (tf: string) => void
  fetchPriceData: (symbol: string, interval?: string) => Promise<void>
  updatePrice: (symbol: string, price: number) => void
}

export const useMarketStore = create<MarketState>((set, get) => ({
  priceData: {},
  currentPrices: {},
  selectedSymbol: 'EUR/USD',
  selectedTimeframe: '1day',
  isLoading: {},
  errors: {},

  setSymbol: (symbol) => set({ selectedSymbol: symbol }),

  setTimeframe: (tf) => set({ selectedTimeframe: tf }),

  fetchPriceData: async (symbol, interval) => {
    const tf = interval ?? get().selectedTimeframe
    const key = `${symbol}-${tf}`

    set((state) => ({ isLoading: { ...state.isLoading, [key]: true } }))

    try {
      const res = await fetch(`/api/market-data?symbol=${encodeURIComponent(symbol)}&interval=${tf}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const { data } = await res.json()

      const lastPrice = data[data.length - 1]?.close ?? 0

      set((state) => ({
        priceData: { ...state.priceData, [key]: data },
        currentPrices: { ...state.currentPrices, [symbol]: lastPrice },
        isLoading: { ...state.isLoading, [key]: false },
        errors: { ...state.errors, [key]: '' },
      }))
    } catch (error) {
      set((state) => ({
        isLoading: { ...state.isLoading, [key]: false },
        errors: { ...state.errors, [key]: 'Failed to load price data' },
      }))
    }
  },

  updatePrice: (symbol, price) =>
    set((state) => ({ currentPrices: { ...state.currentPrices, [symbol]: price } })),
}))
