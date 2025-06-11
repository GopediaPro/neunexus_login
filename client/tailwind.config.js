/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        white: '#ffffff',
        gray: '#d4d4d4',
        gray2: '#e5e5e5',
        gray3: '#f3f3f3',
        grayWhite: '#f9f9f9',
        disabledGrayWhite: '#e0e0e0',
        cheeseYellow: '#ffe600',
        buttonGrayWhite: '#f6f6f6',
      },
    },
  },
  plugins: [],
}