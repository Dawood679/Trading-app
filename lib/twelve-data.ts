import type { OHLCV } from '@/types'

const TWELVE_DATA_BASE = 'https://api.twelvedata.com'
const ALPHA_VANTAGE_BASE = 'https://www.alphavantage.co/query'
const YAHOO_BASE = 'https://query1.finance.yahoo.com/v8/finance/chart'

// ── Symbol maps ─────────────────────────────────────────────────────────────

// Yahoo Finance symbol mapping
const YAHOO_SYMBOL_MAP: Record<string, string> = {
  'EUR/USD': 'EURUSD=X',
  'GBP/USD': 'GBPUSD=X',
  'USD/JPY': 'USDJPY=X',
  'BTC/USD': 'BTC-USD',
  'ETH/USD': 'ETH-USD',
  'XAU/USD': 'GC=F',
}

// Alpha Vantage — separates forex vs crypto vs commodity
const AV_FOREX: Record<string, { from: string; to: string }> = {
  'EUR/USD': { from: 'EUR', to: 'USD' },
  'GBP/USD': { from: 'GBP', to: 'USD' },
  'USD/JPY': { from: 'USD', to: 'JPY' },
  'XAU/USD': { from: 'XAU', to: 'USD' },
}
const AV_CRYPTO: Record<string, string> = {
  'BTC/USD': 'BTC',
  'ETH/USD': 'ETH',
}

// Twelve Data symbol map (already 1:1 but kept for clarity)
const TD_SYMBOL_MAP: Record<string, string> = {
  'EUR/USD': 'EUR/USD',
  'GBP/USD': 'GBP/USD',
  'USD/JPY': 'USD/JPY',
  'BTC/USD': 'BTC/USD',
  'ETH/USD': 'ETH/USD',
  'XAU/USD': 'XAU/USD',
}

// ── Mock data (last resort) ──────────────────────────────────────────────────

function generateMockData(symbol: string, bars = 100): OHLCV[] {
  const basePrice: Record<string, number> = {
    'EUR/USD': 1.085,
    'GBP/USD': 1.27,
    'USD/JPY': 154.3,
    'BTC/USD': 67500,
    'ETH/USD': 3520,
    'XAU/USD': 2315,
  }
  const volatility: Record<string, number> = {
    'EUR/USD': 0.003,
    'GBP/USD': 0.004,
    'USD/JPY': 0.005,
    'BTC/USD': 0.025,
    'ETH/USD': 0.03,
    'XAU/USD': 0.008,
  }

  const base = basePrice[symbol] ?? 100
  const vol = volatility[symbol] ?? 0.01
  const dp = symbol.includes('JPY') ? 3 : (symbol.includes('BTC') || symbol.includes('ETH') || symbol.includes('XAU')) ? 2 : 5

  const data: OHLCV[] = []
  let price = base
  const now = new Date()

  for (let i = bars - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const change = (Math.random() - 0.48) * vol
    const open = price
    price = price * (1 + change)
    const close = price
    const highExtra = Math.abs(Math.random() * vol * 0.5) * price
    const lowExtra = Math.abs(Math.random() * vol * 0.5) * price
    data.push({
      time: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(dp)),
      high: parseFloat((Math.max(open, close) + highExtra).toFixed(dp)),
      low: parseFloat((Math.min(open, close) - lowExtra).toFixed(dp)),
      close: parseFloat(close.toFixed(dp)),
      volume: Math.floor(Math.random() * 1_000_000 + 100_000),
    })
  }
  return data
}

// ── Interval helpers ─────────────────────────────────────────────────────────

function mapInterval(interval: string): string {
  const map: Record<string, string> = {
    '1m': '1min', '5m': '5min', '15m': '15min',
    '1h': '1h', '4h': '4h', '1D': '1day', '1day': '1day',
  }
  return map[interval] ?? '1day'
}

function getOutputSize(tdInterval: string): number {
  const map: Record<string, number> = {
    '1min': 500, '5min': 500, '15min': 200,
    '1h': 200, '4h': 150, '1day': 100,
  }
  return map[tdInterval] ?? 100
}

// Yahoo Finance range string based on interval
function yahooRange(tdInterval: string): string {
  if (tdInterval === '1min' || tdInterval === '5min') return '5d'
  if (tdInterval === '15min' || tdInterval === '1h') return '1mo'
  if (tdInterval === '4h') return '3mo'
  return '6mo'
}

function yahooInterval(tdInterval: string): string {
  const map: Record<string, string> = {
    '1min': '1m', '5min': '5m', '15min': '15m',
    '1h': '1h', '4h': '1h', '1day': '1d',
  }
  return map[tdInterval] ?? '1d'
}

// ── Provider 1: Twelve Data ──────────────────────────────────────────────────

async function fetchFromTwelveData(
  symbol: string,
  tdInterval: string,
  size: number,
): Promise<OHLCV[] | null> {
  const apiKey = process.env.TWELVE_DATA_API_KEY
  if (!apiKey) return null

  try {
    const url = `${TWELVE_DATA_BASE}/time_series?symbol=${encodeURIComponent(TD_SYMBOL_MAP[symbol] ?? symbol)}&interval=${tdInterval}&outputsize=${size}&apikey=${apiKey}`
    const res = await fetch(url, { next: { revalidate: 30 } })
    if (!res.ok) return null

    const data = await res.json()
    if (data.status === 'error' || !data.values) return null

    return (data.values as Array<Record<string, string>>)
      .reverse()
      .map((v) => ({
        time: v.datetime.split(' ')[0],
        open: parseFloat(v.open),
        high: parseFloat(v.high),
        low: parseFloat(v.low),
        close: parseFloat(v.close),
        volume: parseInt(v.volume ?? '0', 10),
      }))
  } catch {
    return null
  }
}

// ── Provider 2: Yahoo Finance (no API key needed) ────────────────────────────

async function fetchFromYahoo(
  symbol: string,
  tdInterval: string,
  size: number,
): Promise<OHLCV[] | null> {
  const yahooSymbol = YAHOO_SYMBOL_MAP[symbol]
  if (!yahooSymbol) return null

  try {
    const interval = yahooInterval(tdInterval)
    const range = yahooRange(tdInterval)
    const url = `${YAHOO_BASE}/${yahooSymbol}?interval=${interval}&range=${range}&includePrePost=false`

    const res = await fetch(url, {
      next: { revalidate: 30 },
      headers: { 'User-Agent': 'Mozilla/5.0' },
    })
    if (!res.ok) return null

    const json = await res.json()
    const result = json?.chart?.result?.[0]
    if (!result) return null

    const timestamps: number[] = result.timestamp ?? []
    const quote = result.indicators?.quote?.[0]
    if (!quote || timestamps.length === 0) return null

    const { open, high, low, close, volume } = quote as Record<string, (number | null)[]>
    const dp = symbol.includes('JPY') ? 3 : (symbol.includes('BTC') || symbol.includes('ETH') || symbol.includes('XAU')) ? 2 : 5

    const bars: OHLCV[] = []
    for (let i = 0; i < timestamps.length; i++) {
      if (close[i] == null || open[i] == null) continue
      bars.push({
        time: new Date(timestamps[i] * 1000).toISOString().split('T')[0],
        open: parseFloat((open[i]!).toFixed(dp)),
        high: parseFloat((high[i]!).toFixed(dp)),
        low: parseFloat((low[i]!).toFixed(dp)),
        close: parseFloat((close[i]!).toFixed(dp)),
        volume: volume?.[i] ?? 0,
      })
    }

    // Remove duplicate dates, keep last, sort ascending
    const deduped = Object.values(
      Object.fromEntries(bars.map((b) => [b.time, b]))
    ).sort((a, b) => (a.time as string).localeCompare(b.time as string))

    return deduped.slice(-size)
  } catch {
    return null
  }
}

// ── Provider 3: Alpha Vantage (free tier: 25 req/day) ───────────────────────

async function fetchFromAlphaVantage(
  symbol: string,
  size: number,
): Promise<OHLCV[] | null> {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY
  if (!apiKey) return null

  try {
    let url: string
    const dp = symbol.includes('JPY') ? 3 : (symbol.includes('BTC') || symbol.includes('ETH') || symbol.includes('XAU')) ? 2 : 5

    if (AV_CRYPTO[symbol]) {
      url = `${ALPHA_VANTAGE_BASE}?function=DIGITAL_CURRENCY_DAILY&symbol=${AV_CRYPTO[symbol]}&market=USD&apikey=${apiKey}`
    } else if (AV_FOREX[symbol]) {
      const { from, to } = AV_FOREX[symbol]
      url = `${ALPHA_VANTAGE_BASE}?function=FX_DAILY&from_symbol=${from}&to_symbol=${to}&outputsize=compact&apikey=${apiKey}`
    } else {
      return null
    }

    const res = await fetch(url, { next: { revalidate: 60 } })
    if (!res.ok) return null

    const data = await res.json()

    // Alpha Vantage returns Note if rate-limited
    if (data.Note || data.Information) return null

    let timeSeries: Record<string, Record<string, string>> | undefined

    if (AV_CRYPTO[symbol]) {
      timeSeries = data['Time Series (Digital Currency Daily)']
    } else {
      timeSeries = data['Time Series FX (Daily)']
    }

    if (!timeSeries) return null

    const bars = Object.entries(timeSeries)
      .map(([date, v]) => ({
        time: date,
        open: parseFloat(v['1. open'] ?? v['1a. open (USD)'] ?? '0'),
        high: parseFloat(v['2. high'] ?? v['2a. high (USD)'] ?? '0'),
        low: parseFloat(v['3. low'] ?? v['3a. low (USD)'] ?? '0'),
        close: parseFloat(v['4. close'] ?? v['4a. close (USD)'] ?? '0'),
        volume: parseInt(v['5. volume'] ?? '0', 10),
      }))
      .map((b) => ({
        ...b,
        open: parseFloat(b.open.toFixed(dp)),
        high: parseFloat(b.high.toFixed(dp)),
        low: parseFloat(b.low.toFixed(dp)),
        close: parseFloat(b.close.toFixed(dp)),
      }))
      .sort((a, b) => String(a.time).localeCompare(String(b.time)))
      .slice(-size)

    return bars
  } catch {
    return null
  }
}

// ── Main export: tries all providers in order ────────────────────────────────

export async function fetchTimeSeries(
  symbol: string,
  interval = '1day',
  outputsize?: number,
): Promise<OHLCV[]> {
  const tdInterval = mapInterval(interval)
  const size = outputsize ?? getOutputSize(tdInterval)

  // 1️⃣ Twelve Data
  const tdData = await fetchFromTwelveData(symbol, tdInterval, size)
  if (tdData && tdData.length >= 10) {
    console.log(`[market-data] ${symbol} — Twelve Data ✓`)
    return tdData
  }

  // 2️⃣ Yahoo Finance
  const yahooData = await fetchFromYahoo(symbol, tdInterval, size)
  if (yahooData && yahooData.length >= 10) {
    console.log(`[market-data] ${symbol} — Yahoo Finance ✓ (fallback)`)
    return yahooData
  }

  // 3️⃣ Alpha Vantage (daily only)
  if (tdInterval === '1day') {
    const avData = await fetchFromAlphaVantage(symbol, size)
    if (avData && avData.length >= 10) {
      console.log(`[market-data] ${symbol} — Alpha Vantage ✓ (fallback)`)
      return avData
    }
  }

  // 4️⃣ Mock data (guaranteed fallback)
  console.warn(`[market-data] ${symbol} — all APIs failed, using mock data`)
  return generateMockData(symbol, size)
}

// ── Current price: same fallback chain ───────────────────────────────────────

export async function getCurrentPrice(symbol: string): Promise<number> {
  // Try Twelve Data first
  const apiKey = process.env.TWELVE_DATA_API_KEY
  if (apiKey) {
    try {
      const url = `${TWELVE_DATA_BASE}/price?symbol=${encodeURIComponent(TD_SYMBOL_MAP[symbol] ?? symbol)}&apikey=${apiKey}`
      const res = await fetch(url, { next: { revalidate: 15 } })
      const data = await res.json()
      const price = parseFloat(data.price ?? '0')
      if (price > 0) return price
    } catch { /* fall through */ }
  }

  // Try Yahoo Finance for current price
  const yahooSymbol = YAHOO_SYMBOL_MAP[symbol]
  if (yahooSymbol) {
    try {
      const url = `${YAHOO_BASE}/${yahooSymbol}?interval=1m&range=1d`
      const res = await fetch(url, {
        next: { revalidate: 15 },
        headers: { 'User-Agent': 'Mozilla/5.0' },
      })
      const json = await res.json()
      const meta = json?.chart?.result?.[0]?.meta
      const price = parseFloat(meta?.regularMarketPrice ?? '0')
      if (price > 0) return price
    } catch { /* fall through */ }
  }

  // Mock price
  const basePrice: Record<string, number> = {
    'EUR/USD': 1.085, 'GBP/USD': 1.27, 'USD/JPY': 154.3,
    'BTC/USD': 67500, 'ETH/USD': 3520, 'XAU/USD': 2315,
  }
  const base = basePrice[symbol] ?? 100
  const vol = base * 0.001
  return base + (Math.random() - 0.5) * vol
}

export const SUPPORTED_SYMBOLS = [
  { symbol: 'EUR/USD', name: 'Euro / US Dollar',            flag: '🇪🇺', type: 'forex'     as const },
  { symbol: 'GBP/USD', name: 'British Pound / US Dollar',   flag: '🇬🇧', type: 'forex'     as const },
  { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen',    flag: '🇯🇵', type: 'forex'     as const },
  { symbol: 'BTC/USD', name: 'Bitcoin / US Dollar',         flag: '₿',   type: 'crypto'    as const },
  { symbol: 'ETH/USD', name: 'Ethereum / US Dollar',        flag: 'Ξ',   type: 'crypto'    as const },
  { symbol: 'XAU/USD', name: 'Gold / US Dollar',            flag: '🥇',  type: 'commodity' as const },
]
