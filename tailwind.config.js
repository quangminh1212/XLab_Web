/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EFF9FF',
          100: '#DEF2FF',
          200: '#B6E5FF',
          300: '#75D1FF',
          400: '#40BCFF',
          500: '#0098F7',
          600: '#0077D3',
          700: '#0061AB',
          800: '#00508C',
          900: '#003B67',
          950: '#002441',
        },
        secondary: {
          50: '#EDFCFD',
          100: '#D4F5F9',
          200: '#A7ECF3',
          300: '#6CDEEA',
          400: '#36C5D2',
          500: '#17A2B0',
          600: '#128795',
          700: '#126E79',
          800: '#115A63',
          900: '#0F4A52',
          950: '#072F34',
        },
      },
    },
  },
  plugins: [],
} 