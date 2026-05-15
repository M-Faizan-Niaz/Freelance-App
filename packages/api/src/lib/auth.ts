import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { APIError, betterAuth, generateId, type User, type HookEndpointContext } from 'better-auth';
import type { BetterAuthPlugin } from 'better-auth';
import { db } from '@/db';
import { sessions, users, accounts, verifications, twoFactors } from '$models';
import { openAPI, emailOTP, testUtils } from 'better-auth/plugins';
import { AuthService } from '@/modules/users/auth/auth.service';
import { createAuthEndpoint, createAuthMiddleware, isAPIError } from 'better-auth/api';
import { errorResponse, successResponse } from './api-response';
import {
  registerCustomerSchema,
  registerProviderSchema,
  type RegisterCustomerInput,
  type RegisterProviderInput,
} from '@/modules/users/auth/auth.schema';
import { getLogger } from './logger';
import { appConfig } from '@/config/app.config';
import env from '@/config/env.config';
import { tokenStore } from '@/test/token-store';
import { eq } from 'drizzle-orm';
import {
  customers,
  customerStatuses,
  roles,
  serviceProviders,
  tiers,
  userProfiles,
} from '@/db/models';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function createAuthUser(
  ctx: any,
  { name, email, password }: { name: string; email: string; password: string },
) {
  const existing = await ctx.context.internalAdapter.findUserByEmail(email, {
    includeAccounts: false,
  });
  if (existing) throw new APIError('CONFLICT', { message: 'Email already in use' });

  const newUser = await ctx.context.internalAdapter.createUser({
    name,
    email,
    emailVerified: false,
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const hashedPassword = await ctx.context.password.hash(password);
  await ctx.context.internalAdapter.createAccount({
    userId: newUser.id,
    accountId: newUser.id,
    providerId: 'credential',
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return newUser;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function sendVerificationIfEnabled(
  ctx: any,
  user: { id: string; name: string; email: string },
) {
  if (!ctx.context.options.emailVerification?.sendOnSignUp) return;

  const token = generateId();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await ctx.context.internalAdapter.createVerificationValue({
    identifier: token,
    value: user.email,
    expiresAt,
  });
  const verifyUrl = `${ctx.context.options.baseURL}/v1/api/auth/verify-email?token=${token}`;
  await ctx.context.options.emailVerification.sendVerificationEmail?.({
    user,
    url: verifyUrl,
    token,
  });
}

export const myCustomPlugin = (): BetterAuthPlugin => ({
  id: 'marketplace-registration',

  endpoints: {
    registerCustomer: createAuthEndpoint(
      '/register/customer',
      {
        method: 'POST',
        body: registerCustomerSchema,
        metadata: {
          openapi: {
            description: 'Register a new customer account',
            responses: {
              200: { description: 'Customer registered successfully' },
              400: { description: 'Validation error' },
              409: { description: 'Email already in use' },
            },
          },
        },
      },
      async (ctx) => {
        const { name, email, password, phoneNumber } = ctx.body as RegisterCustomerInput;

        const newUser = await createAuthUser(ctx, { name, email, password });

        await db.transaction(async (tx) => {
          const [customerRole] = await tx.select().from(roles).where(eq(roles.name, 'customer'));
          const [activeStatus] = await tx
            .select()
            .from(customerStatuses)
            .where(eq(customerStatuses.name, 'active'));

          await tx.insert(userProfiles).values({
            userId: newUser.id,
            roleId: customerRole.id,
            fullName: name,
            phoneNumber,
          });
          await tx.insert(customers).values({
            userId: newUser.id,
            customerStatusId: activeStatus.id,
          });
        });

        await sendVerificationIfEnabled(ctx, newUser);

        return ctx.json(
          successResponse(
            { id: newUser.id, name: newUser.name, email: newUser.email },
            'Customer registered successfully. Please check your email to verify your account.',
          ),
        );
      },
    ),

    registerProvider: createAuthEndpoint(
      '/register/provider',
      {
        method: 'POST',
        body: registerProviderSchema,
        metadata: {
          openapi: {
            description: 'Register a new service provider account',
            responses: {
              200: { description: 'Provider registered successfully' },
              400: { description: 'Validation error' },
              409: { description: 'Email already in use' },
            },
          },
        },
      },
      async (ctx) => {
        const { name, email, password, phoneNumber, cnicNumber, city } =
          ctx.body as RegisterProviderInput;

        const newUser = await createAuthUser(ctx, { name, email, password });

        await db.transaction(async (tx) => {
          const [providerRole] = await tx
            .select()
            .from(roles)
            .where(eq(roles.name, 'service_provider'));
          const [basicTier] = await tx.select().from(tiers).where(eq(tiers.name, 'Basic'));

          await tx.insert(userProfiles).values({
            userId: newUser.id,
            roleId: providerRole.id,
            fullName: name,
            phoneNumber,
          });
          await tx.insert(serviceProviders).values({
            userId: newUser.id,
            cnicNumber,
            tierId: basicTier.id,
            isCnicVerified: false,
            isOnline: false,
            city,
          });
        });

        await sendVerificationIfEnabled(ctx, newUser);

        return ctx.json(
          successResponse(
            { id: newUser.id, name: newUser.name, email: newUser.email },
            'Provider registered successfully. Please verify your email and complete your profile.',
          ),
        );
      },
    ),
  },
});





const logger = getLogger();

const EMAIL_VERIFICATION_EXPIRY_SECONDS = 86_400; // 24 hours
const RESET_PASSWORD_TOKEN_EXPIRY_SECONDS = 3600; // 1 hour

type Ctx = Parameters<Parameters<typeof createAuthMiddleware>[0]>[0];

const routes = {
  signUp: '/sign-up/email',
  signIn: '/sign-in/email',
  requestPasswordReset: '/request-password-reset',
  resetPassword: '/reset-password',
  changePassword: '/change-password',
  verifyEmail: '/verify-email',
  requestChangeEmail: '/email-otp/request-email-change',
  changeEmail: '/email-otp/change-email',
} as const;

type HookConfig = {
  path: string;
  successMessage: string;
  beforeExtra?: (ctx: Ctx) => Promise<void>;
  afterSuccess?: (ctx: Ctx, returned: unknown) => Promise<void>;
  afterError?: (ctx: Ctx, error: APIError) => Promise<void>;
};

const makeHook = (cfg: HookConfig) => ({
  before: cfg.beforeExtra
    ? {
        matcher: (c: HookEndpointContext) => c.path === cfg.path,
        handler: createAuthMiddleware(async (ctx) => {
          await cfg.beforeExtra!(ctx);
          return ctx;
        }),
      }
    : null,
  after: {
    matcher: (c: HookEndpointContext) => c.path === cfg.path,
    handler: createAuthMiddleware(async (ctx) => {
      const returned = ctx.context.returned;
      if (isAPIError(returned)) {
        await cfg.afterError?.(ctx, returned);
        return errorResponse(returned.statusCode, returned.message);
      }
      await cfg.afterSuccess?.(ctx, returned);
      return successResponse(returned, cfg.successMessage);
    }),
  },
});

const customHooks = {
  signUp: makeHook({
    path: routes.signUp,
    successMessage: 'User registered successfully. Please check your email to verify your account.',
    beforeExtra: async (ctx) => {
      await AuthService.throwIfEmailExists(ctx.body.email);
    },
  }),
  signIn: makeHook({
    path: routes.signIn,
    successMessage: 'Logged in successfully',
    beforeExtra: async (ctx) => {
      const user = await AuthService.getUserOrThrow(ctx.body.email);
      await AuthService.throwIfAccountIsLocked(user);
    },
    afterSuccess: async (ctx) => {
      const user = await AuthService.getUserOrThrow(ctx.body.email);
      await AuthService.recordSuccessfulLogin(user);
    },
    afterError: async (ctx) => {
      const user = await AuthService.findUserByEmail(ctx.body.email);
      if (user) await AuthService.recordFailedLoginAttempt(user);
    },
  }),
  requestPasswordReset: makeHook({
    path: routes.requestPasswordReset,
    successMessage: 'Password reset email sent successfully',
  }),
  resetPassword: makeHook({
    path: routes.resetPassword,
    successMessage: 'Password reset successfully',
  }),
  changePassword: makeHook({
    path: routes.changePassword,
    successMessage: 'Password changed successfully',
  }),
  requestChangeEmail: makeHook({
    path: routes.requestChangeEmail,
    successMessage: 'OTP sent',
    beforeExtra: async (ctx) => {
      await AuthService.throwIfEmailExists(ctx.body.newEmail);
    },
  }),
  changeEmail: makeHook({
    path: routes.changeEmail,
    successMessage: 'Email changed successfully',
    beforeExtra: async (ctx) => {
      await AuthService.throwIfEmailExists(ctx.body.newEmail);
    },
  }),
  verifyEmail: makeHook({
    path: routes.verifyEmail,
    successMessage: 'Email verified successfully',
  }),
};

const customPlugin = () => {
  const hooks = Object.values(customHooks);
  return {
    id: 'auth-response-wrapper',
    hooks: {
      before: hooks.map((h) => h.before).filter((b): b is NonNullable<typeof b> => b !== null),
      after: hooks.map((h) => h.after),
    },
  };
};

logger.info('Initializing auth...');

const basePath = '/v1/api/auth';

export const auth = betterAuth({
  basePath,
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: appConfig.allowedOrigins,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications,
      twoFactor: twoFactors,
    },
  }),

  databaseHooks: {
    user: {
      create: {
        before: async (user) => ({
          data: { ...user, twoFactorEnabled: false },
        }),
      },
    },
  },

  user: {
    changeEmail: {
      enabled: true,
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    expiresIn: EMAIL_VERIFICATION_EXPIRY_SECONDS,

    sendVerificationEmail: async ({ user, url }: { user: User; url: string }) => {
      const token = new URL(url).searchParams.get('token');
      if (token) tokenStore.set(user.email, token);

      // Send a frontend URL so the verify-email page handles the token,
      // instead of emailing the raw backend endpoint which would verify
      // server-side and redirect with no token visible to the frontend page.
      const frontendUrl = new URL('/auth/verify-email', env.ADMIN_URL);
      frontendUrl.searchParams.set('token', token!);
      await AuthService.sendVerificationEmail(user, frontendUrl.toString());
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }: { user: User; url: string; token: string }) => {
      if (token) tokenStore.set(`reset:${user.email}`, token);
      await AuthService.sendResetPasswordEmail(user, url);
    },
    resetPasswordTokenExpirySeconds: RESET_PASSWORD_TOKEN_EXPIRY_SECONDS,

    onPasswordReset: async ({ user }) => {
      await AuthService.unlockAccount({ id: user.id });
    },
  },

  plugins: [
    customPlugin(),
    openAPI(),
    testUtils({
      captureOTP: true,
    }),

    emailOTP({
      changeEmail: {
        enabled: true,
      },
      async sendVerificationOTP({ email, otp, type }) {
        if (type === 'change-email') {
          tokenStore.set(`otp:${email}`, otp);
          await AuthService.sendOTPEmail(email, otp);
        }
      },
    }),
    myCustomPlugin(),
  ],
});

logger.info('Auth initialized');
logger.info(`Auth Reference: ${env.BETTER_AUTH_URL}${basePath}/reference`);
