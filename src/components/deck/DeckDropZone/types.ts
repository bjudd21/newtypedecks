/**
 * Type definitions for DeckDropZone
 */

export interface DragData {
  cardId: string;
  cardName: string;
  action: 'move' | 'copy';
}

export interface DeckDropZoneProps {
  onCardDrop: (cardId: string, action: 'move' | 'copy') => void;
  accept?: string[];
  title: string;
  description?: string;
  isActive?: boolean;
  children?: React.ReactNode;
  className?: string;
  minHeight?: number;
}
