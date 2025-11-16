/**
 * CardTable Module Exports
 *
 * This module provides an admin card management table with:
 * - Sortable columns (name, type, rarity, set, level, cost)
 * - Card image thumbnails
 * - Card metadata display (set number, type, rarity with colors)
 * - Edit and delete actions per card
 * - Responsive table layout
 * - Loading and empty states
 */

// Main component
export { CardTableComponent } from './CardTableComponent';

// Types
export type { Card, CardTableProps, SortOrder } from './types';

// Hooks
export { useSorting } from './hooks/useSorting';

// Components
export { LoadingState } from './components/LoadingState';
export { EmptyState } from './components/EmptyState';
export { TableHeader } from './components/TableHeader';
export { TableRow } from './components/TableRow';
export { SortButton } from './components/SortButton';
export { CardThumbnail } from './components/CardThumbnail';
export { RarityBadge } from './components/RarityBadge';
export { SetInfo } from './components/SetInfo';
