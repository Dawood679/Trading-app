import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? 'sk_test_placeholder', {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
})

export const PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    priceId: null,
    description: 'Get started with basic trading signals',
    features: [
      'RSI signals for 6 pairs',
      'Basic chart view',
      'Live price feed',
      '3 watchlist items',
      'Basic market overview',
    ],
    limitations: [
      'No AI Advisor',
      'No Learn modules',
      'No Backtesting',
      'No MACD/BB strategies',
    ],
  },
  PRO: {
    name: 'Pro',
    price: 9.99,
    priceId: process.env.STRIPE_PRO_PRICE_ID ?? '',
    description: 'Advanced tools for serious traders',
    features: [
      'Everything in Free',
      'MACD + Bollinger Band signals',
      'AI Trading Advisor (Claude)',
      'Full Learn curriculum',
      'EMA Crossover strategy',
      '20 watchlist items',
      'Signal confidence scores',
      'Strategy performance data',
    ],
    limitations: ['No Backtesting'],
  },
  PREMIUM: {
    name: 'Premium',
    price: 24.99,
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID ?? '',
    description: 'Professional-grade trading platform',
    features: [
      'Everything in Pro',
      'Full Backtesting engine',
      'Stochastic Oscillator',
      'Fibonacci Retracement',
      'Unlimited watchlist',
      'Priority support',
      'Custom strategy parameters',
      'Portfolio analytics',
    ],
    limitations: [],
  },
}

export type PlanKey = keyof typeof PLANS
