import React, { useState } from 'react';
import { usePaperTrading } from '../../context/PaperTradingContext';
import {
  TrendingUp,
  TrendingDown,
  X,
  Edit2,
  Check,
  AlertCircle,
  Clock,
  History,
  ShieldCheck,
  ListOrdered,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export const PositionsTable = () => {
  const { positions, pendingOrders, tradeHistory, closePosition, updateLimits, loading } = usePaperTrading();
  const [activeTab, setActiveTab] = useState('positions'); // 'positions' | 'pending' | 'history'
  const [editingPosId, setEditingPosId] = useState(null);
  const [editSL, setEditSL] = useState('');
  const [editTP, setEditTP] = useState('');

  const handleStartEdit = (pos) => {
    setEditingPosId(pos._id);
    setEditSL(pos.stopLoss || '');
    setEditTP(pos.takeProfit || '');
  };

  const handleSaveLimits = async (id) => {
    await updateLimits(id, { stopLoss: editSL, takeProfit: editTP });
    setEditingPosId(null);
  };

  // Distance helper
  const calculateDistance = (currentPrice, targetPrice, pipSize = 0.0001) => {
    if (!currentPrice || !targetPrice) return null;
    const diff = Math.abs(currentPrice - targetPrice);
    const pips = Number((diff / (pipSize || 0.0001)).toFixed(1));
    return { diff: Number(diff.toFixed(2)), pips };
  };

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* Tabs Header */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-slate-950/70 gap-2">
        <div className="flex items-center gap-2">
          {/* Tab 1: Positions */}
          <button
            onClick={() => setActiveTab('positions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'positions'
                ? 'bg-kkn-gold/20 text-kkn-gold border border-kkn-gold/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Open Positions</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-slate-800 text-slate-300 font-mono">
              {positions.length}
            </span>
          </button>

          {/* Tab 2: Pending Orders */}
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'pending'
                ? 'bg-kkn-gold/20 text-kkn-gold border border-kkn-gold/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>Pending Orders</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-slate-800 text-slate-300 font-mono">
              {pendingOrders?.length || 0}
            </span>
          </button>

          {/* Tab 3: History */}
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-kkn-gold/20 text-kkn-gold border border-kkn-gold/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Closed History</span>
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-slate-800 text-slate-300 font-mono">
              {tradeHistory.length}
            </span>
          </button>
        </div>

        <span className="text-[11px] text-slate-500 font-mono hidden sm:inline-block">
          Auto-executed SL/TP & Journal Sync
        </span>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto min-h-[180px]">
        {activeTab === 'positions' && (
          positions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500 gap-2">
              <ShieldCheck className="w-8 h-8 text-slate-600" />
              <p className="text-xs font-mono">No active positions open</p>
              <span className="text-[11px] text-slate-600">Select an instrument and execute an order from the terminal</span>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Instrument</th>
                  <th className="py-3 px-3">Side</th>
                  <th className="py-3 px-3">Lots</th>
                  <th className="py-3 px-3">Entry Price</th>
                  <th className="py-3 px-3">Current Price</th>
                  <th className="py-3 px-3">Stop Loss</th>
                  <th className="py-3 px-3">Take Profit</th>
                  <th className="py-3 px-3">Margin</th>
                  <th className="py-3 px-4 text-right">Unrealized P/L ($)</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {positions.map((pos) => {
                  const isProfit = (pos.unrealizedPL || 0) >= 0;
                  const isEditing = editingPosId === pos._id;
                  const slDist = calculateDistance(pos.currentPrice, pos.stopLoss);
                  const tpDist = calculateDistance(pos.currentPrice, pos.takeProfit);

                  return (
                    <tr key={pos._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-white flex items-center gap-1.5">
                        {pos.symbol}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            pos.side === 'BUY'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {pos.side}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-200 font-semibold">{pos.lots} L</td>
                      <td className="py-3 px-3 text-slate-300">{pos.entryPrice?.toLocaleString()}</td>
                      <td className="py-3 px-3 font-bold text-white">{pos.currentPrice?.toLocaleString()}</td>

                      {/* Stop Loss editable */}
                      <td className="py-3 px-3">
                        {isEditing ? (
                          <input
                            type="number"
                            step="any"
                            value={editSL}
                            onChange={(e) => setEditSL(e.target.value)}
                            className="w-20 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700 text-xs text-rose-300"
                          />
                        ) : (
                          <div>
                            <span className="text-rose-400 font-medium">
                              {pos.stopLoss ? pos.stopLoss.toLocaleString() : '—'}
                            </span>
                            {slDist && (
                              <span className="text-[10px] text-slate-500 block">
                                {slDist.pips} pips
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Take Profit editable */}
                      <td className="py-3 px-3">
                        {isEditing ? (
                          <input
                            type="number"
                            step="any"
                            value={editTP}
                            onChange={(e) => setEditTP(e.target.value)}
                            className="w-20 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700 text-xs text-emerald-300"
                          />
                        ) : (
                          <div>
                            <span className="text-emerald-400 font-medium">
                              {pos.takeProfit ? pos.takeProfit.toLocaleString() : '—'}
                            </span>
                            {tpDist && (
                              <span className="text-[10px] text-slate-500 block">
                                {tpDist.pips} pips
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Margin Used */}
                      <td className="py-3 px-3 text-slate-400 text-[11px]">
                        ${pos.marginRequired?.toLocaleString() || '—'}
                      </td>

                      {/* Unrealized P/L */}
                      <td
                        className={`py-3 px-4 text-right font-extrabold text-sm ${
                          isProfit ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {isProfit ? '+' : ''}${pos.unrealizedPL?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        <span className="text-[10px] text-slate-400 font-normal block">
                          ({isProfit ? '+' : ''}{pos.unrealizedPLPercent}%)
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {isEditing ? (
                            <button
                              onClick={() => handleSaveLimits(pos._id)}
                              className="p-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white"
                              title="Save Limits"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartEdit(pos)}
                              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                              title="Edit Stop Loss / Take Profit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() => closePosition(pos._id)}
                            className="px-2.5 py-1 rounded bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-200 text-[11px] font-bold transition-all"
                          >
                            Close
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )
        )}

        {/* Tab 2: Pending Orders */}
        {activeTab === 'pending' && (
          (!pendingOrders || pendingOrders.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500 gap-2">
              <ListOrdered className="w-8 h-8 text-slate-600" />
              <p className="text-xs font-mono">No pending Limit/Stop orders active</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Instrument</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Side</th>
                  <th className="py-3 px-3">Lots</th>
                  <th className="py-3 px-3">Target Price</th>
                  <th className="py-3 px-3">Current Price</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {pendingOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">{ord.symbol}</td>
                    <td className="py-3 px-3 text-amber-400 font-semibold">{ord.orderType}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ord.side === 'BUY' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                        {ord.side}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300">{ord.lots} L</td>
                    <td className="py-3 px-3 font-bold text-white">{ord.entryPrice}</td>
                    <td className="py-3 px-3 text-slate-400">{ord.currentPrice}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => closePosition(ord._id)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}

        {/* Tab 3: History */}
        {activeTab === 'history' && (
          tradeHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500 gap-2">
              <Clock className="w-8 h-8 text-slate-600" />
              <p className="text-xs font-mono">No closed trades recorded yet</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Date / Time</th>
                  <th className="py-3 px-3">Instrument</th>
                  <th className="py-3 px-3">Side</th>
                  <th className="py-3 px-3">Lots</th>
                  <th className="py-3 px-3">Entry</th>
                  <th className="py-3 px-3">Exit</th>
                  <th className="py-3 px-3">SL / TP</th>
                  <th className="py-3 px-3">R:R</th>
                  <th className="py-3 px-3">Reason</th>
                  <th className="py-3 px-3">Result</th>
                  <th className="py-3 px-4 text-right">Realized P/L ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {tradeHistory.map((trade) => {
                  const isWin = trade.result === 'WIN';
                  const closeDate = trade.closedAt ? new Date(trade.closedAt) : new Date();
                  const pl = typeof trade.realizedPL === 'number' ? trade.realizedPL : 0;
                  const plPct = typeof trade.realizedPLPercent === 'number' ? trade.realizedPLPercent : null;

                  return (
                    <tr key={trade.tradeId || trade._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                        <div>{closeDate.toLocaleDateString([], { month: 'short', day: 'numeric' })}</div>
                        <div className="text-[10px] text-slate-500">
                          {closeDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-bold text-white whitespace-nowrap">{trade.symbol}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            trade.side === 'BUY'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {trade.side}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-300">{trade.lots} L</td>
                      <td className="py-3 px-3 text-slate-400">{trade.entryPrice?.toLocaleString()}</td>
                      <td className="py-3 px-3 text-slate-300">{trade.exitPrice?.toLocaleString()}</td>
                      <td className="py-3 px-3 text-[10px] text-slate-400 whitespace-nowrap">
                        {trade.stopLoss ? (
                          <div className="text-rose-400">SL: {trade.stopLoss}</div>
                        ) : (
                          <div>SL: None</div>
                        )}
                        {trade.takeProfit ? (
                          <div className="text-emerald-400">TP: {trade.takeProfit}</div>
                        ) : (
                          <div>TP: None</div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-300 text-[11px]">
                        {trade.riskRewardRatio || trade.riskRewardAchieved
                          ? `1:${trade.riskRewardRatio || trade.riskRewardAchieved}`
                          : '—'}
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[11px] font-medium whitespace-nowrap">
                        {trade.closeReason === 'STOP_LOSS' ? (
                          <span className="text-rose-400">Stop Loss</span>
                        ) : trade.closeReason === 'TAKE_PROFIT' ? (
                          <span className="text-emerald-400">Take Profit</span>
                        ) : (
                          'Manual'
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            isWin
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : trade.result === 'LOSS'
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {trade.result}
                        </span>
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-extrabold text-sm whitespace-nowrap ${
                          pl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {pl >= 0 ? '+' : ''}${pl.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        {plPct !== null && (
                          <span className="text-[10px] text-slate-400 font-normal block">
                            ({pl >= 0 ? '+' : ''}{plPct}%)
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )
        )}
      </div>
    </div>
  );
};
