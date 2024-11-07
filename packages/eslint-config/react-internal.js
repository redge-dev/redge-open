const { resolve } = require('node:path')

const project = resolve(process.cwd(), 'tsconfig.json')

/*
 * This is a custom ESLint configuration for use with
 * internal (bundled by their consumer) libraries
 * that utilize React.
 */

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'eslint:recommended',
    'prettier',
    'turbo',
  ],
  plugins: ['only-warn', '@typescript-eslint'],
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    browser: true,
    node: true,
  },
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
    'dist/',
  ],
  overrides: [
    // Force ESLint to detect .tsx files
    { files: ['*.js?(x)', '*.ts?(x)'] },
  ],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
  },
  parser: "@typescript-eslint/parser",
}
