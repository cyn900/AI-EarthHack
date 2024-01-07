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
        button: {
          DEFAULT: '#DAE06D',
        },
        card: {
          DEFAULT: '#EFEFEF',
          '50': '#EFEFEF 50%',
        },
        dark_forest_50: '#728F4F 50%',
        light_forest: '#98C26C',
        dark_gray: '#6D6D6D',
        dark_forest: '#728F4F',
        dark_green: '#3D6F5B',
        forest_50: '#98C26C 50%',
        light_green: '#DFEDE7',
        light_text: '#414141',
        middle_50: '#88C4A6 50%',
        middle_green: '#88C4A6',
        middle_gray: '#B4B4B4',
        white: '#FFFFFF',
      },
    },
  },
  plugins: [require("daisyui")],
}
