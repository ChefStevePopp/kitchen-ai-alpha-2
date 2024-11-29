/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['DM Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        status: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        accent: {
          orange: '#ff7849',
          green: '#13ce66',
          yellow: '#ffc82c',
          red: '#ff4949',
        },
        rose: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        }
      },
      fontSize: {
        'fluid-xs': 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
        'fluid-sm': 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
        'fluid-base': 'clamp(1rem, 0.925rem + 0.375vw, 1.125rem)',
        'fluid-lg': 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)',
        'fluid-xl': 'clamp(1.25rem, 1.125rem + 0.625vw, 1.5rem)',
        'fluid-2xl': 'clamp(1.5rem, 1.375rem + 0.625vw, 1.875rem)',
        'fluid-3xl': 'clamp(1.875rem, 1.75rem + 0.625vw, 2.25rem)',
        'fluid-4xl': 'clamp(2.25rem, 2rem + 1.25vw, 3rem)',
        'fluid-5xl': 'clamp(3rem, 2.75rem + 1.25vw, 4rem)',
        'fluid-6xl': 'clamp(4rem, 3.75rem + 1.25vw, 5rem)',
      },
      spacing: {
        'fluid-px': 'clamp(0.0625rem, 0.05rem + 0.0625vw, 0.125rem)',
        'fluid-0.5': 'clamp(0.125rem, 0.1rem + 0.125vw, 0.25rem)',
        'fluid-1': 'clamp(0.25rem, 0.2rem + 0.25vw, 0.5rem)',
        'fluid-1.5': 'clamp(0.375rem, 0.3rem + 0.375vw, 0.75rem)',
        'fluid-2': 'clamp(0.5rem, 0.4rem + 0.5vw, 1rem)',
        'fluid-2.5': 'clamp(0.625rem, 0.5rem + 0.625vw, 1.25rem)',
        'fluid-3': 'clamp(0.75rem, 0.6rem + 0.75vw, 1.5rem)',
        'fluid-3.5': 'clamp(0.875rem, 0.7rem + 0.875vw, 1.75rem)',
        'fluid-4': 'clamp(1rem, 0.8rem + 1vw, 2rem)',
        'fluid-5': 'clamp(1.25rem, 1rem + 1.25vw, 2.5rem)',
        'fluid-6': 'clamp(1.5rem, 1.2rem + 1.5vw, 3rem)',
        'fluid-8': 'clamp(2rem, 1.6rem + 2vw, 4rem)',
        'fluid-10': 'clamp(2.5rem, 2rem + 2.5vw, 5rem)',
        'fluid-12': 'clamp(3rem, 2.4rem + 3vw, 6rem)',
        'fluid-16': 'clamp(4rem, 3.2rem + 4vw, 8rem)',
      },
      lineHeight: {
        'fluid-none': '1',
        'fluid-tight': '1.25',
        'fluid-snug': '1.375',
        'fluid-normal': 'clamp(1.5, calc(1.5 + 0.25vw), 1.75)',
        'fluid-relaxed': 'clamp(1.625, calc(1.625 + 0.375vw), 2)',
        'fluid-loose': 'clamp(2, calc(2 + 0.5vw), 2.5)',
      }
    },
  },
  plugins: [
    function({ addComponents }) {
      addComponents({
        '.tab': {
          '@apply relative flex items-center gap-3 px-6 py-3 rounded-lg transition-colors text-sm font-medium': {},
          '&:not(.active)': {
            '@apply text-gray-400 hover:text-white hover:bg-gray-800/50': {},
          },
          '&.active': {
            '@apply bg-gray-800 text-white': {},
          },
          '&::before': {
            content: '""',
            '@apply absolute -top-px left-0 right-0 h-1 rounded-full transition-opacity': {},
          },
          '&:not(.active)::before': {
            '@apply opacity-0': {},
          },
          '&.active::before': {
            '@apply opacity-100': {},
          },
          '&.primary::before': {
            '@apply bg-primary-500': {},
          },
          '&.green::before': {
            '@apply bg-green-500': {},
          },
          '&.amber::before': {
            '@apply bg-amber-500': {},
          },
          '&.rose::before': {
            '@apply bg-rose-500': {},
          },
          '&.purple::before': {
            '@apply bg-purple-500': {},
          },
        },
      });
    },
  ],
};