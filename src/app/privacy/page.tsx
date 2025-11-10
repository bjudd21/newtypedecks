/**
 * Privacy Policy page
 */

import { Metadata } from 'next';
import { PrivacyNotice } from '@/components/layout/PrivacyNotice';

export const metadata: Metadata = {
  title: 'Privacy Policy | Gundam Card Game',
  description:
    'Privacy policy and data handling practices for the Gundam Card Game website',
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <PrivacyNotice variant="page" className="mb-8" />
      </div>
    </div>
  );
}
