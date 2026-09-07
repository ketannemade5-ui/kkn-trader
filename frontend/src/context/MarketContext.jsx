import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { marketAPI } from '../services/api';
import { useAuth } from './AuthContext';

const MarketContext = createContext(null);

export const MarketProvider = ({ children }) => {
  const [quotes, setQuotes] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState('XAU/USD');
  const [watchlist, setWatchlist] = useState(['XAU/USD', 'EUR/USD', 'GBP/USD', 'BTC/USD', 'NASDAQ', 'US30']);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const fetchQuotes = useCallback(async () => {
    try {
      const res = await marketAPI.getQuotes();
      if (res.success && res.data) {
        setQuotes(res.data);
      }
    } catch (err) {
      console.warn('Market quotes fetch notice:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWatchlist = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const res = await marketAPI.getWatchlist();
        if (res.success && res.symbols) {
          setWatchlist(res.symbols);
        }
      } catch (err) {
        // quiet fallback
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchQuotes();
    fetchWatchlist();

    const interval = setInterval(() => {
      fetchQuotes();
    }, 1500);

    return () => clearInterval(interval);
  }, [fetchQuotes, fetchWatchlist]);

  const toggleWatchlist = async (symbol) => {
    const cleanSym = symbol.toUpperCase().replace('-', '/');
    if (isAuthenticated) {
      try {
        const res = await marketAPI.toggleWatchlist(cleanSym);
        if (res.success) {
          setWatchlist(res.symbols);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      // Local toggle for unauthenticated guest
      setWatchlist((prev) =>
        prev.includes(cleanSym) ? prev.filter((s) => s !== cleanSym) : [...prev, cleanSym]
      );
    }
  };

  const currentQuote = quotes.find((q) => q.symbol === selectedSymbol) || {
    symbol: selectedSymbol,
    name: 'Gold / US Dollar',
    category: 'Metals',
    price: 2385.40,
    bid: 2385.25,
    ask: 2385.55,
    spread: 0.30,
    change24: 0.65,
    high24: 2402.10,
    low24: 2374.80,
    status: 'OPEN',
  };

  return (
    <MarketContext.Provider
      value={{
        quotes,
        selectedSymbol,
        setSelectedSymbol,
        currentQuote,
        watchlist,
        toggleWatchlist,
        loading,
        refreshQuotes: fetchQuotes,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => useContext(MarketContext);
