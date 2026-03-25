'use client';

/**
 * Cookie Notice Component
 *
 * Displays cookie usage information and consent management
 * for the Newtype Decks platform
 */

import React, { useState, useEffect } from 'react';

interface CookieNoticeProps {
  className?: string;
  variant?: 'banner' | 'inline' | 'page';
  onAccept?: () => void;
  onDecline?: () => void;
  showDeclineOption?: boolean;
}

export const CookieNotice: React.FC<CookieNoticeProps> = ({
  className = '',
  variant = 'banner',
  onAccept,
  onDecline,
  showDeclineOption = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [cookieConsent, setCookieConsent] = useState<string | null>(null);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    setCookieConsent(consent);

    // Show banner if no consent has been given and we're using banner variant
    if (!consent && variant === 'banner') {
      setIsVisible(true);
    }
  }, [variant]);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setCookieConsent('accepted');
    setIsVisible(false);
    onAccept?.();
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setCookieConsent('declined');
    setIsVisible(false);
    onDecline?.();
  };

  if (variant === 'banner' && (!isVisible || cookieConsent)) {
    return null;
  }

  if (variant === 'page') {
    return (
      <div
        className={`border-border bg-card rounded-lg border p-6 shadow-sm ${className}`}
      >
        <div className="mx-auto max-w-4xl">
          <h2 className="text-foreground mb-6 text-2xl font-bold">
            Cookie Policy
          </h2>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h3 className="text-foreground mb-4 text-lg font-semibold">
                What Are Cookies?
              </h3>
              <div className="border-border bg-accent mb-4 rounded-lg border p-4">
                <p className="text-muted-foreground text-sm">
                  Cookies are small text files stored on your device that help
                  websites remember your preferences and improve your browsing
                  experience.
                </p>
              </div>
              <p className="text-muted-foreground">
                We use cookies to enhance your experience on our Gundam Card
                Game website, remember your preferences, and provide
                personalized features.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-foreground mb-4 text-lg font-semibold">
                Types of Cookies We Use
              </h3>
              <div className="space-y-4">
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <h4 className="mb-2 font-medium text-green-800">
                    ✅ Essential Cookies (Always Active)
                  </h4>
                  <p className="mb-2 text-sm text-green-700">
                    These cookies are necessary for the website to function
                    properly.
                  </p>
                  <ul className="space-y-1 text-sm text-green-600">
                    <li>
                      • <strong>Authentication:</strong> Keep you logged in
                    </li>
                    <li>
                      • <strong>Security:</strong> Protect against unauthorized
                      access
                    </li>
                    <li>
                      • <strong>Preferences:</strong> Remember your UI settings
                    </li>
                    <li>
                      • <strong>Session:</strong> Maintain your current session
                    </li>
                  </ul>
                </div>

                <div className="border-border bg-accent rounded-lg border p-4">
                  <h4 className="text-muted-foreground mb-2 font-medium">
                    📊 Analytics Cookies (Optional)
                  </h4>
                  <p className="text-muted-foreground mb-2 text-sm">
                    Help us understand how you use the website to improve it.
                  </p>
                  <ul className="text-primary space-y-1 text-sm">
                    <li>
                      • <strong>Usage Analytics:</strong> Track page views and
                      popular features
                    </li>
                    <li>
                      • <strong>Performance:</strong> Monitor website speed and
                      errors
                    </li>
                    <li>
                      • <strong>User Journey:</strong> Understand navigation
                      patterns
                    </li>
                  </ul>
                  <p className="text-primary mt-2 text-xs">
                    <em>
                      Note: All analytics data is anonymized and aggregated.
                    </em>
                  </p>
                </div>

                <div className="border-border bg-card rounded-lg border p-4">
                  <h4 className="text-foreground mb-2 font-medium">
                    🎯 Functional Cookies (Optional)
                  </h4>
                  <p className="text-muted-foreground mb-2 text-sm">
                    Enhance your experience with personalized features.
                  </p>
                  <ul className="text-primary space-y-1 text-sm">
                    <li>
                      • <strong>Deck Preferences:</strong> Remember your deck
                      building settings
                    </li>
                    <li>
                      • <strong>Search History:</strong> Provide search
                      suggestions
                    </li>
                    <li>
                      • <strong>Display Options:</strong> Remember card view
                      preferences
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-foreground mb-4 text-lg font-semibold">
                Cookie Management
              </h3>
              <div className="space-y-4">
                <div className="bg-accent rounded-lg p-4">
                  <h4 className="text-foreground mb-2 font-medium">
                    Browser Settings
                  </h4>
                  <p className="text-muted-foreground mb-2 text-sm">
                    You can control cookies through your browser settings:
                  </p>
                  <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                    <li>Block all cookies (may break website functionality)</li>
                    <li>Block third-party cookies only</li>
                    <li>Delete existing cookies</li>
                    <li>Set cookies to expire when you close your browser</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                  <h4 className="mb-2 font-medium text-yellow-800">
                    ⚠️ Important Note
                  </h4>
                  <p className="text-sm text-yellow-700">
                    Disabling essential cookies may prevent core website
                    features from working, such as staying logged in or saving
                    your deck builds.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-foreground mb-4 text-lg font-semibold">
                Your Choices
              </h3>
              <div className="border-border bg-accent rounded-lg border p-4">
                <p className="text-muted-foreground mb-4 text-sm">
                  Current consent status:{' '}
                  <span className="font-medium">
                    {cookieConsent === 'accepted'
                      ? '✅ Accepted'
                      : cookieConsent === 'declined'
                        ? '❌ Declined'
                        : '⏳ Not Set'}
                  </span>
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleAccept}
                    className="bg-primary rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    Accept All Cookies
                  </button>
                  {showDeclineOption && (
                    <button
                      onClick={handleDecline}
                      className="hover:bg-secondary bg-muted text-foreground rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                    >
                      Essential Cookies Only
                    </button>
                  )}
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-foreground mb-4 text-lg font-semibold">
                Contact Information
              </h3>
              <div className="bg-accent rounded-lg p-4">
                <p className="text-muted-foreground text-sm">
                  Questions about our cookie policy? This is a community
                  project. Please refer to the project documentation or contact
                  the maintainers through the official channels.
                </p>
              </div>
            </section>
          </div>

          <div className="border-border mt-8 border-t pt-6">
            <p className="text-muted-foreground/70 text-xs">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
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
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-foreground mb-2 text-sm font-medium">
              Cookie Information
            </h4>
            <div className="text-muted-foreground space-y-2 text-sm">
              <p>
                We use cookies to enhance your experience, remember your
                preferences, and provide personalized features.
              </p>
              <div className="space-y-1">
                <p>
                  <strong>Essential:</strong> Required for login and basic
                  functionality
                </p>
                <p>
                  <strong>Analytics:</strong> Help us improve the website
                  (optional)
                </p>
                <p>
                  <strong>Functional:</strong> Remember your preferences
                  (optional)
                </p>
              </div>
            </div>
            <p className="text-muted-foreground/70 mt-3 text-xs">
              Current status: {cookieConsent || 'Not set'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Default banner variant
  return (
    <div
      className={`bg-background text-foreground fixed right-0 bottom-0 left-0 z-50 p-4 shadow-lg ${className}`}
    >
      <div className="container mx-auto">
        <div className="flex flex-col items-start justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
          <div className="mr-4 flex-1">
            <div className="flex items-start space-x-3">
              <div className="mt-1 flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="mb-1 text-sm font-medium">We use cookies</h4>
                <p className="text-foreground text-sm">
                  We use essential cookies for functionality and optional
                  cookies to improve your experience. You can choose which types
                  to allow.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleAccept}
              className="bg-primary rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Accept All
            </button>
            {showDeclineOption && (
              <button
                onClick={handleDecline}
                className="hover:bg-secondary bg-muted text-foreground rounded-lg px-4 py-2 text-sm font-medium transition-colors"
              >
                Essential Only
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieNotice;
