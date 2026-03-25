// Cards page - Main card database and search interface
import { Suspense } from 'react';
import { NewCardsPageClient } from './NewCardsPageClient';

export default function CardsPage() {
  return (
    <div className="min-h-[calc(100vh-57px)]">
      {/* Hero placeholder — game art slots in here later */}
      <div
        className="hero-placeholder relative h-20 overflow-hidden"
        aria-hidden="true"
      >
        <div className="to-background absolute inset-0 bg-gradient-to-b from-transparent" />
      </div>
      <div className="container mx-auto px-4 pb-8">
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
      <div className="border-border bg-card animate-pulse rounded-lg border p-4">
        <div className="bg-background h-10 rounded" />
      </div>

      {/* Filters skeleton */}
      <div className="border-border bg-card animate-pulse rounded-lg border p-4">
        <div className="bg-background h-8 w-1/3 rounded" />
      </div>

      {/* Results skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5">
        {Array.from({ length: 20 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="border-border bg-card aspect-[5/7] rounded-lg border-2" />
            <div className="bg-card mx-auto mt-2 h-3 w-3/4 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
