import type { OpenAPIHono, RouteConfig, RouteHandler, z as Z } from '@hono/zod-openapi';
import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgTransaction } from 'drizzle-orm/pg-core';
import type { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js';
import type { Context } from 'hono';
import type { PinoLogger } from 'hono-pino';

import type * as models from '@/db/models';

export type Override<Type, NewType extends { [key in keyof Type]?: NewType[key] }> = Omit<
  Type,
  keyof NewType
> &
  NewType;

export interface AppBindings {
  Variables: {
    logger: PinoLogger;

    users: {};

    ipAddress: string;
    userAgent: string;
    permissions: string[];
    csrfToken: string;
  };
}

export type AppOpenAPI = OpenAPIHono<AppBindings>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, AppBindings>;

export type AppContext = Context<AppBindings>;

// Zod v4: simplify to top-level types used across the app to avoid internal generics like ZodEffects
export type ZodSchema = Z.ZodTypeAny;

export type TX = PgTransaction<
  PostgresJsQueryResultHKT,
  typeof models,
  ExtractTablesWithRelations<typeof models>
>;
