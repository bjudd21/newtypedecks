/**
 * Core email sending functionality
 */

import { createTransporter } from '../../config/email';
import { EmailOptions } from './types';
import { DEFAULT_EMAIL_FROM } from './constants';

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
      from: DEFAULT_EMAIL_FROM,
      ...options,
    });

    console.warn('Email sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}
