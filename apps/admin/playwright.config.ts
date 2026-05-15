import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  reporter: 'html',
  use: {
    headless: false,
    video: 'on',
    baseURL: 'https://admin.viteplusmono.test',
    storageState: 'e2e/.auth/user.json',
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'setup',
      testMatch: /global-setup\.ts/,
      use: { storageState: undefined },
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
  ],
  globalSetup: './e2e/global-setup.ts',
  webServer: {
    command: 'pnpm --filter admin dev',
    url: 'https://admin.viteplusmono.test',
    reuseExistingServer: !process.env['CI'],
    timeout: 120_000,
    ignoreHTTPSErrors: true,
  },
});
