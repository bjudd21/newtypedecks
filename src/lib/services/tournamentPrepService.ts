import {
  deckAnalyticsService,
  type DeckAnalytics,
  type DeckCard,
} from './deckAnalyticsService';
import type { CardWithRelations } from '@/lib/types/card';

export interface TournamentDeck {
  mainDeck: DeckCard[];
  sideboard: DeckCard[];
  name: string;
  format: TournamentFormat;
  analytics?: DeckAnalytics;
}

export interface TournamentFormat {
  name: string;
  minDeckSize: number;
  maxDeckSize: number;
  sideboardSize: number;
  maxCopiesPerCard: number;
  bannedCards: string[];
  restrictedCards: { cardId: string; maxCopies: number }[];
  allowedSets?: string[];
}

export interface MatchupAnalysis {
  opponent: {
    archetype: string;
    description: string;
    commonCards: CardWithRelations[];
    strategy: string;
  };
  winrateEstimate: number;
  gameplan: {
    onPlay: string[];
    onDraw: string[];
    keyCards: CardWithRelations[];
    avoidCards: CardWithRelations[];
  };
  sideboarding: {
    cardsIn: { card: CardWithRelations; quantity: number; reason: string }[];
    cardsOut: { card: CardWithRelations; quantity: number; reason: string }[];
    priorityOrder: string[];
  };
  playTips: string[];
}

export interface TournamentValidation {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  format: TournamentFormat;
}

export interface ValidationError {
  type:
    | 'deck_size'
    | 'sideboard_size'
    | 'banned_card'
    | 'restricted_card'
    | 'max_copies'
    | 'invalid_format';
  message: string;
  cardId?: string;
  cardName?: string;
  currentValue?: number;
  requiredValue?: number;
}

export interface ValidationWarning {
  type: 'suboptimal_size' | 'weak_synergy' | 'high_variance' | 'meta_concern';
  message: string;
  suggestion: string;
  severity: 'low' | 'medium' | 'high';
}

export interface PracticeMatch {
  id: string;
  playerDeck: TournamentDeck;
  opponentArchetype: string;
  rounds: PracticeRound[];
  result: 'win' | 'loss' | 'draw' | 'ongoing';
  startTime: Date;
  endTime?: Date;
  notes: string;
}

export interface PracticeRound {
  roundNumber: number;
  playerResult: 'win' | 'loss' | 'draw';
  onPlay: boolean;
  keyMoments: string[];
  sideboardChanges?: {
    cardsIn: { cardId: string; quantity: number }[];
    cardsOut: { cardId: string; quantity: number }[];
  };
  duration: number; // in minutes
}

export interface MetaSnapshot {
  date: Date;
  topArchetypes: {
    name: string;
    percentage: number;
    winrate: number;
    keyCards: CardWithRelations[];
    description: string;
  }[];
  risingArchetypes: string[];
  fallingArchetypes: string[];
  bannedCardsUpdate?: {
    banned: string[];
    restricted: { cardId: string; maxCopies: number }[];
  };
}

export interface TournamentSimulation {
  format: TournamentFormat;
  playerDeck: TournamentDeck;
  rounds: number;
  opponents: string[]; // archetypes
  results: SimulationResult[];
  overallWinrate: number;
  expectedPlacement: {
    min: number;
    max: number;
    average: number;
  };
}

export interface SimulationResult {
  round: number;
  opponent: string;
  result: 'win' | 'loss' | 'draw';
  games: {
    game: number;
    result: 'win' | 'loss' | 'draw';
    onPlay: boolean;
  }[];
}

class TournamentPrepService {
  // Tournament formats
  private readonly formats: Record<string, TournamentFormat> = {
    standard: {
      name: 'Standard',
      minDeckSize: 50,
      maxDeckSize: 60,
      sideboardSize: 15,
      maxCopiesPerCard: 3,
      bannedCards: [],
      restrictedCards: [],
    },
    advanced: {
      name: 'Advanced',
      minDeckSize: 40,
      maxDeckSize: 80,
      sideboardSize: 20,
      maxCopiesPerCard: 4,
      bannedCards: [],
      restrictedCards: [],
    },
    limited: {
      name: 'Limited',
      minDeckSize: 40,
      maxDeckSize: 40,
      sideboardSize: 0,
      maxCopiesPerCard: 1,
      bannedCards: [],
      restrictedCards: [],
    },
  };

  /**
   * Validate a deck for tournament play
   */
  validateDeckForTournament(
    deck: TournamentDeck,
    formatName: string
  ): TournamentValidation {
    const format = this.formats[formatName.toLowerCase()];
    if (!format) {
      return {
        isValid: false,
        errors: [
          {
            type: 'invalid_format',
            message: `Unknown tournament format: ${formatName}`,
          },
        ],
        warnings: [],
        format: this.formats.standard,
      };
    }

    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validate main deck size
    const mainDeckSize = deck.mainDeck.reduce(
      (sum, card) => sum + card.quantity,
      0
    );
    if (mainDeckSize < format.minDeckSize) {
      errors.push({
        type: 'deck_size',
        message: `Main deck too small: ${mainDeckSize} cards (minimum ${format.minDeckSize})`,
        currentValue: mainDeckSize,
        requiredValue: format.minDeckSize,
      });
    } else if (mainDeckSize > format.maxDeckSize) {
      errors.push({
        type: 'deck_size',
        message: `Main deck too large: ${mainDeckSize} cards (maximum ${format.maxDeckSize})`,
        currentValue: mainDeckSize,
        requiredValue: format.maxDeckSize,
      });
    }

    // Validate sideboard size
    const sideboardSize = deck.sideboard.reduce(
      (sum, card) => sum + card.quantity,
      0
    );
    if (sideboardSize > format.sideboardSize) {
      errors.push({
        type: 'sideboard_size',
        message: `Sideboard too large: ${sideboardSize} cards (maximum ${format.sideboardSize})`,
        currentValue: sideboardSize,
        requiredValue: format.sideboardSize,
      });
    }

    // Validate card quantities
    const allCards = [...deck.mainDeck, ...deck.sideboard];
    const cardCounts = new Map<string, number>();

    allCards.forEach((deckCard) => {
      const currentCount = cardCounts.get(deckCard.card.id) || 0;
      cardCounts.set(deckCard.card.id, currentCount + deckCard.quantity);
    });

    cardCounts.forEach((count, cardId) => {
      const card = allCards.find((dc) => dc.card.id === cardId)?.card;
      if (!card) return;

      // Check max copies per card
      if (count > format.maxCopiesPerCard) {
        errors.push({
          type: 'max_copies',
          message: `Too many copies of ${card.name}: ${count} (maximum ${format.maxCopiesPerCard})`,
          cardId,
          cardName: card.name,
          currentValue: count,
          requiredValue: format.maxCopiesPerCard,
        });
      }

      // Check banned cards
      if (format.bannedCards.includes(cardId)) {
        errors.push({
          type: 'banned_card',
          message: `${card.name} is banned in ${format.name} format`,
          cardId,
          cardName: card.name,
        });
      }

      // Check restricted cards
      const restriction = format.restrictedCards.find(
        (r) => r.cardId === cardId
      );
      if (restriction && count > restriction.maxCopies) {
        errors.push({
          type: 'restricted_card',
          message: `Too many copies of restricted card ${card.name}: ${count} (maximum ${restriction.maxCopies})`,
          cardId,
          cardName: card.name,
          currentValue: count,
          requiredValue: restriction.maxCopies,
        });
      }
    });

    // Generate warnings for suboptimal builds
    if (
      mainDeckSize === format.minDeckSize &&
      format.maxDeckSize > format.minDeckSize
    ) {
      warnings.push({
        type: 'suboptimal_size',
        message: `Deck is at minimum size (${mainDeckSize} cards)`,
        suggestion: `Consider increasing to ${Math.min(60, format.maxDeckSize)} cards for better consistency`,
        severity: 'low',
      });
    }

    if (deck.analytics) {
      if (deck.analytics.synergyScore < 0.6) {
        warnings.push({
          type: 'weak_synergy',
          message: 'Low card synergy detected',
          suggestion: 'Consider focusing on cards that work well together',
          severity: 'medium',
        });
      }

      if (deck.analytics.deckBalance < 0.5) {
        warnings.push({
          type: 'high_variance',
          message: 'Deck may be inconsistent',
          suggestion: 'Review card distribution and consider better balance',
          severity: 'high',
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      format,
    };
  }

  /**
   * Analyze matchups against common archetypes
   */
  async analyzeMatchups(
    deck: TournamentDeck,
    metaArchetypes: string[]
  ): Promise<MatchupAnalysis[]> {
    const matchups: MatchupAnalysis[] = [];

    for (const archetype of metaArchetypes) {
      const analysis = await this.analyzeSpecificMatchup(deck, archetype);
      matchups.push(analysis);
    }

    return matchups.sort((a, b) => b.winrateEstimate - a.winrateEstimate);
  }

  /**
   * Analyze specific matchup
   */
  private async analyzeSpecificMatchup(
    deck: TournamentDeck,
    archetype: string
  ): Promise<MatchupAnalysis> {
    // This would typically fetch real matchup data
    // For now, we'll generate representative analysis

    const archetypeData = this.getArchetypeData(archetype);
    const deckAnalytics =
      deck.analytics || (await deckAnalyticsService.analyzeDeck(deck.mainDeck));

    // Calculate winrate estimate based on deck characteristics vs archetype
    let winrateEstimate = 50;

    // Adjust based on play style matchups
    if (archetype.includes('Aggro') && deckAnalytics.averageCost >= 4) {
      winrateEstimate -= 15; // Control vs Aggro disadvantage
    } else if (
      archetype.includes('Control') &&
      deckAnalytics.averageCost <= 3
    ) {
      winrateEstimate += 10; // Aggro vs Control advantage
    }

    // Adjust based on card efficiency
    winrateEstimate += (deckAnalytics.cardEfficiency - 0.5) * 20;

    // Clamp between 20-80%
    winrateEstimate = Math.max(20, Math.min(80, Math.round(winrateEstimate)));

    return {
      opponent: archetypeData,
      winrateEstimate,
      gameplan: this.generateGameplan(deck, archetype, deckAnalytics),
      sideboarding: this.generateSideboardPlan(deck, archetype),
      playTips: this.generatePlayTips(archetype, deckAnalytics),
    };
  }

  /**
   * Get archetype data
   */
  private getArchetypeData(archetype: string): MatchupAnalysis['opponent'] {
    const archetypes: Record<string, MatchupAnalysis['opponent']> = {
      'Aggro Rush': {
        archetype: 'Aggro Rush',
        description:
          'Fast, aggressive deck focusing on early pressure and quick wins',
        commonCards: [], // Would be populated from database
        strategy: 'Apply early pressure, win before turn 6-7',
      },
      'Control Lock': {
        archetype: 'Control Lock',
        description: 'Defensive deck with removal and late-game threats',
        commonCards: [],
        strategy: 'Control early game, win with powerful late-game threats',
      },
      'Midrange Value': {
        archetype: 'Midrange Value',
        description: 'Balanced deck with efficient threats and answers',
        commonCards: [],
        strategy: 'Trade efficiently, apply pressure when ahead',
      },
      'Combo Engine': {
        archetype: 'Combo Engine',
        description: 'Synergy-based deck with powerful card interactions',
        commonCards: [],
        strategy: 'Assemble combo pieces, protect the combo',
      },
    };

    return (
      archetypes[archetype] || {
        archetype,
        description: 'Unknown archetype',
        commonCards: [],
        strategy: 'Varies',
      }
    );
  }

  /**
   * Generate gameplan against specific archetype
   */
  private generateGameplan(
    deck: TournamentDeck,
    archetype: string,
    analytics: DeckAnalytics
  ): MatchupAnalysis['gameplan'] {
    const gameplan: MatchupAnalysis['gameplan'] = {
      onPlay: [],
      onDraw: [],
      keyCards: [],
      avoidCards: [],
    };

    if (archetype.includes('Aggro')) {
      if (analytics.averageCost >= 4) {
        gameplan.onPlay = [
          'Prioritize early defensive plays',
          'Look for card advantage engines',
          'Stabilize around turn 4-5',
        ];
        gameplan.onDraw = [
          'Focus on survival tools',
          'Accept early damage for card advantage',
          'Plan for late-game dominance',
        ];
      } else {
        gameplan.onPlay = [
          'Race aggressively',
          'Prioritize efficient threats',
          'Avoid trading unless favorable',
        ];
        gameplan.onDraw = [
          'Look for removal spells',
          'Trade efficiently to slow them down',
          'Counter-attack when possible',
        ];
      }
    } else if (archetype.includes('Control')) {
      gameplan.onPlay = [
        'Apply early pressure',
        'Force them to react',
        'Avoid overextending into sweepers',
      ];
      gameplan.onDraw = [
        'Build board presence gradually',
        'Hold up interaction',
        'Pressure their life total',
      ];
    }

    return gameplan;
  }

  /**
   * Generate sideboard plan
   */
  private generateSideboardPlan(
    _deck: TournamentDeck,
    _archetype: string
  ): MatchupAnalysis['sideboarding'] {
    // This would analyze the sideboard and suggest changes
    // For now, return a template
    return {
      cardsIn: [],
      cardsOut: [],
      priorityOrder: [
        'Bring in targeted answers',
        'Remove dead cards',
        'Adjust threat density',
      ],
    };
  }

  /**
   * Generate play tips for matchup
   */
  private generatePlayTips(
    archetype: string,
    analytics: DeckAnalytics
  ): string[] {
    const tips: string[] = [];

    if (archetype.includes('Aggro')) {
      tips.push(
        'Prioritize life total preservation',
        'Look for favorable trades early',
        "Don't be afraid to take some damage to develop"
      );
    } else if (archetype.includes('Control')) {
      tips.push(
        'Apply consistent pressure',
        'Play around board sweepers',
        'Hold counterspells for key threats'
      );
    } else if (archetype.includes('Combo')) {
      tips.push(
        'Identify and disrupt key pieces',
        'Apply pressure to force suboptimal plays',
        'Save removal for combo enablers'
      );
    }

    // Add general tips based on deck characteristics
    if (analytics.synergyScore > 0.7) {
      tips.push('Focus on assembling your synergies');
    }

    if (analytics.averageCost < 3) {
      tips.push('Maintain card advantage in longer games');
    } else {
      tips.push('Mulligan aggressively for early plays');
    }

    return tips;
  }

  /**
   * Create practice match
   */
  createPracticeMatch(
    playerDeck: TournamentDeck,
    opponentArchetype: string
  ): PracticeMatch {
    return {
      id: `practice-${Date.now()}`,
      playerDeck,
      opponentArchetype,
      rounds: [],
      result: 'ongoing',
      startTime: new Date(),
      notes: '',
    };
  }

  /**
   * Record practice round result
   */
  recordPracticeRound(
    match: PracticeMatch,
    result: 'win' | 'loss' | 'draw',
    onPlay: boolean,
    duration: number,
    keyMoments: string[] = []
  ): PracticeMatch {
    const round: PracticeRound = {
      roundNumber: match.rounds.length + 1,
      playerResult: result,
      onPlay,
      keyMoments,
      duration,
    };

    match.rounds.push(round);

    // Update match result based on best-of-3
    if (match.rounds.length >= 2) {
      const wins = match.rounds.filter((r) => r.playerResult === 'win').length;
      const losses = match.rounds.filter(
        (r) => r.playerResult === 'loss'
      ).length;

      if (wins >= 2) {
        match.result = 'win';
        match.endTime = new Date();
      } else if (losses >= 2) {
        match.result = 'loss';
        match.endTime = new Date();
      } else if (match.rounds.length === 3) {
        match.result = 'draw';
        match.endTime = new Date();
      }
    }

    return match;
  }

  /**
   * Simulate tournament performance
   */
  async simulateTournament(
    deck: TournamentDeck,
    format: TournamentFormat,
    rounds: number,
    metaBreakdown: Record<string, number>
  ): Promise<TournamentSimulation> {
    const opponents = this.generateOpponents(rounds, metaBreakdown);
    const results: SimulationResult[] = [];

    let totalWins = 0;
    let totalMatches = 0;

    for (let round = 1; round <= rounds; round++) {
      const opponent = opponents[round - 1];
      const matchup = await this.analyzeSpecificMatchup(deck, opponent);

      // Simulate match (best of 3)
      const games: SimulationResult['games'] = [];
      let matchWins = 0;
      let matchLosses = 0;

      for (
        let game = 1;
        game <= 3 && matchWins < 2 && matchLosses < 2;
        game++
      ) {
        const onPlay =
          game === 1 ? Math.random() > 0.5 : matchWins < matchLosses;
        const winChance = matchup.winrateEstimate / 100;
        const adjustedWinChance = onPlay ? winChance * 1.05 : winChance * 0.95; // Slight play advantage

        const gameResult = Math.random() < adjustedWinChance ? 'win' : 'loss';
        games.push({ game, result: gameResult, onPlay });

        if (gameResult === 'win') matchWins++;
        else matchLosses++;
      }

      const matchResult = matchWins > matchLosses ? 'win' : 'loss';
      results.push({
        round,
        opponent,
        result: matchResult,
        games,
      });

      if (matchResult === 'win') totalWins++;
      totalMatches++;
    }

    const overallWinrate =
      totalMatches > 0 ? (totalWins / totalMatches) * 100 : 0;

    return {
      format,
      playerDeck: deck,
      rounds,
      opponents,
      results,
      overallWinrate,
      expectedPlacement: this.calculateExpectedPlacement(totalWins, rounds),
    };
  }

  /**
   * Generate opponents for tournament simulation
   */
  private generateOpponents(
    rounds: number,
    metaBreakdown: Record<string, number>
  ): string[] {
    const opponents: string[] = [];
    const archetypes = Object.keys(metaBreakdown);

    for (let i = 0; i < rounds; i++) {
      const rand = Math.random() * 100;
      let cumulative = 0;

      for (const archetype of archetypes) {
        cumulative += metaBreakdown[archetype];
        if (rand <= cumulative) {
          opponents.push(archetype);
          break;
        }
      }

      // Fallback to first archetype
      if (opponents.length <= i) {
        opponents.push(archetypes[0]);
      }
    }

    return opponents;
  }

  /**
   * Calculate expected tournament placement
   */
  private calculateExpectedPlacement(
    wins: number,
    totalRounds: number
  ): {
    min: number;
    max: number;
    average: number;
  } {
    const winRate = wins / totalRounds;

    // Simplified placement calculation
    // In reality, this would depend on tiebreakers, tournament size, etc.
    const totalPlayers = Math.pow(2, totalRounds); // Assume power-of-2 tournament
    const averagePlacement = totalPlayers * (1 - winRate) + 1;

    return {
      min: Math.max(1, Math.floor(averagePlacement - totalPlayers * 0.2)),
      max: Math.min(
        totalPlayers,
        Math.ceil(averagePlacement + totalPlayers * 0.2)
      ),
      average: Math.round(averagePlacement),
    };
  }

  /**
   * Get current meta snapshot
   */
  getCurrentMeta(): MetaSnapshot {
    // This would fetch from a real database
    return {
      date: new Date(),
      topArchetypes: [
        {
          name: 'Aggro Rush',
          percentage: 25,
          winrate: 58,
          keyCards: [],
          description: 'Fast aggressive strategy',
        },
        {
          name: 'Control Lock',
          percentage: 20,
          winrate: 55,
          keyCards: [],
          description: 'Defensive control strategy',
        },
        {
          name: 'Midrange Value',
          percentage: 18,
          winrate: 52,
          keyCards: [],
          description: 'Balanced midrange approach',
        },
      ],
      risingArchetypes: ['Combo Engine'],
      fallingArchetypes: ['Artifact Ramp'],
    };
  }

  /**
   * Get available tournament formats
   */
  getAvailableFormats(): TournamentFormat[] {
    return Object.values(this.formats);
  }

  /**
   * Update tournament format (admin function)
   */
  updateFormat(
    formatName: string,
    updates: Partial<TournamentFormat>
  ): TournamentFormat {
    const format = this.formats[formatName.toLowerCase()];
    if (!format) {
      throw new Error(`Unknown format: ${formatName}`);
    }

    Object.assign(format, updates);
    return format;
  }
}

export const tournamentPrepService = new TournamentPrepService();
