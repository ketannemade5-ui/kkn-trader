// KKN TRADER - KKN AI Educational Assistant Service
// Strictly educational trading concept explanation engine with built-in guardrails

const TRADING_KNOWLEDGE_BASE = {
  'liquidity': {
    title: 'Market Liquidity',
    summary: 'Liquidity refers to the concentration of resting stop orders and limit orders in the market that institutional participants utilize to fill large volume orders without creating excessive slippage.',
    simpleExplanation: 'Think of liquidity as the fuel that moves the market. When most retail traders place buy orders with Stop Losses just below a swing low, a pool of "Sell Stops" accumulates there. Institutional players know this and drive price into that zone to fill their massive buy orders.',
    detailedExplanation: 'In Smart Money Concepts (SMC) and auction market theory, markets move from one liquidity pool to another. There are two primary types: Buy-Side Liquidity (BSL) resting above swing highs (composed of buy stop loss orders from short sellers and breakout buy stops) and Sell-Side Liquidity (SSL) resting below swing lows (composed of sell stop loss orders from long traders). Before a major reversal or sustained expansion, price frequently conducts a "Liquidity Sweep" (or raid) to capitalize on these resting orders.',
    realMarketExample: 'On EUR/USD 15m chart: Price forms equal highs (EQH) around 1.0880. Retail traders identify this as a "Double Top Resistance" and enter short, placing Stop Losses at 1.0885. Price rapidly spikes to 1.0888 (sweeping BSL and triggering all stop orders), instantly absorbs the liquidity, and aggressively drops 60 pips.',
    keyPoints: [
      'Liquidity is always resting where obvious retail chart patterns form (Double tops, double bottoms, trendlines).',
      'Institutions require counterpart orders to execute large positions without adverse slippage.',
      'Never place Stop Losses right at obvious round numbers or obvious swing points without buffer.',
      'Identify where liquidity rests before planning your trade entry.'
    ],
    commonMistakes: [
      'Entering immediately on a breakout of equal highs/lows without waiting for confirmation.',
      'Assuming support/resistance lines are brick walls rather than targets for liquidity grabs.'
    ],
    relatedConcepts: ['Buy-Side Liquidity (BSL)', 'Sell-Side Liquidity (SSL)', 'Liquidity Sweep', 'Fair Value Gap (FVG)', 'Order Block (OB)']
  },
  'bos': {
    title: 'Break of Structure (BOS)',
    summary: 'A Break of Structure (BOS) occurs when the market creates a new high in an uptrend or a new low in a downtrend, confirming the continuation of the prevailing trend.',
    simpleExplanation: 'BOS is proof that the current trend is still strong. In an uptrend, when price breaks higher than the previous peak and closes above it, that is a Bullish BOS.',
    detailedExplanation: 'Market structure is defined by higher highs (HH) and higher lows (HL) in an uptrend, and lower lows (LL) and lower highs (LH) in a downtrend. A valid Break of Structure requires a full candle body close beyond the previous structural swing point (not just a wick sweep). A wick sweep is often liquidity collection, while a candle close confirms structural intention.',
    realMarketExample: 'On XAU/USD (Gold) 1H: Gold forms a high at $2380, pulls back to $2365 (Higher Low), then rallies with strong bullish volume and closes at $2386. The close above $2380 is a Bullish BOS, signaling trend continuation towards higher targets.',
    keyPoints: [
      'BOS signals trend CONTINUATION, whereas CHoCH signals potential trend REVERSAL.',
      'Look for strong body closes on your execution timeframe.',
      'A BOS typically creates a new Fair Value Gap (FVG) or Order Block (OB) for pullback entries.'
    ],
    commonMistakes: [
      'Confusing a minor internal candle break with major swing structure BOS.',
      'Treating a single wick prick as a valid BOS without candle close confirmation.'
    ],
    relatedConcepts: ['Change of Character (CHoCH)', 'Higher High / Higher Low', 'Market Structure', 'Order Flow']
  },
  'choch': {
    title: 'Change of Character (CHoCH)',
    summary: 'A Change of Character (CHoCH) is the first structural signal that the current market trend is losing control and a trend reversal may be beginning.',
    simpleExplanation: 'When an uptrend stops making higher lows and instead breaks below the last key swing low, the character of the market has flipped from bullish to bearish.',
    detailedExplanation: 'In a sustained bullish trend, each pullback forms a Higher Low. The lowest point that generated the final Higher High is the "Key Swing Low". When price reverses and closes below this Key Swing Low, a Bearish CHoCH is printed. This represents an institutional shift in order flow. Traders then look for premium supply zones, order blocks, or FVGs to enter in the new direction.',
    realMarketExample: 'On BTC/USD 4H chart: Bitcoin moves from $60,000 to $68,000 making consecutive HLs. The last HL was at $66,200 before pushing to $68,500. When price aggressively drops and closes at $65,800 (breaking below $66,200), a Bearish CHoCH occurs, signaling caution for long positions.',
    keyPoints: [
      'CHoCH is the first early warning sign of a trend shift.',
      'High-probability CHoCH occurs after a higher-timeframe Key Level or Liquidity Sweep.',
      'Wait for a retest of the resulting Order Block or FVG rather than FOMO selling at the break.'
    ],
    commonMistakes: [
      'Trading CHoCH in the middle of nowhere without higher timeframe confluence.',
      'Mistaking normal internal pullbacks on low timeframes for major structure CHoCH.'
    ],
    relatedConcepts: ['Break of Structure (BOS)', 'Market Structure Shift (MSS)', 'Liquidity Sweep', 'Mitigation']
  },
  'order block': {
    title: 'Order Block (OB)',
    summary: 'An Order Block is a high-volume institutional candle where banks and large financial entities accumulated or distributed significant orders before an aggressive price displacement.',
    simpleExplanation: 'An order block is like an institutional footprint. In a bullish move, it is the last bearish down-candle before a violent explosion upwards that breaks structure.',
    detailedExplanation: 'Institutional orders are too immense to be filled all at once without moving the market against themselves. When institutions accumulate, they absorb sell orders (forming a bearish candle) before releasing buying pressure that creates an imbalance (FVG) and breaks structure (BOS). When price later returns to this unmitigated Order Block, unfilled limit orders get triggered and price reacts sharply.',
    realMarketExample: 'On GBP/USD 15m chart: A clean red candle forms at 1.2710, followed immediately by 3 massive consecutive green candles rallying 50 pips and breaking structure. When price retraces back to 1.2710-1.2715 (the Order Block), buyers step in forcefully with tight Stop Loss just below the OB.',
    keyPoints: [
      'A valid Order Block MUST cause a structural break (BOS or CHoCH) and leave an imbalance (FVG).',
      'The 50% equilibrium level (Mean Threshold) of the Order Block is an institutional sweet spot.',
      'Fresh (unmitigated) order blocks have the highest probability of reaction.'
    ],
    commonMistakes: [
      'Marking every single opposing candle on a chart as an order block.',
      'Ignoring overall higher timeframe trend alignment.'
    ],
    relatedConcepts: ['Fair Value Gap (FVG)', 'Breaker Block', 'Mitigation Block', 'Imbalance']
  },
  'fvg': {
    title: 'Fair Value Gap (FVG) / Imbalance',
    summary: 'A Fair Value Gap is a three-candle price pattern where aggressive one-sided buying or selling creates an inefficiency or price void between the wicks of candle 1 and candle 3.',
    simpleExplanation: 'When the market moves too fast in one direction, there is a gap between candle 1 and candle 3 where only buyers (or only sellers) were matched. The market usually wants to come back and "rebalance" this gap like filling a pothole.',
    detailedExplanation: 'In a standard 3-candle sequence: Candle 1 has a high wick, Candle 2 is an elongated displacement candle, and Candle 3 has a low wick. In a bullish FVG, Candle 1 high does not overlap with Candle 3 low, leaving empty space in Candle 2. This represents an inefficient price delivery. Price acts like a magnet to retrace into this 50% Consequent Encroachment (CE) to deliver fair two-sided auction volume before continuing.',
    realMarketExample: 'On US30 5m chart: Following a high-impact news release, a huge 150-point green candle prints. The gap between the wick of the prior candle and following candle is 40 points wide. 20 minutes later, price retraces exactly to the 50% level of the FVG and bounces 100 points.',
    keyPoints: [
      'FVGs act as dynamic magnets for price rebalancing.',
      'The 50% midpoint of the gap is called the "Consequent Encroachment (CE)".',
      'FVGs combined with an Order Block provide high-probability confluence.'
    ],
    commonMistakes: [
      'Expecting price to immediately reverse the entire trend once an FVG is filled.',
      'Marking tiny 1-pip gaps on choppy low-timeframe noise.'
    ],
    relatedConcepts: ['Order Block', 'Imbalance', 'Liquidity Void', 'Consequent Encroachment']
  },
  'risk management': {
    title: 'Risk Management & Capital Preservation',
    summary: 'The systematic set of mathematical rules and mental protocols designed to limit financial loss, eliminate the risk of ruin, and ensure long-term trading longevity.',
    simpleExplanation: 'Risk management is the #1 skill that separates successful traders from those who blow up accounts. It means never risking more than 1% to 2% of your total account on any single trade.',
    detailedExplanation: 'Without strict risk management, even a 90% win-rate strategy will inevitably wipe out an account during an inevitable streak of losing trades. Professional risk management involves: Fixed Fractional Position Sizing (e.g., risk 1% per trade), minimum 1:2 or 1:3 Risk-to-Reward ratio, predefined Max Daily Loss (e.g., stop trading for the day if down 3%), and strictly calculating lot size from Stop Loss distance rather than guessing.',
    realMarketExample: 'Account size: $10,000. Risk rule: 1% ($100 max risk). You want to buy EUR/USD at 1.0850 with Stop Loss at 1.0830 (20 pips risk). Since 20 pips = $100 risk, your position size must be exactly 0.50 lots ($5/pip). If the trade hits SL, you lose only $100 (1%) and preserve 99% of your capital to trade tomorrow.',
    keyPoints: [
      'Always calculate lot size based on Stop Loss distance: Lot Size = (Account * Risk %) / (Stop Loss in Pips * Pip Value).',
      'Aim for an average Risk-to-Reward ratio of at least 1:2.',
      'Establish a strict Daily Loss Limit (3%) and Weekly Loss Limit (6%).',
      'Never move your Stop Loss further away while in a losing trade.'
    ],
    commonMistakes: [
      'Risking 10%-20% per trade hoping to get rich overnight (Guaranteed path to account blowup).',
      'Trading without a Stop Loss.',
      'Revenge trading to make back a loss.'
    ],
    relatedConcepts: ['Position Sizing', 'Risk/Reward Ratio (RR)', 'Risk of Ruin', 'Drawdown Management']
  },
  'roadmap': {
    title: 'Beginner to Professional Trader Roadmap',
    summary: 'A structured 10-phase systematic progression path for taking an absolute beginner with zero financial knowledge to an independent, disciplined institutional trader.',
    simpleExplanation: 'Trading is a high-performance craft like surgery or piloting. You do not start by flying real passengers; you master theory, study instruments, practice on a flight simulator (Paper Trading), and build emotional discipline before managing risk.',
    detailedExplanation: 'The 10 KKN Trader Roadmap milestones are: 1) Market Basics & Terminology (Pips, Lots, Pairs, Leverage), 2) Financial Instruments & Sessions (Forex, Metals, Indices, Crypto), 3) Candlestick Anatomy & Chart Reading, 4) Technical Analysis & Key Zones, 5) Price Action & Market Structure (BOS, CHoCH, Swings), 6) Smart Money Concepts & Liquidity Models (OB, FVG, Sweeps), 7) Strict Mathematical Risk Management (1% rule, Position sizing), 8) Trading Psychology & Discipline Mastery, 9) Strategy Formulation & Historical Backtesting, 10) Simulated Paper Trading Execution ($10k demo).',
    realMarketExample: 'A student follows the KKN Academy: Spends 3 weeks completing Level 1-6 lessons and quizzes, uses the KKN Backtesting mode to log 50 historical setups, runs paper trading on KKN Terminal for 60 days with 1% risk per trade, maintains an automated journal, and achieves a consistent 55% win rate with 1:2.5 RR before considering live capital.',
    keyPoints: [
      'Never skip the foundation (Market Basics and Risk Management).',
      'Trade with virtual funds on KKN Paper Trading for at least 3-6 months.',
      'Log every single trade in the KKN Journal to analyze mistakes.',
      'Focus on the process and discipline, not quick money.'
    ],
    commonMistakes: [
      'Jumping into live trading with real money on day 1 after watching a 5-minute video.',
      'Hopping between 20 different indicator strategies without mastering one method.'
    ],
    relatedConcepts: ['Trading Academy', 'Backtesting Practice', 'Trading Journal', 'Paper Trading']
  }
};

const askAI = async ({ prompt, context = {} }) => {
  const query = (prompt || '').toLowerCase().trim();
  
  if (!query) {
    throw new Error('Please provide a valid question or trading topic.');
  }

  // Find best match in knowledge base
  let matchedKey = null;
  for (const key of Object.keys(TRADING_KNOWLEDGE_BASE)) {
    if (query.includes(key)) {
      matchedKey = key;
      break;
    }
  }

  // Check generic synonyms
  if (!matchedKey) {
    if (query.includes('smart money') || query.includes('smc') || query.includes('ict') || query.includes('orderblock')) {
      matchedKey = 'order block';
    } else if (query.includes('fair value') || query.includes('gap') || query.includes('imbalance')) {
      matchedKey = 'fvg';
    } else if (query.includes('structure') || query.includes('trend') || query.includes('break')) {
      matchedKey = 'bos';
    } else if (query.includes('reverse') || query.includes('character') || query.includes('flip')) {
      matchedKey = 'choch';
    } else if (query.includes('lot') || query.includes('size') || query.includes('stop loss') || query.includes('money') || query.includes('risk') || query.includes('protect')) {
      matchedKey = 'risk management';
    } else if (query.includes('start') || query.includes('beginner') || query.includes('learn') || query.includes('step') || query.includes('guide')) {
      matchedKey = 'roadmap';
    } else if (query.includes('sweep') || query.includes('hunt') || query.includes('pool') || query.includes('stop')) {
      matchedKey = 'liquidity';
    }
  }

  const topicData = matchedKey ? TRADING_KNOWLEDGE_BASE[matchedKey] : {
    title: `Understanding "${prompt}"`,
    summary: `In financial markets, "${prompt}" represents a fundamental concept used by traders to analyze price movements, structure trades, and manage capital.`,
    simpleExplanation: `To understand this simply: every price movement on a chart is driven by the dynamic auction between buyers and sellers. When you analyze ${prompt}, you are looking for evidence of who currently holds supply/demand control.`,
    detailedExplanation: `Professional institutional trading focuses on three core pillars: Market Structure (Direction), Liquidity & Imbalance (Entry zones), and Mathematical Risk Management (Capital preservation). Incorporate this concept into a rule-based trading plan that specifies your entry trigger, invalidation level (Stop Loss), and target (Take Profit).`,
    realMarketExample: `When analyzing instruments like XAU/USD or EUR/USD, observe how price reacts around major historical highs and lows. Notice how institutional volume creates displacement candles leaving Fair Value Gaps for continuation setups.`,
    keyPoints: [
      'Always align your analysis with higher timeframe market structure (Daily/4H).',
      'Never risk more than 1% to 2% of your virtual account balance per trade.',
      'Wait for confirmation candle closures rather than anticipating breakouts.',
      'Log every execution in your KKN Trading Journal to refine your edge.'
    ],
    commonMistakes: [
      'Trading in isolation without multi-timeframe confluence.',
      'Neglecting risk management rules.'
    ],
    relatedConcepts: ['Liquidity', 'Market Structure', 'Risk Management', 'Order Blocks', 'Trading Journal']
  };

  return {
    success: true,
    prompt,
    response: {
      title: topicData.title,
      summary: topicData.summary,
      simpleExplanation: topicData.simpleExplanation,
      detailedExplanation: topicData.detailedExplanation,
      realMarketExample: topicData.realMarketExample,
      keyPoints: topicData.keyPoints,
      commonMistakes: topicData.commonMistakes,
      relatedConcepts: topicData.relatedConcepts,
      disclaimer: 'DISCLAIMER: KKN AI is strictly an educational learning tool. It does not provide financial advice, trading signals, or guaranteed profit claims. All trading involves financial risk.',
    },
    suggestedQuestions: [
      'What is liquidity and how do institutions use it?',
      'Explain the difference between BOS and CHoCH.',
      'How does an Order Block form?',
      'What is a Fair Value Gap (FVG)?',
      'What are the core rules of 1% Risk Management?',
      'Give me a step-by-step beginner trading roadmap.'
    ],
    createdAt: new Date().toISOString(),
  };
};

module.exports = {
  askAI,
  TRADING_KNOWLEDGE_BASE,
};
