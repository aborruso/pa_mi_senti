/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0b7285",
          light: "#4dabf7",
          dark: "#06485f"
        }
      }
    }
  },
  plugins: []
};
