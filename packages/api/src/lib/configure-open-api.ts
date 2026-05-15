import type { AppOpenAPI } from './types';

import { apiReference } from '@scalar/hono-api-reference';

import packageJSON from '../../package.json' with { type: 'json' };

export default function configureOpenAPI(app: AppOpenAPI) {
  app.doc('/doc', {
    openapi: '3.0.0',
    info: {
      version: packageJSON.version,
      title: 'API',
    },
  });

  app.get(
    '/reference',
    apiReference({
      url: '/doc',
      theme: 'kepler',
      defaultHttpClient: {
        targetKey: 'js',
        clientKey: 'fetch',
      },
    }),
  );
}
