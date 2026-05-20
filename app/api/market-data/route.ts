import { NextRequest, NextResponse } from 'next/server'
import { fetchTimeSeries } from '@/lib/twelve-data'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const symbol = searchParams.get('symbol') ?? 'EUR/USD'
  const interval = searchParams.get('interval') ?? '1day'
  const outputsize = parseInt(searchParams.get('outputsize') ?? '100', 10)

  try {
    const data = await fetchTimeSeries(symbol, interval, outputsize)
    return NextResponse.json({ data, symbol, interval }, { status: 200 })
  } catch (error) {
    console.error('Market data error:', error)
    return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 })
  }
}
