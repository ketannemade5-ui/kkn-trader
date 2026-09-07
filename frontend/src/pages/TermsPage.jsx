import React from 'react';

export const TermsPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 font-sans">
      <h1 className="text-3xl sm:text-4xl font-black text-white font-['Outfit']">
        Terms of Service
      </h1>
      <p className="text-xs font-mono text-slate-400">
        Official Website: kkntrader.com • KKN TRADER
      </p>

      <div className="glass-card rounded-3xl p-8 border border-slate-800 space-y-6 text-sm text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-['Outfit']">1. Educational License</h2>
          <p>
            KKN Trader grants users a non-exclusive, non-transferable educational license to access course materials, quizzes, and simulation tools for personal learning.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-['Outfit']">2. Virtual Nature of Simulated Trading</h2>
          <p>
            Users acknowledge that paper trading balances, transactions, and profits are entirely fictional and do not represent real financial assets.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-['Outfit']">3. Code of Conduct</h2>
          <p>
            Users agree not to exploit, scrape, or disrupt platform services. Accounts found violating platform integrity are subject to immediate suspension.
          </p>
        </section>
      </div>
    </div>
  );
};
