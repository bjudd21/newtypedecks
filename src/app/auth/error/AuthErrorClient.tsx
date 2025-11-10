/**
 * Authentication error client component
 * Handles OAuth and authentication error display
 */

'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

const ERROR_MESSAGES: Record<string, { title: string; description: string; action?: string }> = {
  Configuration: {
    title: 'OAuth Configuration Error',
    description: 'There\'s an issue with the OAuth configuration. Please contact support.',
  },
  AccessDenied: {
    title: 'Access Denied',
    description: 'You cancelled the authentication process or access was denied.',
    action: 'Please try signing in again if this was unintentional.',
  },
  Verification: {
    title: 'Email Verification Required',
    description: 'Your email address needs to be verified before you can sign in.',
    action: 'Please check your email and verify your account.',
  },
  Default: {
    title: 'Authentication Error',
    description: 'An error occurred during authentication. Please try again.',
    action: 'If the problem persists, please contact support.',
  },
  Signin: {
    title: 'Sign In Error',
    description: 'Unable to sign in with the provided credentials.',
    action: 'Please check your email and password and try again.',
  },
  OAuthSignin: {
    title: 'OAuth Sign In Error',
    description: 'Unable to sign in with the selected provider.',
    action: 'Please try again or use a different sign-in method.',
  },
  OAuthCallback: {
    title: 'OAuth Callback Error',
    description: 'An error occurred while processing the authentication response.',
    action: 'Please try signing in again.',
  },
  OAuthCreateAccount: {
    title: 'Account Creation Error',
    description: 'Unable to create an account with the selected provider.',
    action: 'The email address might already be registered. Try signing in instead.',
  },
  EmailCreateAccount: {
    title: 'Email Registration Error',
    description: 'Unable to create an account with the provided email.',
    action: 'The email address might already be registered. Try signing in instead.',
  },
  Callback: {
    title: 'Callback Error',
    description: 'An error occurred during the authentication callback.',
    action: 'Please try signing in again.',
  },
  OAuthAccountNotLinked: {
    title: 'Account Linking Error',
    description: 'This account is already linked to a different authentication method.',
    action: 'Please sign in using your original method or contact support.',
  },
  SessionRequired: {
    title: 'Session Required',
    description: 'You need to be signed in to access this page.',
    action: 'Please sign in to continue.',
  },
};

export function AuthErrorClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get('error') || 'Default';

  const errorInfo = ERROR_MESSAGES[error] || ERROR_MESSAGES.Default;

  return (
    <div className="w-full max-w-md text-center space-y-6">
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-red-800 mb-2">{errorInfo.title}</h1>
        <p className="text-red-600 mb-4">{errorInfo.description}</p>

        {errorInfo.action && (
          <p className="text-sm text-red-700 bg-red-100 p-3 rounded">
            {errorInfo.action}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <Button
          onClick={() => router.push('/auth/signin')}
          className="w-full"
        >
          Try Signing In Again
        </Button>

        <Button
          onClick={() => router.push('/auth/signup')}
          variant="secondary"
          className="w-full"
        >
          Create New Account
        </Button>

        <Button
          onClick={() => router.push('/')}
          variant="outline"
          className="w-full"
        >
          Return to Home
        </Button>
      </div>

      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-6 p-3 bg-gray-100 rounded text-left">
          <p className="text-xs font-mono text-gray-600">
            Debug: Error code &quot;{error}&quot;
          </p>
        </div>
      )}
    </div>
  );
}