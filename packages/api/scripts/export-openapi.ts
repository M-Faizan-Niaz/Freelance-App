import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import app from '../src/app.js';

const outFile = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../api-client/openapi.json',
);

const res = await app.request('/doc');
const spec = await res.json();
await mkdir(path.dirname(outFile), { recursive: true });
await writeFile(outFile, JSON.stringify(spec, null, 2), 'utf-8');
// eslint-disable-next-line no-console
console.log(`OpenAPI spec written to ${outFile}`);
