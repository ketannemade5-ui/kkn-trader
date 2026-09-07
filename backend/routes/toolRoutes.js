const express = require('express');
const router = express.Router();
const { calculatePositionSize, calculateRiskReward, calculateCompounding } = require('../controllers/toolController');

router.post('/position-size', calculatePositionSize);
router.post('/risk-reward', calculateRiskReward);
router.post('/compounding', calculateCompounding);

module.exports = router;
