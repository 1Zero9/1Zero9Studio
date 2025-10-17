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
        'rocket-red': '#dc2626',   // Red rocket color
        'dark-bg': '#0f172a',      // Very dark slate
        'dark-card': '#1e293b',    // Dark card background
        'dark-lighter': '#334155', // Lighter dark for borders
        'text-light': '#f1f5f9',   // Light text
        'text-gray': '#94a3b8',    // Gray text
        'accent': '#fbbf24',       // Golden accent
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
