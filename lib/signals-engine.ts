import type { SignalType, GeneratedSignal } from '@/types'

// EMA with alpha = 2/(period+1)
export function calculateEMA(prices: number[], period: number): number[] {
  if (prices.length < period) return new Array(prices.length).fill(NaN)

  const k = 2 / (period + 1)
  const result: number[] = new Array(prices.length).fill(NaN)

  // First EMA = SMA of first `period` values
  let sum = 0
  for (let i = 0; i < period; i++) sum += prices[i]
  result[period - 1] = sum / period

  for (let i = period; i < prices.length; i++) {
    result[i] = prices[i] * k + result[i - 1] * (1 - k)
  }

  return result
}

// RSI using Wilder's smoothing (alpha = 1/period)
export function calculateRSI(prices: number[], period = 14): number[] {
  if (prices.length <= period) return new Array(prices.length).fill(NaN)

  const result: number[] = new Array(prices.length).fill(NaN)
  let avgGain = 0
  let avgLoss = 0

  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1]
    if (change > 0) avgGain += change
    else avgLoss += Math.abs(change)
  }
  avgGain /= period
  avgLoss /= period

  result[period] = 100 - 100 / (1 + avgGain / (avgLoss || 0.0001))

  for (let i = period + 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1]
    const gain = change > 0 ? change : 0
    const loss = change < 0 ? Math.abs(change) : 0
    avgGain = (avgGain * (period - 1) + gain) / period
    avgLoss = (avgLoss * (period - 1) + loss) / period
    result[i] = 100 - 100 / (1 + avgGain / (avgLoss || 0.0001))
  }

  return result
}

// MACD = EMA(12) - EMA(26), Signal = EMA(9) of MACD
export function calculateMACD(prices: number[]): {
  macdLine: number[]
  signalLine: number[]
  histogram: number[]
} {
  const ema12 = calculateEMA(prices, 12)
  const ema26 = calculateEMA(prices, 26)

  const macdLine: number[] = prices.map((_, i) => {
    if (isNaN(ema12[i]) || isNaN(ema26[i])) return NaN
    return ema12[i] - ema26[i]
  })

  const validMacd = macdLine.filter((v) => !isNaN(v))
  const macdEma9 = calculateEMA(validMacd, 9)

  const signalLine: number[] = new Array(prices.length).fill(NaN)
  let validIdx = 0
  for (let i = 0; i < prices.length; i++) {
    if (!isNaN(macdLine[i])) {
      if (!isNaN(macdEma9[validIdx])) signalLine[i] = macdEma9[validIdx]
      validIdx++
    }
  }

  const histogram = prices.map((_, i) => {
    if (isNaN(macdLine[i]) || isNaN(signalLine[i])) return NaN
    return macdLine[i] - signalLine[i]
  })

  return { macdLine, signalLine, histogram }
}

// Bollinger Bands: SMA(20) ± 2*stddev
export function calculateBollingerBands(
  prices: number[],
  period = 20,
  stdDevMultiplier = 2
): { upper: number[]; middle: number[]; lower: number[] } {
  const upper: number[] = new Array(prices.length).fill(NaN)
  const middle: number[] = new Array(prices.length).fill(NaN)
  const lower: number[] = new Array(prices.length).fill(NaN)

  for (let i = period - 1; i < prices.length; i++) {
    const slice = prices.slice(i - period + 1, i + 1)
    const sma = slice.reduce((a, b) => a + b, 0) / period
    const variance = slice.reduce((sum, v) => sum + Math.pow(v - sma, 2), 0) / period
    const stdDev = Math.sqrt(variance)

    middle[i] = sma
    upper[i] = sma + stdDevMultiplier * stdDev
    lower[i] = sma - stdDevMultiplier * stdDev
  }

  return { upper, middle, lower }
}

// Stochastic Oscillator
export function calculateStochastic(
  highs: number[],
  lows: number[],
  closes: number[],
  period = 14
): { k: number[]; d: number[] } {
  const k: number[] = new Array(closes.length).fill(NaN)

  for (let i = period - 1; i < closes.length; i++) {
    const high = Math.max(...highs.slice(i - period + 1, i + 1))
    const low = Math.min(...lows.slice(i - period + 1, i + 1))
    k[i] = ((closes[i] - low) / (high - low || 0.0001)) * 100
  }

  const d = calculateEMA(k.filter((v) => !isNaN(v)), 3)
  const dFull: number[] = new Array(closes.length).fill(NaN)
  let dIdx = 0
  for (let i = 0; i < closes.length; i++) {
    if (!isNaN(k[i])) {
      if (!isNaN(d[dIdx])) dFull[i] = d[dIdx]
      dIdx++
    }
  }

  return { k, d: dFull }
}

// Last valid value from array
function last(arr: number[]): number {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (!isNaN(arr[i])) return arr[i]
  }
  return NaN
}

// Generate combined trading signal
export function generateSignal(symbol: string, closes: number[]): GeneratedSignal {
  const MIN_DATA = 35

  if (closes.length < MIN_DATA) {
    return {
      signalType: 'NEUTRAL',
      confidence: 50,
      reason: 'Insufficient data for signal generation',
      strategy: 'N/A',
      hints: ['Need at least 35 data points'],
      rsi: 50,
      macd: 0,
      hasEnoughData: false,
    }
  }

  const rsiArr = calculateRSI(closes)
  const { macdLine, signalLine, histogram } = calculateMACD(closes)
  const { upper, middle, lower } = calculateBollingerBands(closes)

  const rsi = last(rsiArr)
  const macd = last(macdLine)
  const macdSignal = last(signalLine)
  const macdHist = last(histogram)
  const bbUpper = last(upper)
  const bbLower = last(lower)
  const price = closes[closes.length - 1]
  const bbRange = bbUpper - bbLower

  const nearLowerBB = price <= bbLower + bbRange * 0.05
  const nearUpperBB = price >= bbUpper - bbRange * 0.05
  const macdBullish = macdHist > 0
  const macdBearish = macdHist < 0

  let signalType: SignalType = 'NEUTRAL'
  let confidence = 50
  const activeStrategies: string[] = []
  const hints: string[] = []
  let reason = ''

  // Score-based approach for more nuanced signals
  let bullScore = 0
  let bearScore = 0

  // RSI scoring
  if (rsi < 25) { bullScore += 3; hints.push(`RSI extremely oversold (${rsi.toFixed(1)})`) }
  else if (rsi < 35) { bullScore += 2; hints.push(`RSI oversold (${rsi.toFixed(1)})`) }
  else if (rsi < 45) { bullScore += 1; hints.push(`RSI below midline (${rsi.toFixed(1)})`) }
  else if (rsi > 75) { bearScore += 3; hints.push(`RSI extremely overbought (${rsi.toFixed(1)})`) }
  else if (rsi > 65) { bearScore += 2; hints.push(`RSI overbought (${rsi.toFixed(1)})`) }
  else if (rsi > 55) { bearScore += 1; hints.push(`RSI above midline (${rsi.toFixed(1)})`) }

  // MACD scoring
  if (macdBullish) {
    bullScore += 2
    hints.push('MACD histogram positive')
    activeStrategies.push('MACD')
  } else {
    bearScore += 2
    hints.push('MACD histogram negative')
    activeStrategies.push('MACD')
  }

  // Bollinger Band scoring
  if (nearLowerBB) {
    bullScore += 2
    hints.push('Price near lower Bollinger Band')
    activeStrategies.push('Bollinger Bands')
  } else if (nearUpperBB) {
    bearScore += 2
    hints.push('Price near upper Bollinger Band')
    activeStrategies.push('Bollinger Bands')
  }

  // RSI strategy tag
  if (rsi < 40 || rsi > 60) activeStrategies.push('RSI')

  // Determine signal type and confidence
  const netScore = bullScore - bearScore
  const totalScore = bullScore + bearScore

  if (netScore >= 5) {
    signalType = 'STRONG_BUY'
    confidence = Math.min(95, 70 + netScore * 3)
    reason = `Strong bullish confluence: RSI at ${rsi.toFixed(1)}, MACD ${macdBullish ? 'bullish' : 'bearish'}, ${nearLowerBB ? 'price near support' : 'momentum building'}`
  } else if (netScore >= 3) {
    signalType = 'BUY'
    confidence = Math.min(85, 60 + netScore * 4)
    reason = `Bullish setup: RSI at ${rsi.toFixed(1)} with MACD confirmation`
  } else if (netScore <= -5) {
    signalType = 'STRONG_SELL'
    confidence = Math.min(95, 70 + Math.abs(netScore) * 3)
    reason = `Strong bearish confluence: RSI at ${rsi.toFixed(1)}, MACD ${macdBearish ? 'bearish' : 'bullish'}, ${nearUpperBB ? 'price near resistance' : 'momentum fading'}`
  } else if (netScore <= -3) {
    signalType = 'SELL'
    confidence = Math.min(85, 60 + Math.abs(netScore) * 4)
    reason = `Bearish setup: RSI at ${rsi.toFixed(1)} with MACD confirmation`
  } else {
    signalType = 'NEUTRAL'
    confidence = 50
    reason = `Mixed signals: RSI at ${rsi.toFixed(1)}, no strong directional bias`
    hints.push('Wait for clearer setup')
  }

  // Add price context hints
  const bbMiddleLast = last(middle)
  if (price < bbMiddleLast) hints.push('Price below middle BB band')
  else hints.push('Price above middle BB band')

  return {
    signalType,
    confidence: Math.round(confidence),
    reason,
    strategy: activeStrategies.length > 0 ? activeStrategies.join(' + ') : 'Multi-Indicator',
    hints: hints.slice(0, 4),
    rsi: parseFloat(rsi.toFixed(2)),
    macd: parseFloat(macd.toFixed(6)),
    hasEnoughData: true,
  }
}

// Simple backtest engine
export function runBacktest(
  closes: number[],
  dates: string[],
  initialCapital: number,
  strategy: string
): {
  trades: Array<{ date: string; action: 'BUY' | 'SELL'; price: number; quantity: number; pnl: number }>
  equityCurve: Array<{ date: string; equity: number }>
  stats: {
    totalReturn: number
    totalReturnPct: number
    winRate: number
    totalTrades: number
    winningTrades: number
    losingTrades: number
    maxDrawdown: number
    sharpeRatio: number
    finalEquity: number
  }
} {
  const rsiArr = calculateRSI(closes)
  const { histogram } = calculateMACD(closes)
  const { lower } = calculateBollingerBands(closes)

  const trades: Array<{ date: string; action: 'BUY' | 'SELL'; price: number; quantity: number; pnl: number }> = []
  const equityCurve: Array<{ date: string; equity: number }> = []

  let equity = initialCapital
  let position = 0
  let entryPrice = 0
  let peakEquity = initialCapital
  let maxDrawdown = 0
  const returns: number[] = []

  for (let i = 35; i < closes.length; i++) {
    const rsi = rsiArr[i]
    const macdHist = histogram[i]
    const bbLow = lower[i]
    const price = closes[i]

    if (isNaN(rsi) || isNaN(macdHist)) continue

    // Entry signal
    if (position === 0) {
      let shouldBuy = false
      if (strategy === 'RSI') shouldBuy = rsi < 30
      else if (strategy === 'MACD') shouldBuy = macdHist > 0 && histogram[i - 1] < 0
      else if (strategy === 'BB') shouldBuy = price <= bbLow * 1.02
      else shouldBuy = rsi < 35 && macdHist > 0

      if (shouldBuy) {
        const quantity = (equity * 0.95) / price
        position = quantity
        entryPrice = price
        trades.push({ date: dates[i], action: 'BUY', price, quantity, pnl: 0 })
      }
    } else if (position > 0) {
      // Exit signal
      let shouldSell = false
      if (strategy === 'RSI') shouldSell = rsi > 70
      else if (strategy === 'MACD') shouldSell = macdHist < 0 && histogram[i - 1] > 0
      else if (strategy === 'BB') shouldSell = price >= lower[i] + (lower[i] * 0.05)
      else shouldSell = rsi > 65 || macdHist < 0

      if (shouldSell) {
        const pnl = (price - entryPrice) * position
        equity += pnl
        returns.push((price - entryPrice) / entryPrice)
        trades.push({ date: dates[i], action: 'SELL', price, quantity: position, pnl })
        position = 0
        entryPrice = 0
      }
    }

    // Track equity curve
    const currentEquity = position > 0 ? equity - (equity * 0.95) + position * closes[i] : equity
    equityCurve.push({ date: dates[i], equity: parseFloat(currentEquity.toFixed(2)) })

    // Track drawdown
    if (currentEquity > peakEquity) peakEquity = currentEquity
    const drawdown = (peakEquity - currentEquity) / peakEquity
    if (drawdown > maxDrawdown) maxDrawdown = drawdown
  }

  const winningTrades = trades.filter((t) => t.action === 'SELL' && t.pnl > 0).length
  const sellingTrades = trades.filter((t) => t.action === 'SELL').length
  const winRate = sellingTrades > 0 ? (winningTrades / sellingTrades) * 100 : 0

  const avgReturn = returns.length > 0 ? returns.reduce((a, b) => a + b, 0) / returns.length : 0
  const returnStdDev = returns.length > 1
    ? Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length)
    : 0.01
  const sharpeRatio = returnStdDev > 0 ? (avgReturn / returnStdDev) * Math.sqrt(252) : 0

  return {
    trades,
    equityCurve,
    stats: {
      totalReturn: equity - initialCapital,
      totalReturnPct: ((equity - initialCapital) / initialCapital) * 100,
      winRate,
      totalTrades: sellingTrades,
      winningTrades,
      losingTrades: sellingTrades - winningTrades,
      maxDrawdown: maxDrawdown * 100,
      sharpeRatio: parseFloat(sharpeRatio.toFixed(2)),
      finalEquity: parseFloat(equity.toFixed(2)),
    },
  }
}
