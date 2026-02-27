export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'brand-dark': 'var(--color-bg-dark)',
        'brand-surface': 'var(--color-bg-surface)',
        'brand-primary': 'var(--color-primary)',
        'brand-secondary': 'var(--color-secondary)',
        'brand-text': 'var(--color-text)',
        'brand-muted': 'var(--color-text-muted)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'], // For headers
      }
    },
  },
  plugins: [],
}
