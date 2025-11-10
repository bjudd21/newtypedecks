'use client';

import React from 'react';
import Image from 'next/image';
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
  onClose,
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-gray-700 bg-gray-900 shadow-2xl">
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-700 bg-gray-900 px-4 py-3">
          <h1 className="text-xl font-bold text-white">{card.name}</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="border-gray-600 text-gray-400 hover:text-white"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left Column - Image */}
            <div className="space-y-4">
              <div className="aspect-[5/7] overflow-hidden rounded-lg border border-gray-700 bg-gray-800">
                {card.imageUrl ? (
                  <Image
                    src={card.imageUrl}
                    alt={card.name}
                    width={500}
                    height={700}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-500">
                    <svg
                      className="h-16 w-16"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-4">
              {/* Basic Info */}
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {card.rarity && (
                    <Badge
                      className={`${
                        card.rarity.name?.toLowerCase() === 'rare'
                          ? 'bg-yellow-600'
                          : card.rarity.name?.toLowerCase() === 'super rare'
                            ? 'bg-red-600'
                            : card.rarity.name?.toLowerCase() === 'ultra rare'
                              ? 'bg-purple-600'
                              : 'bg-gray-600'
                      }`}
                    >
                      {card.rarity.name}
                    </Badge>
                  )}
                  {card.type && (
                    <Badge className="bg-blue-600">{card.type.name}</Badge>
                  )}
                  {card.faction && (
                    <Badge className="bg-green-600">{card.faction}</Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {card.cost !== undefined && (
                    <div className="rounded-lg border border-gray-700 bg-gray-800 p-2.5">
                      <div className="text-xs text-gray-400">Cost</div>
                      <div className="text-lg font-bold text-white">
                        {card.cost}
                      </div>
                    </div>
                  )}
                  {card.level !== undefined && (
                    <div className="rounded-lg border border-gray-700 bg-gray-800 p-2.5">
                      <div className="text-xs text-gray-400">Level</div>
                      <div className="text-lg font-bold text-white">
                        {card.level}
                      </div>
                    </div>
                  )}
                  {card.attackPoints !== undefined && (
                    <div className="rounded-lg border border-gray-700 bg-gray-800 p-2.5">
                      <div className="text-xs text-gray-400">Attack</div>
                      <div className="text-lg font-bold text-white">
                        {card.attackPoints}
                      </div>
                    </div>
                  )}
                  {card.hitPoints !== undefined && (
                    <div className="rounded-lg border border-gray-700 bg-gray-800 p-2.5">
                      <div className="text-xs text-gray-400">HP</div>
                      <div className="text-lg font-bold text-white">
                        {card.hitPoints}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Series/Set Info */}
              {(card.series || card.set?.name) && (
                <div className="rounded-lg border border-gray-700 bg-gray-800 p-3">
                  <h3 className="mb-1.5 text-sm font-semibold text-white">
                    Set Information
                  </h3>
                  {card.series && (
                    <div className="mb-1 text-sm">
                      <span className="text-gray-400">Series: </span>
                      <span className="text-white">{card.series}</span>
                    </div>
                  )}
                  {card.set?.name && (
                    <div className="mb-1 text-sm">
                      <span className="text-gray-400">Set: </span>
                      <span className="text-white">{card.set.name}</span>
                    </div>
                  )}
                  {card.setNumber && (
                    <div className="text-sm">
                      <span className="text-gray-400">Card Number: </span>
                      <span className="text-white">{card.setNumber}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Description/Effect */}
              {card.description && (
                <div className="rounded-lg border border-gray-700 bg-gray-800 p-3">
                  <h3 className="mb-1.5 text-sm font-semibold text-white">
                    Card Text
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-300">
                    {card.description}
                  </p>
                </div>
              )}

              {/* Pilot/Model Info */}
              {(card.pilot || card.model) && (
                <div className="rounded-lg border border-gray-700 bg-gray-800 p-3">
                  <h3 className="mb-1.5 text-sm font-semibold text-white">
                    Mobile Suit Information
                  </h3>
                  {card.pilot && (
                    <div className="mb-1 text-sm">
                      <span className="text-gray-400">Pilot: </span>
                      <span className="text-white">{card.pilot}</span>
                    </div>
                  )}
                  {card.model && (
                    <div className="text-sm">
                      <span className="text-gray-400">Model: </span>
                      <span className="text-white">{card.model}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Abilities/Keywords */}
              {card.abilities && card.abilities.length > 0 && (
                <div className="rounded-lg border border-gray-700 bg-gray-800 p-3">
                  <h3 className="mb-1.5 text-sm font-semibold text-white">
                    Abilities
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-300">
                    {card.abilities}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button variant="cyber" className="flex-1">
                  Add to Deck
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300"
                >
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
