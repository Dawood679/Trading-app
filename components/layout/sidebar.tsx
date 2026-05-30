'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  LayoutDashboard,
  BarChart2,
  Zap,
  BookOpen,
  Bot,
  FlaskConical,
  Settings,
  TrendingUp,
  Crown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'

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

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [collapsed, setCollapsed] = useState(false)

  const plan = session?.user?.plan ?? 'FREE'

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col h-screen sticky top-0 border-r border-[#1f2937] bg-[#0f1117] transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-[#1f2937]">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#00d395] flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-white">TradeOnix</span>
          </Link>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#00d395] flex items-center justify-center mx-auto">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      {/* Nav */}
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
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-[#1a1f2e] text-white border border-[#1f2937]'
                  : 'text-gray-400 hover:text-white hover:bg-[#1f2537]',
                collapsed && 'justify-center px-0'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={cn('w-5 h-5 flex-shrink-0', locked && 'opacity-50')} />
              {!collapsed && (
                <>
                  <span className={cn(locked && 'opacity-50')}>{item.label}</span>
                  {item.plan && (
                    <Badge
                      variant={item.plan === 'PREMIUM' ? 'premium' : 'pro'}
                      className="ml-auto text-[10px] px-1.5 py-0"
                    >
                      {item.plan}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Plan badge */}
      {!collapsed && (
        <div className="p-4 border-t border-[#1f2937]">
          <div
            className={cn(
              'rounded-lg p-3 text-center',
              plan === 'PREMIUM'
                ? 'bg-purple-500/10 border border-purple-500/20'
                : plan === 'PRO'
                ? 'bg-blue-500/10 border border-blue-500/20'
                : 'bg-[#1a1f2e] border border-[#1f2937]'
            )}
          >
            <div className="flex items-center justify-center gap-1.5 mb-1">
              {plan !== 'FREE' && <Crown className="w-3.5 h-3.5 text-yellow-400" />}
              <span className="text-xs font-semibold text-white">{plan} Plan</span>
            </div>
            {plan === 'FREE' && (
              <Link
                href="/pricing"
                className="text-xs text-[#3b82f6] hover:underline"
              >
                Upgrade to Pro →
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-10 border-t border-[#1f2937] text-gray-500 hover:text-white transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  )
}
