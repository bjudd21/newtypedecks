/**
 * Individual deck card component
 */

import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
} from '@/components/ui';
import { DeckStatistics } from './DeckStatistics';
import { CardPreview } from './CardPreview';
import type { PublicDeck } from '../types';

interface DeckCardProps {
  deck: PublicDeck;
  onViewDeck: (deckId: string) => void;
  onCopyDeck: (deck: PublicDeck) => void;
  onLikeDeck: (deckId: string) => void;
  onCompareDeck: (deckId: string) => void;
}

export const DeckCard: React.FC<DeckCardProps> = ({
  deck,
  onViewDeck,
  onCopyDeck,
  onLikeDeck,
  onCompareDeck,
}) => {
  return (
    <Card className="transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{deck.name}</CardTitle>
            <p className="text-sm text-gray-600">by {deck.author.name}</p>
          </div>
          <Badge
            variant="outline"
            className={`text-xs ${deck.ruleset === 'CASUAL' ? 'border-amber-500/50 text-amber-500' : 'border-blue-500/50 text-blue-400'}`}
          >
            {deck.ruleset === 'CASUAL' ? 'Casual' : 'Competitive'}
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
        <DeckStatistics
          totalCards={deck.statistics.totalCards}
          uniqueCards={deck.statistics.uniqueCards}
          averageCost={deck.statistics.averageCost}
        />

        {/* Color Identity */}
        {deck.statistics.colors.length > 0 && (
          <div className="mb-4">
            <p className="mb-1 text-xs text-gray-600">Factions:</p>
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
        <CardPreview cardPreview={deck.cardPreview} />

        {/* Actions */}
        <div className="flex space-x-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => onViewDeck(deck.id)}
            className="flex-1"
          >
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCopyDeck(deck)}
            className="flex-1"
          >
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCompareDeck(deck.id)}
            title="Compare this deck"
          >
            ⚔
          </Button>
          <Button
            variant={deck.isLikedByUser ? 'default' : 'outline'}
            size="sm"
            onClick={() => onLikeDeck(deck.id)}
            title={deck.isLikedByUser ? 'Unlike' : 'Like'}
          >
            {deck.isLikedByUser ? '♥' : '♡'} {deck.likeCount}
          </Button>
        </div>

        {/* Metadata */}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span>👁 {deck.viewCount}</span>
          <span>Updated {new Date(deck.updatedAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
};
