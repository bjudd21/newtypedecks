import React from 'react';
import Link from 'next/link';
import { Card, CardContent, Button } from '@/components/ui';

export function ErrorState({ error }: { error: string }) {
  return (
    <div className="mx-auto max-w-4xl">
      <Card className="border-red-800 bg-red-900/20">
        <CardContent className="py-8">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-red-300">
              Error Loading Card
            </h3>
            <p className="mt-1 text-sm text-red-400">{error}</p>
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
