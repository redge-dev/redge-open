import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

/*
 * This is a custom ESLint configuration for use with
 * internal (bundled by their consumer) libraries
 */
export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...eslintConfigPrettier,
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json', './packages/*/tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: [
      'dist'
    ]
  }
);
