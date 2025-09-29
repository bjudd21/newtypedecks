'use client';

/**
 * Legal Compliance Footer Component
 *
 * Comprehensive footer containing all legal notices, copyright information,
 * and compliance statements required for the Gundam Card Game website
 */

import React, { useState } from 'react';
import { CopyrightDisclaimer } from './CopyrightDisclaimer';
import { NonAffiliationStatement } from './NonAffiliationStatement';

interface LegalComplianceFooterProps {
  className?: string;
  variant?: 'full' | 'compact' | 'minimal';
  showExpandableDetails?: boolean;
}

export const LegalComplianceFooter: React.FC<LegalComplianceFooterProps> = ({
  className = '',
  variant = 'full',
  showExpandableDetails = true
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const currentYear = new Date().getFullYear();

  if (variant === 'minimal') {
    return (
      <footer className={`bg-gray-900 text-white py-4 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <CopyrightDisclaimer variant="compact" className="text-gray-300" />
            <div className="mt-2 text-xs text-gray-400">
              This is an unofficial fan site not affiliated with Bandai Namco Entertainment Inc.
            </div>
          </div>
        </div>
      </footer>
    );
  }

  if (variant === 'compact') {
    return (
      <footer className={`bg-gray-800 text-white py-6 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-3">Legal Information</h4>
              <CopyrightDisclaimer variant="footer" className="text-gray-300" />
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Website Disclaimer</h4>
              <NonAffiliationStatement variant="footer" className="text-gray-300" showIcon={false} />
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-600 text-center">
            <p className="text-sm text-gray-400">
              © {currentYear} Gundam Card Game Community Website.
              Built by fans, for fans. Not affiliated with Bandai Namco Entertainment Inc.
            </p>
          </div>
        </div>
      </footer>
    );
  }

  // Full variant - comprehensive legal footer
  return (
    <footer className={`bg-gray-900 text-white ${className}`}>
      <div className="container mx-auto px-4">
        {/* Main footer content */}
        <div className="py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Website Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Gundam Card Game Database</h3>
              <p className="text-gray-300 text-sm mb-4">
                An unofficial community resource for Gundam Card Game players.
                Build decks, manage collections, and connect with fellow pilots.
              </p>
              <div className="space-y-2">
                <p className="text-xs text-gray-400">
                  <strong>Purpose:</strong> Educational & Community
                </p>
                <p className="text-xs text-gray-400">
                  <strong>Status:</strong> Independent Fan Project
                </p>
                <p className="text-xs text-gray-400">
                  <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Quick Legal Summary */}
            <div>
              <h4 className="text-md font-semibold mb-4">Legal Summary</h4>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-start space-x-2">
                  <span className="text-red-400 mt-1">⚠️</span>
                  <p>Not affiliated with Bandai Namco Entertainment Inc.</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-400 mt-1">©️</span>
                  <p>All card content owned by Bandai Namco Entertainment</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-400 mt-1">📚</span>
                  <p>Content used under fair use for educational purposes</p>
                </div>
              </div>
            </div>

            {/* Legal Links & Resources */}
            <div>
              <h4 className="text-md font-semibold mb-4">Legal & Resources</h4>
              <div className="space-y-3">
                <div>
                  <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Legal Information</h5>
                  <div className="space-y-1 text-sm">
                    <a
                      href="/privacy"
                      className="block text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Privacy Policy
                    </a>
                    <a
                      href="/terms"
                      className="block text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Terms of Service
                    </a>
                    <a
                      href="/cookies"
                      className="block text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Cookie Policy
                    </a>
                  </div>
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Official Resources</h5>
                  <a
                    href="https://www.bandainamcoent.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-400 hover:text-blue-300 transition-colors text-sm"
                  >
                    → Bandai Namco Entertainment
                  </a>
                  <p className="text-gray-400 text-xs mt-1">
                    For official rules and tournaments
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Legal Details */}
        {showExpandableDetails && (
          <div className="border-t border-gray-700">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full py-4 text-left text-sm text-gray-400 hover:text-white transition-colors flex items-center justify-between"
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isExpanded && (
              <div className="pb-6 space-y-6">
                <div>
                  <h5 className="font-semibold text-white mb-3">Copyright Information</h5>
                  <CopyrightDisclaimer variant="full" className="bg-gray-800 border-gray-600" />
                </div>

                <div>
                  <h5 className="font-semibold text-white mb-3">Non-Affiliation Statement</h5>
                  <NonAffiliationStatement variant="inline" className="bg-gray-800 border-gray-600" />
                </div>

                <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
                  <h5 className="font-semibold text-white mb-3">Fair Use Statement</h5>
                  <div className="text-sm text-gray-300 space-y-2">
                    <p>
                      This website operates under fair use provisions of copyright law for the following purposes:
                    </p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li><strong>Educational:</strong> Teaching game mechanics and strategy</li>
                      <li><strong>Reference:</strong> Providing searchable card database</li>
                      <li><strong>Commentary:</strong> Community discussion and analysis</li>
                      <li><strong>Transformative:</strong> Deck building and collection tools</li>
                    </ul>
                    <p className="text-xs text-gray-400 mt-3">
                      We respect intellectual property rights and will promptly address any concerns
                      from copyright holders.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
            <div>
              © {currentYear} Community-built Gundam Card Game Database.
              Not affiliated with Bandai Namco Entertainment Inc.
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