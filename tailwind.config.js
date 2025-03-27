/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0066CC',
        secondary: '#FF6600',
        background: '#F5F7FA',
        dark: '#333333',
      },
    },
  },
  plugins: [],
} 