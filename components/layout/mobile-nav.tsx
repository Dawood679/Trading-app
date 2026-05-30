'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
  LayoutDashboard, BarChart2, Zap, BookOpen, Bot,
  FlaskConical, Settings, TrendingUp, X, Crown, LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', plan: null },
  { href: '/charts/EURUSD', icon: BarChart2, label: 'Charts', plan: null },
  { href: '/signals', icon: Zap, label: 'Signals', plan: null },
  { href: '/strategies', icon: TrendingUp, label: 'Strategies', plan: null },
  { href: '/learn', icon: BookOpen, label: 'Learn', plan: 'PRO' as const },
  { href: '/ai-advisor', icon: Bot, label: 'AI Advisor', plan: 'PRO' as const },
  { href: '/backtesting', icon: FlaskConical, label: 'Backtesting', plan: 'PREMIUM' as const },
  { href: '/settings', icon: Settings, label: 'Settings', plan: null },
]

interface MobileNavProps {
  open: boolean
  onClose: () => void
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const plan = session?.user?.plan ?? 'FREE'

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />
      <div className="fixed inset-y-0 left-0 w-72 bg-[#0f1117] border-r border-[#1f2937] z-50 flex flex-col animate-slide-in">
        <div className="flex items-center justify-between h-16 px-4 border-b border-[#1f2937]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#00d395] flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-white">TradeOnix</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href.replace('/EURUSD', ''))
            const Icon = item.icon
            const locked =
              (item.plan === 'PRO' && plan === 'FREE') ||
              (item.plan === 'PREMIUM' && plan !== 'PREMIUM')

            return (
              <Link
                key={item.href}
                href={locked ? '/pricing' : item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-[#1a1f2e] text-white border border-[#1f2937]'
                    : 'text-gray-400 hover:text-white hover:bg-[#1f2537]'
                )}
              >
                <Icon className={cn('w-5 h-5', locked && 'opacity-50')} />
                <span className={cn(locked && 'opacity-50')}>{item.label}</span>
                {item.plan && (
                  <Badge
                    variant={item.plan === 'PREMIUM' ? 'premium' : 'pro'}
                    className="ml-auto text-[10px] px-1.5 py-0"
                  >
                    {item.plan}
                  </Badge>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-[#1f2937] space-y-3">
          <div className={cn(
            'rounded-lg p-3 text-center',
            plan === 'PREMIUM' ? 'bg-purple-500/10 border border-purple-500/20' :
            plan === 'PRO' ? 'bg-blue-500/10 border border-blue-500/20' :
            'bg-[#1a1f2e] border border-[#1f2937]'
          )}>
            <div className="flex items-center justify-center gap-1.5">
              {plan !== 'FREE' && <Crown className="w-3.5 h-3.5 text-yellow-400" />}
              <span className="text-xs font-semibold text-white">{plan} Plan</span>
            </div>
            {plan === 'FREE' && (
              <Link href="/pricing" onClick={onClose} className="text-xs text-[#3b82f6] hover:underline">
                Upgrade to Pro →
              </Link>
            )}
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#ff4444] hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </div>
    </>
  )
}
