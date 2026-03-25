'use client';

import React, { useMemo } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui';
import { RulingsFilterControls } from './RulingsFilterControls';
import { RulingItem } from './RulingItem';

export function RulingsSection({
  rulings,
  filter,
  search,
  onFilterChange,
  onSearchChange,
}: {
  rulings: Array<{
    id: string;
    question: string;
    answer: string;
    source: string | null;
    isOfficial: boolean;
    updatedAt: Date;
  }>;
  filter: 'all' | 'official' | 'community';
  search: string;
  onFilterChange: (value: 'all' | 'official' | 'community') => void;
  onSearchChange: (value: string) => void;
}) {
  const filteredRulings = useMemo(() => {
    let filtered = rulings;

    if (filter === 'official') {
      filtered = filtered.filter((ruling) => ruling.isOfficial);
    } else if (filter === 'community') {
      filtered = filtered.filter((ruling) => !ruling.isOfficial);
    }

    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (ruling) =>
          ruling.question.toLowerCase().includes(searchLower) ||
          ruling.answer.toLowerCase().includes(searchLower) ||
          (ruling.source && ruling.source.toLowerCase().includes(searchLower))
      );
    }

    return filtered;
  }, [rulings, filter, search]);

  return (
    <Card className="border-gray-700 bg-gray-800">
      <CardHeader>
        <RulingsFilterControls
          filter={filter}
          search={search}
          onFilterChange={onFilterChange}
          onSearchChange={onSearchChange}
          totalCount={rulings.length}
          filteredCount={filteredRulings.length}
        />
      </CardHeader>
      <CardContent>
        {filteredRulings.length > 0 ? (
          <div className="space-y-4">
            {filteredRulings.map((ruling) => (
              <RulingItem key={ruling.id} ruling={ruling} />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
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
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-white">
              No rulings found
            </h3>
            <p className="text-muted-foreground mt-1 text-sm">
              {search || filter !== 'all'
                ? 'Try adjusting your filters.'
                : 'No rulings available for this card.'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
