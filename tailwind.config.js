/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'source-code': ['Source Code Pro', 'monospace'], // Thêm font mới
      },
    },
  },
  plugins: [],
};
