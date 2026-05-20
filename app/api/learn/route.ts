import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [modules, progress] = await Promise.all([
    prisma.learnModule.findMany({ orderBy: { order: 'asc' } }),
    prisma.learnProgress.findMany({ where: { userId: session.user.id } }),
  ])

  const progressMap = new Map(progress.map((p) => [p.moduleId, p]))

  const modulesWithProgress = modules.map((m) => ({
    ...m,
    userProgress: progressMap.get(m.id) ?? null,
  }))

  return NextResponse.json({ modules: modulesWithProgress })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { moduleId, score, completed } = await req.json()

  if (!moduleId) return NextResponse.json({ error: 'moduleId required' }, { status: 400 })

  const progress = await prisma.learnProgress.upsert({
    where: { userId_moduleId: { userId: session.user.id, moduleId } },
    create: { userId: session.user.id, moduleId, score, completed: completed ?? false },
    update: { score, completed: completed ?? false },
  })

  return NextResponse.json({ progress })
}
