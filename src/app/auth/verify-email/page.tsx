/**
 * Email verification page
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import { EmailVerificationClient } from './EmailVerificationClient';

export const metadata: Metadata = {
  title: 'Verify Email | Gundam Card Game',
  description: 'Verify your email address for Gundam Card Game',
};

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="w-full max-w-md text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Verifying your email...</p>
          </div>
        }
      >
        <EmailVerificationClient />
      </Suspense>
    </div>
  );
}
