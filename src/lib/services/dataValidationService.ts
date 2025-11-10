/**
 * Data Validation Service
 *
 * Handles validation and transformation of scraped card data
 * before importing into the database.
 */

import { CardValidator } from '@/lib/models/card';
import type { CreateCardData, CardValidationResult } from '@/lib/types/card';
import type { RawCardData } from './dataScraperService';
import { prisma } from '@/lib/database';

export interface DataTransformationResult {
  success: boolean;
  data?: CreateCardData;
  errors: string[];
  warnings: string[];
}

export class DataValidationService {
  private validator: CardValidator;

  constructor() {
    this.validator = new CardValidator();
  }

  /**
   * Validate raw card data from scraper
   */
  public async validateCardData(rawData: RawCardData): Promise<CardValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Basic required field validation
      if (!rawData.name || rawData.name.trim().length === 0) {
        errors.push('Card name is required');
      }

      if (rawData.name && rawData.name.length > 200) {
        errors.push('Card name is too long (maximum 200 characters)');
      }

      // Set information validation
      if (!rawData.setInfo?.name) {
        errors.push('Set name is required');
      }

      if (!rawData.setInfo?.code) {
        errors.push('Set code is required');
      }

      if (!rawData.setInfo?.number) {
        errors.push('Card set number is required');
      }

      // Numeric field validation
      if (rawData.stats?.level !== undefined) {
        if (rawData.stats.level < 0 || rawData.stats.level > 10) {
          errors.push('Level must be between 0 and 10');
        }
      }

      if (rawData.stats?.cost !== undefined) {
        if (rawData.stats.cost < 0 || rawData.stats.cost > 20) {
          errors.push('Cost must be between 0 and 20');
        }
      }

      if (rawData.stats?.clashPoints !== undefined) {
        if (rawData.stats.clashPoints < 0 || rawData.stats.clashPoints > 50) {
          warnings.push('Clash points seem unusually high or low');
        }
      }

      // Image URL validation
      if (rawData.imageUrl && !this.isValidUrl(rawData.imageUrl)) {
        warnings.push('Image URL appears to be invalid');
      }

      // Text field length validation
      if (rawData.text?.description && rawData.text.description.length > 2000) {
        warnings.push('Description is very long (over 2000 characters)');
      }

      if (rawData.text?.officialText && rawData.text.officialText.length > 2000) {
        warnings.push('Official text is very long (over 2000 characters)');
      }

      // Keywords validation
      if (rawData.categories?.keywords) {
        if (rawData.categories.keywords.length > 20) {
          warnings.push('Large number of keywords (over 20)');
        }

        // Check for duplicates
        const uniqueKeywords = new Set(rawData.categories.keywords);
        if (uniqueKeywords.size !== rawData.categories.keywords.length) {
          warnings.push('Duplicate keywords found');
        }
      }

      // Faction validation
      if (rawData.categories?.faction) {
        const validFactions = [
          'Earth Federation',
          'Zeon',
          'AEUG',
          'Titans',
          'Celestial Being',
          'A-Laws',
          'Gjallarhorn',
          'Tekkadan',
          'Other'
        ];

        if (!validFactions.includes(rawData.categories.faction)) {
          warnings.push(`Unknown faction: ${rawData.categories.faction}`);
        }
      }

      // Series validation
      if (rawData.categories?.series) {
        const validSeries = ['UC', 'CE', 'AD', 'AG', 'PD', 'AC', 'FC', 'AW'];
        if (!validSeries.includes(rawData.categories.series)) {
          warnings.push(`Unknown series: ${rawData.categories.series}`);
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
      };

    } catch (error) {
      return {
        isValid: false,
        errors: [`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`],
        warnings,
      };
    }
  }

  /**
   * Transform raw scraped data into database-ready format
   */
  public async transformCardData(rawData: RawCardData): Promise<CreateCardData> {
    try {
      // Find or create card type
      const typeId = await this.findOrCreateCardType('Unit'); // Default type

      // Find or create rarity
      const rarityId = await this.findOrCreateRarity('Common'); // Default rarity

      // Find or create set
      const setId = await this.findOrCreateSet(
        rawData.setInfo?.name || 'Unknown Set',
        rawData.setInfo?.code || 'UNK'
      );

      // Transform the data
      const cardData: CreateCardData = {
        name: rawData.name.trim(),
        typeId,
        rarityId,
        setId,
        setNumber: rawData.setInfo?.number || '000',
        imageUrl: rawData.imageUrl || '',

        // Optional fields
        imageUrlSmall: undefined,
        imageUrlLarge: undefined,
        description: rawData.text?.description?.trim(),
        officialText: rawData.text?.officialText?.trim(),

        // Stats
        level: rawData.stats?.level,
        cost: rawData.stats?.cost,
        clashPoints: rawData.stats?.clashPoints,
        price: rawData.stats?.price,
        hitPoints: rawData.stats?.hitPoints,
        attackPoints: rawData.stats?.attackPoints,

        // Categories
        faction: rawData.categories?.faction,
        pilot: rawData.categories?.pilot,
        model: rawData.categories?.model,
        series: rawData.categories?.series,
        nation: rawData.categories?.nation,

        // Arrays
        keywords: rawData.categories?.keywords || [],
        tags: this.generateCardTags(rawData),

        // Abilities (store as JSON string)
        abilities: rawData.text?.abilities ? JSON.stringify([rawData.text.abilities]) : undefined,

        // Flags
        isFoil: rawData.flags?.isFoil || false,
        isPromo: rawData.flags?.isPromo || false,
        isAlternate: rawData.flags?.isAlternate || false,

        // Metadata
        language: rawData.metadata?.language || 'en',
      };

      return cardData;

    } catch (error) {
      throw new Error(`Failed to transform card data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Find or create card type
   */
  private async findOrCreateCardType(typeName: string): Promise<string> {
    try {
      let cardType = await prisma.cardType.findUnique({
        where: { name: typeName }
      });

      if (!cardType) {
        cardType = await prisma.cardType.create({
          data: {
            name: typeName,
            description: `Auto-created type: ${typeName}`,
          }
        });
      }

      return cardType.id;

    } catch (error) {
      throw new Error(`Failed to find/create card type: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Find or create card rarity
   */
  private async findOrCreateRarity(rarityName: string): Promise<string> {
    try {
      let rarity = await prisma.rarity.findUnique({
        where: { name: rarityName }
      });

      if (!rarity) {
        // Assign colors based on rarity name
        const rarityColors: Record<string, string> = {
          'Common': '#6B7280',
          'Uncommon': '#10B981',
          'Rare': '#3B82F6',
          'Super Rare': '#8B5CF6',
          'Ultra Rare': '#F59E0B',
          'Secret Rare': '#EF4444',
        };

        rarity = await prisma.rarity.create({
          data: {
            name: rarityName,
            color: rarityColors[rarityName] || '#6B7280',
            description: `Auto-created rarity: ${rarityName}`,
          }
        });
      }

      return rarity.id;

    } catch (error) {
      throw new Error(`Failed to find/create rarity: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Find or create card set
   */
  private async findOrCreateSet(setName: string, setCode: string): Promise<string> {
    try {
      let cardSet = await prisma.set.findUnique({
        where: { code: setCode }
      });

      if (!cardSet) {
        cardSet = await prisma.set.create({
          data: {
            name: setName,
            code: setCode,
            releaseDate: new Date(), // Use current date as fallback
            description: `Auto-created set: ${setName}`,
          }
        });
      }

      return cardSet.id;

    } catch (error) {
      throw new Error(`Failed to find/create set: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate relevant tags for the card
   */
  private generateCardTags(rawData: RawCardData): string[] {
    const tags: string[] = [];

    // Add faction-based tags
    if (rawData.categories?.faction) {
      tags.push(rawData.categories.faction.toLowerCase().replace(/\s+/g, '-'));
    }

    // Add series-based tags
    if (rawData.categories?.series) {
      tags.push(`series-${rawData.categories.series.toLowerCase()}`);
    }

    // Add stat-based tags
    if (rawData.stats?.level !== undefined) {
      if (rawData.stats.level >= 8) tags.push('high-level');
      else if (rawData.stats.level <= 2) tags.push('low-level');
    }

    if (rawData.stats?.cost !== undefined) {
      if (rawData.stats.cost >= 10) tags.push('high-cost');
      else if (rawData.stats.cost <= 2) tags.push('low-cost');
    }

    // Add special flags as tags
    if (rawData.flags?.isFoil) tags.push('foil');
    if (rawData.flags?.isPromo) tags.push('promo');
    if (rawData.flags?.isAlternate) tags.push('alternate-art');

    // Add pilot-based tags
    if (rawData.categories?.pilot) {
      tags.push(`pilot-${rawData.categories.pilot.toLowerCase().replace(/\s+/g, '-')}`);
    }

    return [...new Set(tags)]; // Remove duplicates
  }

  /**
   * Validate if a string is a valid URL
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Normalize text content
   */
  private normalizeText(text: string): string {
    return text
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n'); // Remove excessive line breaks
  }

  /**
   * Validate and clean keywords array
   */
  private validateKeywords(keywords: string[]): string[] {
    return keywords
      .map(keyword => keyword.trim())
      .filter(keyword => keyword.length > 0 && keyword.length <= 50)
      .slice(0, 20); // Limit to 20 keywords
  }

  /**
   * Check if card data already exists in database
   */
  public async checkDuplicateCard(setId: string, setNumber: string): Promise<boolean> {
    try {
      const existingCard = await prisma.card.findUnique({
        where: {
          setId_setNumber: {
            setId,
            setNumber,
          }
        }
      });

      return !!existingCard;

    } catch (error) {
      console.error('Error checking for duplicate card:', error);
      return false;
    }
  }

  /**
   * Get data quality score for imported card
   */
  public calculateDataQuality(cardData: CreateCardData): {
    score: number;
    maxScore: number;
    details: Record<string, { present: boolean; weight: number }>;
  } {
    const checks = {
      name: { present: !!cardData.name, weight: 10 },
      imageUrl: { present: !!cardData.imageUrl, weight: 8 },
      description: { present: !!cardData.description, weight: 6 },
      officialText: { present: !!cardData.officialText, weight: 7 },
      level: { present: cardData.level !== undefined, weight: 5 },
      cost: { present: cardData.cost !== undefined, weight: 5 },
      faction: { present: !!cardData.faction, weight: 4 },
      pilot: { present: !!cardData.pilot, weight: 3 },
      keywords: { present: !!(cardData.keywords && cardData.keywords.length > 0), weight: 4 },
      clashPoints: { present: cardData.clashPoints !== undefined, weight: 3 },
    };

    const score = Object.values(checks).reduce(
      (total, check) => total + (check.present ? check.weight : 0),
      0
    );

    const maxScore = Object.values(checks).reduce(
      (total, check) => total + check.weight,
      0
    );

    return {
      score,
      maxScore,
      details: checks,
    };
  }
}