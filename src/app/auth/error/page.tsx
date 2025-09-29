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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={
        <div className="w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      }>
        <AuthErrorClient />
      </Suspense>
    </div>
  );
}