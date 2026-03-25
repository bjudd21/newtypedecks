/**
 * CardDetailOverlay - Main component orchestrator
 */

'use client';

import React from 'react';
import { useModalHandlers } from './hooks/useModalHandlers';
import { ModalHeader } from './components/ModalHeader';
import { CardImageSection } from './components/CardImageSection';
import { BadgesDisplay } from './components/BadgesDisplay';
import { StatsGrid } from './components/StatsGrid';
import { SetInformation } from './components/SetInformation';
import { CardDescription } from './components/CardDescription';
import { MobileSuitInfo } from './components/MobileSuitInfo';
import { AbilitiesSection } from './components/AbilitiesSection';
import { ActionButtons } from './components/ActionButtons';
import type { CardDetailOverlayProps } from './types';

export function CardDetailOverlayComponent({
  card,
  isOpen,
  onClose,
}: CardDetailOverlayProps) {
  const { handleBackdropClick, handleKeyDown } = useModalHandlers({ onClose });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="border-border bg-background flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border shadow-2xl">
        <ModalHeader title={card.name} onClose={onClose} />

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left Column - Image */}
            <CardImageSection imageUrl={card.imageUrl} cardName={card.name} />

            {/* Right Column - Details */}
            <div className="space-y-4">
              {/* Basic Info */}
              <div className="space-y-3">
                <BadgesDisplay card={card} />
                <StatsGrid card={card} />
              </div>

              <SetInformation card={card} />
              <CardDescription description={card.description} />
              <MobileSuitInfo pilot={card.pilot} model={card.model} />
              <AbilitiesSection abilities={card.abilities} />
              <ActionButtons />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
