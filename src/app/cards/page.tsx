// Cards page - Main card database and search interface
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui';
import { NewCardsPageClient } from './NewCardsPageClient';

export default function CardsPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<CardsPageSkeleton />}>
          <NewCardsPageClient />
        </Suspense>
      </div>
    </div>
  );
}

function CardsPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Search skeleton */}
      <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 animate-pulse">
        <div className="h-10 bg-gray-700 rounded" />
      </div>

      {/* Filters skeleton */}
      <div className="p-4 bg-gray-800 rounded-lg border border-gray-700 animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-1/3" />
      </div>

      {/* Results skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 20 }).map((_, index) => (
          <div key={index} className="bg-gray-800 rounded-lg overflow-hidden animate-pulse border border-gray-600">
            <div className="aspect-[5/7] bg-gray-700" />
            <div className="p-3">
              <div className="h-4 bg-gray-700 rounded mb-2" />
              <div className="h-3 bg-gray-700 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
