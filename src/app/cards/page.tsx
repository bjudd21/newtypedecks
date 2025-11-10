// Cards page - Main card database and search interface
import { Suspense } from 'react';
import { NewCardsPageClient } from './NewCardsPageClient';

export default function CardsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1625] via-[#2a1f3d] to-[#1a1625]">
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
      <div className="p-4 bg-[#2d2640] rounded-lg border border-[#443a5c] animate-pulse">
        <div className="h-10 bg-[#1a1625] rounded" />
      </div>

      {/* Filters skeleton */}
      <div className="p-4 bg-[#2d2640] rounded-lg border border-[#443a5c] animate-pulse">
        <div className="h-8 bg-[#1a1625] rounded w-1/3" />
      </div>

      {/* Results skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {Array.from({ length: 20 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="aspect-[5/7] bg-[#2d2640] rounded-lg border-2 border-[#443a5c]" />
            <div className="mt-2 h-3 bg-[#2d2640] rounded w-3/4 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
