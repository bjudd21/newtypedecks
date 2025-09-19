// Individual card detail page
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Skeleton } from '@/components/ui';
import { PageLayout } from '@/components/layout';

interface CardDetailPageProps {
  params: {
    id: string;
  };
}

export default function CardDetailPage({ params: _params }: CardDetailPageProps) {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto">
        <Suspense fallback={<Skeleton lines={2} />}>
          <div className="mb-6">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card Image */}
          <div>
            <Card>
              <CardContent className="p-6">
                <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                  <div className="aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Card Image</p>
                  </div>
                </Suspense>
              </CardContent>
            </Card>
          </div>

          {/* Card Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Card Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Skeleton lines={6} />}>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Name</label>
                      <Skeleton className="h-4 w-48 mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Type</label>
                      <Skeleton className="h-4 w-32 mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Rarity</label>
                      <Skeleton className="h-4 w-24 mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Set</label>
                      <Skeleton className="h-4 w-40 mt-1" />
                    </div>
                  </div>
                </Suspense>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Skeleton lines={4} />}>
                  <p className="text-gray-600">
                    Card description and abilities will be displayed here.
                  </p>
                </Suspense>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rulings</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Skeleton lines={3} />}>
                  <p className="text-gray-600">
                    Official rulings and clarifications will be shown here.
                  </p>
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
