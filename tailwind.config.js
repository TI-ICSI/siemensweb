// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'icsi-primary': '#D91A2A',
        'icsi-background': '#F2F2F2',
        'icsi-text': '#73635D',
        'icsi-border': '#D95F5F',
        'icsi-white': '#FFFFFF',
        'icsi-textLight': '#D95F5F',
        'icsi-card': '#FFFFFF',
        'icsi-titleform': '#494646',
        'icsi-textPlaceholder': '#7F8C8D',
      },
      borderRadius: {
        'icsi': '0.5rem',
        'icsi-lg': '1rem',
      },
      boxShadow: {
        'icsi': '0 4px 6px -1px rgba(217, 26, 42, 0.1), 0 2px 4px -1px rgba(217, 26, 42, 0.06)',
        'icsi-lg': '0 10px 15px -3px rgba(217, 26, 42, 0.1), 0 4px 6px -2px rgba(217, 26, 42, 0.05)',
      },
    },
  },
  plugins: [],
}