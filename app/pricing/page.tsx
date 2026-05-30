'use client'

import { Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { Check, Crown, Zap, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PLANS } from '@/lib/stripe'
import toast from 'react-hot-toast'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { TrendingUp } from 'lucide-react'

const plans = [
  {
    key: 'FREE' as const,
    ...PLANS.FREE,
    color: '#6b7280',
    icon: Zap,
    features: PLANS.FREE.features,
    limitations: PLANS.FREE.limitations,
  },
  {
    key: 'PRO' as const,
    ...PLANS.PRO,
    color: '#3b82f6',
    icon: Zap,
    highlighted: true,
    features: PLANS.PRO.features,
    limitations: PLANS.PRO.limitations,
  },
  {
    key: 'PREMIUM' as const,
    ...PLANS.PREMIUM,
    color: '#8b5cf6',
    icon: Crown,
    features: PLANS.PREMIUM.features,
    limitations: [],
  },
]

function PricingContent() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const upgradeParam = searchParams.get('upgrade')

  const handleUpgrade = async (planKey: 'PRO' | 'PREMIUM') => {
    if (!session) {
      router.push('/login')
      return
    }

    const toastId = toast.loading('Creating checkout session...')

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error ?? 'Failed to create checkout')
      }

      toast.dismiss(toastId)

      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error('Stripe not configured — add STRIPE_PRO_PRICE_ID to .env')
      }
    } catch (error: any) {
      toast.error(error.message ?? 'Failed to create checkout', { id: toastId })
    }
  }

  return (
    <div className="min-h-screen bg-[#0f1117]">
      <nav className="border-b border-[#1f2937] h-16 flex items-center px-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#00d395] flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold">TradeOnix</span>
        </Link>
        {session && (
          <Link href="/dashboard" className="ml-auto text-sm text-[#3b82f6] hover:underline">
            Back to Dashboard →
          </Link>
        )}
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Choose Your Plan</h1>
          <p className="text-gray-400 text-lg">Start free. Upgrade when you need professional tools.</p>
          {upgradeParam && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#3b82f6]/10 border border-[#3b82f6]/30 rounded-full text-sm text-[#3b82f6]">
              <Zap className="w-4 h-4" />
              Upgrade to {upgradeParam.toUpperCase()} to unlock this feature
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrentPlan = session?.user.plan === plan.key
            const canUpgrade = plan.key !== 'FREE' && !isCurrentPlan
            const isFree = plan.key === 'FREE'

            return (
              <div
                key={plan.key}
                className={cn(
                  'relative rounded-2xl p-6 border flex flex-col',
                  (plan as any).highlighted
                    ? 'border-[#3b82f6] bg-[#3b82f6]/5 shadow-lg shadow-[#3b82f6]/10'
                    : 'border-[#1f2937] bg-[#1a1f2e]',
                  isCurrentPlan && 'ring-2 ring-[#00d395]'
                )}
              >
                {(plan as any).highlighted && !isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#3b82f6] text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                {isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00d395] text-[#0f1117] text-xs font-semibold px-3 py-1 rounded-full">
                    Current Plan
                  </div>
                )}

                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${plan.color}20` }}>
                      <plan.icon className="w-5 h-5" style={{ color: plan.color }} />
                    </div>
                    <h2 className="text-xl font-bold">{plan.name}</h2>
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    {plan.price > 0 && <span className="text-gray-400 text-sm">/month</span>}
                    {plan.price === 0 && <span className="text-gray-400 text-sm">forever</span>}
                  </div>
                  <p className="text-sm text-gray-400">{plan.description}</p>
                </div>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-[#00d395] mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{f}</span>
                    </li>
                  ))}
                  {plan.limitations?.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm opacity-50">
                      <X className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-500">{f}</span>
                    </li>
                  ))}
                </ul>

                <div>
                  {isCurrentPlan ? (
                    <Button variant="outline" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : isFree ? (
                    <Link href={session ? '/dashboard' : '/login'}>
                      <Button variant="secondary" className="w-full">
                        {session ? 'Go to Dashboard' : 'Sign Up Free'}
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      className="w-full"
                      variant={plan.key === 'PREMIUM' ? 'gradient' : 'default'}
                      onClick={() => handleUpgrade(plan.key)}
                    >
                      <Crown className="w-4 h-4 mr-1.5" />
                      Upgrade to {plan.name}
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            All plans include a 30-day money-back guarantee. Cancel anytime.
          </p>
          <p className="text-xs text-gray-600 mt-2">
            ⚠️ Trading involves risk. TradeOnix provides analysis tools, not financial advice.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f1117]" />}>
      <PricingContent />
    </Suspense>
  )
}
