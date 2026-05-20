import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const watchlist = await prisma.watchlist.findMany({
    where: { userId: session.user.id },
    orderBy: { addedAt: 'desc' },
  })

  return NextResponse.json({ watchlist })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { symbol, name } = await req.json()

  if (!symbol || !name) {
    return NextResponse.json({ error: 'Symbol and name required' }, { status: 400 })
  }

  const maxItems = session.user.plan === 'PREMIUM' ? 999 : session.user.plan === 'PRO' ? 20 : 3
  const count = await prisma.watchlist.count({ where: { userId: session.user.id } })

  if (count >= maxItems) {
    return NextResponse.json(
      { error: `Watchlist limit reached (${maxItems} for ${session.user.plan} plan)` },
      { status: 403 }
    )
  }

  try {
    const item = await prisma.watchlist.create({
      data: { userId: session.user.id, symbol, name },
    })
    return NextResponse.json({ item }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Symbol already in watchlist' }, { status: 409 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const symbol = searchParams.get('symbol')

  if (!symbol) return NextResponse.json({ error: 'Symbol required' }, { status: 400 })

  await prisma.watchlist.deleteMany({
    where: { userId: session.user.id, symbol },
  })

  return NextResponse.json({ success: true })
}
