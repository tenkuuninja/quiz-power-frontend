/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,vue}",
    "./layouts/**/*.{js,ts,vue}",
    "./components/**/*.{js,ts,vue}",
  ],
  theme: {
    container: {
      padding: 16,
      center: true,
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#f59e0b",
          100: "#fffaf3",
          200: "#fbd596",
          300: "#f9c368",
          400: "#f7b039",
          500: "#f59e0b",
          600: "#d08609",
          700: "#ac6f08",
          800: "#875706",
          900: "#623f04",
        },
      },
      fontFamily: {
        nunito: ["Nunito"],
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
