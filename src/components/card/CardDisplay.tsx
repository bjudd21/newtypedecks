/**
 * CardDisplay component - Display individual card information
 *
 * This component shows a card in a compact format suitable for search results,
 * card lists, and collection displays.
 */

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, Badge } from '@/components/ui';
import { GameContentAttribution } from '@/components/layout/BandaiNamcoAttribution';
import type { CardWithRelations } from '@/lib/types/card';
import { cn } from '@/lib/utils';

export interface CardDisplayProps {
  card: CardWithRelations;
  className?: string;
  showFullDetails?: boolean;
  onClick?: (card: CardWithRelations) => void;
  showAttribution?: boolean;
}

export const CardDisplay: React.FC<CardDisplayProps> = ({
  card,
  className,
  showFullDetails = false,
  onClick,
  showAttribution = true,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(card);
    }
  };

  const cardContent = (
    <Card className={cn('transition-shadow hover:shadow-md', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 truncate">
              {card.name}
            </h3>
            {card.pilot && (
              <p className="text-sm text-gray-600 truncate">
                Pilot: {card.pilot}
              </p>
            )}
            {card.model && (
              <p className="text-sm text-gray-500 truncate">
                Model: {card.model}
              </p>
            )}
          </div>

          {/* Card image thumbnail */}
          <div className="ml-3 flex-shrink-0">
            <div className="w-16 h-20 bg-gray-200 rounded border overflow-hidden">
              {card.imageUrlSmall || card.imageUrl ? (
                <Image
                  src={card.imageUrlSmall || card.imageUrl}
                  alt={card.name}
                  width={64}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card metadata badges */}
        <div className="flex flex-wrap gap-2 mt-3">
          {card.type && (
            <Badge variant="secondary" className="text-xs">
              {card.type.name}
            </Badge>
          )}
          {card.rarity && (
            <Badge variant="secondary" className="text-xs">
              {card.rarity.name}
            </Badge>
          )}
          {card.level !== null && card.level !== undefined && (
            <Badge variant="info" className="text-xs">
              Level {card.level}
            </Badge>
          )}
          {card.cost !== null && card.cost !== undefined && (
            <Badge variant="info" className="text-xs">
              Cost {card.cost}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Basic stats */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          {card.faction && (
            <div>
              <span className="font-medium text-gray-600">Faction:</span>
              <span className="ml-1 text-gray-800">{card.faction}</span>
            </div>
          )}
          {card.series && (
            <div>
              <span className="font-medium text-gray-600">Series:</span>
              <span className="ml-1 text-gray-800">{card.series}</span>
            </div>
          )}
          {card.clashPoints !== null && card.clashPoints !== undefined && (
            <div>
              <span className="font-medium text-gray-600">CP:</span>
              <span className="ml-1 text-gray-800">{card.clashPoints}</span>
            </div>
          )}
          {card.hitPoints !== null && card.hitPoints !== undefined && (
            <div>
              <span className="font-medium text-gray-600">HP:</span>
              <span className="ml-1 text-gray-800">{card.hitPoints}</span>
            </div>
          )}
        </div>

        {/* Description preview */}
        {card.description && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 line-clamp-2">
              {card.description}
            </p>
          </div>
        )}

        {/* Extended details for full view */}
        {showFullDetails && (
          <div className="mt-4 space-y-2">
            {card.officialText && (
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-1">Official Text:</h4>
                <p className="text-sm text-gray-600">{card.officialText}</p>
              </div>
            )}

            {card.keywords && card.keywords.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-1">Keywords:</h4>
                <div className="flex flex-wrap gap-1">
                  {card.keywords.map((keyword, index) => (
                    <Badge key={index} variant="default" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {card.set && (
              <div className="text-xs text-gray-500">
                {card.set.name} #{card.setNumber}
              </div>
            )}
          </div>
        )}

        {/* Special indicators */}
        <div className="flex gap-1 mt-3">
          {card.isFoil && (
            <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
              Foil
            </Badge>
          )}
          {card.isPromo && (
            <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
              Promo
            </Badge>
          )}
          {card.isAlternate && (
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
              Alt Art
            </Badge>
          )}
        </div>

        {/* Attribution */}
        {showAttribution && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <GameContentAttribution className="text-xs" />
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (onClick) {
    return (
      <button
        onClick={handleClick}
        className="w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
      >
        {cardContent}
      </button>
    );
  }

  return (
    <Link
      href={`/cards/${card.id}`}
      className="block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
    >
      {cardContent}
    </Link>
  );
};

export default CardDisplay;