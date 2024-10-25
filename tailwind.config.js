/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      beige: "#E6DBC6",
      black: "#2F2C29",
    },
    extend: {
      fontFamily: {
        comfort: ['"Comfortaa"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
