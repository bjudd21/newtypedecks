/**
 * CardDetailOverlay - Backward compatibility re-export layer
 *
 * This file maintains backward compatibility for existing imports while
 * the actual implementation has been modularized into CardDetailOverlay/
 */

// Main component exports
export { CardDetailOverlayComponent as CardDetailOverlay } from './CardDetailOverlay/CardDetailOverlayComponent';
export { CardDetailOverlayComponent as default } from './CardDetailOverlay/CardDetailOverlayComponent';

// Type exports
export type { CardDetailOverlayProps } from './CardDetailOverlay/types';

// Hook exports
export { useModalHandlers } from './CardDetailOverlay/hooks/useModalHandlers';

// Component exports
export { ModalHeader } from './CardDetailOverlay/components/ModalHeader';
export { CardImageSection } from './CardDetailOverlay/components/CardImageSection';
export { BadgesDisplay } from './CardDetailOverlay/components/BadgesDisplay';
export { StatsGrid } from './CardDetailOverlay/components/StatsGrid';
export { SetInformation } from './CardDetailOverlay/components/SetInformation';
export { CardDescription } from './CardDetailOverlay/components/CardDescription';
export { MobileSuitInfo } from './CardDetailOverlay/components/MobileSuitInfo';
export { AbilitiesSection } from './CardDetailOverlay/components/AbilitiesSection';
export { ActionButtons } from './CardDetailOverlay/components/ActionButtons';
