import { Suspense } from 'react';
import { ProxiesPageContent } from './ProxiesPageClient';

export const metadata = {
  title: 'Proxy Generator',
  description: 'Build a print-ready PDF proxy sheet for your TCG cards.',
};

export default function ProxiesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-[#1a1625] via-[#2a1f3d] to-[#1a1625]" />
      }
    >
      <ProxiesPageContent />
    </Suspense>
  );
}
