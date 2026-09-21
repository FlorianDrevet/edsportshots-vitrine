/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#ffffff",
      black: "#000000",
      bg: "#0e0f10",
      surface: "#16181a",
      text: "#f4f4f2",
      "text-muted": "#b7babb",
      "text-dim": "#8c9093",
      border: "#1e2022",
      "border-strong": "#33373a",
      accent: "#d8ff3e",
      "accent-ink": "#1e2a06",
    },
    fontFamily: {
      display: ["Archivo Black", "Impact", "sans-serif"],
      body: ["Space Grotesk", "Helvetica Neue", "Helvetica", "sans-serif"],
    },
    extend: {},
  },
  plugins: [],
};
