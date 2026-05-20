# TradingPro — Professional Trading Signals Platform

A full-featured Next.js 14 trading platform with real-time signals, AI-powered analysis, TradingView charts, and Stripe subscription management.

## Features

| Feature | Free | Pro | Premium |
|---------|------|-----|---------|
| RSI Signals (6 pairs) | ✅ | ✅ | ✅ |
| Real-time Charts | ✅ | ✅ | ✅ |
| Live Price Feed | ✅ | ✅ | ✅ |
| Watchlist (items) | 3 | 20 | ∞ |
| MACD + Bollinger Band Signals | ❌ | ✅ | ✅ |
| AI Trading Advisor (Claude) | ❌ | ✅ | ✅ |
| Trading Academy + Quizzes | ❌ | ✅ | ✅ |
| Strategy Backtesting | ❌ | ❌ | ✅ |
| Stochastic + Fibonacci | ❌ | ❌ | ✅ |

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Database**: PostgreSQL (Neon.tech) + Prisma ORM
- **Auth**: NextAuth.js v5 with Google OAuth
- **Charts**: TradingView Lightweight Charts v4
- **Market Data**: Twelve Data API (with mock fallback)
- **Payments**: Stripe Subscriptions
- **AI**: Anthropic Claude API
- **UI**: Tailwind CSS + shadcn/ui + Recharts
- **State**: Zustand

---

## Quick Setup

### 1. Clone and install

```bash
git clone <your-repo>
cd trading-platform
npm install --legacy-peer-deps
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in all values in `.env.local` (see API Key Setup below).

### 3. Set up database (Neon.tech — free PostgreSQL)

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project → copy the connection string
3. Paste it as `DATABASE_URL` in `.env.local`

```bash
npm run db:push    # Push schema to database
npm run db:seed    # Seed with sample learn modules and signals
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app works without any API keys (uses mock data).

---

## API Key Setup

### Google OAuth (Required for login)

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project → Enable Google OAuth API
3. Create OAuth credentials → Web application
4. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
5. Copy Client ID and Client Secret to `.env.local`

### Twelve Data (Optional — free tier available)

1. Sign up at [twelvedata.com](https://twelvedata.com)
2. Get your API key from the dashboard
3. Free tier: 800 requests/day, 8 requests/minute
4. **Without API key**: app uses realistic mock data automatically

### Stripe (Optional — required for paid plans)

1. Create an account at [stripe.com](https://stripe.com)
2. Go to Dashboard → Products → Create two subscription products:
   - **Pro**: $9.99/month
   - **Premium**: $24.99/month
3. Copy the Price IDs for each product
4. Add to `.env.local`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_PRO_PRICE_ID=price_...
   STRIPE_PREMIUM_PRICE_ID=price_...
   ```
5. For webhooks (local dev): Install [Stripe CLI](https://stripe.com/docs/stripe-cli) and run:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   Copy the `whsec_...` signing secret to `STRIPE_WEBHOOK_SECRET`

### Anthropic Claude API (Required for AI Advisor)

1. Sign up at [console.anthropic.com](https://console.anthropic.com)
2. Create an API key
3. Add to `.env.local`: `ANTHROPIC_API_KEY=sk-ant-...`

### Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

---

## Database Commands

```bash
npm run db:push      # Push schema changes to database
npm run db:migrate   # Create a migration
npm run db:studio    # Open Prisma Studio (visual DB editor)
npm run db:seed      # Seed with sample data
npm run db:generate  # Regenerate Prisma client
```

---

## Project Structure

```
trading-platform/
├── app/
│   ├── (auth)/login/          # Google sign-in page
│   ├── (protected)/           # Auth-required pages
│   │   ├── dashboard/         # Main dashboard
│   │   ├── charts/[symbol]/   # TradingView chart page
│   │   ├── signals/           # Live signals grid
│   │   ├── strategies/        # Strategy cards
│   │   ├── learn/             # Trading academy
│   │   ├── ai-advisor/        # Claude AI chat
│   │   ├── backtesting/       # Strategy backtester
│   │   └── settings/          # Account settings
│   ├── pricing/               # Plan comparison page
│   ├── api/                   # API routes
│   └── page.tsx               # Landing page
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── layout/                # Navbar, Sidebar, MobileNav
│   ├── charts/                # TradingChart, RSI, MACD panels
│   ├── signals/               # Signal cards and badges
│   ├── dashboard/             # Stats cards, watchlist, feed
│   ├── ai/                    # Chat components
│   └── common/                # Plan lock overlay, skeletons
├── lib/
│   ├── prisma.ts              # Database client
│   ├── signals-engine.ts      # RSI, MACD, BB calculations
│   ├── twelve-data.ts         # Market data API + mock
│   ├── stripe.ts              # Stripe client
│   └── utils.ts               # Helpers
├── store/                     # Zustand state stores
├── types/                     # TypeScript type definitions
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Sample data seeder
├── auth.ts                    # NextAuth v5 config
└── middleware.ts              # Route protection
```

---

## Supported Markets

| Symbol | Name | Type |
|--------|------|------|
| EUR/USD | Euro / US Dollar | Forex |
| GBP/USD | British Pound / USD | Forex |
| USD/JPY | US Dollar / Japanese Yen | Forex |
| BTC/USD | Bitcoin / US Dollar | Crypto |
| ETH/USD | Ethereum / US Dollar | Crypto |
| XAU/USD | Gold / US Dollar | Commodity |

---

## Signal Generation Logic

Signals are computed using a multi-indicator scoring system:

| Condition | Bull Score | Bear Score |
|-----------|-----------|-----------|
| RSI < 25 (extremely oversold) | +3 | |
| RSI < 35 (oversold) | +2 | |
| RSI > 75 (extremely overbought) | | +3 |
| RSI > 65 (overbought) | | +2 |
| MACD histogram positive | +2 | |
| MACD histogram negative | | +2 |
| Price near lower Bollinger Band | +2 | |
| Price near upper Bollinger Band | | +2 |

**Signal thresholds:**
- Net score ≥ 5 → **STRONG BUY**
- Net score ≥ 3 → **BUY**
- Net score ≤ -5 → **STRONG SELL**
- Net score ≤ -3 → **SELL**
- Otherwise → **NEUTRAL**

---

## Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel

# Set environment variables in Vercel dashboard
# Update NEXTAUTH_URL to your production URL
# Update Google OAuth redirect URIs
# Set up Stripe webhooks for production endpoint
```

### Database: Neon.tech (recommended)
- Free tier: 0.5GB storage, perfect for development
- Connection pooling built in
- Serverless-compatible

---

## Development Notes

- **Without API keys**: All market data falls back to realistic mock OHLCV data generated with random walk
- **Chart rendering**: TradingView Lightweight Charts uses `dynamic(() => import(...), { ssr: false })` to avoid SSR issues
- **Stripe in dev**: Use `stripe listen --forward-to localhost:3000/api/stripe/webhook` and test cards
- **NextAuth v5**: Uses `auth()` instead of `getServerSession()`. Session stored in database via Prisma adapter
- **Prisma singleton**: Required to avoid connection pool exhaustion during Next.js hot reload

---

## ⚠️ Disclaimer

TradingPro is an educational trading analysis tool. It does not provide financial advice. Trading involves significant risk of loss. Past performance is not indicative of future results. Always consult a licensed financial advisor before making investment decisions.
