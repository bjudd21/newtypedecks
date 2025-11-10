/**
 * Email verification banner component
 * Displays verification status and allows resending verification email
 */

'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';

export function EmailVerificationBanner() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isDismissed, setIsDismissed] = useState(false);

  // Don't show if not authenticated or email is verified
  if (
    status !== 'authenticated' ||
    session?.user?.emailVerified ||
    isDismissed
  ) {
    return null;
  }

  const handleResendVerification = async () => {
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Verification email sent successfully!');
      } else {
        setError(data.error || 'Failed to send verification email');
      }
    } catch (error) {
      console.error('Send verification error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-yellow-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            Email Verification Required
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              Please verify your email address to access all features. Check
              your inbox for a verification email.
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              onClick={handleResendVerification}
              isLoading={isLoading}
              disabled={isLoading}
              size="sm"
              variant="secondary"
            >
              {isLoading ? 'Sending...' : 'Resend Verification Email'}
            </Button>
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="text-sm text-yellow-800 underline hover:text-yellow-900"
            >
              Dismiss
            </button>
          </div>
          {message && (
            <div className="mt-2 text-sm text-green-600">{message}</div>
          )}
          {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
        </div>
      </div>
    </div>
  );
}
