import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { paperTradingAPI, portfolioAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const PaperTradingContext = createContext(null);

export const PaperTradingProvider = ({ children }) => {
  const [positions, setPositions] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [portfolio, setPortfolio] = useState({
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
  });
  const [loading, setLoading] = useState(false);

  const { isAuthenticated } = useAuth();
  const { success, error, info } = useToast();

  const fetchPaperData = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const [posRes, portRes, histRes] = await Promise.allSettled([
        paperTradingAPI.getPositions(),
        portfolioAPI.getSummary(),
        paperTradingAPI.getHistory(),
      ]);

      if (posRes.status === 'fulfilled' && posRes.value.success) {
        setPositions(posRes.value.positions || []);
        setPendingOrders(posRes.value.pending || []);
      }

      if (portRes.status === 'fulfilled' && portRes.value.success) {
        setPortfolio(portRes.value.data);
      }

      if (histRes.status === 'fulfilled' && histRes.value.success) {
        setTradeHistory(histRes.value.data || []);
      }
    } catch (err) {
      console.warn('Paper trading fetch notice:', err.message);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchPaperData();
    const interval = setInterval(fetchPaperData, 1500);
    return () => clearInterval(interval);
  }, [fetchPaperData]);

  const placeOrder = async (orderData) => {
    if (!isAuthenticated) {
      error('Please sign in or create a free account to execute trades.');
      return { success: false };
    }

    setLoading(true);
    try {
      const res = await paperTradingAPI.placeOrder(orderData);
      if (res.success) {
        success(`Executed virtual ${orderData.side} order for ${orderData.lots} lot(s) of ${orderData.symbol}!`);
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
    try {
      const res = await paperTradingAPI.closePosition(positionId);
      if (res.success) {
        const pl = res.data.trade.realizedPL;
        if (pl >= 0) {
          success(`Position closed! Realized Profit: +$${pl.toFixed(2)}`);
        } else {
          info(`Position closed. Realized Loss: -$${Math.abs(pl).toFixed(2)} (Trade saved to Journal)`);
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
    try {
      const res = await paperTradingAPI.resetAccount();
      if (res.success) {
        success('Virtual Account reset to $100,000.00 starting balance.');
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
