/**
 * Email verification client component
 * Handles URL parameters and verifies email token
 */

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export function EmailVerificationClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Invalid verification link. The verification token is missing.');
      setIsLoading(false);
      return;
    }

    verifyEmail(token);
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: verificationToken }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
      } else {
        setError(data.error || 'Verification failed');
      }
    } catch (error) {
      console.error('Email verification error:', error);
      setError('An unexpected error occurred during verification.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-md text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <h1 className="text-2xl font-bold text-gray-900">Verifying Email...</h1>
        <p className="text-gray-600">Please wait while we verify your email address.</p>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="w-full max-w-md text-center space-y-4">
        <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-green-800 mb-2">Email Verified!</h1>
          <p className="text-green-600 mb-4">
            Your email address has been successfully verified. You now have access to all features.
          </p>
        </div>
        <div className="space-y-2">
          <Button
            onClick={() => router.push('/dashboard')}
            className="w-full"
          >
            Go to Dashboard
          </Button>
          <Button
            onClick={() => router.push('/decks')}
            variant="secondary"
            className="w-full"
          >
            Start Building Decks
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md text-center space-y-4">
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-red-800 mb-2">Verification Failed</h1>
          <p className="text-red-600 mb-4">{error}</p>
        </div>
        <div className="space-y-2">
          <Button
            onClick={() => router.push('/auth/signin')}
            className="w-full"
          >
            Sign In
          </Button>
          <Button
            onClick={() => router.push('/auth/signup')}
            variant="secondary"
            className="w-full"
          >
            Create Account
          </Button>
        </div>
      </div>
    );
  }

  return null;
}