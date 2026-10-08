/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./index.tsx",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          crimson: '#BA0C2F',
          'crimson-hover': '#9B0A27',
          'crimson-subtle': '#FFF1F3',
          'crimson-border': '#FECDD3',
          navy: '#0F172A',
          'navy-surface': '#1E293B',
          'navy-border': '#334155',
          gold: '#C59B27',
          'gold-subtle': '#FEF9E7',
        },
        surface: {
          canvas: '#F8FAFC',
          card: '#FFFFFF',
          subtle: '#F1F5F9',
          border: '#E2E8F0',
          'border-strong': '#CBD5E1',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 4px 12px -2px rgba(15, 23, 42, 0.08), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
        elevated: '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
      },
      borderRadius: {
        'subtle': '6px',
        'card': '10px',
        'panel': '12px',
      },
    },
  },
  plugins: [],
};
