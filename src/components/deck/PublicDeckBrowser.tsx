'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Rarity } from '@prisma/client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Select,
  Badge,
} from '@/components/ui';

interface PublicDeck {
  id: string;
  name: string;
  description?: string;
  format: string;
  createdAt: string;
  updatedAt: string;
  author: {
    name: string;
  };
  statistics: {
    totalCards: number;
    uniqueCards: number;
    totalCost: number;
    averageCost: number;
    colors: string[];
  };
  cardPreview: Array<{
    card: {
      id: string;
      name: string;
      imageUrl?: string;
      rarity: Rarity;
    };
    quantity: number;
  }>;
}

interface PublicDeckBrowserProps {
  className?: string;
}

export const PublicDeckBrowser: React.FC<PublicDeckBrowserProps> = ({
  className,
}) => {
  const router = useRouter();
  const [decks, setDecks] = useState<PublicDeck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  const [filters, setFilters] = useState({
    search: '',
    sortBy: 'updatedAt',
    sortOrder: 'desc',
  });

  const loadPublicDecks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...filters,
      });

      const response = await fetch(`/api/decks/public?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to load public decks');
        return;
      }

      setDecks(data.decks);
      setPagination((prev) => ({ ...prev, ...data.pagination }));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load public decks';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  useEffect(() => {
    loadPublicDecks();
  }, [loadPublicDecks]);

  const handleFilterChange = useCallback((field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to page 1
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  }, []);

  const handleViewDeck = useCallback(
    (deckId: string) => {
      router.push(`/decks/${deckId}`);
    },
    [router]
  );

  const handleCopyDeck = useCallback(
    async (deck: PublicDeck) => {
      try {
        // First get the full deck details
        const response = await fetch(`/api/decks/${deck.id}`);
        const fullDeck = await response.json();

        if (!response.ok) {
          // TODO: Replace with proper UI notification component
          console.warn('Failed to load deck details');
          return;
        }

        // Store deck data in localStorage for the deck builder to pick up
        const deckData = {
          name: `${deck.name} (Copy)`,
          description: deck.description || '',
          format: deck.format,
          cards: fullDeck.cards || [],
        };

        localStorage.setItem('importDeck', JSON.stringify(deckData));

        // Navigate to deck builder
        router.push('/decks/builder?import=true');
      } catch (error) {
        console.error('Error copying deck:', error);
        console.warn(
          'TODO: Replace with proper UI notification - Failed to copy deck'
        );
      }
    },
    [router]
  );

  return (
    <div className={className}>
      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Browse Community Decks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Search
              </label>
              <Input
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search decks..."
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Sort By
              </label>
              <Select
                value={filters.sortBy}
                onChange={(value: string) =>
                  handleFilterChange('sortBy', value)
                }
                options={[
                  { value: 'updatedAt', label: 'Recently Updated' },
                  { value: 'createdAt', label: 'Recently Created' },
                  { value: 'name', label: 'Name' },
                ]}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Order
              </label>
              <Select
                value={filters.sortOrder}
                onChange={(value: string) =>
                  handleFilterChange('sortOrder', value)
                }
                options={[
                  { value: 'desc', label: 'Descending' },
                  { value: 'asc', label: 'Ascending' },
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <div className="mb-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading community decks...</p>
        </div>
      )}

      {/* Deck Grid */}
      {!isLoading && (
        <>
          {decks.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="mb-4 text-gray-600">No public decks found.</p>
                <p className="text-sm text-gray-500">
                  Try adjusting your search filters or check back later.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {decks.map((deck) => (
                <Card
                  key={deck.id}
                  className="transition-shadow hover:shadow-lg"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{deck.name}</CardTitle>
                        <p className="text-sm text-gray-600">
                          by {deck.author.name}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {deck.format}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {deck.description && (
                      <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                        {deck.description}
                      </p>
                    )}

                    {/* Deck Statistics */}
                    <div className="mb-4 grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="font-semibold text-blue-600">
                          {deck.statistics.totalCards}
                        </div>
                        <div className="text-xs text-gray-600">Cards</div>
                      </div>
                      <div>
                        <div className="font-semibold text-green-600">
                          {deck.statistics.uniqueCards}
                        </div>
                        <div className="text-xs text-gray-600">Unique</div>
                      </div>
                      <div>
                        <div className="font-semibold text-purple-600">
                          {deck.statistics.averageCost}
                        </div>
                        <div className="text-xs text-gray-600">Avg Cost</div>
                      </div>
                    </div>

                    {/* Color Identity */}
                    {deck.statistics.colors.length > 0 && (
                      <div className="mb-4">
                        <p className="mb-1 text-xs text-gray-600">Factions:</p>
                        <div className="flex flex-wrap gap-1">
                          {deck.statistics.colors.map((color) => (
                            <Badge
                              key={color}
                              variant="outline"
                              className="text-xs"
                            >
                              {color}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Card Preview */}
                    {deck.cardPreview.length > 0 && (
                      <div className="mb-4">
                        <p className="mb-2 text-xs text-gray-600">Preview:</p>
                        <div className="flex space-x-1 overflow-x-auto">
                          {deck.cardPreview.map((cardEntry, index) => (
                            <div key={index} className="flex-shrink-0">
                              {cardEntry.card.imageUrl ? (
                                <Image
                                  src={cardEntry.card.imageUrl}
                                  alt={cardEntry.card.name}
                                  width={48}
                                  height={64}
                                  className="h-16 w-12 rounded border object-cover"
                                />
                              ) : (
                                <div className="flex h-16 w-12 items-center justify-center rounded border bg-gray-200">
                                  <span className="text-xs text-gray-500">
                                    {cardEntry.quantity}x
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleViewDeck(deck.id)}
                        className="flex-1"
                      >
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyDeck(deck)}
                        className="flex-1"
                      >
                        Copy
                      </Button>
                    </div>

                    {/* Metadata */}
                    <div className="mt-3 text-center text-xs text-gray-500">
                      Updated {new Date(deck.updatedAt).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-8 flex items-center justify-center space-x-4">
              <Button
                variant="outline"
                disabled={pagination.page <= 1}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.pages}
              </span>
              <Button
                variant="outline"
                disabled={pagination.page >= pagination.pages}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PublicDeckBrowser;
