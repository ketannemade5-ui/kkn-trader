import React, { useState } from 'react';
import {
  Calculator,
  Shield,
  Target,
  Percent,
  TrendingUp,
  DollarSign,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const ToolsPage = () => {
  const [activeTab, setActiveTab] = useState('position-size');

  // 1. Position Size State
  const [psBalance, setPsBalance] = useState(100000);
  const [psRiskPct, setPsRiskPct] = useState(1);
  const [psStopLossPips, setPsStopLossPips] = useState(25);
  const [psPipValue, setPsPipValue] = useState(10); // $10 per lot

  // 2. Risk/Reward State
  const [rrEntry, setRrEntry] = useState(2685.50);
  const [rrSL, setRrSL] = useState(2675.00);
  const [rrTP, setRrTP] = useState(2706.50);
  const [rrLots, setRrLots] = useState(1.0);

  // 3. Pip Value State
  const [pipPair, setPipPair] = useState('EUR/USD');
  const [pipLots, setPipLots] = useState(1.0);

  // 4. Profit / Loss State
  const [plSide, setPlSide] = useState('BUY');
  const [plEntry, setPlEntry] = useState(1.0875);
  const [plExit, setPlExit] = useState(1.0925);
  const [plLots, setPlLots] = useState(1.0);

  // 5. Compounding State
  const [compInitial, setCompInitial] = useState(100000);
  const [compMonthlyReturn, setCompMonthlyReturn] = useState(5);
  const [compMonths, setCompMonths] = useState(12);

  // 6. Margin State
  const [marginPrice, setMarginPrice] = useState(2385.40);
  const [marginLots, setMarginLots] = useState(1.0);
  const [marginLeverage, setMarginLeverage] = useState(100);

  // Calculators Computations
  // 1. Position Size
  const psRiskUSD = (psBalance * (psRiskPct / 100));
  const psLotSize = psStopLossPips > 0 ? (psRiskUSD / (psStopLossPips * psPipValue)) : 0;

  // 2. Risk Reward
  const rrRiskDist = Math.abs(rrEntry - rrSL);
  const rrRewardDist = Math.abs(rrTP - rrEntry);
  const rrRatio = rrRiskDist > 0 ? Number((rrRewardDist / rrRiskDist).toFixed(2)) : 0;
  const rrRiskAmount = Number((rrRiskDist * rrLots * 100).toFixed(2));
  const rrRewardAmount = Number((rrRewardDist * rrLots * 100).toFixed(2));

  // 3. Pip Value
  const calculatedPipValueUSD = Number((pipLots * 10).toFixed(2)); // standard fx approximation

  // 4. Profit Loss
  const plDiff = plSide === 'BUY' ? (plExit - plEntry) : (plEntry - plExit);
  const calculatedPL = Number((plDiff * plLots * 100000).toFixed(2));

  // 5. Compounding
  let compEndingBalance = parseFloat(compInitial);
  for (let m = 1; m <= compMonths; m++) {
    compEndingBalance += compEndingBalance * (compMonthlyReturn / 100);
  }
  const compProfit = compEndingBalance - compInitial;

  // 6. Margin
  const calculatedMargin = Number(((marginLots * 100 * marginPrice) / marginLeverage).toFixed(2));

  const toolTabs = [
    { id: 'position-size', name: 'Position Size' },
    { id: 'risk-reward', name: 'Risk / Reward' },
    { id: 'pip-calculator', name: 'Pip Value' },
    { id: 'profit-loss', name: 'Profit / Loss' },
    { id: 'compounding', name: 'Compounding' },
    { id: 'margin', name: 'Margin Required' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-mono">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-400 text-xs font-bold">
          <Calculator className="w-3.5 h-3.5" />
          FINANCIAL TRADING CALCULATORS
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-['Outfit']">
          Trading Calculators & Utilities
        </h1>
        <p className="text-xs text-slate-400">
          Eliminate guesswork. Plan your risk parameters and contract sizes with mathematical certainty.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 border-b border-slate-800">
        {toolTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-kkn-gold text-slate-950 shadow-gold-sm'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Calculator Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input Form (7 cols) */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
          {activeTab === 'position-size' && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-white font-['Outfit'] flex items-center gap-2">
                <Shield className="w-5 h-5 text-kkn-gold" />
                Position Size Calculator (1% Rule)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Account Balance ($)</label>
                  <input
                    type="number"
                    value={psBalance}
                    onChange={(e) => setPsBalance(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Risk Percentage (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={psRiskPct}
                    onChange={(e) => setPsRiskPct(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Stop Loss (Pips)</label>
                  <input
                    type="number"
                    value={psStopLossPips}
                    onChange={(e) => setPsStopLossPips(parseFloat(e.target.value) || 1)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Pip Value per Standard Lot ($)</label>
                  <input
                    type="number"
                    value={psPipValue}
                    onChange={(e) => setPsPipValue(parseFloat(e.target.value) || 10)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'risk-reward' && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-white font-['Outfit'] flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-400" />
                Risk / Reward Ratio Calculator
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Entry Price</label>
                  <input
                    type="number"
                    step="any"
                    value={rrEntry}
                    onChange={(e) => setRrEntry(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="text-rose-400 block mb-1">Stop Loss Price</label>
                  <input
                    type="number"
                    step="any"
                    value={rrSL}
                    onChange={(e) => setRrSL(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-rose-900/50 text-rose-300 font-bold"
                  />
                </div>

                <div>
                  <label className="text-emerald-400 block mb-1">Take Profit Price</label>
                  <input
                    type="number"
                    step="any"
                    value={rrTP}
                    onChange={(e) => setRrTP(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-emerald-900/50 text-emerald-300 font-bold"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Volume (Lots)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={rrLots}
                    onChange={(e) => setRrLots(parseFloat(e.target.value) || 1)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'compounding' && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-white font-['Outfit'] flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                Monthly Compound Growth Model
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Starting Balance ($)</label>
                  <input
                    type="number"
                    value={compInitial}
                    onChange={(e) => setCompInitial(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Monthly Return (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={compMonthlyReturn}
                    onChange={(e) => setCompMonthlyReturn(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Duration (Months)</label>
                  <input
                    type="number"
                    value={compMonths}
                    onChange={(e) => setCompMonths(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profit-loss' && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-white font-['Outfit'] flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                Profit & Loss Calculator
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Direction</label>
                  <select
                    value={plSide}
                    onChange={(e) => setPlSide(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                  >
                    <option value="BUY">BUY / LONG</option>
                    <option value="SELL">SELL / SHORT</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Volume (Lots)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={plLots}
                    onChange={(e) => setPlLots(parseFloat(e.target.value) || 1)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Entry Price</label>
                  <input
                    type="number"
                    step="any"
                    value={plEntry}
                    onChange={(e) => setPlEntry(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Exit Price</label>
                  <input
                    type="number"
                    step="any"
                    value={plExit}
                    onChange={(e) => setPlExit(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pip-calculator' && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-white font-['Outfit']">Pip Value Calculator</h2>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Currency Pair</label>
                  <select
                    value={pipPair}
                    onChange={(e) => setPipPair(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                  >
                    <option value="EUR/USD">EUR/USD</option>
                    <option value="GBP/USD">GBP/USD</option>
                    <option value="USD/JPY">USD/JPY</option>
                    <option value="XAU/USD">XAU/USD (Gold)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Lots</label>
                  <input
                    type="number"
                    step="0.01"
                    value={pipLots}
                    onChange={(e) => setPipLots(parseFloat(e.target.value) || 1)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'margin' && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-white font-['Outfit']">Margin Requirement Calculator</h2>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Price</label>
                  <input
                    type="number"
                    step="any"
                    value={marginPrice}
                    onChange={(e) => setMarginPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Lots</label>
                  <input
                    type="number"
                    step="0.01"
                    value={marginLots}
                    onChange={(e) => setMarginLots(parseFloat(e.target.value) || 1)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Leverage Ratio</label>
                  <select
                    value={marginLeverage}
                    onChange={(e) => setMarginLeverage(parseInt(e.target.value, 10))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                  >
                    <option value="50">1:50</option>
                    <option value="100">1:100 (Default)</option>
                    <option value="200">1:200</option>
                    <option value="500">1:500</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Live Output Card (5 cols) */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-8 border border-kkn-gold/40 shadow-gold-glow space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-kkn-gold uppercase tracking-wider">
              Calculation Output
            </span>
            <span className="text-[10px] text-slate-400">Institutional Model</span>
          </div>

          {activeTab === 'position-size' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 block">Exact Recommended Lot Size:</span>
                <p className="text-3xl font-black text-kkn-gold">{psLotSize.toFixed(2)} Lots</p>
                <span className="text-[11px] text-slate-500 block">
                  ({(psLotSize * 10).toFixed(1)} Mini Lots / {(psLotSize * 100).toFixed(0)} Micro Lots)
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Dollar Risk Capital:</span>
                  <span className="text-rose-400 font-bold">-${psRiskUSD.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Stop Loss Distance:</span>
                  <span className="text-white font-bold">{psStopLossPips} Pips</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'risk-reward' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 block">Risk-to-Reward Ratio:</span>
                <p className="text-3xl font-black text-white">1 : {rrRatio}</p>
                <span
                  className={`text-[11px] font-bold block ${
                    rrRatio >= 2 ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {rrRatio >= 2 ? '✓ High-Probability Institutional Ratio (≥ 1:2)' : '⚠️ Low R:R Setup (< 1:2)'}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Estimated Dollar Risk:</span>
                  <span className="text-rose-400 font-bold">-${rrRiskAmount}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Estimated Dollar Target:</span>
                  <span className="text-emerald-400 font-bold">+${rrRewardAmount}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'compounding' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 block">Projected Capital in {compMonths} Months:</span>
                <p className="text-3xl font-black text-emerald-400">
                  ${compEndingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <span className="text-[11px] text-kkn-gold block">
                  Total Gain: +${compProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({(((compEndingBalance - compInitial) / compInitial) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          )}

          {activeTab === 'profit-loss' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 block">Net Projected P/L:</span>
                <p className={`text-3xl font-black ${calculatedPL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {calculatedPL >= 0 ? '+' : ''}${calculatedPL.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'pip-calculator' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 block">Pip Value per Move:</span>
                <p className="text-3xl font-black text-white">${calculatedPipValueUSD} / Pip</p>
              </div>
            </div>
          )}

          {activeTab === 'margin' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 block">Margin Deposit Required:</span>
                <p className="text-3xl font-black text-kkn-gold">${calculatedMargin.toLocaleString()} USD</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
