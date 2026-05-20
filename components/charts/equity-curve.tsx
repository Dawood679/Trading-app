'use client'

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface EquityCurveProps {
  data: { date: string; equity: number }[]
  initialCapital: number
  height?: number
}

export function EquityCurve({ data, initialCapital, height = 280 }: EquityCurveProps) {
  const lastEquity = data[data.length - 1]?.equity ?? initialCapital
  const isPositive = lastEquity >= initialCapital
  const color = isPositive ? '#00d395' : '#ff4444'

  return (
    <div className="bg-[#1a1f2e] rounded-lg border border-[#1f2937] overflow-hidden">
      <div className="px-4 py-3 border-b border-[#1f2937] flex items-center justify-between">
        <span className="text-sm font-medium text-gray-400">Equity Curve</span>
        <span className="text-sm font-bold" style={{ color }}>
          {formatCurrency(lastEquity)}
        </span>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 5, left: 10 }}>
          <defs>
            <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis
            tick={{ fill: '#6b7280', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            width={50}
          />
          <Tooltip
            contentStyle={{ background: '#1a1f2e', border: '1px solid #1f2937', borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: '#9ca3af' }}
            formatter={(v: number) => [formatCurrency(v), 'Equity']}
          />
          <ReferenceLine y={initialCapital} stroke="#374151" strokeDasharray="4 4" strokeWidth={1} />
          <Area
            type="monotone"
            dataKey="equity"
            stroke={color}
            strokeWidth={2}
            fill="url(#equityGrad)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
