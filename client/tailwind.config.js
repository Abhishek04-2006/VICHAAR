/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          bg: "var(--surface-bg)",
          card: "var(--surface-card)",
          hover: "var(--surface-hover)",
          border: "var(--surface-border)",
        },
        brand: {
          primary: "#3B82F6",
          glow: "rgba(59, 130, 246, 0.15)",
        },
        content: {
          title: "var(--content-title)",
          body: "var(--content-body)",
          muted: "var(--content-muted)",
        }
      },
    },
  },
  plugins: [],
}