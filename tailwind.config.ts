import type { Config } from 'tailwindcss'
import daisyui from 'daisyui'
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      animation: {
        'ping-slow': 'ping 4s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        figtree: 'Figtree',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [],
  },
}
export default config
