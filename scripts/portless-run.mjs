import { spawn } from 'node:child_process';

const [sub, filter] = process.argv.slice(2);

if (!sub || !filter) {
  console.error('usage: portless-run.mjs <subdomain> <pnpm-filter>');
  process.exit(2);
}

const project = process.env.PORTLESS_PROJECT ?? 'viteplusmono';
const tld = process.env.PORTLESS_TLD ?? 'test';
const sync = process.env.PORTLESS_SYNC_HOSTS ?? '1';

process.env.PORTLESS_TLD = tld;
process.env.PORTLESS_SYNC_HOSTS = sync;

const args = [`${sub}.${project}`, 'pnpm', '--filter', filter, 'dev'];

const child = spawn('portless', args, { stdio: 'inherit', shell: true });
child.on('exit', (code) => process.exit(code ?? 0));
