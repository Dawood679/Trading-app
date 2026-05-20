import { cn, getSignalBgColor, getSignalLabel } from '@/lib/utils'
import type { SignalType } from '@/types'

interface SignalBadgeProps {
  signalType: SignalType
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function SignalBadge({ signalType, size = 'md', className }: SignalBadgeProps) {
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-4 py-2 font-bold',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-semibold tracking-wide',
        getSignalBgColor(signalType),
        sizeClasses[size],
        className
      )}
    >
      {getSignalLabel(signalType)}
    </span>
  )
}
