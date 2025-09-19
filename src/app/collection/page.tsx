// Collection page - Personal collection management interface
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Skeleton } from '@/components/ui';
import { PageLayout } from '@/components/layout';

export default function CollectionPage() {
  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Collection</h1>
        <p className="text-gray-600">
          Track and manage your personal Gundam Card Game collection
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Collection Statistics */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Collection Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton lines={4} />}>
                <div className="space-y-4">
                  <div className="text-center">
                    <Skeleton className="h-8 w-16 mx-auto mb-1" />
                    <p className="text-sm text-gray-600">Total Cards</p>
                  </div>
                  <div className="text-center">
                    <Skeleton className="h-8 w-16 mx-auto mb-1" />
                    <p className="text-sm text-gray-600">Unique Cards</p>
                  </div>
                  <div className="text-center">
                    <Skeleton className="h-8 w-16 mx-auto mb-1" />
                    <p className="text-sm text-gray-600">Completion %</p>
                  </div>
                </div>
              </Suspense>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton lines={3} />}>
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </Suspense>
            </CardContent>
          </Card>
        </div>

        {/* Collection Contents */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton lines={8} />}>
                <div className="space-y-4">
                  {/* Search and Filter */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                  </div>

                  {/* Collection Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 12 }).map((_, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <Skeleton className="h-32 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4 mb-1" />
                        <div className="flex justify-between items-center">
                          <Skeleton className="h-3 w-1/2" />
                          <Skeleton className="h-6 w-8" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
