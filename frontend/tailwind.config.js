/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#eef1f7',
          100: '#d0d9eb',
          200: '#a3b5d4',
          300: '#7590bd',
          400: '#4f72a8',
          500: '#2d5590',
          600: '#1e3f72',
          700: '#132d55',
          800: '#0b1e3a',
          900: '#060f1e',
        },
        gold: {
          50:  '#fdf8ec',
          100: '#faeecb',
          200: '#f5db90',
          300: '#efc655',
          400: '#e8b02a',
          500: '#d4960f',
          600: '#a8740a',
          700: '#7c5508',
          800: '#503706',
          900: '#281b03',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(30px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
    },
  },
  plugins: [],
};
