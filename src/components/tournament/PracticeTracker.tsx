'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import {
  tournamentPrepService,
  type TournamentDeck,
  type PracticeMatch,
  type PracticeRound
} from '@/lib/services/tournamentPrepService';

interface PracticeTrackerProps {
  deck: TournamentDeck;
  className?: string;
}

export const PracticeTracker: React.FC<PracticeTrackerProps> = ({
  deck,
  className
}) => {
  const [practiceMatches, setPracticeMatches] = useState<PracticeMatch[]>([]);
  const [currentMatch, setCurrentMatch] = useState<PracticeMatch | null>(null);
  const [showNewMatchForm, setShowNewMatchForm] = useState(false);
  const [selectedOpponent, setSelectedOpponent] = useState('');

  const commonArchetypes = [
    'Aggro Rush',
    'Control Lock',
    'Midrange Value',
    'Combo Engine',
    'Artifact Ramp',
    'Token Swarm',
    'Prison Control'
  ];

  useEffect(() => {
    // Load practice matches from localStorage
    const savedMatches = localStorage.getItem(`practiceMatches_${deck.name}`);
    if (savedMatches) {
      try {
        const matches = JSON.parse(savedMatches);
        setPracticeMatches(matches);
        const ongoing = matches.find((m: PracticeMatch) => m.result === 'ongoing');
        if (ongoing) setCurrentMatch(ongoing);
      } catch (error) {
        console.error('Failed to load practice matches:', error);
      }
    }
  }, [deck.name]);

  const savePracticeMatches = (matches: PracticeMatch[]) => {
    localStorage.setItem(`practiceMatches_${deck.name}`, JSON.stringify(matches));
    setPracticeMatches(matches);
  };

  const startNewMatch = () => {
    if (!selectedOpponent) return;

    const newMatch = tournamentPrepService.createPracticeMatch(deck, selectedOpponent);
    setCurrentMatch(newMatch);
    setShowNewMatchForm(false);
    setSelectedOpponent('');

    const updatedMatches = [...practiceMatches, newMatch];
    savePracticeMatches(updatedMatches);
  };

  const recordGameResult = (
    result: 'win' | 'loss' | 'draw',
    onPlay: boolean,
    duration: number,
    keyMoments: string[] = []
  ) => {
    if (!currentMatch) return;

    const updatedMatch = tournamentPrepService.recordPracticeRound(
      currentMatch,
      result,
      onPlay,
      duration,
      keyMoments
    );

    const updatedMatches = practiceMatches.map(m =>
      m.id === updatedMatch.id ? updatedMatch : m
    );

    savePracticeMatches(updatedMatches);
    setCurrentMatch(updatedMatch.result === 'ongoing' ? updatedMatch : null);
  };

  const getMatchResultColor = (result: string) => {
    switch (result) {
      case 'win': return 'text-green-600 bg-green-100';
      case 'loss': return 'text-red-600 bg-red-100';
      case 'draw': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const calculateStats = () => {
    const completedMatches = practiceMatches.filter(m => m.result !== 'ongoing');
    const totalMatches = completedMatches.length;
    const wins = completedMatches.filter(m => m.result === 'win').length;
    const winrate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;

    const archeyipeStats = commonArchetypes.map(archetype => {
      const matchesVsArchetype = completedMatches.filter(m => m.opponentArchetype === archetype);
      const winsVsArchetype = matchesVsArchetype.filter(m => m.result === 'win').length;
      const winrateVsArchetype = matchesVsArchetype.length > 0
        ? Math.round((winsVsArchetype / matchesVsArchetype.length) * 100)
        : 0;

      return {
        archetype,
        matches: matchesVsArchetype.length,
        wins: winsVsArchetype,
        winrate: winrateVsArchetype
      };
    }).filter(stat => stat.matches > 0);

    return { totalMatches, wins, winrate, archeyipeStats };
  };

  const stats = calculateStats();

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Practice Tracker</CardTitle>
            <div className="flex gap-2">
              {currentMatch && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Match in Progress
                </Badge>
              )}
              <Button
                onClick={() => setShowNewMatchForm(!showNewMatchForm)}
                variant={currentMatch ? 'outline' : 'primary'}
                size="sm"
                disabled={!!currentMatch}
              >
                {currentMatch ? 'Finish Current Match' : 'New Practice Match'}
              </Button>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Track your practice games to improve tournament performance
          </div>
        </CardHeader>
        <CardContent>
          {/* New Match Form */}
          {showNewMatchForm && (
            <Card className="mb-6 bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <h4 className="font-medium text-blue-900 mb-3">Start New Practice Match</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-800 mb-2">
                      Opponent Archetype
                    </label>
                    <select
                      value={selectedOpponent}
                      onChange={(e) => setSelectedOpponent(e.target.value)}
                      className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select opponent archetype...</option>
                      {commonArchetypes.map(archetype => (
                        <option key={archetype} value={archetype}>
                          {archetype}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end gap-2">
                    <Button
                      onClick={startNewMatch}
                      variant="primary"
                      size="sm"
                      disabled={!selectedOpponent}
                    >
                      Start Match
                    </Button>
                    <Button
                      onClick={() => setShowNewMatchForm(false)}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Current Match */}
          {currentMatch && (
            <Card className="mb-6 border-green-200 bg-green-50">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-green-900">
                    vs {currentMatch.opponentArchetype} (Game {currentMatch.rounds.length + 1})
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <span>Record:</span>
                    {currentMatch.rounds.map((round, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className={`text-xs ${getMatchResultColor(round.playerResult)}`}
                      >
                        G{round.roundNumber}: {round.playerResult}
                      </Badge>
                    ))}
                  </div>
                </div>

                <GameRecorder
                  gameNumber={currentMatch.rounds.length + 1}
                  onRecordGame={recordGameResult}
                />

                {/* Match Notes */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-green-800 mb-1">
                    Match Notes
                  </label>
                  <textarea
                    value={currentMatch.notes}
                    onChange={(e) => {
                      const updatedMatch = { ...currentMatch, notes: e.target.value };
                      setCurrentMatch(updatedMatch);
                      const updatedMatches = practiceMatches.map(m =>
                        m.id === updatedMatch.id ? updatedMatch : m
                      );
                      savePracticeMatches(updatedMatches);
                    }}
                    placeholder="Key learnings, mistakes, good plays..."
                    className="w-full px-3 py-2 border border-green-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Practice Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="pt-4">
                <h4 className="font-medium text-gray-900 mb-4">Overall Statistics</h4>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{stats.totalMatches}</div>
                    <div className="text-xs text-gray-600">Matches</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.wins}</div>
                    <div className="text-xs text-gray-600">Wins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.winrate}%</div>
                    <div className="text-xs text-gray-600">Win Rate</div>
                  </div>
                </div>

                {stats.totalMatches > 0 && (
                  <div>
                    <div className="text-sm text-gray-700 mb-2">Win Rate Progress</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${stats.winrate}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{stats.winrate}%</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="pt-4">
                <h4 className="font-medium text-gray-900 mb-4">Matchup Breakdown</h4>

                {stats.archeyipeStats.length === 0 ? (
                  <div className="text-center py-4 text-gray-600">
                    <p className="text-sm">No matches recorded yet</p>
                    <p className="text-xs">Start practicing to see your performance breakdown</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {stats.archeyipeStats.map((stat) => (
                      <div key={stat.archetype} className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">{stat.archetype}</div>
                          <div className="text-xs text-gray-600">{stat.matches} matches</div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${
                            stat.winrate >= 60 ? 'text-green-600' :
                            stat.winrate >= 40 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {stat.wins}-{stat.matches - stat.wins}
                          </div>
                          <div className="text-xs text-gray-600">{stat.winrate}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Matches */}
          {practiceMatches.length > 0 && (
            <Card className="mt-6">
              <CardContent className="pt-4">
                <h4 className="font-medium text-gray-900 mb-4">Recent Matches</h4>

                <div className="space-y-3">
                  {practiceMatches
                    .slice(-5)
                    .reverse()
                    .map((match) => (
                      <div key={match.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Badge
                              variant="outline"
                              className={getMatchResultColor(match.result)}
                            >
                              {match.result.toUpperCase()}
                            </Badge>
                            <span className="font-medium">vs {match.opponentArchetype}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {new Date(match.startTime).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-600">Games:</span>
                          {match.rounds.map((round, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className={`text-xs ${getMatchResultColor(round.playerResult)}`}
                            >
                              {round.playerResult}
                            </Badge>
                          ))}
                        </div>

                        {match.notes && (
                          <div className="mt-2 text-sm text-gray-600 bg-gray-50 rounded p-2">
                            {match.notes}
                          </div>
                        )}
                      </div>
                    ))}
                </div>

                {practiceMatches.length > 5 && (
                  <div className="mt-4 text-center">
                    <Button variant="outline" size="sm">
                      View All Matches ({practiceMatches.length})
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

interface GameRecorderProps {
  gameNumber: number;
  onRecordGame: (result: 'win' | 'loss' | 'draw', onPlay: boolean, duration: number, keyMoments?: string[]) => void;
}

const GameRecorder: React.FC<GameRecorderProps> = ({ gameNumber, onRecordGame }) => {
  const [duration, setDuration] = useState(15);
  const [onPlay, setOnPlay] = useState(true);
  const [keyMoments, setKeyMoments] = useState('');

  const handleRecordResult = (result: 'win' | 'loss' | 'draw') => {
    const moments = keyMoments.split('\n').filter(m => m.trim().length > 0);
    onRecordGame(result, onPlay, duration, moments);

    // Reset form for next game
    setDuration(15);
    setOnPlay(gameNumber === 1 ? !onPlay : result === 'loss'); // Loser plays next game
    setKeyMoments('');
  };

  return (
    <div className="border-t border-green-200 pt-4">
      <h5 className="font-medium text-green-800 mb-3">Record Game {gameNumber}</h5>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-green-700 mb-1">
            Duration (minutes)
          </label>
          <input
            type="number"
            min="1"
            max="60"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value) || 15)}
            className="w-full px-3 py-2 border border-green-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-green-700 mb-1">
            On Play/Draw
          </label>
          <div className="flex gap-2">
            <label className="flex items-center">
              <input
                type="radio"
                checked={onPlay}
                onChange={() => setOnPlay(true)}
                className="text-green-600 focus:ring-green-500"
              />
              <span className="ml-1 text-sm">On Play</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={!onPlay}
                onChange={() => setOnPlay(false)}
                className="text-green-600 focus:ring-green-500"
              />
              <span className="ml-1 text-sm">On Draw</span>
            </label>
          </div>
        </div>

        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-green-700 mb-1">
            Key Moments
          </label>
          <textarea
            value={keyMoments}
            onChange={(e) => setKeyMoments(e.target.value)}
            placeholder="One per line..."
            className="w-full px-3 py-2 border border-green-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={2}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => handleRecordResult('win')}
          variant="primary"
          size="sm"
          className="bg-green-600 hover:bg-green-700"
        >
          Record Win
        </Button>
        <Button
          onClick={() => handleRecordResult('loss')}
          variant="outline"
          size="sm"
          className="border-red-300 text-red-600 hover:bg-red-50"
        >
          Record Loss
        </Button>
        <Button
          onClick={() => handleRecordResult('draw')}
          variant="outline"
          size="sm"
          className="border-yellow-300 text-yellow-600 hover:bg-yellow-50"
        >
          Record Draw
        </Button>
      </div>
    </div>
  );
};

export default PracticeTracker;