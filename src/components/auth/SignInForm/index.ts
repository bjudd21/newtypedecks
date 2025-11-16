/**
 * SignInForm Module Exports
 *
 * This module provides a comprehensive authentication form with:
 * - Email/password credentials sign-in
 * - OAuth providers (Google, Discord)
 * - Form validation and error handling
 * - Password visibility toggle
 * - Loading states for all auth methods
 * - Email verification reminders
 * - Responsive layout with multiple auth options
 */

// Main component
export { SignInFormComponent } from './SignInFormComponent';

// Types
export type { SignInFormProps, FormData, FormErrors } from './types';

// Hooks
export { useFormState } from './hooks/useFormState';
export { usePasswordVisibility } from './hooks/usePasswordVisibility';
export { useSignInHandlers } from './hooks/useSignInHandlers';

// Components
export { GeneralError } from './components/GeneralError';
export { PasswordInput } from './components/PasswordInput';
export { ForgotPasswordLink } from './components/ForgotPasswordLink';
export { OAuthSection } from './components/OAuthSection';
export { SignUpLink } from './components/SignUpLink';

// Icons
export { EyeIcon } from './components/icons/EyeIcon';
export { EyeOffIcon } from './components/icons/EyeOffIcon';
export { GoogleIcon } from './components/icons/GoogleIcon';
export { DiscordIcon } from './components/icons/DiscordIcon';
