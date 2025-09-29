/**
 * Terms of Service page
 */

import { Metadata } from 'next';
import { TermsOfService } from '@/components/layout/TermsOfService';

export const metadata: Metadata = {
  title: 'Terms of Service | Gundam Card Game',
  description: 'Terms of service and usage guidelines for the Gundam Card Game website',
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <TermsOfService variant="page" className="mb-8" />
      </div>
    </div>
  );
}