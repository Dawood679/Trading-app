'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'
import { calculateRSI } from '@/lib/signals-engine'
import type { OHLCV } from '@/types'
import { getRSIColor } from '@/lib/utils'

interface RSIPanelProps {
  data: OHLCV[]
  height?: number
}

export function RSIPanel({ data, height = 120 }: RSIPanelProps) {
  if (data.length < 20) return null

  const closes = data.map((d) => d.close)
  const rsiValues = calculateRSI(closes)

  const chartData = data.map((d, i) => ({
    time: typeof d.time === 'string' ? d.time.slice(5) : d.time,
    rsi: isNaN(rsiValues[i]) ? null : parseFloat(rsiValues[i].toFixed(1)),
  })).filter((d) => d.rsi !== null).slice(-50)

  const lastRsi = rsiValues[rsiValues.length - 1]
  const rsiColor = getRSIColor(lastRsi)

  return (
    <div className="bg-[#1a1f2e] rounded-lg border border-[#1f2937] overflow-hidden">
      <div className="px-4 py-2 border-b border-[#1f2937] flex items-center justify-between">
        <span className="text-xs font-medium text-gray-400">RSI (14)</span>
        <span className="text-xs font-bold" style={{ color: rsiColor }}>
          {isNaN(lastRsi) ? '—' : lastRsi.toFixed(1)}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} width={30} ticks={[30, 50, 70]} />
          <Tooltip
            contentStyle={{ background: '#1a1f2e', border: '1px solid #1f2937', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: '#9ca3af' }}
            itemStyle={{ color: '#3b82f6' }}
          />
          <ReferenceLine y={70} stroke="#ff4444" strokeDasharray="4 4" strokeWidth={1} label={{ value: '70', position: 'right', fill: '#ff4444', fontSize: 10 }} />
          <ReferenceLine y={50} stroke="#374151" strokeDasharray="4 4" strokeWidth={1} />
          <ReferenceLine y={30} stroke="#00d395" strokeDasharray="4 4" strokeWidth={1} label={{ value: '30', position: 'right', fill: '#00d395', fontSize: 10 }} />
          <Line
            type="monotone"
            dataKey="rsi"
            stroke="#3b82f6"
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 4, fill: '#3b82f6' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
