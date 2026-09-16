import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { paperTradingAPI, portfolioAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const PaperTradingContext = createContext(null);

const getStorageKey = (userId) => `kkn_trade_history_${userId}`;

const loadCachedTrades = (userId) => {
  if (!userId || userId === 'guest') return [];
  try {
    const key = getStorageKey(userId);
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return [];
};

const persistTrades = (userId, trades) => {
  if (!userId || userId === 'guest' || !Array.isArray(trades)) return;
  try {
    const key = getStorageKey(userId);
    localStorage.setItem(key, JSON.stringify(trades));
  } catch (e) {}
};

const getPositionsStorageKey = (userId) => `kkn_positions_${userId}`;
const getPendingStorageKey = (userId) => `kkn_pending_${userId}`;

const loadCachedPositions = (userId) => {
  if (!userId || userId === 'guest') return [];
  try {
    const raw = localStorage.getItem(getPositionsStorageKey(userId));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return [];
};

const persistPositions = (userId, positions) => {
  if (!userId || userId === 'guest' || !Array.isArray(positions)) return;
  try {
    localStorage.setItem(getPositionsStorageKey(userId), JSON.stringify(positions));
  } catch (e) {}
};

const loadCachedPending = (userId) => {
  if (!userId || userId === 'guest') return [];
  try {
    const raw = localStorage.getItem(getPendingStorageKey(userId));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return [];
};

const persistPending = (userId, pending) => {
  if (!userId || userId === 'guest' || !Array.isArray(pending)) return;
  try {
    localStorage.setItem(getPendingStorageKey(userId), JSON.stringify(pending));
  } catch (e) {}
};

const mergeTradeLists = (existingList = [], incomingList = []) => {
  const map = new Map();
  (existingList || []).forEach((t) => {
    if (!t) return;
    const id = t.tradeId || t._id || `${t.symbol}_${t.closedAt || t.openedAt}`;
    map.set(id, t);
  });
  (incomingList || []).forEach((t) => {
    if (!t) return;
    const id = t.tradeId || t._id || `${t.symbol}_${t.closedAt || t.openedAt}`;
    map.set(id, { ...(map.get(id) || {}), ...t });
  });
  const merged = Array.from(map.values());
  merged.sort((a, b) => new Date(b.closedAt || b.openedAt || 0) - new Date(a.closedAt || a.openedAt || 0));
  return merged;
};

const DEFAULT_PORTFOLIO = {
  balance: 100000.00,
  equity: 100000.00,
  usedMargin: 0.00,
  availableMargin: 100000.00,
  floatingPL: 0.00,
  realizedPL: 0.00,
  todayPL: 0.00,
  winRate: 0.00,
  totalTrades: 0,
  winningTrades: 0,
  losingTrades: 0,
};

export const PaperTradingProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const userId = isAuthenticated && user ? (user.id || user._id || user.uid) : null;

  const [positions, setPositions] = useState(() => (userId ? loadCachedPositions(userId) : []));
  const [pendingOrders, setPendingOrders] = useState(() => (userId ? loadCachedPending(userId) : []));
  const [tradeHistory, setTradeHistory] = useState(() => (userId ? loadCachedTrades(userId) : []));
  const [portfolio, setPortfolio] = useState(DEFAULT_PORTFOLIO);
  const [loading, setLoading] = useState(false);

  const { success, error, info } = useToast();

  // Reset or load user-specific paper trading state on auth changes
  useEffect(() => {
    if (!isAuthenticated || !userId) {
      setPositions([]);
      setPendingOrders([]);
      setTradeHistory([]);
      setPortfolio(DEFAULT_PORTFOLIO);
      return;
    }

    setPositions(loadCachedPositions(userId));
    setPendingOrders(loadCachedPending(userId));
    setTradeHistory(loadCachedTrades(userId));
  }, [isAuthenticated, userId]);

  const fetchPaperData = useCallback(async () => {
    if (!isAuthenticated || !userId) return;

    try {
      const [posRes, portRes, histRes] = await Promise.allSettled([
        paperTradingAPI.getPositions(),
        portfolioAPI.getSummary(),
        paperTradingAPI.getHistory(),
      ]);

      if (posRes.status === 'fulfilled' && posRes.value.success) {
        const fetchedPositions = posRes.value.positions || [];
        const fetchedPending = posRes.value.pending || [];
        setPositions(fetchedPositions);
        setPendingOrders(fetchedPending);
        persistPositions(userId, fetchedPositions);
        persistPending(userId, fetchedPending);
      }

      if (portRes.status === 'fulfilled' && portRes.value.success) {
        setPortfolio(portRes.value.data);
      }

      if (histRes.status === 'fulfilled' && histRes.value.success) {
        const dbTrades = histRes.value.data || [];
        setTradeHistory((prev) => {
          const merged = mergeTradeLists(prev, dbTrades);
          persistTrades(userId, merged);
          return merged;
        });
      }
    } catch (err) {
      console.warn('[Paper Trading Sync Notice]:', err.message);
    }
  }, [isAuthenticated, userId]);

  // Periodic polling only for authenticated users
  useEffect(() => {
    if (!isAuthenticated || !userId) return;

    fetchPaperData();
    const interval = setInterval(fetchPaperData, 2000);
    return () => clearInterval(interval);
  }, [fetchPaperData, isAuthenticated, userId]);

  const placeOrder = async (orderData) => {
    if (!isAuthenticated || !userId) {
      error('Please sign in or create a free account to execute trades.');
      return { success: false };
    }

    setLoading(true);
    try {
      const res = await paperTradingAPI.placeOrder(orderData);
      if (res.success) {
        success(`Executed virtual ${orderData.side} order for ${orderData.lots} lot(s) of ${orderData.symbol}!`);
        if (res.data) {
          if (res.data.status === 'PENDING') {
            setPendingOrders((prev) => {
              const updated = [res.data, ...prev.filter((p) => p._id !== res.data._id)];
              persistPending(userId, updated);
              return updated;
            });
          } else {
            setPositions((prev) => {
              const updated = [res.data, ...prev.filter((p) => p._id !== res.data._id)];
              persistPositions(userId, updated);
              return updated;
            });
          }
        }
        await fetchPaperData();
        return { success: true, data: res.data };
      }
    } catch (err) {
      error(err.message || 'Failed to place order.');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const closePosition = async (positionId) => {
    if (!isAuthenticated || !userId) {
      error('Authentication required.');
      return { success: false };
    }

    try {
      const res = await paperTradingAPI.closePosition(positionId);
      if (res.success) {
        const closedTrade = res.data?.trade;
        const pl = closedTrade?.realizedPL || 0;
        if (pl >= 0) {
          success(`Position closed! Realized Profit: +$${pl.toFixed(2)}`);
        } else {
          info(`Position closed. Realized Loss: -$${Math.abs(pl).toFixed(2)} (Trade saved to Journal)`);
        }

        // Optimistically remove from open positions and pending orders
        setPositions((prev) => {
          const updated = prev.filter((p) => String(p._id) !== String(positionId));
          persistPositions(userId, updated);
          return updated;
        });

        setPendingOrders((prev) => {
          const updated = prev.filter((p) => String(p._id) !== String(positionId));
          persistPending(userId, updated);
          return updated;
        });

        if (closedTrade) {
          setTradeHistory((prev) => {
            const merged = mergeTradeLists([closedTrade], prev);
            persistTrades(userId, merged);
            return merged;
          });
        }
        await fetchPaperData();
        return { success: true };
      }
    } catch (err) {
      error(err.message || 'Failed to close position.');
      return { success: false };
    }
  };

  const updateLimits = async (id, limits) => {
    if (!isAuthenticated || !userId) {
      error('Authentication required.');
      return { success: false };
    }

    try {
      const res = await paperTradingAPI.updateLimits(id, limits);
      if (res.success) {
        success('Stop Loss & Take Profit limits updated successfully.');
        await fetchPaperData();
        return { success: true };
      }
    } catch (err) {
      error(err.message || 'Failed to update position limits.');
      return { success: false };
    }
  };

  const resetAccount = async () => {
    if (!isAuthenticated || !userId) {
      error('Authentication required.');
      return { success: false };
    }

    try {
      const res = await paperTradingAPI.resetAccount();
      if (res.success) {
        success('Virtual Account balance reset to $100,000.00.');
        setPositions([]);
        setPendingOrders([]);
        setTradeHistory([]);
        try {
          localStorage.removeItem(getStorageKey(userId));
        } catch (e) {}
        await fetchPaperData();
        return { success: true };
      }
    } catch (err) {
      error(err.message || 'Failed to reset account.');
      return { success: false };
    }
  };

  return (
    <PaperTradingContext.Provider
      value={{
        positions,
        pendingOrders,
        tradeHistory,
        portfolio,
        loading,
        placeOrder,
        closePosition,
        updateLimits,
        resetAccount,
        refresh: fetchPaperData,
      }}
    >
      {children}
    </PaperTradingContext.Provider>
  );
};

export const usePaperTrading = () => useContext(PaperTradingContext);
