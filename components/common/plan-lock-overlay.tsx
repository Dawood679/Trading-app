import Link from 'next/link'
import { Lock, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Plan } from '@/types'

interface PlanLockOverlayProps {
  requiredPlan: 'PRO' | 'PREMIUM'
  className?: string
}

export function PlanLockOverlay({ requiredPlan, className }: PlanLockOverlayProps) {
  const isPremium = requiredPlan === 'PREMIUM'
  const color = isPremium ? 'text-purple-400' : 'text-blue-400'
  const bgColor = isPremium ? 'bg-purple-500/10 border-purple-500/20' : 'bg-blue-500/10 border-blue-500/20'

  return (
    <div
      className={cn(
        'absolute inset-0 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center z-10 border',
        bgColor,
        className
      )}
    >
      <div className={cn('w-12 h-12 rounded-full flex items-center justify-center mb-3', isPremium ? 'bg-purple-500/20' : 'bg-blue-500/20')}>
        {isPremium ? (
          <Crown className={cn('w-6 h-6', color)} />
        ) : (
          <Lock className={cn('w-6 h-6', color)} />
        )}
      </div>
      <p className={cn('text-sm font-semibold mb-1', color)}>{requiredPlan} Plan Required</p>
      <p className="text-xs text-gray-500 mb-4 text-center px-4">
        Upgrade your plan to access this feature
      </p>
      <Link href={`/pricing?upgrade=${requiredPlan.toLowerCase()}`}>
        <Button size="sm" variant={isPremium ? 'gradient' : 'default'} className="gap-1.5">
          <Crown className="w-3.5 h-3.5" />
          Upgrade to {requiredPlan}
        </Button>
      </Link>
    </div>
  )
}
