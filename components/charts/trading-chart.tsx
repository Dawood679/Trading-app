'use client'

import { useEffect, useRef } from 'react'
import {
  createChart,
  ColorType,
  CrosshairMode,
  type IChartApi,
  type ISeriesApi,
} from 'lightweight-charts'
import type { OHLCV } from '@/types'

interface TradingChartProps {
  data: OHLCV[]
  symbol: string
  height?: number
}

export function TradingChart({ data, symbol, height = 500 }: TradingChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    chartRef.current = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#1a1f2e' },
        textColor: '#9ca3af',
        fontSize: 12,
      },
      grid: {
        vertLines: { color: '#1f2937' },
        horzLines: { color: '#1f2937' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: '#374151', labelBackgroundColor: '#1a1f2e' },
        horzLine: { color: '#374151', labelBackgroundColor: '#1a1f2e' },
      },
      rightPriceScale: {
        borderColor: '#1f2937',
        textColor: '#9ca3af',
      },
      timeScale: {
        borderColor: '#1f2937',
        timeVisible: true,
        secondsVisible: false,
      },
      width: containerRef.current.clientWidth,
      height,
    })

    seriesRef.current = chartRef.current.addCandlestickSeries({
      upColor: '#00d395',
      downColor: '#ff4444',
      borderUpColor: '#00d395',
      borderDownColor: '#ff4444',
      wickUpColor: '#00d395',
      wickDownColor: '#ff4444',
    })

    if (data.length > 0) {
      seriesRef.current.setData(data as any)
      chartRef.current.timeScale().fitContent()
    }

    const observer = new ResizeObserver(() => {
      if (containerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: containerRef.current.clientWidth })
      }
    })
    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
      chartRef.current?.remove()
      chartRef.current = null
    }
  }, [height])

  // Update data without recreating chart
  useEffect(() => {
    if (seriesRef.current && data.length > 0) {
      seriesRef.current.setData(data as any)
      chartRef.current?.timeScale().fitContent()
    }
  }, [data])

  return (
    <div className="w-full rounded-lg overflow-hidden bg-[#1a1f2e]">
      <div className="px-4 py-3 border-b border-[#1f2937] flex items-center justify-between">
        <span className="text-sm font-semibold text-white">{symbol}</span>
        <span className="text-xs text-gray-400">
          {data.length > 0 &&
            `Last: ${typeof data[data.length - 1].time === 'string' ? data[data.length - 1].time : new Date((data[data.length - 1].time as number) * 1000).toLocaleDateString()}`}
        </span>
      </div>
      <div ref={containerRef} style={{ height }} />
    </div>
  )
}
