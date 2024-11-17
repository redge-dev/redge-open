import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import path from 'node:path'
import { cwd } from 'node:process';

/*
 * This is a custom ESLint configuration for use with
 * internal (bundled by their consumer) libraries
 */
export default tseslint.config(
  eslint.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.strict,
  {
    languageOptions: {
      parserOptions: {
        project: [path.join(cwd(), '../../', './packages/*/tsconfig.json')],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: [
      'dist'
    ]
  }
)