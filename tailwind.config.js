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
        display: ['var(--font-syne)', 'var(--font-space-grotesk)', 'sans-serif'],
        sans: ['var(--font-bricolage)', 'var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
        '2xl': '40px',
      }
    },
  },
  plugins: [],
}

