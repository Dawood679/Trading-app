import { create } from 'zustand'
import toast from 'react-hot-toast'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
}

interface AIState {
  messages: Message[]
  isTyping: boolean
  sessionSymbol: string | null
  chatId: string | null

  sendMessage: (content: string) => Promise<void>
  setSymbol: (symbol: string) => void
  clearHistory: () => void
  addMessage: (msg: Omit<Message, 'id' | 'createdAt'>) => Message
}

export const useAIStore = create<AIState>((set, get) => ({
  messages: [],
  isTyping: false,
  sessionSymbol: null,
  chatId: null,

  addMessage: (msg) => {
    const message: Message = {
      ...msg,
      id: `msg-${Date.now()}-${Math.random()}`,
      createdAt: new Date(),
    }
    set((state) => ({ messages: [...state.messages, message] }))
    return message
  },

  sendMessage: async (content) => {
    const userMsg = get().addMessage({ role: 'user', content })
    set({ isTyping: true })

    try {
      const allMessages = get().messages.map((m) => ({ role: m.role, content: m.content }))

      const res = await fetch('/api/ai-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: allMessages,
          symbol: get().sessionSymbol,
          chatId: get().chatId,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to get response')
      }

      const { content: assistantContent } = await res.json()
      get().addMessage({ role: 'assistant', content: assistantContent })
    } catch (error: any) {
      toast.error(error.message ?? 'AI Advisor unavailable')
      // Remove the user message on failure
      set((state) => ({ messages: state.messages.filter((m) => m.id !== userMsg.id) }))
    } finally {
      set({ isTyping: false })
    }
  },

  setSymbol: (symbol) => set({ sessionSymbol: symbol }),

  clearHistory: () => set({ messages: [], chatId: null }),
}))
