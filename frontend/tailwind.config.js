/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF385C',
        'primary-hover': '#E61E4D',
        'primary-light': '#FF5A7F',
        secondary: {
          DEFAULT: '#00A699',
          hover: '#008B7D',
        },
        accent: {
          DEFAULT: '#FC642D',
          hover: '#E5511F',
        },
        gray: {
          50: '#F7F7F7',
          100: '#EBEBEB',
          200: '#DDDDDD',
          300: '#B0B0B0',
          400: '#717171',
          500: '#484848',
          600: '#222222',
          700: '#1A1A1A',
          800: '#121212',
          900: '#0A0A0A',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'card': '0 6px 16px rgba(0, 0, 0, 0.12)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.18)',
      },
    },
  },
  plugins: [],
}
