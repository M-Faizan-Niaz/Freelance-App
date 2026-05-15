import { writeFile } from 'node:fs/promises';
import { serve } from '@hono/node-server';

import app from './app';
import { appConfig } from './config';

const port = appConfig.port;
// eslint-disable-next-line no-console
console.log(`Server is running on port http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});

if (process.env.NODE_ENV !== 'production') {
  Promise.resolve(app.request('/doc'))
    .then((r: Response) => r.json() as Promise<unknown>)
    .then((spec: unknown) =>
      writeFile(
        new URL('../../api-client/openapi.json', import.meta.url),
        JSON.stringify(spec, null, 2),
        'utf-8',
      ),
    )
    // eslint-disable-next-line no-console
    .then(() => console.log('OpenAPI spec written to packages/api-client/openapi.json'))
    .catch(console.error);
}
