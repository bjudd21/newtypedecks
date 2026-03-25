import React from 'react';
import { Card, CardHeader, CardContent, Skeleton } from '@/components/ui';

export function CardDetailSkeleton() {
  return (
    <div className="mx-auto max-w-6xl">
      {/* Breadcrumb skeleton */}
      <div className="mb-6">
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Header skeleton */}
      <div className="mb-8">
        <Skeleton className="mb-2 h-10 w-96" />
        <Skeleton className="mb-1 h-6 w-80" />
        <Skeleton className="h-5 w-72" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Image skeleton */}
        <div>
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <Skeleton className="mx-auto aspect-[3/4] w-full max-w-md" />
            </CardContent>
          </Card>
        </div>

        {/* Details skeleton */}
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="border-border bg-card">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
