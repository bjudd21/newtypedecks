// Cards page - Main card database and search interface
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Skeleton } from '@/components/ui';
import { PageLayout } from '@/components/layout';

export default function CardsPage() {
  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Card Database</h1>
        <p className="text-gray-600">
          Search and browse the complete Gundam Card Game database
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Search and Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Search & Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton lines={3} />}>
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">
                    Search and filter functionality will be implemented here.
                  </p>
                  <Skeleton lines={5} />
                </div>
              </Suspense>
            </CardContent>
          </Card>
        </div>

        {/* Cards Grid */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Cards</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton lines={8} />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <Skeleton className="h-32 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4 mb-1" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))}
                </div>
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
