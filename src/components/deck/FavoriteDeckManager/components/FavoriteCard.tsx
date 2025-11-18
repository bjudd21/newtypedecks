/**
 * Individual favorite deck card component
 */

import React from 'react';
import { Button, Badge } from '@/components/ui';
import { formatDistanceToNow } from 'date-fns';
import type { FavoriteDeck } from '../types';
import { getSourceBadgeColor } from '../utils';

interface FavoriteCardProps {
  favorite: FavoriteDeck;
  removingId: string | null;
  onRemove: (deckId: string) => void;
  onClick: (deckId: string) => void;
}

export const FavoriteCard: React.FC<FavoriteCardProps> = ({
  favorite,
  removingId,
  onRemove,
  onClick,
}) => {
  return (
    <div className="rounded-lg border p-4 transition-colors hover:bg-gray-50">
      <div className="mb-2 flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <h3 className="truncate font-medium text-gray-900">
              {favorite.deck.name}
            </h3>
            {favorite.deck.isTemplate && (
              <Badge variant="secondary" className="text-xs">
                Template
              </Badge>
            )}
            {favorite.deck.templateSource && (
              <Badge
                className={getSourceBadgeColor(favorite.deck.templateSource)}
              >
                {favorite.deck.templateSource}
              </Badge>
            )}
          </div>
          <div className="text-sm text-gray-600">
            by {favorite.deck.creator.name || 'Unknown'} • Favorited{' '}
            {formatDistanceToNow(new Date(favorite.favoritedAt), {
              addSuffix: true,
            })}
          </div>
        </div>

        <Button
          onClick={() => onRemove(favorite.deck.id)}
          variant="outline"
          size="sm"
          disabled={removingId === favorite.deck.id}
          className="text-red-600 hover:border-red-300 hover:text-red-700"
        >
          {removingId === favorite.deck.id ? 'Removing...' : 'Remove'}
        </Button>
      </div>

      {favorite.deck.description && (
        <div className="mb-3 line-clamp-2 text-sm text-gray-600">
          {favorite.deck.description}
        </div>
      )}

      <div className="mb-3 grid grid-cols-2 gap-2 text-xs text-gray-500 md:grid-cols-4">
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
        <div className="mb-3 flex flex-wrap gap-1">
          {favorite.deck.colors.slice(0, 4).map((color) => (
            <Badge key={color} variant="secondary" className="text-xs">
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
          onClick={() => onClick(favorite.deck.id)}
          variant="default"
          size="sm"
        >
          View Deck
        </Button>

        {favorite.deck.isTemplate && (
          <Button
            onClick={() => {
              window.open(`/templates/${favorite.deck.id}`, '_blank');
            }}
            variant="outline"
            size="sm"
          >
            Use Template
          </Button>
        )}

        <div className="ml-auto text-xs text-gray-400">
          {favorite.deck.isPublic ? 'Public' : 'Private'}
        </div>
      </div>
    </div>
  );
};
