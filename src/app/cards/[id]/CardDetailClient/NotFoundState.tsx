import React from 'react';
import Link from 'next/link';
import { Card, CardContent, Button } from '@/components/ui';

export function NotFoundState() {
  return (
    <div className="mx-auto max-w-4xl">
      <Card className="border-gray-700 bg-gray-800">
        <CardContent className="py-8">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-white">
              Card Not Found
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              The requested card could not be found.
            </p>
            <div className="mt-4">
              <Link href="/cards">
                <Button variant="cyber">Back to Card Database</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
