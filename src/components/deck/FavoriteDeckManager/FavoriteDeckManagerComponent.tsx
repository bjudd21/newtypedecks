/**
 * FavoriteDeckManager - Simplified main component using custom hooks
 */

'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Badge,
} from '@/components/ui';
import { useFavorites } from './hooks/useFavorites';
import { useFavoriteActions } from './hooks/useFavoriteActions';
import { LoadingState } from './components/LoadingState';
import { EmptyState } from './components/EmptyState';
import { FavoriteCard } from './components/FavoriteCard';
import { PaginationControls } from './components/PaginationControls';
import type { FavoriteDeckManagerProps } from './types';

export const FavoriteDeckManagerComponent: React.FC<
  FavoriteDeckManagerProps
> = ({ onDeckSelect, onRemoveFavorite, className }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { favorites, setFavorites, isLoading, error, totalPages } =
    useFavorites(searchQuery, currentPage);

  const { removingId, handleRemoveFavorite, handleDeckClick } =
    useFavoriteActions({
      setFavorites,
      onDeckSelect,
      onRemoveFavorite,
    });

  if (isLoading && favorites.length === 0) {
    return <LoadingState className={className} />;
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
            <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Favorites List */}
          {favorites.length === 0 ? (
            <EmptyState searchQuery={searchQuery} />
          ) : (
            <div className="space-y-4">
              {favorites.map((favorite) => (
                <FavoriteCard
                  key={favorite.id}
                  favorite={favorite}
                  removingId={removingId}
                  onRemove={handleRemoveFavorite}
                  onClick={handleDeckClick}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default FavoriteDeckManagerComponent;
