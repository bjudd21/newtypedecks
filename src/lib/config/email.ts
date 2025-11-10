/**
 * Email configuration and transport setup
 */

import { createTransport, Transporter } from 'nodemailer';

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

/**
 * Get email configuration from environment variables
 */
export function getEmailConfig(): EmailConfig | null {
  const host = process.env.EMAIL_SERVER_HOST;
  const port = process.env.EMAIL_SERVER_PORT;
  const user = process.env.EMAIL_SERVER_USER;
  const pass = process.env.EMAIL_SERVER_PASSWORD;

  if (!host || !port || !user || !pass) {
    return null;
  }

  return {
    host,
    port: parseInt(port, 10),
    secure: parseInt(port, 10) === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  };
}

/**
 * Create email transporter
 * Returns null if email is not configured (development mode)
 */
export async function createTransporter(): Promise<Transporter | null> {
  const config = getEmailConfig();

  if (!config) {
    console.warn('📧 Email not configured - emails will be logged to console');
    return null;
  }

  try {
    const transporter = createTransport(config);

    // Verify connection
    await transporter.verify();
    console.warn('📧 Email service connected successfully');

    return transporter;
  } catch (error) {
    console.error('❌ Failed to connect to email service:', error);
    return null;
  }
}

/**
 * Check if email is configured
 */
export function isEmailConfigured(): boolean {
  return getEmailConfig() !== null;
}