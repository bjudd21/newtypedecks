/**
 * Email service types
 */

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export interface EmailVerificationData {
  username: string;
  verificationUrl: string;
}

export interface PasswordResetData {
  username: string;
  resetUrl: string;
}
