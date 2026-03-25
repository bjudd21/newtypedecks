/**
 * Cookie Policy page
 */

import { Metadata } from 'next';
import { CookieNotice } from '@/components/layout/CookieNotice';

export const metadata: Metadata = {
  title: 'Cookie Policy | Newtype Decks',
  description:
    'Cookie policy and usage information for the Newtype Decks platform',
  robots: {
    index: true,
    follow: true,
  },
};

export default function CookiesPage() {
  return (
    <div className="bg-accent min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <CookieNotice variant="page" className="mb-8" />
      </div>
    </div>
  );
}
