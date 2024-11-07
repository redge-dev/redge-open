const { resolve } = require('node:path')

const project = resolve(process.cwd(), 'tsconfig.json')

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@tanstack/eslint-plugin-query/recommended',
    require.resolve('@vercel/style-guide/eslint/next'),
    'turbo',
  ],
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    node: true,
    browser: true,
  },
  plugins: ['only-warn'],
  settings: {
    'import/resolver': {
      typescript: {
        project,
      },
    },
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: [
    // Ignore dotfiles
    '.*.js',
    'node_modules/',
  ],
  overrides: [{ files: ['*.js?(x)', '*.ts?(x)'] }],
  rules: {
    'react/self-closing-comp': 'error',
    'react/prop-types': 'off',
    'prettier/prettier': 'error',
    'no-unused-vars': 'off',
  },
  parser: "@typescript-eslint/parser",
}
