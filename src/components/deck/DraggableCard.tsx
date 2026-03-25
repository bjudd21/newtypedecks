'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CardWithRelations } from '@/lib/types/card';
import { Badge } from '@/components/ui';
import type { DeckCategory } from '@/lib/types/deck';

interface DraggableCardProps {
  card: CardWithRelations;
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  onRemove: () => void;
  isEditing: boolean;
  className?: string;
  ownedQuantity?: number;
  showOwnership?: boolean;
  userCategory?: string | null;
  categories?: DeckCategory[];
  onUserCategoryChange?: (userCategory: string | null) => void;
}

interface DragData {
  cardId: string;
  cardName: string;
  action: 'move' | 'copy';
}

export const DraggableCard: React.FC<DraggableCardProps> = ({
  card,
  quantity,
  onQuantityChange,
  onRemove,
  isEditing,
  className = '',
  ownedQuantity = 0,
  showOwnership = false,
  userCategory = null,
  categories,
  onUserCategoryChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  // Handle drag start
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (!isEditing) return;

    const dragData: DragData = {
      cardId: card.id,
      cardName: card.name,
      action: 'move',
    };

    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';

    setIsDragging(true);

    // Create custom drag image
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.transform = 'rotate(3deg)';
    dragImage.style.opacity = '0.8';
    document.body.appendChild(dragImage);

    e.dataTransfer.setDragImage(dragImage, 50, 30);

    // Clean up drag image after a brief delay
    setTimeout(() => {
      if (document.body.contains(dragImage)) {
        document.body.removeChild(dragImage);
      }
    }, 0);
  };

  // Handle drag end
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  // Wrapper props with HTML5 drag events
  const dragProps = isEditing
    ? {
        onDragStart: handleDragStart,
        onDragEnd: handleDragEnd,
      }
    : {};

  return (
    <motion.div
      draggable={isEditing}
      {...(dragProps as Record<string, unknown>)}
      className={` ${className} ${isEditing ? 'cursor-move' : 'cursor-default'} ${isDragging ? 'scale-95 transform opacity-50' : ''} border-border bg-background/30 hover:bg-card/50 relative flex items-center gap-3 rounded-lg border p-3 transition-all duration-200 ${isEditing ? 'hover:border-primary hover:shadow-primary/20 hover:shadow-lg' : ''} `}
      whileHover={isEditing ? { scale: 1.02, y: -2 } : {}}
      transition={{ duration: 0.2 }}
    >
      {/* Drag Handle */}
      {isEditing && (
        <motion.div
          className="text-primary/50 hover:text-primary flex-shrink-0"
          whileHover={{ scale: 1.1 }}
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </motion.div>
      )}

      {/* Card Image Placeholder */}
      <div className="border-border from-card to-accent flex h-16 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded border bg-gradient-to-br">
        {(card.imageUrlSmall ?? card.imageUrl) ? (
          <Image
            src={(card.imageUrlSmall ?? card.imageUrl)!}
            alt={card.name}
            width={48}
            height={64}
            loading="lazy"
            sizes="48px"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-primary/50 text-xs font-semibold">IMG</span>
        )}
      </div>

      {/* Card Details */}
      <div className="min-w-0 flex-1">
        <div className="text-primary/80 truncate text-sm font-semibold">
          {card.name}
        </div>

        <div className="mt-1 flex items-center gap-2 text-xs">
          {card.type && (
            <Badge
              variant="secondary"
              className="border-primary/30 bg-primary/20 text-primary/80 text-xs"
            >
              {card.type.name}
            </Badge>
          )}

          {card.rarity && (
            <Badge
              variant="secondary"
              className="border-primary/30 bg-primary/20 text-primary/80 text-xs"
            >
              {card.rarity.name}
            </Badge>
          )}

          {card.cost !== null && card.cost !== undefined && (
            <span className="text-primary font-semibold">
              Cost: {card.cost}
            </span>
          )}
        </div>

        {/* Category reassignment — visible when editing and categories are configured */}
        {isEditing &&
          categories &&
          categories.length > 0 &&
          onUserCategoryChange && (
            <div className="mt-1">
              <select
                value={userCategory ?? ''}
                onChange={(e) => onUserCategoryChange(e.target.value || null)}
                className="border-border bg-background text-primary/80 focus:border-primary w-full rounded border px-1 py-0.5 text-xs outline-none"
              >
                <option value="">Uncategorized</option>
                {categories.map((cat) => (
                  <option key={cat.key} value={cat.key}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          )}

        <div className="text-muted-foreground/70 mt-1 text-xs">
          {card.set?.name} #{card.setNumber}
          {card.faction && ` • ${card.faction}`}
          {card.pilot && ` • ${card.pilot}`}
          {showOwnership &&
            (ownedQuantity >= quantity ? (
              <span className="ml-2 inline-flex items-center rounded border border-green-500/30 bg-green-500/20 px-1.5 py-0.5 text-xs font-medium text-green-300">
                ✓ {ownedQuantity}
              </span>
            ) : ownedQuantity > 0 ? (
              <span className="ml-2 inline-flex items-center rounded border border-yellow-500/30 bg-yellow-500/20 px-1.5 py-0.5 text-xs font-medium text-yellow-300">
                {ownedQuantity}/{quantity}
              </span>
            ) : (
              <span className="ml-2 inline-flex items-center rounded border border-red-500/30 bg-red-500/20 px-1.5 py-0.5 text-xs font-medium text-red-400">
                Need {quantity}
              </span>
            ))}
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <motion.button
          onClick={() => onQuantityChange(quantity - 1)}
          disabled={!isEditing || quantity <= 1}
          className={`flex h-8 w-8 items-center justify-center rounded border text-sm font-bold ${
            isEditing && quantity > 1
              ? 'border-primary/50 text-primary/80 hover:border-primary hover:bg-primary/20'
              : 'border-border/30 text-muted-foreground cursor-not-allowed'
          } `}
          whileHover={isEditing && quantity > 1 ? { scale: 1.1 } : {}}
          whileTap={isEditing && quantity > 1 ? { scale: 0.95 } : {}}
        >
          -
        </motion.button>

        <span className="border-border bg-card text-primary/80 w-8 rounded border py-1 text-center text-sm font-bold">
          {quantity}
        </span>

        <motion.button
          onClick={() => onQuantityChange(quantity + 1)}
          disabled={!isEditing}
          className={`flex h-8 w-8 items-center justify-center rounded border text-sm font-bold ${
            isEditing
              ? 'border-primary/50 text-primary/80 hover:border-primary hover:bg-primary/20'
              : 'border-border/30 text-muted-foreground cursor-not-allowed'
          } `}
          whileHover={isEditing ? { scale: 1.1 } : {}}
          whileTap={isEditing ? { scale: 0.95 } : {}}
        >
          +
        </motion.button>

        <motion.button
          onClick={onRemove}
          disabled={!isEditing}
          className={`flex h-8 w-8 items-center justify-center rounded border text-lg font-bold ${
            isEditing
              ? 'border-red-500/50 text-red-400 hover:border-red-500 hover:bg-red-500/20 hover:text-red-300'
              : 'border-border/30 text-muted-foreground cursor-not-allowed'
          } `}
          whileHover={isEditing ? { scale: 1.1 } : {}}
          whileTap={isEditing ? { scale: 0.95 } : {}}
        >
          ×
        </motion.button>
      </div>

      {/* Visual feedback when dragging */}
      {isDragging && isEditing && (
        <div className="border-primary bg-primary/10 pointer-events-none absolute inset-0 rounded-lg border-2 border-dashed" />
      )}
    </motion.div>
  );
};

export default DraggableCard;
