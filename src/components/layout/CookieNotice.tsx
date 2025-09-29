'use client';

/**
 * Cookie Notice Component
 *
 * Displays cookie usage information and consent management
 * for the Gundam Card Game website
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
  showDeclineOption = true
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
      <div className={`bg-white rounded-lg border border-gray-200 shadow-sm p-6 ${className}`}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Cookie Policy</h2>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What Are Cookies?</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-700">
                  Cookies are small text files stored on your device that help websites remember
                  your preferences and improve your browsing experience.
                </p>
              </div>
              <p className="text-gray-700">
                We use cookies to enhance your experience on our Gundam Card Game website,
                remember your preferences, and provide personalized features.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Types of Cookies We Use</h3>
              <div className="space-y-4">
                <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">✅ Essential Cookies (Always Active)</h4>
                  <p className="text-sm text-green-700 mb-2">
                    These cookies are necessary for the website to function properly.
                  </p>
                  <ul className="text-sm text-green-600 space-y-1">
                    <li>• <strong>Authentication:</strong> Keep you logged in</li>
                    <li>• <strong>Security:</strong> Protect against unauthorized access</li>
                    <li>• <strong>Preferences:</strong> Remember your UI settings</li>
                    <li>• <strong>Session:</strong> Maintain your current session</li>
                  </ul>
                </div>

                <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">📊 Analytics Cookies (Optional)</h4>
                  <p className="text-sm text-blue-700 mb-2">
                    Help us understand how you use the website to improve it.
                  </p>
                  <ul className="text-sm text-blue-600 space-y-1">
                    <li>• <strong>Usage Analytics:</strong> Track page views and popular features</li>
                    <li>• <strong>Performance:</strong> Monitor website speed and errors</li>
                    <li>• <strong>User Journey:</strong> Understand navigation patterns</li>
                  </ul>
                  <p className="text-xs text-blue-600 mt-2">
                    <em>Note: All analytics data is anonymized and aggregated.</em>
                  </p>
                </div>

                <div className="border border-purple-200 bg-purple-50 rounded-lg p-4">
                  <h4 className="font-medium text-purple-800 mb-2">🎯 Functional Cookies (Optional)</h4>
                  <p className="text-sm text-purple-700 mb-2">
                    Enhance your experience with personalized features.
                  </p>
                  <ul className="text-sm text-purple-600 space-y-1">
                    <li>• <strong>Deck Preferences:</strong> Remember your deck building settings</li>
                    <li>• <strong>Search History:</strong> Provide search suggestions</li>
                    <li>• <strong>Display Options:</strong> Remember card view preferences</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cookie Management</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Browser Settings</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    You can control cookies through your browser settings:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>Block all cookies (may break website functionality)</li>
                    <li>Block third-party cookies only</li>
                    <li>Delete existing cookies</li>
                    <li>Set cookies to expire when you close your browser</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">⚠️ Important Note</h4>
                  <p className="text-sm text-yellow-700">
                    Disabling essential cookies may prevent core website features from working,
                    such as staying logged in or saving your deck builds.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Choices</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700 mb-4">
                  Current consent status: <span className="font-medium">
                    {cookieConsent === 'accepted' ? '✅ Accepted' :
                     cookieConsent === 'declined' ? '❌ Declined' : '⏳ Not Set'}
                  </span>
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleAccept}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Accept All Cookies
                  </button>
                  {showDeclineOption && (
                    <button
                      onClick={handleDecline}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                    >
                      Essential Cookies Only
                    </button>
                  )}
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  Questions about our cookie policy? This is a community project.
                  Please refer to the project documentation or contact the maintainers
                  through the official channels.
                </p>
              </div>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`border border-gray-200 rounded-lg p-4 bg-gray-50 ${className}`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Cookie Information</h4>
            <div className="text-sm text-gray-700 space-y-2">
              <p>
                We use cookies to enhance your experience, remember your preferences,
                and provide personalized features.
              </p>
              <div className="space-y-1">
                <p><strong>Essential:</strong> Required for login and basic functionality</p>
                <p><strong>Analytics:</strong> Help us improve the website (optional)</p>
                <p><strong>Functional:</strong> Remember your preferences (optional)</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Current status: {cookieConsent || 'Not set'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Default banner variant
  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 shadow-lg z-50 ${className}`}>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex-1 mr-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">We use cookies</h4>
                <p className="text-sm text-gray-300">
                  We use essential cookies for functionality and optional cookies to improve your experience.
                  You can choose which types to allow.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleAccept}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Accept All
            </button>
            {showDeclineOption && (
              <button
                onClick={handleDecline}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
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