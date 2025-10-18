/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"],
  safelist: [
    'bg-emerald-50',
    'bg-blue-50',
    'bg-amber-50',
    'bg-rose-50',
    'bg-violet-50',
    'bg-sky-50',
    'bg-lime-50',
    'bg-orange-50',
    'bg-yellow-50',
    'bg-red-50'
  ],
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
