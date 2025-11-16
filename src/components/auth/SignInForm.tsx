/**
 * SignInForm - Backward compatibility re-export layer
 *
 * This file maintains backward compatibility for existing imports while
 * the actual implementation has been modularized into SignInForm/
 */

// Main component exports
export { SignInFormComponent as SignInForm } from './SignInForm/SignInFormComponent';
export { SignInFormComponent as default } from './SignInForm/SignInFormComponent';

// Type exports
export type {
  SignInFormProps,
  FormData,
  FormErrors,
} from './SignInForm/types';

// Hook exports
export { useFormState } from './SignInForm/hooks/useFormState';
export { usePasswordVisibility } from './SignInForm/hooks/usePasswordVisibility';
export { useSignInHandlers } from './SignInForm/hooks/useSignInHandlers';

// Component exports
export { GeneralError } from './SignInForm/components/GeneralError';
export { PasswordInput } from './SignInForm/components/PasswordInput';
export { ForgotPasswordLink } from './SignInForm/components/ForgotPasswordLink';
export { OAuthSection } from './SignInForm/components/OAuthSection';
export { SignUpLink } from './SignInForm/components/SignUpLink';

// Icon exports
export { EyeIcon } from './SignInForm/components/icons/EyeIcon';
export { EyeOffIcon } from './SignInForm/components/icons/EyeOffIcon';
export { GoogleIcon } from './SignInForm/components/icons/GoogleIcon';
export { DiscordIcon } from './SignInForm/components/icons/DiscordIcon';
