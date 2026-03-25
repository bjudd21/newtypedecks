'use client';

/**
 * Legal Compliance Footer Component
 *
 * Comprehensive footer containing all legal notices, copyright information,
 * and compliance statements for the platform
 */

import React, { useState } from 'react';
import { CopyrightDisclaimer } from './CopyrightDisclaimer';
import { NonAffiliationStatement } from './NonAffiliationStatement';

interface LegalComplianceFooterProps {
  className?: string;
  variant?: 'full' | 'compact' | 'minimal';
  showExpandableDetails?: boolean;
  /** Game name (e.g. from game.name). Falls back to generic text. */
  gameName?: string | null;
  /** Publisher name (e.g. from game.copyrightHolder). Falls back to generic text. */
  publisher?: string | null;
}

export const LegalComplianceFooter: React.FC<LegalComplianceFooterProps> = ({
  className = '',
  variant = 'full',
  showExpandableDetails = true,
  gameName,
  publisher,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const currentYear = new Date().getFullYear();
  const publisherName = publisher ?? 'Bandai Namco Entertainment Inc.';
  const gameLabel = gameName ?? 'Card Game';

  if (variant === 'minimal') {
    return (
      <footer className={`bg-background py-4 text-white ${className}`}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <CopyrightDisclaimer
              variant="compact"
              className="text-foreground"
              gameName={gameName}
              publisher={publisher}
            />
            <div className="text-muted-foreground mt-2 text-xs">
              This is an unofficial fan site not affiliated with {publisherName}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  if (variant === 'compact') {
    return (
      <footer className={`bg-card py-6 text-white ${className}`}>
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="mb-3 font-semibold text-white">
                Legal Information
              </h4>
              <CopyrightDisclaimer
                variant="footer"
                className="text-foreground"
                gameName={gameName}
                publisher={publisher}
              />
            </div>
            <div>
              <h4 className="mb-3 font-semibold text-white">
                Website Disclaimer
              </h4>
              <NonAffiliationStatement
                variant="footer"
                className="text-foreground"
                showIcon={false}
                gameName={gameName}
                publisher={publisher}
              />
            </div>
          </div>
          <div className="border-border mt-6 border-t pt-6 text-center">
            <p className="text-muted-foreground text-sm">
              © {currentYear} {gameLabel} Community Website. Built by fans, for
              fans. Not affiliated with {publisherName}
            </p>
          </div>
        </div>
      </footer>
    );
  }

  // Full variant - comprehensive legal footer
  return (
    <footer className={`bg-background text-white ${className}`}>
      <div className="container mx-auto px-4">
        {/* Main footer content */}
        <div className="py-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Website Information */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">
                {gameLabel} Database
              </h3>
              <p className="text-foreground mb-4 text-sm">
                An unofficial community resource for {gameLabel} players. Build
                decks, manage collections, and connect with fellow pilots.
              </p>
              <div className="space-y-2">
                <p className="text-muted-foreground text-xs">
                  <strong>Purpose:</strong> Educational &amp; Community
                </p>
                <p className="text-muted-foreground text-xs">
                  <strong>Status:</strong> Independent Fan Project
                </p>
                <p className="text-muted-foreground text-xs">
                  <strong>Last Updated:</strong>{' '}
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Quick Legal Summary */}
            <div>
              <h4 className="text-md mb-4 font-semibold">Legal Summary</h4>
              <div className="text-foreground space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <span className="mt-1 text-red-400">⚠️</span>
                  <p>Not affiliated with {publisherName}</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="mt-1 text-blue-400">©️</span>
                  <p>All card content owned by {publisherName}</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="mt-1 text-green-400">📚</span>
                  <p>Content used under fair use for educational purposes</p>
                </div>
              </div>
            </div>

            {/* Legal Links & Resources */}
            <div>
              <h4 className="text-md mb-4 font-semibold">
                Legal &amp; Resources
              </h4>
              <div className="space-y-3">
                <div>
                  <h5 className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
                    Legal Information
                  </h5>
                  <div className="space-y-1 text-sm">
                    <a
                      href="/privacy"
                      className="block text-blue-400 transition-colors hover:text-blue-300"
                    >
                      Privacy Policy
                    </a>
                    <a
                      href="/terms"
                      className="block text-blue-400 transition-colors hover:text-blue-300"
                    >
                      Terms of Service
                    </a>
                    <a
                      href="/cookies"
                      className="block text-blue-400 transition-colors hover:text-blue-300"
                    >
                      Cookie Policy
                    </a>
                  </div>
                </div>
                <div>
                  <h5 className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
                    Official Resources
                  </h5>
                  <a
                    href="https://www.bandainamcoent.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-blue-400 transition-colors hover:text-blue-300"
                  >
                    → {publisherName}
                  </a>
                  <p className="text-muted-foreground mt-1 text-xs">
                    For official rules and tournaments
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Legal Details */}
        {showExpandableDetails && (
          <div className="border-border border-t">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-muted-foreground hover:text-foreground flex w-full items-center justify-between py-4 text-left text-sm transition-colors"
              aria-expanded={isExpanded}
            >
              <span>
                {isExpanded ? 'Hide' : 'Show'} Detailed Legal Information
              </span>
              <svg
                className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isExpanded && (
              <div className="space-y-6 pb-6">
                <div>
                  <h5 className="mb-3 font-semibold text-white">
                    Copyright Information
                  </h5>
                  <CopyrightDisclaimer
                    variant="full"
                    className="border-border bg-card"
                    gameName={gameName}
                    publisher={publisher}
                  />
                </div>

                <div>
                  <h5 className="mb-3 font-semibold text-white">
                    Non-Affiliation Statement
                  </h5>
                  <NonAffiliationStatement
                    variant="inline"
                    className="border-border bg-card"
                    gameName={gameName}
                    publisher={publisher}
                  />
                </div>

                <div className="border-border bg-card rounded-lg border p-4">
                  <h5 className="mb-3 font-semibold text-white">
                    Fair Use Statement
                  </h5>
                  <div className="text-foreground space-y-2 text-sm">
                    <p>
                      This website operates under fair use provisions of
                      copyright law for the following purposes:
                    </p>
                    <ul className="ml-4 list-inside list-disc space-y-1">
                      <li>
                        <strong>Educational:</strong> Teaching game mechanics
                        and strategy
                      </li>
                      <li>
                        <strong>Reference:</strong> Providing searchable card
                        database
                      </li>
                      <li>
                        <strong>Commentary:</strong> Community discussion and
                        analysis
                      </li>
                      <li>
                        <strong>Transformative:</strong> Deck building and
                        collection tools
                      </li>
                    </ul>
                    <p className="text-muted-foreground mt-3 text-xs">
                      We respect intellectual property rights and will promptly
                      address any concerns from copyright holders.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Bar */}
        <div className="border-border border-t py-4">
          <div className="text-muted-foreground flex flex-col items-center justify-between text-xs md:flex-row">
            <div>
              © {currentYear} Community-built {gameLabel} Database. Not
              affiliated with {publisherName}
            </div>
            <div className="mt-2 md:mt-0">
              Built with ❤️ by the community, for the community
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LegalComplianceFooter;
