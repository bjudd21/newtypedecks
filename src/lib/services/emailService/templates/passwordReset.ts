/**
 * Password reset email template
 */

import { PasswordResetData } from '../types';
import { sendEmail } from '../sender';

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
