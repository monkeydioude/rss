/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/component/**/*.{js,jsx,ts,tsx}", // Include any additional source files if necessary
    "./app/**/*.{js,jsx,ts,tsx}", // This includes all files in the app directory used by Expo Router
  ],
  theme: {
    extend: {
      colors: {
        'primaryColor': "#9333ea"
      }
    },
  },
  plugins: [],
}
