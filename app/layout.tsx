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
    default: 'TradingPro — Professional Trading Signals',
    template: '%s | TradingPro',
  },
  description:
    'AI-powered trading signals, real-time market analysis, and professional trading tools for EUR/USD, GBP/USD, BTC/USD, and more.',
  keywords: ['trading', 'signals', 'forex', 'crypto', 'technical analysis', 'RSI', 'MACD'],
  authors: [{ name: 'TradingPro' }],
  openGraph: {
    title: 'TradingPro — Professional Trading Signals',
    description: 'AI-powered trading signals and market analysis',
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
