/**
 * Copyright Disclaimer Component
 *
 * Displays proper copyright attribution for Bandai Namco Entertainment
 * and clarifies the non-commercial, educational nature of this website
 */

import React from 'react';

interface CopyrightDisclaimerProps {
  className?: string;
  variant?: 'full' | 'compact' | 'footer';
  /** Game name (e.g. from game.name). Falls back to generic text. */
  gameName?: string | null;
  /** Publisher name (e.g. from game.copyrightHolder). */
  publisher?: string | null;
}

export const CopyrightDisclaimer: React.FC<CopyrightDisclaimerProps> = ({
  className = '',
  variant = 'full',
  gameName,
  publisher,
}) => {
  const currentYear = new Date().getFullYear();
  const publisherName = publisher ?? 'Bandai Namco Entertainment Inc.';
  const gameLabel = gameName ?? 'Card Game';

  if (variant === 'compact') {
    return (
      <div className={`text-muted-foreground text-xs ${className}`}>
        <p>
          © {currentYear} {publisherName} All rights reserved. This is an
          unofficial fan site.
        </p>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div
        className={`text-muted-foreground/70 space-y-2 text-sm ${className}`}
      >
        <p>
          <strong>{gameLabel}</strong> is a trademark of{' '}
          <strong>{publisherName}</strong> All card images, names, and game
          mechanics are copyrighted material owned by {publisherName}
        </p>
        <p>
          This website is not affiliated with, endorsed by, or sponsored by{' '}
          {publisherName} All copyrighted content is used under fair use
          provisions for educational and community purposes only.
        </p>
      </div>
    );
  }

  // Full variant - detailed copyright notice
  return (
    <div
      className={`border-border bg-accent text-muted-foreground rounded-lg border p-4 text-sm ${className}`}
    >
      <div className="space-y-3">
        <div>
          <h4 className="text-foreground mb-2 font-semibold">
            Copyright Notice
          </h4>
          <p>
            <strong>{gameLabel}</strong> and all related characters, names,
            marks, emblems, and logos are trademarks of{' '}
            <strong>{publisherName}</strong> and are used under fair use
            provisions.
          </p>
        </div>

        <div>
          <p>
            All card images, artwork, character designs, mechanical designs,
            logos, and game mechanics displayed on this website are the
            exclusive property of <strong>{publisherName}</strong> ©{' '}
            {currentYear} {publisherName} All rights reserved.
          </p>
        </div>

        <div>
          <p>
            This website is an <strong>unofficial fan-created resource</strong>{' '}
            developed independently by community members for educational,
            reference, and community-building purposes. We are not affiliated
            with, endorsed by, sponsored by, or otherwise associated with{' '}
            {publisherName}
          </p>
        </div>

        <div className="border-border border-t pt-2">
          <p className="text-muted-foreground text-xs">
            <strong>Fair Use Notice:</strong> All copyrighted material on this
            website is used in accordance with fair use principles for
            non-commercial, educational, and transformative purposes including
            criticism, comment, teaching, and research.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CopyrightDisclaimer;
