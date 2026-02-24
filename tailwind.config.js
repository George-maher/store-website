/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#60a5fa',
          DEFAULT: '#2563eb',
          dark: '#1e40af',
        },
      },
      transitionTimingFunction: {
        'in-expo': 'cubic-bezier(0.2, 0.9, 0.2, 1.0)'
      }
    },
  },
  plugins: [],
}
