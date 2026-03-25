/**
 * Email verification page
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import { EmailVerificationClient } from './EmailVerificationClient';

export const metadata: Metadata = {
  title: 'Verify Email | Newtype Decks',
  description: 'Verify your email address for Newtype Decks',
};

export default function VerifyEmailPage() {
  return (
    <div className="bg-accent flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="w-full max-w-md text-center">
            <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-b-2"></div>
            <p className="text-muted-foreground mt-2">
              Verifying your email...
            </p>
          </div>
        }
      >
        <EmailVerificationClient />
      </Suspense>
    </div>
  );
}
