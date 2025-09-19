// Decks page - Deck building and management interface
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Skeleton } from '@/components/ui';
import { PageLayout } from '@/components/layout';

export default function DecksPage() {
  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Deck Builder</h1>
        <p className="text-gray-600">
          Build, manage, and share your Gundam Card Game decks
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deck List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>My Decks</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton lines={4} />}>
                <div className="space-y-3">
                  <p className="text-sm text-gray-500">
                    Your saved decks will appear here.
                  </p>
                  <Skeleton lines={3} />
                </div>
              </Suspense>
            </CardContent>
          </Card>
        </div>

        {/* Deck Builder */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Deck Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton lines={8} />}>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Card Search */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search Cards
                      </label>
                      <Skeleton className="h-10 w-full" />
                    </div>
                    
                    {/* Deck Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deck Name
                      </label>
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>

                  {/* Deck Contents */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deck Contents
                    </label>
                    <div className="border rounded-lg p-4 min-h-64">
                      <Skeleton lines={6} />
                    </div>
                  </div>

                  {/* Deck Statistics */}
                  <div className="grid grid-cols-3 gap-4">
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
                      <p className="text-sm text-gray-600">Deck Cost</p>
                    </div>
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
