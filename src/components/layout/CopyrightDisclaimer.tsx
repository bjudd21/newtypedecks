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
}

export const CopyrightDisclaimer: React.FC<CopyrightDisclaimerProps> = ({
  className = '',
  variant = 'full',
}) => {
  const currentYear = new Date().getFullYear();

  if (variant === 'compact') {
    return (
      <div className={`text-xs text-gray-600 ${className}`}>
        <p>
          © {currentYear} Bandai Namco Entertainment Inc. All rights reserved.
          This is an unofficial fan site.
        </p>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`space-y-2 text-sm text-gray-500 ${className}`}>
        <p>
          <strong>Gundam Card Game</strong> is a trademark of{' '}
          <strong>Bandai Namco Entertainment Inc.</strong> All card images,
          names, and game mechanics are copyrighted material owned by Bandai
          Namco Entertainment Inc.
        </p>
        <p>
          This website is not affiliated with, endorsed by, or sponsored by
          Bandai Namco Entertainment Inc. All copyrighted content is used under
          fair use provisions for educational and community purposes only.
        </p>
      </div>
    );
  }

  // Full variant - detailed copyright notice
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 ${className}`}
    >
      <div className="space-y-3">
        <div>
          <h4 className="mb-2 font-semibold text-gray-900">Copyright Notice</h4>
          <p>
            <strong>Gundam Card Game</strong>,{' '}
            <strong>Mobile Suit Gundam</strong>, and all related characters,
            names, marks, emblems, and logos are trademarks of{' '}
            <strong>Bandai Namco Entertainment Inc.</strong> and are used under
            fair use provisions.
          </p>
        </div>

        <div>
          <p>
            All card images, artwork, character designs, mechanical designs,
            logos, and game mechanics displayed on this website are the
            exclusive property of{' '}
            <strong>Bandai Namco Entertainment Inc.</strong> © {currentYear}{' '}
            Bandai Namco Entertainment Inc. All rights reserved.
          </p>
        </div>

        <div>
          <p>
            This website is an <strong>unofficial fan-created resource</strong>{' '}
            developed independently by community members for educational,
            reference, and community-building purposes. We are not affiliated
            with, endorsed by, sponsored by, or otherwise associated with Bandai
            Namco Entertainment Inc.
          </p>
        </div>

        <div className="border-t border-gray-300 pt-2">
          <p className="text-xs text-gray-600">
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
