import env from './env.config';

/**
 * Email configuration values
 */
export const emailConfig = {
  /**
   * SMTP service provider
   */
  smtpService: env.SMTP_SERVICE,

  /**
   * SMTP email address
   */
  smtpEmail: env.SMTP_MAIL,

  /**
   * SMTP password
   */
  smtpPassword: env.SMTP_PASSWORD,

  /**
   * SMTP host
   */
  smtpHost: env.SMTP_HOST,

  /**
   * SMTP port
   */
  smtpPort: env.SMTP_PORT,
};
