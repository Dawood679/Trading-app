import { create } from 'zustand'
import toast from 'react-hot-toast'
import type { WatchlistItem } from '@/types'

interface WatchlistState {
  items: WatchlistItem[]
  isLoading: boolean

  fetchWatchlist: () => Promise<void>
  addSymbol: (symbol: string, name: string) => Promise<void>
  removeSymbol: (symbol: string) => Promise<void>
  hasSymbol: (symbol: string) => boolean
}

export const useWatchlistStore = create<WatchlistState>((set, get) => ({
  items: [],
  isLoading: false,

  fetchWatchlist: async () => {
    set({ isLoading: true })
    try {
      const res = await fetch('/api/watchlist')
      if (!res.ok) throw new Error('Failed to fetch watchlist')
      const { watchlist } = await res.json()
      set({ items: watchlist, isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },

  addSymbol: async (symbol, name) => {
    // Optimistic update
    const tempItem: WatchlistItem = {
      id: `temp-${Date.now()}`,
      symbol,
      name,
      addedAt: new Date(),
    }
    set((state) => ({ items: [tempItem, ...state.items] }))

    try {
      const res = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, name }),
      })

      if (!res.ok) {
        const data = await res.json()
        // Revert optimistic update
        set((state) => ({ items: state.items.filter((i) => i.id !== tempItem.id) }))
        toast.error(data.error ?? 'Failed to add to watchlist')
        return
      }

      const { item } = await res.json()
      set((state) => ({
        items: state.items.map((i) => (i.id === tempItem.id ? item : i)),
      }))
      toast.success(`${symbol} added to watchlist`)
    } catch {
      set((state) => ({ items: state.items.filter((i) => i.id !== tempItem.id) }))
      toast.error('Failed to add to watchlist')
    }
  },

  removeSymbol: async (symbol) => {
    const prevItems = get().items
    // Optimistic update
    set((state) => ({ items: state.items.filter((i) => i.symbol !== symbol) }))

    try {
      const res = await fetch(`/api/watchlist?symbol=${encodeURIComponent(symbol)}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        set({ items: prevItems })
        toast.error('Failed to remove from watchlist')
      } else {
        toast.success(`${symbol} removed from watchlist`)
      }
    } catch {
      set({ items: prevItems })
      toast.error('Failed to remove from watchlist')
    }
  },

  hasSymbol: (symbol) => get().items.some((i) => i.symbol === symbol),
}))
