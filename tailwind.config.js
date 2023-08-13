/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tailwind-datepicker-react/dist/**/*.js",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        black: "#000",
        white: "#fff",
        primary: {
          100: "#f3e5f5",
          200: "#e1bee7",
          300: "#ce93d8",
          400: "#ba68c8",
          500: "#ab47bc",
          600: "#8e24aa",
          700: "#7b1fa2",
          800: "#67169a",
          900: "#531182",
        },
        // ...
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
