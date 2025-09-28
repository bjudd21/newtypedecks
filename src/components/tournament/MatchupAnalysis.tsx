'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import {
  tournamentPrepService,
  type TournamentDeck,
  type MatchupAnalysis as MatchupData
} from '@/lib/services/tournamentPrepService';

interface MatchupAnalysisProps {
  deck: TournamentDeck;
  className?: string;
}

export const MatchupAnalysis: React.FC<MatchupAnalysisProps> = ({
  deck,
  className
}) => {
  const [matchups, setMatchups] = useState<MatchupData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMatchup, setSelectedMatchup] = useState<MatchupData | null>(null);
  const [metaArchetypes] = useState([
    'Aggro Rush',
    'Control Lock',
    'Midrange Value',
    'Combo Engine'
  ]);

  useEffect(() => {
    if (deck.mainDeck.length > 0) {
      loadMatchupAnalysis();
    }
  }, [deck]);

  const loadMatchupAnalysis = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await tournamentPrepService.analyzeMatchups(deck, metaArchetypes);
      setMatchups(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze matchups');
    } finally {
      setIsLoading(false);
    }
  };

  const getWinrateColor = (winrate: number) => {
    if (winrate >= 65) return 'text-green-600 bg-green-100';
    if (winrate >= 55) return 'text-blue-600 bg-blue-100';
    if (winrate >= 45) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getMatchupRating = (winrate: number) => {
    if (winrate >= 65) return { rating: 'Favored', icon: '💪' };
    if (winrate >= 55) return { rating: 'Slightly Favored', icon: '👍' };
    if (winrate >= 45) return { rating: 'Even', icon: '⚖️' };
    return { rating: 'Unfavored', icon: '😬' };
  };

  if (deck.mainDeck.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="text-center py-8">
          <div className="text-gray-600">
            <div className="text-4xl mb-2">🎯</div>
            <p>Add cards to your deck to see matchup analysis</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Matchup Analysis</CardTitle>
            <Button
              onClick={loadMatchupAnalysis}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              {isLoading ? 'Analyzing...' : 'Refresh Analysis'}
            </Button>
          </div>
          <div className="text-sm text-gray-600">
            Expected performance against common archetypes
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Analyzing matchups...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-600 mb-4">⚠️</div>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={loadMatchupAnalysis} variant="outline" size="sm">
                Try Again
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Matchup Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {matchups.map((matchup) => {
                  const { rating, icon } = getMatchupRating(matchup.winrateEstimate);
                  return (
                    <div
                      key={matchup.opponent.archetype}
                      className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setSelectedMatchup(matchup)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{matchup.opponent.archetype}</h4>
                        <div className="text-lg">{icon}</div>
                      </div>

                      <div className={`text-center p-2 rounded-md ${getWinrateColor(matchup.winrateEstimate)}`}>
                        <div className="font-bold">{matchup.winrateEstimate}%</div>
                        <div className="text-xs">{rating}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Overall Analysis */}
              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Overall Meta Position</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Favorable Matchups</div>
                      <div className="font-medium text-green-600">
                        {matchups.filter(m => m.winrateEstimate >= 55).length} / {matchups.length}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Even Matchups</div>
                      <div className="font-medium text-yellow-600">
                        {matchups.filter(m => m.winrateEstimate >= 45 && m.winrateEstimate < 55).length} / {matchups.length}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Unfavorable Matchups</div>
                      <div className="font-medium text-red-600">
                        {matchups.filter(m => m.winrateEstimate < 45).length} / {matchups.length}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-gray-600 text-sm mb-2">Average Winrate</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-500 h-3 rounded-full"
                          style={{ width: `${matchups.reduce((sum, m) => sum + m.winrateEstimate, 0) / matchups.length}%` }}
                        />
                      </div>
                      <span className="font-medium">
                        {Math.round(matchups.reduce((sum, m) => sum + m.winrateEstimate, 0) / matchups.length)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Matchup View */}
              {selectedMatchup && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-blue-900">
                        vs {selectedMatchup.opponent.archetype}
                      </CardTitle>
                      <Button
                        onClick={() => setSelectedMatchup(null)}
                        variant="outline"
                        size="sm"
                      >
                        Close
                      </Button>
                    </div>
                    <div className="text-sm text-blue-700">
                      {selectedMatchup.opponent.description}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Gameplan */}
                      <div>
                        <h5 className="font-medium text-blue-900 mb-3">Gameplan</h5>

                        <div className="space-y-4">
                          <div>
                            <h6 className="text-sm font-medium text-blue-800 mb-2">On the Play</h6>
                            <ul className="text-sm text-blue-700 space-y-1">
                              {selectedMatchup.gameplan.onPlay.map((tip, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-blue-500">•</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h6 className="text-sm font-medium text-blue-800 mb-2">On the Draw</h6>
                            <ul className="text-sm text-blue-700 space-y-1">
                              {selectedMatchup.gameplan.onDraw.map((tip, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-blue-500">•</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {selectedMatchup.gameplan.keyCards.length > 0 && (
                            <div>
                              <h6 className="text-sm font-medium text-blue-800 mb-2">Key Cards</h6>
                              <div className="flex flex-wrap gap-1">
                                {selectedMatchup.gameplan.keyCards.slice(0, 5).map((card, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {card.name}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Play Tips */}
                      <div>
                        <h5 className="font-medium text-blue-900 mb-3">Play Tips</h5>

                        <ul className="text-sm text-blue-700 space-y-2">
                          {selectedMatchup.playTips.map((tip, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-blue-500 text-lg">💡</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Opponent Strategy */}
                        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                          <h6 className="text-sm font-medium text-blue-800 mb-2">Their Strategy</h6>
                          <p className="text-sm text-blue-700">{selectedMatchup.opponent.strategy}</p>
                        </div>
                      </div>
                    </div>

                    {/* Sideboarding */}
                    {selectedMatchup.sideboarding.cardsIn.length > 0 || selectedMatchup.sideboarding.cardsOut.length > 0 ? (
                      <div className="mt-6 border-t border-blue-200 pt-4">
                        <h5 className="font-medium text-blue-900 mb-3">Sideboard Plan</h5>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedMatchup.sideboarding.cardsIn.length > 0 && (
                            <div>
                              <h6 className="text-sm font-medium text-green-800 mb-2 flex items-center gap-2">
                                <span className="text-green-600">+</span> Bring In
                              </h6>
                              <div className="space-y-2">
                                {selectedMatchup.sideboarding.cardsIn.map((change, index) => (
                                  <div key={index} className="text-sm bg-green-50 border border-green-200 rounded p-2">
                                    <div className="font-medium text-green-800">
                                      +{change.quantity} {change.card.name}
                                    </div>
                                    <div className="text-green-600 text-xs">{change.reason}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {selectedMatchup.sideboarding.cardsOut.length > 0 && (
                            <div>
                              <h6 className="text-sm font-medium text-red-800 mb-2 flex items-center gap-2">
                                <span className="text-red-600">-</span> Take Out
                              </h6>
                              <div className="space-y-2">
                                {selectedMatchup.sideboarding.cardsOut.map((change, index) => (
                                  <div key={index} className="text-sm bg-red-50 border border-red-200 rounded p-2">
                                    <div className="font-medium text-red-800">
                                      -{change.quantity} {change.card.name}
                                    </div>
                                    <div className="text-red-600 text-xs">{change.reason}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {selectedMatchup.sideboarding.priorityOrder.length > 0 && (
                          <div className="mt-4">
                            <h6 className="text-sm font-medium text-blue-800 mb-2">Priority Order</h6>
                            <ol className="text-sm text-blue-700 space-y-1">
                              {selectedMatchup.sideboarding.priorityOrder.map((priority, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-blue-500 font-medium">{index + 1}.</span>
                                  <span>{priority}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mt-6 border-t border-blue-200 pt-4">
                        <div className="text-center text-blue-600">
                          <div className="text-2xl mb-2">🎲</div>
                          <p className="text-sm">No specific sideboard changes recommended</p>
                          <p className="text-xs">Your main deck should perform well as-is</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MatchupAnalysis;