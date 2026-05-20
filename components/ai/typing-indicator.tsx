import { Bot } from 'lucide-react'

export function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-[#00d395]/20 text-[#00d395] flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4" />
      </div>
      <div className="bg-[#1a1f2e] border border-[#1f2937] rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
