# 🏆 KKN TRADER — Production-Grade Trading Education & Paper Trading Platform

**Official Website / Domain**: [`kkntrader.com`](https://kkntrader.com)  
**Brand Identity**: KKN Trader (Official Golden Bull Brand Identity)  
**Tagline**: *"Learn the Market. Practice the Trade. Master the Skill."*  
**Official Instagram**: [`@tradewith_kkn`](https://instagram.com/tradewith_kkn)

---

## 📌 Platform Overview

**KKN TRADER** is a complete, full-stack financial trading education and paper trading platform built on the MERN stack (MongoDB, Express, React, Node.js + Vite & Tailwind CSS).

- **12-Level Academy**: Complete structured curriculum from beginner basics (Pips, Lots, Pairs, Leverage) to institutional SMC / ICT concepts (Order Blocks, Liquidity Sweeps, FVGs).
- **Interactive Quizzes**: Knowledge check after every level with instant grading and badge unlocks.
- **Institutional Trading Terminal ($100,000 Demo Funds)**: TradingView Lightweight Charts engine, multi-timeframe interactive candles, order execution (Market/Limit/Stop), on-chart SL/TP price lines, automated triggers, and live P/L ticking.
- **Automated Trading Journal**: Auto-records every closed paper trade with emotion and mistake tracking.
- **Portfolio Analytics**: Live equity curves, win rate calculations, profit factors, and trade distribution.
- **7 Financial Calculators**: Position Size (1% risk rule), Pip Value, Risk/Reward, Margin, Compounding, and P/L.
- **KKN AI Learning Assistant**: Institutional AI assistant running via secure backend API.
- **Admin Control Center (`/admin`)**: Platform overview, user moderation, and curriculum management.

---

## 🛠️ Technology Stack & Architecture

```
                       ┌───────────────────────────────┐
                       │      kkntrader.com (Vercel)   │
                       │   React 18 + Vite + Tailwind  │
                       └───────────────┬───────────────┘
                                       │ HTTPS (VITE_API_BASE_URL)
                                       ▼
                       ┌───────────────────────────────┐
                       │     Render Web Service API    │
                       │     Node.js + Express.js      │
                       └───────────────┬───────────────┘
                                       │ TLS Connection (mongodb+srv)
                                       ▼
                       ┌───────────────────────────────┐
                       │      MongoDB Atlas Cluster    │
                       │  Users, Portfolios, Positions │
                       └───────────────────────────────┘
```

- **Frontend Hosting**: [Vercel](https://vercel.com) (Optimized SPA routing via `vercel.json`)
- **Backend Hosting**: [Render](https://render.com) (Node.js web service running with `process.env.PORT`)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Cloud replica set with Mongoose ODM)
- **Authentication**: Stateless JWT in `Authorization: Bearer <token>` headers, bcryptjs password hashing
- **Security**: Helmet headers, dynamic CORS whitelist, zero client-exposed secrets

---

## 🔑 Environment Variables Reference

### Backend (`backend/.env`)
| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | Port for the Express server | `5000` (Render sets this automatically) |
| `NODE_ENV` | Runtime environment mode | `production` |
| `CLIENT_URL` | Frontend domain allowed for CORS | `https://kkntrader.com` |
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/kkntrader?retryWrites=true&w=majority` |
| `JWT_SECRET` | Secret key for signing user tokens | `kkn_super_secret_jwt_key_2026_production` |
| `JWT_EXPIRE` | Expiry duration for JWT tokens | `30d` |
| `AI_PROVIDER` | AI mode for learning assistant | `offline_smart_engine` (or `gemini` / `openai`) |
| `GEMINI_API_KEY` | (Optional) Google Gemini API Key | `AIzaSy...` |
| `OPENAI_API_KEY` | (Optional) OpenAI API Key | `sk-...` |

### Frontend (`frontend/.env`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Public URL of your deployed Render backend | `https://kkn-trader-backend.onrender.com/api` |

---

## 🚀 Step-by-Step Production Deployment Guide

### STEP 1: Upload Codebase to GitHub

1. Open your terminal in the root project folder:
   ```bash
   cd "kkn trader website"
   ```

2. Initialize Git and make the initial commit:
   ```bash
   git init
   git branch -M main
   git add .
   git commit -m "feat: KKN TRADER production deployment ready"
   ```

3. Create a new repository on [GitHub](https://github.com/new) named `kkn-trader`.

4. Link and push to GitHub:
   ```bash
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/kkn-trader.git
   git push -u origin main
   ```

---

### STEP 2: Set Up MongoDB Atlas Database

1. Sign up or log in at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Click **Create a Database** and select the **M0 Free** tier.
3. Choose your preferred cloud provider and closest region (e.g. AWS / Mumbai or Singapore / Frankfurt).
4. **Create Database User**:
   - Go to **Security** -> **Database Access** -> **Add New Database User**.
   - Set **Authentication Method**: Password.
   - Enter Username (e.g., `kknadmin`) and a strong Password. Save these credentials.
   - Set Database User Privileges: `Read and write to any database`.
5. **Configure Network Access**:
   - Go to **Security** -> **Network Access** -> **Add IP Address**.
   - Select **Allow Access From Anywhere** (`0.0.0.0/0`) so Render instances can connect.
6. **Get Connection String**:
   - Click **Database** -> **Connect** -> **Drivers** (Node.js).
   - Copy your SRV URI. It looks like:
     ```
     mongodb+srv://kknadmin:<password>@cluster0.abcde.mongodb.net/kkntrader?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual database user password.

---

### STEP 3: Deploy Backend on Render

1. Sign up or log in at [Render.com](https://render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub account and select your `kkn-trader` repository.
4. Fill in the deployment settings:
   - **Name**: `kkn-trader-backend`
   - **Region**: Choose the region closest to your MongoDB Atlas cluster
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
5. Click **Advanced** -> **Add Environment Variable** and add the following:
   - `NODE_ENV` = `production`
   - `CLIENT_URL` = `https://kkntrader.com`
   - `MONGODB_URI` = `<YOUR_MONGODB_ATLAS_CONNECTION_STRING>`
   - `JWT_SECRET` = `<GENERATE_A_STRONG_RANDOM_STRING>`
   - `JWT_EXPIRE` = `30d`
   - `AI_PROVIDER` = `offline_smart_engine`
6. Click **Create Web Service**.
7. Once deployed, Render will provide your public backend URL, e.g.:
   `https://kkn-trader-backend.onrender.com`
8. Verify backend health by visiting:
   `https://kkn-trader-backend.onrender.com/api/health`

---

### STEP 4: Deploy Frontend on Vercel

1. Sign up or log in at [Vercel.com](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your GitHub `kkn-trader` repository.
4. In the Project Configuration:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. In **Environment Variables**, add:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://kkn-trader-backend.onrender.com/api` *(replace with your actual Render backend URL)*
6. Click **Deploy**.
7. In ~60 seconds, Vercel will deploy your site with global CDN distribution!

---

### STEP 5: Connect Custom Domain `kkntrader.com`

1. Open your project dashboard in **Vercel**.
2. Go to **Settings** -> **Domains**.
3. Add:
   - `kkntrader.com`
   - `www.kkntrader.com`
4. Log into your domain registrar (Hostinger / GoDaddy / Namecheap / Cloudflare):
   - Add **A Record**:
     - **Host / Name**: `@`
     - **Value / Points to**: `76.76.21.21`
     - **TTL**: Automatic (or 3600)
   - Add **CNAME Record**:
     - **Host / Name**: `www`
     - **Value / Points to**: `cname.vercel-dns.com`
     - **TTL**: Automatic (or 3600)
5. Vercel will automatically verify DNS records and provision a free, auto-renewing Let's Encrypt SSL certificate.
6. Once active, update `CLIENT_URL` in Render backend environment variables to `https://kkntrader.com`.

---

## 💻 Local Development Setup

To run the full stack locally:

```bash
# 1. Clone the repository
git clone https://github.com/<YOUR_GITHUB_USERNAME>/kkn-trader.git
cd kkn-trader

# 2. Install all dependencies
npm run install:all

# 3. Start the Backend API (Port 5000)
npm run dev:backend

# 4. In a separate terminal, start the Frontend (Port 5173)
npm run dev:frontend
```

Open your browser at `http://localhost:5173`.

---

## 🔐 Default Demo Accounts (Auto-Seeded)

- **Student Trader Account**:
  - **Email**: `trader@kkntrader.com`
  - **Password**: `Trader@KKN2026!`
  - **Balance**: $100,000.00 virtual practice money
- **Platform Master Admin**:
  - **Email**: `admin@kkntrader.com`
  - **Password**: `Admin@KKNTrader2026!`
  - **Access URL**: `/admin`

---

## ⚖️ Legal & Educational Disclaimer

*KKN TRADER is strictly an educational financial platform. All market quotations, order executions, account balances, and analytics are simulated virtual demonstrations for training and skill development. KKN Trader does not solicit deposits, provide investment advice, or execute live real-money trades.*
