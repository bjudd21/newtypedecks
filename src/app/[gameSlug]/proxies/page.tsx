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
        <div className="bg-background min-h-[calc(100vh-57px)] animate-pulse" />
      }
    >
      <ProxiesPageContent />
    </Suspense>
  );
}
