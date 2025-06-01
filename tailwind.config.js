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
  }
}
