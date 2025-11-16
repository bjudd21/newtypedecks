/**
 * Type definitions for CardDetailOverlay component
 */

import type { CardWithRelations } from '@/lib/types/card';

export interface CardDetailOverlayProps {
  card: CardWithRelations;
  isOpen: boolean;
  onClose: () => void;
}
