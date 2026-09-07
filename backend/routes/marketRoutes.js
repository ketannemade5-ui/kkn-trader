const express = require('express');
const router = express.Router();
const { getMarketQuotes, getSingleQuote, getMarketHistory, getUserWatchlist, toggleWatchlistSymbol } = require('../controllers/marketController');
const { protect } = require('../middleware/auth');

router.get('/quotes', getMarketQuotes);
router.get('/quote/:symbol', getSingleQuote);
router.get('/history/:symbol', getMarketHistory);
router.get('/watchlist', protect, getUserWatchlist);
router.post('/watchlist/toggle', protect, toggleWatchlistSymbol);

module.exports = router;
