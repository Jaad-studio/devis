/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['Outfit', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        jaad: {
          blue: '#2563EB',
          electric: '#3B66F5',
          sky: '#60A5FA',
          ink: '#0F172A',
          slate: '#1E293B',
          canvas: '#F6F8FC',
        },
      },
    },
  },
  plugins: [],
};
