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
          50: '#FFF5ED',
          100: '#FFE6D4',
          200: '#FFCCA9',
          300: '#FFB17E',
          400: '#FF9753',
          500: '#FC7D29',
          600: '#C25A17',
          700: '#9A4612',
          800: '#6F2005',
          900: '#44260F',
          950: '#2A1809',
        },
        secondary: {
          50: '#FAF0E5',
          100: '#F5E6D8',
          200: '#EBCDB1',
          300: '#DEB38B',
          400: '#D19B64',
          500: '#B5A29E',
          600: '#A68976',
          700: '#8C7364',
          800: '#725C51',
          900: '#5A4A41',
          950: '#342B24',
        },
      },
    },
  },
  plugins: [],
} 