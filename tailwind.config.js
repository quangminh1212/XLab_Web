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
          50: '#F0F7FF',
          100: '#E3F0FF',
          200: '#C7E1FF',
          300: '#A9CDFF',
          400: '#7FB0F5',
          500: '#4B88E5',
          600: '#3A6DC7',
          700: '#2D57A3',
          800: '#224182',
          900: '#1A2F5E',
          950: '#101D3A',
        },
        secondary: {
          50: '#F2FBFA',
          100: '#E6F7F5',
          200: '#CEEFE9',
          300: '#A8E0D8',
          400: '#7CCBC1',
          500: '#4DB0A8',
          600: '#3A8F8A',
          700: '#2D736F',
          800: '#225754',
          900: '#193F3D',
          950: '#0F2726',
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
          950: '#0A0F1A',
        },
      },
    },
  },
  plugins: [],
} 