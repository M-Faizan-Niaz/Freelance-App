import pino from 'pino';

import { env } from '@/config';

const transport = pino.transport({
  targets: [
    {
      target: 'pino/file',
      options: {
        destination: './logs/app.log',
        mkdir: true,
      },
    },
    {
      target: 'pino-pretty',
      options: {
        destination: 1,
        colorize: true,
        ignore: 'pid,hostname,filename',
        messageFormat: '{if filename}[{filename}] {end}{msg}',
      },
    },
  ],
});

export const baseLogger = pino(
  {
    level: env.LOG_LEVEL || 'info',
    name: 'api-logger',
    redact: ['password'],
    serializers: {
      req: (req) => ({
        method: req.method,
        url: req.url,
      }),
    },
  },
  transport,
);

const STACK_FRAME_REGEX = /(?:[(\s])(?:file:\/\/\/)?([^()\s]+?):\d+:\d+\)?$/;

function inferCallerFilename(): string {
  const stack = new Error().stack ?? '';
  const frames = stack.split('\n').slice(1);
  const callerFrame = frames.find((f) => !f.includes('logger.ts')) ?? frames[1] ?? '';
  const match = callerFrame.match(STACK_FRAME_REGEX);
  if (!match) return 'unknown';
  const normalized = match[1].replace(/\\/g, '/');
  return normalized.split('/').pop() || 'unknown';
}

export function getLogger() {
  const filename = inferCallerFilename();
  return baseLogger.child({ filename });
}
