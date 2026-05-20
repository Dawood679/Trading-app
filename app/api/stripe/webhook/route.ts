import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import type Stripe from 'stripe'

export async function POST(req: NextRequest) {
  // MUST read as text first — body parser must not consume it
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Stripe webhook verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const plan = session.metadata?.plan as 'PRO' | 'PREMIUM'

        if (userId && plan) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              plan,
              stripeCustomerId: session.customer as string,
              stripeSubId: session.subscription as string,
            },
          })
        }
        break
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const plan = (sub.metadata?.plan as 'PRO' | 'PREMIUM') ?? 'PRO'

        await prisma.user.updateMany({
          where: { stripeCustomerId: sub.customer as string },
          data: {
            plan: sub.status === 'active' ? plan : 'FREE',
            stripeSubId: sub.id,
          },
        })
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        await prisma.user.updateMany({
          where: { stripeCustomerId: sub.customer as string },
          data: { plan: 'FREE', stripeSubId: null },
        })
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        console.warn('Payment failed for customer:', invoice.customer)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
