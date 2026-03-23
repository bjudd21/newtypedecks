/**
 * Email verification email template
 */

import { EmailVerificationData } from '../types';
import { sendEmail } from '../sender';

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
Newtype Decks
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
        Newtype Decks
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
