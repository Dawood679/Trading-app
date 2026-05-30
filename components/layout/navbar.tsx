'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { Bell, ChevronDown, LogOut, Settings, User, Menu, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn, getPlanColor } from '@/lib/utils'
import { useState } from 'react'

interface NavbarProps {
  onMenuClick?: () => void
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="h-16 border-b border-[#1f2937] bg-[#0f1117] flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40">
      {/* Left: Mobile menu + brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-[#1f2537]"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link href="/dashboard" className="lg:hidden flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#00d395] flex items-center justify-center">
            <TrendingUp className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-white">TradeOnix</span>
        </Link>
      </div>

      {/* Right: User menu */}
      <div className="flex items-center gap-3">
        {session ? (
          <>
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#1f2537] transition-colors"
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? 'User'}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#3b82f6] flex items-center justify-center text-white text-sm font-semibold">
                    {session.user.name?.[0] ?? 'U'}
                  </div>
                )}
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm font-medium text-white leading-none">{session.user.name}</span>
                  <span className={cn('text-xs px-1.5 py-0 rounded-full border mt-0.5', getPlanColor(session.user.plan))}>
                    {session.user.plan}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1f2e] border border-[#1f2937] rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="p-3 border-b border-[#1f2937]">
                      <p className="text-sm font-medium text-white truncate">{session.user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{session.user.email}</p>
                    </div>
                    <div className="p-1">
                      <Link
                        href="/settings"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#1f2537] rounded-lg transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
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
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/pricing">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
