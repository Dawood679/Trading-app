'use client'

import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer
} from 'recharts'
import { calculateMACD } from '@/lib/signals-engine'
import type { OHLCV } from '@/types'

interface MACDPanelProps {
  data: OHLCV[]
  height?: number
}

export function MACDPanel({ data, height = 120 }: MACDPanelProps) {
  if (data.length < 35) return null

  const closes = data.map((d) => d.close)
  const { macdLine, signalLine, histogram } = calculateMACD(closes)

  const chartData = data
    .map((d, i) => ({
      time: typeof d.time === 'string' ? d.time.slice(5) : d.time,
      macd: isNaN(macdLine[i]) ? null : parseFloat(macdLine[i].toFixed(6)),
      signal: isNaN(signalLine[i]) ? null : parseFloat(signalLine[i].toFixed(6)),
      histogram: isNaN(histogram[i]) ? null : parseFloat(histogram[i].toFixed(6)),
    }))
    .filter((d) => d.macd !== null)
    .slice(-50)

  const lastHist = histogram[histogram.length - 1]
  const histColor = lastHist >= 0 ? '#00d395' : '#ff4444'

  return (
    <div className="bg-[#1a1f2e] rounded-lg border border-[#1f2937] overflow-hidden">
      <div className="px-4 py-2 border-b border-[#1f2937] flex items-center justify-between">
        <span className="text-xs font-medium text-gray-400">MACD (12, 26, 9)</span>
        <span className="text-xs font-bold" style={{ color: histColor }}>
          {isNaN(lastHist) ? '—' : (lastHist >= 0 ? '+' : '') + lastHist.toFixed(5)}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} width={40} tickCount={5} />
          <Tooltip
            contentStyle={{ background: '#1a1f2e', border: '1px solid #1f2937', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: '#9ca3af' }}
          />
          <ReferenceLine y={0} stroke="#374151" strokeWidth={1} />
          <Bar dataKey="histogram" fill={histColor} opacity={0.7} />
          <Line type="monotone" dataKey="macd" stroke="#3b82f6" strokeWidth={1.5} dot={false} />
          <Line type="monotone" dataKey="signal" stroke="#f59e0b" strokeWidth={1.5} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
