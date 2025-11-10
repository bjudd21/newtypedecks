/**
 * Email service for sending transactional emails
 * Supports SMTP and development logging
 */

import { createTransporter } from '../config/email';

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

/**
 * Send an email using the configured transport
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const transporter = await createTransporter();

    if (!transporter) {
      // In development, log email to console
      console.warn('📧 Email would be sent:', {
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });
      return true;
    }

    const result = await transporter.sendMail({
      from:
        process.env.EMAIL_FROM ||
        '"Gundam Card Game" <noreply@gundam-card-game.com>',
      ...options,
    });

    console.warn('Email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

/**
 * Send email verification email
 */
export async function sendEmailVerification(
  email: string,
  data: EmailVerificationData
): Promise<boolean> {
  const subject = 'Verify your email address';
  const text = `
Hello ${data.username},

Please verify your email address by clicking the link below:
${data.verificationUrl}

If you didn't create an account, you can safely ignore this email.

Best regards,
Gundam Card Game Team
  `.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Verify your email address</h2>
      <p>Hello ${data.username},</p>
      <p>Please verify your email address by clicking the button below:</p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${data.verificationUrl}"
           style="background-color: #007bff; color: white; padding: 12px 24px;
                  text-decoration: none; border-radius: 4px; display: inline-block;">
          Verify Email Address
        </a>
      </div>
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #666;">${data.verificationUrl}</p>
      <p style="color: #666; font-size: 14px;">
        If you didn't create an account, you can safely ignore this email.
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">
        Best regards,<br>
        Gundam Card Game Team
      </p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject,
    text,
    html,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordReset(
  email: string,
  data: PasswordResetData
): Promise<boolean> {
  const subject = 'Reset your password';
  const text = `
Hello ${data.username},

You requested a password reset for your account. Click the link below to reset your password:
${data.resetUrl}

This link will expire in 1 hour.

If you didn't request a password reset, you can safely ignore this email.

Best regards,
Gundam Card Game Team
  `.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Reset your password</h2>
      <p>Hello ${data.username},</p>
      <p>You requested a password reset for your account. Click the button below to reset your password:</p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${data.resetUrl}"
           style="background-color: #dc3545; color: white; padding: 12px 24px;
                  text-decoration: none; border-radius: 4px; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #666;">${data.resetUrl}</p>
      <p style="color: #dc3545; font-weight: bold;">This link will expire in 1 hour.</p>
      <p style="color: #666; font-size: 14px;">
        If you didn't request a password reset, you can safely ignore this email.
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">
        Best regards,<br>
        Gundam Card Game Team
      </p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject,
    text,
    html,
  });
}

/**
 * Send welcome email after successful email verification
 */
export async function sendWelcomeEmail(
  email: string,
  username: string
): Promise<boolean> {
  const subject = 'Welcome to Gundam Card Game!';
  const text = `
Welcome ${username}!

Your email has been verified and your account is now active.

You can now:
- Build and save unlimited decks
- Manage your card collection
- Share decks with the community

Start building your deck: ${process.env.NEXTAUTH_URL}/decks

Best regards,
Gundam Card Game Team
  `.trim();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #28a745;">Welcome to Gundam Card Game!</h2>
      <p>Welcome ${username}!</p>
      <p>Your email has been verified and your account is now active.</p>
      <h3 style="color: #333;">You can now:</h3>
      <ul>
        <li>Build and save unlimited decks</li>
        <li>Manage your card collection</li>
        <li>Share decks with the community</li>
      </ul>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${process.env.NEXTAUTH_URL}/decks"
           style="background-color: #28a745; color: white; padding: 12px 24px;
                  text-decoration: none; border-radius: 4px; display: inline-block;">
          Start Building Decks
        </a>
      </div>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">
        Best regards,<br>
        Gundam Card Game Team
      </p>
    </div>
  `;

  return sendEmail({
    to: email,
    subject,
    text,
    html,
  });
}
