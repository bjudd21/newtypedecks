/**
 * Publisher Attribution Component
 *
 * Provides proper attribution for the game publisher's copyrighted content
 * including card images, game mechanics, and official content.
 * Publisher name is read from game config (publisher prop).
 */

import React from 'react';

interface PublisherAttributionProps {
  className?: string;
  variant?: 'inline' | 'overlay' | 'watermark' | 'footer' | 'tooltip' | 'badge';
  content?: 'image' | 'card' | 'game-content' | 'general' | 'custom';
  customText?: string;
  /** Override the publisher name (e.g. from game.copyrightHolder) */
  publisher?: string | null;
  /** Override the game name (e.g. from game.name) */
  gameName?: string | null;
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

export const PublisherAttribution: React.FC<PublisherAttributionProps> = ({
  className = '',
  variant = 'inline',
  content = 'general',
  customText,
  publisher,
  gameName,
  position = 'bottom-right',
  size = 'sm',
  opacity = 0.8,
  showYear = true,
}) => {
  const currentYear = new Date().getFullYear();
  const publisherName = publisher ?? 'Bandai Namco Entertainment Inc.';

  // Generate attribution text based on content type
  const getAttributionText = () => {
    if (customText) return customText;

    switch (content) {
      case 'image':
        return `© ${showYear ? currentYear : ''} ${publisherName}`;
      case 'card':
        return `Card image © ${showYear ? currentYear : ''} ${publisherName}`;
      case 'game-content':
        return `${gameName ?? 'Card Game'} © ${showYear ? currentYear : ''} ${publisherName}`;
      case 'general':
      default:
        return `© ${showYear ? currentYear : ''} ${publisherName} All rights reserved.`;
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
            className={`text-muted-foreground h-4 w-4 ${sizeClasses}`}
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
        <div className="bg-background text-foreground invisible absolute -top-2 left-1/2 z-10 -translate-x-1/2 -translate-y-full rounded-lg px-3 py-2 text-xs whitespace-nowrap group-hover:visible">
          {attributionText}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
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
          className={`${sizeClasses} bg-opacity-60 text-foreground rounded bg-black px-2 py-1 backdrop-blur-sm`}
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
          className={`${sizeClasses} text-muted-foreground rotate-45 font-medium select-none`}
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
        className={`inline-flex items-center rounded-full px-2 py-1 ${sizeClasses} bg-muted text-foreground border ${className}`}
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
        className={`${sizeClasses} border-border bg-accent text-muted-foreground/70 border-t py-2 text-center ${className}`}
      >
        {attributionText}
      </div>
    );
  }

  // Default inline variant
  return (
    <span
      className={`${sizeClasses} text-muted-foreground ${className}`}
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
  <PublisherAttribution
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
  <PublisherAttribution
    className={className}
    variant="inline"
    content="game-content"
    size="sm"
  />
);

export const ContentAttributionBadge: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <PublisherAttribution
    className={className}
    variant="badge"
    content="general"
    size="xs"
  />
);

export const AttributionTooltip: React.FC<{ className?: string }> = ({
  className = '',
}) => (
  <PublisherAttribution
    className={className}
    variant="tooltip"
    content="general"
  />
);

export default PublisherAttribution;
