// Individual deck detail page
import { Suspense } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@/components/ui';
import { PageLayout } from '@/components/layout';

interface DeckDetailPageProps {
  params: {
    id: string;
  };
}

export default function DeckDetailPage({
  params: _params,
}: DeckDetailPageProps) {
  return (
    <PageLayout>
      <div className="mx-auto max-w-6xl">
        <Suspense fallback={<Skeleton lines={2} />}>
          <div className="mb-6">
            <Skeleton className="mb-2 h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
        </Suspense>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Deck Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Deck Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Skeleton lines={6} />}>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <Skeleton className="mt-1 h-4 w-48" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Creator
                      </label>
                      <Skeleton className="mt-1 h-4 w-32" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Created
                      </label>
                      <Skeleton className="mt-1 h-4 w-24" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <Skeleton className="mt-1 h-16 w-full" />
                    </div>
                  </div>
                </Suspense>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Skeleton lines={4} />}>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Cards</span>
                      <Skeleton className="h-4 w-8" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Unique Cards
                      </span>
                      <Skeleton className="h-4 w-8" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Average Cost
                      </span>
                      <Skeleton className="h-4 w-8" />
                    </div>
                  </div>
                </Suspense>
              </CardContent>
            </Card>
          </div>

          {/* Deck Contents */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Deck Contents</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Skeleton lines={8} />}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {Array.from({ length: 8 }).map((_, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 rounded-lg border p-3"
                        >
                          <Skeleton className="h-12 w-12 rounded" />
                          <div className="flex-1">
                            <Skeleton className="mb-1 h-4 w-32" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                          <Skeleton className="h-6 w-8" />
                        </div>
                      ))}
                    </div>
                  </div>
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
