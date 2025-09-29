'use client';

import React from 'react';
import { CardWithRelations } from '@/lib/types/card';
import { Button, Badge } from '@/components/ui';

interface CardDetailOverlayProps {
  card: CardWithRelations;
  isOpen: boolean;
  onClose: () => void;
}

export const CardDetailOverlay: React.FC<CardDetailOverlayProps> = ({
  card,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="bg-gray-900 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">{card.name}</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white border-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Image */}
            <div className="space-y-4">
              <div className="aspect-[5/7] bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                {card.imageUrl ? (
                  <img
                    src={card.imageUrl}
                    alt={card.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {card.rarity && (
                    <Badge className={`${
                      card.rarity.toLowerCase() === 'rare' ? 'bg-yellow-600' :
                      card.rarity.toLowerCase() === 'super rare' ? 'bg-red-600' :
                      card.rarity.toLowerCase() === 'ultra rare' ? 'bg-purple-600' :
                      'bg-gray-600'
                    }`}>
                      {card.rarity}
                    </Badge>
                  )}
                  {card.type && (
                    <Badge className="bg-blue-600">{card.type}</Badge>
                  )}
                  {card.faction && (
                    <Badge className="bg-green-600">{card.faction}</Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {card.cost !== undefined && (
                    <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                      <div className="text-sm text-gray-400">Cost</div>
                      <div className="text-lg font-bold text-white">{card.cost}</div>
                    </div>
                  )}
                  {card.level !== undefined && (
                    <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                      <div className="text-sm text-gray-400">Level</div>
                      <div className="text-lg font-bold text-white">{card.level}</div>
                    </div>
                  )}
                  {card.attack !== undefined && (
                    <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                      <div className="text-sm text-gray-400">Attack</div>
                      <div className="text-lg font-bold text-white">{card.attack}</div>
                    </div>
                  )}
                  {card.defense !== undefined && (
                    <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                      <div className="text-sm text-gray-400">Defense</div>
                      <div className="text-lg font-bold text-white">{card.defense}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Series/Set Info */}
              {(card.series || card.setName) && (
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-2">Set Information</h3>
                  {card.series && (
                    <div className="mb-2">
                      <span className="text-gray-400">Series: </span>
                      <span className="text-white">{card.series}</span>
                    </div>
                  )}
                  {card.setName && (
                    <div className="mb-2">
                      <span className="text-gray-400">Set: </span>
                      <span className="text-white">{card.setName}</span>
                    </div>
                  )}
                  {card.cardNumber && (
                    <div>
                      <span className="text-gray-400">Card Number: </span>
                      <span className="text-white">{card.cardNumber}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Description/Effect */}
              {card.description && (
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-2">Card Text</h3>
                  <p className="text-gray-300 leading-relaxed">{card.description}</p>
                </div>
              )}

              {/* Pilot/Model Info */}
              {(card.pilot || card.model) && (
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-2">Mobile Suit Information</h3>
                  {card.pilot && (
                    <div className="mb-2">
                      <span className="text-gray-400">Pilot: </span>
                      <span className="text-white">{card.pilot}</span>
                    </div>
                  )}
                  {card.model && (
                    <div>
                      <span className="text-gray-400">Model: </span>
                      <span className="text-white">{card.model}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Abilities/Keywords */}
              {card.abilities && card.abilities.length > 0 && (
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-2">Abilities</h3>
                  <div className="flex flex-wrap gap-2">
                    {card.abilities.map((ability, index) => (
                      <Badge key={index} className="bg-purple-600">
                        {ability}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button variant="cyber" className="flex-1">
                  Add to Deck
                </Button>
                <Button variant="outline" className="flex-1 border-gray-600 text-gray-300">
                  Add to Collection
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailOverlay;