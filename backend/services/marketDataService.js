// KKN TRADER - Institutional Market Data Service
// Multi-timeframe OHLCV generator, Binance Live Feed integration, and Real-time quote streaming

const BASE_INSTRUMENTS = {
  // MAJORS (7 Pairs)
  'EUR/USD': { name: 'Euro / US Dollar', category: 'Forex', basePrice: 1.0875, spread: 0.00012, pipSize: 0.0001, digits: 5, high24: 1.0910, low24: 1.0845, status: 'OPEN', change24: 0.22 },
  'GBP/USD': { name: 'British Pound / US Dollar', category: 'Forex', basePrice: 1.2980, spread: 0.00016, pipSize: 0.0001, digits: 5, high24: 1.3025, low24: 1.2940, status: 'OPEN', change24: -0.15 },
  'USD/JPY': { name: 'US Dollar / Japanese Yen', category: 'Forex', basePrice: 153.60, spread: 0.015, pipSize: 0.01, digits: 3, high24: 154.25, low24: 152.95, status: 'OPEN', change24: 0.38 },
  'USD/CHF': { name: 'US Dollar / Swiss Franc', category: 'Forex', basePrice: 0.8845, spread: 0.00015, pipSize: 0.0001, digits: 5, high24: 0.8880, low24: 0.8810, status: 'OPEN', change24: -0.09 },
  'AUD/USD': { name: 'Australian Dollar / US Dollar', category: 'Forex', basePrice: 0.6590, spread: 0.00014, pipSize: 0.0001, digits: 5, high24: 0.6630, low24: 0.6555, status: 'OPEN', change24: 0.45 },
  'USD/CAD': { name: 'US Dollar / Canadian Dollar', category: 'Forex', basePrice: 1.3910, spread: 0.00016, pipSize: 0.0001, digits: 5, high24: 1.3950, low24: 1.3870, status: 'OPEN', change24: -0.11 },
  'NZD/USD': { name: 'New Zealand Dollar / US Dollar', category: 'Forex', basePrice: 0.5960, spread: 0.00018, pipSize: 0.0001, digits: 5, high24: 0.5995, low24: 0.5925, status: 'OPEN', change24: 0.18 },

  // CROSSES (20 Pairs)
  'EUR/GBP': { name: 'Euro / British Pound', category: 'Forex', basePrice: 0.8380, spread: 0.00015, pipSize: 0.0001, digits: 5, high24: 0.8410, low24: 0.8360, status: 'OPEN', change24: 0.12 },
  'EUR/JPY': { name: 'Euro / Japanese Yen', category: 'Forex', basePrice: 167.05, spread: 0.018, pipSize: 0.01, digits: 3, high24: 167.80, low24: 166.40, status: 'OPEN', change24: 0.45 },
  'EUR/CHF': { name: 'Euro / Swiss Franc', category: 'Forex', basePrice: 0.9620, spread: 0.00016, pipSize: 0.0001, digits: 5, high24: 0.9650, low24: 0.9590, status: 'OPEN', change24: -0.05 },
  'EUR/AUD': { name: 'Euro / Australian Dollar', category: 'Forex', basePrice: 1.6500, spread: 0.00022, pipSize: 0.0001, digits: 5, high24: 1.6560, low24: 1.6440, status: 'OPEN', change24: 0.35 },
  'EUR/CAD': { name: 'Euro / Canadian Dollar', category: 'Forex', basePrice: 1.5125, spread: 0.00020, pipSize: 0.0001, digits: 5, high24: 1.5180, low24: 1.5070, status: 'OPEN', change24: 0.18 },
  'EUR/NZD': { name: 'Euro / New Zealand Dollar', category: 'Forex', basePrice: 1.8245, spread: 0.00025, pipSize: 0.0001, digits: 5, high24: 1.8310, low24: 1.8180, status: 'OPEN', change24: 0.28 },
  'GBP/JPY': { name: 'British Pound / Japanese Yen', category: 'Forex', basePrice: 199.35, spread: 0.022, pipSize: 0.01, digits: 3, high24: 200.20, low24: 198.50, status: 'OPEN', change24: 0.55 },
  'GBP/CHF': { name: 'British Pound / Swiss Franc', category: 'Forex', basePrice: 1.1480, spread: 0.00020, pipSize: 0.0001, digits: 5, high24: 1.1520, low24: 1.1440, status: 'OPEN', change24: -0.12 },
  'GBP/AUD': { name: 'British Pound / Australian Dollar', category: 'Forex', basePrice: 1.9690, spread: 0.00026, pipSize: 0.0001, digits: 5, high24: 1.9760, low24: 1.9620, status: 'OPEN', change24: 0.32 },
  'GBP/CAD': { name: 'British Pound / Canadian Dollar', category: 'Forex', basePrice: 1.8055, spread: 0.00024, pipSize: 0.0001, digits: 5, high24: 1.8120, low24: 1.7990, status: 'OPEN', change24: 0.15 },
  'GBP/NZD': { name: 'British Pound / New Zealand Dollar', category: 'Forex', basePrice: 2.1770, spread: 0.00030, pipSize: 0.0001, digits: 5, high24: 2.1850, low24: 2.1690, status: 'OPEN', change24: 0.40 },
  'AUD/JPY': { name: 'Australian Dollar / Japanese Yen', category: 'Forex', basePrice: 101.20, spread: 0.018, pipSize: 0.01, digits: 3, high24: 101.80, low24: 100.60, status: 'OPEN', change24: 0.25 },
  'AUD/CHF': { name: 'Australian Dollar / Swiss Franc', category: 'Forex', basePrice: 0.5830, spread: 0.00018, pipSize: 0.0001, digits: 5, high24: 0.5865, low24: 0.5795, status: 'OPEN', change24: -0.10 },
  'AUD/CAD': { name: 'Australian Dollar / Canadian Dollar', category: 'Forex', basePrice: 0.9165, spread: 0.00018, pipSize: 0.0001, digits: 5, high24: 0.9205, low24: 0.9125, status: 'OPEN', change24: 0.05 },
  'AUD/NZD': { name: 'Australian Dollar / New Zealand Dollar', category: 'Forex', basePrice: 1.1055, spread: 0.00020, pipSize: 0.0001, digits: 5, high24: 1.1095, low24: 1.1015, status: 'OPEN', change24: 0.14 },
  'CAD/JPY': { name: 'Canadian Dollar / Japanese Yen', category: 'Forex', basePrice: 110.40, spread: 0.018, pipSize: 0.01, digits: 3, high24: 111.00, low24: 109.80, status: 'OPEN', change24: 0.30 },
  'CAD/CHF': { name: 'Canadian Dollar / Swiss Franc', category: 'Forex', basePrice: 0.6360, spread: 0.00018, pipSize: 0.0001, digits: 5, high24: 0.6395, low24: 0.6325, status: 'OPEN', change24: -0.08 },
  'CHF/JPY': { name: 'Swiss Franc / Japanese Yen', category: 'Forex', basePrice: 173.65, spread: 0.024, pipSize: 0.01, digits: 3, high24: 174.40, low24: 172.90, status: 'OPEN', change24: 0.42 },
  'NZD/JPY': { name: 'New Zealand Dollar / Japanese Yen', category: 'Forex', basePrice: 91.55, spread: 0.020, pipSize: 0.01, digits: 3, high24: 92.10, low24: 91.00, status: 'OPEN', change24: 0.20 },
  'NZD/CHF': { name: 'New Zealand Dollar / Swiss Franc', category: 'Forex', basePrice: 0.5270, spread: 0.00020, pipSize: 0.0001, digits: 5, high24: 0.5305, low24: 0.5235, status: 'OPEN', change24: -0.15 },

  // EMERGING & EXOTICS
  'USD/INR': { name: 'US Dollar / Indian Rupee', category: 'Forex', basePrice: 84.10, spread: 0.04, pipSize: 0.01, digits: 2, high24: 84.30, low24: 83.95, status: 'OPEN', change24: 0.08 },
  'USD/SGD': { name: 'US Dollar / Singapore Dollar', category: 'Forex', basePrice: 1.3250, spread: 0.00025, pipSize: 0.0001, digits: 5, high24: 1.3290, low24: 1.3210, status: 'OPEN', change24: -0.05 },
  'USD/HKD': { name: 'US Dollar / Hong Kong Dollar', category: 'Forex', basePrice: 7.7750, spread: 0.00030, pipSize: 0.0001, digits: 5, high24: 7.7800, low24: 7.7700, status: 'OPEN', change24: 0.01 },
  'USD/CNH': { name: 'US Dollar / Chinese Yuan', category: 'Forex', basePrice: 7.1950, spread: 0.00040, pipSize: 0.0001, digits: 5, high24: 7.2100, low24: 7.1800, status: 'OPEN', change24: 0.12 },
  'USD/TRY': { name: 'US Dollar / Turkish Lira', category: 'Forex', basePrice: 34.35, spread: 0.05, pipSize: 0.01, digits: 3, high24: 34.60, low24: 34.10, status: 'OPEN', change24: 0.40 },
  'USD/ZAR': { name: 'US Dollar / South African Rand', category: 'Forex', basePrice: 17.65, spread: 0.03, pipSize: 0.01, digits: 3, high24: 17.85, low24: 17.45, status: 'OPEN', change24: -0.35 },
  'USD/MXN': { name: 'US Dollar / Mexican Peso', category: 'Forex', basePrice: 20.25, spread: 0.03, pipSize: 0.01, digits: 3, high24: 20.45, low24: 20.05, status: 'OPEN', change24: 0.25 },
  'USD/SEK': { name: 'US Dollar / Swedish Krona', category: 'Forex', basePrice: 10.85, spread: 0.015, pipSize: 0.001, digits: 4, high24: 10.95, low24: 10.75, status: 'OPEN', change24: 0.15 },
  'USD/NOK': { name: 'US Dollar / Norwegian Krone', category: 'Forex', basePrice: 11.05, spread: 0.015, pipSize: 0.001, digits: 4, high24: 11.15, low24: 10.95, status: 'OPEN', change24: -0.10 },
  'USD/DKK': { name: 'US Dollar / Danish Krone', category: 'Forex', basePrice: 6.9450, spread: 0.0010, pipSize: 0.0001, digits: 5, high24: 6.9700, low24: 6.9200, status: 'OPEN', change24: 0.05 },
  'EUR/PLN': { name: 'Euro / Polish Zloty', category: 'Forex', basePrice: 4.3550, spread: 0.0015, pipSize: 0.0001, digits: 5, high24: 4.3750, low24: 4.3350, status: 'OPEN', change24: -0.08 },

  // METALS, CRYPTO, INDICES, COMMODITIES
  'XAU/USD': { name: 'Gold / US Dollar', category: 'Metals', basePrice: 2685.50, spread: 0.25, pipSize: 0.1, digits: 2, high24: 2712.30, low24: 2674.10, status: 'OPEN', change24: 0.75 },
  'XAG/USD': { name: 'Silver / US Dollar', category: 'Metals', basePrice: 31.85, spread: 0.02, pipSize: 0.01, digits: 3, high24: 32.40, low24: 31.30, status: 'OPEN', change24: 1.45 },
  'BTC/USD': { name: 'Bitcoin / US Dollar', category: 'Crypto', basePrice: 79650.00, spread: 5.00, pipSize: 1.0, digits: 2, high24: 80800.00, low24: 78500.00, status: 'OPEN', change24: 2.15, binanceSymbol: 'BTCUSDT' },
  'ETH/USD': { name: 'Ethereum / US Dollar', category: 'Crypto', basePrice: 3240.00, spread: 0.80, pipSize: 0.1, digits: 2, high24: 3310.00, low24: 3180.00, status: 'OPEN', change24: 2.45, binanceSymbol: 'ETHUSDT' },
  'SOL/USD': { name: 'Solana / US Dollar', category: 'Crypto', basePrice: 195.50, spread: 0.15, pipSize: 0.01, digits: 2, high24: 204.00, low24: 189.50, status: 'OPEN', change24: 4.80, binanceSymbol: 'SOLUSDT' },
  'NASDAQ': { name: 'US Tech 100 Index (NAS100)', category: 'Indices', basePrice: 20650.00, spread: 1.20, pipSize: 1.0, digits: 2, high24: 20820.00, low24: 20510.00, status: 'OPEN', change24: 0.85 },
  'US30': { name: 'Wall Street 30 / Dow Jones', category: 'Indices', basePrice: 43250.00, spread: 2.00, pipSize: 1.0, digits: 2, high24: 43490.00, low24: 43050.00, status: 'OPEN', change24: 0.32 },
  'SPX500': { name: 'US S&P 500 Index', category: 'Indices', basePrice: 5880.50, spread: 0.40, pipSize: 0.1, digits: 2, high24: 5915.00, low24: 5845.00, status: 'OPEN', change24: 0.54 },
  'OIL/USD': { name: 'Crude Oil (WTI)', category: 'Commodities', basePrice: 71.60, spread: 0.03, pipSize: 0.01, digits: 2, high24: 72.85, low24: 70.40, status: 'OPEN', change24: -0.45 },
};

// Current dynamic quotes dictionary
const liveQuotes = {};

// Initialize quotes
Object.keys(BASE_INSTRUMENTS).forEach(symbol => {
  const spec = BASE_INSTRUMENTS[symbol];
  liveQuotes[symbol] = {
    symbol,
    name: spec.name,
    category: spec.category,
    price: spec.basePrice,
    bid: Number((spec.basePrice - spec.spread / 2).toFixed(spec.digits)),
    ask: Number((spec.basePrice + spec.spread / 2).toFixed(spec.digits)),
    spread: spec.spread,
    pipSize: spec.pipSize,
    digits: spec.digits,
    change24: spec.change24,
    high24: spec.high24,
    low24: spec.low24,
    status: spec.status,
    volume24: Math.floor(120000 + Math.random() * 500000),
    lastUpdated: new Date().toISOString(),
    isLiveFeed: Boolean(spec.binanceSymbol),
  };
});

// Periodic fetch of live prices for Crypto via Binance Public API
const fetchLiveBinanceTickers = async () => {
  try {
    const cryptoSymbols = Object.keys(BASE_INSTRUMENTS).filter(s => BASE_INSTRUMENTS[s].binanceSymbol);
    for (const sym of cryptoSymbols) {
      const binanceSym = BASE_INSTRUMENTS[sym].binanceSymbol;
      const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${binanceSym}`);
      if (res.ok) {
        const data = await res.json();
        const price = parseFloat(data.lastPrice);
        const spec = BASE_INSTRUMENTS[sym];
        const q = liveQuotes[sym];
        if (q && price > 0) {
          q.price = Number(price.toFixed(spec.digits));
          q.bid = Number((price - spec.spread / 2).toFixed(spec.digits));
          q.ask = Number((price + spec.spread / 2).toFixed(spec.digits));
          q.change24 = Number(parseFloat(data.priceChangePercent).toFixed(2));
          q.high24 = Number(parseFloat(data.highPrice).toFixed(spec.digits));
          q.low24 = Number(parseFloat(data.lowPrice).toFixed(spec.digits));
          q.volume24 = Math.floor(parseFloat(data.volume));
          q.lastUpdated = new Date().toISOString();
          q.isLiveFeed = true;
        }
      }
    }
  } catch (err) {
    // Silent failover to dynamic micro-ticks
  }
};

// Fetch Binance prices on startup & every 10s
fetchLiveBinanceTickers();
setInterval(fetchLiveBinanceTickers, 10000);

// Realistic high-frequency market micro-ticks for all non-crypto or between external ticks
setInterval(() => {
  Object.keys(liveQuotes).forEach(symbol => {
    const q = liveQuotes[symbol];
    const spec = BASE_INSTRUMENTS[symbol];

    // Slight random walk with mean reversion
    const drift = (spec.basePrice - q.price) * 0.002;
    const volatilityFactor = spec.category === 'Crypto' ? 0.0003 : spec.category === 'Metals' ? 0.0002 : 0.0001;
    const delta = (Math.random() - 0.499 + drift) * q.price * volatilityFactor;

    let newPrice = Number((q.price + delta).toFixed(spec.digits));
    if (newPrice <= 0) newPrice = spec.basePrice;

    q.price = newPrice;
    q.bid = Number((newPrice - spec.spread / 2).toFixed(spec.digits));
    q.ask = Number((newPrice + spec.spread / 2).toFixed(spec.digits));

    if (newPrice > q.high24) q.high24 = newPrice;
    if (newPrice < q.low24) q.low24 = newPrice;

    const pctChange = ((newPrice - spec.basePrice) / spec.basePrice) * 100 + spec.change24;
    q.change24 = Number(pctChange.toFixed(2));
    q.lastUpdated = new Date().toISOString();
  });
}, 1200);

// Map timeframe to Binance interval string
const TF_BINANCE_MAP = {
  '1m': '1m',
  '5m': '5m',
  '15m': '15m',
  '30m': '30m',
  '1H': '1h',
  '4H': '4h',
  '1D': '1d',
  '1W': '1w',
};

// Fetch real historical klines from Binance
const fetchBinanceKlines = async (binanceSym, timeframe = '1H', limit = 100) => {
  const interval = TF_BINANCE_MAP[timeframe] || '1h';
  const url = `https://api.binance.com/api/v3/klines?symbol=${binanceSym}&interval=${interval}&limit=${Math.min(limit, 500)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Binance API error ${res.status}`);
  const raw = await res.json();
  
  return raw.map(k => ({
    time: Math.floor(k[0] / 1000), // UNIX timestamp in seconds
    open: parseFloat(k[1]),
    high: parseFloat(k[2]),
    low: parseFloat(k[3]),
    close: parseFloat(k[4]),
    volume: parseFloat(k[5]),
  }));
};

// Generate realistic historical OHLCV data for charts (strict ascending timestamp order)
const generateOHLCV = async (symbol, timeframe = '1H', limit = 150) => {
  const cleanSymbol = (symbol || 'XAU/USD').toUpperCase().replace('-', '/');
  const spec = BASE_INSTRUMENTS[cleanSymbol] || BASE_INSTRUMENTS['XAU/USD'];
  const q = liveQuotes[cleanSymbol] || liveQuotes['XAU/USD'];

  // If crypto with Binance symbol, try fetching real candles first
  if (spec.binanceSymbol) {
    try {
      const realCandles = await fetchBinanceKlines(spec.binanceSymbol, timeframe, limit);
      if (realCandles && realCandles.length > 0) {
        return { candles: realCandles, isLiveFeed: true };
      }
    } catch (err) {
      // Fall through to deterministic synthetic generator
    }
  }

  // Timeframe interval in seconds
  const tfSecondsMap = {
    '1m': 60,
    '5m': 300,
    '15m': 900,
    '30m': 1800,
    '1H': 3600,
    '4H': 14400,
    '1D': 86400,
    '1W': 604800,
  };
  const step = tfSecondsMap[timeframe] || 3600;
  const nowSec = Math.floor(Date.now() / 1000);
  // Align to step boundary
  const currentCandleTime = Math.floor(nowSec / step) * step;

  const count = Math.min(Math.max(limit, 50), 300);
  const candles = [];

  const volMap = {
    'Forex': 0.0007,
    'Metals': 0.0012,
    'Crypto': 0.0025,
    'Indices': 0.0010,
    'Commodities': 0.0015,
  };
  const candleVolatility = (volMap[spec.category] || 0.001) * Math.sqrt(step / 3600);

  // Seed price backward from current quote
  let runningClose = q.price;
  const tempReversed = [];

  for (let i = 0; i < count; i++) {
    const t = currentCandleTime - i * step;

    // Deterministic pseudo-randomness based on time and symbol
    const seed = Math.sin(t * 0.0001 + cleanSymbol.charCodeAt(0)) * 10000;
    const rnd1 = (seed - Math.floor(seed));
    const rnd2 = (Math.cos(t * 0.0001 + 1) * 10000) % 1;
    const rnd3 = (Math.sin(t * 0.0002 + 2) * 10000) % 1;

    const delta = (rnd1 - 0.495) * runningClose * candleVolatility;
    const open = Number((runningClose - delta).toFixed(spec.digits));
    const close = Number(runningClose.toFixed(spec.digits));

    const maxOC = Math.max(open, close);
    const minOC = Math.min(open, close);

    const highExtra = Math.abs(rnd2) * runningClose * candleVolatility * 0.8;
    const lowExtra = Math.abs(rnd3) * runningClose * candleVolatility * 0.8;

    const high = Number((maxOC + highExtra).toFixed(spec.digits));
    const low = Number(Math.max(0.00001, minOC - lowExtra).toFixed(spec.digits));

    const volume = Math.floor(1000 + Math.abs(rnd1) * 25000);

    tempReversed.push({
      time: t,
      open,
      high,
      low,
      close,
      volume,
    });

    // Step backward
    runningClose = open;
  }

  // Reverse to chronological ascending order
  candles.push(...tempReversed.reverse());

  // Ensure current candle matches live quote close
  if (candles.length > 0) {
    const last = candles[candles.length - 1];
    last.close = q.price;
    if (q.price > last.high) last.high = q.price;
    if (q.price < last.low) last.low = q.price;
  }

  return { candles, isLiveFeed: false };
};

const getQuotes = (category) => {
  if (!category || category === 'All') {
    return Object.values(liveQuotes);
  }
  return Object.values(liveQuotes).filter(q => q.category.toLowerCase() === category.toLowerCase());
};

const getQuote = (symbol) => {
  const clean = (symbol || 'XAU/USD').toUpperCase().replace('-', '/');
  return liveQuotes[clean] || liveQuotes['XAU/USD'];
};

const getHistory = async (symbol, timeframe = '1H', limit = 150) => {
  return await generateOHLCV(symbol, timeframe, limit);
};

module.exports = {
  BASE_INSTRUMENTS,
  liveQuotes,
  getQuotes,
  getQuote,
  getQuoteBySymbol: getQuote,
  getHistory,
  generateOHLCV,
};
