import React from 'react';
import { Card, CardContent, Button } from '@/components/ui';

interface WelcomeMessageProps {
  onBrowseAll: () => void;
}

export function WelcomeMessage({ onBrowseAll }: WelcomeMessageProps) {
  return (
    <Card className="border-gray-200">
      <CardContent className="py-8">
        <div className="text-center">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Welcome to the Card Database
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
            Use the search bar above to find specific cards, or use the advanced
            filters to browse cards by faction, series, level, and more.
          </p>
          <div className="mt-4">
            <Button onClick={onBrowseAll} variant="default" className="mx-auto">
              Browse All Cards
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
