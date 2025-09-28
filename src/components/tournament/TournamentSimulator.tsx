'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import {
  tournamentPrepService,
  type TournamentDeck,
  type TournamentSimulation,
  type TournamentFormat
} from '@/lib/services/tournamentPrepService';

interface TournamentSimulatorProps {
  deck: TournamentDeck;
  className?: string;
}

export const TournamentSimulator: React.FC<TournamentSimulatorProps> = ({
  deck,
  className
}) => {
  const [simulation, setSimulation] = useState<TournamentSimulation | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [rounds, setRounds] = useState(5);
  const [selectedFormat, setSelectedFormat] = useState('standard');
  const [availableFormats, setAvailableFormats] = useState<TournamentFormat[]>([]);
  const [metaBreakdown, setMetaBreakdown] = useState({
    'Aggro Rush': 25,
    'Control Lock': 20,
    'Midrange Value': 18,
    'Combo Engine': 15,
    'Artifact Ramp': 12,
    'Token Swarm': 10
  });

  React.useEffect(() => {
    const formats = tournamentPrepService.getAvailableFormats();
    setAvailableFormats(formats);
  }, []);

  const runSimulation = async () => {
    setIsSimulating(true);

    try {
      const format = availableFormats.find(f => f.name.toLowerCase() === selectedFormat) || availableFormats[0];
      const result = await tournamentPrepService.simulateTournament(
        deck,
        format,
        rounds,
        metaBreakdown
      );
      setSimulation(result);
    } catch (error) {
      console.error('Simulation failed:', error);
    } finally {
      setIsSimulating(false);
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'win': return 'text-green-600 bg-green-100';
      case 'loss': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getPlacementColor = (placement: number, totalPlayers: number) => {
    const percentile = placement / totalPlayers;
    if (percentile <= 0.1) return 'text-purple-600 bg-purple-100'; // Top 10%
    if (percentile <= 0.25) return 'text-green-600 bg-green-100'; // Top 25%
    if (percentile <= 0.5) return 'text-blue-600 bg-blue-100'; // Top 50%
    if (percentile <= 0.75) return 'text-yellow-600 bg-yellow-100'; // Top 75%
    return 'text-red-600 bg-red-100'; // Bottom 25%
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Tournament Simulator</CardTitle>
          <div className="text-sm text-gray-600">
            Simulate your deck's performance in tournament conditions
          </div>
        </CardHeader>
        <CardContent>
          {/* Simulation Setup */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tournament Format
                </label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {availableFormats.map(format => (
                    <option key={format.name.toLowerCase()} value={format.name.toLowerCase()}>
                      {format.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Rounds
                </label>
                <select
                  value={rounds}
                  onChange={(e) => setRounds(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={3}>3 Rounds (Small Tournament)</option>
                  <option value={5}>5 Rounds (Standard)</option>
                  <option value={7}>7 Rounds (Large Tournament)</option>
                  <option value={9}>9 Rounds (Major Event)</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={runSimulation}
                  variant="primary"
                  disabled={isSimulating || deck.mainDeck.length === 0}
                  className="w-full"
                >
                  {isSimulating ? 'Simulating...' : 'Run Simulation'}
                </Button>
              </div>
            </div>

            {/* Meta Breakdown */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <h4 className="font-medium text-blue-900 mb-3">Expected Meta Breakdown</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(metaBreakdown).map(([archetype, percentage]) => (
                    <div key={archetype} className="flex items-center justify-between">
                      <span className="text-sm text-blue-800">{archetype}</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="range"
                          min="0"
                          max="40"
                          value={percentage}
                          onChange={(e) => setMetaBreakdown(prev => ({
                            ...prev,
                            [archetype]: parseInt(e.target.value)
                          }))}
                          className="w-16"
                        />
                        <span className="text-sm font-medium text-blue-900 w-8">
                          {percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Simulation Loading */}
          {isSimulating && (
            <Card className="mb-6">
              <CardContent className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Running tournament simulation...</p>
                  <p className="text-sm text-gray-500">This may take a few moments</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Simulation Results */}
          {simulation && (
            <div className="space-y-6">
              {/* Overall Results */}
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-4">
                  <h4 className="font-medium text-green-900 mb-4">Tournament Results</h4>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {simulation.results.filter(r => r.result === 'win').length}-
                        {simulation.results.filter(r => r.result === 'loss').length}
                      </div>
                      <div className="text-sm text-green-700">Match Record</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round(simulation.overallWinrate)}%
                      </div>
                      <div className="text-sm text-green-700">Win Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {simulation.expectedPlacement.average}
                      </div>
                      <div className="text-sm text-green-700">Expected Place</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.pow(2, simulation.rounds)}
                      </div>
                      <div className="text-sm text-green-700">Total Players</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-green-700">Placement Range:</div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Best Case:</span>
                      <Badge className={getPlacementColor(simulation.expectedPlacement.min, Math.pow(2, simulation.rounds))}>
                        #{simulation.expectedPlacement.min}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Expected:</span>
                      <Badge className={getPlacementColor(simulation.expectedPlacement.average, Math.pow(2, simulation.rounds))}>
                        #{simulation.expectedPlacement.average}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Worst Case:</span>
                      <Badge className={getPlacementColor(simulation.expectedPlacement.max, Math.pow(2, simulation.rounds))}>
                        #{simulation.expectedPlacement.max}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Round-by-Round Results */}
              <Card>
                <CardContent className="pt-4">
                  <h4 className="font-medium text-gray-900 mb-4">Round-by-Round Breakdown</h4>

                  <div className="space-y-3">
                    {simulation.results.map((result) => (
                      <div key={result.round} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="font-mono">
                              R{result.round}
                            </Badge>
                            <span className="font-medium">vs {result.opponent}</span>
                          </div>
                          <Badge
                            variant="outline"
                            className={getResultColor(result.result)}
                          >
                            {result.result.toUpperCase()}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Games:</span>
                          {result.games.map((game, index) => (
                            <div key={index} className="flex items-center gap-1">
                              <Badge
                                variant="outline"
                                className={`text-xs ${getResultColor(game.result)}`}
                              >
                                G{game.game}: {game.result}
                              </Badge>
                              {game.onPlay && (
                                <span className="text-xs text-blue-600" title="On the play">
                                  ▶️
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Analysis */}
              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="pt-4">
                  <h4 className="font-medium text-gray-900 mb-4">Performance Analysis</h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-sm font-medium text-gray-800 mb-3">Matchup Performance</h5>
                      <div className="space-y-2">
                        {Object.keys(metaBreakdown).map(archetype => {
                          const matches = simulation.results.filter(r => r.opponent === archetype);
                          const wins = matches.filter(r => r.result === 'win').length;
                          const winrate = matches.length > 0 ? Math.round((wins / matches.length) * 100) : 0;

                          if (matches.length === 0) return null;

                          return (
                            <div key={archetype} className="flex items-center justify-between text-sm">
                              <span>{archetype}</span>
                              <div className="flex items-center gap-2">
                                <span className={`font-medium ${
                                  winrate >= 60 ? 'text-green-600' :
                                  winrate >= 40 ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                  {wins}-{matches.length - wins}
                                </span>
                                <span className="text-gray-600">({winrate}%)</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-800 mb-3">Key Insights</h5>
                      <div className="space-y-2 text-sm">
                        {simulation.overallWinrate >= 65 && (
                          <div className="flex items-start gap-2 text-green-700">
                            <span>💪</span>
                            <span>Strong tournament performance - this deck is well-positioned!</span>
                          </div>
                        )}
                        {simulation.overallWinrate >= 50 && simulation.overallWinrate < 65 && (
                          <div className="flex items-start gap-2 text-blue-700">
                            <span>👍</span>
                            <span>Solid performance with room for optimization</span>
                          </div>
                        )}
                        {simulation.overallWinrate < 50 && (
                          <div className="flex items-start gap-2 text-orange-700">
                            <span>🔧</span>
                            <span>Consider adjustments to improve consistency</span>
                          </div>
                        )}

                        {simulation.expectedPlacement.average <= Math.pow(2, simulation.rounds) * 0.25 && (
                          <div className="flex items-start gap-2 text-purple-700">
                            <span>🏆</span>
                            <span>Expected to place in top 25% of tournament</span>
                          </div>
                        )}

                        <div className="flex items-start gap-2 text-gray-700">
                          <span>🎯</span>
                          <span>
                            Practice against {
                              Object.entries(
                                simulation.results.reduce((acc, r) => {
                                  acc[r.opponent] = (acc[r.opponent] || 0) + (r.result === 'loss' ? 1 : 0);
                                  return acc;
                                }, {} as Record<string, number>)
                              )
                                .sort(([,a], [,b]) => b - a)[0]?.[0] || 'various archetypes'
                            } for better results
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Simulation Settings */}
                  <div className="mt-6 pt-4 border-t border-gray-300">
                    <div className="text-xs text-gray-500">
                      Simulation based on {simulation.format.name} format with {simulation.rounds} rounds
                      using current meta percentages. Results are estimates based on deck analysis.
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <Button
                  onClick={runSimulation}
                  variant="outline"
                >
                  Run Another Simulation
                </Button>
                <Button
                  onClick={() => {
                    const data = {
                      deck: simulation.playerDeck.name,
                      format: simulation.format.name,
                      rounds: simulation.rounds,
                      winrate: simulation.overallWinrate,
                      placement: simulation.expectedPlacement.average,
                      results: simulation.results
                    };
                    navigator.clipboard?.writeText(JSON.stringify(data, null, 2));
                  }}
                  variant="outline"
                  size="sm"
                >
                  Copy Results
                </Button>
              </div>
            </div>
          )}

          {/* No Deck Warning */}
          {deck.mainDeck.length === 0 && (
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="text-center py-8">
                <div className="text-yellow-600 mb-4">
                  <div className="text-4xl mb-2">🃏</div>
                  <p className="font-medium">No Deck to Simulate</p>
                  <p className="text-sm">Add cards to your deck to run tournament simulations</p>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TournamentSimulator;