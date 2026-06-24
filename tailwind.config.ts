import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'media',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // CSS variable-backed semantic tokens — auto dark mode via CSS vars
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        muted: {
          DEFAULT: '#475569',
          foreground: 'var(--muted-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        destructive: {
          DEFAULT: '#DC2626',
          foreground: '#FFFFFF',
        },

        // Primary: Medical Teal — full 50–900 scale
        primary: {
          50:  '#ECFEFF',
          100: '#CFFAFE',
          200: '#A5F3FC',
          300: '#67E8F9',
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
          700: '#0E7490',
          800: '#155E75',
          900: '#164E63',
          DEFAULT: '#0891B2',
          foreground: '#FFFFFF',
        },

        // Secondary: Emerald — full 50–900 scale
        secondary: {
          50:  '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#145231',
          DEFAULT: '#059669',
          foreground: '#FFFFFF',
        },

        accent: {
          DEFAULT: '#059669',
          foreground: '#FFFFFF',
        },

        error: {
          50:  '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
          DEFAULT: '#DC2626',
          foreground: '#FFFFFF',
        },

        warning: {
          50:  '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          DEFAULT: '#EA580C',
          foreground: '#FFFFFF',
        },

        success: {
          50:  '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#145231',
          DEFAULT: '#059669',
          foreground: '#FFFFFF',
        },

        info: {
          DEFAULT: '#0891B2',
          foreground: '#FFFFFF',
        },
      },

      spacing: {
        xs:   '0.25rem',
        sm:   '0.5rem',
        md:   '0.75rem',
        lg:   '1rem',
        xl:   '1.5rem',
        '2xl':'2rem',
        '3xl':'3rem',
        '4xl':'4rem',
      },

      borderRadius: {
        none: '0',
        sm:   '0.25rem',
        md:   '0.375rem',
        lg:   '0.5rem',
        xl:   '0.75rem',
        '2xl':'1rem',
        '3xl':'1.5rem',
        full: '9999px',
      },

      fontFamily: {
        sans:    ['Figtree', 'system-ui', 'sans-serif'],
        display: ['Figtree', 'system-ui', 'sans-serif'],
        body:    ['Noto Sans', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        xs:   ['0.75rem',  { lineHeight: '1rem' }],
        sm:   ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem',     { lineHeight: '1.5rem' }],
        lg:   ['1.125rem', { lineHeight: '1.75rem' }],
        xl:   ['1.25rem',  { lineHeight: '1.75rem' }],
        '2xl':['1.5rem',   { lineHeight: '2rem' }],
        '3xl':['1.875rem', { lineHeight: '2.25rem' }],
        '4xl':['2.25rem',  { lineHeight: '2.5rem' }],
      },

      boxShadow: {
        xs:           '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        sm:           '0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)',
        md:           '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07)',
        lg:           '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        card:         '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'card-hover': '0 6px 16px -4px rgb(8 145 178 / 0.12)',
      },
    },
  },
  plugins: [],
}

export default config
