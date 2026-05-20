import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { stripe, PLANS } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { plan } = await req.json()

  if (!['PRO', 'PREMIUM'].includes(plan)) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const planConfig = PLANS[plan as 'PRO' | 'PREMIUM']

  if (!planConfig.priceId) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: session.user.email,
      line_items: [{ price: planConfig.priceId, quantity: 1 }],
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?upgraded=${plan.toLowerCase()}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
      metadata: { userId: session.user.id, plan },
      subscription_data: { metadata: { userId: session.user.id, plan } },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
