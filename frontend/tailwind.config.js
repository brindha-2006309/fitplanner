/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#f97316', // orange-500
          dark:    '#ea580c', // orange-600
          light:   '#fb923c', // orange-400
        },
        dark: {
          DEFAULT: '#0f172a', // slate-900
          card:    '#1e293b', // slate-800
          border:  '#334155', // slate-700
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      },
    },
  },
  plugins: [],
};
