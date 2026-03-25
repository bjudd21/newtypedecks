import React from 'react';
import { Card, CardContent, Button } from '@/components/ui';

interface NoResultsStateProps {
  onClearFilters: () => void;
}

export function NoResultsState({ onClearFilters }: NoResultsStateProps) {
  return (
    <Card className="border-border">
      <CardContent className="py-8">
        <div className="text-center">
          <svg
            className="text-muted-foreground mx-auto h-12 w-12"
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
          <h3 className="text-foreground mt-2 text-sm font-medium">
            No cards found
          </h3>
          <p className="text-muted-foreground/70 mt-1 text-sm">
            Try adjusting your search terms or filters.
          </p>
          <div className="mt-4">
            <Button onClick={onClearFilters} variant="outline" size="sm">
              Clear Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
