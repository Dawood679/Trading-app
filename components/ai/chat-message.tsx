import { Bot, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  createdAt?: Date
}

export function ChatMessage({ role, content, createdAt }: ChatMessageProps) {
  const isUser = role === 'user'

  return (
    <div className={cn('flex gap-3', isUser && 'flex-row-reverse')}>
      {/* Avatar */}
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
          isUser
            ? 'bg-[#3b82f6]/20 text-[#3b82f6]'
            : 'bg-[#00d395]/20 text-[#00d395]'
        )}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
          isUser
            ? 'bg-[#3b82f6] text-white rounded-tr-sm'
            : 'bg-[#1a1f2e] border border-[#1f2937] text-gray-200 rounded-tl-sm'
        )}
      >
        {/* Render markdown-like formatting */}
        <div
          className="whitespace-pre-wrap"
          dangerouslySetInnerHTML={{
            __html: content
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>')
              .replace(/`(.*?)`/g, '<code class="bg-black/30 px-1 rounded text-xs font-mono">$1</code>')
              .replace(/^- (.*)/gm, '• $1')
              .replace(/^#{1,3} (.*)/gm, '<strong class="text-base">$1</strong>'),
          }}
        />
        {createdAt && (
          <p className={cn('text-[10px] mt-1.5', isUser ? 'text-blue-200' : 'text-gray-500')}>
            {createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </div>
  )
}
