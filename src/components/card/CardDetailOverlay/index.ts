/**
 * CardDetailOverlay Module Exports
 *
 * This module provides a card details modal overlay with:
 * - Card image display
 * - Badges for rarity, type, and faction
 * - Stats grid (cost, level, attack, HP)
 * - Set information
 * - Card description and abilities
 * - Mobile suit information
 * - Action buttons for deck and collection
 */

// Main component
export { CardDetailOverlayComponent } from './CardDetailOverlayComponent';

// Types
export type { CardDetailOverlayProps } from './types';

// Hooks
export { useModalHandlers } from './hooks/useModalHandlers';

// Components
export { ModalHeader } from './components/ModalHeader';
export { CardImageSection } from './components/CardImageSection';
export { BadgesDisplay } from './components/BadgesDisplay';
export { StatsGrid } from './components/StatsGrid';
export { SetInformation } from './components/SetInformation';
export { CardDescription } from './components/CardDescription';
export { MobileSuitInfo } from './components/MobileSuitInfo';
export { AbilitiesSection } from './components/AbilitiesSection';
export { ActionButtons } from './components/ActionButtons';
