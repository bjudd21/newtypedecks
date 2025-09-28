/**
 * Deck Recommendations Page
 * Provides personalized deck suggestions based on user preferences
 */

'use client';

import React, { useState, useEffect } from 'react';
import { DeckRecommendations, PreferencesSetup } from '@/components/deck';
import { Card, CardContent, Button } from '@/components/ui';
import type { UserPreferences } from '@/lib/services/deckRecommendationService';
import { useAuth } from '@/hooks';

export default function DeckRecommendationsPage() {
  const { isAuthenticated } = useAuth();
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    // Load preferences from localStorage if available
    const savedPreferences = localStorage.getItem('userDeckPreferences');
    if (savedPreferences) {
      try {
        setUserPreferences(JSON.parse(savedPreferences));
      } catch (error) {
        console.error('Failed to parse saved preferences:', error);
      }
    }
  }, []);

  const handleSavePreferences = (preferences: UserPreferences) => {
    setUserPreferences(preferences);
    setShowSetup(false);

    // Save to localStorage
    localStorage.setItem('userDeckPreferences', JSON.stringify(preferences));

    // TODO: Save to server if user is authenticated
    if (isAuthenticated) {
      // saveUserPreferences(preferences);
    }
  };

  const handleEditPreferences = () => {
    setShowSetup(true);
  };

  if (showSetup) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <PreferencesSetup
          initialPreferences={userPreferences || undefined}
          onSave={handleSavePreferences}
          onCancel={() => setShowSetup(false)}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Deck Recommendations
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Get personalized deck suggestions based on your play style, preferences, and collection.
        </p>

        {/* Preferences Summary */}
        {userPreferences && (
          <Card className="mb-6">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Your Preferences</h3>
                <Button onClick={handleEditPreferences} variant="outline" size="sm">
                  Edit Preferences
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Play Style</div>
                  <div className="font-medium capitalize">{userPreferences.playStyle}</div>
                </div>
                <div>
                  <div className="text-gray-600">Competitive Level</div>
                  <div className="font-medium capitalize">{userPreferences.competitiveLevel}</div>
                </div>
                <div>
                  <div className="text-gray-600">Cost Range</div>
                  <div className="font-medium">{userPreferences.preferredCostRange[0]}-{userPreferences.preferredCostRange[1]}</div>
                </div>
                <div>
                  <div className="text-gray-600">Deck Size</div>
                  <div className="font-medium capitalize">{userPreferences.deckSizePreference}</div>
                </div>
                <div>
                  <div className="text-gray-600">Complexity</div>
                  <div className="font-medium capitalize">{userPreferences.complexityPreference}</div>
                </div>
                <div>
                  <div className="text-gray-600">Favorite Types</div>
                  <div className="font-medium">{userPreferences.favoriteTypes.length || 'Any'}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recommendations */}
      <DeckRecommendations
        userPreferences={userPreferences || undefined}
        onPreferencesChange={(prefs) => setShowSetup(true)}
      />

      {/* Getting Started Guide */}
      {!userPreferences && (
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How Deck Recommendations Work</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Personalized Suggestions</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">1.</span>
                  Tell us your play style and preferences
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">2.</span>
                  We analyze thousands of competitive decks
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">3.</span>
                  Get recommendations tailored to your style
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">4.</span>
                  See which cards you're missing from your collection
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Smart Features</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>🎯 Match percentage based on your preferences</li>
                <li>⚔️ Estimated winrates for different skill levels</li>
                <li>💡 Detailed reasons for each recommendation</li>
                <li>📊 Archetype suggestions for new strategies</li>
                <li>🔧 Upgrade suggestions for existing decks</li>
                <li>📈 Meta-game position and trends</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="text-blue-600 text-xl">💡</div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Pro Tip</h4>
                <p className="text-blue-800 text-sm">
                  The more specific your preferences, the better our recommendations will be. You can always
                  update your preferences later as your play style evolves.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Authentication Benefits */}
      {!isAuthenticated && (
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
          <div className="flex items-start gap-4">
            <div className="text-purple-600 text-2xl">✨</div>
            <div>
              <h4 className="font-semibold text-purple-900 mb-2">Enhanced Recommendations with an Account</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <ul className="space-y-1 text-sm text-purple-800">
                    <li>• Collection-based recommendations</li>
                    <li>• Missing card calculations</li>
                    <li>• Saved preferences across devices</li>
                  </ul>
                </div>
                <div>
                  <ul className="space-y-1 text-sm text-purple-800">
                    <li>• Deck upgrade suggestions</li>
                    <li>• Personal winrate tracking</li>
                    <li>• Community deck sharing</li>
                  </ul>
                </div>
              </div>
              <Button className="mt-4" variant="outline" size="sm">
                Sign Up for Free
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}