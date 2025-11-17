/**
 * Email service - modularized for maintainability
 * Main entry point that re-exports all email functionality
 */

// Core types
export type { EmailOptions, EmailVerificationData, PasswordResetData } from './emailService/types';

// Core sender
export { sendEmail } from './emailService/sender';

// Email templates
export { sendEmailVerification } from './emailService/templates/emailVerification';
export { sendPasswordReset } from './emailService/templates/passwordReset';
export { sendWelcomeEmail } from './emailService/templates/welcomeEmail';
