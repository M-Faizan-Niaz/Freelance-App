import { defineConfig } from 'vite-plus';

export default defineConfig({
  lint: {
    ignorePatterns: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.next/**'],
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {
    semi: true,
    singleQuote: true,
    trailingComma: 'all',
    arrowParens: 'always',
  },
  staged: {
    '*.{js,ts,tsx,jsx}': 'vp check --fix',
  },
  run: {
    tasks: {
      dev: {
        command: 'vp dev',
        cache: false,
      },
      build: {
        command: 'vp build',
        dependsOn: ['^build'],
      },
      lint: {
        command: 'vp lint',
      },
      check: {
        command: 'vp check',
      },
    },
  },
});
