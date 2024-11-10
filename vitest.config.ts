import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => ({
  test: {
    globals: true,
    include: ['**/*.spec.ts'],
    env: loadEnv(mode, process.cwd(), ''),
  },
}));
