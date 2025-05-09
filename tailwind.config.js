/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        digital: "Digital-Display",
        din: "DINEngschriftStd",
        gothamm: "Gotham-Medium",
        gothamb: "Gotham-Bold",
        MontBold: "Mont-Bold"
      }
    },
  },
  plugins: [],
}

