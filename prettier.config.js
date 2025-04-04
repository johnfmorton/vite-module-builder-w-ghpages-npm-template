module.exports = {
  trailingComma: "es5",
  tabWidth: 4,
  semi: false,
  singleQuote: true,
  printWidth: 100,
  bracketSpacing: true,
  arrowParens: 'always',
  endOfLine: 'lf',
  overrides: [
    {
      files: '*.md',
      options: {
        proseWrap: 'always',
        printWidth: 80,
        tabWidth: 2,
      },
    },
  ],
};
