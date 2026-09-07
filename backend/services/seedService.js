// KKN TRADER - Comprehensive Seed Service
// Seeds 12 Levels of Trading Academy, Lessons, Quizzes, Blogs, Achievements, and Admin Account

const User = require('../models/User');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const Blog = require('../models/Blog');
const { Achievement } = require('../models/Achievement');
const Portfolio = require('../models/Portfolio');
const Watchlist = require('../models/Watchlist');

const COURSES_DATA = [
  {
    level: 1,
    title: 'Trading Basics',
    slug: 'trading-basics',
    category: 'Trading Basics',
    tagline: 'Master the fundamental mechanics and terminology of global financial markets from absolute zero.',
    description: 'The definitive foundation for anyone new to trading. Learn currency pairs, base vs quote, bid/ask spreads, pips, standard lots, leverage, margin, order types, and trading sessions.',
    difficulty: 'Beginner',
    estimatedHours: 6,
    badgeIcon: 'Compass',
  },
  {
    level: 2,
    title: 'Market Basics',
    slug: 'market-basics',
    category: 'Market Basics',
    tagline: 'Understand the core drivers of market movements, liquidity flow, and market participants.',
    description: 'Discover who moves the markets (Central banks, commercial banks, hedge funds, retail), supply & demand dynamics, bull vs bear regimes, volatility cycles, and global trading sessions.',
    difficulty: 'Beginner',
    estimatedHours: 5,
    badgeIcon: 'Globe',
  },
  {
    level: 3,
    title: 'Candlesticks & Charts',
    slug: 'candlesticks-and-charts',
    category: 'Candlesticks & Charts',
    tagline: 'Learn how to read financial charts and interpret Japanese candlestick price patterns.',
    description: 'Deep dive into candlestick anatomy (body, wicks, open, high, low, close), single candlestick patterns (Hammer, Shooting Star, Doji, Pin Bar), dual patterns (Engulfing), and multi-timeframe chart reading.',
    difficulty: 'Beginner',
    estimatedHours: 6,
    badgeIcon: 'BarChart2',
  },
  {
    level: 4,
    title: 'Technical Analysis',
    slug: 'technical-analysis',
    category: 'Technical Analysis',
    tagline: 'Master classical technical tools, horizontal support/resistance, trendlines, and key indicators.',
    description: 'Learn dynamic and horizontal support/resistance, trend channels, breakout and retest mechanics, Moving Averages (20, 50, 200 EMA), RSI momentum, MACD divergence, and Fibonacci retracements.',
    difficulty: 'Intermediate',
    estimatedHours: 8,
    badgeIcon: 'TrendingUp',
  },
  {
    level: 5,
    title: 'Price Action Mastery',
    slug: 'price-action',
    category: 'Price Action',
    tagline: 'Analyze raw market structure, swing highs, swing lows, and trend transitions without indicator clutter.',
    description: 'Understand pure market structure: Higher Highs (HH), Higher Lows (HL), Lower Highs (LH), Lower Lows (LL), structural breaks, pullbacks, momentum exhaustion, and institutional key levels.',
    difficulty: 'Intermediate',
    estimatedHours: 8,
    badgeIcon: 'Activity',
  },
  {
    level: 6,
    title: 'SMC / ICT Concepts',
    slug: 'smc-ict-concepts',
    category: 'SMC / ICT Concepts',
    tagline: 'Learn Smart Money Concepts, institutional order flow, liquidity pools, and market imbalances.',
    description: 'Unpack institutional concepts: Buy-Side & Sell-Side Liquidity (BSL/SSL), Liquidity Sweeps, Break of Structure (BOS), Change of Character (CHoCH), Order Blocks (OB), and Fair Value Gaps (FVG).',
    difficulty: 'Advanced',
    estimatedHours: 10,
    badgeIcon: 'Layers',
  },
  {
    level: 7,
    title: 'Fundamental Analysis',
    slug: 'fundamental-analysis',
    category: 'Fundamental Analysis',
    tagline: 'Discover how macroeconomic data, central bank policies, and interest rates drive currency valuation.',
    description: 'Learn to read the Economic Calendar, evaluate high-impact news (Interest Rate decisions, CPI inflation, NFP jobs data, GDP), and assess hawkish vs dovish monetary policy.',
    difficulty: 'Intermediate',
    estimatedHours: 6,
    badgeIcon: 'FileText',
  },
  {
    level: 8,
    title: 'Risk Management',
    slug: 'risk-management',
    category: 'Risk Management',
    tagline: 'The essential mathematical rules of capital preservation, position sizing, and drawdown control.',
    description: 'Heavily emphasized institutional discipline: The 1% Risk Rule, calculating lot sizes based on stop-loss pips, Risk/Reward (R:R) mathematics, Max Daily/Weekly Drawdown, and eliminating the Risk of Ruin.',
    difficulty: 'Beginner',
    estimatedHours: 7,
    badgeIcon: 'ShieldCheck',
  },
  {
    level: 9,
    title: 'Trading Psychology',
    slug: 'trading-psychology',
    category: 'Trading Psychology',
    tagline: 'Build unshakeable emotional discipline, master loss acceptance, and conquer fear, greed, and FOMO.',
    description: 'Examine cognitive biases, conquer revenge trading, handle losing streaks with institutional composure, avoid overtrading, and cultivate the calm psychological mindset of an elite risk manager.',
    difficulty: 'Intermediate',
    estimatedHours: 6,
    badgeIcon: 'Brain',
  },
  {
    level: 10,
    title: 'Strategy Building',
    slug: 'strategy-building',
    category: 'Strategy Building',
    tagline: 'Synthesize your knowledge into a robust, rule-based, backtested trading plan with positive expectancy.',
    description: 'Step-by-step blueprint: Choosing markets and timeframes, formulating entry triggers, defining invalidation rules, setting take-profit targets, mathematical expectancy, and backtesting methodologies.',
    difficulty: 'Advanced',
    estimatedHours: 9,
    badgeIcon: 'Cpu',
  },
  {
    level: 11,
    title: 'Trade Management',
    slug: 'trade-management',
    category: 'Trade Management',
    tagline: 'Optimize live trade execution with trailing stops, scaling out partials, and breakeven management.',
    description: 'What to do after entering a trade: Securing partial profits at Key Liquidity targets, moving Stop Loss to Breakeven (BE), trailing stops along structural swings, and avoiding premature exits.',
    difficulty: 'Advanced',
    estimatedHours: 6,
    badgeIcon: 'Sliders',
  },
  {
    level: 12,
    title: 'Advanced Institutional Analysis',
    slug: 'advanced-analysis',
    category: 'Advanced Analysis',
    tagline: 'Multi-timeframe fractal alignment, intermarket correlation, session liquidity models, and top-down mastery.',
    description: 'Master top-down analysis from Monthly down to 1-minute execution, currency strength matrix, Gold vs Dollar correlations, Asian session range expansions, London killzones, and institutional execution models.',
    difficulty: 'Institutional Master',
    estimatedHours: 12,
    badgeIcon: 'Award',
  }
];

const SEED_LESSONS = [
  // LEVEL 1: TRADING BASICS
  {
    courseSlug: 'trading-basics',
    level: 1,
    order: 1,
    title: 'What is Trading vs Investing?',
    slug: 'what-is-trading-vs-investing',
    overview: 'Understand the fundamental differences between trading short-term market fluctuations versus long-term investing in assets.',
    simpleExplanation: 'Trading is the buying and selling of financial assets over shorter time horizons (minutes, hours, days, or weeks) to profit from price movements. Investing focuses on buying and holding assets for years or decades to build wealth through long-term capital appreciation and dividends.',
    detailedExplanation: 'Traders capitalize on market volatility in both directions (bullish upward moves by going LONG, or bearish downward moves by going SHORT). Traders utilize technical analysis, price action, and macroeconomic news to exploit price discrepancies. Investors primarily seek fundamental value, economic growth, and compound returns over multi-year business cycles.',
    realMarketExample: 'An investor buys Apple (AAPL) stock in 2020 to hold for 10 years. A trader analyzes XAU/USD (Gold) on a 15-minute chart, identifies a morning liquidity sweep at $2,380, buys 1 lot, and captures a 40-pip upward move in 45 minutes.',
    keyPoints: [
      'Trading seeks active profit from short-to-medium term price swings in both rising and falling markets.',
      'Investing seeks passive long-term growth and compound value over years.',
      'Traders require strict risk management and predefined Stop Losses on every position.',
      'Active trading is a high-performance craft requiring discipline, emotional control, and systematic rules.'
    ],
    commonMistakes: [
      'Holding a losing short-term trade indefinitely and turning it into an "unintentional long-term investment".',
      'Thinking trading is a get-rich-quick lottery rather than a risk management business.'
    ],
    relatedConcepts: ['Currency Pairs', 'Long and Short Positions', 'Risk Management', 'Trading Sessions']
  },
  {
    courseSlug: 'trading-basics',
    level: 1,
    order: 2,
    title: 'Currency Pairs, Pips, and Lots',
    slug: 'currency-pairs-pips-and-lots',
    overview: 'Learn the primary unit of price measurement (Pips) and order sizing (Standard, Mini, and Micro Lots) in global currency markets.',
    simpleExplanation: 'In Forex, currencies are always traded in pairs (e.g., EUR/USD). The first currency is the Base, and the second is the Quote. A Pip is the smallest standard price increment (usually the 4th decimal place, 0.0001), and a Lot represents the volume size of your position.',
    detailedExplanation: 'For EUR/USD at 1.0850, 1 Euro costs $1.0850 USD. If price moves from 1.0850 to 1.0860, it moved 10 Pips (0.0010). Standard Lot = 100,000 units ($10 per pip on EUR/USD), Mini Lot (0.10) = 10,000 units ($1 per pip), Micro Lot (0.01) = 1,000 units ($0.10 per pip). For Yen pairs (e.g., USD/JPY at 155.20), 1 Pip is the 2nd decimal place (0.01).',
    realMarketExample: 'You trade EUR/USD with a 0.50 lot size ($5/pip). Price moves from 1.0840 to 1.0875 (+35 pips). Your profit is 35 pips × $5/pip = +$175.00 virtual profit.',
    keyPoints: [
      'Pip stands for "Percentage in Point" and measures standard price change.',
      'Standard Lot = 1.00 (100k units), Mini Lot = 0.10 (10k units), Micro Lot = 0.01 (1k units).',
      'Always calculate your Lot Size based on your maximum dollar risk and Stop Loss distance.',
      'Jpy currency pairs are quoted to 2 decimal places instead of 4.'
    ],
    commonMistakes: [
      'Trading standard lots on small accounts and getting stopped out by normal market noise.',
      'Failing to adjust pip calculations for Japanese Yen pairs.'
    ],
    relatedConcepts: ['Base and Quote Currency', 'Position Size Calculator', 'Leverage & Margin', 'Stop Loss']
  },
  {
    courseSlug: 'trading-basics',
    level: 1,
    order: 3,
    title: 'Leverage, Margin, and Order Types',
    slug: 'leverage-margin-and-order-types',
    overview: 'Understand how leverage multiplies purchasing power, how margin is reserved, and how Market, Limit, and Stop orders operate.',
    simpleExplanation: 'Leverage allows you to control a larger trade position with a smaller deposit called Margin. For example, 1:100 leverage means with $100 of margin, you can open a $10,000 position. Order types dictate how you enter: Market (buy/sell now), Limit (buy cheaper / sell higher), or Stop (buy on breakout / sell on breakdown).',
    detailedExplanation: 'Leverage is a double-edged sword: it amplifies both gains and losses equally. Margin is the collateral your account temporarily holds while a position is active. Free Margin = Equity - Used Margin. If Free Margin drops below required maintenance levels, a Margin Call / Stop Out occurs. Stop Loss (SL) and Take Profit (TP) are predefined orders that automatically close trades to protect capital or secure gains.',
    realMarketExample: 'Account Balance: $10,000. You open a 1.00 lot BUY on EUR/USD at 1.0850. Required margin at 1:100 leverage = $1,085.00. Available Margin = $8,915.00. You set Stop Loss at 1.0820 (30 pips risk) and Take Profit at 1.0910 (60 pips reward, 1:2 R:R).',
    keyPoints: [
      'Margin is not a fee; it is a security deposit held while a trade is open.',
      'Never overleverage: always size positions using dollar risk percentage (1-2%).',
      'Market Orders execute immediately at the best available current price.',
      'Limit Orders execute at a specified price or better.',
      'Stop Orders trigger execution once a price threshold is reached.'
    ],
    commonMistakes: [
      'Using maximum available leverage without setting a Stop Loss.',
      'Confusing Limit orders with Stop orders.'
    ],
    relatedConcepts: ['Stop Loss & Take Profit', 'Margin Calculator', 'Risk of Ruin', 'Paper Trading Terminal']
  },

  // LEVEL 5: PRICE ACTION
  {
    courseSlug: 'price-action',
    level: 5,
    order: 1,
    title: 'Market Structure & Swings (HH, HL, LH, LL)',
    slug: 'market-structure-and-swings',
    overview: 'Learn how to identify the foundational building blocks of market trends through swing highs and swing lows.',
    simpleExplanation: 'Market structure is the roadmap of price. When price makes Higher Highs and Higher Lows, the market is in an Uptrend. When price makes Lower Highs and Lower Lows, the market is in a Downtrend.',
    detailedExplanation: 'Price never moves in a straight line; it moves in waves of expansion (impulse) and contraction (retracement). In a bullish market, buyers push price to a new high (HH), followed by a shallow pullback that holds above the previous low (HL). The trend remains officially bullish until price closes below the most recent Higher Low. Identifying clean swing points allows you to trade with the dominant flow rather than against it.',
    realMarketExample: 'On NASDAQ 1H chart: Price rallies from 18,500 to 18,650 (HH), retraces to 18,580 (HL), then rallies to 18,720 (HH). A trader waits for a retest of the 18,650 zone to enter LONG with Stop Loss below 18,580.',
    keyPoints: [
      'Uptrends consist of consecutive Higher Highs (HH) and Higher Lows (HL).',
      'Downtrends consist of consecutive Lower Highs (LH) and Lower Lows (LL).',
      'Always trade in the direction of the Higher Timeframe market structure.',
      'A trend change is confirmed when price breaks the structural swing point with a full body candle close.'
    ],
    commonMistakes: [
      'Trying to pick tops in a strong bullish uptrend with consecutive Higher Lows.',
      'Confusing minor internal sub-structure with major swing structure.'
    ],
    relatedConcepts: ['Break of Structure (BOS)', 'Change of Character (CHoCH)', 'Support & Resistance', 'Trendlines']
  },

  // LEVEL 6: SMC / ICT CONCEPTS
  {
    courseSlug: 'smc-ict-concepts',
    level: 6,
    order: 1,
    title: 'Understanding Market Liquidity & Sweeps',
    slug: 'understanding-market-liquidity-and-sweeps',
    overview: 'Discover how institutional players utilize resting stop loss orders to build large positions without excessive slippage.',
    simpleExplanation: 'Liquidity is the pool of buy and sell orders waiting at obvious chart levels like double tops, double bottoms, and equal highs. Institutions need these orders to buy or sell massive volumes, so price frequently spikes through these levels to "sweep" liquidity before reversing.',
    detailedExplanation: 'Retail traders are taught to put Stop Losses right above resistance or right below support. This creates a dense pool of Buy-Stop orders above swing highs (Buy-Side Liquidity / BSL) and Sell-Stop orders below swing lows (Sell-Side Liquidity / SSL). Smart money algorithms engineer price to tap these zones, absorb the counterpart liquidity, and immediately reverse in the true intended direction.',
    realMarketExample: 'On XAU/USD (Gold) 15m: Gold forms equal highs at $2390. Price surges to $2392.50 with a quick wick sweep, triggers all retail breakout buy orders and short stops, and within 3 candles drops $20 down to $2372.50.',
    keyPoints: [
      'Liquidity resides above old highs (BSL) and below old lows (SSL).',
      'A Liquidity Sweep is characterized by a rapid wick beyond a level followed by a strong displacement in the opposite direction.',
      'Never place your Stop Loss directly at equal highs or equal lows.',
      'Look for liquidity sweeps at Key Session Highs/Lows (Asian High/Low, London Open).'
    ],
    commonMistakes: [
      'Buying breakouts at obvious equal highs without waiting for structure confirmation.',
      'Believing support and resistance lines cannot be breached.'
    ],
    relatedConcepts: ['Order Block (OB)', 'Fair Value Gap (FVG)', 'Break of Structure (BOS)', 'CHoCH']
  },
  {
    courseSlug: 'smc-ict-concepts',
    level: 6,
    order: 2,
    title: 'Order Blocks & Fair Value Gaps (FVG)',
    slug: 'order-blocks-and-fair-value-gaps',
    overview: 'Master institutional footprints: high-probability Order Blocks and three-candle Fair Value Gaps (imbalances).',
    simpleExplanation: 'An Order Block is the last opposite candle before a strong displacement move that breaks market structure. A Fair Value Gap (FVG) is a gap between candle 1 and candle 3 where price moved so violently that the market was left unbalanced.',
    detailedExplanation: 'When banks enter huge buy orders, they absorb selling (the bearish candle = Bullish Order Block) and launch an aggressive rally that leaves an FVG (imbalance). When price returns to the FVG and Order Block, resting institutional limit orders get filled, propelling price forward. The 50% level of the FVG (Consequent Encroachment) and the 50% level of the Order Block (Mean Threshold) offer the highest-precision entry zones.',
    realMarketExample: 'On EUR/USD 5m: London session opens. A red candle forms at 1.0845 followed by 3 massive green candles surging to 1.0880 (BOS). An FVG remains between 1.0852 and 1.0860. Price retraces into the FVG, touches 1.0856, and rallies 40 pips to new highs.',
    keyPoints: [
      'A valid Order Block must cause a displacement that breaks structure (BOS or CHoCH).',
      'An FVG exists when Candle 1 wick does not touch Candle 3 wick across a 3-candle sequence.',
      'The confluence of an Order Block with an FVG offers prime institutional entry criteria.',
      'Always confirm with higher timeframe trend alignment.'
    ],
    commonMistakes: [
      'Marking random candles that did not cause any structural displacement.',
      'Expecting every single micro-gap on low timeframes to hold.'
    ],
    relatedConcepts: ['Liquidity Sweeps', 'Break of Structure (BOS)', 'Change of Character (CHoCH)', 'Premium & Discount']
  },

  // LEVEL 8: RISK MANAGEMENT
  {
    courseSlug: 'risk-management',
    level: 8,
    order: 1,
    title: 'The 1% Rule and Position Sizing Mathematics',
    slug: 'the-1-percent-rule-and-position-sizing',
    overview: 'The non-negotiable mathematical bedrock of professional trading: sizing lots strictly from risk capital.',
    simpleExplanation: 'The 1% rule means you never risk more than 1% of your total account on any single trade. If your account is $10,000, your maximum loss on a trade cannot exceed $100, regardless of market volatility.',
    detailedExplanation: 'Amateurs decide how many lots to trade based on greed (e.g., "I will trade 2.00 lots to make big money"). Professionals calculate lot size backwards using the formula: Lot Size = (Account Balance × Risk %) / (Stop Loss in Pips × Pip Value). By fixing risk at 1%, you can endure 10 consecutive losses and still retain over 90% of your capital, completely eliminating the Risk of Ruin.',
    realMarketExample: 'Account: $10,000. Risk: 1% = $100. Trade setup on GBP/USD: Entry 1.2740, Stop Loss 1.2720 (20 pips distance). Pip value for 1.00 lot on GBP/USD = $10. Position Size = $100 / (20 pips × $10) = 0.50 Lots. If trade hits SL, you lose exactly $100.',
    keyPoints: [
      'Never trade without calculating exact position size first.',
      'Risk 1% to maximum 2% of total equity per setup.',
      'Stop Loss distance in pips dictates position size, not account balance alone.',
      'Use the KKN Position Size Calculator to compute lot sizes in seconds.'
    ],
    commonMistakes: [
      'Using arbitrary lot sizes (like 1.00 lot every time) regardless of Stop Loss distance.',
      'Doubling position size after a loss (Martingale strategy) which inevitably leads to total account loss.'
    ],
    relatedConcepts: ['Risk/Reward Calculator', 'Trading Journal', 'Trading Psychology', 'Drawdown Management']
  }
];

const SEED_QUIZZES = [
  {
    courseSlug: 'trading-basics',
    title: 'Trading Basics & Terminology Mastery Quiz',
    questions: [
      {
        question: 'What does a Pip typically represent in standard 4-decimal currency pairs like EUR/USD?',
        options: [
          { id: 'a', text: 'The first decimal place (0.1)' },
          { id: 'b', text: 'The fourth decimal place (0.0001)' },
          { id: 'c', text: 'The entire dollar value' },
          { id: 'd', text: 'A percentage of total account leverage' },
        ],
        correctOptionId: 'b',
        explanation: 'In most currency pairs, 1 Pip represents the 4th decimal place (0.0001). For Japanese Yen pairs, it is the 2nd decimal place (0.01).'
      },
      {
        question: 'What is the volume size of 1 Standard Lot in Forex trading?',
        options: [
          { id: 'a', text: '1,000 units' },
          { id: 'b', text: '10,000 units' },
          { id: 'c', text: '100,000 units of the base currency' },
          { id: 'd', text: '1,000,000 units' },
        ],
        correctOptionId: 'c',
        explanation: '1 Standard Lot equals 100,000 units of the base currency ($10 per pip on EUR/USD).'
      },
      {
        question: 'If you believe an asset price will decrease and you enter a trade to profit from that drop, what position are you opening?',
        options: [
          { id: 'a', text: 'Long position (Buy)' },
          { id: 'b', text: 'Short position (Sell)' },
          { id: 'c', text: 'Margin Call' },
          { id: 'd', text: 'Limit Order' },
        ],
        correctOptionId: 'b',
        explanation: 'Going SHORT (selling) allows a trader to profit as the price of an asset declines.'
      }
    ]
  },
  {
    courseSlug: 'smc-ict-concepts',
    title: 'SMC & Liquidity Concepts Assessment',
    questions: [
      {
        question: 'Where does Buy-Side Liquidity (BSL) primarily accumulate in the market?',
        options: [
          { id: 'a', text: 'Below major swing lows' },
          { id: 'b', text: 'Above clean swing highs and equal highs' },
          { id: 'c', text: 'At the 50% midpoint of the daily candle' },
          { id: 'd', text: 'Inside low-volume consolidated ranges' },
        ],
        correctOptionId: 'b',
        explanation: 'Buy-Side Liquidity (BSL) rests above swing highs, where short sellers place stop-losses (buy stops) and breakout traders place buy stop orders.'
      },
      {
        question: 'What is the primary difference between a Break of Structure (BOS) and a Change of Character (CHoCH)?',
        options: [
          { id: 'a', text: 'BOS indicates trend continuation; CHoCH indicates a potential trend reversal.' },
          { id: 'b', text: 'BOS only occurs on crypto charts; CHoCH only occurs on Forex.' },
          { id: 'c', text: 'BOS is a 1-minute pattern; CHoCH is a weekly pattern.' },
          { id: 'd', text: 'There is no difference; they are identical terms.' },
        ],
        correctOptionId: 'a',
        explanation: 'BOS confirms the continuation of the current trend (making higher highs or lower lows), while CHoCH signals a structural reversal when a key swing low/high is breached.'
      },
      {
        question: 'How is a Fair Value Gap (FVG) defined across a 3-candle sequence in an uptrend?',
        options: [
          { id: 'a', text: 'When all three candles are red' },
          { id: 'b', text: 'When Candle 1 High does not overlap with Candle 3 Low, leaving an imbalance in Candle 2' },
          { id: 'c', text: 'When price touches the 200 EMA' },
          { id: 'd', text: 'When the spread expands to 5 pips' },
        ],
        correctOptionId: 'b',
        explanation: 'A bullish FVG occurs when the high wick of Candle 1 does not overlap with the low wick of Candle 3, leaving an unmitigated price void in the large middle displacement candle.'
      }
    ]
  },
  {
    courseSlug: 'risk-management',
    title: 'Risk Management & Capital Preservation Quiz',
    questions: [
      {
        question: 'According to professional risk management, what is the maximum recommended risk percentage on a single trade?',
        options: [
          { id: 'a', text: '10% to 20%' },
          { id: 'b', text: '1% to 2% of total account equity' },
          { id: 'c', text: '50% on high confidence setups' },
          { id: 'd', text: 'Whatever leverage the broker allows' },
        ],
        correctOptionId: 'b',
        explanation: 'Limiting risk to 1% to 2% ensures you can endure inevitable losing streaks without triggering severe drawdowns or risking account ruin.'
      },
      {
        question: 'If you have a $10,000 account, risk 1% ($100), and have a 25-pip Stop Loss on EUR/USD ($10/pip per standard lot), what is your lot size?',
        options: [
          { id: 'a', text: '1.00 Lot' },
          { id: 'b', text: '0.40 Lots' },
          { id: 'c', text: '2.50 Lots' },
          { id: 'd', text: '0.10 Lots' },
        ],
        correctOptionId: 'b',
        explanation: 'Lot Size = $100 / (25 pips × $10) = 0.40 Lots. This guarantees that hitting Stop Loss loses exactly $100 (1%).'
      }
    ]
  }
];

const SEED_BLOGS = [
  {
    title: 'The Blueprint to Understanding Institutional Liquidity and Stop Hunts',
    slug: 'understanding-institutional-liquidity-and-stop-hunts',
    category: 'SMC',
    excerpt: 'Learn how smart money algorithms engineer liquidity above equal highs and below equal lows before initiating high-momentum directional expansions.',
    content: `## Why Retail Patterns Become Institutional Liquidity Pools

In modern financial markets, liquidity is the lifeblood of price action. Large financial institutions, hedge funds, and algorithmic market makers execute transactions in tens of millions of dollars. To fill these massive positions without moving the market against themselves, they need counterpart orders.

### Where Does Liquidity Accumulate?
1. **Equal Highs (EQH)**: Retail double-top patterns attract sell orders with Stop Losses positioned 5–10 pips above the resistance line.
2. **Equal Lows (EQL)**: Retail double-bottom patterns accumulate dense clusters of Sell Stops.
3. **Session Highs and Lows**: The Asian Session high and low, London Open range, and previous day's high/low.

### How to Trade the Liquidity Sweep
Rather than entering at the first touch of support or resistance, professional traders wait for:
- Price to aggressively pierce through the liquidity level.
- Rapid rejection leaving a long wick on higher timeframes.
- A lower timeframe Change of Character (CHoCH) with a Fair Value Gap.
- An entry on the retest of the resulting Order Block.

Always maintain strict 1% risk management and protect capital.`,
    author: 'KKN Trader Research Desk',
    readTimeMinutes: 7,
    tags: ['Liquidity', 'SMC', 'Order Flow', 'Forex'],
    viewsCount: 1420,
    isPublished: true,
  },
  {
    title: 'The Mathematics of Trading Longevity: Why 1:2 Risk/Reward Changes Everything',
    slug: 'mathematics-of-trading-longevity-risk-reward',
    category: 'Risk Management',
    excerpt: 'Discover why a trader with a 40% win rate can significantly outperform a 70% win rate trader through asymmetric risk-to-reward ratios and disciplined sizing.',
    content: `## The Fallacy of Chasing High Win Rates

Most novice traders obsess over finding a "90% win-rate holy grail strategy." However, institutional trading profitability is governed by expectancy, not win rate alone.

### The Expectancy Formula
$$\\text{Expectancy} = (\\text{Win Rate} \\times \\text{Average Win}) - (\\text{Loss Rate} \\times \\text{Average Loss})$$

### Let's Compare Two Traders (100 Trades, $100 Risk per trade):
- **Trader A**: 70% Win Rate, 1:0.5 R:R ($50 win, $100 loss) -> Profit: (70 × $50) - (30 × $100) = +$500.
- **Trader B**: 40% Win Rate, 1:3 R:R ($300 win, $100 loss) -> Profit: (40 × $300) - (60 × $100) = +$6,000.

Trader B was wrong 60% of the time, yet generated **12x more profit** than Trader A because of positive mathematical expectancy.

### Key Rules to Implement Today:
1. Never take a trade with less than a 1:2 planned Risk-to-Reward ratio.
2. Calculate position size strictly from Stop Loss distance using the KKN Calculator.
3. Keep maximum daily loss capped at 3%.`,
    author: 'KKN Trader Institutional Team',
    readTimeMinutes: 6,
    tags: ['Risk Management', 'Expectancy', 'Calculators', 'Discipline'],
    viewsCount: 2150,
    isPublished: true,
  },
  {
    title: 'Mastering Market Structure: Break of Structure (BOS) vs Change of Character (CHoCH)',
    slug: 'market-structure-bos-vs-choch',
    category: 'Price Action',
    excerpt: 'A comprehensive visual guide to deciphering true market direction, avoiding false breakouts, and timing institutional trend transitions.',
    content: `## The Language of Pure Price Action

Without understanding market structure, technical indicators will produce conflicting and lagging signals. Price moves in continuous structural cycles of expansion, retracement, and reversal.

### What is a BOS (Break of Structure)?
A Break of Structure confirms that the current trend is continuing with full institutional backing. In an uptrend, when price closes above the preceding swing high with a full candle body, a Bullish BOS is confirmed.

### What is a CHoCH (Change of Character)?
A Change of Character is the earliest signal that trend control is flipping. In an uptrend making Higher Lows, when price breaks below the most recent Higher Low that created the highest high, a Bearish CHoCH occurs.

### Best Practices for Trading Structure:
- Prioritize Higher Timeframe structure (Daily, 4H, 1H).
- Use Lower Timeframe (15m, 5m) CHoCH purely for entry refinement inside Higher Timeframe Order Blocks.
- Always require candle body closes rather than single-wick probes.`,
    author: 'KKN Trader Research Desk',
    readTimeMinutes: 8,
    tags: ['Price Action', 'Market Structure', 'BOS', 'CHoCH'],
    viewsCount: 1890,
    isPublished: true,
  }
];

const SEED_ACHIEVEMENTS = [
  { key: 'first_lesson', title: 'First Steps', description: 'Complete your first Trading Academy lesson.', category: 'ACADEMY', icon: 'BookOpen', points: 50 },
  { key: 'ten_lessons', title: 'Knowledge Seeker', description: 'Complete 10 lessons across any course levels.', category: 'ACADEMY', icon: 'GraduationCap', points: 150 },
  { key: 'first_quiz', title: 'Quiz Novice', description: 'Pass your first academy quiz assessment.', category: 'QUIZ', icon: 'HelpCircle', points: 75 },
  { key: 'perfect_quiz', title: 'Perfect Score', description: 'Score 100% on any trading quiz.', category: 'QUIZ', icon: 'Award', points: 200 },
  { key: 'first_trade', title: 'First Paper Trade', description: 'Execute your first simulated position on KKN Terminal.', category: 'TRADING', icon: 'TrendingUp', points: 100 },
  { key: 'ten_trades', title: 'Active Trader', description: 'Complete 10 paper trades with managed risk.', category: 'TRADING', icon: 'Activity', points: 250 },
  { key: 'journal_master', title: 'Journal Master', description: 'Maintain complete trade notes and lessons in your journal.', category: 'JOURNAL', icon: 'BookMarked', points: 150 },
  { key: 'risk_manager', title: 'Disciplined Risk Manager', description: 'Maintain 1:2+ RR on your paper trading positions.', category: 'DISCIPLINE', icon: 'ShieldCheck', points: 300 },
];

const seedDatabase = async () => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      console.log('[Seed] Ready in resilient high-speed in-memory store mode (12 Levels, Quizzes & Demo accounts loaded).');
      return;
    }
    console.log('[Seed] Starting database seeding...');

    // 1. Seed Courses
    for (const courseData of COURSES_DATA) {
      await Course.findOneAndUpdate(
        { slug: courseData.slug },
        courseData,
        { upsert: true, new: true }
      );
    }
    console.log(`[Seed] Seeded ${COURSES_DATA.length} Course Levels successfully.`);

    // 2. Seed Lessons
    for (const lessonData of SEED_LESSONS) {
      const course = await Course.findOne({ slug: lessonData.courseSlug });
      if (course) {
        await Lesson.findOneAndUpdate(
          { courseSlug: lessonData.courseSlug, slug: lessonData.slug },
          { ...lessonData, courseId: course._id },
          { upsert: true, new: true }
        );
      }
    }
    console.log(`[Seed] Seeded ${SEED_LESSONS.length} In-depth Lessons successfully.`);

    // 3. Seed Quizzes
    for (const quizData of SEED_QUIZZES) {
      await Quiz.findOneAndUpdate(
        { courseSlug: quizData.courseSlug, title: quizData.title },
        quizData,
        { upsert: true, new: true }
      );
    }
    console.log(`[Seed] Seeded ${SEED_QUIZZES.length} Interactive Quizzes successfully.`);

    // 4. Seed Blogs
    for (const blogData of SEED_BLOGS) {
      await Blog.findOneAndUpdate(
        { slug: blogData.slug },
        blogData,
        { upsert: true, new: true }
      );
    }
    console.log(`[Seed] Seeded ${SEED_BLOGS.length} Knowledge Base Articles successfully.`);

    // 5. Seed Achievements
    for (const achData of SEED_ACHIEVEMENTS) {
      await Achievement.findOneAndUpdate(
        { key: achData.key },
        achData,
        { upsert: true, new: true }
      );
    }
    console.log(`[Seed] Seeded ${SEED_ACHIEVEMENTS.length} Achievements successfully.`);

    // 6. Seed Default Institutional Admin & Demo Trader
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@kkntrader.com';
    let adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) {
      adminUser = await User.create({
        name: process.env.ADMIN_NAME || 'KKN Master Trader',
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || 'Admin@KKNTrader2026!',
        role: 'ADMIN',
        experienceLevel: 'ADVANCED',
        tradingGoals: ['Master SMC Order Flow', 'Institutional Risk Control', 'Curriculum Excellence'],
      });
      console.log(`[Seed] Created Master Admin user: ${adminEmail}`);
    }

    // Ensure Admin has default portfolio and watchlist
    await Portfolio.findOneAndUpdate(
      { userId: adminUser._id },
      { userId: adminUser._id, initialBalance: 100000, virtualBalance: 100000, equity: 100000, availableMargin: 100000 },
      { upsert: true, new: true }
    );
    await Watchlist.findOneAndUpdate(
      { userId: adminUser._id },
      { userId: adminUser._id, symbols: ['XAU/USD', 'EUR/USD', 'GBP/USD', 'BTC/USD', 'NASDAQ', 'US30'] },
      { upsert: true, new: true }
    );

    // Also seed a demo student account for instant testing
    const demoEmail = 'trader@kkntrader.com';
    let demoUser = await User.findOne({ email: demoEmail });
    if (!demoUser) {
      demoUser = await User.create({
        name: 'KKN Pro Trader',
        email: demoEmail,
        password: 'Trader@KKN2026!',
        role: 'USER',
        experienceLevel: 'INTERMEDIATE',
        tradingGoals: ['Learn Price Action', 'Practice $100k Trading Terminal', 'Master Risk Management'],
      });
      console.log(`[Seed] Created Demo Trader user: ${demoEmail}`);
    }
    await Portfolio.findOneAndUpdate(
      { userId: demoUser._id },
      { userId: demoUser._id, initialBalance: 100000, virtualBalance: 100000, equity: 100000, availableMargin: 100000 },
      { upsert: true, new: true }
    );

    console.log('[Seed] Database seeding completed successfully.');
  } catch (err) {
    console.error('[Seed Error]:', err.message);
  }
};

module.exports = {
  COURSES_DATA,
  SEED_LESSONS,
  SEED_QUIZZES,
  SEED_BLOGS,
  SEED_ACHIEVEMENTS,
  seedDatabase,
};
