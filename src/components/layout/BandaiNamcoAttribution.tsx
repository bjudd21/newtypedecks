/**
 * Bandai Namco Attribution Component
 *
 * Provides proper attribution for Bandai Namco Entertainment copyrighted content
 * including card images, game mechanics, and official content
 */

import React from 'react';

interface BandaiNamcoAttributionProps {
  className?: string;
  variant?: 'inline' | 'overlay' | 'watermark' | 'footer' | 'tooltip' | 'badge';
  content?: 'image' | 'card' | 'game-content' | 'general' | 'custom';
  customText?: string;
  position?:
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'center';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  opacity?: number;
  showYear?: boolean;
}

export const BandaiNamcoAttribution: React.FC<BandaiNamcoAttributionProps> = ({
  className = '',
  variant = 'inline',
  content = 'general',
  customText,
  position = 'bottom-right',
  size = 'sm',
  opacity = 0.8,
  showYear = true,
}) => {
  const currentYear = new Date().getFullYear();

  // Generate attribution text based on content type
  const getAttributionText = () => {
    if (customText) return customText;

    switch (content) {
      case 'image':
        return `© ${showYear ? currentYear : ''} Bandai Namco Entertainment Inc.`;
      case 'card':
        return `Card image © ${showYear ? currentYear : ''} Bandai Namco Entertainment Inc.`;
      case 'game-content':
        return `Gundam Card Game © ${showYear ? currentYear : ''} Bandai Namco Entertainment Inc.`;
      case 'general':
      default:
        return `© ${showYear ? currentYear : ''} Bandai Namco Entertainment Inc. All rights reserved.`;
    }
  };

  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'xs':
        return 'text-xs';
      case 'sm':
        return 'text-sm';
      case 'md':
        return 'text-base';
      case 'lg':
        return 'text-lg';
      default:
        return 'text-sm';
    }
  };

  // Get position classes for overlay variant
  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-2 left-2';
      case 'top-right':
        return 'top-2 right-2';
      case 'bottom-left':
        return 'bottom-2 left-2';
      case 'bottom-right':
        return 'bottom-2 right-2';
      case 'center':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
      default:
        return 'bottom-2 right-2';
    }
  };

  const attributionText = getAttributionText();
  const sizeClasses = getSizeClasses();

  if (variant === 'tooltip') {
    return (
      <div className={`group relative inline-block ${className}`}>
        <div className="cursor-help">
          <svg
            className={`h-4 w-4 text-gray-400 ${sizeClasses}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="invisible absolute -top-2 left-1/2 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-xs text-white group-hover:visible">
          {attributionText}
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    );
  }

  if (variant === 'overlay') {
    return (
      <div
        className={`absolute ${getPositionClasses()} pointer-events-none z-10 ${className}`}
        style={{ opacity }}
      >
        <div
          className={`${sizeClasses} rounded bg-black bg-opacity-60 px-2 py-1 text-white backdrop-blur-sm`}
        >
          {attributionText}
        </div>
      </div>
    );
  }

  if (variant === 'watermark') {
    return (
      <div
        className={`pointer-events-none absolute inset-0 z-10 flex items-center justify-center ${className}`}
        style={{ opacity: Math.min(opacity, 0.3) }}
      >
        <div
          className={`${sizeClasses} rotate-45 select-none font-medium text-gray-600`}
          style={{
            textShadow: '1px 1px 2px rgba(255,255,255,0.8)',
          }}
        >
          {attributionText}
        </div>
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <span
        className={`inline-flex items-center rounded-full px-2 py-1 ${sizeClasses} border bg-gray-100 text-gray-800 ${className}`}
      >
        <svg
          className="mr-1 h-3 w-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
        {attributionText}
      </span>
    );
  }

  if (variant === 'footer') {
    return (
      <div
        className={`${sizeClasses} border-t border-gray-200 bg-gray-50 py-2 text-center text-gray-500 ${className}`}
      >
        {attributionText}
      </div>
    );
  }

  // Default inline variant
  return (
    <span
      className={`${sizeClasses} text-gray-600 ${className}`}
      style={{ opacity }}
    >
      {attributionText}
    </span>
  );
};

/**
 * Specialized attribution components for common use cases
 */

export const CardImageAttribution: React.FC<{
  className?: string;
  overlay?: boolean;
}> = ({ className = '', overlay = true }) => (
  <BandaiNamcoAttribution
    className={className}
    variant={overlay ? 'overlay' : 'inline'}
    content="card"
    size="xs"
    position="bottom-right"
  />
);

export const GameContentAttribution: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <BandaiNamcoAttribution
    className={className}
    variant="inline"
    content="game-content"
    size="sm"
  />
);

export const ContentAttributionBadge: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <BandaiNamcoAttribution
    className={className}
    variant="badge"
    content="general"
    size="xs"
  />
);

export const AttributionTooltip: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <BandaiNamcoAttribution
    className={className}
    variant="tooltip"
    content="general"
  />
);

export default BandaiNamcoAttribution;
