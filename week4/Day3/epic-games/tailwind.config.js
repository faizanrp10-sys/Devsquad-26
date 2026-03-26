/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'epic-dark': '#121212',
        'epic-gray': '#2a2a2a',
        'epic-blue': '#0074E4',
        'epic-hover': '#2a2a2a',
      },
    },
  },
  plugins: [],
}
