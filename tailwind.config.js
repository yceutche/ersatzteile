/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1B6CA8',
        'primary-dark': '#144f7a',
        accent: '#E8A020',
        success: '#2E7D32',
        danger: '#C62828',
        bg: '#F5F5F5',
        surface: '#FFFFFF',
        'text-primary': '#212121',
        'text-secondary': '#757575',
      },
      keyframes: {
        'fade-in': { '0%': { opacity: '0', transform: 'translateY(-6px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
      animation: {
        'fade-in': 'fade-in 0.15s ease-out both',
      },
    }
  },
  plugins: []
}
