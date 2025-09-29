'use client';

import React, { useState } from 'react';
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
    <div
      draggable={isEditing}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`
        ${className}
        ${isEditing ? 'cursor-move' : 'cursor-default'}
        ${isDragging ? 'opacity-50 transform scale-95' : ''}
        transition-all duration-200
        flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50
        ${isEditing ? 'hover:border-blue-300' : ''}
      `}
    >
      {/* Drag Handle */}
      {isEditing && (
        <div className="flex-shrink-0 text-gray-400 hover:text-gray-600">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        </div>
      )}

      {/* Card Image Placeholder */}
      <div className="w-12 h-16 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
        {card.imageUrl ? (
          <img
            src={card.imageUrl}
            alt={card.name}
            className="w-full h-full object-cover rounded"
          />
        ) : (
          <span className="text-xs text-gray-500">IMG</span>
        )}
      </div>

      {/* Card Details */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-gray-900 truncate">
          {card.name}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
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

          {card.cost !== null && card.cost !== undefined && (
            <span className="text-blue-600 font-medium">
              Cost: {card.cost}
            </span>
          )}
        </div>

        <div className="text-xs text-gray-500 mt-1">
          {card.set?.name} #{card.setNumber}
          {card.faction && ` • ${card.faction}`}
          {card.pilot && ` • ${card.pilot}`}
          {ownedQuantity > 0 && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
              Owned: {ownedQuantity}
            </span>
          )}
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onQuantityChange(quantity - 1)}
          disabled={!isEditing || quantity <= 1}
          className={`
            w-8 h-8 rounded border flex items-center justify-center text-sm font-medium
            ${isEditing && quantity > 1
              ? 'border-gray-300 hover:bg-gray-100 text-gray-700'
              : 'border-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          -
        </button>

        <span className="w-8 text-center text-sm font-medium bg-gray-50 rounded py-1">
          {quantity}
        </span>

        <button
          onClick={() => onQuantityChange(quantity + 1)}
          disabled={!isEditing}
          className={`
            w-8 h-8 rounded border flex items-center justify-center text-sm font-medium
            ${isEditing
              ? 'border-gray-300 hover:bg-gray-100 text-gray-700'
              : 'border-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          +
        </button>

        <button
          onClick={onRemove}
          disabled={!isEditing}
          className={`
            w-8 h-8 rounded border flex items-center justify-center text-sm font-medium
            ${isEditing
              ? 'border-red-300 hover:bg-red-50 text-red-600 hover:text-red-700'
              : 'border-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          ×
        </button>
      </div>

      {/* Visual feedback when dragging */}
      {isDragging && isEditing && (
        <div className="absolute inset-0 bg-blue-100 border-2 border-blue-300 border-dashed rounded-lg pointer-events-none opacity-50" />
      )}
    </div>
  );
};

export default DraggableCard;