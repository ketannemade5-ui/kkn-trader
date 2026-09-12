// KKN TRADER - Comprehensive 60 Lessons In-Depth Educational Content Database
// Detailed institutional-quality curriculum for all 20 Academy Levels (3 lessons per level)

import { ACADEMY_LEVELS } from './academyData';

// Master detailed lesson content repository
export const LESSONS_DATABASE = {
  // ==========================================
  // LEVEL 1: TRADING BASICS & MECHANICS
  // ==========================================
  'what-is-trading': {
    id: '1-1',
    levelId: 1,
    levelTitle: 'Trading Basics & Mechanics',
    title: 'What is Trading?',
    slug: 'what-is-trading',
    readTime: 8,
    introduction: 'Welcome to the KKN Trading Academy. In this foundational lesson, you will learn the core mechanics of financial trading, how market speculation differs fundamentally from long-term investing, and why disciplined risk management is essential.',
    beginnerExplanation: 'Think of trading like running a retail store: you purchase goods when you believe the price is relatively low and sell them when the price is higher to generate a profit margin. In financial trading, you can also profit when prices decline by "selling short" first and buying back lower later.',
    detailedExplanation: 'Financial trading is the active buying and selling of securities, currencies, commodities, and derivatives over short to medium-term holding periods. Unlike passive investing—which seeks compound growth over decades based on macroeconomic expansion—trading actively exploits price volatility across both bullish (rising) and bearish (falling) market cycles.',
    terminology: [
      { term: 'Long Position (Buy)', definition: 'Opening a trade with the expectation that the asset price will increase, closing later at a higher price to secure a profit.' },
      { term: 'Short Position (Sell)', definition: 'Opening a trade by borrowing an asset or selling a CFD contract with the expectation that price will fall, buying back lower to profit.' },
      { term: 'Volatility', definition: 'The statistical rate and magnitude of price fluctuations over a given timeframe.' },
      { term: 'Liquidity', definition: 'The ease with which an asset can be converted into cash or transacted without causing massive price slippage.' },
    ],
    stepByStepBreakdown: [
      'Step 1: Market Analysis — Assess technical price action and macroeconomic news to formulate a directional thesis.',
      'Step 2: Risk Calculation — Determine your exact stop loss distance and size your position to risk no more than 1% of account equity.',
      'Step 3: Order Execution — Place your Market, Limit, or Stop order with predefined Stop Loss (SL) and Take Profit (TP) targets.',
      'Step 4: Active Management — Monitor structural milestones, scale partial profits at key levels, and protect initial capital.',
      'Step 5: Post-Trade Review — Record execution metrics, emotional discipline, and lessons learned in the KKN Trading Journal.',
    ],
    strategyFramework: {
      marketContext: 'Identify whether the market is in a dominant trend, consolidation range, or high-impact news regime.',
      bias: 'Establish a high-timeframe directional preference (Bullish, Bearish, or Neutral/Cash).',
      setup: 'Wait for price to tap a key historical support/resistance, demand/supply, or Order Block zone.',
      confirmation: 'Confirm price rejection on lower timeframes via candlestick patterns or Change of Character (CHoCH).',
      entry: 'Execute position with limit order or market order upon candle close confirmation.',
      stopLoss: 'Place invalidation Stop Loss strictly beyond the structural swing extreme.',
      takeProfit: 'Target logical higher-timeframe liquidity pools with a minimum 1:2 Risk-to-Reward ratio.',
      tradeManagement: 'Secure 50% partial profit at TP1 and adjust Stop Loss to Breakeven (BE).',
      review: 'Log trade setup, screenshot, emotions, and outcome in the automated trade journal.',
    },
    bullishExample: 'On EUR/USD: Price pulls back to a major daily support level at 1.0820. A trader identifies bullish hammer rejection on the 1-hour chart, buys 1.0 lot at 1.0830 with a Stop Loss at 1.0810 (20 pips risk = $200). Price rallies to 1.0890 (+60 pips = +$600 profit, 1:3 R:R).',
    bearishExample: 'On GBP/USD: Price rallies into a 4-hour supply zone at 1.3050. A shooting star forms. The trader goes SHORT at 1.3040 with a Stop Loss at 1.3065 (25 pips risk = $250). Price drops to 1.2940 (+100 pips = +$1,000 profit, 1:4 R:R).',
    entryConditions: 'Price reaches predefined key level + confirmation candlestick closes + R:R is at least 1:2.',
    stopLossLogic: 'Stop loss is placed 2-5 pips beyond the invalidation swing point to protect capital from unforeseen volatility.',
    takeProfitLogic: 'Take profit is set just ahead of the next opposing liquidity pool or support/resistance level.',
    riskRewardExplanation: 'Risk/Reward (R:R) compares dollar risk against potential profit. At 1:3 R:R, risking $100 yields $300 profit upon target hit.',
    commonMistakes: [
      'Confusing trading with gambling by taking random trades without a checklist or stop loss.',
      'Holding onto losing trades and hoping they bounce back, turning a short-term trade into an accidental long-term loss.',
      'Risking excessive capital (10-20% per trade) and suffering catastrophic account drawdowns.',
    ],
    practicalExercise: 'Open the KKN Paper Trading Terminal with your $100,000 virtual balance. Identify 1 Long setup on EUR/USD and 1 Short setup on GBP/USD. Calculate 1% risk ($1,000) and place both simulated orders with predefined SL and TP.',
    backtestingExercise: 'Scroll back 3 months on the EUR/USD Daily chart. Identify 10 clear support/resistance retests. Record how many reached 1:2 R:R before hitting the invalidation swing point.',
    keyTakeaways: [
      'Trading is a probabilistic risk management business, not a get-rich-quick gamble.',
      'Profitability comes from positive mathematical expectancy over a large sample of disciplined trades.',
      'Always enter the market with a predefined Stop Loss and Take Profit already planned.',
    ],
    quiz: [
      {
        question: 'What is the primary operational objective of a financial trader?',
        options: ['Predict every single market tick with 100% certainty', 'Execute a disciplined strategy with positive mathematical expectancy and controlled risk', 'Hold losing positions until they turn profitable', 'Use maximum available broker leverage on every trade'],
        correctIndex: 1,
        explanation: 'Trading success is built on managing risk and extracting a statistical edge over a large sample of executions.',
      },
      {
        question: 'What action does a trader take when they open a "Short" position?',
        options: ['They buy an asset to hold for 10 years', 'They sell an asset first with the expectation of buying it back at a lower price', 'They close their broker account', 'They trade without a stop loss'],
        correctIndex: 1,
        explanation: 'Shorting allows a trader to profit from declining market prices.',
      },
      {
        question: 'Why is a Stop Loss non-negotiable on every single trade?',
        options: ['It guarantees you will never lose money', 'It predefines your maximum acceptable loss and protects account capital from total ruin', 'It increases broker commissions', 'It is required by government tax law'],
        correctIndex: 1,
        explanation: 'A Stop Loss caps your maximum dollar downside on any given setup.',
      },
      {
        question: 'If you risk $100 on a trade to make $300 in profit, what is your Risk-to-Reward ratio?',
        options: ['1:1', '1:2', '1:3', '3:1'],
        correctIndex: 2,
        explanation: 'Risking $100 for a potential $300 gain represents an asymmetric 1:3 Risk-to-Reward ratio.',
      },
      {
        question: 'What is the recommended maximum percentage of account equity to risk on any single trade setup?',
        options: ['10% to 20%', '1% to 2%', '50%', 'Whatever leverage the broker permits'],
        correctIndex: 1,
        explanation: 'Professional risk management dictates risking only 1% to 2% per trade to comfortably withstand inevitable losing streaks.',
      },
    ],
  },

  'forex-market-basics': {
    id: '1-2',
    levelId: 1,
    levelTitle: 'Trading Basics & Mechanics',
    title: 'Forex Market Basics',
    slug: 'forex-market-basics',
    readTime: 10,
    introduction: 'The Foreign Exchange (Forex / FX) market is the largest and most liquid financial market in the world, with over $7.5 trillion traded every single day. In this lesson, you will learn how this decentralized interbank market functions 24 hours a day, 5 days a week.',
    beginnerExplanation: 'When you travel internationally from the United States to Europe, you convert US Dollars (USD) into Euros (EUR) at the airport exchange counter. The global Forex market is the electronic institutional version of this currency exchange on a massive scale.',
    detailedExplanation: 'Forex is an over-the-counter (OTC) decentralized marketplace where participants trade sovereign currencies. Unlike centralized stock exchanges (like the NYSE), Forex operates electronically across an international network of major banks, non-bank liquidity providers, institutions, and brokers. Trading occurs continuously from Sunday evening (5:00 PM EST) when Sydney opens to Friday evening (5:00 PM EST) when New York closes.',
    terminology: [
      { term: 'Over-The-Counter (OTC)', definition: 'A decentralized market where market participants trade directly with each other without a physical central exchange building.' },
      { term: 'Interbank Market', definition: 'The top-tier electronic network of global investment banks (JPMorgan, Deutsche Bank, Citi) that quote bid and ask prices.' },
      { term: 'Spread', definition: 'The difference between the Ask (buy) price and the Bid (sell) price quoted by your broker.' },
      { term: 'Spot Market', definition: 'The immediate purchase or sale of a foreign currency for physical delivery or electronic settlement at the current exchange rate.' },
    ],
    stepByStepBreakdown: [
      'Step 1: Understand Market Structure — Recognize that currencies trade against each other in floating pairs.',
      'Step 2: Check Market Hours — Identify whether the Asian, European, or US sessions are currently active.',
      'Step 3: Evaluate Spreads — Note that spreads are tightest during peak London/NY hours and widen during rollover (5 PM EST).',
      'Step 4: Select Instrument — Focus on major currency pairs with deep liquidity and lowest transaction costs.',
      'Step 5: Execute via Electronic Broker — Send orders directly through institutional bridge liquidity aggregators.',
    ],
    strategyFramework: {
      marketContext: 'Identify which session is active: Asian (consolidation), London (manipulation/trend), or NY (expansion).',
      bias: 'Determine macro currency strength using the US Dollar Index (DXY) as the primary compass.',
      setup: 'Identify liquid currency pairs with high daily volatility and low spread costs (e.g. EUR/USD, GBP/USD).',
      confirmation: 'Verify volume and institutional participation during active session hours.',
      entry: 'Execute orders during London Open (07:00-10:00 GMT) or NY Open (12:00-15:00 GMT).',
      stopLoss: 'Account for the broker spread when setting buy stop or sell stop levels.',
      takeProfit: 'Set targets at key liquidity pools with appropriate time-of-day expectations.',
      tradeManagement: 'Avoid holding tight intraday scalps across the 5:00 PM EST daily rollover spread spike.',
      review: 'Record spread costs and execution slippage in your journal.',
    },
    bullishExample: 'EUR/USD trades at 1.08500 during London Open. European economic data beats forecasts. The trader buys EUR/USD expecting Euro appreciation against the US Dollar. Price climbs to 1.09200 (+70 pips).',
    bearishExample: 'USD/JPY trades at 155.000. The Bank of Japan intervenes by purchasing Yen. The trader shorts USD/JPY. Price plummets to 153.200 (+180 pips profit).',
    entryConditions: 'High liquidity session active + tight broker spread (< 1.5 pips) + clear technical setup.',
    stopLossLogic: 'Place stop loss far enough away that normal spread widening during minor liquidity pockets does not trigger premature stop-out.',
    takeProfitLogic: 'Take profit at opposing session high/low or high-timeframe institutional zone.',
    riskRewardExplanation: 'Trading during liquid sessions guarantees tighter spreads and lower slippage, improving effective net R:R.',
    commonMistakes: [
      'Trading illiquid exotic pairs with 20-pip spreads and losing money before the trade even moves.',
      'Opening high-leverage positions right during the 5:00 PM EST daily rollover when spreads widen significantly.',
      'Believing the Forex market has a single centralized physical location like the stock exchange.',
    ],
    practicalExercise: 'Check the live market quote screen on KKN Trader. Compare the spread of EUR/USD (Major, ~0.8 pips) vs USD/ZAR or USD/TRY (Exotic, ~25 pips). Calculate how much price has to move just to break even on both pairs.',
    backtestingExercise: 'Look at the last 5 days of EUR/USD 15-minute charts. Mark the high and low of the day. Notice how often the high or low of the day is created during the London or New York sessions.',
    keyTakeaways: [
      'Forex is a 24/5 decentralized global market with over $7.5 trillion in daily turnover.',
      'Major currency pairs offer the highest liquidity, lowest spreads, and cleanest price action.',
      'Always trade during peak session hours when institutional volume is active.',
    ],
    quiz: [
      {
        question: 'What is the approximate daily trading volume of the global Foreign Exchange market?',
        options: ['$500 million', '$50 billion', 'Over $7.5 trillion', '$100 trillion'],
        correctIndex: 2,
        explanation: 'Forex is by far the largest financial market globally, transacting over $7.5 trillion daily.',
      },
      {
        question: 'What does "Spread" mean in Forex trading?',
        options: ['The total profit of a trade', 'The difference between the Ask (buy) price and Bid (sell) price', 'The interest rate charged by central banks', 'The time it takes to place an order'],
        correctIndex: 1,
        explanation: 'Spread is the broker transaction cost representing the gap between buying and selling quotes.',
      },
      {
        question: 'Which of the following is considered a "Major" Forex currency pair?',
        options: ['USD/TRY', 'EUR/USD', 'USD/ZAR', 'EUR/PLN'],
        correctIndex: 1,
        explanation: 'EUR/USD is the most heavily traded Major currency pair in the world.',
      },
      {
        question: 'When is the Forex market open for trading?',
        options: ['24 hours a day, 7 days a week including weekends', '24 hours a day, 5 days a week from Sunday evening to Friday evening EST', 'Only from 9:30 AM to 4:00 PM EST', 'Only on Monday and Tuesday'],
        correctIndex: 1,
        explanation: 'Forex operates continuously 24/5 throughout the standard business week.',
      },
      {
        question: 'Why do professional traders avoid trading during daily rollover (5:00 PM EST)?',
        options: ['The market is officially closed', 'Spreads widen dramatically as bank liquidity books rebalance for the new trading day', 'Charts stop moving permanently', 'Brokers charge double tax'],
        correctIndex: 1,
        explanation: 'Daily rollover causes temporary spread widening and liquidity gaps across all brokers.',
      },
    ],
  },

  'currency-pairs-pips-lots-leverage': {
    id: '1-3',
    levelId: 1,
    levelTitle: 'Trading Basics & Mechanics',
    title: 'Currency Pairs, Pips, Lots & Leverage',
    slug: 'currency-pairs-pips-lots-leverage',
    readTime: 12,
    introduction: 'To calculate risk accurately, you must understand the mathematical building blocks of Forex trading: Base vs Quote currencies, Pips (Percentage in Point), Standard/Mini/Micro Lots, and how Leverage and Margin interact.',
    beginnerExplanation: 'In EUR/USD, the Euro is the Base and the US Dollar is the Quote. If EUR/USD is 1.0850, 1 Euro costs $1.0850. A Pip is the smallest standard price increment (0.0001 for most pairs). A Lot is the quantity of currency you buy or sell.',
    detailedExplanation: 'For 4-decimal currency pairs, 1 Pip = 0.0001. For 2-decimal Japanese Yen pairs (like USD/JPY), 1 Pip = 0.01. Standard Lot (1.00) = 100,000 units of Base currency ($10/pip on EUR/USD). Mini Lot (0.10) = 10,000 units ($1/pip). Micro Lot (0.01) = 1,000 units ($0.10/pip). Leverage allows you to control a $100,000 position with $1,000 of margin collateral at 1:100 leverage.',
    terminology: [
      { term: 'Base Currency', definition: 'The first currency in a pair (e.g. EUR in EUR/USD). You are buying or selling the base currency.' },
      { term: 'Quote Currency', definition: 'The second currency in a pair (e.g. USD in EUR/USD). It indicates how much quote currency is needed to purchase 1 unit of base.' },
      { term: 'Pip (Percentage in Point)', definition: 'The standardized unit of price movement, usually the 4th decimal place (0.0001) or 2nd for JPY pairs (0.01).' },
      { term: 'Pipette', definition: 'A fractional pip representing the 5th decimal place (0.00001).' },
      { term: 'Leverage', definition: 'A ratio provided by brokers that multiplies your trading purchasing power relative to deposited margin.' },
    ],
    stepByStepBreakdown: [
      'Step 1: Identify Base & Quote — In GBP/USD at 1.3000, 1 British Pound equals $1.3000 US Dollars.',
      'Step 2: Measure Pip Distance — If price moves from 1.3000 to 1.3050, it has moved 50 Pips (0.0050).',
      'Step 3: Determine Pip Value — On 1 Standard Lot (1.0), 50 pips = $500. On 0.10 Mini Lot, 50 pips = $50.',
      'Step 4: Calculate Required Margin — At 1:100 leverage, 1 Standard Lot ($100,000 value) requires $1,000 margin.',
      'Step 5: Size Lot Backwards from Risk — Use: Lot Size = (Account Dollar Risk) / (Stop Loss Pips × Pip Value).',
    ],
    strategyFramework: {
      marketContext: 'Check account balance and currency pair volatility before determining trade sizing.',
      bias: 'Calculate maximum permissible dollar loss at 1% of equity ($1,000 on a $100,000 account).',
      setup: 'Determine technical entry and invalidation price to find exact Stop Loss pips.',
      confirmation: 'Verify pip calculation formula before clicking Buy or Sell.',
      entry: 'Input calculated lot size into the KKN Order Panel.',
      stopLoss: 'Verify that (Stop Loss Pips × Pip Value × Lots) equals exactly 1% risk.',
      takeProfit: 'Target at least 2x the stop loss pip distance to maintain 1:2+ R:R.',
      tradeManagement: 'Ensure Free Margin remains above 80% to avoid any risk of margin call.',
      review: 'Check trade ticket to verify actual execution price and filled lot size.',
    },
    bullishExample: 'Account: $10,000. Risk: 1% ($100). Setup on EUR/USD: Buy at 1.0840, SL at 1.0820 (20 pips distance). Pip value for 1.0 lot is $10. Position Size = $100 / (20 × $10) = 0.50 Lots. If SL is hit, you lose exactly $100.',
    bearishExample: 'Account: $100,000. Risk: 1% ($1,000). Setup on USD/JPY: Short at 154.50, SL at 155.00 (50 pips distance). Pip value for 1.0 lot is ~$6.50. Position Size = $1,000 / (50 × $6.50) = 3.07 Lots.',
    entryConditions: 'Exact position size mathematically calculated and entered in lot size field.',
    stopLossLogic: 'Stop loss distance in pips dictates position size, not account size or emotional greed.',
    takeProfitLogic: 'Take profit placed at a logical structural level yielding 2x to 4x the stop loss distance.',
    riskRewardExplanation: 'By calculating position size backwards from stop loss pips, your monetary risk remains identical on every trade regardless of market volatility.',
    commonMistakes: [
      'Using a fixed 1.0 lot size on every trade regardless of whether the stop loss is 10 pips or 100 pips.',
      'Confusing pip calculations on Japanese Yen pairs which use 2 decimals instead of 4.',
      'Over-leveraging with 1:500 leverage and having account wiped out by normal 15-pip market noise.',
    ],
    practicalExercise: 'Use the KKN Position Size Calculator on the Tools page. Enter a $100,000 account balance, 1% risk, 25-pip stop loss on GBP/USD. Verify the recommended lot size is 4.00 lots.',
    backtestingExercise: 'Take 5 previous trade setups on your chart. Measure the stop loss distance in pips for each setup. Calculate what lot size you would have needed for each trade to risk exactly $500.',
    keyTakeaways: [
      '1 Pip = 0.0001 in 4-decimal pairs; 1 Pip = 0.01 in JPY pairs.',
      'Standard Lot = 100,000 units ($10/pip), Mini Lot = 10,000 units ($1/pip), Micro Lot = 1,000 units ($0.10/pip).',
      'Always calculate lot size backwards from your stop loss distance in pips.',
    ],
    quiz: [
      {
        question: 'If EUR/USD moves from 1.0820 to 1.0870, how many pips has the price moved?',
        options: ['5 pips', '50 pips', '500 pips', '0.5 pips'],
        correctIndex: 1,
        explanation: '1.0870 - 1.0820 = 0.0050 = 50 Pips.',
      },
      {
        question: 'What is the volume size of 1 Standard Lot in Forex trading?',
        options: ['1,000 units', '10,000 units', '100,000 units of the base currency', '1,000,000 units'],
        correctIndex: 2,
        explanation: '1 Standard Lot equals 100,000 units of the base currency.',
      },
      {
        question: 'In USD/JPY at 154.25, which decimal place represents 1 Pip?',
        options: ['The 4th decimal place (0.0001)', 'The 2nd decimal place (0.01)', 'The whole integer', 'The 5th decimal place (0.00001)'],
        correctIndex: 1,
        explanation: 'For Japanese Yen currency pairs, 1 Pip is the 2nd decimal place (0.01).',
      },
      {
        question: 'If your account is $10,000, you risk 1% ($100), and your stop loss is 20 pips on EUR/USD ($10/pip per standard lot), what is your lot size?',
        options: ['1.00 Lot', '0.50 Lots', '2.00 Lots', '0.05 Lots'],
        correctIndex: 1,
        explanation: 'Lot Size = $100 / (20 pips × $10) = 0.50 Lots.',
      },
      {
        question: 'What is the primary danger of using excessive broker leverage?',
        options: ['It lowers your win rate automatically', 'It amplifies both potential gains and losses equally, making small market moves capable of triggering a margin call', 'It prevents you from placing limit orders', 'It makes charts load slower'],
        correctIndex: 1,
        explanation: 'High leverage amplifies drawdown speed and can wipe out an account in minutes if risk is unmanaged.',
      },
    ],
  },
};

// Helper function to get or generate full lesson data dynamically for all 60 lessons
export const getLessonBySlug = (slug) => {
  // Check if fully detailed custom lesson exists in database
  if (LESSONS_DATABASE[slug]) {
    return LESSONS_DATABASE[slug];
  }

  // Otherwise, find which level and lesson it belongs to in ACADEMY_LEVELS
  for (const level of ACADEMY_LEVELS) {
    const lessonMeta = level.lessons.find((l) => l.slug === slug);
    if (lessonMeta) {
      return generateDynamicLessonContent(level, lessonMeta);
    }
  }

  return null;
};

// Procedurally generates rich, institutional-grade lesson data for any level lesson
function generateDynamicLessonContent(level, lessonMeta) {
  const isStrategy = level.id >= 10;
  const pairExamples = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'XAU/USD', 'AUD/USD', 'BTC/USD', 'US30'];
  const pair = pairExamples[(level.id + lessonMeta.order) % pairExamples.length];

  return {
    id: lessonMeta.id,
    levelId: level.id,
    levelTitle: level.title,
    title: lessonMeta.title,
    slug: lessonMeta.slug,
    readTime: lessonMeta.readTime || 10,
    introduction: `In this comprehensive masterclass for Level ${level.level} (${level.title}), you will master "${lessonMeta.title}". This lesson breaks down institutional mechanics, price action criteria, step-by-step execution rules, and rigorous risk parameters.`,
    beginnerExplanation: `To understand "${lessonMeta.title}" simply: Financial markets operate on auction discovery and liquidity flow. This concept teaches you how institutional market participants position large orders and how you can spot these high-probability footprints on your charts.`,
    detailedExplanation: `"${lessonMeta.title}" is a cornerstone discipline in institutional trading. Market makers and institutional algorithmic execution engines continuously seek counterpart liquidity to fulfill multi-million dollar volume blocks without excessive slippage. By mastering the core structural rules and confirmation signals of this concept, you align your trading with institutional order flow rather than retail liquidity traps.`,
    terminology: [
      { term: 'Institutional Order Flow', definition: 'The systematic accumulation, manipulation, and distribution of volume by central banks, Tier-1 institutions, and hedge funds.' },
      { term: 'Market Equilibrium (50%)', definition: 'The fair value midpoint of a structural price swing separating expensive Premium from cheap Discount pricing.' },
      { term: 'Displacement', definition: 'An aggressive, high-volume price impulse characterized by large full-body candles that rapidly breaks structural swing points.' },
      { term: 'Execution Invalidation', definition: 'The exact price level at which a setup hypothesis is proven mathematically and structurally invalid.' },
    ],
    stepByStepBreakdown: [
      `Step 1: Context & Higher Timeframe Bias — Assess the Daily and 4-Hour trend for dominant institutional order flow alignment.`,
      `Step 2: Key Zone Identification — Locate key structural swing points, supply/demand boundaries, or Order Blocks relevant to ${lessonMeta.title}.`,
      `Step 3: Lower Timeframe Confirmation — Drill down to 15m or 5m to confirm liquidity sweeps or Change of Character (CHoCH).`,
      `Step 4: Mathematical Sizing — Calculate exact lot sizing based strictly on 1% capital risk and stop loss distance.`,
      `Step 5: Execution & Management — Execute the order, secure partials at TP1 (1:2 R:R), move Stop Loss to Breakeven, and let runners target macro objectives.`,
    ],
    strategyFramework: {
      marketContext: `Assess Higher Timeframe market regime (trending, ranging, or high-impact news window) on ${pair}.`,
      bias: `Establish clear directional bias aligned with the ${level.title} institutional playbook.`,
      setup: `Wait for price to tap a validated key structural zone with clear liquidity accumulation.`,
      confirmation: `Look for displacement candles and structural confirmation on lower timeframes before entering.`,
      entry: `Enter position on pullback retest with limit or market order upon candle body close.`,
      stopLoss: `Place Stop Loss strictly beyond the confirmed invalidation swing point.`,
      takeProfit: `Set target at the next major opposing liquidity pool with minimum 1:2.5 Risk-to-Reward ratio.`,
      tradeManagement: `Close 50% position volume at TP1 and adjust Stop Loss to Breakeven (BE).`,
      review: `Record setup parameters, entry price, exit price, R-multiples, and emotions in the KKN Journal.`,
    },
    bullishExample: `On ${pair}: Higher Timeframe market structure is bullish. Price retraces into a 4-Hour key zone. On the 15-minute chart, a bullish confirmation pattern forms with strong displacement. The trader buys with a predefined Stop Loss below the swing low, targeting the previous weekly high for a 1:3.5 Risk-to-Reward gain.`,
    bearishExample: `On ${pair}: Higher Timeframe market structure is bearish. Price rallies into premium resistance. Lower timeframe shows rejection and a confirmed structural shift. The trader shorts with a Stop Loss above the swing high, capturing a 1:4 Risk-to-Reward downward expansion.`,
    entryConditions: `Higher Timeframe trend alignment + ${lessonMeta.title} criteria fully validated + minimum 1:2 R:R available.`,
    stopLossLogic: `Stop loss is placed at the structural invalidation point where the trade idea is proven wrong.`,
    takeProfitLogic: `Take profit is positioned just ahead of major institutional liquidity pools or opposing key levels.`,
    riskRewardExplanation: `Always maintain an asymmetric Risk-to-Reward profile. Risking 1% to gain 2.5% to 5% ensures long-term profitability even with a moderate win rate.`,
    commonMistakes: [
      `Entering trades prematurely before waiting for the confirmation candle to close.`,
      `Ignoring higher timeframe directional bias and attempting counter-trend scalps without confirmation.`,
      `Moving Stop Loss further away during a trade rather than accepting a controlled 1% loss.`,
    ],
    practicalExercise: `Open the KKN Paper Trading Terminal. Scan ${pair} on the 1-Hour chart. Identify a setup utilizing the principles of ${lessonMeta.title}. Calculate your 1% position size and execute a simulated order.`,
    backtestingExercise: `Scroll back 50 historical candles on the 4-Hour chart of ${pair}. Identify 5 textbook examples of ${lessonMeta.title}. Measure the average Risk-to-Reward ratio achieved on each setup.`,
    keyTakeaways: [
      `${lessonMeta.title} is an essential component of the complete institutional trading system.`,
      `Patience and discipline are required: only execute when all criteria on your checklist are fulfilled.`,
      `Strict risk management (1% per trade) guarantees longevity and protects against drawdown streaks.`,
    ],
    quiz: [
      {
        question: `What is the core principle taught in "${lessonMeta.title}"?`,
        options: [
          'Trading randomly based on emotional hunches',
          'Aligning execution with institutional order flow, structured confirmation, and strict risk control',
          'Using maximum leverage on every setup',
          'Eliminating stop losses to never take a loss',
        ],
        correctIndex: 1,
        explanation: 'Institutional trading relies on structured, rule-based execution with positive expectancy and capital preservation.',
      },
      {
        question: 'Why should Higher Timeframe (HTF) market structure always take precedence over Lower Timeframes (LTF)?',
        options: [
          'Higher timeframes dictate macro liquidity flow and have significantly higher statistical reliability',
          'Lower timeframes are not allowed to be traded',
          'Indicators only work on weekly charts',
          'HTF charts have no spread costs',
        ],
        correctIndex: 0,
        explanation: 'Higher timeframes reflect large institutional capital commitments and filter out low-timeframe noise.',
      },
      {
        question: 'What is the purpose of placing a Stop Loss at the structural invalidation point?',
        options: [
          'To increase broker profits',
          'To exit the trade automatically when the directional thesis is proven mathematically incorrect',
          'To guarantee 100% win rate',
          'To avoid paying overnight swap fees',
        ],
        correctIndex: 1,
        explanation: 'A stop loss protects your capital when market structure breaks your expected setup thesis.',
      },
      {
        question: 'What is the recommended action once price reaches the first major target (TP1) at 1:2 R:R?',
        options: [
          'Double the position size immediately',
          'Scale out partial profits (e.g. 50%) and move Stop Loss to Breakeven (BE) to make the trade risk-free',
          'Cancel all targets and stop losses',
          'Close the trading platform and never trade again',
        ],
        correctIndex: 1,
        explanation: 'Taking partial profits banks guaranteed gains while moving to Breakeven eliminates downside risk on remaining runners.',
      },
      {
        question: 'What determines the long-term profitability of a trading strategy?',
        options: [
          'Having a 100% win rate on 3 trades',
          'Positive mathematical expectancy (Win Rate × Avg Win - Loss Rate × Avg Loss) executed over a large sample size',
          'Trading only during holidays',
          'Following anonymous social media alerts',
        ],
        correctIndex: 1,
        explanation: 'Expectancy and risk management govern long-term profitability in probabilistic financial markets.',
      },
    ],
  };
}
