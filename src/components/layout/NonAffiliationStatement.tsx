/**
 * Non-Affiliation Statement Component
 *
 * Clearly states that this website is not officially associated with
 * Bandai Namco Entertainment and clarifies the fan-made nature of the site
 */

import React from 'react';

interface NonAffiliationStatementProps {
  className?: string;
  variant?: 'banner' | 'inline' | 'footer' | 'modal';
  showIcon?: boolean;
}

export const NonAffiliationStatement: React.FC<NonAffiliationStatementProps> = ({
  className = '',
  variant = 'inline',
  showIcon = true
}) => {
  const Icon = ({ className: iconClass = "" }) => (
    <svg
      className={`h-5 w-5 ${iconClass}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  if (variant === 'banner') {
    return (
      <div className={`bg-blue-50 border-l-4 border-blue-400 p-4 ${className}`}>
        <div className="flex">
          {showIcon && (
            <div className="flex-shrink-0">
              <Icon className="text-blue-400" />
            </div>
          )}
          <div className={showIcon ? "ml-3" : ""}>
            <p className="text-sm text-blue-700">
              <strong className="font-medium">Unofficial Fan Site Notice:</strong>{' '}
              This website is not affiliated with, endorsed by, or sponsored by Bandai Namco Entertainment Inc.
              This is an independent fan-created resource for the Gundam Card Game community.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'modal') {
    return (
      <div className={`bg-white rounded-lg p-6 shadow-lg ${className}`}>
        <div className="flex items-start">
          {showIcon && (
            <div className="flex-shrink-0">
              <Icon className="text-blue-500 mt-1" />
            </div>
          )}
          <div className={showIcon ? "ml-4" : ""}>
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Independent Fan Website
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                This website is <strong>not an official Bandai Namco Entertainment product</strong>.
                We are an independent, fan-created resource developed by and for the Gundam Card Game community.
              </p>
              <p>
                <strong>We are not:</strong>
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Affiliated with Bandai Namco Entertainment Inc.</li>
                <li>Endorsed or sponsored by Bandai Namco Entertainment Inc.</li>
                <li>An official source for game rules or card information</li>
                <li>Responsible for official game support or customer service</li>
              </ul>
              <p>
                <strong>We are:</strong> A community-driven platform created to help players
                organize their collections, build decks, and connect with other fans of the game.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`text-xs text-gray-500 ${className}`}>
        <p>
          <strong>Disclaimer:</strong> This is an unofficial fan website. We are not affiliated with,
          endorsed by, or sponsored by Bandai Namco Entertainment Inc. This site is created and
          maintained by fans for educational and community purposes.
        </p>
      </div>
    );
  }

  // Default inline variant
  return (
    <div className={`flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200 ${className}`}>
      {showIcon && (
        <div className="flex-shrink-0 mt-0.5">
          <Icon className="text-gray-600" />
        </div>
      )}
      <div className="text-sm text-gray-700">
        <p className="font-medium text-gray-900 mb-1">
          Independent Fan Website
        </p>
        <p>
          This website is not affiliated with, endorsed by, or sponsored by{' '}
          <strong>Bandai Namco Entertainment Inc.</strong> We are an independent,
          fan-created resource for the Gundam Card Game community, developed for
          educational and community-building purposes.
        </p>
        <p className="mt-2 text-xs text-gray-600">
          For official game information, rules, and support, please visit the official
          Bandai Namco Entertainment website.
        </p>
      </div>
    </div>
  );
};

export default NonAffiliationStatement;