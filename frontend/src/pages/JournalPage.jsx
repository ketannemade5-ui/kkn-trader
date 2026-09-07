import React, { useState, useEffect } from 'react';
import { journalAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  BookMarked,
  Plus,
  Filter,
  Search,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
  Trash2,
  Edit2,
  Tag,
  Smile,
  AlertTriangle,
  Sparkles,
  Calendar,
} from 'lucide-react';

export const JournalPage = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterResult, setFilterResult] = useState('All');
  const [filterSymbol, setFilterSymbol] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  // New entry form state
  const [formSymbol, setFormSymbol] = useState('XAU/USD');
  const [formSide, setFormSide] = useState('BUY');
  const [formEntry, setFormEntry] = useState('');
  const [formExit, setFormExit] = useState('');
  const [formLots, setFormLots] = useState(1.0);
  const [formPL, setFormPL] = useState('');
  const [formSetup, setFormSetup] = useState('Liquidity Sweep & FVG');
  const [formEmotion, setFormEmotion] = useState('Calm & Disciplined');
  const [formMistake, setFormMistake] = useState('None - Followed Rules');
  const [formLesson, setFormLesson] = useState('');

  const { isAuthenticated } = useAuth();
  const { success, error } = useToast();

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const res = await journalAPI.getEntries({
        result: filterResult !== 'All' ? filterResult : undefined,
        symbol: filterSymbol || undefined,
      });
      if (res.success && res.data) {
        setEntries(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch journal entries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchEntries();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, filterResult, filterSymbol]);

  const handleSaveEntry = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        symbol: formSymbol,
        side: formSide,
        entryPrice: parseFloat(formEntry),
        exitPrice: parseFloat(formExit),
        lots: parseFloat(formLots),
        realizedPL: parseFloat(formPL) || ((parseFloat(formExit) - parseFloat(formEntry)) * parseFloat(formLots) * 100),
        strategySetup: formSetup,
        emotion: formEmotion,
        mistake: formMistake,
        lessonLearned: formLesson,
      };

      if (editingEntry) {
        await journalAPI.updateEntry(editingEntry._id, payload);
        success('Journal entry updated successfully.');
      } else {
        await journalAPI.createEntry(payload);
        success('New trade logged into journal.');
      }

      setModalOpen(false);
      setEditingEntry(null);
      fetchEntries();
    } catch (err) {
      error(err.message || 'Failed to save journal entry.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this trade journal entry?')) {
      try {
        await journalAPI.deleteEntry(id);
        success('Journal entry deleted.');
        fetchEntries();
      } catch (err) {
        error(err.message || 'Failed to delete.');
      }
    }
  };

  const handleEdit = (item) => {
    setEditingEntry(item);
    setFormSymbol(item.symbol);
    setFormSide(item.side);
    setFormEntry(item.entryPrice);
    setFormExit(item.exitPrice);
    setFormLots(item.lots);
    setFormPL(item.realizedPL);
    setFormSetup(item.strategySetup || 'Price Action');
    setFormEmotion(item.emotion || 'Calm & Disciplined');
    setFormMistake(item.mistake || 'None');
    setFormLesson(item.lessonLearned || '');
    setModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold mb-2">
            <BookMarked className="w-3.5 h-3.5 text-amber-400" />
            INSTITUTIONAL PERFORMANCE LOG
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-['Outfit']">
            Trading Journal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Every completed paper trade is automatically logged here. Document your emotions, mistakes, and lessons learned.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingEntry(null);
            setModalOpen(true);
          }}
          className="px-5 py-3 rounded-xl bg-gold-gradient text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-gold-glow hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Log Manual Trade
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          {['All', 'WIN', 'LOSS', 'BREAKEVEN'].map((res) => (
            <button
              key={res}
              onClick={() => setFilterResult(res)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterResult === res
                  ? 'bg-kkn-gold text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {res}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Filter by symbol (e.g. XAU/USD)..."
            value={filterSymbol}
            onChange={(e) => setFilterSymbol(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-kkn-gold focus:outline-none"
          />
        </div>
      </div>

      {/* Journal Entry Cards */}
      {entries.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center space-y-4 border border-slate-800">
          <BookMarked className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white font-['Outfit']">No Journal Entries Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Execute paper trades on the terminal or click "Log Manual Trade" to record your setups and psychology.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {entries.map((item) => {
            const isWin = item.result === 'WIN';
            return (
              <div
                key={item._id}
                className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-kkn-gold/40 transition-all space-y-4 font-mono"
              >
                {/* Top Row: Symbol, Side, Date, P/L */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black text-white">{item.symbol}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        item.side === 'BUY'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {item.side}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        isWin
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : item.result === 'LOSS'
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {item.result}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span
                      className={`text-base font-black ${
                        item.realizedPL >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {item.realizedPL >= 0 ? '+' : ''}${item.realizedPL?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Middle Grid: Trade Execution Details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/60">
                    <span className="text-[10px] text-slate-500 block">ENTRY PRICE</span>
                    <span className="font-bold text-slate-200">{item.entryPrice?.toLocaleString()}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/60">
                    <span className="text-[10px] text-slate-500 block">EXIT PRICE</span>
                    <span className="font-bold text-slate-200">{item.exitPrice?.toLocaleString()}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/60">
                    <span className="text-[10px] text-slate-500 block">VOLUME (LOTS)</span>
                    <span className="font-bold text-kkn-gold">{item.lots} Lots</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/60">
                    <span className="text-[10px] text-slate-500 block">STRATEGY SETUP</span>
                    <span className="font-bold text-white truncate block">{item.strategySetup || 'Structure'}</span>
                  </div>
                </div>

                {/* Psychology & Notes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60">
                  <div>
                    <strong className="text-sky-400 block mb-0.5">Emotional State:</strong>
                    <span className="text-slate-300">{item.emotion || 'Calm & Disciplined'}</span>
                  </div>
                  <div>
                    <strong className="text-amber-400 block mb-0.5">Mistakes Noted:</strong>
                    <span className="text-slate-300">{item.mistake || 'None'}</span>
                  </div>
                  <div>
                    <strong className="text-emerald-400 block mb-0.5">Lesson Learned:</strong>
                    <span className="text-slate-300">{item.lessonLearned || 'Followed trading rules strictly.'}</span>
                  </div>
                </div>

                {/* Actions Bottom Bar */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                    title="Edit Notes"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300"
                    title="Delete Entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Manual Entry Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <h2 className="text-xl font-bold text-white font-['Outfit']">
              {editingEntry ? 'Edit Journal Entry' : 'Log New Paper Trade'}
            </h2>

            <form onSubmit={handleSaveEntry} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Symbol</label>
                  <input
                    type="text"
                    value={formSymbol}
                    onChange={(e) => setFormSymbol(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Side</label>
                  <select
                    value={formSide}
                    onChange={(e) => setFormSide(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                  >
                    <option value="BUY">BUY</option>
                    <option value="SELL">SELL</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Entry Price</label>
                  <input
                    type="number"
                    step="any"
                    value={formEntry}
                    onChange={(e) => setFormEntry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Exit Price</label>
                  <input
                    type="number"
                    step="any"
                    value={formExit}
                    onChange={(e) => setFormExit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Lots</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formLots}
                    onChange={(e) => setFormLots(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Strategy Setup</label>
                <input
                  type="text"
                  value={formSetup}
                  onChange={(e) => setFormSetup(e.target.value)}
                  placeholder="e.g. 15m FVG Retest + Asian Low Sweep"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Emotion State</label>
                  <select
                    value={formEmotion}
                    onChange={(e) => setFormEmotion(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="Calm & Disciplined">Calm & Disciplined</option>
                    <option value="Confident">Confident</option>
                    <option value="Hesitant">Hesitant</option>
                    <option value="FOMO">FOMO</option>
                    <option value="Impulsive">Impulsive</option>
                    <option value="Revenge Trade">Revenge Trade</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Mistake Noted</label>
                  <input
                    type="text"
                    value={formMistake}
                    onChange={(e) => setFormMistake(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Lesson Learned</label>
                <textarea
                  rows="2"
                  value={formLesson}
                  onChange={(e) => setFormLesson(e.target.value)}
                  placeholder="Key takeaway to reinforce future discipline..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gold-gradient text-slate-950 font-extrabold shadow-gold-sm"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
