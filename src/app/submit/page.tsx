'use client';

/**
 * Public card submission page - Task 2.9
 * Allows users to submit cards for admin review
 */

import { Suspense } from 'react';
import { Card, CardContent } from '@/components/ui';
import { CardUploadForm } from '@/components/forms/CardUploadForm';

export default function SubmitPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit a Card</h1>
        <p className="text-gray-600">
          Help expand the database by submitting new cards, previews, or leak information.
          All submissions are reviewed by administrators before being published.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Submission Guidelines</h2>
            <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
              <li>Provide accurate card information from official sources</li>
              <li>Upload high-quality images (JPEG, PNG, WebP up to 10MB)</li>
              <li>Mark cards appropriately as previews or leaks if unconfirmed</li>
              <li>Include source information for leak submissions</li>
              <li>All submissions undergo admin review before publication</li>
            </ul>
          </div>

          <Suspense fallback={
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading submission form...</p>
            </div>
          }>
            <CardUploadForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}