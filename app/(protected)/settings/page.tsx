'use client'

import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import { useState } from 'react'
import { User, CreditCard, Bell, AlertTriangle, Crown, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { getPlanColor, cn } from '@/lib/utils'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState({
    signalAlerts: true,
    emailDigest: false,
    priceAlerts: false,
  })
  const [portalLoading, setPortalLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handlePortal = async () => {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error('No active subscription to manage')
      }
    } catch {
      toast.error('Failed to open billing portal')
    } finally {
      setPortalLoading(false)
    }
  }

  const plan = session?.user?.plan ?? 'FREE'

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your account and preferences.</p>
      </div>

      {/* Profile */}
      <div className="bg-[#1a1f2e] border border-[#1f2937] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <User className="w-4 h-4 text-gray-400" />
          <h2 className="font-semibold">Profile</h2>
        </div>

        <div className="flex items-center gap-4">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name ?? 'User'}
              width={64}
              height={64}
              className="rounded-full"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#3b82f6] flex items-center justify-center text-2xl font-bold text-white">
              {session?.user?.name?.[0] ?? 'U'}
            </div>
          )}
          <div>
            <p className="text-lg font-semibold text-white">{session?.user?.name}</p>
            <p className="text-sm text-gray-400">{session?.user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={cn('text-xs border', getPlanColor(plan))}>
                {plan}
              </Badge>
              <span className="text-xs text-gray-500">via Google</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-4 p-3 bg-[#0f1117] rounded-lg">
          🔒 Your profile is managed by Google. To change your name or photo, update your Google account.
        </p>
      </div>

      {/* Plan */}
      <div className="bg-[#1a1f2e] border border-[#1f2937] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <CreditCard className="w-4 h-4 text-gray-400" />
          <h2 className="font-semibold">Subscription</h2>
        </div>

        <div className={cn(
          'flex items-center justify-between p-4 rounded-xl border mb-4',
          plan === 'PREMIUM' ? 'bg-purple-500/10 border-purple-500/20' :
          plan === 'PRO' ? 'bg-blue-500/10 border-blue-500/20' :
          'bg-[#0f1117] border-[#1f2937]'
        )}>
          <div className="flex items-center gap-3">
            <Crown className={cn('w-5 h-5', plan === 'PREMIUM' ? 'text-purple-400' : plan === 'PRO' ? 'text-blue-400' : 'text-gray-400')} />
            <div>
              <p className="font-semibold">{plan} Plan</p>
              <p className="text-xs text-gray-400">
                {plan === 'FREE' ? 'Basic features' :
                 plan === 'PRO' ? '$9.99/month · AI Advisor + Learn' :
                 '$24.99/month · All features'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {plan === 'FREE' ? (
              <Link href="/pricing">
                <Button size="sm" className="gap-1.5">
                  <Crown className="w-3.5 h-3.5" />
                  Upgrade
                </Button>
              </Link>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={handlePortal}
                disabled={portalLoading}
                className="gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Manage
              </Button>
            )}
          </div>
        </div>

        {plan !== 'PREMIUM' && (
          <div className="text-center">
            <Link href="/pricing" className="text-xs text-[#3b82f6] hover:underline">
              View all plan features →
            </Link>
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className="bg-[#1a1f2e] border border-[#1f2937] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Bell className="w-4 h-4 text-gray-400" />
          <h2 className="font-semibold">Notifications</h2>
        </div>

        <div className="space-y-4">
          {[
            { key: 'signalAlerts' as const, label: 'Signal Alerts', desc: 'Get notified when strong buy/sell signals are generated' },
            { key: 'emailDigest' as const, label: 'Daily Email Digest', desc: 'Receive a daily summary of market signals' },
            { key: 'priceAlerts' as const, label: 'Price Alerts', desc: 'Get alerts when watchlist prices hit targets' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <Label className="text-sm text-white">{item.label}</Label>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
              <Switch
                checked={notifications[item.key]}
                onCheckedChange={(v) => {
                  setNotifications((prev) => ({ ...prev, [item.key]: v }))
                  toast.success(`${item.label} ${v ? 'enabled' : 'disabled'}`)
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-[#1a1f2e] border border-[#ff4444]/30 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <AlertTriangle className="w-4 h-4 text-[#ff4444]" />
          <h2 className="font-semibold text-[#ff4444]">Danger Zone</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white">Sign Out</p>
              <p className="text-xs text-gray-500">Sign out of your account on this device</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: '/' })}>
              Sign Out
            </Button>
          </div>

          <Separator className="bg-[#1f2937]" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white">Delete Account</p>
              <p className="text-xs text-gray-500">Permanently delete your account and all data</p>
            </div>
            {!confirmDelete ? (
              <Button variant="destructive" size="sm" onClick={() => setConfirmDelete(true)}>
                Delete
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>Cancel</Button>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={deleting}
                  onClick={() => {
                    setDeleting(true)
                    toast.error('Account deletion requires contacting support.')
                    setDeleting(false)
                    setConfirmDelete(false)
                  }}
                >
                  Confirm Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
