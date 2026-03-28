import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0D0B1A',
        primary: '#7C3AED',
        'primary-light': '#A855F7',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #7C3AED, #A855F7)',
      },
    },
  },
  plugins: [],
}

export default config
