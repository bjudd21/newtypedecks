/**
 * Terms of Service Component
 *
 * Displays terms of service and usage guidelines
 * for the Newtype Decks platform
 */

import React from 'react';

interface TermsOfServiceProps {
  className?: string;
  variant?: 'page' | 'footer' | 'inline' | 'summary';
  showLastUpdated?: boolean;
}

export const TermsOfService: React.FC<TermsOfServiceProps> = ({
  className = '',
  variant = 'inline',
  showLastUpdated = true,
}) => {
  const currentDate = new Date().toLocaleDateString();

  if (variant === 'footer') {
    return (
      <div className={`text-foreground text-sm ${className}`}>
        <h4 className="text-foreground mb-2 font-semibold">Terms of Use</h4>
        <ul className="space-y-1 text-xs">
          <li>• Community-driven, educational use only</li>
          <li>• Respect intellectual property rights</li>
          <li>• No commercial use without permission</li>
          <li>• Report violations or concerns</li>
        </ul>
        {showLastUpdated && (
          <p className="text-muted-foreground mt-2 text-xs">
            Last updated: {currentDate}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'summary') {
    return (
      <div
        className={`rounded-lg border border-blue-200 bg-blue-50 p-4 ${className}`}
      >
        <h4 className="mb-2 text-sm font-medium text-blue-800">
          Terms Summary
        </h4>
        <ul className="space-y-1 text-sm text-blue-700">
          <li>• This is a free, community-driven educational resource</li>
          <li>• Content is for personal, non-commercial use only</li>
          <li>• Be respectful in community interactions</li>
          <li>• Report any copyright or usage concerns</li>
        </ul>
      </div>
    );
  }

  if (variant === 'page') {
    return (
      <div
        className={`border-border bg-card rounded-lg border p-6 shadow-sm ${className}`}
      >
        <div className="mx-auto max-w-4xl">
          <h2 className="text-foreground mb-6 text-2xl font-bold">
            Terms of Service
          </h2>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h3 className="text-foreground mb-4 text-lg font-semibold">
                Acceptance of Terms
              </h3>
              <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> By using this website, you agree
                  to these terms. If you don&apos;t agree, please don&apos;t use
                  the site.
                </p>
              </div>
              <p className="text-muted-foreground">
                Welcome to Newtype Decks, a community-driven resource for
                players and fans. These terms govern your use of our website and
                services.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-foreground mb-4 text-lg font-semibold">
                Website Purpose
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <h4 className="mb-2 font-medium text-green-800">
                    ✅ Permitted Uses
                  </h4>
                  <ul className="space-y-1 text-sm text-green-700">
                    <li>• Personal deck building and planning</li>
                    <li>• Educational game strategy discussion</li>
                    <li>• Community interaction and sharing</li>
                    <li>• Research and reference purposes</li>
                    <li>• Fair use commentary and analysis</li>
                  </ul>
                </div>
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <h4 className="mb-2 font-medium text-red-800">
                    ❌ Prohibited Uses
                  </h4>
                  <ul className="space-y-1 text-sm text-red-700">
                    <li>• Commercial use without permission</li>
                    <li>• Redistributing copyrighted content</li>
                    <li>• Automated data scraping</li>
                    <li>• Creating competing services</li>
                    <li>• Harassment or inappropriate content</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-foreground mb-4 text-lg font-semibold">
                User Accounts
              </h3>
              <div className="space-y-4">
                <div className="bg-accent rounded-lg p-4">
                  <h4 className="text-foreground mb-2 font-medium">
                    Account Responsibilities
                  </h4>
                  <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                    <li>Keep your login information secure and confidential</li>
                    <li>Use accurate information when creating your account</li>
                    <li>Notify us immediately of any security breaches</li>
                    <li>
                      You&apos;re responsible for all activity under your
                      account
                    </li>
                  </ul>
                </div>
                <div className="rounded-lg bg-blue-50 p-4">
                  <h4 className="mb-2 font-medium text-blue-900">
                    Account Termination
                  </h4>
                  <p className="text-sm text-blue-800">
                    We reserve the right to suspend or terminate accounts that
                    violate these terms. You can delete your account at any time
                    through your account settings.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-foreground mb-4 text-lg font-semibold">
                Intellectual Property
              </h3>
              <div className="space-y-4">
                <div className="border-border rounded-lg border p-4">
                  <h4 className="text-foreground mb-2 font-medium">
                    🎮 Game Content
                  </h4>
                  <p className="text-muted-foreground mb-2 text-sm">
                    All card images, game rules, and official content are owned
                    by
                    <strong> Bandai Namco Entertainment Inc.</strong> and used
                    under fair use provisions.
                  </p>
                  <ul className="text-muted-foreground list-inside list-disc space-y-1 text-xs">
                    <li>We claim no ownership of copyrighted game content</li>
                    <li>Content used for educational and reference purposes</li>
                    <li>Proper attribution provided where applicable</li>
                  </ul>
                </div>
                <div className="border-border rounded-lg border p-4">
                  <h4 className="text-foreground mb-2 font-medium">
                    💻 Website Content
                  </h4>
                  <p className="text-muted-foreground mb-2 text-sm">
                    The website design, code, and original content are
                    community-created and may be subject to open-source
                    licensing.
                  </p>
                </div>
                <div className="border-border rounded-lg border p-4">
                  <h4 className="text-foreground mb-2 font-medium">
                    👤 User-Generated Content
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Deck builds, comments, and other user contributions remain
                    your property, but you grant us permission to display and
                    share them on the platform.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-foreground mb-4 text-lg font-semibold">
                Community Guidelines
              </h3>
              <div className="border-border bg-card rounded-lg border p-4">
                <h4 className="text-foreground mb-3 font-medium">
                  Be Respectful
                </h4>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li className="flex items-start space-x-2">
                    <span className="mt-0.5 text-green-500">✓</span>
                    <span>Help other players learn and improve</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="mt-0.5 text-green-500">✓</span>
                    <span>Share constructive feedback and strategies</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="mt-0.5 text-green-500">✓</span>
                    <span>Report bugs or issues constructively</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="mt-0.5 text-red-500">✗</span>
                    <span>No harassment, spam, or inappropriate content</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="mt-0.5 text-red-500">✗</span>
                    <span>No sharing of pirated or unauthorized content</span>
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-foreground mb-4 text-lg font-semibold">
                Disclaimers
              </h3>
              <div className="space-y-3">
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                  <h4 className="mb-2 font-medium text-yellow-800">
                    ⚠️ Service Availability
                  </h4>
                  <p className="text-sm text-yellow-700">
                    This is a community project provided &quot;as is&quot;
                    without warranties. We cannot guarantee 100% uptime or data
                    preservation.
                  </p>
                </div>
                <div className="border-border bg-accent rounded-lg border p-4">
                  <h4 className="text-foreground mb-2 font-medium">
                    📝 Accuracy
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    While we strive for accuracy, card information may contain
                    errors. Always refer to official sources for tournament
                    play.
                  </p>
                </div>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <h4 className="mb-2 font-medium text-blue-800">
                    🔗 External Links
                  </h4>
                  <p className="text-sm text-blue-700">
                    We&apos;re not responsible for content on external websites
                    linked from our site.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-foreground mb-4 text-lg font-semibold">
                Changes to Terms
              </h3>
              <div className="bg-accent rounded-lg p-4">
                <p className="text-muted-foreground mb-2 text-sm">
                  We may update these terms occasionally to reflect changes in
                  our services or legal requirements. Significant changes will
                  be announced on the website.
                </p>
                <p className="text-muted-foreground text-sm">
                  Continued use of the website after changes constitutes
                  acceptance of the new terms.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-foreground mb-4 text-lg font-semibold">
                Contact Information
              </h3>
              <div className="bg-accent rounded-lg p-4">
                <p className="text-muted-foreground mb-2 text-sm">
                  Questions about these terms or our services?
                </p>
                <p className="text-muted-foreground text-sm">
                  This is a community project. For questions or concerns, please
                  check the project&apos;s documentation or contact the
                  maintainers through official channels.
                </p>
              </div>
            </section>
          </div>

          {showLastUpdated && (
            <div className="border-border mt-8 border-t pt-6">
              <p className="text-muted-foreground/70 text-xs">
                <strong>Last Updated:</strong> {currentDate} |
                <strong> Effective Date:</strong> {currentDate}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default inline variant
  return (
    <div
      className={`border-border bg-accent rounded-lg border p-4 ${className}`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <svg
            className="text-muted-foreground h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="text-foreground mb-2 text-sm font-medium">
            Terms of Service
          </h4>
          <div className="text-muted-foreground space-y-2 text-sm">
            <p>
              <strong>Purpose:</strong> This website is a community resource for
              educational and personal use. Commercial use is prohibited.
            </p>
            <p>
              <strong>Content:</strong> All game-specific content is owned by
              the respective publishers and used under fair use provisions.
            </p>
            <p>
              <strong>Community:</strong> Be respectful and constructive in all
              interactions. Report any issues or violations.
            </p>
          </div>
          {showLastUpdated && (
            <p className="text-muted-foreground/70 mt-3 text-xs">
              Last updated: {currentDate}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
