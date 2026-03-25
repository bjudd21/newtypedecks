/**
 * Reset password page
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import { ResetPasswordClient } from './ResetPasswordClient';

export const metadata: Metadata = {
  title: 'Reset Password | Newtype Decks',
  description: 'Set a new password for your Newtype Decks account',
};

export default function ResetPasswordPage() {
  return (
    <div className="bg-accent flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="w-full max-w-md text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="text-muted-foreground mt-2">Loading...</p>
          </div>
        }
      >
        <ResetPasswordClient />
      </Suspense>
    </div>
  );
}
