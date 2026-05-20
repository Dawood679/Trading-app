import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: LucideIcon
  iconColor?: string
  subtitle?: string
}

export function StatsCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor = '#3b82f6',
  subtitle,
}: StatsCardProps) {
  const changeColors = {
    positive: 'text-[#00d395]',
    negative: 'text-[#ff4444]',
    neutral: 'text-gray-400',
  }

  return (
    <div className="bg-[#1a1f2e] border border-[#1f2937] rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-gray-400">{title}</p>
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${iconColor}20` }}
        >
          <Icon className="w-5 h-5" style={{ color: iconColor }} />
        </div>
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <div className="flex items-center gap-2">
        {change && (
          <span className={cn('text-xs font-medium', changeColors[changeType])}>{change}</span>
        )}
        {subtitle && <span className="text-xs text-gray-500">{subtitle}</span>}
      </div>
    </div>
  )
}
