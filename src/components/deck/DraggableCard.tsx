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
  ownedQuantity = 0
}) => {
  const [isDragging, setIsDragging] = useState(false);

  // Handle drag start
  const handleDragStart = (e: React.DragEvent) => {
    if (!isEditing) return;

    const dragData: DragData = {
      cardId: card.id,
      cardName: card.name,
      action: 'move'
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
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <motion.div
      draggable={isEditing}
      onDragStart={handleDragStart as any}
      onDragEnd={handleDragEnd as any}
      className={`
        ${className}
        ${isEditing ? 'cursor-move' : 'cursor-default'}
        ${isDragging ? 'opacity-50 transform scale-95' : ''}
        relative flex items-center gap-3 p-3 border border-[#443a5c] rounded-lg bg-[#1a1625]/30
        hover:bg-[#2d2640]/50 transition-all duration-200
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
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        </motion.div>
      )}

      {/* Card Image Placeholder */}
      <div className="w-12 h-16 bg-gradient-to-br from-[#2d2640] to-[#3a3050] rounded flex-shrink-0 flex items-center justify-center border border-[#443a5c] overflow-hidden">
        {card.imageUrl ? (
          <Image
            src={card.imageUrl}
            alt={card.name}
            width={48}
            height={64}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-xs text-[#8b7aaa]/50 font-semibold">IMG</span>
        )}
      </div>

      {/* Card Details */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm text-[#a89ec7] truncate">
          {card.name}
        </div>

        <div className="flex items-center gap-2 text-xs mt-1">
          {card.type && (
            <Badge variant="secondary" className="text-xs bg-[#8b7aaa]/20 text-[#a89ec7] border-[#8b7aaa]/30">
              {card.type.name}
            </Badge>
          )}

          {card.rarity && (
            <Badge variant="secondary" className="text-xs bg-[#8b7aaa]/20 text-[#a89ec7] border-[#8b7aaa]/30">
              {card.rarity.name}
            </Badge>
          )}

          {card.cost !== null && card.cost !== undefined && (
            <span className="text-[#8b7aaa] font-semibold">
              Cost: {card.cost}
            </span>
          )}
        </div>

        <div className="text-xs text-gray-500 mt-1">
          {card.set?.name} #{card.setNumber}
          {card.faction && ` • ${card.faction}`}
          {card.pilot && ` • ${card.pilot}`}
          {ownedQuantity > 0 && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
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
            w-8 h-8 rounded border flex items-center justify-center text-sm font-bold
            ${isEditing && quantity > 1
              ? 'border-[#8b7aaa]/50 hover:bg-[#8b7aaa]/20 text-[#a89ec7] hover:border-[#8b7aaa]'
              : 'border-[#443a5c]/30 text-gray-600 cursor-not-allowed'
            }
          `}
          whileHover={isEditing && quantity > 1 ? { scale: 1.1 } : {}}
          whileTap={isEditing && quantity > 1 ? { scale: 0.95 } : {}}
        >
          -
        </motion.button>

        <span className="w-8 text-center text-sm font-bold bg-[#2d2640] text-[#a89ec7] border border-[#443a5c] rounded py-1">
          {quantity}
        </span>

        <motion.button
          onClick={() => onQuantityChange(quantity + 1)}
          disabled={!isEditing}
          className={`
            w-8 h-8 rounded border flex items-center justify-center text-sm font-bold
            ${isEditing
              ? 'border-[#8b7aaa]/50 hover:bg-[#8b7aaa]/20 text-[#a89ec7] hover:border-[#8b7aaa]'
              : 'border-[#443a5c]/30 text-gray-600 cursor-not-allowed'
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
            w-8 h-8 rounded border flex items-center justify-center text-lg font-bold
            ${isEditing
              ? 'border-red-500/50 hover:bg-red-500/20 text-red-400 hover:text-red-300 hover:border-red-500'
              : 'border-[#443a5c]/30 text-gray-600 cursor-not-allowed'
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
        <div className="absolute inset-0 bg-[#8b7aaa]/10 border-2 border-[#8b7aaa] border-dashed rounded-lg pointer-events-none" />
      )}
    </motion.div>
  );
};

export default DraggableCard;