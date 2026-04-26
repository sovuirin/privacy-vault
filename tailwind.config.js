/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#C5A059',
          foreground: '#050505',
        },
        background: '#050505',
        foreground: '#FFFFFF',
        premium: {
          black: '#050505',
          gold: '#C5A059',
          amber: '#F59E0B',
          glass: 'rgba(255, 255, 255, 0.05)',
        }
      },
      fontFamily: {
        display: ['Geist Mono', 'monospace'],
        sans: ['Geist Mono', 'monospace'],
        mono: ['Geist Mono', 'monospace'],
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      },
      animation: {
        scan: 'scan 2s linear infinite',
      },
      backdropBlur: {
        xs: '2px',
        '2xl': '40px',
      }
    },
  },
  plugins: [],
}

