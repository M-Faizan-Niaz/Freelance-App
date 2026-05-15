import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TEST_IDS } from './test-ids.js';

function allFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((e) => {
    const p = path.join(dir, e);
    return statSync(p).isDirectory() ? allFiles(p) : [p];
  });
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, '../src');
const content = allFiles(src)
  .filter((f) => f.endsWith('.tsx') || f.endsWith('.ts'))
  .map((f) => readFileSync(f, 'utf-8'))
  .join('\n');

const missing = Object.entries(TEST_IDS)
  .filter(([, id]) => !content.includes(id))
  .map(([key, id]) => `  ${key}: "${id}"`);

if (missing.length) {
  console.error('Missing data-testid in frontend source:\n' + missing.join('\n'));
  process.exit(1);
}
console.log('All test IDs verified.');
