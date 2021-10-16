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
