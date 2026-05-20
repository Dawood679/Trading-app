'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, X, Star } from 'lucide-react'
import { useWatchlistStore } from '@/store/use-watchlist-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SUPPORTED_SYMBOLS } from '@/lib/twelve-data'
import { Skeleton } from '@/components/ui/skeleton'

export function WatchlistWidget() {
  const { items, isLoading, fetchWatchlist, addSymbol, removeSymbol } = useWatchlistStore()
  const [adding, setAdding] = useState(false)
  const [selectedSymbol, setSelectedSymbol] = useState('')

  useEffect(() => {
    fetchWatchlist()
  }, [fetchWatchlist])

  const handleAdd = async () => {
    if (!selectedSymbol) return
    const sym = SUPPORTED_SYMBOLS.find((s) => s.symbol === selectedSymbol)
    if (sym) {
      await addSymbol(sym.symbol, sym.name)
      setSelectedSymbol('')
      setAdding(false)
    }
  }

  return (
    <div className="bg-[#1a1f2e] border border-[#1f2937] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1f2937]">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-400" />
          <h3 className="text-sm font-semibold text-white">Watchlist</h3>
          <span className="text-xs text-gray-500">({items.length})</span>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={() => setAdding(!adding)}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {adding && (
        <div className="p-3 border-b border-[#1f2937] flex gap-2">
          <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select symbol" />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_SYMBOLS.filter((s) => !items.some((i) => i.symbol === s.symbol)).map((sym) => (
                <SelectItem key={sym.symbol} value={sym.symbol}>
                  {sym.flag} {sym.symbol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" className="h-8 px-3 text-xs" onClick={handleAdd} disabled={!selectedSymbol}>
            Add
          </Button>
        </div>
      )}

      <div className="divide-y divide-[#1f2937] max-h-64 overflow-y-auto">
        {isLoading && items.length === 0 ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-gray-500">No symbols in watchlist</p>
            <p className="text-xs text-gray-600 mt-1">Click + to add symbols</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center justify-between px-4 py-2.5 group">
              <Link
                href={`/charts/${item.symbol.replace('/', '')}`}
                className="flex items-center gap-2 hover:text-white text-gray-300 transition-colors"
              >
                <span className="text-sm">
                  {SUPPORTED_SYMBOLS.find((s) => s.symbol === item.symbol)?.flag ?? '📈'}
                </span>
                <span className="text-sm font-medium">{item.symbol}</span>
              </Link>
              <button
                onClick={() => removeSymbol(item.symbol)}
                className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-[#ff4444] transition-all p-1 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
