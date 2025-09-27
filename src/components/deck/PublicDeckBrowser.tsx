'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Select, Badge } from '@/components/ui';

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
      rarity: any;
    };
    quantity: number;
  }>;
}

interface PublicDeckBrowserProps {
  className?: string;
}

export const PublicDeckBrowser: React.FC<PublicDeckBrowserProps> = ({ className }) => {
  const router = useRouter();
  const [decks, setDecks] = useState<PublicDeck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  const [filters, setFilters] = useState({
    search: '',
    format: '',
    sortBy: 'updatedAt',
    sortOrder: 'desc'
  });

  const loadPublicDecks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...filters
      });

      const response = await fetch(`/api/decks/public?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to load public decks');
        return;
      }

      setDecks(data.decks);
      setPagination(prev => ({ ...prev, ...data.pagination }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load public decks';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  useEffect(() => {
    loadPublicDecks();
  }, [loadPublicDecks]);

  const handleFilterChange = useCallback((field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  }, []);

  const handleViewDeck = useCallback((deckId: string) => {
    router.push(`/decks/${deckId}`);
  }, [router]);

  const handleCopyDeck = useCallback(async (deck: PublicDeck) => {
    try {
      // First get the full deck details
      const response = await fetch(`/api/decks/${deck.id}`);
      const fullDeck = await response.json();

      if (!response.ok) {
        alert('Failed to load deck details');
        return;
      }

      // Store deck data in localStorage for the deck builder to pick up
      const deckData = {
        name: `${deck.name} (Copy)`,
        description: deck.description || '',
        format: deck.format,
        cards: fullDeck.cards || []
      };

      localStorage.setItem('importDeck', JSON.stringify(deckData));

      // Navigate to deck builder
      router.push('/decks/builder?import=true');
    } catch (error) {
      console.error('Error copying deck:', error);
      alert('Failed to copy deck');
    }
  }, [router]);

  return (
    <div className={className}>
      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Browse Community Decks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <Input
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search decks..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Format
              </label>
              <Select
                value={filters.format}
                onValueChange={(value) => handleFilterChange('format', value)}
              >
                <option value="">All Formats</option>
                <option value="Standard">Standard</option>
                <option value="Advanced">Advanced</option>
                <option value="Casual">Casual</option>
                <option value="Custom">Custom</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <Select
                value={filters.sortBy}
                onValueChange={(value) => handleFilterChange('sortBy', value)}
              >
                <option value="updatedAt">Recently Updated</option>
                <option value="createdAt">Recently Created</option>
                <option value="name">Name</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order
              </label>
              <Select
                value={filters.sortOrder}
                onValueChange={(value) => handleFilterChange('sortOrder', value)}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading community decks...</p>
        </div>
      )}

      {/* Deck Grid */}
      {!isLoading && (
        <>
          {decks.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-600 mb-4">No public decks found.</p>
                <p className="text-sm text-gray-500">
                  Try adjusting your search filters or check back later.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {decks.map((deck) => (
                <Card key={deck.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{deck.name}</CardTitle>
                        <p className="text-sm text-gray-600">by {deck.author.name}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {deck.format}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {deck.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {deck.description}
                      </p>
                    )}

                    {/* Deck Statistics */}
                    <div className="grid grid-cols-3 gap-2 text-center mb-4">
                      <div>
                        <div className="font-semibold text-blue-600">{deck.statistics.totalCards}</div>
                        <div className="text-xs text-gray-600">Cards</div>
                      </div>
                      <div>
                        <div className="font-semibold text-green-600">{deck.statistics.uniqueCards}</div>
                        <div className="text-xs text-gray-600">Unique</div>
                      </div>
                      <div>
                        <div className="font-semibold text-purple-600">{deck.statistics.averageCost}</div>
                        <div className="text-xs text-gray-600">Avg Cost</div>
                      </div>
                    </div>

                    {/* Color Identity */}
                    {deck.statistics.colors.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-600 mb-1">Factions:</p>
                        <div className="flex flex-wrap gap-1">
                          {deck.statistics.colors.map((color) => (
                            <Badge key={color} variant="outline" className="text-xs">
                              {color}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Card Preview */}
                    {deck.cardPreview.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-600 mb-2">Preview:</p>
                        <div className="flex space-x-1 overflow-x-auto">
                          {deck.cardPreview.map((cardEntry, index) => (
                            <div key={index} className="flex-shrink-0">
                              {cardEntry.card.imageUrl ? (
                                <img
                                  src={cardEntry.card.imageUrl}
                                  alt={cardEntry.card.name}
                                  className="w-12 h-16 object-cover rounded border"
                                />
                              ) : (
                                <div className="w-12 h-16 bg-gray-200 rounded border flex items-center justify-center">
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
                        variant="primary"
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
                    <div className="text-xs text-gray-500 mt-3 text-center">
                      Updated {new Date(deck.updatedAt).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-8">
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