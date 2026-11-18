// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'sans-serif',
        ],
      },
      // Se conservan los nombres "icsi-*" para no romper las páginas existentes;
      // solo cambian los valores a la paleta de S.I.S (la misma de la app).
      colors: {
        'icsi-primary': '#DC142B',
        'icsi-hover': '#B8101F',
        'icsi-background': '#F3F4F6',
        'icsi-text': '#4B5563',
        'icsi-border': '#E5E7EB',
        'icsi-white': '#FFFFFF',
        'icsi-textLight': '#9CA3AF',
        'icsi-card': '#FFFFFF',
        'icsi-titleform': '#1F2937',
        'icsi-textPlaceholder': '#9CA3AF',
      },
      borderRadius: {
        'icsi': '0.75rem',
        'icsi-lg': '1rem',
      },
      boxShadow: {
        'icsi': '0 1px 3px rgba(16, 24, 40, 0.06), 0 1px 2px rgba(16, 24, 40, 0.04)',
        'icsi-lg': '0 12px 32px -8px rgba(16, 24, 40, 0.12), 0 4px 8px -4px rgba(16, 24, 40, 0.06)',
      },
    },
  },
  plugins: [],
}