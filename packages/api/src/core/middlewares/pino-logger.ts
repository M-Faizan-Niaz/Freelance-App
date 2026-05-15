import { pinoLogger as logger } from 'hono-pino';

import { baseLogger } from '@/lib/logger';

export function pinoLogger() {
  return logger({
    pino: baseLogger,
    http: {
      reqId: () => crypto.randomUUID(),
      async onReqMessage() {
        return '';
      },
    },
  });
}

export default pinoLogger;
