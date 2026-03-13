/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8fafc', // slate-50
        card: '#ffffff',
        primary: '#2563eb', // blue-600
        secondary: '#64748b', // slate-500
        accent: '#f59e0b', // amber-500
      }
    },
  },
  plugins: [],
}
