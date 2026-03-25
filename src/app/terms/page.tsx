/**
 * Terms of Service page
 */

import { Metadata } from 'next';
import { TermsOfService } from '@/components/layout/TermsOfService';

export const metadata: Metadata = {
  title: 'Terms of Service | Newtype Decks',
  description:
    'Terms of service and usage guidelines for the Newtype Decks platform',
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <div className="bg-accent min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <TermsOfService variant="page" className="mb-8" />
      </div>
    </div>
  );
}
