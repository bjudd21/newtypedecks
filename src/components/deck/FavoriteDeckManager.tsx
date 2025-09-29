'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge } from '@/components/ui';
import { formatDistanceToNow } from 'date-fns';

interface FavoriteDeck {
  id: string;
  favoritedAt: string;
  deck: {
    id: string;
    name: string;
    description?: string;
    isPublic: boolean;
    isTemplate: boolean;
    templateSource?: string;
    creator: {
      id: string;
      name?: string;
      image?: string;
    };
    cardCount: number;
    uniqueCards: number;
    totalCost: number;
    colors: string[];
    favoriteCount: number;
    usageCount: number;
    createdAt: string;
    updatedAt: string;
  };
}

interface FavoriteDeckManagerProps {
  onDeckSelect?: (deckId: string) => void;
  onRemoveFavorite?: (deckId: string) => void;
  className?: string;
}

export const FavoriteDeckManager: React.FC<FavoriteDeckManagerProps> = ({
  onDeckSelect,
  onRemoveFavorite,
  className
}) => {
  const [favorites, setFavorites] = useState<FavoriteDeck[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Fetch user's favorite decks
  const fetchFavorites = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12'
      });

      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }

      const response = await fetch(`/api/favorites?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch favorite decks');
      }

      const data = await response.json();
      setFavorites(data.favorites || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError(err instanceof Error ? err.message : 'Failed to load favorite decks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [currentPage, searchQuery]);

  // Handle removing favorite
  const handleRemoveFavorite = async (deckId: string) => {
    if (!confirm('Remove this deck from your favorites?')) {
      return;
    }

    try {
      setRemovingId(deckId);

      const response = await fetch(`/api/favorites/${deckId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove favorite');
      }

      // Remove from local state
      setFavorites(prevFavorites =>
        prevFavorites.filter(fav => fav.deck.id !== deckId)
      );

      if (onRemoveFavorite) {
        onRemoveFavorite(deckId);
      }
    } catch (err) {
      console.error('Error removing favorite:', err);
      alert(err instanceof Error ? err.message : 'Failed to remove favorite');
    } finally {
      setRemovingId(null);
    }
  };

  // Handle deck selection
  const handleDeckClick = (deckId: string) => {
    if (onDeckSelect) {
      onDeckSelect(deckId);
    }
  };

  const getSourceBadgeColor = (source?: string) => {
    switch (source) {
      case 'Official':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Community':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Tournament':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  if (isLoading && favorites.length === 0) {
    return (
      <div className={className}>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-gray-600">Loading favorite decks...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ♥ Favorite Decks
            <Badge variant="secondary">{favorites.length}</Badge>
          </CardTitle>
          <div className="text-sm text-gray-600">
            Manage your collection of favorite decks from the community
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-6">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your favorite decks..."
              className="w-full"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          {/* Favorites List */}
          {favorites.length === 0 ? (
            <div className="text-center text-gray-600 py-8">
              <div className="text-4xl mb-2">♥</div>
              <div className="text-lg font-medium">No favorite decks yet</div>
              <div className="text-sm mt-1">
                {searchQuery ?
                  'No favorites match your search.' :
                  'Browse decks and templates to add them to your favorites!'
                }
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {favorites.map((favorite) => (
                <div
                  key={favorite.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900 truncate">
                          {favorite.deck.name}
                        </h3>
                        {favorite.deck.isTemplate && (
                          <Badge variant="secondary" className="text-xs">
                            Template
                          </Badge>
                        )}
                        {favorite.deck.templateSource && (
                          <Badge className={getSourceBadgeColor(favorite.deck.templateSource)}>
                            {favorite.deck.templateSource}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        by {favorite.deck.creator.name || 'Unknown'} •
                        Favorited {formatDistanceToNow(new Date(favorite.favoritedAt), { addSuffix: true })}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleRemoveFavorite(favorite.deck.id)}
                      variant="outline"
                      size="sm"
                      disabled={removingId === favorite.deck.id}
                      className="text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                      {removingId === favorite.deck.id ? 'Removing...' : 'Remove'}
                    </Button>
                  </div>

                  {favorite.deck.description && (
                    <div className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {favorite.deck.description}
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-500 mb-3">
                    <div>{favorite.deck.cardCount} cards</div>
                    <div>{favorite.deck.uniqueCards} unique</div>
                    <div>Cost: {favorite.deck.totalCost}</div>
                    <div className="flex items-center gap-1">
                      ♥ {favorite.deck.favoriteCount}
                      {favorite.deck.isTemplate && (
                        <span>• {favorite.deck.usageCount} uses</span>
                      )}
                    </div>
                  </div>

                  {favorite.deck.colors.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {favorite.deck.colors.slice(0, 4).map((color) => (
                        <Badge
                          key={color}
                          variant="secondary"
                          className="text-xs"
                        >
                          {color}
                        </Badge>
                      ))}
                      {favorite.deck.colors.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{favorite.deck.colors.length - 4}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleDeckClick(favorite.deck.id)}
                      variant="primary"
                      size="sm"
                    >
                      View Deck
                    </Button>

                    {favorite.deck.isTemplate && (
                      <Button
                        onClick={() => {
                          // This could trigger template usage flow
                          window.open(`/templates/${favorite.deck.id}`, '_blank');
                        }}
                        variant="outline"
                        size="sm"
                      >
                        Use Template
                      </Button>
                    )}

                    <div className="text-xs text-gray-400 ml-auto">
                      {favorite.deck.isPublic ? 'Public' : 'Private'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <Button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>

              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>

              <Button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FavoriteDeckManager;