/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    '../../packages/**/*.{tsx,vue}'
  ],
  theme: {
    extend: {
      colors: {
        brand: '#00A621',
        'brand-dark': '#007B2B',
      }
    }
  },
  plugins: []
}
