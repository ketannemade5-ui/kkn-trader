import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Award,
  BookOpen,
  CheckCircle2,
  Shield,
  Sparkles,
  Save,
  Trophy,
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [experienceLevel, setExperienceLevel] = useState(user?.experienceLevel || 'BEGINNER');
  const [loading, setLoading] = useState(false);

  const achievements = [
    { key: 'first_lesson', title: 'First Steps', desc: 'Completed your first Trading Academy lesson.', unlocked: true, icon: BookOpen },
    { key: 'first_quiz', title: 'Quiz Novice', desc: 'Passed your first module assessment.', unlocked: true, icon: Trophy },
    { key: 'first_trade', title: 'First Paper Trade', desc: 'Executed your first simulated position on KKN Terminal.', unlocked: true, icon: Sparkles },
    { key: 'risk_manager', title: 'Disciplined Risk Manager', desc: 'Maintained 1:2+ RR on paper trading positions.', unlocked: false, icon: Shield },
    { key: 'ten_trades', title: 'Active Trader', desc: 'Completed 10 paper trades with managed risk.', unlocked: false, icon: Award },
    { key: 'journal_master', title: 'Journal Master', desc: 'Logged notes and lessons on all trades.', unlocked: false, icon: CheckCircle2 },
  ];

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    await updateProfile({ name, experienceLevel });
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-kkn-gold/20 border-2 border-kkn-gold flex items-center justify-center text-kkn-gold font-extrabold text-2xl font-['Outfit']">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
            {user?.name}
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            {user?.email} • Role: <strong className="text-kkn-gold">{user?.role}</strong>
          </p>
        </div>
      </div>

      {/* Profile Settings Form */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
        <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
          <User className="w-5 h-5 text-kkn-gold" />
          Trader Profile Details
        </h3>

        <form onSubmit={handleSave} className="space-y-4 font-mono text-xs max-w-xl">
          <div>
            <label className="text-slate-400 block mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
              required
            />
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Trader Level</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
            >
              <option value="BEGINNER">Beginner (Level 1-3)</option>
              <option value="INTERMEDIATE">Intermediate (Level 4-7)</option>
              <option value="ADVANCED">Advanced (Level 8-12)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gold-gradient text-slate-950 font-extrabold text-xs uppercase flex items-center gap-2 shadow-gold-sm hover:brightness-110 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : 'Update Profile'}</span>
          </button>
        </form>
      </div>

      {/* Badges & Achievements Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white font-['Outfit'] flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            Milestone Achievements & Badges
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Unlocked: <strong className="text-kkn-gold">3</strong> / {achievements.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => {
            const Icon = ach.icon;
            return (
              <div
                key={ach.key}
                className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                  ach.unlocked
                    ? 'glass-card border-kkn-gold/40 shadow-gold-sm'
                    : 'bg-slate-950/40 border-slate-900 opacity-50'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    ach.unlocked
                      ? 'bg-kkn-gold/20 text-kkn-gold border border-kkn-gold/40'
                      : 'bg-slate-900 text-slate-600 border border-slate-800'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white font-['Outfit']">
                    {ach.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {ach.desc}
                  </p>
                  <span className="text-[10px] font-mono font-bold text-kkn-gold block pt-1">
                    {ach.unlocked ? '✓ UNLOCKED' : 'LOCKED'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
