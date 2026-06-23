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
        primary: {
          DEFAULT: '#15803D',
          foreground: '#FFFFFF',
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        accent: {
          DEFAULT: '#0369A1',
          foreground: '#FFFFFF',
        },
        background: '#F0FDF4',
        foreground: '#14532D',
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#14532D',
        },
        muted: {
          DEFAULT: '#E8F0F1',
          foreground: '#4B5563',
        },
        border: '#BBF7D0',
        destructive: {
          DEFAULT: '#DC2626',
          foreground: '#FFFFFF',
        },
        ring: '#15803D',
        input: '#BBF7D0',
        secondary: {
          DEFAULT: '#22C55E',
          foreground: '#14532D',
        },
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.07)',
        'card-hover': '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.07)',
      },
    },
  },
  plugins: [],
}

export default config
