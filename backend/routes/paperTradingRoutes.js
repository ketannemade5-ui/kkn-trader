const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getPositions,
  getPendingOrders,
  closeOpenPosition,
  updatePositionLimits,
  getTradeHistory,
  resetAccount,
} = require('../controllers/paperTradingController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/order', placeOrder);
router.get('/positions', getPositions);
router.get('/pending-orders', getPendingOrders);
router.get('/pending', getPendingOrders);
router.post('/close', closeOpenPosition);
router.put('/position/:id', updatePositionLimits);
router.get('/history', getTradeHistory);
router.post('/reset', resetAccount);

module.exports = router;
