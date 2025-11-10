/**
 * Privacy Notice Component
 *
 * Displays privacy information and data handling practices
 * for user data in the Gundam Card Game website
 */

import React from 'react';

interface PrivacyNoticeProps {
  className?: string;
  variant?: 'banner' | 'page' | 'footer' | 'inline';
  showContactInfo?: boolean;
}

export const PrivacyNotice: React.FC<PrivacyNoticeProps> = ({
  className = '',
  variant = 'inline',
  showContactInfo = true
}) => {
  const currentDate = new Date().toLocaleDateString();

  if (variant === 'banner') {
    return (
      <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-800">
              Privacy Information
            </h3>
            <p className="mt-1 text-sm text-blue-700">
              We respect your privacy. This website stores minimal data locally for functionality
              and does not share personal information with third parties.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`text-sm text-gray-300 ${className}`}>
        <h4 className="font-semibold text-white mb-2">Privacy & Data</h4>
        <ul className="space-y-1 text-xs">
          <li>• Account data stored securely</li>
          <li>• No personal data shared with third parties</li>
          <li>• Optional analytics for site improvement</li>
          <li>• Local storage for user preferences</li>
        </ul>
        <p className="text-xs text-gray-400 mt-2">
          Last updated: {currentDate}
        </p>
      </div>
    );
  }

  if (variant === 'page') {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 shadow-sm p-6 ${className}`}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy Notice</h2>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Collection</h3>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-700">
                  <strong>What we collect:</strong> Account information (email, username),
                  deck builds, collection data, and basic usage analytics.
                </p>
              </div>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Account Data:</strong> Email address, username, and password (encrypted)</li>
                <li><strong>Game Data:</strong> Your saved decks, collection information, and preferences</li>
                <li><strong>Usage Data:</strong> Basic analytics to improve site functionality (optional)</li>
                <li><strong>Technical Data:</strong> Browser information for compatibility and performance</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How We Use Your Data</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">✅ What We Do</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Store your decks and collections</li>
                    <li>• Provide personalized features</li>
                    <li>• Improve site performance</li>
                    <li>• Send account-related emails</li>
                  </ul>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-800 mb-2">❌ What We Don&apos;t Do</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Sell your personal information</li>
                    <li>• Share data with third parties</li>
                    <li>• Send promotional emails</li>
                    <li>• Track you across other sites</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Rights</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700 mb-3">
                  You have full control over your data:
                </p>
                <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
                  <li><strong>Access:</strong> View all data we have about you</li>
                  <li><strong>Modify:</strong> Update your account information anytime</li>
                  <li><strong>Delete:</strong> Remove your account and all associated data</li>
                  <li><strong>Export:</strong> Download your deck and collection data</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Security</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Encryption</p>
                    <p className="text-sm text-gray-600">All passwords and sensitive data are encrypted</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Secure Storage</p>
                    <p className="text-sm text-gray-600">Data stored on secure, monitored servers</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Regular Backups</p>
                    <p className="text-sm text-gray-600">Your data is backed up regularly to prevent loss</p>
                  </div>
                </div>
              </div>
            </section>

            {showContactInfo && (
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 mb-2">
                    Questions about this privacy notice or your data?
                  </p>
                  <p className="text-sm text-gray-600">
                    This is a community project. For privacy concerns, please check the project&apos;s
                    GitHub repository or contact the maintainers through the official channels.
                  </p>
                </div>
              </section>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              <strong>Last Updated:</strong> {currentDate} |
              <strong> Effective Date:</strong> {currentDate}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Default inline variant
  return (
    <div className={`border border-gray-200 rounded-lg p-4 bg-gray-50 ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Privacy Information</h4>
          <div className="text-sm text-gray-700 space-y-2">
            <p>
              <strong>Data Collection:</strong> We collect only essential information needed for
              account management and site functionality (email, username, game data).
            </p>
            <p>
              <strong>Data Usage:</strong> Your information is used solely to provide our services
              and is never shared with third parties or used for marketing.
            </p>
            <p>
              <strong>Your Rights:</strong> You can access, modify, or delete your data at any time
              through your account settings.
            </p>
          </div>
          {showContactInfo && (
            <p className="text-xs text-gray-500 mt-3">
              Last updated: {currentDate}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivacyNotice;