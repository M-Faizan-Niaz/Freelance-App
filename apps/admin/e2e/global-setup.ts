import { chromium, type FullConfig } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TEST_IDS } from './test-ids.js';
import { readdirSync, statSync } from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function allFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((e) => {
    const p = path.join(dir, e);
    return statSync(p).isDirectory() ? allFiles(p) : [p];
  });
}

function validateTestIds() {
  const src = path.join(__dirname, '../src');
  const content = allFiles(src)
    .filter((f) => f.endsWith('.tsx') || f.endsWith('.ts'))
    .map((f) => readFileSync(f, 'utf-8'))
    .join('\n');

  const missing = Object.entries(TEST_IDS)
    .filter(([, id]) => !content.includes(id))
    .map(([key, id]) => `  ${key}: "${id}"`);

  if (missing.length) {
    throw new Error('Missing data-testid in frontend source:\n' + missing.join('\n'));
  }
}

function loadEnv() {
  const envPath = path.join(__dirname, '../.env.e2e');
  const lines = readFileSync(envPath, 'utf-8').split('\n');
  const env: Record<string, string> = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
  }
  return env;
}

export default async function globalSetup(_config: FullConfig) {
  validateTestIds();

  const env = loadEnv();
  const email = env['E2E_EMAIL'];
  const password = env['E2E_PASSWORD'];

  if (!email || !password) {
    throw new Error('.env.e2e must define E2E_EMAIL and E2E_PASSWORD');
  }

  const authDir = path.join(__dirname, '.auth');
  mkdirSync(authDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('https://admin.viteplusmono.test/auth/sign-in');
  await page.getByTestId(TEST_IDS.SIGN_IN_EMAIL).fill(email);
  await page.getByTestId(TEST_IDS.SIGN_IN_PASSWORD).fill(password);
  await page.getByTestId(TEST_IDS.SIGN_IN_SUBMIT).click();
  await page.waitForURL((url) => !url.pathname.startsWith('/auth/'));

  await page.context().storageState({ path: path.join(authDir, 'user.json') });
  await browser.close();
}
