/**
 * Zoom modal component
 */

import React from 'react';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { CardImageAttribution } from '@/components/layout/BandaiNamcoAttribution';
import { KEYBOARD_CODES } from '@/lib/utils/accessibility';

interface ZoomModalProps {
  cardName: string;
  zoomImageUrl: string;
  showAttribution: boolean;
  onClose: () => void;
}

export const ZoomModal: React.FC<ZoomModalProps> = ({
  cardName,
  zoomImageUrl,
  showAttribution,
  onClose,
}) => {
  return (
    <div
      className="bg-opacity-80 fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="zoom-modal-title"
      aria-describedby="zoom-modal-description"
    >
      <div className="relative max-h-full max-w-4xl">
        <button
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === KEYBOARD_CODES.ESCAPE) {
              onClose();
            }
          }}
          className="absolute -top-12 right-0 rounded-md p-1 text-white transition-colors hover:text-gray-300 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black focus:outline-none"
          aria-label="Close zoom view"
        >
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="relative">
          <OptimizedImage
            src={zoomImageUrl}
            alt={`${cardName} card image (full size)`}
            width={600}
            height={750}
            className="max-h-[80vh] max-w-full rounded-lg object-contain"
            priority
            format="auto"
            fit="contain"
            quality={95}
            enableResponsive={true}
            enableCache={true}
          />

          {/* Attribution overlay for zoom */}
          {showAttribution && (
            <CardImageAttribution className="pointer-events-none" />
          )}

          {/* Image info overlay */}
          <div className="absolute right-0 bottom-0 left-0 rounded-b-lg bg-gradient-to-t from-black to-transparent p-4">
            <h3
              id="zoom-modal-title"
              className="text-lg font-semibold text-white"
            >
              {cardName}
            </h3>
            <p id="zoom-modal-description" className="text-sm text-gray-300">
              Card image zoom view. Press Escape or click anywhere to close
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
