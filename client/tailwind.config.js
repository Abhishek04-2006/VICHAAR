/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          bg: "#090A0D",        // Deepest grounded black-slate
          card: "#111317",      // Card elevation
          hover: "#181A20",     // Hover state
          border: "#1F2228",    // Hairline divider
        },
        brand: {
          primary: "#3B82F6",   // Focused energetic blue (not oversaturated)
          glow: "rgba(59, 130, 246, 0.15)",
        },
        content: {
          title: "#F4F4F5",
          body: "#D4D4D8",
          muted: "#71717A",
        }
      },
    },
  },
  plugins: [],
}