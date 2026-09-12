// KKN TRADER - Comprehensive Forex & Market Instruments Master List

export const INSTRUMENT_CATEGORIES = ['All', 'Majors', 'Crosses', 'Exotics', 'Metals', 'Crypto', 'Indices'];

export const FOREX_INSTRUMENTS = [
  // ==========================================
  // MAJORS (7 Pairs)
  // ==========================================
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', category: 'Majors', basePrice: 1.0875, spread: 0.00012, pipSize: 0.0001, digits: 5, status: 'OPEN' },
  { symbol: 'GBP/USD', name: 'British Pound / US Dollar', category: 'Majors', basePrice: 1.2980, spread: 0.00016, pipSize: 0.0001, digits: 5, status: 'OPEN' },
  { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', category: 'Majors', basePrice: 153.60, spread: 0.015, pipSize: 0.01, digits: 3, status: 'OPEN' },
  { symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc', category: 'Majors', basePrice: 0.8845, spread: 0.00015, pipSize: 0.0001, digits: 5, status: 'OPEN' },
  { symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar', category: 'Majors', basePrice: 0.6590, spread: 0.00014, pipSize: 0.0001, digits: 5, status: 'OPEN' },
  { symbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar', category: 'Majors', basePrice: 1.3910, spread: 0.00016, pipSize: 0.0001, digits: 5, status: 'OPEN' },
  { symbol: 'NZD/USD', name: 'New Zealand Dollar / US Dollar', category: 'Majors', basePrice: 0.5960, spread: 0.00018, pipSize: 0.0001, digits: 5, status: 'OPEN' },

  // ==========================================
  // CROSSES (20 Pairs)
  // ==========================================
  { symbol: 'EUR/GBP', name: 'Euro / British Pound', category: 'Crosses', basePrice: 0.8380, spread: 0.00015, pipSize: 0.0001, digits: 5, status: 'OPEN' },
  { symbol: 'EUR/JPY', name: 'Euro / Japanese Yen', category: 'Crosses', basePrice: 167.05, spread: 0.018, pipSize: 0.01, digits: 3, status: 'OPEN' },
  { symbol: 'EUR/CHF', name: 'Euro / Swiss Franc', category: 'Crosses', basePrice: 0.9620, spread: 0.00016, pipSize: 0.0001, digits: 5, status: 'OPEN' },
  { symbol: 'EUR/AUD', name: 'Euro / Australian Dollar', category: 'Crosses', basePrice: 1.6500, spread: 0.00022, pipSize: 0.0001, digits: 5, status: 'OPEN' },
  { symbol: 'EUR/CAD', name: 'Euro / Canadian Dollar', category: 'Crosses', basePrice: 1.5125, spread: 0.00020, pipSize: 0.0001, digits: 5, status: 'OPEN' },
  { symbol: 'EUR/NZD', name: 'Euro / New Zealand Dollar', category: 'Crosses', basePrice: 1.8245, spread: 0.00025, pipSize: 0.0001, digits: 5, status: 'OPEN' },
  { symbol: 'GBP/JPY', name: 'British Pound / Japanese Yen', category: 'Crosses', basePrice: 199.35, spread: 0.022, pipSize: 0.01, digits: 3, status: 'OPEN' },
  { symbol: 'GBP/CHF', name: 'British Pound / Swiss Franc', category: 'Crosses', basePrice: 1.1480, spread: 0.00020, pipSize: 0.0001, digits: 5, status: 'OPEN' },
  { symbol: 'GBP/AUD', name: 'British Pound / Australian Dollar', category: 'Crosses', basePrice: 1.9690, spread: 0.00026, pipSize: 0.0001, digits: 5, status: 'OPEN' },
  { symbol: 'GBP/CAD', name: 'British Pound / Canadian Dollar', category: 'Crosses', basePrice: 1.8055, spread: 0.00024, pipSize: 0.0001, digits: 5, status: 'OPEN' },
  { symbol: 'GBP/NZD', name: 'British Pound / New Zealand Dollar', category: 'Crosses', basePrice: 2.1770, spread: 0.00030, pipSize: 0.0001, digits: 5, status: 'OPEN' },
  { symbol: 'AUD/JPY', name: 'Australian Dollar / Japanese Yen', category: 'Crosses', basePrice: 101.20, spread: 0.018, pipSize: 0.01, digits: 3, status: 'OPEN' },
  { symbol: 'AUD/CHF', name: 'Australian Dollar / Swiss Franc', category: 'Crosses', basePrice: 0.5830, spread: 0.00018, pipSize: 0.0001, digits: 5, status: 'OPEN' },
  { symbol: 'AUD/CAD', name: 'Australian Dollar / Canadian Dollar', category: 'Crosses', basePrice: 0.9165, spread: 0.00018, pipSize: 0.0001, digits: 5, status: 'OPEN' },
  { symbol: 'AUD/NZD', name: 'Australian Dollar / New Zealand Dollar', category: 'Crosses', basePrice: 1.1055, spread: 0.00020, pipSize: 0.0001, digits: 5, status: 'OPEN' },
  { symbol: 'CAD/JPY', name: 'Canadian Dollar / Japanese Yen', category: 'Crosses', basePrice: 110.40, spread: 0.018, pipSize: 0.01, digits: 3, status: 'OPEN' },
  { symbol: 'CAD/CHF', name: 'Canadian Dollar / Swiss Franc', category: 'Crosses', basePrice: 0.6360, spread: 0.00018, pipSize: 0.0001, digits: 5, status: 'OPEN' },
  { symbol: 'CHF/JPY', name: 'Swiss Franc / Japanese Yen', category: 'Crosses', basePrice: 173.65, spread: 0.024, pipSize: 0.01, digits: 3, status: 'OPEN' },
  { symbol: 'NZD/JPY', name: 'New Zealand Dollar / Japanese Yen', category: 'Crosses', basePrice: 91.55, spread: 0.020, pipSize: 0.01, digits: 3, status: 'OPEN' },
  { symbol: 'NZD/CHF', name: 'New Zealand Dollar / Swiss Franc', category: 'Crosses', basePrice: 0.5270, spread: 0.00020, pipSize: 0.0001, digits: 5, status: 'OPEN' },

  // ==========================================
  // EXOTICS & EMERGING (17 Pairs)
  // ==========================================
  { symbol: 'USD/INR', name: 'US Dollar / Indian Rupee', category: 'Exotics', basePrice: 84.10, spread: 0.04, pipSize: 0.01, digits: 2, status: 'OPEN' },
  { symbol: 'USD/SGD', name: 'US Dollar / Singapore Dollar', category: 'Exotics', basePrice: 1.3250, spread: 0.00025, pipSize: 0.0001, digits: 5, status: 'OPEN' },
  { symbol: 'USD/HKD', name: 'US Dollar / Hong Kong Dollar', category: 'Exotics', basePrice: 7.7750, spread: 0.00030, pipSize: 0.0001, digits: 5, status: 'OPEN' },
  { symbol: 'USD/CNH', name: 'US Dollar / Chinese Yuan (Offshore)', category: 'Exotics', basePrice: 7.1950, spread: 0.00040, pipSize: 0.0001, digits: 5, status: 'OPEN' },
  { symbol: 'USD/TRY', name: 'US Dollar / Turkish Lira', category: 'Exotics', basePrice: 34.35, spread: 0.05, pipSize: 0.01, digits: 3, status: 'OPEN' },
  { symbol: 'USD/ZAR', name: 'US Dollar / South African Rand', category: 'Exotics', basePrice: 17.65, spread: 0.03, pipSize: 0.01, digits: 3, status: 'OPEN' },
  { symbol: 'USD/MXN', name: 'US Dollar / Mexican Peso', category: 'Exotics', basePrice: 20.25, spread: 0.03, pipSize: 0.01, digits: 3, status: 'OPEN' },
  { symbol: 'USD/BRL', name: 'US Dollar / Brazilian Real', category: 'Exotics', basePrice: 5.75, spread: 0.02, pipSize: 0.01, digits: 3, status: 'OPEN' },
  { symbol: 'USD/SEK', name: 'US Dollar / Swedish Krona', category: 'Exotics', basePrice: 10.85, spread: 0.015, pipSize: 0.001, digits: 4, status: 'OPEN' },
  { symbol: 'USD/NOK', name: 'US Dollar / Norwegian Krone', category: 'Exotics', basePrice: 11.05, spread: 0.015, pipSize: 0.001, digits: 4, status: 'OPEN' },
  { symbol: 'USD/DKK', name: 'US Dollar / Danish Krone', category: 'Exotics', basePrice: 6.9450, spread: 0.0010, pipSize: 0.0001, digits: 5, status: 'OPEN' },
  { symbol: 'EUR/SEK', name: 'Euro / Swedish Krona', category: 'Exotics', basePrice: 11.60, spread: 0.018, pipSize: 0.001, digits: 4, status: 'OPEN' },
  { symbol: 'EUR/NOK', name: 'Euro / Norwegian Krone', category: 'Exotics', basePrice: 11.85, spread: 0.018, pipSize: 0.001, digits: 4, status: 'OPEN' },
  { symbol: 'EUR/PLN', name: 'Euro / Polish Zloty', category: 'Exotics', basePrice: 4.3550, spread: 0.0015, pipSize: 0.0001, digits: 5, status: 'OPEN' },
  { symbol: 'GBP/SGD', name: 'British Pound / Singapore Dollar', category: 'Exotics', basePrice: 1.7200, spread: 0.00045, pipSize: 0.0001, digits: 5, status: 'OPEN' },
  { symbol: 'AUD/SGD', name: 'Australian Dollar / Singapore Dollar', category: 'Exotics', basePrice: 0.8730, spread: 0.00035, pipSize: 0.0001, digits: 5, status: 'OPEN' },
  { symbol: 'NZD/SGD', name: 'New Zealand Dollar / Singapore Dollar', category: 'Exotics', basePrice: 0.7900, spread: 0.00040, pipSize: 0.0001, digits: 5, status: 'OPEN' },

  // ==========================================
  // METALS, CRYPTO, INDICES, COMMODITIES
  // ==========================================
  { symbol: 'XAU/USD', name: 'Gold / US Dollar', category: 'Metals', basePrice: 2685.50, spread: 0.25, pipSize: 0.1, digits: 2, status: 'OPEN' },
  { symbol: 'XAG/USD', name: 'Silver / US Dollar', category: 'Metals', basePrice: 31.85, spread: 0.02, pipSize: 0.01, digits: 3, status: 'OPEN' },
  { symbol: 'BTC/USD', name: 'Bitcoin / US Dollar', category: 'Crypto', basePrice: 79650.00, spread: 5.00, pipSize: 1.0, digits: 2, status: 'OPEN', binanceSymbol: 'BTCUSDT' },
  { symbol: 'ETH/USD', name: 'Ethereum / US Dollar', category: 'Crypto', basePrice: 3240.00, spread: 0.80, pipSize: 0.1, digits: 2, status: 'OPEN', binanceSymbol: 'ETHUSDT' },
  { symbol: 'SOL/USD', name: 'Solana / US Dollar', category: 'Crypto', basePrice: 195.50, spread: 0.15, pipSize: 0.01, digits: 2, status: 'OPEN', binanceSymbol: 'SOLUSDT' },
  { symbol: 'NASDAQ', name: 'US Tech 100 Index (NAS100)', category: 'Indices', basePrice: 20650.00, spread: 1.20, pipSize: 1.0, digits: 2, status: 'OPEN' },
  { symbol: 'US30', name: 'Wall Street 30 / Dow Jones', category: 'Indices', basePrice: 43250.00, spread: 2.00, pipSize: 1.0, digits: 2, status: 'OPEN' },
  { symbol: 'SPX500', name: 'US S&P 500 Index', category: 'Indices', basePrice: 5880.50, spread: 0.40, pipSize: 0.1, digits: 2, status: 'OPEN' },
  { symbol: 'OIL/USD', name: 'Crude Oil (WTI)', category: 'Commodities', basePrice: 71.60, spread: 0.03, pipSize: 0.01, digits: 2, status: 'OPEN' },
];

export const getInstrument = (sym) => {
  const clean = (sym || '').toUpperCase().replace('-', '/');
  return FOREX_INSTRUMENTS.find((i) => i.symbol === clean) || FOREX_INSTRUMENTS[0];
};
