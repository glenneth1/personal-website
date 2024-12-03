/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{html,js}"
  ],
  theme: {
    extend: {
      colors: {
        base: {
          bg: '#292D3E',        // Main background
          darker: '#242837',    // Darker background for contrast
          lighter: '#32374D',   // Lighter background for hover states
        },
        palenight: {
          50: '#C8D3F5',       // Lightest text
          100: '#A9B8E8',      // Light text
          200: '#828BB8',      // Muted text
          300: '#676E95',      // Comments/muted
          400: '#444B6A',      // Darker muted
          500: '#32374D',      // Background highlight
          600: '#292D3E',      // Main background
          700: '#242837',      // Darker background
          800: '#1B1E2B',      // Darkest background
          900: '#14161F',      // Black background
        },
        accent: {
          purple: '#C792EA',   // Purple accent
          blue: '#82AAFF',     // Blue accent
          green: '#C3E88D',    // Green accent
          yellow: '#FFCB6B',   // Yellow accent
          orange: '#F78C6C',   // Orange accent
          red: '#FF5370',      // Red accent
          cyan: '#89DDFF',     // Cyan accent
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#C8D3F5',
            a: {
              color: '#82AAFF',
              '&:hover': {
                color: '#89DDFF',
              },
            },
          },
        },
      },
    },
  },
  plugins: [],
}
