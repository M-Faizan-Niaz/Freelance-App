import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import app from '@/app';
import { extractSessionCookie, parseResponse, testRequest } from '@/test/helpers';
import type { TestHelpers } from 'better-auth/plugins';
import { auth } from '../../../lib/auth';
import { tokenStore } from '@/test/token-store';

describe('users Module - Authentication', () => {
  function getTestEmail() {
    return `test_${Math.random().toString(36).substring(7)}@mail.com`;
  }
  describe('POST /v1/api/signup/email', () => {
    const path = '/v1/api/auth/sign-up/email';

    it('should return 400 for missing credentials', async () => {
      const response = await testRequest(app, path, {
        method: 'POST',
        body: {},
      });

      const data = await parseResponse<{ success: boolean }>(response);
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should return 400 for invalid email format', async () => {
      const response = await testRequest(app, path, {
        method: 'POST',
        body: {
          email: 'not-an-email',
          password: 'khaN@123',
          name: 'Faizan',
        },
      });

      const data = await parseResponse<{ success: boolean }>(response);

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should return 400 for missing password', async () => {
      const response = await testRequest(app, path, {
        method: 'POST',
        body: {
          email: getTestEmail(),
          name: 'Faizan',
          // password missing
        },
      });

      const data = await parseResponse<{ success: boolean }>(response);

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should signup successfully with valid credentials', async () => {
      const response = await testRequest(app, path, {
        method: 'POST',
        body: {
          email: getTestEmail(),
          password: 'khaN@123',
          name: 'Faizan',
        },
      });

      const data = await parseResponse<{ success: boolean; user?: { email: string } }>(response);
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  }, 60000);

  describe('POST /v1/api/auth/verify-email', () => {
    let test: TestHelpers;

    beforeAll(async () => {
      const ctx = await auth.$context;
      test = ctx.test;
    });

    beforeEach(() => {
      test?.clearOTPs?.();
      tokenStore.clear();
    });

    it('should return 400 for missing token', async () => {
      const response = await testRequest(app, '/v1/api/auth/verify-email', {
        method: 'POST',
        body: {},
      });

      const data = await parseResponse<{ success: boolean }>(response);
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should return 400 for invalid/expired token', async () => {
      const response = await testRequest(
        app,
        '/v1/api/auth/verify-email?token=invalid-token-12345',
        { method: 'GET' },
      );

      const data = await parseResponse<{ success: boolean }>(response);

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
    });

    it('should verify email and set emailVerified to true', async () => {
      const email = `test-${Date.now()}@example.com`;

      // Step 1: Signup user
      const signupResponse = await testRequest(app, '/v1/api/auth/sign-up/email', {
        method: 'POST',
        body: {
          email,
          password: 'khaN@123',
          name: 'Faizan',
        },
      });
      expect(signupResponse.status).toBe(200);

      type AuthResponse = {
        success: boolean;
        message: string;
        data: {
          token: string | null;
          user: {
            id: string;
            name: string;
            email: string;
            emailVerified: boolean;
            image: string | null;
            createdAt: string; // ISO date string
            updatedAt: string; // ISO date string
          };
        };
      };
      const signupData = await parseResponse<AuthResponse>(signupResponse);

      expect(signupData.data.user.emailVerified).toBe(false);

      // Step 2: Get captured verification token
      const verificationToken = tokenStore.get(email);

      expect(verificationToken).toBeDefined();

      // Step 3: Verify email (GET with token as query param — better-auth verify-email is GET only)
      const verifyResponse = await testRequest(
        app,
        `/v1/api/auth/verify-email?token=${verificationToken}`,
        { method: 'GET' },
      );

      const verifyData = await parseResponse<{
        success: boolean;
        data?: { status: boolean };
      }>(verifyResponse);

      expect(verifyResponse.status).toBe(200);
      expect(verifyData.success).toBe(true);

      // Step 4: Sign in to confirm emailVerified is now true
      const signInResponse = await testRequest(app, '/v1/api/auth/sign-in/email', {
        method: 'POST',
        body: { email, password: 'khaN@123' },
      });

      const signInData = await parseResponse<AuthResponse>(signInResponse);
      expect(signInResponse.status).toBe(200);
      expect(signInData.data.user.emailVerified).toBe(true);
    });
  }, 600000);

  describe('POST /v1/api/auth/sign-in/email', () => {
    const path = '/v1/api/auth/sign-in/email';

    const verifiedUser = {
      email: `signin-verified-${Date.now()}@example.com`,
      password: 'khaN@123!',
      name: 'Test User',
    };

    beforeAll(async () => {
      tokenStore.clear();

      await testRequest(app, '/v1/api/auth/sign-up/email', {
        method: 'POST',
        body: verifiedUser,
      });

      const token = tokenStore.get(verifiedUser.email);
      await testRequest(app, `/v1/api/auth/verify-email?token=${token}`, { method: 'GET' });
    });

    it('should return 400 for missing credentials', async () => {
      const response = await testRequest(app, path, {
        method: 'POST',
        body: {},
      });

      const data = await parseResponse<{ success: boolean }>(response);
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should return 400 for invalid email format', async () => {
      const response = await testRequest(app, path, {
        method: 'POST',
        body: { email: 'not-an-email', password: 'khaN@123!' },
      });

      const data = await parseResponse<{ success: boolean }>(response);
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should return 400 for missing password', async () => {
      const response = await testRequest(app, path, {
        method: 'POST',
        body: { email: verifiedUser.email },
      });

      const data = await parseResponse<{ success: boolean }>(response);
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should return 401 for non-existent email', async () => {
      const response = await testRequest(app, path, {
        method: 'POST',
        body: { email: 'ghost@nonexistent.com', password: 'khaN@123!' },
      });

      const data = await parseResponse<{ success: boolean }>(response);
      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
    });

    it('should return 401 for wrong password', async () => {
      const response = await testRequest(app, path, {
        method: 'POST',
        body: { email: verifiedUser.email, password: 'WrongPassword@999!' },
      });

      const data = await parseResponse<{ success: boolean }>(response);
      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
    });

    it('should sign in successfully with valid credentials', async () => {
      const response = await testRequest(app, path, {
        method: 'POST',
        body: { email: verifiedUser.email, password: verifiedUser.password },
      });

      type SignInResponse = {
        success: boolean;
        message: string;
        data: {
          token: string | null;
          user: { email: string; emailVerified: boolean };
        };
      };

      const data = await parseResponse<SignInResponse>(response);
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.user.email).toBe(verifiedUser.email);
    });
  }, 60000);

  describe('POST /v1/api/auth/request-password-reset', () => {
    const path = '/v1/api/auth/request-password-reset';

    const user = {
      email: `reset-${Date.now()}@example.com`,
      password: 'khaN@123!',
      name: 'Reset User',
    };

    beforeAll(async () => {
      tokenStore.clear();

      // create + verify user
      await testRequest(app, '/v1/api/auth/sign-up/email', {
        method: 'POST',
        body: user,
      });

      const token = tokenStore.get(user.email);
      await testRequest(app, `/v1/api/auth/verify-email?token=${token}`, {
        method: 'GET',
      });
    });

    beforeEach(() => {
      tokenStore.clear();
    });

    it('should return 400 for missing email', async () => {
      const res = await testRequest(app, path, {
        method: 'POST',
        body: {},
      });

      const data = await parseResponse<{ success: boolean }>(res);
      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should return 400 for invalid email format', async () => {
      const res = await testRequest(app, path, {
        method: 'POST',
        body: { email: 'invalid-email' },
      });

      const data = await parseResponse<{ success: boolean }>(res);
      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should generate reset token for existing user', async () => {
      const res = await testRequest(app, path, {
        method: 'POST',
        body: { email: user.email },
      });

      const data = await parseResponse<{ success: boolean }>(res);

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);

      const token = tokenStore.get(`reset:${user.email}`);
      expect(token).toBeDefined();
    });
  }, 60000);

  describe('POST /v1/api/auth/reset-password', () => {
    const path = '/v1/api/auth/reset-password';

    const user = {
      email: `reset-pw-${Date.now()}@example.com`,
      password: 'khaN@123!',
      name: 'Reset PW User',
    };

    beforeAll(async () => {
      tokenStore.clear();

      await testRequest(app, '/v1/api/auth/sign-up/email', {
        method: 'POST',
        body: user,
      });

      const verifyToken = tokenStore.get(user.email);
      await testRequest(app, `/v1/api/auth/verify-email?token=${verifyToken}`, { method: 'GET' });
    });

    beforeEach(async () => {
      tokenStore.clear();

      await testRequest(app, '/v1/api/auth/request-password-reset', {
        method: 'POST',
        body: { email: user.email },
      });
    });

    it('should return 400 for missing token and newPassword', async () => {
      const res = await testRequest(app, path, {
        method: 'POST',
        body: {},
      });

      const data = await parseResponse<{ success: boolean }>(res);
      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should return 400 for missing newPassword', async () => {
      const token = tokenStore.get(`reset:${user.email}`);

      const res = await testRequest(app, path, {
        method: 'POST',
        body: { token },
      });

      const data = await parseResponse<{ success: boolean }>(res);
      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should return 400 for missing token', async () => {
      const res = await testRequest(app, path, {
        method: 'POST',
        body: { newPassword: 'NewPass@123!' },
      });

      const data = await parseResponse<{ success: boolean }>(res);
      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should return 400 for invalid/expired token', async () => {
      const res = await testRequest(app, path, {
        method: 'POST',
        body: { token: 'invalid-token-xyz', newPassword: 'NewPass@123!' },
      });

      const data = await parseResponse<{ success: boolean }>(res);
      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should reset password and allow login with new password', async () => {
      const newPassword = 'NewPass@456!';
      const token = tokenStore.get(`reset:${user.email}`);
      expect(token).toBeDefined();

      const res = await testRequest(app, path, {
        method: 'POST',
        body: { token, newPassword },
      });

      const data = await parseResponse<{ success: boolean }>(res);
      expect(res.status).toBe(200);
      expect(data.success).toBe(true);

      // Verify old password no longer works
      const oldLoginRes = await testRequest(app, '/v1/api/auth/sign-in/email', {
        method: 'POST',
        body: { email: user.email, password: user.password },
      });
      expect(oldLoginRes.status).toBe(401);

      // Verify new password works
      const newLoginRes = await testRequest(app, '/v1/api/auth/sign-in/email', {
        method: 'POST',
        body: { email: user.email, password: newPassword },
      });

      const newLoginData = await parseResponse<{ success: boolean }>(newLoginRes);
      expect(newLoginRes.status).toBe(200);
      expect(newLoginData.success).toBe(true);
    });
  }, 60000);

  describe('POST /v1/api/auth/email-otp/request-email-change', () => {
    const path = '/v1/api/auth/email-otp/request-email-change';

    const user = {
      email: `email-change-req-${Date.now()}@example.com`,
      password: 'khaN@123!',
      name: 'Email Change Req User',
    };

    let bearerToken: string;
    let sessionCookie: string;
    let test: TestHelpers;

    beforeAll(async () => {
      const ctx = await auth.$context;
      test = ctx.test;

      tokenStore.clear();

      await testRequest(app, '/v1/api/auth/sign-up/email', {
        method: 'POST',
        body: user,
      });

      const verifyToken = tokenStore.get(user.email);
      await testRequest(app, `/v1/api/auth/verify-email?token=${verifyToken}`, { method: 'GET' });

      const signInRes = await testRequest(app, '/v1/api/auth/sign-in/email', {
        method: 'POST',
        body: { email: user.email, password: user.password },
      });

      const signInData = await parseResponse<{ data: { token: string } }>(signInRes);
      bearerToken = signInData.data.token;

      sessionCookie = extractSessionCookie(signInRes);
    });

    beforeEach(() => {
      test?.clearOTPs?.();
    });

    it('should return 400 for missing newEmail', async () => {
      const res = await testRequest(app, path, {
        method: 'POST',
        headers: { Authorization: `Bearer ${bearerToken}`, Cookie: sessionCookie },
        body: {},
      });

      expect(res.status).toBe(400);
    });

    it('should return 400 for invalid email format', async () => {
      const res = await testRequest(app, path, {
        method: 'POST',
        headers: { Authorization: `Bearer ${bearerToken}`, Cookie: sessionCookie },
        body: { newEmail: 'not-an-email' },
      });

      expect(res.status).toBe(400);
    });

    it('should return 409 when newEmail is already in use', async () => {
      const res = await testRequest(app, path, {
        method: 'POST',
        headers: { Authorization: `Bearer ${bearerToken}`, Cookie: sessionCookie },
        body: { newEmail: user.email },
      });

      expect(res.status).toBe(409);
    });

    it('should send OTP to new email', async () => {
      const newEmail = `new-target-${Date.now()}@example.com`;

      const res = await testRequest(app, path, {
        method: 'POST',
        headers: { Authorization: `Bearer ${bearerToken}`, Cookie: sessionCookie },
        body: { newEmail },
      });

      expect(res.status).toBe(200);

      const otp = tokenStore.get(`otp:${newEmail}`);
      expect(otp).toBeDefined();
    });
  }, 60000);

  describe('POST /v1/api/auth/email-otp/change-email', () => {
    const path = '/v1/api/auth/email-otp/change-email';

    const user = {
      email: `email-change-${Date.now()}@example.com`,
      password: 'khaN@123!',
      name: 'Email Change User',
    };

    const newEmail = `changed-to-${Date.now()}@example.com`;

    let bearerToken: string;
    let sessionCookie: string;
    let test: TestHelpers;

    beforeAll(async () => {
      const ctx = await auth.$context;
      test = ctx.test;

      tokenStore.clear();

      await testRequest(app, '/v1/api/auth/sign-up/email', {
        method: 'POST',
        body: user,
      });

      const verifyToken = tokenStore.get(user.email);
      await testRequest(app, `/v1/api/auth/verify-email?token=${verifyToken}`, { method: 'GET' });

      const signInRes = await testRequest(app, '/v1/api/auth/sign-in/email', {
        method: 'POST',
        body: { email: user.email, password: user.password },
      });

      const signInData = await parseResponse<{ data: { token: string } }>(signInRes);
      bearerToken = signInData.data.token;

      sessionCookie = extractSessionCookie(signInRes);
    }, 30000);

    beforeEach(async () => {
      test?.clearOTPs?.();

      //  Always generate fresh OTP
      await testRequest(app, '/v1/api/auth/email-otp/request-email-change', {
        method: 'POST',
        headers: { Authorization: `Bearer ${bearerToken}`, Cookie: sessionCookie },
        body: { newEmail },
      });

      //  Ensure OTP exists
      const otp = tokenStore.get(`otp:${newEmail}`);
      if (!otp) throw new Error('OTP not generated in beforeEach');
    }, 30000);

    it('should return 400 for missing fields', async () => {
      const res = await testRequest(app, path, {
        method: 'POST',
        headers: { Authorization: `Bearer ${bearerToken}`, Cookie: sessionCookie },
        body: {},
      });

      expect(res.status).toBe(400);
    });

    it('should return 400 for missing otp', async () => {
      const res = await testRequest(app, path, {
        method: 'POST',
        headers: { Authorization: `Bearer ${bearerToken}`, Cookie: sessionCookie },
        body: { newEmail },
      });

      expect(res.status).toBe(400);
    });

    it('should return 400 for missing newEmail', async () => {
      const otp = tokenStore.get(`otp:${newEmail}`);

      const res = await testRequest(app, path, {
        method: 'POST',
        headers: { Authorization: `Bearer ${bearerToken}`, Cookie: sessionCookie },
        body: { otp },
      });

      expect(res.status).toBe(400);
    });

    it('should return 400 for invalid OTP', async () => {
      const res = await testRequest(app, path, {
        method: 'POST',
        headers: { Authorization: `Bearer ${bearerToken}`, Cookie: sessionCookie },
        body: { newEmail, otp: '000000' },
      });

      expect(res.status).toBe(400);
    });

    it('should change email successfully', async () => {
      const otp = tokenStore.get(`otp:${newEmail}`);

      const res = await testRequest(app, path, {
        method: 'POST',
        headers: { Authorization: `Bearer ${bearerToken}`, Cookie: sessionCookie },
        body: { newEmail, otp },
      });

      expect(res.status).toBe(200);
    });
  }, 60000);

  describe('POST /v1/api/auth/change-password', () => {
    const path = '/v1/api/auth/change-password';

    const user = {
      email: `change-pw-${Date.now()}@example.com`,
      password: 'khaN@123!',
      name: 'Change PW User',
    };

    let bearerToken: string;
    let sessionCookie: string;

    beforeAll(async () => {
      tokenStore.clear();

      await testRequest(app, '/v1/api/auth/sign-up/email', {
        method: 'POST',
        body: user,
      });

      const verifyToken = tokenStore.get(user.email);
      await testRequest(app, `/v1/api/auth/verify-email?token=${verifyToken}`, { method: 'GET' });

      const signInRes = await testRequest(app, '/v1/api/auth/sign-in/email', {
        method: 'POST',
        body: { email: user.email, password: user.password },
      });

      const signInData = await parseResponse<{ data: { token: string } }>(signInRes);
      bearerToken = signInData.data.token;

      // Extract session cookie as fallback auth (token may be null in test env)
      sessionCookie = extractSessionCookie(signInRes);
    }, 30000);

    it('should return 400 for missing newPassword and currentPassword', async () => {
      const res = await testRequest(app, path, {
        method: 'POST',
        headers: { Authorization: `Bearer ${bearerToken}`, Cookie: sessionCookie },
        body: {},
      });

      const data = await parseResponse<{ success: boolean }>(res);
      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should return 400 for missing newPassword', async () => {
      const res = await testRequest(app, path, {
        method: 'POST',
        headers: { Authorization: `Bearer ${bearerToken}`, Cookie: sessionCookie },
        body: { currentPassword: user.password },
      });

      const data = await parseResponse<{ success: boolean }>(res);
      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should return 400 for missing currentPassword', async () => {
      const res = await testRequest(app, path, {
        method: 'POST',
        headers: { Authorization: `Bearer ${bearerToken}`, Cookie: sessionCookie },
        body: { newPassword: 'NewPass@789!' },
      });

      const data = await parseResponse<{ success: boolean }>(res);
      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should return 400 for wrong currentPassword', async () => {
      const res = await testRequest(app, path, {
        method: 'POST',
        headers: { Authorization: `Bearer ${bearerToken}`, Cookie: sessionCookie },
        body: { currentPassword: 'WrongPass@000!', newPassword: 'NewPass@789!' },
      });

      const data = await parseResponse<{ success: boolean }>(res);
      expect(res.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should change password and allow login with new password', async () => {
      const newPassword = 'NewPass@789!';

      const res = await testRequest(app, path, {
        method: 'POST',
        headers: { Authorization: `Bearer ${bearerToken}`, Cookie: sessionCookie },
        body: { currentPassword: user.password, newPassword },
      });

      const data = await parseResponse<{ success: boolean }>(res);
      expect(res.status).toBe(200);
      expect(data.success).toBe(true);

      // Old password should no longer work
      const oldLoginRes = await testRequest(app, '/v1/api/auth/sign-in/email', {
        method: 'POST',
        body: { email: user.email, password: user.password },
      });
      expect(oldLoginRes.status).toBe(401);

      // New password should work
      const newLoginRes = await testRequest(app, '/v1/api/auth/sign-in/email', {
        method: 'POST',
        body: { email: user.email, password: newPassword },
      });

      const newLoginData = await parseResponse<{ success: boolean }>(newLoginRes);
      expect(newLoginRes.status).toBe(200);
      expect(newLoginData.success).toBe(true);
    });
  }, 60000);
});
