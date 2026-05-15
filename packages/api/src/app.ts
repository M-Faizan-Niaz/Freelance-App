import { appConfig } from '@/config';
import { rateLimiter } from '@/core/middlewares';
import { authValidationMiddleware } from '@/core/middlewares/auth-validation-middleware';
import configureOpenAPI from '@/lib/configure-open-api';
import createApp from '@/lib/create-app';
import { auth } from './lib/auth';
import colors from '@/modules/colors/colors.index';
import index from '@/modules/index.route';

const app = createApp();

configureOpenAPI(app);

// Schema validation for auth routes (runs before better-auth handler)
app.use('/v1/api/auth/*', authValidationMiddleware);

// Better-auth routes with /v1 prefix
app.on(['POST', 'GET', 'OPTIONS'], '/v1/api/auth/*', (c) => auth.handler(c.req.raw));

// Apply rate limiting in all environments for security, but with different settings
if (appConfig.isProduction) {
  app.use(
    '*',
    rateLimiter({
      windowMs: 60 * 1000, // 1 minute
      max: 120, // 120 requests per minute
      standardHeaders: true,
      message: 'Too many requests, please try again later',
    }),
  );
} else {
  // Less strict for development environment
  app.use(
    '*',
    rateLimiter({
      windowMs: 60 * 1000,
      max: 500,
      standardHeaders: true,
    }),
  );
}

// Do not apply CSRF protection for all environments - Not needed for now
// app.use("*", csrfProtection);
//

const routes = [colors] as const;

// Register the index route
app.route('/', index);

// Register all other routes
for (const route of routes) {
  app.route('/v1', route);
}

export type AppType = (typeof routes)[number];

export default app;
