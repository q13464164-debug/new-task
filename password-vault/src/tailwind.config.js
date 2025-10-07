/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'dark-bg': '#0a0a0f',
        'dark-surface': '#111118',
        'dark-card': '#1a1a24',
        'dark-border': '#2a2a35',
        'dark-accent': '#3a3a4a',
        'metallic-gold': '#d4af37',
        'metallic-silver': '#c0c0c0',
        'glossy-blue': '#1e3a8a',
        'glossy-purple': '#581c87',
        'neon-cyan': '#06b6d4',
        'neon-purple': '#a855f7',
      },
      backgroundImage: {
        'glossy-gradient': 'linear-gradient(135deg, #1e3a8a 0%, #581c87 50%, #0a0a0f 100%)',
        'metallic-gradient': 'linear-gradient(45deg, #d4af37 0%, #c0c0c0 50%, #d4af37 100%)',
        'dark-glossy': 'linear-gradient(135deg, #0a0a0f 0%, #1a1a24 50%, #0a0a0f 100%)',
      },
      boxShadow: {
        'glossy': '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'metallic': '0 4px 16px rgba(212, 175, 55, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        'neon': '0 0 20px rgba(6, 182, 212, 0.5), 0 0 40px rgba(168, 85, 247, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(6, 182, 212, 0.5)' },
          '100%': { boxShadow: '0 0 30px rgba(168, 85, 247, 0.8)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}