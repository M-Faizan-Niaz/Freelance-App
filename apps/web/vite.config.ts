import { defineConfig } from 'vite-plus';

export default defineConfig({
  lint: {
    ignorePatterns: ['**/node_modules/**', '**/.next/**', '**/dist/**'],
  },
});
