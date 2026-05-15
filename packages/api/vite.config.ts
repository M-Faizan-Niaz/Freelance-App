import { defineConfig } from 'vite-plus';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      $: path.resolve(__dirname, './'),
      $models: path.resolve(__dirname, './src/db/models/index.ts'),
    },
  },
  lint: {
    ignorePatterns: ['**/node_modules/**', '**/dist/**'],
  },
});
