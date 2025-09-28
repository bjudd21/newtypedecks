'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui';
import type { UserPreferences } from '@/lib/services/deckRecommendationService';

interface PreferencesSetupProps {
  initialPreferences?: UserPreferences;
  onSave: (preferences: UserPreferences) => void;
  onCancel?: () => void;
  className?: string;
}

export const PreferencesSetup: React.FC<PreferencesSetupProps> = ({
  initialPreferences,
  onSave,
  onCancel,
  className
}) => {
  const [preferences, setPreferences] = useState<UserPreferences>(
    initialPreferences || {
      playStyle: 'balanced',
      favoriteTypes: [],
      favoriteFactions: [],
      preferredCostRange: [1, 6],
      competitiveLevel: 'casual',
      deckSizePreference: 'standard',
      complexityPreference: 'moderate'
    }
  );

  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 6;

  const cardTypes = [
    'Mobile Suit',
    'Command',
    'Character',
    'Event',
    'Equipment',
    'Location'
  ];

  const factions = [
    'Earth Federation',
    'Zeon',
    'AEUG',
    'Titans',
    'Neo Zeon',
    'Celestial Being',
    'A-Laws',
    'Innovators'
  ];

  const handleTypeToggle = (type: string) => {
    setPreferences(prev => ({
      ...prev,
      favoriteTypes: prev.favoriteTypes.includes(type)
        ? prev.favoriteTypes.filter(t => t !== type)
        : [...prev.favoriteTypes, type]
    }));
  };

  const handleFactionToggle = (faction: string) => {
    setPreferences(prev => ({
      ...prev,
      favoriteFactions: prev.favoriteFactions.includes(faction)
        ? prev.favoriteFactions.filter(f => f !== faction)
        : [...prev.favoriteFactions, faction]
    }));
  };

  const handleCostRangeChange = (index: number, value: number) => {
    setPreferences(prev => {
      const newRange = [...prev.preferredCostRange] as [number, number];
      newRange[index] = value;
      // Ensure min <= max
      if (index === 0 && value > newRange[1]) {
        newRange[1] = value;
      } else if (index === 1 && value < newRange[0]) {
        newRange[0] = value;
      }
      return { ...prev, preferredCostRange: newRange };
    });
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = () => {
    onSave(preferences);
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 0: return 'Play Style';
      case 1: return 'Favorite Card Types';
      case 2: return 'Favorite Factions';
      case 3: return 'Cost Preference';
      case 4: return 'Competitive Level';
      case 5: return 'Deck Preferences';
      default: return 'Setup';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Deck Preferences Setup</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Step {currentStep + 1} of {totalSteps}
            </span>
            {onCancel && (
              <Button onClick={onCancel} variant="outline" size="sm">
                Cancel
              </Button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {getStepTitle(currentStep)}
          </h3>

          {/* Step 0: Play Style */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                What play style do you enjoy most? This helps us recommend decks that match your preferred strategy.
              </p>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { value: 'aggressive', label: 'Aggressive', desc: 'Fast-paced, high-pressure strategies that aim for quick wins' },
                  { value: 'control', label: 'Control', desc: 'Defensive strategies with removal and late-game threats' },
                  { value: 'midrange', label: 'Midrange', desc: 'Balanced approach with efficient threats and answers' },
                  { value: 'combo', label: 'Combo', desc: 'Synergy-based strategies with powerful card interactions' },
                  { value: 'balanced', label: 'Balanced', desc: 'Flexible strategies that can adapt to different situations' }
                ].map(style => (
                  <label key={style.value} className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="playStyle"
                      value={style.value}
                      checked={preferences.playStyle === style.value}
                      onChange={(e) => setPreferences(prev => ({ ...prev, playStyle: e.target.value as any }))}
                      className="mt-1 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{style.label}</div>
                      <div className="text-sm text-gray-600">{style.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Favorite Card Types */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Which card types do you enjoy using? Select as many as you like.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {cardTypes.map(type => (
                  <label key={type} className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={preferences.favoriteTypes.includes(type)}
                      onChange={() => handleTypeToggle(type)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-900">{type}</span>
                  </label>
                ))}
              </div>
              {preferences.favoriteTypes.length === 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  Skip this step if you don't have specific type preferences
                </p>
              )}
            </div>
          )}

          {/* Step 2: Favorite Factions */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Which factions interest you most? This helps us recommend thematically consistent decks.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {factions.map(faction => (
                  <label key={faction} className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={preferences.favoriteFactions.includes(faction)}
                      onChange={() => handleFactionToggle(faction)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-900">{faction}</span>
                  </label>
                ))}
              </div>
              {preferences.favoriteFactions.length === 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  Skip this step if you don't have specific faction preferences
                </p>
              )}
            </div>
          )}

          {/* Step 3: Cost Preference */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                What cost range do you prefer for your cards? Lower costs mean faster plays, higher costs mean more powerful effects.
              </p>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Cost: {preferences.preferredCostRange[0]}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={preferences.preferredCostRange[0]}
                    onChange={(e) => handleCostRangeChange(0, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Cost: {preferences.preferredCostRange[1]}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={preferences.preferredCostRange[1]}
                    onChange={(e) => handleCostRangeChange(1, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Your preferred cost range: <strong>{preferences.preferredCostRange[0]} - {preferences.preferredCostRange[1]}</strong>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Competitive Level */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                How competitively do you want to play? This affects the types of decks we recommend.
              </p>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { value: 'casual', label: 'Casual', desc: 'Fun, thematic decks for friendly games' },
                  { value: 'competitive', label: 'Competitive', desc: 'Strong decks for local tournaments and events' },
                  { value: 'tournament', label: 'Tournament', desc: 'Top-tier decks for serious competitive play' }
                ].map(level => (
                  <label key={level.value} className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="competitiveLevel"
                      value={level.value}
                      checked={preferences.competitiveLevel === level.value}
                      onChange={(e) => setPreferences(prev => ({ ...prev, competitiveLevel: e.target.value as any }))}
                      className="mt-1 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{level.label}</div>
                      <div className="text-sm text-gray-600">{level.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Deck Preferences */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <p className="text-sm text-gray-600 mb-4">
                Final preferences for deck building and complexity.
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deck Size Preference
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'minimal', label: 'Minimal', desc: '40-50 cards' },
                    { value: 'standard', label: 'Standard', desc: '50-60 cards' },
                    { value: 'large', label: 'Large', desc: '60+ cards' }
                  ].map(size => (
                    <label key={size.value} className="flex flex-col items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="deckSizePreference"
                        value={size.value}
                        checked={preferences.deckSizePreference === size.value}
                        onChange={(e) => setPreferences(prev => ({ ...prev, deckSizePreference: e.target.value as any }))}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <div className="text-center">
                        <div className="font-medium text-sm text-gray-900">{size.label}</div>
                        <div className="text-xs text-gray-600">{size.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Complexity Preference
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'simple', label: 'Simple', desc: 'Easy to play' },
                    { value: 'moderate', label: 'Moderate', desc: 'Some complexity' },
                    { value: 'complex', label: 'Complex', desc: 'Advanced strategies' }
                  ].map(complexity => (
                    <label key={complexity.value} className="flex flex-col items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="complexityPreference"
                        value={complexity.value}
                        checked={preferences.complexityPreference === complexity.value}
                        onChange={(e) => setPreferences(prev => ({ ...prev, complexityPreference: e.target.value as any }))}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <div className="text-center">
                        <div className="font-medium text-sm text-gray-900">{complexity.label}</div>
                        <div className="text-xs text-gray-600">{complexity.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            onClick={prevStep}
            variant="outline"
            disabled={currentStep === 0}
          >
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {currentStep === totalSteps - 1 ? (
            <Button onClick={handleSave} variant="primary">
              Save Preferences
            </Button>
          ) : (
            <Button onClick={nextStep} variant="primary">
              Next
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PreferencesSetup;