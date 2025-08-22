/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        primary: '#5B67F2',
        dark: '#0f0f1c',
        light: '#f6f7fb',
        secondary: '#A8B3CF'
      }
    },
  },
  plugins: [],
}
