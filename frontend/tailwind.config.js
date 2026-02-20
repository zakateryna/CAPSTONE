/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#5C2D31",
        "background-light": "#F5E6D3",
        "background-dark": "#2C2420",
        "retro-yellow": "#FBC02D",
        "retro-teal": "#80CBC4",
        "retro-coral": "#EF9A9A",
        "retro-taskbar": "#C0C0C0",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        mono: ["VT323", "monospace"],
      },
    },
  },
  plugins: [],
}