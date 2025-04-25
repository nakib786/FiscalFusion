/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class', 'class'],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: '#E6FFFA',
          100: '#B2F5EA',
          200: '#81E6D9',
          300: '#4FD1C5',
          400: '#38B2AC',
          500: '#319795',
          600: '#2C7A7B',
          700: '#285E61',
          800: '#234E52',
          900: '#1D4044',
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          50: '#F7FAFC',
          100: '#EDF2F7',
          200: '#E2E8F0',
          300: '#CBD5E0',
          400: '#A0AEC0',
          500: '#718096',
          600: '#4A5568',
          700: '#2D3748',
          800: '#1A202C',
          900: '#171923',
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // Add animation keyframes and utilities
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'aurora-1': {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(8%, 4%) scale(1.1)' },
          '66%': { transform: 'translate(-8%, 8%) scale(0.9)' },
          '100%': { transform: 'translate(0, 0) scale(1)' },
        },
        'aurora-2': {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(-12%, -4%) scale(1.1)' },
          '66%': { transform: 'translate(12%, -8%) scale(0.9)' },
          '100%': { transform: 'translate(0, 0) scale(1)' },
        },
        'aurora-3': {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(-5%, 8%) scale(1.1)' },
          '66%': { transform: 'translate(5%, -10%) scale(0.9)' },
          '100%': { transform: 'translate(0, 0) scale(1)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        'aurora-1': 'aurora-1 15s ease infinite',
        'aurora-2': 'aurora-2 18s ease infinite',
        'aurora-3': 'aurora-3 21s ease infinite',
      }
    },
  },
  plugins: [],
} 