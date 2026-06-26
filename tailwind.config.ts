import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: 'var(--ink)',
        canvas: 'var(--canvas)',
        sage: 'var(--sage)',
        'sage-light': '#A8D4C8',
        coral: 'var(--coral)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        surface: 'var(--surface)',
        'on-ink': 'var(--on-ink)',
        'on-ink-muted': 'var(--on-ink-muted)',
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
          light: 'var(--accent-light)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        primary: {
          50: '#FDF0EE',
          100: '#F9D9D4',
          200: '#F2B3A9',
          300: '#EA8D7E',
          400: '#E57462',
          500: '#E85D4C',
          600: '#D14A3A',
          700: '#B03D30',
          800: '#8F3228',
          900: '#6E2720',
          DEFAULT: '#E85D4C',
          foreground: '#FFFFFF',
        },
        secondary: {
          50: '#F6F3EE',
          100: '#E2DDD4',
          200: '#C9C2B6',
          300: '#A8A093',
          400: '#6B7280',
          500: '#4B5563',
          600: '#374151',
          700: '#1F2937',
          800: '#111827',
          900: '#0C0F12',
          DEFAULT: '#0C0F12',
          foreground: '#FFFFFF',
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
        },
        error: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          600: '#DC2626',
          700: '#B91C1C',
        },
        success: {
          50: '#E8F3F0',
          100: '#C5E4DC',
          600: '#1A6B5C',
          700: '#155A4D',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        soft: '0 1px 3px 0 rgb(12 15 18 / 0.04), 0 1px 2px -1px rgb(12 15 18 / 0.04)',
        card: '0 1px 3px 0 rgb(12 15 18 / 0.06)',
        elevated: '0 4px 16px -2px rgb(12 15 18 / 0.08), 0 2px 6px -2px rgb(12 15 18 / 0.04)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.35s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.45s ease-out forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
