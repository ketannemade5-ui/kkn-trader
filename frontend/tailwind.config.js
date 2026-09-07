/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kkn: {
          bg: '#070a12',
          surface: '#0b111e',
          card: '#0f172a',
          cardHover: '#131f37',
          border: '#1e293b',
          borderHover: '#334155',
          gold: {
            DEFAULT: '#d4af37',
            light: '#f3c64c',
            dark: '#b38f28',
            dim: 'rgba(212, 175, 55, 0.15)',
            glow: 'rgba(212, 175, 55, 0.35)',
          },
          bull: '#10b981',
          bear: '#ef4444',
          accent: '#38bdf8',
          text: {
            primary: '#f8fafc',
            secondary: '#94a3b8',
            muted: '#64748b',
          }
        },
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(212, 175, 55, 0.25)',
        'gold-sm': '0 0 10px 0 rgba(212, 175, 55, 0.15)',
        'blue-glow': '0 0 25px -5px rgba(56, 189, 248, 0.2)',
        'card-dark': '0 8px 30px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gold-gradient': 'linear-gradient(135deg, #d4af37 0%, #fef08a 50%, #b38f28 100%)',
        'dark-glass': 'linear-gradient(180deg, rgba(15, 23, 42, 0.75) 0%, rgba(11, 17, 30, 0.85) 100%)',
      },
    },
  },
  plugins: [],
};
