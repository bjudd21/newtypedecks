/**
 * Authentication error page
 * Displays OAuth and authentication errors with helpful messages
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthErrorClient } from './AuthErrorClient';

export const metadata: Metadata = {
  title: 'Authentication Error | Gundam Card Game',
  description: 'Authentication error page',
};

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="w-full max-w-md text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-red-600"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        }
      >
        <AuthErrorClient />
      </Suspense>
    </div>
  );
}
