// Cards page - Main card database and search interface
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui';
import { PageLayout } from '@/components/layout';
import { CardsPageClient } from './CardsPageClient';

export default function CardsPage() {
  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Card Database</h1>
        <p className="text-gray-600">
          Search and browse the complete Gundam Card Game database
        </p>
      </div>

      <Suspense fallback={<CardsPageSkeleton />}>
        <CardsPageClient />
      </Suspense>
    </PageLayout>
  );
}

function CardsPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Search skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-8 w-32" />
      </div>

      {/* Results skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="border rounded-lg p-4">
            <Skeleton className="h-32 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-1" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
