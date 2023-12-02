/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'woodsmoke': {
          '50': '#f6f6f6',
          '100': '#e7e7e7',
          '200': '#d1d1d1',
          '300': '#b0b0b0',
          '400': '#888888',
          '500': '#6d6d6d',
          '600': '#5d5d5d',
          '700': '#4f4f4f',
          '800': '#454545',
          '900': '#3d3d3d',
          '950': '#1a1a1a',
        },

        'seance': {
          '50': '#fff2ff',
          '100': '#fce3ff',
          '200': '#fac6ff',
          '300': '#fb99ff',
          '400': '#fa5dff',
          '500': '#f021ff',
          '600': '#d900f9',
          '700': '#b900cf',
          '800': '#9900a9',
          '900': '#6a0572',
          '950': '#56005e',
        },

        'masala': {
          '50': '#f6f6f6',
          '100': '#e7e7e7',
          '200': '#d1d1d1',
          '300': '#b0b0b0',
          '400': '#888888',
          '500': '#6d6d6d',
          '600': '#5d5d5d',
          '700': '#4f4f4f',
          '800': '#454545',
          '900': '#404040',
          '950': '#262626',
        },
        
        'dark-accent': '#FFCC00',
        'dark-text-primary': '#FFFFFF',
        'dark-text-secondary': '#e0e0e0',

        'background': '#f1f1f1',
        'primary': '#019b98',
        'secondary': '#c8c8c8',
        'accent': '#ffbfab',
        'text-primary': '#014e60',
        'text-secondary': '#3f7a8d',
      }
    },
  },
  plugins: [],
};
