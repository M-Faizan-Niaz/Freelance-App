import { concurrently } from 'concurrently';

const project = process.env.PORTLESS_PROJECT ?? 'viteplusmono';
const tld = process.env.PORTLESS_TLD ?? 'test';
const sync = process.env.PORTLESS_SYNC_HOSTS ?? '1';

process.env.PORTLESS_TLD = tld;
process.env.PORTLESS_SYNC_HOSTS = sync;

const apps = [
  { name: 'API', sub: 'api', filter: 'api', color: 'green' },
  { name: 'WEB', sub: 'web', filter: 'web', color: 'blue' },
  { name: 'ADMIN', sub: 'admin', filter: 'admin', color: 'magenta' },
];

const banner = apps
  .map((a) => `  ${a.name.padEnd(5)} https://${a.sub}.${project}.${tld}`)
  .join('\n');
process.stdout.write(`\nportless dev hosts (TLD=${tld}):\n${banner}\n\n`);

const { result } = concurrently(
  [
    ...apps.map((a) => ({
      name: a.name,
      prefixColor: a.color,
      command: `portless ${a.sub}.${project} pnpm --filter ${a.filter} dev`,
    })),
    {
      name: 'ORVAL',
      prefixColor: 'cyan',
      command: 'pnpm --filter @repo/api-client dev',
    },
  ],
  {
    prefix: 'name',
    killOthersOn: ['failure', 'success'],
    restartTries: 0,
  },
);

result.then(
  () => process.exit(0),
  () => process.exit(1),
);
