/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vichaar: {
          dark: '#030F26',      // Base background
          card: '#0B1528',      // Card background
          border: '#1E293B',    // Card border
          blue: '#0066FF',      // Accent electric blue
          hover: '#0052CC',     // Accent hover
        }
      }
    },
  },
  plugins: [],
}