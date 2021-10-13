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
    },
  },
  variants: {
    backgroundColor: ['disabled'],
    cursor: ['disabled'],
    extend: {},
  },
  plugins: [],
};
