import React, { useState, useEffect } from 'react';
import { useMarket } from '../../context/MarketContext';
import { usePaperTrading } from '../../context/PaperTradingContext';
import { useAuth } from '../../context/AuthContext';
import {
  TrendingUp,
  TrendingDown,
  Shield,
  Target,
  Percent,
  Sparkles,
  Info,
  DollarSign,
  Calculator,
  Zap,
} from 'lucide-react';

export const OrderPanel = () => {
  const { currentQuote, selectedSymbol } = useMarket();
  const { placeOrder, loading, portfolio } = usePaperTrading();
  const { isAuthenticated } = useAuth();

  const [side, setSide] = useState('BUY');
  const [orderType, setOrderType] = useState('MARKET'); // 'MARKET' | 'LIMIT' | 'STOP'
  const [limitPrice, setLimitPrice] = useState('');
  const [lots, setLots] = useState(1.0);
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [strategySetup, setStrategySetup] = useState('Price Action & Liquidity Sweep');

  const currentPrice = side === 'BUY' ? (currentQuote?.ask || currentQuote?.price || 0) : (currentQuote?.bid || currentQuote?.price || 0);

  // Auto-fill suggested SL and TP based on 1:2 R:R if symbol or side changes
  useEffect(() => {
    if (currentPrice > 0) {
      const pip = currentQuote?.pipSize || 0.0001;
      const defaultPips =
        currentQuote?.category === 'Crypto'
          ? 500
          : currentQuote?.category === 'Metals'
          ? 4
          : currentQuote?.category === 'Indices'
          ? 25
          : 0.003;

      if (side === 'BUY') {
        setStopLoss(Number((currentPrice - defaultPips).toFixed(currentQuote?.digits || 2)));
        setTakeProfit(Number((currentPrice + defaultPips * 2).toFixed(currentQuote?.digits || 2)));
      } else {
        setStopLoss(Number((currentPrice + defaultPips).toFixed(currentQuote?.digits || 2)));
        setTakeProfit(Number((currentPrice - defaultPips * 2).toFixed(currentQuote?.digits || 2)));
      }
      setLimitPrice(currentPrice.toString());
    }
  }, [selectedSymbol, side, currentQuote?.digits]);

  // Calculations
  const slNum = parseFloat(stopLoss) || 0;
  const tpNum = parseFloat(takeProfit) || 0;
  const lotsNum = parseFloat(lots) || 0.01;

  let riskAmount = 0;
  let rewardAmount = 0;
  let rrRatio = 0;

  const getUnits = (category, l) => {
    if (category === 'Forex') return l * 100000;
    if (category === 'Metals') return l * 100;
    if (category === 'Indices') return l * 10;
    if (category === 'Commodities') return l * 1000;
    return l * 1;
  };

  const units = getUnits(currentQuote?.category, lotsNum);

  if (slNum > 0 && currentPrice > 0) {
    const riskDiff = Math.abs(currentPrice - slNum);
    riskAmount = Number((riskDiff * units).toFixed(2));
  }

  if (tpNum > 0 && currentPrice > 0) {
    const rewardDiff = Math.abs(tpNum - currentPrice);
    rewardAmount = Number((rewardDiff * units).toFixed(2));
  }

  if (riskAmount > 0 && rewardAmount > 0) {
    rrRatio = Number((rewardAmount / riskAmount).toFixed(2));
  }

  const marginRequired = Number(((units * currentPrice) / 100).toFixed(2));

  // Quick 1:2 R:R helper
  const applyTwoToOneRR = () => {
    if (!slNum || !currentPrice) return;
    const distance = Math.abs(currentPrice - slNum);
    const digits = currentQuote?.digits || 2;
    if (side === 'BUY') {
      setTakeProfit(Number((currentPrice + distance * 2).toFixed(digits)));
    } else {
      setTakeProfit(Number((currentPrice - distance * 2).toFixed(digits)));
    }
  };

  // Quick Risk % Calculator (Calculate lot size based on % of virtual balance)
  const applyRiskPercentage = (pct) => {
    const balance = portfolio?.virtualBalance || portfolio?.balance || 100000;
    const targetRiskDollar = (balance * pct) / 100;
    if (slNum > 0 && currentPrice > 0) {
      const priceDistance = Math.abs(currentPrice - slNum);
      if (priceDistance > 0) {
        let calculatedLots = 0.1;
        if (currentQuote?.category === 'Forex') {
          calculatedLots = targetRiskDollar / (priceDistance * 100000);
        } else if (currentQuote?.category === 'Metals') {
          calculatedLots = targetRiskDollar / (priceDistance * 100);
        } else {
          calculatedLots = targetRiskDollar / priceDistance;
        }
        setLots(Math.max(0.01, Number(calculatedLots.toFixed(2))));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await placeOrder({
      symbol: selectedSymbol,
      side,
      orderType,
      lots: lotsNum,
      stopLoss: slNum || null,
      takeProfit: tpNum || null,
      strategySetup,
    });
  };

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex flex-col gap-4">
      {/* Order Panel Header */}
      <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-kkn-gold/10 border border-kkn-gold/30">
        <div className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-kkn-gold" />
          <span className="text-[11px] font-bold text-kkn-gold tracking-wide uppercase font-mono">
            Order Execution
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">Real-time Terminal</span>
      </div>

      {/* Order Type Toggle: MARKET / LIMIT / STOP */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
        {['MARKET', 'LIMIT', 'STOP'].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setOrderType(type)}
            className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              orderType === type
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Side Toggle: BUY / SELL */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
        <button
          type="button"
          onClick={() => setSide('BUY')}
          className={`py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
            side === 'BUY'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          BUY / LONG
        </button>

        <button
          type="button"
          onClick={() => setSide('SELL')}
          className={`py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
            side === 'SELL'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          SELL / SHORT
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        {/* Instrument & Execution Price Readout */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800">
          <div>
            <span className="text-xs text-slate-400 font-medium">Instrument</span>
            <p className="text-sm font-bold text-white font-mono">{selectedSymbol}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 font-medium">
              {side === 'BUY' ? 'Ask Execution' : 'Bid Execution'}
            </span>
            <p className="text-base font-extrabold text-kkn-gold font-mono">
              {currentPrice?.toLocaleString('en-US', {
                minimumFractionDigits: currentQuote?.digits || 2,
              })}
            </p>
          </div>
        </div>

        {/* Limit Price Input if OrderType is not MARKET */}
        {orderType !== 'MARKET' && (
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">
              {orderType} Trigger Price
            </label>
            <input
              type="number"
              step="any"
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-sm focus:border-kkn-gold focus:outline-none"
            />
          </div>
        )}

        {/* Lot Size Selector & Risk Sizing */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-300">Volume (Lots)</label>
            <span className="text-[11px] text-slate-400 font-mono">
              Margin: ${marginRequired.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.01"
              min="0.01"
              max="50"
              value={lots}
              onChange={(e) => setLots(parseFloat(e.target.value) || 0.01)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono font-bold text-sm focus:border-kkn-gold focus:outline-none"
            />
          </div>

          {/* Quick Lot Multipliers */}
          <div className="grid grid-cols-6 gap-1 mt-2">
            {[0.01, 0.1, 0.5, 1.0, 5.0, 10.0].map((quickLot) => (
              <button
                key={quickLot}
                type="button"
                onClick={() => setLots(quickLot)}
                className={`py-1 rounded-lg text-[11px] font-mono font-bold transition-all border ${
                  lots === quickLot
                    ? 'bg-kkn-gold/20 border-kkn-gold text-kkn-gold'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {quickLot}
              </button>
            ))}
          </div>

          {/* Risk % Sizer Presets */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Calculator className="w-3 h-3 text-kkn-gold" />
              Risk Sizing:
            </span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 5].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => applyRiskPercentage(pct)}
                  className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300 hover:border-kkn-gold hover:text-kkn-gold transition-all"
                  title={`Size position for ${pct}% risk of account balance`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stop Loss & Take Profit */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-rose-300 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-rose-400" />
                Stop Loss
              </label>
            </div>
            <input
              type="number"
              step="any"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              placeholder="Price level"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-rose-900/40 text-rose-100 font-mono text-xs focus:border-rose-500 focus:outline-none"
            />
            {riskAmount > 0 && (
              <span className="text-[10px] text-rose-400/90 font-mono mt-0.5 block">
                Risk: -${riskAmount.toLocaleString()}
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-emerald-300 flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                Take Profit
              </label>
              <button
                type="button"
                onClick={applyTwoToOneRR}
                className="text-[10px] font-mono font-bold text-emerald-400 hover:underline"
                title="Auto-set 1:2 R:R"
              >
                1:2 R:R
              </button>
            </div>
            <input
              type="number"
              step="any"
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
              placeholder="Price level"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-emerald-900/40 text-emerald-100 font-mono text-xs focus:border-emerald-500 focus:outline-none"
            />
            {rewardAmount > 0 && (
              <span className="text-[10px] text-emerald-400/90 font-mono mt-0.5 block">
                Target: +${rewardAmount.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Risk / Reward & Margin Summary Card */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs font-mono">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Risk:Reward Ratio:</span>
            <span
              className={`font-bold ${
                rrRatio >= 2 ? 'text-emerald-400' : rrRatio >= 1 ? 'text-amber-400' : 'text-slate-300'
              }`}
            >
              1 : {rrRatio || '0.00'}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Available Margin:</span>
            <span className="text-white font-semibold">
              ${(portfolio?.availableMargin || 100000).toLocaleString('en-US', {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        {/* Execute Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3.5 rounded-xl font-extrabold text-sm uppercase tracking-wider transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 ${
            side === 'BUY'
              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
              : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20'
          }`}
        >
          {side === 'BUY' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {loading ? 'Executing...' : `EXECUTE ${side} ORDER`}
        </button>
      </form>
    </div>
  );
};
