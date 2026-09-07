import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export const EquityChart = ({ history = [], height = 300 }) => {
  const chartData = history && history.length > 0
    ? history.map((item, idx) => ({
        index: idx + 1,
        time: item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : `Trade #${idx + 1}`,
        equity: item.equity || item.balance || 100000,
        balance: item.balance || 100000,
      }))
    : [
        { index: 1, time: 'Start', equity: 100000, balance: 100000 },
        { index: 2, time: 'Trade 1', equity: 101500, balance: 101500 },
        { index: 3, time: 'Trade 2', equity: 100900, balance: 100900 },
        { index: 4, time: 'Trade 3', equity: 103400, balance: 103400 },
        { index: 5, time: 'Trade 4', equity: 106200, balance: 106200 },
      ];

  const minEquity = Math.min(...chartData.map((d) => d.equity)) * 0.98;
  const maxEquity = Math.max(...chartData.map((d) => d.equity)) * 1.02;

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white font-['Outfit']">Simulated Equity Growth Curve</h3>
          <p className="text-xs text-slate-400 font-mono">Virtual Portfolio Performance Track</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="flex items-center gap-1 text-kkn-gold font-bold">
            <span className="w-2 h-2 rounded-full bg-kkn-gold"></span>
            Virtual Equity
          </span>
        </div>
      </div>

      <div style={{ width: '100%', height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="goldAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d4af37" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#d4af37" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
            <YAxis
              domain={[minEquity, maxEquity]}
              stroke="#64748b"
              tick={{ fontSize: 10, fontFamily: 'monospace' }}
              tickFormatter={(val) => `$${val.toLocaleString()}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0b111e',
                borderColor: '#d4af37',
                borderRadius: '0.75rem',
                fontSize: '12px',
                fontFamily: 'monospace',
                color: '#fff',
              }}
              formatter={(value) => [`$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 'Equity']}
            />
            <Area
              type="monotone"
              dataKey="equity"
              stroke="#d4af37"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#goldAreaGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
