const express = require('express');
const router = express.Router();
const { getBacktestData } = require('../controllers/backtestController');

router.get('/session', getBacktestData);

module.exports = router;
