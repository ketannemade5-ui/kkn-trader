import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { aiAPI } from '../services/api';
import {
  Cpu,
  Send,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Layers,
  HelpCircle,
  RefreshCw,
  Info,
} from 'lucide-react';

export const KKNAIPage = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [input, setInput] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: {
        title: 'Welcome to KKN AI — Your Trading Education Assistant',
        summary: 'I am here to break down complex trading concepts, Smart Money Concepts (SMC), market structure, order blocks, liquidity sweeps, and mathematical risk management into clear, intuitive lessons.',
        simpleExplanation: 'Ask me any question about financial markets, candlestick patterns, technical analysis, or strategy formulation.',
        keyPoints: [
          'Ask conceptual questions like "What is liquidity?", "What is an Order Block?", or "Explain BOS vs CHoCH".',
          'Learn risk management formulas and disciplined trader habits.',
          'All responses are structured for optimal conceptual retention.'
        ],
        disclaimer: 'DISCLAIMER: KKN AI is strictly for educational purposes. It does not provide financial advice, trading signals, or guaranteed returns.',
      },
      timestamp: new Date().toISOString(),
    },
  ]);

  const messagesEndRef = useRef(null);

  const suggestedPrompts = [
    'What is market liquidity and how is it swept?',
    'What is the difference between BOS and CHoCH?',
    'How does an Order Block form and how is it traded?',
    'What is a Fair Value Gap (FVG)?',
    'How do I calculate lot size using 1% risk management?',
    'Give me a step-by-step beginner trading roadmap.',
  ];

  const handleSend = async (customPrompt = null) => {
    const queryText = customPrompt || input;
    if (!queryText.trim() || loading) return;

    const userMessage = {
      role: 'user',
      text: queryText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await aiAPI.ask(queryText);
      if (res.success && res.response) {
        const aiMessage = {
          role: 'assistant',
          content: res.response,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: {
            title: 'Knowledge Base Notice',
            summary: err.message || 'Unable to process question at this time. Please try another trading topic.',
          },
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      handleSend(initialQuery);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-purple-500/30 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-mono font-bold">
            <Cpu className="w-3.5 h-3.5" />
            KKN AI LEARNING ASSISTANT
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
            Master Trading Concepts with KKN AI
          </h1>
          <p className="text-xs text-slate-300 max-w-xl">
            Instant, institutional-grade conceptual breakdowns with real-market examples and risk management guardrails.
          </p>
        </div>

        <div className="shrink-0 p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 font-mono max-w-xs text-center sm:text-left">
          <strong className="text-kkn-gold block mb-0.5">Strict Educational Policy:</strong>
          No guaranteed profits or trading signals. Educational learning only.
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="space-y-2">
        <span className="text-xs font-mono text-slate-400 font-bold block">
          Suggested Questions:
        </span>
        <div className="flex flex-wrap gap-2">
          {suggestedPrompts.map((p) => (
            <button
              key={p}
              onClick={() => handleSend(p)}
              disabled={loading}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 text-xs text-slate-300 hover:text-white transition-all text-left font-medium"
            >
              "{p}"
            </button>
          ))}
        </div>
      </div>

      {/* Chat Thread Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 min-h-[450px] max-h-[650px] overflow-y-auto space-y-6 shadow-2xl">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            {msg.role === 'user' ? (
              <div className="max-w-xl bg-kkn-gold/20 border border-kkn-gold/40 text-white font-medium p-4 rounded-2xl rounded-tr-sm text-sm">
                {msg.text}
              </div>
            ) : (
              <div className="max-w-3xl glass-card rounded-2xl rounded-tl-sm p-6 border border-slate-800 space-y-4 text-xs font-mono">
                {/* Title & Summary */}
                {msg.content?.title && (
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="text-lg font-bold text-white font-['Outfit'] mb-1">
                      {msg.content.title}
                    </h3>
                    <p className="text-slate-300 leading-relaxed font-sans text-sm">
                      {msg.content.summary}
                    </p>
                  </div>
                )}

                {/* Simple Explanation */}
                {msg.content?.simpleExplanation && (
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <strong className="text-emerald-400 uppercase text-[11px] block flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5" />
                      Beginner Explanation
                    </strong>
                    <p className="text-slate-200 leading-relaxed font-sans text-xs">
                      {msg.content.simpleExplanation}
                    </p>
                  </div>
                )}

                {/* Detailed Analysis */}
                {msg.content?.detailedExplanation && (
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <strong className="text-sky-400 uppercase text-[11px] block flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      Detailed Institutional Breakdown
                    </strong>
                    <p className="text-slate-200 leading-relaxed font-sans text-xs">
                      {msg.content.detailedExplanation}
                    </p>
                  </div>
                )}

                {/* Real Market Example */}
                {msg.content?.realMarketExample && (
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <strong className="text-amber-400 uppercase text-[11px] block">
                      Real Market Example
                    </strong>
                    <p className="text-slate-200 leading-relaxed font-sans text-xs">
                      {msg.content.realMarketExample}
                    </p>
                  </div>
                )}

                {/* Key Points */}
                {msg.content?.keyPoints && (
                  <div className="space-y-1.5 pt-1">
                    <strong className="text-white text-xs block font-sans font-bold">Key Takeaways:</strong>
                    <ul className="space-y-1 text-slate-300">
                      {msg.content.keyPoints.map((pt, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Disclaimer */}
                {msg.content?.disclaimer && (
                  <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{msg.content.disclaimer}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 max-w-sm">
            <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-mono text-slate-400">KKN AI is formulating concept breakdown...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder="Ask KKN AI a trading concept (e.g. What is liquidity? Explain BOS)..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          disabled={loading}
          className="w-full pl-5 pr-28 py-4 rounded-2xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none shadow-2xl"
        />

        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className={`absolute right-2.5 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
            input.trim() && !loading
              ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>Ask</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
