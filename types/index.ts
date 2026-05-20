export type Plan = 'FREE' | 'PRO' | 'PREMIUM'

export type SignalType = 'STRONG_BUY' | 'BUY' | 'NEUTRAL' | 'SELL' | 'STRONG_SELL'

export interface OHLCV {
  time: string | number
  open: number
  high: number
  low: number
  close: number
  volume?: number
}

export interface Signal {
  id: string
  symbol: string
  signalType: SignalType
  strategy: string
  confidence: number
  reason: string
  hints: string[]
  price: number
  rsi: number
  macd: number
  createdAt: string | Date
}

export interface GeneratedSignal {
  signalType: SignalType
  confidence: number
  reason: string
  strategy: string
  hints: string[]
  rsi: number
  macd: number
  hasEnoughData: boolean
}

export interface WatchlistItem {
  id: string
  symbol: string
  name: string
  addedAt: string | Date
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
}

export interface BacktestParams {
  symbol: string
  strategy: string
  startDate: string
  endDate: string
  initialCapital: number
}

export interface BacktestTrade {
  date: string
  action: 'BUY' | 'SELL'
  price: number
  quantity: number
  pnl: number
}

export interface BacktestResult {
  totalReturn: number
  totalReturnPct: number
  winRate: number
  totalTrades: number
  winningTrades: number
  losingTrades: number
  maxDrawdown: number
  sharpeRatio: number
  trades: BacktestTrade[]
  equityCurve: { date: string; equity: number }[]
  finalEquity: number
}

export interface LearnModule {
  id: string
  title: string
  description: string
  difficulty: string
  duration: number
  content: string
  order: number
  isPremium: boolean
  requiredPlan: Plan
  quiz: QuizData
  createdAt: Date
  progress?: LearnProgress[]
}

export interface QuizQuestion {
  question: string
  options: string[]
  answer: number
}

export interface QuizData {
  questions: QuizQuestion[]
}

export interface LearnProgress {
  id: string
  userId: string
  moduleId: string
  completed: boolean
  score: number | null
  createdAt: Date
}

export interface MarketSymbol {
  symbol: string
  name: string
  flag: string
  type: 'forex' | 'crypto' | 'commodity'
  twelveDataSymbol: string
}

export interface PricingPlan {
  name: Plan
  displayName: string
  price: number
  priceId?: string
  description: string
  features: string[]
  highlighted?: boolean
}

export interface IndicatorValues {
  rsi: number
  macd: number
  macdSignal: number
  macdHistogram: number
  bbUpper: number
  bbMiddle: number
  bbLower: number
  ema20: number
  ema50: number
}

export interface StatsCard {
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: string
}
