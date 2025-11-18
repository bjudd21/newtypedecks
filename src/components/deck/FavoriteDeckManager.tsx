/**
 * FavoriteDeckManager - Re-export from modularized version
 *
 * This file maintains backward compatibility with existing imports.
 * The actual implementation is in ./FavoriteDeckManager/ directory.
 */

export { FavoriteDeckManagerComponent as FavoriteDeckManager } from './FavoriteDeckManager/FavoriteDeckManagerComponent';
export { useFavorites } from './FavoriteDeckManager/hooks/useFavorites';
export { useFavoriteActions } from './FavoriteDeckManager/hooks/useFavoriteActions';
export { LoadingState } from './FavoriteDeckManager/components/LoadingState';
export { EmptyState } from './FavoriteDeckManager/components/EmptyState';
export { FavoriteCard } from './FavoriteDeckManager/components/FavoriteCard';
export { PaginationControls } from './FavoriteDeckManager/components/PaginationControls';
export type {
  FavoriteDeck,
  FavoriteDeckManagerProps,
} from './FavoriteDeckManager/types';
export { getSourceBadgeColor } from './FavoriteDeckManager/utils';
export { FavoriteDeckManagerComponent as default } from './FavoriteDeckManager/FavoriteDeckManagerComponent';
