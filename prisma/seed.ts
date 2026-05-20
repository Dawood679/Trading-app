import { PrismaClient, Plan, SignalType } from '@prisma/client'

const prisma = new PrismaClient()

const learnModules = [
  {
    title: 'Introduction to Technical Analysis',
    description: 'Learn the fundamentals of reading price charts and identifying key patterns.',
    difficulty: 'Beginner',
    duration: 15,
    order: 1,
    isPremium: false,
    requiredPlan: Plan.FREE,
    content: `# Introduction to Technical Analysis

Technical analysis is the study of historical price and volume data to forecast future price movements. Unlike fundamental analysis, which examines a company's financials, technical analysis focuses purely on price action.

## Key Concepts

### 1. Price Charts
Price charts are the foundation of technical analysis. The most common types are:
- **Line Chart**: Plots closing prices over time
- **Bar Chart**: Shows open, high, low, and close (OHLC)
- **Candlestick Chart**: Visual representation of OHLC data with color coding

### 2. Support and Resistance
Support is a price level where buying pressure prevents further decline. Resistance is where selling pressure halts upward movement.

**Key points:**
- Support becomes resistance once broken
- Stronger the level, more reliable the bounce
- Round numbers often act as psychological S/R levels

### 3. Trend Analysis
Markets move in three directions:
1. **Uptrend**: Series of higher highs and higher lows
2. **Downtrend**: Series of lower highs and lower lows
3. **Sideways**: Consolidation between support and resistance

### 4. Volume
Volume confirms price movements:
- Rising price + rising volume = strong uptrend
- Rising price + falling volume = weak uptrend (potential reversal)
- Falling price + rising volume = strong downtrend

## Reading Candlestick Patterns

**Bullish patterns:**
- Hammer: Small body, long lower wick — reversal signal at bottom
- Bullish Engulfing: Large green candle engulfs previous red candle
- Morning Star: Three-candle reversal pattern

**Bearish patterns:**
- Shooting Star: Small body, long upper wick — reversal signal at top
- Bearish Engulfing: Large red candle engulfs previous green candle
- Evening Star: Three-candle bearish reversal

## Practical Application

When analyzing any chart:
1. Identify the overall trend (zoom out to daily/weekly)
2. Find key support and resistance levels
3. Look for candlestick patterns at key levels
4. Confirm with volume
5. Plan your entry, stop loss, and take profit`,
    quiz: {
      questions: [
        {
          question: 'What does a hammer candlestick pattern indicate?',
          options: ['Continuation of downtrend', 'Potential reversal at the bottom', 'Strong uptrend', 'Market consolidation'],
          answer: 1
        },
        {
          question: 'In an uptrend, what do we expect to see?',
          options: ['Lower highs and lower lows', 'Higher highs and higher lows', 'Equal highs and lows', 'Random price movement'],
          answer: 1
        },
        {
          question: 'What happens when support level is broken?',
          options: ['It becomes stronger', 'It becomes resistance', 'Market rallies', 'Volume decreases'],
          answer: 1
        },
        {
          question: 'Rising price with falling volume indicates:',
          options: ['Strong uptrend', 'Potential reversal signal', 'Strong downtrend', 'Breakout confirmation'],
          answer: 1
        },
        {
          question: 'Which chart type shows OHLC data with color coding?',
          options: ['Line chart', 'Bar chart', 'Candlestick chart', 'Point and figure'],
          answer: 2
        }
      ]
    }
  },
  {
    title: 'RSI — Relative Strength Index',
    description: 'Master the RSI indicator to identify overbought and oversold conditions.',
    difficulty: 'Beginner',
    duration: 20,
    order: 2,
    isPremium: false,
    requiredPlan: Plan.FREE,
    content: `# RSI — Relative Strength Index

The Relative Strength Index (RSI) is a momentum oscillator that measures the speed and magnitude of recent price changes to evaluate overbought or oversold conditions.

## How RSI Works

RSI oscillates between 0 and 100. It was developed by J. Welles Wilder Jr. in 1978.

**Formula:**
\`\`\`
RSI = 100 - [100 / (1 + RS)]
RS = Average Gain / Average Loss (over 14 periods)
\`\`\`

## Interpretation

| RSI Value | Signal |
|-----------|--------|
| > 70 | Overbought — potential sell signal |
| 50-70 | Bullish momentum |
| 30-50 | Bearish momentum |
| < 30 | Oversold — potential buy signal |

## Key RSI Signals

### 1. Overbought/Oversold
- RSI > 70: Market may be overextended to the upside
- RSI < 30: Market may be overextended to the downside
- In strong trends, RSI can stay overbought/oversold for extended periods

### 2. RSI Divergence (Most Powerful Signal)
**Bullish Divergence:**
- Price makes lower lows
- RSI makes higher lows
- Indicates weakening selling pressure → potential reversal up

**Bearish Divergence:**
- Price makes higher highs
- RSI makes lower highs
- Indicates weakening buying pressure → potential reversal down

### 3. RSI Centerline Crossover
- RSI crosses above 50: Bullish momentum shift
- RSI crosses below 50: Bearish momentum shift

## Trading with RSI

**Strategy 1: Simple Overbought/Oversold**
1. Wait for RSI to drop below 30 (oversold)
2. Enter long when RSI crosses back above 30
3. Set stop loss below recent swing low
4. Take profit when RSI reaches 70

**Strategy 2: RSI Divergence**
1. Identify price making new lows/highs
2. Check if RSI confirms or diverges
3. Divergence = high probability reversal signal
4. Enter on confirmation (break of trend line, pattern, etc.)

## Common Mistakes
- Trading RSI signals in isolation without trend context
- Entering immediately on oversold/overbought (wait for confirmation)
- Using default 14-period for all timeframes (shorter = more sensitive)`,
    quiz: {
      questions: [
        {
          question: 'What RSI value indicates an overbought condition?',
          options: ['Below 30', 'Above 50', 'Above 70', 'Between 40-60'],
          answer: 2
        },
        {
          question: 'What is bullish RSI divergence?',
          options: ['Price up, RSI up', 'Price makes lower lows, RSI makes higher lows', 'RSI above 70', 'Price and RSI both declining'],
          answer: 1
        },
        {
          question: 'What is the default RSI period?',
          options: ['9', '14', '20', '26'],
          answer: 1
        },
        {
          question: 'RSI crossing above 50 indicates:',
          options: ['Overbought condition', 'Bullish momentum shift', 'Bearish reversal', 'Market consolidation'],
          answer: 1
        },
        {
          question: 'In a strong uptrend, RSI can:',
          options: ['Only reach 70', 'Stay oversold for long periods', 'Stay overbought for extended periods', 'Never exceed 80'],
          answer: 2
        }
      ]
    }
  },
  {
    title: 'MACD — Moving Average Convergence Divergence',
    description: 'Learn how to use MACD for trend following and momentum trading.',
    difficulty: 'Intermediate',
    duration: 25,
    order: 3,
    isPremium: false,
    requiredPlan: Plan.PRO,
    content: `# MACD — Moving Average Convergence Divergence

MACD is a trend-following momentum indicator that shows the relationship between two exponential moving averages of a security's price.

## Components

**Three elements:**
1. **MACD Line**: EMA(12) - EMA(26)
2. **Signal Line**: EMA(9) of MACD Line
3. **Histogram**: MACD Line - Signal Line

## Reading MACD

### Signal Line Crossovers
- **Bullish**: MACD crosses above Signal Line → buy signal
- **Bearish**: MACD crosses below Signal Line → sell signal

### Zero Line Crossovers
- MACD crosses above zero: trend turning bullish
- MACD crosses below zero: trend turning bearish

### Histogram Analysis
- Growing histogram = strengthening momentum
- Shrinking histogram = weakening momentum (early warning of crossover)

## Advanced MACD Strategies

### 1. MACD + RSI Combination
Combine for high-probability signals:
- MACD bullish cross + RSI < 50 = strong buy setup
- MACD bearish cross + RSI > 50 = strong sell setup

### 2. MACD Divergence
More powerful than simple crossovers:
- Price makes new highs, MACD doesn't = bearish divergence
- Price makes new lows, MACD doesn't = bullish divergence

### 3. Histogram Zero Line Cross
Early entry before the signal line crossover:
- Histogram turns positive = early bullish signal
- Histogram turns negative = early bearish signal`,
    quiz: {
      questions: [
        {
          question: 'What does the MACD line represent?',
          options: ['EMA(9) - EMA(26)', 'EMA(12) - EMA(26)', 'EMA(12) + EMA(26)', 'SMA(12) - SMA(26)'],
          answer: 1
        },
        {
          question: 'A bullish MACD signal occurs when:',
          options: ['MACD crosses below signal line', 'MACD crosses above signal line', 'MACD reaches zero', 'Histogram is negative'],
          answer: 1
        },
        {
          question: 'What does a shrinking histogram indicate?',
          options: ['Strengthening momentum', 'Weakening momentum', 'Strong uptrend', 'Oversold condition'],
          answer: 1
        },
        {
          question: 'MACD crossing above zero indicates:',
          options: ['Trend turning bearish', 'Overbought conditions', 'Trend turning bullish', 'Market reversal'],
          answer: 2
        },
        {
          question: 'What is the signal line in MACD?',
          options: ['EMA(12)', 'EMA(26)', 'EMA(9) of MACD line', 'SMA(14)'],
          answer: 2
        }
      ]
    }
  },
  {
    title: 'Bollinger Bands Strategy',
    description: 'Use Bollinger Bands to identify volatility and potential breakouts.',
    difficulty: 'Intermediate',
    duration: 30,
    order: 4,
    isPremium: false,
    requiredPlan: Plan.PRO,
    content: `# Bollinger Bands Strategy

Bollinger Bands are a technical indicator consisting of a middle band (SMA) and two outer bands set at standard deviations above and below the SMA.

## Components
- **Middle Band**: 20-period SMA
- **Upper Band**: Middle Band + (2 × Standard Deviation)
- **Lower Band**: Middle Band - (2 × Standard Deviation)

## Key Concepts

### Bandwidth (Volatility)
- Bands narrow = low volatility (consolidation)
- Bands widen = high volatility (trending)

### Bollinger Squeeze
When bands are extremely narrow, a major move is imminent. Direction is confirmed by the breakout side.

## Trading Strategies

### 1. Mean Reversion
- Price touches lower band = potential buy
- Price touches upper band = potential sell
- Works best in ranging markets

### 2. Breakout Trading
- Price breaks above upper band with volume = bullish breakout
- Price breaks below lower band with volume = bearish breakdown

### 3. W-Bottom Pattern
Classic reversal at lower band for entries with good risk/reward.`,
    quiz: {
      questions: [
        {
          question: 'What is the default period for Bollinger Bands middle band?',
          options: ['14', '20', '26', '50'],
          answer: 1
        },
        {
          question: 'Bollinger Band squeeze indicates:',
          options: ['High volatility', 'Low volatility before major move', 'Overbought condition', 'Strong downtrend'],
          answer: 1
        },
        {
          question: 'Upper band = Middle band + how many standard deviations?',
          options: ['1', '2', '3', '1.5'],
          answer: 1
        },
        {
          question: 'Mean reversion strategy works best in:',
          options: ['Strong trending markets', 'Ranging/sideways markets', 'High volatility periods', 'After breakouts'],
          answer: 1
        },
        {
          question: 'Price touching lower band with volume increase suggests:',
          options: ['Potential sell signal', 'Market consolidation', 'Potential buy/reversal signal', 'Breakout confirmation'],
          answer: 2
        }
      ]
    }
  },
  {
    title: 'Advanced Risk Management',
    description: 'Professional position sizing, risk/reward ratios, and portfolio management.',
    difficulty: 'Advanced',
    duration: 35,
    order: 5,
    isPremium: true,
    requiredPlan: Plan.PREMIUM,
    content: `# Advanced Risk Management

The difference between profitable and losing traders is risk management. Even a 40% win rate can be highly profitable with proper risk management.

## The Golden Rules

### 1. Never Risk More Than 1-2% Per Trade
With $10,000 account:
- 1% risk = $100 max loss per trade
- This allows 100 consecutive losses before account wipes

### 2. Risk/Reward Ratio
Always aim for minimum 1:2 risk/reward:
- Risk $100 to make $200
- Win rate of 40% becomes profitable: 40×$200 - 60×$100 = +$2,000

### 3. Position Sizing Formula
\`\`\`
Position Size = (Account × Risk%) / (Entry - Stop Loss)
\`\`\`

Example:
- Account: $10,000
- Risk: 1% = $100
- Entry: $50, Stop: $48 (risk per share = $2)
- Position Size = $100 / $2 = 50 shares

## Portfolio Management

### Correlation Risk
Don't hold multiple correlated positions:
- EUR/USD + GBP/USD are correlated
- BTC + ETH move together
- Diversify across asset classes

### Maximum Portfolio Risk
Never have more than 5-10% total portfolio at risk simultaneously.

## Advanced Techniques

### Scaling In and Out
- Enter 50% of position at initial signal
- Add remaining 50% on confirmation
- Scale out: take 50% profit at 1:1, let rest run

### Using ATR for Stop Placement
Average True Range (ATR) provides dynamic stops based on volatility:
- Stop = Entry - (2 × ATR)
- Adjusts to current market volatility`,
    quiz: {
      questions: [
        {
          question: 'What is the recommended max risk per trade?',
          options: ['5-10%', '10-15%', '1-2%', '20-25%'],
          answer: 2
        },
        {
          question: 'With 40% win rate and 1:2 R/R, trading is:',
          options: ['Unprofitable', 'Break even', 'Profitable', 'Depends on market'],
          answer: 2
        },
        {
          question: 'Position size calculation requires:',
          options: ['Only account size', 'Account size and desired profit', 'Account size, risk%, and stop distance', 'Current market price only'],
          answer: 2
        },
        {
          question: 'EUR/USD and GBP/USD pairs are:',
          options: ['Uncorrelated', 'Inversely correlated', 'Positively correlated', 'Unrelated'],
          answer: 2
        },
        {
          question: 'ATR is used for:',
          options: ['Calculating profits', 'Dynamic stop placement based on volatility', 'Position sizing only', 'Identifying support levels'],
          answer: 1
        }
      ]
    }
  },
  {
    title: 'Algorithmic Trading & Backtesting',
    description: 'Build and backtest automated trading strategies using quantitative methods.',
    difficulty: 'Advanced',
    duration: 45,
    order: 6,
    isPremium: true,
    requiredPlan: Plan.PREMIUM,
    content: `# Algorithmic Trading & Backtesting

Algorithmic trading uses computer programs to automatically execute trades based on predefined rules, eliminating emotional decisions.

## Strategy Development Process

### 1. Define Your Edge
Your strategy needs a statistical edge:
- What market condition does it exploit?
- What indicator combination generates signals?
- What timeframe and asset class?

### 2. Backtesting Methodology
Test strategy on historical data:
- Use at least 3-5 years of data
- Include transaction costs (spread + commission)
- Avoid look-ahead bias (never use future data)
- Test on out-of-sample data (80/20 split)

## Key Performance Metrics

### Sharpe Ratio
\`\`\`
Sharpe = (Strategy Return - Risk Free Rate) / Standard Deviation × √252
\`\`\`
- Sharpe > 1.0: Good
- Sharpe > 2.0: Excellent
- Sharpe > 3.0: Outstanding

### Maximum Drawdown
Largest peak-to-trough decline:
- Acceptable: < 20%
- Concerning: 20-40%
- Dangerous: > 40%

### Win Rate vs Expectancy
Win rate alone means nothing. Expectancy matters:
\`\`\`
Expectancy = (Win Rate × Avg Win) - (Loss Rate × Avg Loss)
\`\`\`

## Common Algorithmic Strategies

### 1. Trend Following
- Uses moving average crossovers
- Works across asset classes
- Low win rate, high R/R

### 2. Mean Reversion
- Prices revert to mean
- Bollinger Bands, RSI oversold/overbought
- Higher win rate, lower R/R

### 3. Momentum
- Buy what's going up, sell what's going down
- Relative strength comparison
- Works well on longer timeframes

## Avoiding Overfitting
The #1 mistake in backtesting:
- Don't optimize too many parameters
- Use walk-forward optimization
- Test on multiple market conditions
- If it only works in one period, it's curve-fit`,
    quiz: {
      questions: [
        {
          question: 'What Sharpe ratio is considered excellent?',
          options: ['> 0.5', '> 1.0', '> 2.0', '> 0.1'],
          answer: 2
        },
        {
          question: 'Look-ahead bias in backtesting means:',
          options: ['Testing on too much data', 'Using future data in historical testing', 'Using too many indicators', 'Testing on one asset'],
          answer: 1
        },
        {
          question: 'What is maximum drawdown?',
          options: ['Total losses', 'Largest peak-to-trough decline', 'Average daily loss', 'Monthly loss limit'],
          answer: 1
        },
        {
          question: 'Trend following strategies typically have:',
          options: ['High win rate, low R/R', 'Low win rate, high R/R', 'Equal win rate and R/R', 'No relation to R/R'],
          answer: 1
        },
        {
          question: 'Overfitting in backtesting results in:',
          options: ['Better live performance', 'Poor live performance', 'Equal live performance', 'More consistent results'],
          answer: 1
        }
      ]
    }
  }
]

const sampleSignals = [
  { symbol: 'EUR/USD', signalType: SignalType.STRONG_BUY, strategy: 'RSI + MACD', confidence: 87, reason: 'RSI oversold at 28, MACD bullish crossover, price near lower Bollinger Band', hints: ['RSI below 30', 'MACD histogram turning positive', 'Price at support level'], price: 1.0854, rsi: 28.4, macd: 0.0012 },
  { symbol: 'BTC/USD', signalType: SignalType.BUY, strategy: 'MACD Crossover', confidence: 74, reason: 'MACD bullish cross with increasing volume', hints: ['MACD crossed signal line', 'Volume increasing', 'Price above 50 EMA'], price: 67432.5, rsi: 44.2, macd: 125.6 },
  { symbol: 'GBP/USD', signalType: SignalType.SELL, strategy: 'RSI Overbought', confidence: 68, reason: 'RSI reaching overbought territory, price at resistance', hints: ['RSI above 65', 'Near resistance zone', 'Bearish divergence forming'], price: 1.2698, rsi: 67.3, macd: -0.0008 },
  { symbol: 'ETH/USD', signalType: SignalType.NEUTRAL, strategy: 'Consolidation', confidence: 52, reason: 'Price consolidating between key levels, wait for breakout', hints: ['Price in tight range', 'Volume declining', 'RSI neutral at 50'], price: 3521.8, rsi: 50.1, macd: 5.2 },
  { symbol: 'XAU/USD', signalType: SignalType.STRONG_BUY, strategy: 'BB + RSI', confidence: 91, reason: 'Price at lower Bollinger Band, RSI extremely oversold, bullish divergence', hints: ['Price at lower BB', 'RSI at 25', 'Bullish divergence confirmed'], price: 2312.4, rsi: 24.8, macd: -2.1 },
  { symbol: 'USD/JPY', signalType: SignalType.SELL, strategy: 'RSI Divergence', confidence: 72, reason: 'Bearish RSI divergence detected at resistance', hints: ['Bearish divergence', 'RSI declining from high', 'Near major resistance'], price: 154.32, rsi: 71.2, macd: 0.45 },
]

async function main() {
  console.log('🌱 Starting database seed...')

  // Create learn modules
  console.log('📚 Creating learn modules...')
  for (const module of learnModules) {
    await prisma.learnModule.upsert({
      where: { order: module.order },
      update: module,
      create: module,
    })
  }
  console.log(`✅ Created ${learnModules.length} learn modules`)

  // Create sample signals
  console.log('📊 Creating sample signals...')
  await prisma.signal.deleteMany({})
  for (const signal of sampleSignals) {
    await prisma.signal.create({ data: signal })
  }
  console.log(`✅ Created ${sampleSignals.length} sample signals`)

  console.log('🎉 Database seed complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
