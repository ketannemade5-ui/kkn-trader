const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error('[UserStore] Error creating data directory:', err.message);
  }
}

// Initial demo accounts
const DEFAULT_DEMO_USERS = [
  {
    _id: 'demo_user_id',
    id: 'demo_user_id',
    name: 'KKN Pro Trader',
    email: 'trader@kkntrader.com',
    passwordHash: '$2a$10$w09ZkH8sD0g46xY9qWw6O.zJ5zYc2Xb1xV1zV1zV1zV1zV1zV1zV1', // Fallback hash
    plainPassword: 'Trader@KKN2026!', // for direct fallback match
    role: 'USER',
    experienceLevel: 'INTERMEDIATE',
    tradingGoals: ['Learn Price Action', 'Practice $100,000 Paper Account', 'Master Risk Management'],
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    _id: 'demo_admin_id',
    id: 'demo_admin_id',
    name: 'KKN Master Trader',
    email: 'admin@kkntrader.com',
    passwordHash: '$2a$10$w09ZkH8sD0g46xY9qWw6O.zJ5zYc2Xb1xV1zV1zV1zV1zV1zV1zV1',
    plainPassword: 'Admin@KKNTrader2026!',
    role: 'ADMIN',
    experienceLevel: 'ADVANCED',
    tradingGoals: ['Master SMC Order Flow', 'Institutional Risk Control', 'Curriculum Excellence'],
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

let cachedUsers = null;

const loadUsersFromFile = () => {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const raw = fs.readFileSync(USERS_FILE, 'utf-8');
      if (raw && raw.trim()) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    }
  } catch (err) {
    console.warn('[UserStore] Could not read users file, initializing defaults:', err.message);
  }
  saveUsersToFile(DEFAULT_DEMO_USERS);
  return [...DEFAULT_DEMO_USERS];
};

const saveUsersToFile = (users) => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.error('[UserStore] Error writing to users file:', err.message);
  }
};

const getAllUsers = () => {
  if (!cachedUsers) {
    cachedUsers = loadUsersFromFile();
  }
  return cachedUsers;
};

const findByEmail = (email) => {
  if (!email) return null;
  const users = getAllUsers();
  const normalized = email.trim().toLowerCase();
  return users.find((u) => u.email.toLowerCase() === normalized) || null;
};

const findById = (id) => {
  if (!id) return null;
  const users = getAllUsers();
  return users.find((u) => u._id === id || u.id === id) || null;
};

const addUser = async ({ name, email, password, role = 'USER', experienceLevel = 'BEGINNER', tradingGoals = [] }) => {
  const users = getAllUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    throw new Error('An account with this email address already exists.');
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = {
    _id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: role.toUpperCase(),
    experienceLevel: experienceLevel || 'BEGINNER',
    tradingGoals: tradingGoals.length > 0 ? tradingGoals : ['Learn Market Structure', 'Risk Management', 'Master Price Action'],
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  cachedUsers = users;
  saveUsersToFile(users);

  return newUser;
};

const verifyPassword = async (user, enteredPassword) => {
  if (!user || !enteredPassword) return false;
  // 1. Direct plainPassword match for demo accounts
  if (user.plainPassword && user.plainPassword === enteredPassword) {
    return true;
  }
  // 2. Bcrypt compare against passwordHash
  if (user.passwordHash) {
    try {
      const match = await bcrypt.compare(enteredPassword, user.passwordHash);
      if (match) return true;
    } catch (e) {
      // ignore
    }
  }
  // 3. Fallback for legacy plain password
  if (user.password && user.password === enteredPassword) {
    return true;
  }
  return false;
};

const updateUser = (id, updates = {}) => {
  const users = getAllUsers();
  const index = users.findIndex((u) => u._id === id || u.id === id);
  if (index === -1) return null;

  users[index] = { ...users[index], ...updates };
  cachedUsers = users;
  saveUsersToFile(users);
  return users[index];
};

module.exports = {
  getAllUsers,
  findByEmail,
  findById,
  addUser,
  verifyPassword,
  updateUser,
};
