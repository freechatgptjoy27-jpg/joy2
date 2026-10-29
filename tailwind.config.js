/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0B192C',
          800: '#1E3E62',
        },
        cyan: {
          400: '#00ADB5',
          300: '#00FFF0',
        },
      },
    },
  },
  plugins: [],
};
