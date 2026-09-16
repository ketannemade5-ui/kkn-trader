const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const Watchlist = require('../models/Watchlist');
const UserProgress = require('../models/UserProgress');
const userStore = require('../services/userStore');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const isDbConnected = () => mongoose.connection.readyState === 1;

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'kkn_trader_jwt_super_secure_key_gold_institutional_2026', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc   Register a new user & auto-create $100,000 virtual trading account
// @route  POST /api/auth/register
// @access Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, experienceLevel, tradingGoals } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Check if user already exists in DB or persistent userStore
    if (isDbConnected()) {
      try {
        const userExists = await User.findOne({ email: cleanEmail });
        if (userExists) {
          return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
        }
      } catch (e) {
        // ignore db error, proceed
      }
    }

    const existingInStore = userStore.findByEmail(cleanEmail);
    if (existingInStore) {
      return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
    }

    let user = null;

    // 2. Persist to MongoDB if connected
    if (isDbConnected()) {
      try {
        user = await User.create({
          name: name.trim(),
          email: cleanEmail,
          password,
          experienceLevel: experienceLevel || 'BEGINNER',
          tradingGoals: tradingGoals || ['Learn Market Structure', 'Risk Management', 'Master Price Action'],
          role: 'USER',
        });

        await Portfolio.create({
          userId: user._id,
          initialBalance: 100000.00,
          virtualBalance: 100000.00,
          equity: 100000.00,
          availableMargin: 100000.00,
          equityHistory: [{ timestamp: new Date(), balance: 100000.00, equity: 100000.00 }],
        });

        await Watchlist.create({
          userId: user._id,
          symbols: ['XAU/USD', 'EUR/USD', 'GBP/USD', 'BTC/USD', 'NASDAQ', 'US30'],
        });
      } catch (e) {
        console.warn('[Register] DB creation notice:', e.message);
      }
    }

    // 3. Always ensure user is saved in persistent userStore with bcrypt password hash
    let storedUser = null;
    try {
      storedUser = await userStore.addUser({
        name: name.trim(),
        email: cleanEmail,
        password,
        experienceLevel: experienceLevel || 'BEGINNER',
        tradingGoals: tradingGoals || ['Learn Price Action', 'Practice $100,000 Paper Account'],
      });
    } catch (e) {
      // If already added
    }

    const activeUserId = user ? user._id.toString() : (storedUser?._id || `user_${Date.now()}`);
    const token = generateToken(activeUserId);

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Your $100,000 virtual trading account is ready.',
      token,
      user: {
        id: activeUserId,
        _id: activeUserId,
        name: user ? user.name : (storedUser?.name || name.trim()),
        email: cleanEmail,
        role: user ? user.role : (storedUser?.role || 'USER'),
        experienceLevel: user ? user.experienceLevel : (storedUser?.experienceLevel || 'BEGINNER'),
        tradingGoals: user ? user.tradingGoals : (storedUser?.tradingGoals || ['Learn Price Action']),
      },
      portfolio: {
        virtualBalance: 100000.00,
        equity: 100000.00,
        availableMargin: 100000.00,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Login user & return JWT token
// @route  POST /api/auth/login
// @access Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    let user = null;
    let isMatch = false;

    // 1. Try DB lookup if connected
    if (isDbConnected()) {
      try {
        user = await User.findOne({ email: cleanEmail }).select('+password');
        if (user) {
          isMatch = await user.matchPassword(password);
        }
      } catch (e) {
        // fallback
      }
    }

    // 2. Fallback to persistent userStore
    if (!user || !isMatch) {
      const storedUser = userStore.findByEmail(cleanEmail);
      if (storedUser) {
        const verified = await userStore.verifyPassword(storedUser, password);
        if (verified) {
          user = storedUser;
          isMatch = true;
        }
      }
    }

    if (!user || !isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const activeUserId = user._id ? user._id.toString() : user.id;
    const token = generateToken(activeUserId);

    res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id: activeUserId,
        _id: activeUserId,
        name: user.name,
        email: user.email,
        role: user.role || 'USER',
        experienceLevel: user.experienceLevel || 'BEGINNER',
        tradingGoals: user.tradingGoals || ['Learn Price Action'],
      },
      portfolio: {
        virtualBalance: 100000.00,
        equity: 100000.00,
        availableMargin: 100000.00,
        totalRealizedPL: 0.00,
        winRate: 0.00,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get current logged in user profile
// @route  GET /api/auth/me
// @access Private
const getMe = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'User session not found.' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id || user.id,
        _id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'USER',
        experienceLevel: user.experienceLevel || 'BEGINNER',
        tradingGoals: user.tradingGoals || [],
      },
      portfolio: {
        virtualBalance: 100000.00,
        equity: 100000.00,
        availableMargin: 100000.00,
      },
      progress: {
        currentOverallLevel: 1,
        completedLessons: [],
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Update user profile
// @route  PUT /api/auth/profile
// @access Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, experienceLevel } = req.body;
    const userId = req.user?._id || req.user?.id;

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(userId)) {
      try {
        await User.findByIdAndUpdate(userId, {
          ...(name && { name }),
          ...(experienceLevel && { experienceLevel }),
        });
      } catch (e) {
        // ignore
      }
    }

    // Also update in userStore
    if (userId) {
      userStore.updateUser(userId, {
        ...(name && { name }),
        ...(experienceLevel && { experienceLevel }),
      });
    }

    if (req.user) {
      if (name) req.user.name = name;
      if (experienceLevel) req.user.experienceLevel = experienceLevel;
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: req.user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Synchronize Firebase Auth user with MongoDB & create $100k demo account if new
// @route  POST /api/auth/firebase-sync
// @access Public
const firebaseAuthSync = async (req, res, next) => {
  try {
    const { email, name, uid, photoURL, experienceLevel, tradingGoals } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required from Firebase authentication.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const displayName = (name && name.trim()) || cleanEmail.split('@')[0] || 'KKN Trader';
    let user = null;
    let isNewUser = false;

    const activeUserId = uid || (user ? user._id.toString() : (storedUser?._id || `user_fb_${Date.now()}`));
    const token = generateToken(activeUserId);

    // 1. Check MongoDB
    if (isDbConnected()) {
      try {
        user = await User.findOne({ email: cleanEmail });
        if (!user) {
          isNewUser = true;
          // Generate a secure random password for Firebase-authenticated users
          const randomPassword = `Fb_${Math.random().toString(36).slice(-8)}_${Date.now()}!Aa`;
          user = await User.create({
            name: displayName,
            email: cleanEmail,
            password: randomPassword,
            avatar: photoURL || '',
            experienceLevel: experienceLevel || 'BEGINNER',
            tradingGoals: tradingGoals || ['Learn Market Structure', 'Risk Management', 'Master Price Action'],
            role: 'USER',
          });

          await Portfolio.create({
            userId: activeUserId,
            initialBalance: 100000.00,
            virtualBalance: 100000.00,
            equity: 100000.00,
            availableMargin: 100000.00,
            equityHistory: [{ timestamp: new Date(), balance: 100000.00, equity: 100000.00 }],
          });

          await Watchlist.create({
            userId: activeUserId,
            symbols: ['XAU/USD', 'EUR/USD', 'GBP/USD', 'BTC/USD', 'NASDAQ', 'US30'],
          });
        } else if (name && name.trim() && user.name !== name.trim()) {
          user.name = name.trim();
          await user.save();
        }
      } catch (e) {
        console.warn('[Firebase Sync] DB lookup/creation notice:', e.message);
      }
    }

    // 2. Check / Sync with userStore fallback
    let storedUser = userStore.findByEmail(cleanEmail);
    if (!storedUser && !user) {
      isNewUser = true;
      try {
        storedUser = await userStore.addUser({
          name: displayName,
          email: cleanEmail,
          password: `Fb_${Math.random().toString(36).slice(-8)}!`,
          experienceLevel: experienceLevel || 'BEGINNER',
          tradingGoals: tradingGoals || ['Learn Price Action', 'Practice $100,000 Paper Account'],
        });
      } catch (e) {
        // ignore
      }
    } else if (storedUser && name && name.trim()) {
      storedUser = userStore.updateUser(storedUser._id || storedUser.id, { name: name.trim() });
    }

    // Retrieve portfolio if MongoDB connected
    let portfolioData = {
      virtualBalance: 100000.00,
      equity: 100000.00,
      availableMargin: 100000.00,
    };
    if (isDbConnected()) {
      try {
        let p = await Portfolio.findOne({ userId: activeUserId });
        if (!p && user) {
          p = await Portfolio.findOne({ userId: user._id });
        }
        if (p) {
          portfolioData = {
            virtualBalance: p.virtualBalance,
            equity: p.equity,
            availableMargin: p.availableMargin,
          };
        }
      } catch (e) {
        // use default
      }
    }

    res.status(200).json({
      success: true,
      message: isNewUser ? 'Welcome to KKN TRADER! Your $100,000 virtual trading account is ready.' : 'Authenticated with Firebase successfully.',
      token,
      user: {
        id: activeUserId,
        _id: activeUserId,
        name: user ? user.name : (storedUser?.name || displayName),
        email: cleanEmail,
        avatar: (user && user.avatar) || photoURL || '',
        role: user ? user.role : (storedUser?.role || 'USER'),
        experienceLevel: user ? user.experienceLevel : (storedUser?.experienceLevel || 'BEGINNER'),
        tradingGoals: user ? user.tradingGoals : (storedUser?.tradingGoals || ['Learn Price Action']),
      },
      portfolio: portfolioData,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  firebaseAuthSync,
};

