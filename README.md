<div align="center">

# TradeOnix

**Professional AI-Powered Trading Signals Platform**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat-square&logo=prisma)](https://prisma.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=flat-square&logo=stripe)](https://stripe.com)

Real-time trading signals · AI Advisor · TradingView Charts · Strategy Backtesting · Trading Academy

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Keys Setup](#api-keys-setup)
- [Database Setup](#database-setup)
- [Supported Markets](#supported-markets)
- [Signal Generation Logic](#signal-generation-logic)
- [Subscription Plans](#subscription-plans)
- [API Routes Reference](#api-routes-reference)
- [Deployment](#deployment)
- [Docker](#docker)
- [Development Notes](#development-notes)
- [Disclaimer](#disclaimer)

---

## Overview

TradeOnix is a full-stack, production-ready trading platform built with **Next.js 14 App Router**. It provides real-time technical analysis signals for Forex, Crypto, and Commodities, powered by a multi-indicator scoring engine. Users can chat with an AI trading advisor (Google Gemini), backtest strategies on historical data, and learn trading through interactive academy modules — all behind a Stripe-powered subscription system.

The platform works **without any paid API keys** — all market data falls back to realistic mock OHLCV data automatically.

---

## Features

| Feature | Free | Pro | Premium |
|---------|:----:|:---:|:-------:|
| RSI Signals (6 markets) | ✅ | ✅ | ✅ |
| Real-time Candlestick Charts | ✅ | ✅ | ✅ |
| Live Price Feed | ✅ | ✅ | ✅ |
| Trading Strategies Library | ✅ | ✅ | ✅ |
| Watchlist (max items) | 3 | 20 | ∞ |
| MACD + Bollinger Band Signals | ❌ | ✅ | ✅ |
| Stochastic Oscillator Signals | ❌ | ❌ | ✅ |
| AI Trading Advisor (Gemini) | ❌ | ✅ | ✅ |
| Trading Academy + Quizzes | ❌ | ✅ | ✅ |
| Strategy Backtesting Engine | ❌ | ❌ | ✅ |
| Fibonacci Analysis | ❌ | ❌ | ✅ |

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5.6 |
| Styling | Tailwind CSS + shadcn/ui + Radix UI |
| Database | PostgreSQL (Neon.tech) |
| ORM | Prisma 5.22 |
| Authentication | NextAuth.js v5 (Google OAuth + Email OTP) |
| Payments | Stripe (Subscriptions + Customer Portal) |
| AI | Google Gemini API (2.5-flash, 2.0-flash) |
| Charts | TradingView Lightweight Charts v4 |
| Market Data | Twelve Data API → Yahoo Finance → Alpha Vantage → Mock |
| State Management | Zustand |
| Email | Nodemailer (Gmail SMTP) |
| Deployment | Docker | EC2

---

## Project Structure

```
tradeonix/
│
├── app/                            # Next.js App Router
│   ├── (auth)/
│   │   └── login/page.tsx          # Email OTP + Google OAuth login
│   │
│   ├── (protected)/                # Requires authentication
│   │   ├── layout.tsx              # Sidebar + Navbar wrapper
│   │   ├── dashboard/page.tsx      # Main dashboard with market overview
│   │   ├── charts/[symbol]/page.tsx # Dynamic chart page (e.g. /charts/EURUSD)
│   │   ├── signals/page.tsx        # Live trading signals feed
│   │   ├── strategies/page.tsx     # Strategy library with win rates
│   │   ├── ai-advisor/page.tsx     # AI chat (PRO+)
│   │   ├── backtesting/page.tsx    # Strategy backtester (PREMIUM)
│   │   ├── learn/page.tsx          # Trading academy modules (PRO+)
│   │   ├── learn/[moduleId]/page.tsx # Individual lesson + quiz
│   │   └── settings/page.tsx       # Profile + billing management
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts  # NextAuth handler
│   │   │   └── send-otp/route.ts       # Generate + email OTP
│   │   ├── signals/route.ts            # Technical analysis signal generator
│   │   ├── market-data/route.ts        # OHLCV price data endpoint
│   │   ├── watchlist/route.ts          # Watchlist CRUD
│   │   ├── ai-advisor/route.ts         # Gemini AI chat endpoint
│   │   ├── learn/route.ts              # Modules + progress tracking
│   │   └── stripe/
│   │       ├── checkout/route.ts       # Create checkout session
│   │       ├── portal/route.ts         # Billing portal session
│   │       └── webhook/route.ts        # Handle Stripe events
│   │
│   ├── pricing/page.tsx            # Public pricing page
│   ├── page.tsx                    # Public landing page
│   ├── layout.tsx                  # Root layout (metadata, fonts)
│   └── providers.tsx               # SessionProvider + Toaster
│
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx             # Desktop navigation (collapsible)
│   │   ├── navbar.tsx              # Top bar with user menu
│   │   └── mobile-nav.tsx          # Mobile slide-in navigation
│   ├── dashboard/
│   │   ├── market-overview.tsx     # Signal cards for all markets
│   │   ├── watchlist-widget.tsx    # User watchlist display
│   │   ├── live-signals-feed.tsx   # Real-time signal feed
│   │   └── stats-card.tsx          # Metric summary cards
│   ├── charts/
│   │   ├── trading-chart.tsx       # TradingView candlestick chart
│   │   ├── rsi-panel.tsx           # RSI indicator panel
│   │   ├── macd-panel.tsx          # MACD + histogram panel
│   │   ├── equity-curve.tsx        # Backtest equity curve chart
│   │   ├── mini-chart.tsx          # Sparkline preview charts
│   │   └── chart-error-boundary.tsx
│   ├── signals/
│   │   ├── signal-card.tsx         # Individual signal display card
│   │   └── signal-badge.tsx        # BUY / SELL / NEUTRAL badge
│   ├── ai/
│   │   ├── chat-message.tsx        # Chat bubble (user + AI)
│   │   ├── chat-input.tsx          # Message input with send button
│   │   └── typing-indicator.tsx    # Animated typing dots
│   ├── common/
│   │   ├── loading-skeleton.tsx    # Skeleton placeholders
│   │   └── plan-lock-overlay.tsx   # Upgrade prompt overlay
│   └── ui/                         # shadcn/ui base components
│
├── lib/
│   ├── prisma.ts                   # Prisma client singleton
│   ├── signals-engine.ts           # RSI, EMA, MACD, BB, Stochastic calculations
│   ├── twelve-data.ts              # Market data with multi-provider fallback
│   ├── stripe.ts                   # Stripe client + plan definitions
│   ├── email.ts                    # Nodemailer OTP email sender
│   └── utils.ts                    # Formatting + helper functions
│
├── store/                          # Zustand global state
│   ├── use-watchlist-store.ts
│   ├── use-market-store.ts
│   ├── use-signals-store.ts
│   └── use-ai-store.ts
│
├── types/index.ts                  # Shared TypeScript types
│
├── prisma/
│   ├── schema.prisma               # Full database schema
│   ├── seed.ts                     # Academy modules + sample data
│   └── set-plan.ts                 # CLI utility to change user plan
│
├── auth.ts                         # NextAuth v5 configuration
├── middleware.ts                   # Route protection by plan
├── next.config.js
├── tailwind.config.ts
├── docker-compose.yaml
└── Dockerfile
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL database (or free [Neon.tech](https://neon.tech) account)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd trading-platform
```

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in the values (see [Environment Variables](#environment-variables) section below).

### 4. Set up the database

```bash
npm run db:push      # Push schema to your PostgreSQL database
npm run db:seed      # Seed with trading academy modules and sample data
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app runs without any paid API keys using mock market data.

---

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# ─── Database ─────────────────────────────────────────────────
# Get a free PostgreSQL DB at https://neon.tech
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# ─── NextAuth ─────────────────────────────────────────────────
# Generate with: openssl rand -base64 32
AUTH_SECRET="your-32-char-random-secret"
AUTH_URL="http://localhost:3000"

# ─── Google OAuth ─────────────────────────────────────────────
# https://console.cloud.google.com → Credentials → OAuth 2.0
GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxx"

# ─── Market Data (all optional — mock data used as fallback) ───
TWELVE_DATA_API_KEY=""        # https://twelvedata.com (800 req/day free)
ALPHA_VANTAGE_API_KEY=""      # https://alphavantage.co (25 req/day free)

# ─── AI Advisor ───────────────────────────────────────────────
GEMINI_API_KEY=""             # https://aistudio.google.com/app/apikey
GEMINI_API_KEY2=""            # Optional backup key for rate limiting

# ─── Stripe (optional — required for paid plan subscriptions) ──
STRIPE_SECRET_KEY=""          # sk_test_... or sk_live_...
STRIPE_PRO_PRICE_ID=""        # price_xxx  ($9.99/month product)
STRIPE_PREMIUM_PRICE_ID=""    # price_yyy  ($24.99/month product)
STRIPE_WEBHOOK_SECRET=""      # whsec_...  (from Stripe CLI or dashboard)

# ─── Email (Gmail SMTP) ───────────────────────────────────────
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your@gmail.com"
SMTP_PASS=""                  # Gmail App Password (requires 2FA enabled)
```

---

## API Keys Setup

### Google OAuth (Required for login)

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project → **APIs & Services** → **Credentials**
3. Click **Create Credentials** → **OAuth 2.0 Client ID** → Web application
4. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
5. Copy **Client ID** and **Client Secret** into `.env.local`

---

### Twelve Data (Optional — free tier available)

1. Sign up at [twelvedata.com](https://twelvedata.com)
2. Go to Dashboard → copy your API Key
3. Free tier: **800 requests/day**, 8 requests/minute
4. Without this key, the app uses realistic mock OHLCV data automatically

---

### Google Gemini AI (Required for AI Advisor)

1. Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Click **Create API Key**
3. Add it as `GEMINI_API_KEY` in `.env.local`
4. Optionally add a second key as `GEMINI_API_KEY2` to handle rate limits

> The app tries 6 model/key combinations automatically before failing: gemini-2.5-flash, gemini-2.0-flash, and gemini-2.0-flash-lite, each with both keys.

---

### Stripe Payments (Optional — required for paid plans)

1. Create an account at [stripe.com](https://stripe.com)
2. Go to **Dashboard** → **Products** → Create two subscription products:
   - **TradeOnix Pro** — $9.99/month → copy the **Price ID** (`price_xxx`)
   - **TradeOnix Premium** — $24.99/month → copy the **Price ID** (`price_yyy`)
3. Get your **Secret Key** from Dashboard → Developers → API Keys
4. For local webhook testing, install [Stripe CLI](https://stripe.com/docs/stripe-cli) and run:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the `whsec_...` signing secret into `STRIPE_WEBHOOK_SECRET`.

---

### Gmail SMTP (Required for Email OTP login)

1. Enable **2-Factor Authentication** on your Gmail account
2. Go to Google Account → Security → **App Passwords**
3. Generate a new App Password for "Mail"
4. Use your Gmail address as `SMTP_USER` and the App Password as `SMTP_PASS`

---

## Database Setup

### Available Commands

```bash
npm run db:push       # Sync schema to database (no migration history)
npm run db:migrate    # Create a named migration file
npm run db:studio     # Open Prisma Studio (visual database browser)
npm run db:seed       # Seed with 6 academy modules + sample data
npm run db:generate   # Regenerate Prisma client after schema changes
```

### Database Tables

| Table | Description |
|-------|-------------|
| `User` | User profile, plan (FREE/PRO/PREMIUM), Stripe customer ID |
| `Account` | Google OAuth tokens (managed by NextAuth) |
| `Session` | Active login sessions |
| `EmailOtp` | 6-digit OTP tokens with 10-minute expiry |
| `Subscription` | Stripe subscription status and period tracking |
| `Signal` | Generated trading signals with indicator values |
| `Watchlist` | User-saved trading symbols |
| `LearnModule` | Academy course content (Markdown) + quiz questions |
| `LearnProgress` | Per-user module completion and quiz scores |
| `AiChat` | AI Advisor conversation history |

### Manually Change a User's Plan

```bash
npx tsx prisma/set-plan.ts user@email.com PREMIUM
```

---

## Supported Markets

| Symbol | Pair | Type |
|--------|------|------|
| `EURUSD` | Euro / US Dollar | Forex |
| `GBPUSD` | British Pound / US Dollar | Forex |
| `USDJPY` | US Dollar / Japanese Yen | Forex |
| `BTCUSD` | Bitcoin / US Dollar | Crypto |
| `ETHUSD` | Ethereum / US Dollar | Crypto |
| `XAUUSD` | Gold / US Dollar | Commodity |

---

## Signal Generation Logic

Signals are computed using a **multi-indicator confluence scoring system** inside `lib/signals-engine.ts`.

### Indicators Used

| Indicator | Periods | Plan Required |
|-----------|---------|---------------|
| RSI (Relative Strength Index) | 14 | FREE |
| EMA (Exponential Moving Average) | 12, 20, 26, 50 | FREE |
| MACD | 12/26/9 | PRO |
| Bollinger Bands | 20, ±2σ | PRO |
| Stochastic Oscillator | 14/3/3 | PREMIUM |

### Scoring Table

| Condition | Score |
|-----------|-------|
| RSI < 25 (extremely oversold) | +3 |
| RSI < 35 (oversold) | +2 |
| RSI > 75 (extremely overbought) | −3 |
| RSI > 65 (overbought) | −2 |
| MACD histogram positive | +2 |
| MACD histogram negative | −2 |
| Price near lower Bollinger Band | +2 |
| Price near upper Bollinger Band | −2 |
| EMA bullish crossover | +1 |
| EMA bearish crossover | −1 |

### Signal Thresholds

| Net Score | Signal |
|-----------|--------|
| ≥ 5 | STRONG BUY |
| 3 to 4 | BUY |
| −2 to +2 | NEUTRAL |
| −3 to −4 | SELL |
| ≤ −5 | STRONG SELL |

**Confidence** = `|score| / max_possible_score × 100`

---

## Subscription Plans

| | Free | Pro | Premium |
|--|------|-----|---------|
| **Price** | $0 forever | $9.99/month | $24.99/month |
| **Signals** | RSI only | RSI + MACD + BB | All indicators |
| **Watchlist** | 3 items | 20 items | Unlimited |
| **AI Advisor** | ❌ | ✅ | ✅ |
| **Trading Academy** | ❌ | ✅ | ✅ |
| **Backtesting** | ❌ | ❌ | ✅ |

---

## API Routes Reference

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/send-otp` | Generate & email a 6-digit OTP |
| `GET/POST` | `/api/auth/[...nextauth]` | NextAuth handler (Google OAuth, session) |

### Market Data

| Method | Endpoint | Params | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/market-data` | `symbol`, `interval`, `outputsize` | OHLCV candle data |
| `GET` | `/api/signals` | `symbol` | Generate signals for one or more symbols |

### User Data

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/watchlist` | Get user's watchlist |
| `POST` | `/api/watchlist` | Add a symbol to watchlist |
| `DELETE` | `/api/watchlist` | Remove a symbol from watchlist |

### AI Advisor

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/ai-advisor` | Get last 5 chat conversations |
| `POST` | `/api/ai-advisor` | Send message, receive AI response |
| `DELETE` | `/api/ai-advisor` | Delete one or all chat sessions |

### Learning

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/learn` | Get all modules with user progress |
| `POST` | `/api/learn` | Mark module complete, save quiz score |

### Stripe

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/stripe/checkout` | Create Stripe Checkout session |
| `POST` | `/api/stripe/portal` | Create Stripe Customer Portal session |
| `POST` | `/api/stripe/webhook` | Receive and process Stripe events |

---

## Deployment

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

After deployment:
1. Add all environment variables in the **Vercel Dashboard** → Project → Settings → Environment Variables
2. Update `AUTH_URL` to your production domain (e.g. `https://tradeonix.vercel.app`)
3. Add your production URL to Google OAuth authorized redirect URIs
4. Create a Stripe webhook for your production URL → `https://yourdomain.com/api/stripe/webhook`
5. Run the database seed on production:

```bash
DATABASE_URL="your-prod-db-url" npx tsx prisma/seed.ts
```

### Build for Production

```bash
npm run build    # Build Next.js app
npm start        # Start production server
```

---

## Docker

### Run with Docker Compose

```bash
# Build and start the container
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

The app will be available at `http://localhost:3000`.

### Manual Docker Build

```bash
docker build -t tradeonix .
docker run -p 3000:3000 --env-file .env.local tradeonix
```

The Dockerfile uses a **multi-stage build** (deps → builder → runner) to minimize the final image size.

---

## Development Notes

**Mock market data**
All market data automatically falls back through a provider chain: Twelve Data → Yahoo Finance → Alpha Vantage → Mock data. The app always works even without any API keys.

**Chart rendering**
TradingView Lightweight Charts requires `dynamic(() => import(...), { ssr: false })` to avoid server-side rendering errors, since it accesses `window` on mount.

**Prisma singleton**
`lib/prisma.ts` uses a global singleton pattern to prevent connection pool exhaustion during Next.js hot reloads in development.

**NextAuth v5**
Uses `auth()` server function instead of the older `getServerSession()`. Sessions use the JWT strategy with the Prisma adapter for OAuth account linking.

**Stripe webhook verification**
All webhook events are verified using `stripe.webhooks.constructEvent()` with the `STRIPE_WEBHOOK_SECRET`. Never skip this verification in production.

**AI rate limiting**
The AI Advisor cycles through 6 Gemini model/key combinations automatically on rate limit (HTTP 429) errors, maximizing uptime on free API tiers.

**Route protection**
`middleware.ts` runs on every request and redirects users based on their session plan:
- Not logged in → `/login`
- FREE user accessing PRO feature → `/pricing`
- PRO user accessing PREMIUM feature → `/pricing`

---

## Disclaimer

> **TradeOnix is an educational trading analysis tool. It does not provide financial advice.**
> Trading financial instruments involves significant risk of loss and may not be suitable for all investors.
> Past performance is not indicative of future results.
> Always consult a licensed financial advisor before making any investment decisions.

---

<div align="center">

Built with Next.js · Prisma · Stripe · Google Gemini · TradingView

</div>
