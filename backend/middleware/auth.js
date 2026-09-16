const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(401).json({ success: false, message: 'Authentication token missing' });
      }

      let decoded = null;

      // 1. Try decoding as Firebase ID token (contains user_id / sub / uid)
      try {
        const decodedFb = jwt.decode(token);
        if (decodedFb && (decodedFb.user_id || decodedFb.sub || decodedFb.uid)) {
          const fbUid = decodedFb.user_id || decodedFb.sub || decodedFb.uid;
          decoded = {
            id: fbUid,
            uid: fbUid,
            email: decodedFb.email ? decodedFb.email.toLowerCase() : '',
            name: decodedFb.name || (decodedFb.email ? decodedFb.email.split('@')[0] : 'Trader'),
            picture: decodedFb.picture || '',
          };
        }
      } catch (fbErr) {
        // Fallback to custom JWT verify
      }

      // 2. If not a Firebase token, verify custom signed JWT
      if (!decoded) {
        try {
          const verified = jwt.verify(
            token,
            process.env.JWT_SECRET || 'kkn_trader_jwt_super_secure_key_gold_institutional_2026'
          );
          const customUid = verified.uid || verified.id;
          decoded = {
            id: customUid,
            uid: customUid,
            email: verified.email ? verified.email.toLowerCase() : '',
            name: verified.name || 'Trader',
          };
        } catch (jwtErr) {
          console.error('[JWT Verification Error]:', jwtErr.message);
          return res.status(401).json({ success: false, message: 'Invalid or expired authentication token' });
        }
      }

      const activeUid = String(decoded.uid || decoded.id);
      if (!activeUid) {
        return res.status(401).json({ success: false, message: 'Invalid token: missing user ID' });
      }

      // Check DB if connected
      let user = null;
      if (mongoose.connection.readyState === 1) {
        try {
          if (decoded.email) {
            user = await User.findOne({ email: decoded.email }).select('-password');
          }
          if (!user && mongoose.Types.ObjectId.isValid(activeUid)) {
            user = await User.findById(activeUid).select('-password');
          }
        } catch (e) {
          // ignore db error
        }
      }

      // Check persistent userStore
      const userStore = require('../services/userStore');
      const storedUser = userStore.findById(activeUid) || (decoded.email && userStore.findByEmail(decoded.email));

      const finalUser = {
        _id: activeUid,
        id: activeUid,
        uid: activeUid,
        name: (user && user.name) || (storedUser && storedUser.name) || decoded.name || 'Trader',
        email: (user && user.email) || (storedUser && storedUser.email) || decoded.email || '',
        role: (user && user.role) || (storedUser && storedUser.role) || 'USER',
        experienceLevel: (user && user.experienceLevel) || (storedUser && storedUser.experienceLevel) || 'BEGINNER',
        tradingGoals: (user && user.tradingGoals) || (storedUser && storedUser.tradingGoals) || [],
      };

      if (user && user.status === 'SUSPENDED') {
        return res.status(403).json({ success: false, message: 'Account is suspended. Please contact KKN Support.' });
      }

      req.user = finalUser;
      req.user.uid = activeUid;
      next();
    } catch (err) {
      console.error('[Auth Middleware Error]:', err.message);
      return res.status(401).json({ success: false, message: 'Invalid or expired authentication token' });
    }
  } else {
    return res.status(401).json({ success: false, message: 'Authorization token required' });
  }
};

module.exports = { protect };
