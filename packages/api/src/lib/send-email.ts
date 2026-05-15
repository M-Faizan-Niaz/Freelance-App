import nodeMailer from 'nodemailer';

import { env } from '@/config';

// ---------------------------------------------------------------------------
// Auth email templates
// ---------------------------------------------------------------------------

export function verificationEmailTemplate(url: string): string {
  return `<!DOCTYPE html><html><body style="font-family:sans-serif;max-width:560px;margin:40px auto;padding:0 16px">
<h2>Verify your Email Address</h2>
<p>Click the button below to verify your email address. This link expires in <strong>24 hours</strong>.</p>
<a href="${url}" style="display:inline-block;padding:12px 24px;background:#18181b;color:#fff;border-radius:6px;text-decoration:none;font-weight:600">Verify Email</a>
<p style="margin-top:24px;font-size:13px;color:#71717a">If you didn't request this change, you can safely ignore this email.</p>
</body></html>`;
}

export function otpEmailTemplate(otp: string): string {
  return `<!DOCTYPE html><html><body style="font-family:sans-serif;max-width:560px;margin:40px auto;padding:0 16px">
<h2>Your verification code</h2>
<p>Use the code below to complete your sign-in. It expires in <strong>10 minutes</strong>.</p>
<div style="font-size:36px;font-weight:700;letter-spacing:8px;padding:16px 0">${otp}</div>
<p style="font-size:13px;color:#71717a">If you didn't request this code, someone may be trying to access your account.</p>
</body></html>`;
}

export function resetPasswordEmailTemplate(url: string): string {
  return `<!DOCTYPE html><html><body style="font-family:sans-serif;max-width:560px;margin:40px auto;padding:0 16px">
<h2>Reset your password</h2>
<p>Click the button below to choose a new password.</p>
<a href="${url}" style="display:inline-block;padding:12px 24px;background:#18181b;color:#fff;border-radius:6px;text-decoration:none;font-weight:600">Reset password</a>
<p style="margin-top:24px;font-size:13px;color:#71717a">This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
</body></html>`;
}

const SEND_TIMEOUT_MS = 45_000;

export async function sendEmail(options: {
  email: string;
  subject: string;
  html?: string;
  message?: string;
}) {
  const transporter = nodeMailer.createTransport({
    host: env.SMTP_HOST,
    port: Number.parseInt(env.SMTP_PORT, 10),
    secure: Number.parseInt(env.SMTP_PORT, 10) === 465,
    auth: {
      user: env.SMTP_MAIL,
      pass: env.SMTP_PASSWORD,
    },
    connectionTimeout: 30_000,
    socketTimeout: 30_000,
  });

  const mailOptions = {
    from: `"TestService" <${env.SMTP_MAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.html || undefined,
    text: options.message || undefined,
  };

  try {
    return await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Email sending timeout')), SEND_TIMEOUT_MS),
      ),
    ]);
  } catch (error) {
    throw new Error(
      `Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  } finally {
    await transporter.close();
  }
}

export default sendEmail;
