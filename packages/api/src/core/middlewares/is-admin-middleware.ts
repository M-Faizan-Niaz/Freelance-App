import type { MiddlewareHandler } from 'hono';
import type { AppBindings } from '@/lib/types';
import { auth } from '@/lib/auth';
import { HTTPException } from 'hono/http-exception';
import * as HttpStatusCodes from '@/lib/http-status-codes';

export const isAdminMiddleware = (): MiddlewareHandler<AppBindings> => {
  return async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      throw new HTTPException(HttpStatusCodes.UNAUTHORIZED, {
        message: 'Unauthorized - No valid session found',
      });
    }

    c.set('users', session.user);

    if (!session.user.isAdmin) {
      throw new HTTPException(HttpStatusCodes.FORBIDDEN, {
        message: 'Forbidden - Admin access required',
      });
    }

    await next();
  };
};
