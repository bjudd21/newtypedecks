'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CardWithRelations } from '@/lib/types/card';
import { Badge } from '@/components/ui';

interface DraggableCardProps {
  card: CardWithRelations;
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  onRemove: () => void;
  isEditing: boolean;
  className?: string;
  ownedQuantity?: number;
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
      className={`
        ${className}
        ${isEditing ? 'cursor-move' : 'cursor-default'}
        ${isDragging ? 'scale-95 transform opacity-50' : ''}
        relative flex items-center gap-3 rounded-lg border border-[#443a5c] bg-[#1a1625]/30 p-3
        transition-all duration-200 hover:bg-[#2d2640]/50
        ${isEditing ? 'hover:border-[#8b7aaa] hover:shadow-lg hover:shadow-[#8b7aaa]/10' : ''}
      `}
      whileHover={isEditing ? { scale: 1.02, y: -2 } : {}}
      transition={{ duration: 0.2 }}
    >
      {/* Drag Handle */}
      {isEditing && (
        <motion.div
          className="flex-shrink-0 text-[#8b7aaa]/50 hover:text-[#8b7aaa]"
          whileHover={{ scale: 1.1 }}
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </motion.div>
      )}

      {/* Card Image Placeholder */}
      <div className="flex h-16 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded border border-[#443a5c] bg-gradient-to-br from-[#2d2640] to-[#3a3050]">
        {card.imageUrl ? (
          <Image
            src={card.imageUrl}
            alt={card.name}
            width={48}
            height={64}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-xs font-semibold text-[#8b7aaa]/50">IMG</span>
        )}
      </div>

      {/* Card Details */}
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-[#a89ec7]">
          {card.name}
        </div>

        <div className="mt-1 flex items-center gap-2 text-xs">
          {card.type && (
            <Badge
              variant="secondary"
              className="border-[#8b7aaa]/30 bg-[#8b7aaa]/20 text-xs text-[#a89ec7]"
            >
              {card.type.name}
            </Badge>
          )}

          {card.rarity && (
            <Badge
              variant="secondary"
              className="border-[#8b7aaa]/30 bg-[#8b7aaa]/20 text-xs text-[#a89ec7]"
            >
              {card.rarity.name}
            </Badge>
          )}

          {card.cost !== null && card.cost !== undefined && (
            <span className="font-semibold text-[#8b7aaa]">
              Cost: {card.cost}
            </span>
          )}
        </div>

        <div className="mt-1 text-xs text-gray-500">
          {card.set?.name} #{card.setNumber}
          {card.faction && ` • ${card.faction}`}
          {card.pilot && ` • ${card.pilot}`}
          {ownedQuantity > 0 && (
            <span className="ml-2 inline-flex items-center rounded border border-green-500/30 bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-300">
              Owned: {ownedQuantity}
            </span>
          )}
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <motion.button
          onClick={() => onQuantityChange(quantity - 1)}
          disabled={!isEditing || quantity <= 1}
          className={`
            flex h-8 w-8 items-center justify-center rounded border text-sm font-bold
            ${
              isEditing && quantity > 1
                ? 'border-[#8b7aaa]/50 text-[#a89ec7] hover:border-[#8b7aaa] hover:bg-[#8b7aaa]/20'
                : 'cursor-not-allowed border-[#443a5c]/30 text-gray-600'
            }
          `}
          whileHover={isEditing && quantity > 1 ? { scale: 1.1 } : {}}
          whileTap={isEditing && quantity > 1 ? { scale: 0.95 } : {}}
        >
          -
        </motion.button>

        <span className="w-8 rounded border border-[#443a5c] bg-[#2d2640] py-1 text-center text-sm font-bold text-[#a89ec7]">
          {quantity}
        </span>

        <motion.button
          onClick={() => onQuantityChange(quantity + 1)}
          disabled={!isEditing}
          className={`
            flex h-8 w-8 items-center justify-center rounded border text-sm font-bold
            ${
              isEditing
                ? 'border-[#8b7aaa]/50 text-[#a89ec7] hover:border-[#8b7aaa] hover:bg-[#8b7aaa]/20'
                : 'cursor-not-allowed border-[#443a5c]/30 text-gray-600'
            }
          `}
          whileHover={isEditing ? { scale: 1.1 } : {}}
          whileTap={isEditing ? { scale: 0.95 } : {}}
        >
          +
        </motion.button>

        <motion.button
          onClick={onRemove}
          disabled={!isEditing}
          className={`
            flex h-8 w-8 items-center justify-center rounded border text-lg font-bold
            ${
              isEditing
                ? 'border-red-500/50 text-red-400 hover:border-red-500 hover:bg-red-500/20 hover:text-red-300'
                : 'cursor-not-allowed border-[#443a5c]/30 text-gray-600'
            }
          `}
          whileHover={isEditing ? { scale: 1.1 } : {}}
          whileTap={isEditing ? { scale: 0.95 } : {}}
        >
          ×
        </motion.button>
      </div>

      {/* Visual feedback when dragging */}
      {isDragging && isEditing && (
        <div className="pointer-events-none absolute inset-0 rounded-lg border-2 border-dashed border-[#8b7aaa] bg-[#8b7aaa]/10" />
      )}
    </motion.div>
  );
};

export default DraggableCard;
