import type { MiddlewareHandler } from 'hono';
import type { AppBindings } from '@/lib/types';
import { auth } from '@/lib/auth';
import { HTTPException } from 'hono/http-exception';
import * as HttpStatusCodes from '@/lib/http-status-codes';
/**
 * BetterAuth Session Middleware
 * Retrieves and sets the current user session on the context
 * Makes users available to all routes via c.var.users or c.set("users", ...)
 */
export const betterAuthSessionMiddleware = (): MiddlewareHandler<AppBindings> => {
  return async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      throw new HTTPException(HttpStatusCodes.UNAUTHORIZED, {
        message: 'Unauthorized - No valid session found',
      });
    } else {
      c.set('users', session.user);
    }

    await next();
  };
};
