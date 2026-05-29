/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-instrument-serif)", "serif"],
        body: ["var(--font-poppins)", "sans-serif"],
        traditional: ["var(--font-cormorant-garamond)", "serif"],
      },
      borderRadius: {
        DEFAULT: "9999px",
      },
    },
  },
  plugins: [],
};
