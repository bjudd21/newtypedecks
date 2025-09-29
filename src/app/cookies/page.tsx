/**
 * Cookie Policy page
 */

import { Metadata } from 'next';
import { CookieNotice } from '@/components/layout/CookieNotice';

export const metadata: Metadata = {
  title: 'Cookie Policy | Gundam Card Game',
  description: 'Cookie policy and usage information for the Gundam Card Game website',
  robots: {
    index: true,
    follow: true,
  },
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <CookieNotice variant="page" className="mb-8" />
      </div>
    </div>
  );
}