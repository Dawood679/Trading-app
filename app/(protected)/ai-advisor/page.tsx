'use client'

import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { Bot, Trash2, Sparkles } from 'lucide-react'
import { ChatMessage } from '@/components/ai/chat-message'
import { ChatInput } from '@/components/ai/chat-input'
import { TypingIndicator } from '@/components/ai/typing-indicator'
import { Button } from '@/components/ui/button'
import { useAIStore } from '@/store/use-ai-store'
import { PlanLockOverlay } from '@/components/common/plan-lock-overlay'
import Link from 'next/link'
import { SUPPORTED_SYMBOLS } from '@/lib/twelve-data'

const EXAMPLE_PROMPTS = [
  'What does a bullish MACD crossover mean?',
  'Explain RSI divergence with an example',
  'How do I set a stop loss for EUR/USD?',
  'What is the best strategy for trending markets?',
  'Explain Bollinger Band squeeze',
]

export default function AIAdvisorPage() {
  const { data: session } = useSession()
  const { messages, isTyping, sessionSymbol, sendMessage, setSymbol, clearHistory } = useAIStore()
  const bottomRef = useRef<HTMLDivElement>(null)

  const isPro = session?.user.plan === 'PRO' || session?.user.plan === 'PREMIUM'

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  if (!isPro) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <div className="bg-[#1a1f2e] border border-[#1f2937] rounded-2xl p-12 relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-[#3b82f6]/20 flex items-center justify-center mx-auto mb-6">
            <Bot className="w-8 h-8 text-[#3b82f6]" />
          </div>
          <h2 className="text-2xl font-bold mb-3">AI Trading Advisor</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Get instant AI-powered trading analysis powered by Claude. Ask about strategies, signals, risk management, and more.
          </p>
          <Link href="/pricing?upgrade=pro">
            <Button variant="gradient" size="lg" className="gap-2">
              <Sparkles className="w-4 h-4" />
              Upgrade to Pro to Unlock
            </Button>
          </Link>
          <p className="text-xs text-gray-600 mt-4">Pro plan · $9.99/month</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#1f2937] mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00d395]/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-[#00d395]" />
          </div>
          <div>
            <h1 className="text-lg font-bold">AI Trading Advisor</h1>
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00d395] animate-pulse" />
              Powered by Claude · {session?.user?.plan}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Symbol context */}
          <select
            value={sessionSymbol ?? ''}
            onChange={(e) => setSymbol(e.target.value)}
            className="bg-[#0f1117] border border-[#1f2937] rounded-lg text-xs text-white px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
          >
            <option value="">General context</option>
            {SUPPORTED_SYMBOLS.map((s) => (
              <option key={s.symbol} value={s.symbol}>{s.flag} {s.symbol}</option>
            ))}
          </select>

          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearHistory}
              className="h-8 w-8"
              title="Clear chat"
            >
              <Trash2 className="w-3.5 h-3.5 text-gray-500" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-2">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 rounded-full bg-[#00d395]/10 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-[#00d395]" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Ask me anything about trading</h3>
            <p className="text-sm text-gray-400 mb-8 max-w-md">
              I can analyze signals, explain strategies, help with risk management, and discuss market conditions.
            </p>
            <div className="grid sm:grid-cols-2 gap-2 w-full max-w-xl">
              {EXAMPLE_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="text-left text-xs text-gray-400 px-4 py-3 bg-[#1a1f2e] border border-[#1f2937] rounded-lg hover:border-[#374151] hover:text-white transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                role={msg.role}
                content={msg.content}
                createdAt={msg.createdAt}
              />
            ))}
            {isTyping && <TypingIndicator />}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="pt-4 border-t border-[#1f2937]">
        <ChatInput
          onSend={sendMessage}
          disabled={isTyping}
          placeholder={
            sessionSymbol
              ? `Ask about ${sessionSymbol} trading setups...`
              : 'Ask about trading strategies, signals, or market analysis...'
          }
        />
        <p className="text-[10px] text-gray-600 mt-2 text-center">
          AI responses are for educational purposes only. Always do your own research.
        </p>
      </div>
    </div>
  )
}
