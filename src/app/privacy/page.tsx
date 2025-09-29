/**
 * Privacy Policy page
 */

import { Metadata } from 'next';
import { PrivacyNotice } from '@/components/layout/PrivacyNotice';

export const metadata: Metadata = {
  title: 'Privacy Policy | Gundam Card Game',
  description: 'Privacy policy and data handling practices for the Gundam Card Game website',
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <PrivacyNotice variant="page" className="mb-8" />
      </div>
    </div>
  );
}