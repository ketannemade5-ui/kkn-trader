const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, updateProfile, firebaseAuthSync } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/firebase-sync', firebaseAuthSync);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
