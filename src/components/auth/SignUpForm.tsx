/**
 * SignUpForm - Re-export from modularized version
 *
 * This file maintains backward compatibility with existing imports.
 * The actual implementation is in ./SignUpForm/ directory.
 */

export { SignUpForm } from './SignUpForm/SignUpForm';
export { PasswordInputWithToggle } from './SignUpForm/PasswordInputWithToggle';
export { PasswordRequirements } from './SignUpForm/PasswordRequirements';
export { OAuthButtons } from './SignUpForm/OAuthButtons';
export type {
  SignUpFormProps,
  SignUpFormData,
  SignUpFormErrors,
} from './SignUpForm/types';
export { SignUpForm as default } from './SignUpForm/SignUpForm';
