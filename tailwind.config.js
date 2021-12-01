module.exports = {
  purge: {
    enabled: !process.env.ROLLUP_WATCH,
    mode: 'all',
    content: ['./**/**/*.html', './**/**/*.svelte'],

    options: {
      whitelistPatterns: [/svelte-/],
      defaultExtractor: (content) =>
        [...content.matchAll(/(?:class:)*([\w\d-/:%.]+)/gm)].map(
          ([_match, group, ..._rest]) => group
        ),
    },

    safelist: [
      // tiles fading
      'bg-opacity-100',
      'bg-opacity-90',
      'bg-opacity-80',
      'bg-opacity-70',
      'bg-opacity-60',
      'bg-opacity-50',
      'bg-opacity-40',
      'bg-opacity-30',
      'bg-opacity-20',
      'bg-opacity-10',
      'bg-opacity-0',
      'w-11/12',
      'w-10/12',
      'w-9/12',
      'w-8/12',
      'w-7/12',
      'w-6/12',
      'w-5/12',
      'w-4/12',
      'w-3/12',
      'w-2/12',
      'w-1/12',
    ]
  },
  darkMode: false, // or 'media' or 'class'
  theme: {

    extend: {
      colors: {
        primary: '#cae00d',
        'primary-accent': '#e5f086',
        secondary: '#feb526',
        'secondary-accent': '#ffd03a',
        neutral: '#f9f8d0',
      },
      textColor: {
        'primary': '#2a2a2a',
        'secondary': '#ffed4a',
        'danger': '#e3342f',
      }
    },
  },
  variants: {
    backgroundColor: ['disabled'],
    cursor: ['disabled'],
    extend: {},
  },
  plugins: [],
};
