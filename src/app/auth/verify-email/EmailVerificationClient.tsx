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
      <div className="w-full max-w-md space-y-4 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
        <h1 className="text-2xl font-bold text-gray-900">Verifying Email...</h1>
        <p className="text-gray-600">
          Please wait while we verify your email address.
        </p>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="w-full max-w-md space-y-4 text-center">
        <div className="rounded-lg border border-green-200 bg-green-50 p-6">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-6 w-6 text-green-600"
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
          <h1 className="mb-2 text-2xl font-bold text-green-800">
            Email Verified!
          </h1>
          <p className="mb-4 text-green-600">
            Your email address has been successfully verified. You now have
            access to all features.
          </p>
        </div>
        <div className="space-y-2">
          <Button onClick={() => router.push('/dashboard')} className="w-full">
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
      <div className="w-full max-w-md space-y-4 text-center">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
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
          <h1 className="mb-2 text-2xl font-bold text-red-800">
            Verification Failed
          </h1>
          <p className="mb-4 text-red-600">{error}</p>
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
