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
        '2xl': '1.75rem',
        '3xl': '3rem',
        '4xl': '4rem',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
export default config
