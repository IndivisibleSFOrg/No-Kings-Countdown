/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './config/**/*.ts',
    './app.vue',
    './docs/*.html',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Source Sans 3', 'system-ui', 'sans-serif'],
        sans: ['Source Sans 3', 'system-ui', 'sans-serif'],
        mono: ['Source Code Pro', 'monospace'],
      },
      colors: {
        // Brand palette — hex values live in assets/css/main.css :root
        'isf-blue': {
          dark: 'var(--isf-blue-dark)',
          DEFAULT: 'var(--isf-blue)',
          light: 'var(--isf-blue-light)',
        },
        'isf-red': {
          dark: 'var(--isf-red-dark)',
          DEFAULT: 'var(--isf-red)',
          light: 'var(--isf-red-light)',
        },
        'isf-gold': {
          dark: 'var(--isf-gold-dark)',
          DEFAULT: 'var(--isf-gold)',
          light: 'var(--isf-gold-light)',
        },
        'isf-green': {
          dark: 'var(--isf-green-dark)',
          DEFAULT: 'var(--isf-green)',
          light: 'var(--isf-green-light)',
        },
        'isf-slate': 'var(--isf-slate)',
        'isf-tinted': 'var(--isf-tinted)',
        // Semantic state colors
        'state-today': 'var(--state-today)',
        'state-complete': {
          dark: 'var(--state-complete-dark)',
          DEFAULT: 'var(--state-complete)',
        },
        'state-incomplete': 'var(--state-incomplete)',
        'state-future': 'var(--state-future)',
        'state-highlight': 'var(--state-highlight)',
        // Semantic button colors
        'btn-primary': 'var(--btn-primary)',
        'btn-primary-dark': 'var(--btn-primary-dark)',
      },
    },
  },
  safelist: [
    'text-base',
    'text-lg',
    'text-xl',
    'text-2xl',
    'text-3xl',
    'text-4xl',
    // Action label pill background classes from config/actionLabels.ts.
    // Tailwind's extractor does not reliably pick up class names from TS object
    // values, so each bgClass used in ACTION_LABEL_CONFIG must also appear here.
    'bg-isf-gold',
  ],
  plugins: [],
}
