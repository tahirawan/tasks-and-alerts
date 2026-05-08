/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#26133f',
        muted: '#6f5b8f',
        accent: '#7c67ff',
        'accent-soft': '#e3ccff',
        'accent-dim': 'rgba(124,103,255,0.12)',
        pink: '#ff93cf',
        panel: 'rgba(249,243,255,0.78)',
        'panel-strong': 'rgba(253,248,255,0.92)',
        border: 'rgba(94,59,148,0.14)',
        'border-strong': 'rgba(94,59,148,0.28)',
      },
      fontFamily: {
        sans: [
          '"Avenir Next"',
          '"Trebuchet MS"',
          '"Segoe UI"',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        display: [
          '"Avenir Next Condensed"',
          '"Trebuchet MS"',
          '"Segoe UI"',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      borderRadius: {
        xs: '8px',
        sm: '10px',
        md: '14px',
        lg: '20px',
        xl: '28px',
      },
      boxShadow: {
        panel: '0 28px 80px rgba(11,5,23,0.32)',
        card: '0 10px 32px rgba(11,5,23,0.22)',
        'card-sm': '0 4px 14px rgba(11,5,23,0.16)',
        accent: '0 10px 22px rgba(124,103,255,0.30)',
      },
      backdropBlur: {
        glass: '18px',
      },
    },
  },
  plugins: [],
};
