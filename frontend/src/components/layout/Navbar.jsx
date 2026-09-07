import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePaperTrading } from '../../context/PaperTradingContext';
import {
  Menu,
  X,
  TrendingUp,
  BookOpen,
  Cpu,
  Calculator,
  BookMarked,
  Newspaper,
  LayoutDashboard,
  PieChart,
  User,
  Shield,
  LogOut,
  ChevronDown,
  Sparkles,
  DollarSign,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { portfolio } = usePaperTrading();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
      isActive
        ? 'text-kkn-gold bg-kkn-gold/10 border border-kkn-gold/30 shadow-gold-sm font-semibold'
        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-kkn-bg/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center">
              <div className="absolute -inset-1 bg-kkn-gold/20 rounded-full blur-sm group-hover:bg-kkn-gold/40 transition-all duration-300"></div>
              <img
                src="/assets/logo.png"
                alt="KKN TRADER Official Brand Logo"
                className="relative h-10 sm:h-12 w-auto object-contain rounded-md shadow-md"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-extrabold tracking-wider text-white font-['Outfit'] flex items-center gap-1.5">
                KKN <span className="text-gold-gradient">TRADER</span>
              </span>
              <span className="text-[10px] text-kkn-gold/80 tracking-widest font-mono uppercase font-semibold hidden sm:inline-block">
                Institutional Academy & Simulation
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {!isAuthenticated ? (
              <>
                <NavLink to="/" className={navLinkClass}>Home</NavLink>
                <NavLink to="/learn" className={navLinkClass}>
                  <BookOpen className="w-4 h-4 text-kkn-gold/80" />
                  Learn
                </NavLink>
                <NavLink to="/markets" className={navLinkClass}>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Markets
                </NavLink>
                <NavLink to="/trade" className={navLinkClass}>
                  <Sparkles className="w-4 h-4 text-kkn-gold" />
                  Paper Trade
                </NavLink>
                <NavLink to="/tools" className={navLinkClass}>
                  <Calculator className="w-4 h-4 text-sky-400" />
                  Tools
                </NavLink>
                <NavLink to="/ai" className={navLinkClass}>
                  <Cpu className="w-4 h-4 text-purple-400" />
                  KKN AI
                </NavLink>
                <NavLink to="/journal" className={navLinkClass}>
                  <BookMarked className="w-4 h-4 text-amber-400" />
                  Journal
                </NavLink>
                <NavLink to="/blog" className={navLinkClass}>
                  <Newspaper className="w-4 h-4 text-slate-400" />
                  Blog
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/dashboard" className={navLinkClass}>
                  <LayoutDashboard className="w-4 h-4 text-sky-400" />
                  Dashboard
                </NavLink>
                <NavLink to="/markets" className={navLinkClass}>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Markets
                </NavLink>
                <NavLink to="/trade" className={navLinkClass}>
                  <Sparkles className="w-4 h-4 text-kkn-gold" />
                  Paper Trade
                </NavLink>
                <NavLink to="/portfolio" className={navLinkClass}>
                  <PieChart className="w-4 h-4 text-indigo-400" />
                  Portfolio
                </NavLink>
                <NavLink to="/journal" className={navLinkClass}>
                  <BookMarked className="w-4 h-4 text-amber-400" />
                  Journal
                </NavLink>
                <NavLink to="/learn" className={navLinkClass}>
                  <BookOpen className="w-4 h-4 text-kkn-gold/80" />
                  Learn
                </NavLink>
                <NavLink to="/ai" className={navLinkClass}>
                  <Cpu className="w-4 h-4 text-purple-400" />
                  KKN AI
                </NavLink>
                <NavLink to="/tools" className={navLinkClass}>
                  <Calculator className="w-4 h-4 text-sky-400" />
                  Tools
                </NavLink>
              </>
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-800/80 rounded-lg transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-slate-950 bg-gold-gradient rounded-lg shadow-gold-glow hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 fill-black/20" />
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* Virtual Balance Chip */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/60 shadow-inner">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-[11px] text-slate-400 font-medium">Virtual:</span>
                  <span className="text-sm font-bold text-white font-mono">
                    ${(portfolio?.equity || 100000).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-kkn-gold/40 text-slate-200 hover:text-white transition-all"
                  >
                    <div className="w-7 h-7 rounded-full bg-kkn-gold/20 border border-kkn-gold/40 flex items-center justify-center text-kkn-gold font-bold text-xs">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="text-xs font-semibold max-w-[100px] truncate">{user?.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-800">
                        <p className="text-xs text-slate-400">Signed in as</p>
                        <p className="text-sm font-semibold text-white truncate">{user?.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">
                            ADMIN ACCESS
                          </span>
                        )}
                      </div>

                      <Link
                        to="/profile"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800/80"
                      >
                        <User className="w-4 h-4 text-kkn-gold" />
                        Profile & Achievements
                      </Link>

                      <Link
                        to="/portfolio"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800/80"
                      >
                        <PieChart className="w-4 h-4 text-indigo-400" />
                        Portfolio Analytics
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-purple-300 hover:bg-purple-950/40 border-t border-slate-800"
                        >
                          <Shield className="w-4 h-4 text-purple-400" />
                          Admin Console
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-950/30 border-t border-slate-800 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            {isAuthenticated && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-kkn-gold">
                ${(portfolio?.equity || 100000).toLocaleString('en-US', { minimumFractionDigits: 0 })}
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-kkn-gold" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-kkn-surface/98 backdrop-blur-2xl px-4 pt-3 pb-6 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-1.5">
            {!isAuthenticated ? (
              <>
                <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>Home</NavLink>
                <NavLink to="/learn" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>Academy (12 Levels)</NavLink>
                <NavLink to="/markets" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>Live Markets</NavLink>
                <NavLink to="/trade" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>Paper Trading ($10k Demo)</NavLink>
                <NavLink to="/tools" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>7 Trading Tools</NavLink>
                <NavLink to="/ai" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>KKN AI Assistant</NavLink>
                <NavLink to="/journal" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>Trading Journal</NavLink>
                <NavLink to="/blog" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>Blog & Insights</NavLink>
                <div className="pt-4 flex flex-col gap-2 border-t border-slate-800 mt-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-lg border border-slate-700 text-sm font-semibold text-white bg-slate-900"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-lg text-sm font-bold text-slate-950 bg-gold-gradient shadow-gold-glow"
                  >
                    Get Started Free ($10k Virtual Account)
                  </Link>
                </div>
              </>
            ) : (
              <>
                <NavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>Dashboard</NavLink>
                <NavLink to="/trade" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>Paper Trading Terminal</NavLink>
                <NavLink to="/markets" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>Markets & Charts</NavLink>
                <NavLink to="/portfolio" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>Portfolio Analytics</NavLink>
                <NavLink to="/journal" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>Trading Journal</NavLink>
                <NavLink to="/learn" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>Trading Academy</NavLink>
                <NavLink to="/ai" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>KKN AI</NavLink>
                <NavLink to="/tools" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>Calculators</NavLink>
                <NavLink to="/profile" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>Profile & Badges</NavLink>
                {isAdmin && (
                  <NavLink to="/admin" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>Admin Panel</NavLink>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="mt-3 w-full py-2.5 text-center text-sm font-semibold text-rose-400 bg-rose-950/40 rounded-lg border border-rose-900/50"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
