import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { GoogleGenerativeAI } from '@google/generative-ai'

type Message = { role: 'user' | 'assistant'; content: string }

// All confirmed free Gemini models (newest first)
// Each key × each model = separate quota bucket
const GEMINI_ATTEMPTS = [
  { keyEnv: 'GEMINI_API_KEY',  model: 'gemini-2.5-flash-preview-05-20' },
  { keyEnv: 'GEMINI_API_KEY2', model: 'gemini-2.5-flash-preview-05-20' },
  { keyEnv: 'GEMINI_API_KEY',  model: 'gemini-2.0-flash'               },
  { keyEnv: 'GEMINI_API_KEY2', model: 'gemini-2.0-flash'               },
  { keyEnv: 'GEMINI_API_KEY',  model: 'gemini-2.0-flash-lite'          },
  { keyEnv: 'GEMINI_API_KEY2', model: 'gemini-2.0-flash-lite'          },
]

function buildSystemPrompt(watchlistSymbols: string, symbol: string | null, plan: string) {
  return `You are TradingPro's AI Trading Advisor — a professional technical analyst and trading mentor.

Current context:
- User's watchlist: ${watchlistSymbols}
- Active symbol: ${symbol ?? 'General market discussion'}
- User plan: ${plan}

Your role:
- Provide actionable, professional trading insights based on technical analysis
- Explain RSI, MACD, Bollinger Bands, EMA crossovers, and other indicators clearly
- Discuss entry/exit strategies, risk management, and position sizing
- Analyze market conditions and potential setups
- Keep responses concise, structured with bullet points where appropriate
- Always mention risk management and that trading involves risk
- Do not provide specific financial advice or guarantees of profit

Be professional, educational, and helpful. Format responses with markdown when it aids clarity.`
}

async function callGemini(systemPrompt: string, messages: Message[]): Promise<{ text: string; model: string } | null> {
  for (const { keyEnv, model: modelName } of GEMINI_ATTEMPTS) {
    const key = process.env[keyEnv]
    if (!key) continue

    try {
      const client = new GoogleGenerativeAI(key)
      const model = client.getGenerativeModel({
        model: modelName,
        systemInstruction: systemPrompt,
      })

      const history = messages.slice(0, -1).map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }))

      const lastMessage = messages[messages.length - 1]
      const chat = model.startChat({ history })
      const result = await chat.sendMessage(lastMessage.content)
      const text = result.response.text()

      if (text) {
        console.log(`[ai-advisor] ✓ ${modelName} (${keyEnv})`)
        return { text, model: modelName }
      }
    } catch (err: any) {
      const status = err?.message?.match(/\[(\d{3})/)?.[1] ?? '?'
      console.warn(`[ai-advisor] ✗ ${modelName} (${keyEnv}) → ${status}`)
      // 429 = rate limit → try next combo
      // 404 = model not available → try next combo
    }
  }

  return null
}

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (session.user.plan === 'FREE') {
    return NextResponse.json({ error: 'Pro plan required' }, { status: 403 })
  }

  const chats = await prisma.aiChat.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  return NextResponse.json({ chats })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (session.user.plan === 'FREE') {
    return NextResponse.json(
      { error: 'Pro plan required — upgrade to use AI Advisor' },
      { status: 403 }
    )
  }

  const { messages, symbol, chatId } = await req.json()

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'Messages required' }, { status: 400 })
  }

  const watchlist = await prisma.watchlist.findMany({
    where: { userId: session.user.id },
    take: 10,
  })

  const watchlistSymbols = watchlist.map((w) => w.symbol).join(', ') || 'None'
  const systemPrompt = buildSystemPrompt(watchlistSymbols, symbol ?? null, session.user.plan)

  const result = await callGemini(systemPrompt, messages.slice(-10))

  if (!result) {
    return NextResponse.json(
      { error: 'All AI models are rate-limited. Please try again in a minute.' },
      { status: 503 }
    )
  }

  // Save chat history
  try {
    if (chatId) {
      await prisma.aiChat.update({
        where: { id: chatId },
        data: { messages, updatedAt: new Date() },
      })
    } else {
      await prisma.aiChat.create({
        data: {
          userId: session.user.id,
          messages: [...messages, { role: 'assistant', content: result.text }],
          symbol: symbol ?? null,
        },
      })
    }
  } catch (err) {
    console.error('[ai-advisor] DB save error:', err)
  }

  return NextResponse.json({ content: result.text, provider: result.model })
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const chatId = searchParams.get('chatId')

  if (chatId) {
    await prisma.aiChat.deleteMany({ where: { id: chatId, userId: session.user.id } })
  } else {
    await prisma.aiChat.deleteMany({ where: { userId: session.user.id } })
  }

  return NextResponse.json({ success: true })
}
