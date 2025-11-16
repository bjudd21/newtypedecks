/**
 * SignInForm types
 */

export interface SignInFormProps {
  callbackUrl?: string;
  className?: string;
}

export interface FormData {
  email: string;
  password: string;
}

export type FormErrors = Record<string, string>;
