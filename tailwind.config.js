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
        // Brand Colors
        'nova-red': '#ff2959',
        'nova-red-dark': '#e31c4d',
        'burgundy': '#6b1f3f',
        'burgundy-deep': '#4a1529',
        'navy': '#1a1432',
        'navy-deep': '#0d0820',

        // Legacy support
        'rocket-red': '#ff2959',
        'dark-bg': '#0f172a',
        'dark-card': '#1e293b',
        'dark-lighter': '#334155',
        'text-light': '#f1f5f9',
        'text-gray': '#94a3b8',
        'accent': '#fbbf24',

        // Primary palette
        'ink': '#0f172a',
        'surface': '#ffffff',
        'surface-warm': '#fdfcfb',
        'surface-muted': '#f8fafc',
        'surface-slate': '#f1f5f9',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
      animation: {
        'fadeInUp': 'fadeInUp 600ms cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'pulse-subtle': 'pulse-subtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
