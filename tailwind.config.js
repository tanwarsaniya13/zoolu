/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brutal-yellow': '#FFE600',
        'brutal-pink': '#FF007F',
        'brutal-cream': '#FBF6EA',
        'brutal-dark': '#0C0D12',
        'brutal-card': '#151720',
        'brutal-border': '#000000',
      },
      boxShadow: {
        'neo-sm': '3px 3px 0px 0px #000000',
        'neo': '5px 5px 0px 0px #000000',
        'neo-lg': '8px 8px 0px 0px #000000',
        'neo-yellow': '5px 5px 0px 0px #FFE600',
        'neo-pink': '5px 5px 0px 0px #FF007F',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        display: ['"Space Grotesk"', '"Archivo Black"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glitch': 'glitch 0.3s infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}

