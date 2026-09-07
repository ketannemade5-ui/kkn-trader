import React from 'react';

export const PrivacyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 font-sans">
      <h1 className="text-3xl sm:text-4xl font-black text-white font-['Outfit']">
        Privacy Policy
      </h1>
      <p className="text-xs font-mono text-slate-400">
        Official Website: kkntrader.com • KKN TRADER
      </p>

      <div className="glass-card rounded-3xl p-8 border border-slate-800 space-y-6 text-sm text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-['Outfit']">1. Information We Collect</h2>
          <p>
            When registering for a KKN Trader student account, we collect your name, email address, and optional experience preferences to personalize your learning roadmap.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-['Outfit']">2. Usage of Simulation Data</h2>
          <p>
            Simulated trades, journal notes, and quiz scores are stored securely to generate your private performance analytics dashboard.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-['Outfit']">3. Data Security & Encryption</h2>
          <p>
            We implement industry-standard password hashing (bcrypt) and JSON Web Token (JWT) session security to safeguard your credentials.
          </p>
        </section>
      </div>
    </div>
  );
};
