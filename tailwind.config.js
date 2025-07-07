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
          darker: '#2A3446',    // Code background
          lighter: '#2C3B4C',   // Accent background
        },
        palenight: {
          50: '#A6ACCD',       // Main text
          100: '#A6ACCD',      // Light text
          200: '#82AAFF',      // Links
          300: '#4A596E',      // Table borders
          400: '#3D4857',      // Borders
          500: '#2E3C4E',      // Blockquote background
          600: '#2C3B4C',      // Accent background
          700: '#2A3446',      // Code background
          800: '#283544',      // Table row background
          900: '#1c1f24',      // Dark mode background
        },
        accent: {
          purple: '#C792EA',   // Headings
          blue: '#82AAFF',     // Links
          yellow: '#FFCB6B',   // Link hover (dark mode)
          cyan: '#C792EA',     // Link hover
        }
      },
      fontFamily: {
        sans: ['monospace', 'system-ui'],
        serif: ['monospace', 'serif'],
        mono: ['monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#A6ACCD',
            fontSize: '1.25rem',
            lineHeight: '1.4',
            a: {
              color: '#82AAFF',
              textDecoration: 'none',
              '&:hover': {
                color: '#C792EA',
              },
            },
            strong: {
              color: '#C792EA',
            },
            h1: {
              color: '#C792EA',
              fontFamily: 'monospace',
            },
            h2: {
              color: '#C792EA',
              fontFamily: 'monospace',
            },
            h3: {
              color: '#C792EA',
              fontFamily: 'monospace',
            },
            h4: {
              color: '#C792EA',
              fontFamily: 'monospace',
            },
            blockquote: {
              color: '#A6ACCD',
              borderLeftColor: '#3D4857',
              backgroundColor: '#2E3C4E',
              fontStyle: 'italic',
              borderRadius: '5px',
            },
            code: {
              color: '#C792EA',
              backgroundColor: '#2A3446',
              fontFamily: 'monospace',
              borderRadius: '5px',
              padding: '0.2em',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: '#2A3446',
              color: '#A6ACCD',
              fontFamily: 'monospace',
              borderRadius: '5px',
            },
            ul: {
              listStyleType: 'upper-roman',
            },
            table: {
              backgroundColor: '#283544',
              borderColor: '#4A596E',
            },
            th: {
              backgroundColor: '#374A62',
              color: '#C792EA',
            },
            'tr:nth-child(even)': {
              backgroundColor: '#2C3B4C',
            },
            'tr:hover': {
              backgroundColor: '#374A62',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
