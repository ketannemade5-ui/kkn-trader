// KKN TRADER - Comprehensive Seed Service
// Seeds 20 Levels of Trading Academy, Lessons, Quizzes, Blogs, Achievements, and Admin Account

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
    learningObjectives: [
      'Understand the core difference between trading volatility and long-term investing',
      'Calculate pips, point values, and standard, mini, and micro lot sizes accurately',
      'Understand how leverage and margin requirements operate in live markets',
      'Master Market, Limit, Stop, Take Profit (TP), and Stop Loss (SL) order execution',
    ],
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
    learningObjectives: [
      'Identify the institutional hierarchy of liquidity providers and market makers',
      'Navigate the Asian, London, and New York trading sessions and overlap killzones',
      'Understand supply, demand, and dynamic market equilibrium',
      'Recognize how volume and liquidity dictate spread tightness and volatility',
    ],
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
    learningObjectives: [
      'Deconstruct candlestick anatomy: Open, High, Low, Close, and wick rejection',
      'Identify reversal candles: Hammers, Shooting Stars, Pin Bars, and Bullish/Bearish Engulfing',
      'Distinguish high-probability signals from indecision patterns like Dojis and Spinning Tops',
      'Navigate clean multi-timeframe charts without clutter or bias',
    ],
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
    learningObjectives: [
      'Draw major horizontal support and resistance zones based on multi-touch reactions',
      'Construct valid ascending and descending trend channels and trade retests',
      'Utilize exponential moving averages (20, 50, 200 EMA) for dynamic trend filters',
      'Identify overbought/oversold extremes and regular/hidden momentum divergences on RSI',
    ],
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
    learningObjectives: [
      'Map pure market structure through swing highs (HH, LH) and swing lows (HL, LL)',
      'Confirm real structural breaks using full candle body closes',
      'Distinguish Break of Structure (BOS) from Change of Character (CHoCH)',
      'Locate Premium and Discount equilibrium pricing for high-expectancy entries',
    ],
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
    learningObjectives: [
      'Identify Buy-Side Liquidity (BSL) and Sell-Side Liquidity (SSL) resting pools',
      'Spot institutional Liquidity Sweeps (stop hunts) at key session highs and lows',
      'Identify valid Bullish and Bearish Order Blocks with displacement',
      'Trade Fair Value Gaps (FVGs) and 50% Consequent Encroachment mitigation',
    ],
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
    learningObjectives: [
      'Interpret central bank rate decisions (Fed, ECB, BOE, BOJ) and policy statements',
      'Navigate high-impact news events on the Economic Calendar (CPI, NFP, GDP, PMI)',
      'Understand how bond yields and interest rate differentials drive capital flows',
      'Implement risk-off news protocols to avoid high-slippage market spikes',
    ],
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
    learningObjectives: [
      'Execute the non-negotiable 1% account risk rule on every single position',
      'Calculate position size backwards from Stop Loss distance using mathematical formulas',
      'Understand positive mathematical expectancy and why 1:2+ R:R beats high win rates',
      'Establish daily and weekly max drawdown circuit breakers to protect account equity',
    ],
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
    learningObjectives: [
      'Eliminate Fear of Missing Out (FOMO) and impulsive chasing of runaway price',
      'Eradicate revenge trading through systematic post-loss cooldown protocols',
      'Accept trading losses as standard business operating expenses',
      'Maintain an objective, probabilistic mindset unaffected by short-term trade outcomes',
    ],
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
    learningObjectives: [
      'Create a complete trading playbook with objective setup rules and filters',
      'Define precise trade entry triggers, invalidation stop points, and profit targets',
      'Execute 100+ sample backtesting sessions to calculate edge and win rate',
      'Calculate mathematical expectancy: Win Rate × Avg Win - Loss Rate × Avg Loss',
    ],
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
    learningObjectives: [
      'Execute partial profit scaling at primary liquidity and structural targets',
      'Implement rule-based Stop Loss adjustments to Breakeven without suffocating trades',
      'Trail stops along Higher Lows (in longs) and Lower Highs (in shorts)',
      'Prevent psychological trade micromanagement and premature exits',
    ],
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
    learningObjectives: [
      'Conduct top-down fractal alignment from Monthly/Weekly down to 15m/5m execution',
      'Leverage intermarket correlations between USD Index (DXY), Gold, Indices, and Bond Yields',
      'Master the Asian Range Accumulation, London Manipulation, and NY Expansion model (AMD)',
      'Synthesize all 12 academy levels into a cohesive institutional trading process',
    ],
  },
  {
    level: 13,
    title: 'Advanced Liquidity & Market Structure',
    slug: 'advanced-liquidity-and-market-structure',
    category: 'Advanced Liquidity',
    tagline: 'Master deep institutional liquidity dynamics, stop hunts, and algorithmic liquidity engineering.',
    description: 'Deepen your mastery of market liquidity. Learn how algorithmic market makers engineer liquidity pools above equal highs and below equal lows, how stop hunts operate during session transitions, and how to position alongside smart money.',
    difficulty: 'Advanced',
    estimatedHours: 8,
    badgeIcon: 'Zap',
    learningObjectives: [
      'Distinguish Buy-Side Liquidity (BSL) and Sell-Side Liquidity (SSL) pools across multiple timeframes',
      'Identify institutional stop runs and high-volume Judas swings during London & NY opens',
      'Recognize algorithmic liquidity engineering (creating inducement before the real move)',
      'Construct high-probability reversal setups following complete liquidity sweeps',
    ],
  },
  {
    level: 14,
    title: 'Advanced Market Structure',
    slug: 'advanced-market-structure',
    category: 'Advanced Market Structure',
    tagline: 'Differentiate internal vs external structure, premium vs discount pricing, and dealing range bias.',
    description: 'Master advanced structural nuances: Internal sub-structure pullbacks versus External major swing points, dealing range boundaries, Premium and Discount valuation models, and establishing uncompromising directional bias.',
    difficulty: 'Advanced',
    estimatedHours: 8,
    badgeIcon: 'Layers',
    learningObjectives: [
      'Differentiate Major External Swing Structure from Minor Internal Sub-Structure',
      'Calculate Dealing Ranges using the 50% Equilibrium Fibonacci tool',
      'Never buy in Premium or sell in Discount: enforce structural valuation discipline',
      'Align lower-timeframe internal trend shifts with higher-timeframe external targets',
    ],
  },
  {
    level: 15,
    title: 'Institutional Order Flow',
    slug: 'institutional-order-flow',
    category: 'Order Flow',
    tagline: 'Track institutional accumulation, aggressive displacement, volume absorption, and entry models.',
    description: 'Learn how smart money algorithms execute multi-million dollar positions. Master aggressive displacement candles, volume absorption at key institutional levels, and structured entry models.',
    difficulty: 'Institutional Master',
    estimatedHours: 8,
    badgeIcon: 'TrendingUp',
    learningObjectives: [
      'Identify genuine institutional displacement with large full-body candles and imbalances',
      'Understand volume absorption and limit order walls at institutional key levels',
      'Analyze the Accumulation, Manipulation, and Distribution (AMD) institutional model',
      'Execute institutional entry models with minimal stop-loss exposure',
    ],
  },
  {
    level: 16,
    title: 'Advanced SMC / ICT Execution',
    slug: 'advanced-smc-ict-execution',
    category: 'SMC Execution',
    tagline: 'Execute sniper entries using Fair Value Gap models, Order Block confluence, and SMC playbooks.',
    description: 'Elevate your execution with advanced SMC setups: Inversion Fair Value Gaps (IFVG), Order Block + Liquidity confluence, Consequent Encroachment (50% FVG), and the complete institutional execution playbook.',
    difficulty: 'Institutional Master',
    estimatedHours: 9,
    badgeIcon: 'Sparkles',
    learningObjectives: [
      'Master FVG entry models and Inversion Fair Value Gap (IFVG) polarity flips',
      'Stack Order Block, Liquidity Sweep, and FVG confluence for maximum conviction',
      'Execute the complete 5-step SMC intraday trading model',
      'Target high-timeframe liquidity pools with 1:3 to 1:10 Risk/Reward setups',
    ],
  },
  {
    level: 17,
    title: 'Multi-Timeframe & Session Models',
    slug: 'multi-timeframe-and-session-models',
    category: 'Session Models',
    tagline: 'Synchronize Daily/4H macro bias with 15m/5m execution and session-specific volatility models.',
    description: 'Master the art of multi-timeframe synchronization. Align Daily and 4-Hour directional bias with 15m and 5m entry triggers. Execute session-based models for Asian range expansion, London Open Judas sweeps, and New York trend continuations.',
    difficulty: 'Institutional Master',
    estimatedHours: 9,
    badgeIcon: 'Clock',
    learningObjectives: [
      'Perform seamless Top-Down Analysis: Monthly -> Daily -> 4H -> 15m -> 5m',
      'Master the London Open Killzone (07:00 - 10:00 GMT) manipulation models',
      'Execute the New York Session (12:00 - 15:00 GMT) continuation & reversal models',
      'Avoid low-probability mid-session consolidation chop',
    ],
  },
  {
    level: 18,
    title: 'Quantitative Trading & Statistics',
    slug: 'quantitative-trading-and-statistics',
    category: 'Quantitative Trading',
    tagline: 'Understand the mathematical edge: Win rate vs R:R, expectancy formulas, profit factor, and sample size.',
    description: 'Transform your trading from emotional guessing into a quantitative business. Learn how sample size, win rate, average win/loss, profit factor, and mathematical expectancy govern long-term institutional profitability.',
    difficulty: 'Institutional Master',
    estimatedHours: 8,
    badgeIcon: 'BarChart2',
    learningObjectives: [
      'Calculate exact Mathematical Expectancy: E = (WR × AvgWin) - (LR × AvgLoss)',
      'Understand the law of large numbers and why 100+ trade sample sizes matter',
      'Analyze Profit Factor (Gross Profits / Gross Losses; aim for > 2.0)',
      'Perform Monte Carlo simulations to understand statistical variance and max drawdown',
    ],
  },
  {
    level: 19,
    title: 'Algorithmic & Systematic Trading',
    slug: 'algorithmic-and-systematic-trading',
    category: 'Systematic Trading',
    tagline: 'Build rule-based automated trading logic, understand algorithmic mechanics, and systematize execution.',
    description: 'Explore the principles of systematic rule-based execution and algorithmic trading. Understand how automated market maker algorithms work, how to code objective entry/exit rules, and how to eliminate human emotional interference.',
    difficulty: 'Institutional Master',
    estimatedHours: 9,
    badgeIcon: 'Cpu',
    learningObjectives: [
      'Convert discretionary chart setups into 100% objective, rule-based if-then logic',
      'Understand how algorithmic execution engines (TWAP, VWAP, Market Makers) function',
      'Structure programmatic risk filters, daily loss limiters, and automated position sizing',
      'Prepare strategy logic for automated execution and alert triggers',
    ],
  },
  {
    level: 20,
    title: 'Professional Trading System',
    slug: 'professional-trading-system',
    category: 'Trading System',
    tagline: 'Construct your comprehensive trading business plan, automated journal, and daily execution workflow.',
    description: 'The pinnacle of the KKN Trading Academy. Synthesize all 20 levels into a complete institutional trading business plan, professional journal review process, weekly preparation rituals, and disciplined execution routine.',
    difficulty: 'Institutional Master',
    estimatedHours: 10,
    badgeIcon: 'Award',
    learningObjectives: [
      'Write your personal comprehensive Trading Business Plan & Policy Document',
      'Maintain an institutional trade journal logging setups, emotions, and R-multiples',
      'Execute daily pre-market preparation, session execution, and post-market review rituals',
      'Operate with uncompromising risk discipline, patience, and long-term capital focus',
    ],
  },
];

const SEED_LESSONS = [
  // ==========================================
  // LEVEL 1: TRADING BASICS
  // ==========================================
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
      'Active trading is a high-performance craft requiring discipline, emotional control, and systematic rules.',
    ],
    commonMistakes: [
      'Holding a losing short-term trade indefinitely and turning it into an "unintentional long-term investment".',
      'Thinking trading is a get-rich-quick lottery rather than a risk management business.',
    ],
    relatedConcepts: ['Currency Pairs', 'Long and Short Positions', 'Risk Management', 'Trading Sessions'],
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
      'JPY currency pairs are quoted to 2 decimal places instead of 4.',
    ],
    commonMistakes: [
      'Trading standard lots on small accounts and getting stopped out by normal market noise.',
      'Failing to adjust pip calculations for Japanese Yen pairs.',
    ],
    relatedConcepts: ['Base and Quote Currency', 'Position Size Calculator', 'Leverage & Margin', 'Stop Loss'],
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
      'Stop Orders trigger execution once a price threshold is reached.',
    ],
    commonMistakes: [
      'Using maximum available leverage without setting a Stop Loss.',
      'Confusing Limit orders with Stop orders.',
    ],
    relatedConcepts: ['Stop Loss & Take Profit', 'Margin Calculator', 'Risk of Ruin', 'Paper Trading Terminal'],
  },

  // ==========================================
  // LEVEL 2: MARKET BASICS
  // ==========================================
  {
    courseSlug: 'market-basics',
    level: 2,
    order: 1,
    title: 'Market Participants & The Hierarchy of Liquidity',
    slug: 'market-participants-and-liquidity',
    overview: 'Understand the multi-tier hierarchy of financial markets from central banks to retail traders.',
    simpleExplanation: 'The market is not a single entity; it is composed of different players with varying capital, goals, and speed. The major participants are Central Banks, Tier-1 Commercial Banks (like JPMorgan and Citibank), Hedge Funds, Corporations, and finally Retail Traders.',
    detailedExplanation: 'Tier-1 banks act as Market Makers, quoting bid and ask prices and providing liquidity to the entire interbank system. Central banks dictate baseline interest rates and monetary policy. Hedge funds deploy quantitative models and institutional order flow strategies. Retail traders make up less than 5% of global daily forex volume and are liquidity takers, not market makers.',
    realMarketExample: 'When Apple needs to repatriate $5 billion in overseas revenue, it executes institutional FX spot transactions that create substantial directional order flow across EUR/USD and USD/JPY.',
    keyPoints: [
      'Interbank Market Makers provide the liquidity that powers all retail broker quotes.',
      'Central banks alter long-term valuation trends through interest rates and quantitative easing.',
      'Retail traders must follow institutional footprints rather than trade against large players.',
      'Liquidity availability determines spread costs and order execution quality.',
    ],
    commonMistakes: [
      'Thinking retail traders can manipulate global currency or gold prices.',
      'Trading during illiquid holidays or rollover periods with wide spreads.',
    ],
    relatedConcepts: ['Interbank Market', 'Market Makers', 'Liquidity Pools', 'Central Banks'],
  },
  {
    courseSlug: 'market-basics',
    level: 2,
    order: 2,
    title: 'Global Trading Sessions & Killzones',
    slug: 'global-trading-sessions-and-killzones',
    overview: 'Master the three major global trading sessions: Asian, London, and New York, and learn how session overlaps generate peak volatility.',
    simpleExplanation: 'Financial markets operate 24 hours a day during the week by passing trading volume across time zones: Tokyo/Sydney (Asian Session), London (European Session), and New York (US Session). The best trading opportunities occur during the London and New York overlaps.',
    detailedExplanation: 'Each session has distinct behavioral characteristics: Asian Session (00:00 - 08:00 GMT) typically consolidates within a tight range. London Session (07:00 - 16:00 GMT) introduces aggressive volume and frequently sets the high or low of the day through an initial manipulation move. New York Session (12:00 - 21:00 GMT) brings major economic data releases and deep liquidity. The London/NY overlap (12:00 - 16:00 GMT) generates over 50% of daily market turnover.',
    realMarketExample: 'On GBP/USD: The Asian range is bounded between 1.2700 and 1.2720 (20 pips). At 07:30 GMT (London Open), price sweeps below 1.2700 to 1.2688, forms a bullish engulfing candle, and rallies 75 pips during the London/NY overlap.',
    keyPoints: [
      'Asian Session builds consolidation and liquidity boundaries.',
      'London Open (London Killzone) frequently creates the true trend or daily directional expansion.',
      'The London & New York overlap produces the highest volatility and tightest spreads.',
      'Avoid entering new intraday positions during late NY afternoon low-liquidity drift.',
    ],
    commonMistakes: [
      'Expecting massive breakout moves during the dead zone of late Asian session on European pairs.',
      'Ignoring high-impact US economic news releases during NY Open at 08:30 EST.',
    ],
    relatedConcepts: ['London Open Killzone', 'Asian Range Manipulation', 'Trading Hours', 'Volatility Cycles'],
  },
  {
    courseSlug: 'market-basics',
    level: 2,
    order: 3,
    title: 'Supply, Demand & Price Equilibrium',
    slug: 'supply-demand-and-equilibrium',
    overview: 'Learn how the fundamental laws of supply and demand drive auction price discovery and create support/resistance zones.',
    simpleExplanation: 'When there are more aggressive buyers than sellers at a price, price rises to find willing sellers. When there are more sellers than buyers, price drops to find willing buyers. Price constantly auctions between cheap (Demand) and expensive (Supply) zones.',
    detailedExplanation: 'Supply zones represent areas where substantial institutional sell orders were previously executed, causing an aggressive downward displacement. Demand zones represent areas where institutional buy orders overwhelmed sellers, causing an upward expansion. When price revisits these zones, unfulfilled limit orders absorb oncoming market flow and trigger price reactions.',
    realMarketExample: 'On EUR/USD 1H chart: Price previously dropped 100 pips rapidly from 1.0920 (Supply). When price returns to 1.0920 three days later, sellers re-enter and price drops 45 pips immediately.',
    keyPoints: [
      'Supply exists where aggressive selling originated; Demand exists where aggressive buying originated.',
      'The strength of a supply/demand zone is determined by the speed and displacement with which price originally left it.',
      'Fresh, untested zones offer the highest probability of reaction.',
      'Repeated tests weaken supply and demand zones as resting orders get consumed.',
    ],
    commonMistakes: [
      'Assuming a supply or demand zone will hold forever after 4 or 5 retests.',
      'Drawing supply/demand zones on tiny candles with zero momentum departure.',
    ],
    relatedConcepts: ['Support & Resistance', 'Order Blocks', 'Equilibrium', 'Price Discovery'],
  },

  // ==========================================
  // LEVEL 3: CANDLESTICKS & CHARTS
  // ==========================================
  {
    courseSlug: 'candlesticks-and-charts',
    level: 3,
    order: 1,
    title: 'Candlestick Anatomy & The Language of Price',
    slug: 'candlestick-anatomy-and-price-language',
    overview: 'Learn to read individual candlestick construction, real bodies, wicks (shadows), and the story behind buying and selling pressure.',
    simpleExplanation: 'Every Japanese candlestick displays four key prices for a chosen timeframe: Open (O), High (H), Low (L), and Close (C). The rectangular colored area is the Body, and the thin lines above and below are the Wicks (or Shadows).',
    detailedExplanation: 'A green (bullish) candle closes higher than its open, demonstrating buyer dominance. A red (bearish) candle closes lower than its open, showing seller control. Long upper wicks indicate that buyers pushed price higher but met intense selling rejection before the close. Long lower wicks show seller exhaustion and strong responsive buying pressure.',
    realMarketExample: 'On Gold (XAU/USD) 1H: Price opens at $2,380, drops to $2,365 during the hour, but aggressively bounces back to close at $2,379. The resulting candle has a tiny body and a 14-dollar lower wick, signaling strong rejection of lower prices.',
    keyPoints: [
      'Candle Body = Distance between Open and Close.',
      'Wicks/Shadows = Extremes reached during that time period before rejection.',
      'Long lower wicks indicate strong buying support; long upper wicks indicate selling rejection.',
      'Candles must be analyzed in the context of surrounding market structure, not in isolation.',
    ],
    commonMistakes: [
      'Entering a trade before the candle has officially closed.',
      'Treating every single wick as a reversal signal without checking location/key levels.',
    ],
    relatedConcepts: ['OHLC Data', 'Pin Bars', 'Doji Candles', 'Timeframes'],
  },
  {
    courseSlug: 'candlesticks-and-charts',
    level: 3,
    order: 2,
    title: 'High-Probability Single & Dual Candle Patterns',
    slug: 'high-probability-candle-patterns',
    overview: 'Master the most reliable candlestick reversal and continuation patterns: Hammers, Shooting Stars, Engulfing Candles, and Morning/Evening Stars.',
    simpleExplanation: 'Certain candlestick shapes provide high-probability clues about impending price reversals. A Hammer at support shows buyers stepping in. A Shooting Star at resistance shows sellers rejecting higher prices. An Engulfing pattern occurs when a large candle completely swallows the previous candle.',
    detailedExplanation: 'A Bullish Engulfing candle opens below the previous red candle close and closes above the previous red candle open with strong volume and displacement, signaling an immediate shift in momentum. A Bearish Pin Bar (Shooting Star) features a wick at least 2x the length of its small body, formed at key resistance or after a liquidity sweep.',
    realMarketExample: 'On NASDAQ 15m: After a 100-point selloff into a key 4-hour support level, a massive green Bullish Engulfing candle forms, completely eclipsing the previous three 15m red candles. Price proceeds to rally 180 points over the next 2 hours.',
    keyPoints: [
      'Bullish Hammer: Small upper body, long lower wick at support.',
      'Shooting Star: Small lower body, long upper wick at resistance.',
      'Bullish Engulfing: Large green candle fully engulfs prior red candle body.',
      'Bearish Engulfing: Large red candle fully engulfs prior green candle body.',
    ],
    commonMistakes: [
      'Trading engulfing patterns in the middle of chop ranges without support or resistance context.',
      'Ignoring the overall Higher Timeframe trend when taking single-candle signals.',
    ],
    relatedConcepts: ['Pin Bar Strategy', 'Engulfing Patterns', 'Reversal Triggers', 'Candle Confirmation'],
  },
  {
    courseSlug: 'candlesticks-and-charts',
    level: 3,
    order: 3,
    title: 'Multi-Timeframe Chart Analysis',
    slug: 'multi-timeframe-chart-analysis',
    overview: 'Learn how to synchronize Higher Timeframes (HTF) for market bias with Lower Timeframes (LTF) for precision entry execution.',
    simpleExplanation: 'Looking at only one timeframe is like driving with tunnel vision. Higher timeframes (Daily/4H) show you the overall trend and major road obstacles, while lower timeframes (15m/5m) let you time your entry with precision and minimal risk.',
    detailedExplanation: 'The three-timeframe framework: 1) Higher Timeframe (Daily/4H) establishes dominant trend direction and key institutional zones; 2) Intermediate Timeframe (1H) reveals intermediate market structure and swings; 3) Lower Timeframe (15m/5m/1m) provides confirmation triggers (BOS, CHoCH, Engulfing) for entry with tight Stop Losses.',
    realMarketExample: 'Daily chart on EUR/USD is strongly bullish. 4H chart pulls back into a 4H Demand Zone at 1.0820. On the 5m chart inside that zone, a bullish Change of Character occurs at 1.0825. Entry taken at 1.0825 with SL at 1.0815 (10 pips risk) targeting Daily highs at 1.0900 (75 pips reward = 1:7.5 R:R).',
    keyPoints: [
      'HTF (Daily/4H) controls the overall market narrative and directional probability.',
      'LTF (15m/5m) provides precise entries to minimize dollar risk and maximize R:R.',
      'Never take an LTF trade directly against a major HTF key level.',
      'Fractal nature: Candlestick patterns repeat identically across all timeframes.',
    ],
    commonMistakes: [
      'Getting hypnotized by 1-minute noise and fighting the Daily trend.',
      'Using too many timeframes (e.g. 1m, 2m, 3m, 5m, 10m, 15m, 30m, 45m) causing analysis paralysis.',
    ],
    relatedConcepts: ['Top-Down Analysis', 'Fractal Markets', 'Timeframe Alignment', 'Risk-to-Reward'],
  },

  // ==========================================
  // LEVEL 4: TECHNICAL ANALYSIS
  // ==========================================
  {
    courseSlug: 'technical-analysis',
    level: 4,
    order: 1,
    title: 'Dynamic & Horizontal Support & Resistance',
    slug: 'support-resistance-and-key-zones',
    overview: 'Master the art of plotting institutional support and resistance zones, flip zones, and dynamic moving average boundaries.',
    simpleExplanation: 'Support is a price floor where buying pressure prevents price from falling further. Resistance is a price ceiling where selling pressure stops price from rising. When a support level breaks, it often flips to become new resistance (Role Reversal).',
    detailedExplanation: 'Horizontal support and resistance levels represent historical memory in the market where institutional volume was transacted. Key criteria for strong levels include: Multiple clear price rejections, clean breakout retests, and confluence with higher timeframe structural swing points. Dynamic support/resistance is provided by moving averages like the 50 EMA and 200 EMA during strong trends.',
    realMarketExample: 'On US30 (Dow Jones): The 39,000 level acted as resistance 3 times. Price finally breaks above with a huge candle to 39,200, then slowly retraces back to test 39,000. The former resistance now acts as rock-solid support, catapulting price to 39,500.',
    keyPoints: [
      'Support & Resistance are zones/areas, not single decimal lines.',
      'Role Reversal: Broken support becomes resistance; broken resistance becomes support.',
      'Higher timeframe zones (Daily/4H) carry significantly more weight than 5-minute levels.',
      'The more times a level is tested, the weaker it eventually becomes as resting orders diminish.',
    ],
    commonMistakes: [
      'Drawing dozens of lines on every single wick until the chart becomes unreadable.',
      'Buying right at resistance or selling right at support.',
    ],
    relatedConcepts: ['Flip Zones', 'Break and Retest', 'Dynamic Support', 'Key Levels'],
  },
  {
    courseSlug: 'technical-analysis',
    level: 4,
    order: 2,
    title: 'Trendlines, Channels & Breakout Mechanics',
    slug: 'trendlines-channels-and-breakouts',
    overview: 'Learn how to draw mathematically valid trendlines, identify ascending/descending channels, and trade legitimate breakouts vs false breaks.',
    simpleExplanation: 'A trendline connects a series of swing lows in an uptrend (ascending trendline) or swing highs in a downtrend (descending trendline). A valid trendline requires at least 3 distinct touches to confirm institutional respect.',
    detailedExplanation: 'Trendlines represent the rate of change of price over time. When price is bounded between two parallel trendlines, it forms an ascending or descending channel. A valid breakout occurs when price closes outside the channel with strong volume and displacement, followed by a retest of the broken boundary. False breakouts (bull/bear traps) quickly wick beyond the line and snap back inside.',
    realMarketExample: 'On GBP/JPY: An ascending channel forms on the 1H chart. Price breaks below the lower trendline with a 40-pip red candle, retraces to retest the trendline underside at 200.50, and plunges 120 pips down.',
    keyPoints: [
      'A valid trendline requires at least 3 validated touch points.',
      'Always wait for candle body closes outside the trendline to confirm breakout attempts.',
      'The safest entry is on the retest of the broken trendline, not the initial breakout candle.',
      'Do not force trendlines through candle bodies.',
    ],
    commonMistakes: [
      'Redrawing trendlines every few minutes to fit losing trades.',
      'Buying breakouts into major higher-timeframe horizontal resistance.',
    ],
    relatedConcepts: ['Channels', 'False Breakouts', 'Breakout Retest', 'Trend Trading'],
  },
  {
    courseSlug: 'technical-analysis',
    level: 4,
    order: 3,
    title: 'Momentum Indicators & Divergences (RSI & EMA)',
    slug: 'momentum-indicators-and-divergences',
    overview: 'Harness the power of the Relative Strength Index (RSI) and Exponential Moving Averages (20, 50, 200 EMA) to spot trend momentum and impending reversals.',
    simpleExplanation: 'Indicators are mathematical calculations based on price and volume. Moving Averages smooth out price action to reveal the underlying trend. RSI measures the velocity and magnitude of price changes on a scale of 0 to 100.',
    detailedExplanation: 'The 200 EMA serves as the master trend filter (price above = bullish bias, price below = bearish bias). The 20 and 50 EMAs provide dynamic pullbacks during strong trends. RSI Divergence is one of the most powerful technical reversal signals: Regular Bearish Divergence occurs when price makes a Higher High while RSI makes a Lower High, revealing that buying momentum is dying.',
    realMarketExample: 'On BTC/USD 4H: Bitcoin price rallies from $65,000 to a new high at $68,000 (Higher High). However, the 14-period RSI drops from 78 down to 62 (Lower High). This Bearish Divergence triggers a 6% pullback over the next 3 days.',
    keyPoints: [
      '200 EMA represents the institutional macro trend baseline.',
      'RSI > 70 suggests overbought conditions; RSI < 30 suggests oversold conditions.',
      'Regular Divergence signals potential trend reversals (Price HH + RSI LH = Bearish Divergence).',
      'Never trade indicators in a vacuum; use them as confluence with Price Action and Key Levels.',
    ],
    commonMistakes: [
      'Shorting immediately just because RSI is overbought in a runaway parabolic uptrend.',
      'Overloading charts with 6 different oscillating indicators that all show the same thing.',
    ],
    relatedConcepts: ['RSI Divergence', 'Moving Averages', 'Golden Cross / Death Cross', 'Momentum Trading'],
  },

  // ==========================================
  // LEVEL 5: PRICE ACTION MASTERY
  // ==========================================
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
      'A trend change is confirmed when price breaks the structural swing point with a full body candle close.',
    ],
    commonMistakes: [
      'Trying to pick tops in a strong bullish uptrend with consecutive Higher Lows.',
      'Confusing minor internal sub-structure with major swing structure.',
    ],
    relatedConcepts: ['Break of Structure (BOS)', 'Change of Character (CHoCH)', 'Support & Resistance', 'Trendlines'],
  },
  {
    courseSlug: 'price-action',
    level: 5,
    order: 2,
    title: 'Break of Structure (BOS) vs Change of Character (CHoCH)',
    slug: 'bos-vs-choch-structure',
    overview: 'Master the two essential structural transitions that define whether a trend is continuing or reversing.',
    simpleExplanation: 'A Break of Structure (BOS) confirms that the current trend is continuing (e.g. creating a new Higher High in an uptrend). A Change of Character (CHoCH) is the first sign of a trend reversal when the market breaks the previous key swing low.',
    detailedExplanation: 'In an established uptrend, every time price breaks above the previous swing high with a full candle body close, a Bullish BOS occurs. When price fails to make a new high and subsequently breaks below the most recent Higher Low (the low that created the highest high), a Bearish CHoCH is registered. This alerts the trader that institutional supply has overtaken demand, signaling a transition into a downtrend or deep retracement.',
    realMarketExample: 'On EUR/USD 15m: Price makes HH at 1.0880 with HL at 1.0840. Price fails to exceed 1.0880 and drops forcefully to close at 1.0830 (Bearish CHoCH). Trader waits for a pullback into the newly created supply zone to short.',
    keyPoints: [
      'BOS = Trend Continuation (Uptrend: Break above HH / Downtrend: Break below LL).',
      'CHoCH = Early Trend Reversal (Uptrend: Break below HL / Downtrend: Break above LH).',
      'Require full candle body closes to validate structural breaks and avoid wick fakeouts.',
      'Use Lower Timeframe CHoCH inside Higher Timeframe Order Blocks for maximum entry precision.',
    ],
    commonMistakes: [
      'Calling every minor wick a CHoCH before the candle has closed.',
      'Entering immediately upon a CHoCH without waiting for the pullback retracement into an Order Block/FVG.',
    ],
    relatedConcepts: ['Market Structure', 'Order Blocks', 'Liquidity Sweeps', 'Trend Reversal'],
  },
  {
    courseSlug: 'price-action',
    level: 5,
    order: 3,
    title: 'Premium vs Discount Pricing & Equilibrium',
    slug: 'premium-vs-discount-pricing',
    overview: 'Learn how institutional algorithms view price ranges through Fibonacci Equilibrium (50%), Premium (expensive), and Discount (cheap) zones.',
    simpleExplanation: 'Just like any business, smart money wants to buy at wholesale discount prices and sell at premium retail prices. Equilibrium is the 50% midpoint of any structural price swing.',
    detailedExplanation: 'Using the Fibonacci Retracement tool from swing low to swing high: The 0% to 50% zone is Premium (expensive), and the 50% to 100% zone is Discount (cheap). When looking for a LONG setup, never buy in Premium; always wait for price to retrace below the 50% Equilibrium level into the Golden Pocket (61.8% - 78.6% Discount). When looking to SHORT, only sell above the 50% level in Premium.',
    realMarketExample: 'On Gold: Swing Low is $2,300, Swing High is $2,400. Equilibrium (50%) is $2,350. Buying at $2,380 is buying in deep Premium with unfavorable R:R. Professional traders wait for price to pull back to $2,335 (65% Discount) before looking for long confirmations.',
    keyPoints: [
      'Equilibrium is the exact 50% midpoint of the trading range.',
      'Discount Zone (< 50%): The only mathematically sound zone to look for BUY setups.',
      'Premium Zone (> 50%): The only mathematically sound zone to look for SELL setups.',
      'Golden Pocket (61.8% - 78.6%) inside Discount/Premium offers peak risk-to-reward.',
    ],
    commonMistakes: [
      'Chasing green candles and buying in deep Premium at the top of an impulse leg.',
      'Measuring swings from arbitrary internal candles instead of true major swing points.',
    ],
    relatedConcepts: ['Fibonacci Retracement', 'Equilibrium', 'Risk-to-Reward', 'Smart Money Concepts'],
  },

  // ==========================================
  // LEVEL 6: SMC / ICT CONCEPTS
  // ==========================================
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
      'Look for liquidity sweeps at Key Session Highs/Lows (Asian High/Low, London Open).',
    ],
    commonMistakes: [
      'Buying breakouts at obvious equal highs without waiting for structure confirmation.',
      'Believing support and resistance lines cannot be breached.',
    ],
    relatedConcepts: ['Order Block (OB)', 'Fair Value Gap (FVG)', 'Break of Structure (BOS)', 'CHoCH'],
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
      'Always confirm with higher timeframe trend alignment.',
    ],
    commonMistakes: [
      'Marking random candles that did not cause any structural displacement.',
      'Expecting every single micro-gap on low timeframes to hold.',
    ],
    relatedConcepts: ['Liquidity Sweeps', 'Break of Structure (BOS)', 'Change of Character (CHoCH)', 'Premium & Discount'],
  },
  {
    courseSlug: 'smc-ict-concepts',
    level: 6,
    order: 3,
    title: 'Breaker Blocks & Mitigation Blocks',
    slug: 'breaker-blocks-and-mitigation-blocks',
    overview: 'Understand failed Order Blocks that transform into institutional Breaker Blocks upon structural invalidation.',
    simpleExplanation: 'When an Order Block gets broken by a strong displacement move instead of holding, it flips polarity into a Breaker Block. It becomes a prime zone to enter on a retest in the new direction.',
    detailedExplanation: 'A Bullish Breaker Block is a previous bearish Order Block (the last up-candle before a swing low) that price aggressively blasted through to the upside after sweeping liquidity. When price pulls back to this level, smart money mitigates remaining drawdowns from earlier hedges and propels the new expansion forward.',
    realMarketExample: 'On US30 15m: A sell block at 38,500 fails as price violently rallies to 38,700 following a news sweep. Price later pulls back to test 38,500 (now a Bullish Breaker Block) and explodes 250 points higher.',
    keyPoints: [
      'A Breaker Block requires a liquidity sweep of a previous swing point prior to breaking structure.',
      'Breakers offer exceptional confluence during structural trend reversals.',
      'Mitigation occurs when institutional algorithms close out hedged positions at breakeven.',
      'Pair Breaker Blocks with FVGs for maximum entry precision.',
    ],
    commonMistakes: [
      'Confusing normal support/resistance retests with true institutional breaker mechanics.',
      'Entering on breakers without a confirmed higher timeframe displacement.',
    ],
    relatedConcepts: ['Order Blocks', 'Liquidity Sweeps', 'Change of Character', 'Fair Value Gaps'],
  },

  // ==========================================
  // LEVEL 7: FUNDAMENTAL ANALYSIS
  // ==========================================
  {
    courseSlug: 'fundamental-analysis',
    level: 7,
    order: 1,
    title: 'Central Banks, Interest Rates & Monetary Policy',
    slug: 'central-banks-and-monetary-policy',
    overview: 'Understand how global central banks (Federal Reserve, ECB, BOE, BOJ) dictate the macroeconomic landscape and currency valuations.',
    simpleExplanation: 'Central banks control the cost of borrowing money through interest rates. Higher interest rates attract foreign capital and strengthen a currency (Hawkish). Lower interest rates encourage borrowing but weaken a currency (Dovish).',
    detailedExplanation: 'When a central bank raises interest rates to combat inflation, yields on domestic bonds increase. Global investors purchase the currency to invest in higher-yielding sovereign bonds, driving up demand and spot price. Monetary policy shifts take months to unfold, creating multi-month macro trends that technical traders can align with.',
    realMarketExample: 'In 2022-2023, the US Federal Reserve rapidly raised rates from 0.25% to 5.50% while the Bank of Japan held rates at -0.10%. This interest rate differential caused USD/JPY to rally from 115.00 to over 160.00.',
    keyPoints: [
      'Interest rate differentials are the #1 macro driver of long-term currency direction.',
      'Hawkish Policy = Raising rates / Tightening money supply → Bullish Currency.',
      'Dovish Policy = Cutting rates / Expanding money supply → Bearish Currency.',
      'Align your technical swing trades with the prevailing central bank interest rate bias.',
    ],
    commonMistakes: [
      'Fighting a dominant multi-month interest rate trend with short-term counter-trend scalps.',
      'Ignoring central bank policy statements and forward guidance.',
    ],
    relatedConcepts: ['Economic Calendar', 'Inflation & CPI', 'Bond Yields', 'Macro Trends'],
  },
  {
    courseSlug: 'fundamental-analysis',
    level: 7,
    order: 2,
    title: 'Mastering the Economic Calendar (CPI, NFP, GDP)',
    slug: 'mastering-economic-calendar-and-news',
    overview: 'Learn how to read high-impact news releases, navigate wild volatility spikes, and protect trading capital during news events.',
    simpleExplanation: 'The Economic Calendar tracks scheduled data releases like Consumer Price Index (CPI inflation), Non-Farm Payrolls (NFP employment), and Gross Domestic Product (GDP). High-impact (red folder) events cause massive, instantaneous volatility.',
    detailedExplanation: 'Market movements around news are driven by the Deviation between the Actual number and the Market Consensus Forecast. If US CPI inflation comes in substantially higher than expected, the market prices in higher interest rates, causing the US Dollar to spike and Gold/Stocks to plunge. Professional traders often avoid trading during the exact 5 minutes of release due to extreme spread widening and slippage.',
    realMarketExample: 'US NFP forecast is +180k jobs; actual number prints +305k (massive surprise beat). Within 2 seconds, EUR/USD plunges 60 pips and Gold drops $25 as algorithms flood the market with US Dollar buy orders.',
    keyPoints: [
      'Always check the Economic Calendar before opening intraday positions.',
      'Three key US reports: CPI (Inflation), NFP (Employment), FOMC (Fed Rates).',
      'Spreads widen significantly during news releases; market orders risk severe slippage.',
      'Wait 15-30 minutes after news release for institutional direction to establish before entering.',
    ],
    commonMistakes: [
      'Gambling on news outcomes seconds before the release like a casino roulette wheel.',
      'Leaving tight 5-pip Stop Losses open during high-impact news releases.',
    ],
    relatedConcepts: ['CPI Inflation', 'NFP Employment', 'Slippage & Spreads', 'Risk Management'],
  },

  // ==========================================
  // LEVEL 8: RISK MANAGEMENT
  // ==========================================
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
      'Use the KKN Position Size Calculator to compute lot sizes in seconds.',
    ],
    commonMistakes: [
      'Using arbitrary lot sizes (like 1.00 lot every time) regardless of Stop Loss distance.',
      'Doubling position size after a loss (Martingale strategy) which inevitably leads to total account loss.',
    ],
    relatedConcepts: ['Risk/Reward Calculator', 'Trading Journal', 'Trading Psychology', 'Drawdown Management'],
  },
  {
    courseSlug: 'risk-management',
    level: 8,
    order: 2,
    title: 'Risk-to-Reward (R:R) Ratios & Mathematical Expectancy',
    slug: 'risk-to-reward-and-expectancy',
    overview: 'Discover why asymmetric risk-to-reward ratios allow traders to build consistent profitability even with a sub-50% win rate.',
    simpleExplanation: 'Risk-to-Reward ratio (R:R) compares how much money you risk against how much profit you target. A 1:2 R:R means risking $100 to make $200. A 1:3 R:R means risking $100 to make $300.',
    detailedExplanation: 'Mathematical Expectancy is: E = (Win Rate × Average Win) - (Loss Rate × Average Loss). If you take only 1:3 R:R trades, you only need a 30% win rate to be profitable. 100 trades with 30 wins ($300 each = +$9,000) and 70 losses ($100 each = -$7,000) yields a net profit of +$2,000 despite losing 70% of trades.',
    realMarketExample: 'Trader takes 10 trades risking $100 per trade at 1:3 R:R. Result: 4 Wins (+$1,200) and 6 Losses (-$600). Net Profit: +$600 (6% account growth) with only a 40% win rate.',
    keyPoints: [
      'Aim for a minimum planned Risk-to-Reward ratio of 1:2 on all trade setups.',
      'Asymmetric R:R eliminates the psychological pressure of needing to be right every time.',
      'Expectancy is the true measure of a trading edge, not raw win rate.',
      'Never cut winners early while letting losers run to maximum stop loss.',
    ],
    commonMistakes: [
      'Taking 1:0.5 R:R trades where one loss wipes out three winning trades.',
      'Moving take profit closer out of fear while refusing to accept stop losses.',
    ],
    relatedConcepts: ['Mathematical Expectancy', 'Win Rate vs R:R', 'Position Sizing', 'Journaling'],
  },
  {
    courseSlug: 'risk-management',
    level: 8,
    order: 3,
    title: 'Drawdown Management & Eliminating Risk of Ruin',
    slug: 'drawdown-management-and-risk-of-ruin',
    overview: 'Establish rigid daily, weekly, and total account drawdown circuit breakers to protect trading capital from catastrophic streaks.',
    simpleExplanation: 'Drawdown is the peak-to-trough decline in your account balance during a losing streak. Max Drawdown rules prevent a bad day or bad week from destroying months of accumulated profits.',
    detailedExplanation: 'The mathematics of drawdown recovery are asymmetric: A 10% loss requires an 11.1% gain to recover. A 50% loss requires a 100% gain just to break even. A 90% loss requires a 900% gain. Professional prop firms enforce a Max Daily Loss of 3-4% and Max Total Loss of 8-10%. If daily loss hits 3%, trading must immediately cease for the day.',
    realMarketExample: 'Account: $100,000. Daily Max Loss: 3% ($3,000). Trader loses 3 trades in a row risking 1% each (-$3,000 total). The circuit breaker triggers, the trader closes the platform, reviews journal logs, and returns the next day with a refreshed, objective mindset.',
    keyPoints: [
      'Drawdown recovery mathematics are non-linear; protect capital at all costs.',
      'Enforce a strict Daily Max Loss limit (e.g. 3%) and Max Loss per trade (1%).',
      'If you hit your daily limit, stop trading immediately to avoid emotional spiral.',
      'Reduce position sizing by 50% during extended losing streaks until consistency returns.',
    ],
    commonMistakes: [
      'Revenge trading after two losses and blowing the account in a single afternoon.',
      'Failing to have a predefined daily stop-loss limit for the entire account.',
    ],
    relatedConcepts: ['Circuit Breakers', 'Account Longevity', 'Prop Firm Rules', 'Capital Preservation'],
  },

  // ==========================================
  // LEVEL 9: TRADING PSYCHOLOGY
  // ==========================================
  {
    courseSlug: 'trading-psychology',
    level: 9,
    order: 1,
    title: 'Conquering FOMO, Greed, and Revenge Trading',
    slug: 'conquering-fomo-greed-revenge-trading',
    overview: 'Identify and neutralize the three most destructive psychological impulses that cause traders to blow accounts.',
    simpleExplanation: 'FOMO (Fear Of Missing Out) makes you chase trades after price has already moved. Greed makes you overleverage. Revenge trading makes you aggressively enter new trades immediately after a loss to "win back" money.',
    detailedExplanation: 'These behaviors are governed by the amygdala (emotional fight-or-flight center) rather than the prefrontal cortex (logical planning). When you suffer a loss, your brain perceives it as a personal attack, tempting you to double your lot size and enter immediately. Professional traders enforce mandatory 30-minute cooldown periods after any loss and refuse to chase candles that have left their entry zone.',
    realMarketExample: 'Gold surges $30 in 5 minutes. Retail trader experiences extreme FOMO and buys at the very top ($2,400). Price immediately drops $15 into discount, stopping them out. Frustrated, the trader opens a 2x lot size SELL order, getting whipsawed again.',
    keyPoints: [
      'FOMO leads to buying the top and selling the bottom; wait patiently for pullbacks.',
      'Revenge trading is the #1 cause of blown trading accounts.',
      'Institute a mandatory 30-minute cooling-off rule after any stop loss is hit.',
      'The market offers thousands of opportunities every year; missing one trade means nothing.',
    ],
    commonMistakes: [
      'Looking at trading social media and feeling inadequate about other people\'s claimed profits.',
      'Entering unplanned trades simply out of boredom during slow consolidation hours.',
    ],
    relatedConcepts: ['Emotional Discipline', 'Trading Rules', 'Revenge Trading', 'Patience'],
  },
  {
    courseSlug: 'trading-psychology',
    level: 9,
    order: 2,
    title: 'Developing Professional Discipline & Loss Acceptance',
    slug: 'discipline-and-loss-acceptance',
    overview: 'Adopt the probabilistic mindset of a casino operator: accepting losses as normal business expenses and executing flawlessly.',
    simpleExplanation: 'A casino does not panic when a player wins a hand of blackjack because the casino knows its mathematical edge will prevail over 10,000 hands. As a trader, individual trade outcomes are random, but your edge is consistent over a large sample size.',
    detailedExplanation: 'Mark Douglas in "Trading in the Zone" highlighted the core truth: "Anything can happen on any given trade." When you fully accept that a loss does not mean you are a bad trader—it is simply a routine cost of doing business—you eliminate fear, hesitation, and anxiety from your execution. You execute setups like a disciplined risk management machine.',
    realMarketExample: 'A professional executes 20 trades according to their SMC playbook. 11 hit TP and 9 hit SL. The trader executes every setup with identical calm composure, resulting in a +13% net monthly gain.',
    keyPoints: [
      'Trade outcomes are probabilistic; never judge your skill based on a single trade result.',
      'Losses are the standard operating expenses of a trading business.',
      'Consistency is not about never losing; it is about executing your rules without deviation.',
      'Log every emotional trigger and setup rationale in your KKN Trading Journal.',
    ],
    commonMistakes: [
      'Abandoning a proven strategy after 2 or 3 normal losses (strategy hopping).',
      'Equating self-worth to daily profit and loss figures.',
    ],
    relatedConcepts: ['Probabilistic Thinking', 'Mark Douglas', 'Trading Journal', 'Process Over Outcome'],
  },

  // ==========================================
  // LEVEL 10: STRATEGY BUILDING
  // ==========================================
  {
    courseSlug: 'strategy-building',
    level: 10,
    order: 1,
    title: 'Constructing a Rule-Based Execution Checklist',
    slug: 'rule-based-execution-checklist',
    overview: 'Build a systematic, non-discretionary trading checklist with clear entry criteria, stop loss placement, and profit targets.',
    simpleExplanation: 'A trading strategy is not a vague feeling; it is an objective rulebook. If all conditions on your checklist are checked (Yes/Yes/Yes), you enter. If even one rule is violated, you stay in cash.',
    detailedExplanation: 'A complete institutional trading playbook contains 5 non-negotiable components: 1) Market & Timeframe selection; 2) Directional Bias condition (HTF Trend & Key Level); 3) Trigger Condition (Liquidity Sweep + CHoCH on 5m); 4) Invalidation Rule (Stop Loss beyond swing extreme); 5) Target Objective (Next unmitigated liquidity pool with minimum 1:2 R:R).',
    realMarketExample: 'KKN SMC Day Trading Checklist: [1] Higher Timeframe 4H Demand reached? YES. [2] 15m Liquidity Sweep confirmed? YES. [3] 5m CHoCH with FVG formed? YES. [4] Entry at 50% FVG? YES. [5] Stop Loss 2 pips below swing low? YES. [6] Minimum 1:2.5 R:R? YES. -> EXECUTE ORDER.',
    keyPoints: [
      'A robust trading plan leaves zero room for emotional guesswork.',
      'Every trade must have a predefined Stop Loss and Take Profit before hitting Buy or Sell.',
      'No checklist match = No trade. Cash is a valid and profitable position.',
      'Review your execution checklist weekly to eliminate rule deviations.',
    ],
    commonMistakes: [
      'Entering a trade and then trying to figure out where to place the Stop Loss afterward.',
      'Modifying trading rules on the fly during live market hours.',
    ],
    relatedConcepts: ['Trading Plan', 'Checklist Execution', 'Backtesting', 'Mathematical Edge'],
  },
  {
    courseSlug: 'strategy-building',
    level: 10,
    order: 2,
    title: 'The Art of Rigorous Historical Backtesting',
    slug: 'the-art-of-historical-backtesting',
    overview: 'Learn how to backtest trading setups across 100+ historical market cycles to verify edge, drawdown, and statistical expectancy.',
    simpleExplanation: 'Backtesting is testing your trading rules on historical chart data without hindsight bias to prove that your strategy generates consistent profit before risking real virtual or live funds.',
    detailedExplanation: 'Use the KKN Backtesting Lab or TradingView Bar Replay. Step through candle by candle, record every entry, exit, win/loss, R:R, and drawdown in a spreadsheet across at least 100 trades spanning different market regimes (trending, ranging, high volatility, low volatility). Calculate your win rate, average R:R, max consecutive losses, and profit factor.',
    realMarketExample: 'Backtesting EUR/USD London Open SMC strategy across 12 months: 140 total trades, 56 wins (40%), 84 losses (60%), average win 1:3 R:R. Net Result: +84R profit (+84% on 1% risk) over the year with a max drawdown of 5 consecutive losses.',
    keyPoints: [
      'Backtest at least 100 historical setups before taking any live or simulated demo trades.',
      'Use Bar Replay to eliminate hindsight bias and simulate realistic decision-making.',
      'Track Profit Factor (Total Gross Wins / Total Gross Losses; aim for > 1.75).',
      'Confidence in live trading comes directly from the statistical evidence of backtesting.',
    ],
    commonMistakes: [
      'Peeking ahead at future candles during backtesting and claiming 95% win rates.',
      'Giving up on backtesting after only 5 or 10 trade samples.',
    ],
    relatedConcepts: ['Backtesting Lab', 'Profit Factor', 'Statistical Edge', 'Expectancy'],
  },

  // ==========================================
  // LEVEL 11: TRADE MANAGEMENT
  // ==========================================
  {
    courseSlug: 'trade-management',
    level: 11,
    order: 1,
    title: 'Scaling Out Partials & Moving to Breakeven',
    slug: 'scaling-partials-and-breakeven',
    overview: 'Learn the institutional mechanics of securing partial profits at Key Liquidity targets and moving Stop Loss to Breakeven (BE).',
    simpleExplanation: 'Trade management is what you do after you enter. Scaling out means closing a portion of your trade (e.g. 50% or 75%) when price reaches the first major target to bank guaranteed profit and eliminate risk.',
    detailedExplanation: 'When price achieves 1:2 R:R or reaches the nearest major liquidity pool (TP1), close 50% of the position volume. Simultaneously move the Stop Loss on the remaining 50% to the entry price (Breakeven / BE). The trade is now 100% risk-free: You have banked profit and the remaining position can run towards higher timeframe macro targets (TP2 / TP3).',
    realMarketExample: 'You open 1.00 Lot on EUR/USD at 1.0800 with SL at 1.0780 (20 pips risk = $200). Price rallies to 1.0840 (+40 pips, 1:2 R:R). You close 0.50 lots (+40 pips × $5 = +$200 banked) and move SL on the remaining 0.50 lots to 1.0800 (Breakeven). If price reverses, you still finish the trade with +$200 profit.',
    keyPoints: [
      'Take partial profits at TP1 (e.g. 50% volume at 1:2 R:R or nearest swing liquidity).',
      'Move Stop Loss to Breakeven only after structural confirmation or TP1 is reached.',
      'Do not move to Breakeven too early (e.g. at +5 pips) or normal market breath will stop you out prematurely.',
      'A "risk-free" runner gives you effortless psychological peace of mind.',
    ],
    commonMistakes: [
      'Moving Stop Loss to Breakeven immediately after entering, causing constant premature stop-outs.',
      'Refusing to take any profits and watching a +3R winner turn all the way back into a full loss.',
    ],
    relatedConcepts: ['Breakeven Management', 'Scaling Out', 'Multiple Take Profits', 'Trade Execution'],
  },
  {
    courseSlug: 'trade-management',
    level: 11,
    order: 2,
    title: 'Trailing Stop Loss Strategies & Exits',
    slug: 'trailing-stop-loss-and-exits',
    overview: 'Maximize windfall trend expansions by systematically trailing Stop Losses along protected structural swing points.',
    simpleExplanation: 'A Trailing Stop moves your stop loss behind price as the trend advances. In an uptrend, you move your stop loss below each newly formed Higher Low.',
    detailedExplanation: 'Rather than using a fixed pip distance for trailing stops, professional price action traders use Structural Trailing Stops. In a long position, as price breaks market structure (BOS) and forms a new confirmed Higher Low, the Stop Loss is relocated just below that new Higher Low. This locks in progressive profits while giving the asset room to breathe through minor pullbacks.',
    realMarketExample: 'Long on Gold from $2,320. Price rallies to $2,360, pulls back to $2,345 (HL), then breaks to $2,390 (BOS). Trader trails Stop Loss from Breakeven ($2,320) up to $2,342 (below the new HL), locking in +$22/oz of guaranteed profit.',
    keyPoints: [
      'Trail stops along validated structural swing points (HL in longs, LH in shorts).',
      'Never trail stops tighter than the structural noise of your trading timeframe.',
      'Allow the market to take you out at structural trend exhaustion rather than guessing the exact top.',
      'Combine partial profit taking with a trailed runner for optimal balance.',
    ],
    commonMistakes: [
      'Trailing stop loss so tightly that normal candle wicks trigger premature exits.',
      'Moving a trailing stop backward in the wrong direction when price starts pulling back.',
    ],
    relatedConcepts: ['Trailing Stop', 'Trend Following', 'Structural Exits', 'Profit Maximization'],
  },

  // ==========================================
  // LEVEL 12: ADVANCED INSTITUTIONAL ANALYSIS
  // ==========================================
  {
    courseSlug: 'advanced-analysis',
    level: 12,
    order: 1,
    title: 'Top-Down Multi-Timeframe Alignment',
    slug: 'top-down-multi-timeframe-alignment',
    overview: 'Synthesize Monthly, Weekly, Daily, 4H, and 15m charts into a single unified institutional trading narrative.',
    simpleExplanation: 'Top-down analysis is the ultimate skill of elite traders. You start at the highest macro view (Monthly/Weekly) to establish major bias and institutional order flow, and drill down to the 5m/1m for sniper execution.',
    detailedExplanation: 'The 4-Tier Analysis Framework: 1) Monthly/Weekly defines the Macro Curve and multi-month Order Blocks; 2) Daily/4H establishes the current intermediate trend, liquidity pools, and premium/discount zones; 3) 1H/15m locates the intraday trading range, Asian session boundaries, and key displacement; 4) 5m/1m provides the execution trigger (Liquidity Sweep + CHoCH + FVG retest). When all 4 tiers point in the same direction, setups achieve 70%+ win rates with massive R:R.',
    realMarketExample: 'Weekly: Bullish Order Block bounce. Daily: Bullish market structure with consecutive Higher Highs. 4H: Retraced into 62% Discount FVG. 15m: Asian Low swept at London Open. 5m: Bullish CHoCH confirmed. Long executed with 8-pip Stop Loss targeting Weekly swing high (120 pips reward = 1:15 R:R).',
    keyPoints: [
      'Higher timeframes always dictate the path of least resistance.',
      'Lower timeframes provide the timing and risk refinement.',
      'When HTF and LTF conflict, HTF will win 9 times out of 10.',
      'Mastering top-down analysis creates complete clarity and eliminates emotional hesitation.',
    ],
    commonMistakes: [
      'Ignoring a major Weekly resistance zone because a 5-minute chart looks bullish.',
      'Over-complicating charts with conflicting indicators instead of clean multi-timeframe structure.',
    ],
    relatedConcepts: ['Top-Down Analysis', 'Fractal Flow', 'Multi-Timeframe Mastery', 'Institutional Edge'],
  },
  {
    courseSlug: 'advanced-analysis',
    level: 12,
    order: 2,
    title: 'Intermarket Correlations & Institutional Execution Models',
    slug: 'intermarket-correlations-and-execution',
    overview: 'Understand how global macro assets (US Dollar Index / DXY, US 10-Year Yields, Gold, S&P 500) interact and confirm high-probability institutional setups.',
    simpleExplanation: 'Financial markets are deeply interconnected. When the US Dollar (DXY) rallies strongly, Gold and EUR/USD typically drop. Understanding intermarket relationships gives you an unfair advantage in confirming directional setups.',
    detailedExplanation: 'The Core Macro Correlations: 1) US Dollar Index (DXY) vs EUR/USD & GBP/USD (Strong Inverse Correlation); 2) DXY & Real Yields vs Gold (XAU/USD) (Inverse Correlation); 3) S&P 500 / NASDAQ vs USD/JPY (Risk-On / Risk-Off dynamics). By checking the DXY chart for liquidity sweeps and structural breaks, you gain direct confirmation for EUR/USD and Gold trade setups before retail traders even notice.',
    realMarketExample: 'DXY approaches a major Daily resistance and sweeps equal highs, forming a clean 15m Bearish CHoCH. At the exact same minute, EUR/USD sweeps equal lows and forms a Bullish CHoCH. The DXY weakness confirms the EUR/USD long with 99% conviction.',
    keyPoints: [
      'DXY (Dollar Index) is the king of intermarket currency analysis.',
      'Use SMT Divergence (Smart Money Tool): When DXY makes a Higher High but EUR/USD fails to make a Lower Low, institutional divergence is confirmed.',
      'Monitor 10-Year US Treasury Yields (US10Y) for interest rate direction.',
      'This level advances students through the KKN 20-Level Institutional Curriculum.',
    ],
    commonMistakes: [
      'Trading EUR/USD, GBP/USD, and Gold all in the same direction without realizing they are all effectively the same single US Dollar bet.',
      'Ignoring DXY key levels when trading major FX pairs.',
    ],
    relatedConcepts: ['DXY Index', 'SMT Divergence', 'Intermarket Analysis', 'Institutional Execution Models'],
  },
];

const SEED_QUIZZES = [
  // Level 1 Quiz
  {
    courseSlug: 'trading-basics',
    title: 'Level 1: Trading Basics & Terminology Mastery Quiz',
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
        explanation: 'In most currency pairs, 1 Pip represents the 4th decimal place (0.0001). For Japanese Yen pairs, it is the 2nd decimal place (0.01).',
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
        explanation: '1 Standard Lot equals 100,000 units of the base currency ($10 per pip on EUR/USD).',
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
        explanation: 'Going SHORT (selling) allows a trader to profit as the price of an asset declines.',
      },
    ],
  },
  // Level 2 Quiz
  {
    courseSlug: 'market-basics',
    title: 'Level 2: Market Basics & Sessions Assessment',
    questions: [
      {
        question: 'Which trading session overlap typically produces the highest daily volume and liquidity in global FX?',
        options: [
          { id: 'a', text: 'Sydney and Tokyo overlap' },
          { id: 'b', text: 'London and New York overlap' },
          { id: 'c', text: 'Tokyo and London overlap' },
          { id: 'd', text: 'New York and Sydney overlap' },
        ],
        correctOptionId: 'b',
        explanation: 'The London and New York overlap (12:00 - 16:00 GMT) generates over 50% of total daily global forex turnover.',
      },
      {
        question: 'What role do Tier-1 Commercial Banks primarily play in financial markets?',
        options: [
          { id: 'a', text: 'Retail day trading scalpers' },
          { id: 'b', text: 'Market Makers providing interbank liquidity' },
          { id: 'c', text: 'Government regulatory bodies' },
          { id: 'd', text: 'Discount retail brokers' },
        ],
        correctOptionId: 'b',
        explanation: 'Tier-1 commercial banks act as market makers, quoting bid and ask prices and providing liquidity across the interbank network.',
      },
    ],
  },
  // Level 3 Quiz
  {
    courseSlug: 'candlesticks-and-charts',
    title: 'Level 3: Candlestick Reading & Multi-Timeframe Quiz',
    questions: [
      {
        question: 'What does a long lower wick on a candlestick indicate at a key support zone?',
        options: [
          { id: 'a', text: 'Strong selling continuation' },
          { id: 'b', text: 'Aggressive buying rejection of lower prices' },
          { id: 'c', text: 'A broken broker data feed' },
          { id: 'd', text: 'Indecision with zero volume' },
        ],
        correctOptionId: 'b',
        explanation: 'A long lower wick shows that sellers attempted to push price lower, but responsive buyers stepped in aggressively to bid price back up before the close.',
      },
      {
        question: 'Why do professional traders analyze Higher Timeframes (Daily/4H) first?',
        options: [
          { id: 'a', text: 'Because lower timeframes do not have candlesticks' },
          { id: 'b', text: 'To establish dominant trend direction and major institutional key levels' },
          { id: 'c', text: 'To trade with zero leverage' },
          { id: 'd', text: 'Because indicators only work on Daily charts' },
        ],
        correctOptionId: 'b',
        explanation: 'Higher timeframes establish macro trend direction and key zones, filtering out low-timeframe market noise.',
      },
    ],
  },
  // Level 4 Quiz
  {
    courseSlug: 'technical-analysis',
    title: 'Level 4: Technical Analysis & Key Zones Quiz',
    questions: [
      {
        question: 'What is "Role Reversal" in technical analysis?',
        options: [
          { id: 'a', text: 'Switching from long to short randomly' },
          { id: 'b', text: 'When broken support flips to become new resistance, or broken resistance becomes support' },
          { id: 'c', text: 'Reversing your account balance' },
          { id: 'd', text: 'Changing trading platforms' },
        ],
        correctOptionId: 'b',
        explanation: 'Role reversal occurs when a broken horizontal support level turns into a resistance ceiling upon retest, or vice versa.',
      },
      {
        question: 'What does Bearish RSI Divergence indicate?',
        options: [
          { id: 'a', text: 'Price is making Lower Lows and RSI is at 0' },
          { id: 'b', text: 'Price is making Higher Highs while RSI is making Lower Highs (waning upward momentum)' },
          { id: 'c', text: 'A guaranteed market crash in 10 seconds' },
          { id: 'd', text: 'The 200 EMA is crossing the 50 EMA' },
        ],
        correctOptionId: 'b',
        explanation: 'Bearish divergence occurs when price pushes to a higher high, but momentum (RSI) registers a lower high, warning of exhausting buying pressure.',
      },
    ],
  },
  // Level 5 Quiz
  {
    courseSlug: 'price-action',
    title: 'Level 5: Price Action & Market Structure Quiz',
    questions: [
      {
        question: 'How is a confirmed bullish uptrend defined in pure price action?',
        options: [
          { id: 'a', text: 'Consecutive Lower Highs and Lower Lows' },
          { id: 'b', text: 'Consecutive Higher Highs (HH) and Higher Lows (HL)' },
          { id: 'c', text: 'Price staying flat between two lines' },
          { id: 'd', text: 'All green candles with no wicks' },
        ],
        correctOptionId: 'b',
        explanation: 'A bullish trend is structurally defined by consecutive Higher Highs (impulse legs) and Higher Lows (retracements).',
      },
      {
        question: 'When looking for a high-probability BUY trade, what pricing zone should you target?',
        options: [
          { id: 'a', text: 'Premium Zone (> 50% Equilibrium)' },
          { id: 'b', text: 'Discount Zone (< 50% Equilibrium / Golden Pocket)' },
          { id: 'c', text: 'The absolute highest wick of the year' },
          { id: 'd', text: 'Any random price during high volatility' },
        ],
        correctOptionId: 'b',
        explanation: 'Institutions buy at wholesale Discount prices (< 50% Equilibrium) to maximize risk-to-reward.',
      },
    ],
  },
  // Level 6 Quiz
  {
    courseSlug: 'smc-ict-concepts',
    title: 'Level 6: SMC & Liquidity Concepts Assessment',
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
        explanation: 'Buy-Side Liquidity (BSL) rests above swing highs, where short sellers place stop-losses (buy stops) and breakout traders place buy stop orders.',
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
        explanation: 'BOS confirms the continuation of the current trend (making higher highs or lower lows), while CHoCH signals a structural reversal when a key swing low/high is breached.',
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
        explanation: 'A bullish FVG occurs when the high wick of Candle 1 does not overlap with the low wick of Candle 3, leaving an unmitigated price void in the large middle displacement candle.',
      },
    ],
  },
  // Level 7 Quiz
  {
    courseSlug: 'fundamental-analysis',
    title: 'Level 7: Macroeconomics & Economic Calendar Quiz',
    questions: [
      {
        question: 'When a central bank adopts a "Hawkish" monetary policy stance by raising interest rates, what is the typical currency effect?',
        options: [
          { id: 'a', text: 'The currency weakens rapidly' },
          { id: 'b', text: 'The currency strengthens as capital seeks higher bond yields' },
          { id: 'c', text: 'Gold spikes by $100 instantly' },
          { id: 'd', text: 'All trading ceases globally' },
        ],
        correctOptionId: 'b',
        explanation: 'Higher interest rates attract foreign capital seeking yield, driving up demand and strengthening the national currency.',
      },
      {
        question: 'Why is it dangerous to execute market orders in the exact second of an NFP release?',
        options: [
          { id: 'a', text: 'Brokers disable charts' },
          { id: 'b', text: 'Bid/ask spreads widen dramatically and slippage can trigger major unexpected losses' },
          { id: 'c', text: 'NFP data is always inaccurate' },
          { id: 'd', text: 'Orders cannot be placed on Fridays' },
        ],
        correctOptionId: 'b',
        explanation: 'Extreme volatility during high-impact news causes liquidity to dry up, widening spreads and causing substantial execution slippage.',
      },
    ],
  },
  // Level 8 Quiz
  {
    courseSlug: 'risk-management',
    title: 'Level 8: Risk Management & Capital Preservation Quiz',
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
        explanation: 'Limiting risk to 1% to 2% ensures you can endure inevitable losing streaks without triggering severe drawdowns or risking account ruin.',
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
        explanation: 'Lot Size = $100 / (25 pips × $10) = 0.40 Lots. This guarantees that hitting Stop Loss loses exactly $100 (1%).',
      },
    ],
  },
  // Level 9 Quiz
  {
    courseSlug: 'trading-psychology',
    title: 'Level 9: Trading Psychology & Emotional Mastery Quiz',
    questions: [
      {
        question: 'What is the most effective immediate protocol to prevent revenge trading after taking a loss?',
        options: [
          { id: 'a', text: 'Double position size and enter the opposite direction immediately' },
          { id: 'b', text: 'Enforce a mandatory 30-minute cooldown period away from the charts' },
          { id: 'c', text: 'Deposit more funds immediately' },
          { id: 'd', text: 'Switch to a 1-second timeframe' },
        ],
        correctOptionId: 'b',
        explanation: 'A mandatory cooldown disconnects the emotional fight-or-flight response and restores rational, probabilistic decision making.',
      },
      {
        question: 'How does an elite trader view trading losses?',
        options: [
          { id: 'a', text: 'As personal failures that must be avenged' },
          { id: 'b', text: 'As routine, expected business expenses required to extract positive mathematical expectancy' },
          { id: 'c', text: 'As proof that trading is rigged' },
          { id: 'd', text: 'As reasons to change strategies every week' },
        ],
        correctOptionId: 'b',
        explanation: 'Losses are simply the operating costs of doing business in a probabilistic market environment.',
      },
    ],
  },
  // Level 10 Quiz
  {
    courseSlug: 'strategy-building',
    title: 'Level 10: Strategy Playbook & Backtesting Quiz',
    questions: [
      {
        question: 'What is the primary benefit of testing 100+ trades in the KKN Backtesting Lab?',
        options: [
          { id: 'a', text: 'To predict the future with 100% certainty' },
          { id: 'b', text: 'To statistically verify mathematical edge, win rate, and drawdown tolerance before risking capital' },
          { id: 'c', text: 'To earn virtual reward points' },
          { id: 'd', text: 'To memorize historical candle colors' },
        ],
        correctOptionId: 'b',
        explanation: 'Rigorous backtesting provides the empirical statistical proof required to execute rules with complete discipline in live markets.',
      },
      {
        question: 'What should you do if an upcoming market setup only meets 4 out of 5 criteria on your strategy checklist?',
        options: [
          { id: 'a', text: 'Take the trade anyway with double lot size' },
          { id: 'b', text: 'Stay in cash and wait for a setup that meets 100% of your rules' },
          { id: 'c', text: 'Delete the missing rule from your playbook' },
          { id: 'd', text: 'Flip a coin' },
        ],
        correctOptionId: 'b',
        explanation: 'Discipline requires adhering 100% to your playbook. No complete checklist match means no trade.',
      },
    ],
  },
  // Level 11 Quiz
  {
    courseSlug: 'trade-management',
    title: 'Level 11: Active Trade Management & Exits Quiz',
    questions: [
      {
        question: 'What is the primary advantage of taking partial profits (e.g. 50%) at TP1 and moving Stop Loss to Breakeven?',
        options: [
          { id: 'a', text: 'It guarantees the trade is completely risk-free while allowing remaining volume to run to macro targets' },
          { id: 'b', text: 'It doubles your broker commission' },
          { id: 'c', text: 'It forces the market to reverse' },
          { id: 'd', text: 'It closes the entire position' },
        ],
        correctOptionId: 'a',
        explanation: 'Scaling out secures profits in the bank and eliminates downside risk on the remaining position.',
      },
      {
        question: 'Where is the optimal structural location to trail your Stop Loss in an uptrend?',
        options: [
          { id: 'a', text: 'Exactly 2 pips behind the current live candle' },
          { id: 'b', text: 'Just below each newly confirmed Higher Low (HL)' },
          { id: 'c', text: 'At the bottom of the weekly chart' },
          { id: 'd', text: 'At random round numbers' },
        ],
        correctOptionId: 'b',
        explanation: 'Trailing stops below confirmed Higher Lows protects profits while giving the market room to complete normal retracements.',
      },
    ],
  },
  // Level 12 Quiz
  {
    courseSlug: 'advanced-analysis',
    title: 'Level 12: Advanced Institutional Analysis Master Quiz',
    questions: [
      {
        question: 'What does SMT (Smart Money Tool) divergence between DXY (Dollar Index) and EUR/USD indicate?',
        options: [
          { id: 'a', text: 'Both markets are broken' },
          { id: 'b', text: 'Institutional accumulation/distribution where one asset fails to make a correlated new extreme' },
          { id: 'c', text: 'Holiday low volume' },
          { id: 'd', text: 'A guaranteed 100-pip move in 5 seconds' },
        ],
        correctOptionId: 'b',
        explanation: 'SMT divergence reveals underlying institutional order flow manipulation before price explodes in the true direction.',
      },
      {
        question: 'What is the sequence of the AMD institutional market cycle?',
        options: [
          { id: 'a', text: 'Analysis -> Momentum -> Distribution' },
          { id: 'b', text: 'Accumulation (Asian range) -> Manipulation (London Judas swing) -> Distribution (NY trend expansion)' },
          { id: 'c', text: 'Average -> Median -> Deviation' },
          { id: 'd', text: 'Action -> Movement -> Decision' },
        ],
        correctOptionId: 'b',
        explanation: 'The AMD model (Accumulation, Manipulation, Distribution) is the benchmark institutional intraday session liquidity cycle.',
      },
    ],
  },
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
  },
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
      console.log('[Seed] Ready in resilient high-speed in-memory store mode (20 Levels, Quizzes & Demo accounts loaded).');
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
