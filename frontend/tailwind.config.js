// FILE: frontend/tailwind.config.js
// VERSION: 1.0.0
// START_MODULE_CONTRACT
//   PURPOSE: Tailwind theme tokens for the mini-app.
//   SCOPE: content globs, color and font extensions
//   DEPENDS: none
//   LINKS: M-FRONTEND-UI, V-M-FRONTEND-UI
//   ROLE: CONFIG
//   MAP_MODE: NONE
// END_MODULE_CONTRACT
// START_CHANGE_SUMMARY
//   LAST_CHANGE: [v1.0.0 - Added GRACE semantic markup]
// END_CHANGE_SUMMARY

const {fontFamily} = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#F0F0F0',
        text: {
          primary: '#0C0D0E',
          secondary: 'rgba(12, 13, 14, 0.52)',
        },
        brand: {
          DEFAULT: '#007AFF',
          dark: '#005ecb',
        },
        action: {
          danger: '#FF303C',
          success: '#1ABE43',
          warning: '#FF9315',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(157deg, #08D7F3 6.38%, #5398FF 85%)',
        'gradient-success': 'linear-gradient(158deg, #14E1D5 6.15%, #03C722 85.68%)',
        'gradient-accent': 'linear-gradient(155deg, #BF97FF 6.6%, #526EFF 84.12%)',
      },
      fontFamily: {
        sans: ['"Inter"', ...fontFamily.sans], // Example: Add a custom font
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'scale-in': 'scale-in 0.3s ease-out forwards',
        'pop-in': 'pop-in 0.5s cubic-bezier(0.25, 0.25, 0.25, 1.25) forwards',
        'scale-pulse': 'scale-pulse 2s ease-in-out infinite',
        'scale-pulse-delayed': 'scale-pulse 2s ease-in-out -0.25s infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': {opacity: '0'},
          '100%': {opacity: '1'},
        },
        'scale-in': {
          '0%': {opacity: '0', transform: 'scale(0.95)'},
          '100%': {opacity: '1', transform: 'scale(1)'},
        },
        'pop-in': {
          '0%': {transform: 'scale(0.5)', opacity: '0'},
          '100%': {transform: 'scale(1)', opacity: '1'},
        },
        'scale-pulse': {
          '0%, 100%': {transform: 'scale(1)'},
          '50%': {transform: 'scale(1.1)'},
        },
      },
    },
  },
  plugins: [],
};
