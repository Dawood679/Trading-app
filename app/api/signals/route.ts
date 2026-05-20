import { NextRequest, NextResponse } from 'next/server'
import { fetchTimeSeries, SUPPORTED_SYMBOLS } from '@/lib/twelve-data'
import { generateSignal } from '@/lib/signals-engine'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const symbol = searchParams.get('symbol')

  const symbols = symbol
    ? [symbol]
    : SUPPORTED_SYMBOLS.map((s) => s.symbol)

  try {
    const results = await Promise.all(
      symbols.map(async (sym) => {
        const candles = await fetchTimeSeries(sym, '1day', 100)
        const closes = candles.map((c) => c.close)
        const signal = generateSignal(sym, closes)
        const price = closes[closes.length - 1] ?? 0

        // Save to DB (best-effort)
        try {
          await prisma.signal.create({
            data: {
              symbol: sym,
              signalType: signal.signalType,
              strategy: signal.strategy,
              confidence: signal.confidence,
              reason: signal.reason,
              hints: signal.hints,
              price,
              rsi: signal.rsi,
              macd: signal.macd,
            },
          })
        } catch {
          // Ignore DB errors for signal creation
        }

        return {
          id: `${sym}-${Date.now()}`,
          symbol: sym,
          signalType: signal.signalType,
          strategy: signal.strategy,
          confidence: signal.confidence,
          reason: signal.reason,
          hints: signal.hints,
          price,
          rsi: signal.rsi,
          macd: signal.macd,
          createdAt: new Date().toISOString(),
        }
      })
    )

    return NextResponse.json({ signals: results }, { status: 200 })
  } catch (error) {
    console.error('Signals error:', error)
    return NextResponse.json({ error: 'Failed to generate signals' }, { status: 500 })
  }
}
