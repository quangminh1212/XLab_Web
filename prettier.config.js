/** @type {import('prettier').Config} */
const config = {
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  semi: true,
  tabWidth: 2,
  endOfLine: 'lf',
  arrowParens: 'avoid',
  bracketSpacing: true,
  embeddedLanguageFormatting: 'auto',
  htmlWhitespaceSensitivity: 'css',
  bracketSameLine: false,
  jsxSingleQuote: false,
  quoteProps: 'as-needed',
  proseWrap: 'preserve',
  insertPragma: false,
  requirePragma: false,
  useTabs: false,
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindConfig: './tailwind.config.js',
  overrides: [
    {
      files: '*.{json,json5,yaml,yml}',
      options: {
        tabWidth: 2,
      },
    },
  ],
};

export default config; 