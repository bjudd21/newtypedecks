/**
 * CardTable - Backward compatibility re-export layer
 *
 * This file maintains backward compatibility for existing imports while
 * the actual implementation has been modularized into CardTable/
 */

// Main component exports
export { CardTableComponent as CardTable } from './CardTable/CardTableComponent';
export { CardTableComponent as default } from './CardTable/CardTableComponent';

// Type exports
export type { Card, CardTableProps, SortOrder } from './CardTable/types';

// Hook exports
export { useSorting } from './CardTable/hooks/useSorting';

// Component exports
export { LoadingState } from './CardTable/components/LoadingState';
export { EmptyState } from './CardTable/components/EmptyState';
export { TableHeader } from './CardTable/components/TableHeader';
export { TableRow } from './CardTable/components/TableRow';
export { SortButton } from './CardTable/components/SortButton';
export { CardThumbnail } from './CardTable/components/CardThumbnail';
export { RarityBadge } from './CardTable/components/RarityBadge';
export { SetInfo } from './CardTable/components/SetInfo';
