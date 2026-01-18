@'
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        cyber: {
          pink: '#ff00ff',
          purple: '#9d00ff',
          cyan: '#00ffff',
          blue: '#0066ff'
        }
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
        'inter': ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
};
'@ | Out-File tailwind.config.js -Encoding UTF8 -Force