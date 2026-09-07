const express = require('express');
const router = express.Router();
const { getPortfolioSummary } = require('../controllers/portfolioController');
const { protect } = require('../middleware/auth');

router.get('/summary', protect, getPortfolioSummary);

module.exports = router;
