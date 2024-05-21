import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontSize: {
        xl: '1.5rem',
        '2xl': '2rem',
        '3xl': '3.5rem',
        '4xl': '4rem',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
export default config
