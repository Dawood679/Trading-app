import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'TradeOnix — Trade Smarter, Not Harder',
    template: '%s | TradeOnix',
  },
  description:
    'Real-time trading signals for Forex, Crypto & Commodities — backed by AI analysis, professional charts, and a built-in advisor that actually speaks human. Start free, no card required.',
  keywords: ['trading', 'signals', 'forex', 'crypto', 'technical analysis', 'RSI', 'MACD', 'AI trading', 'backtesting'],
  authors: [{ name: 'TradeOnix' }],
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'TradeOnix — Trade Smarter, Not Harder',
    description: 'Real-time AI-powered trading signals for Forex, Crypto & Commodities. Start free.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-[#0f1117] text-white antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
