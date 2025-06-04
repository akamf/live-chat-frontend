module.exports = {
  content: [
    './dist/**/*.html', 
    './src/**/*.{js,jsx,ts,tsx}', 
    './*.html'
  ],
  plugins: [
    require('@tailwindcss/forms')
  ],
  darkMode: 'class',
  variants: {
    extend: {
      opacity: ['disabled']
    }
  },
  extend: {
    keyframes: {
      "fade-in": {
        "0%": { opacity: "0", transform: "translateY(10px)" },
        "100%": { opacity: "1", transform: "translateY(0)" },
      },
    },
    animation: {
      "fade-in": "fade-in 0.3s ease-out",
    },
  },
}
