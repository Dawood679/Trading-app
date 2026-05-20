'use client'

import { AreaChart, Area, ResponsiveContainer } from 'recharts'

interface MiniChartProps {
  data: number[]
  positive?: boolean
  height?: number
}

export function MiniChart({ data, positive, height = 48 }: MiniChartProps) {
  const isPositive = positive ?? (data.length >= 2 ? data[data.length - 1] >= data[0] : true)
  const color = isPositive ? '#00d395' : '#ff4444'

  const chartData = data.map((v, i) => ({ v, i }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
        <defs>
          <linearGradient id={`grad-${isPositive}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#grad-${isPositive})`}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
