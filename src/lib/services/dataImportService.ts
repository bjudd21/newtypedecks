/**
 * Data Import Service
 *
 * Handles importing card data from official sources (gundam-gcg.com)
 * with environment-aware configuration, rate limiting, and error handling.
 */

import { env, isDevelopment } from '@/lib/config/environment';
import { CardService } from './cardService';
import { DataScraperService } from './dataScraperService';
import { DataValidationService } from './dataValidationService';
import type { CreateCardData } from '@/lib/types/card';

export interface ImportResult {
  success: boolean;
  totalProcessed: number;
  successfulImports: number;
  failures: number;
  errors: string[];
  warnings: string[];
  duration: number;
  metadata: {
    source: string;
    importedAt: Date;
    batchSize: number;
    rateLimitMs: number;
  };
}

export interface ImportOptions {
  forceUpdate?: boolean;
  dryRun?: boolean;
  batchSize?: number;
  maxRetries?: number;
  skipExisting?: boolean;
  setIds?: string[];
  cardTypes?: string[];
}

export class DataImportService {
  private static instance: DataImportService | null = null;
  private isRunning = false;
  private lastImportTime: Date | null = null;
  private scraperService: DataScraperService;
  private validationService: DataValidationService;

  private constructor() {
    this.scraperService = new DataScraperService({
      baseUrl: env.IMPORT_SOURCE_URL,
      apiKey: env.IMPORT_API_KEY,
      rateLimitMs: env.IMPORT_RATE_LIMIT_MS,
      maxRetries: env.IMPORT_MAX_RETRIES,
    });
    this.validationService = new DataValidationService();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): DataImportService {
    if (!DataImportService.instance) {
      DataImportService.instance = new DataImportService();
    }
    return DataImportService.instance;
  }

  /**
   * Check if data import is enabled
   */
  public isEnabled(): boolean {
    return env.ENABLE_DATA_IMPORT;
  }

  /**
   * Check if import is currently running
   */
  public isImportRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Get last import timestamp
   */
  public getLastImportTime(): Date | null {
    return this.lastImportTime;
  }

  /**
   * Import all card data from official source
   */
  public async importAllCards(options: ImportOptions = {}): Promise<ImportResult> {
    if (!this.isEnabled()) {
      throw new Error('Data import is disabled in this environment');
    }

    if (this.isRunning) {
      throw new Error('Import is already running');
    }

    const _startTime = Date.now(); // Reserved for future timing/metrics
    this.isRunning = true;

    try {
      const result = await this.executeImport(options);
      this.lastImportTime = new Date();
      return result;
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Import specific card sets
   */
  public async importCardSets(setIds: string[], options: ImportOptions = {}): Promise<ImportResult> {
    return this.importAllCards({ ...options, setIds });
  }

  /**
   * Import cards by type
   */
  public async importCardsByType(cardTypes: string[], options: ImportOptions = {}): Promise<ImportResult> {
    return this.importAllCards({ ...options, cardTypes });
  }

  /**
   * Execute the import process
   */
  private async executeImport(options: ImportOptions): Promise<ImportResult> {
    const startTime = Date.now();
    const batchSize = options.batchSize || env.IMPORT_BATCH_SIZE;
    const maxRetries = options.maxRetries || env.IMPORT_MAX_RETRIES;

    let totalProcessed = 0;
    let successfulImports = 0;
    let failures = 0;
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Step 1: Discover available card data
      console.warn('🔍 Discovering card data sources...');
      const dataSources = await this.scraperService.discoverCardSources({
        setIds: options.setIds,
        cardTypes: options.cardTypes,
      });

      if (dataSources.length === 0) {
        warnings.push('No card data sources found');
      }

      // Step 2: Process data in batches
      for (let i = 0; i < dataSources.length; i += batchSize) {
        const batch = dataSources.slice(i, i + batchSize);

        console.warn(`📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(dataSources.length / batchSize)} (${batch.length} items)`);

        const batchResult = await this.processBatch(batch, options, maxRetries);

        totalProcessed += batchResult.processed;
        successfulImports += batchResult.successful;
        failures += batchResult.failed;
        errors.push(...batchResult.errors);
        warnings.push(...batchResult.warnings);

        // Rate limiting between batches
        if (i + batchSize < dataSources.length) {
          await this.sleep(env.IMPORT_RATE_LIMIT_MS);
        }
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      errors.push(`Import failed: ${errorMessage}`);
      console.error('❌ Import failed:', error);
    }

    const duration = Date.now() - startTime;

    const result: ImportResult = {
      success: errors.length === 0,
      totalProcessed,
      successfulImports,
      failures,
      errors,
      warnings,
      duration,
      metadata: {
        source: env.IMPORT_SOURCE_URL,
        importedAt: new Date(),
        batchSize,
        rateLimitMs: env.IMPORT_RATE_LIMIT_MS,
      },
    };

    // Log summary
    this.logImportSummary(result);

    return result;
  }

  /**
   * Process a batch of card data
   */
  private async processBatch(
    dataSources: unknown[],
    options: ImportOptions,
    _maxRetries: number // Reserved for future retry logic
  ): Promise<{ processed: number; successful: number; failed: number; errors: string[]; warnings: string[] }> {
    let processed = 0;
    let successful = 0;
    let failed = 0;
    const errors: string[] = [];
    const warnings: string[] = [];

    for (const source of dataSources) {
      processed++;

      try {
        const sourceObj = source as { url: string };
        // Scrape card data
        const rawCardData = await this.scraperService.scrapeCardData(sourceObj.url);

        if (!rawCardData) {
          warnings.push(`No data found for ${sourceObj.url}`);
          continue;
        }

        // Validate and transform data
        const validationResult = await this.validationService.validateCardData(rawCardData);

        if (!validationResult.isValid) {
          errors.push(`Validation failed for ${sourceObj.url}: ${validationResult.errors.join(', ')}`);
          failed++;
          continue;
        }

        if (validationResult.warnings.length > 0) {
          warnings.push(...validationResult.warnings.map(w => `${sourceObj.url}: ${w}`));
        }

        const transformedData = await this.validationService.transformCardData(rawCardData);

        // Check if card already exists
        if (options.skipExisting && await this.cardExists(transformedData)) {
          warnings.push(`Card already exists: ${transformedData.name} (${transformedData.setNumber})`);
          continue;
        }

        // Dry run - don't actually import
        if (options.dryRun) {
          console.warn(`[DRY RUN] Would import: ${transformedData.name}`);
          successful++;
          continue;
        }

        // Import the card
        await this.importSingleCard(transformedData, options.forceUpdate);
        successful++;

        if (isDevelopment) {
          console.warn(`✅ Imported: ${transformedData.name}`);
        }

      } catch (error) {
        const sourceObj = source as { url: string };
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Failed to process ${sourceObj.url}: ${errorMessage}`);
        failed++;

        // Retry logic could be added here
        console.error(`❌ Failed to process ${sourceObj.url}:`, error);
      }
    }

    return { processed, successful, failed, errors, warnings };
  }

  /**
   * Import a single card
   */
  private async importSingleCard(cardData: CreateCardData, forceUpdate = false): Promise<void> {
    try {
      // Check if card exists by set and number
      const existingCard = await CardService.getCardBySetAndNumber(
        cardData.setId,
        cardData.setNumber
      );

      if (existingCard && !forceUpdate) {
        throw new Error('Card already exists and forceUpdate is false');
      }

      if (existingCard && forceUpdate) {
        // Update existing card
        await CardService.updateCard({ id: existingCard.id, ...cardData });
      } else {
        // Create new card
        await CardService.createCard(cardData);
      }
    } catch (error) {
      throw new Error(`Failed to import card ${cardData.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if a card already exists
   */
  private async cardExists(cardData: CreateCardData): Promise<boolean> {
    try {
      const existing = await CardService.getCardBySetAndNumber(
        cardData.setId,
        cardData.setNumber
      );
      return !!existing;
    } catch {
      return false;
    }
  }

  /**
   * Log import summary
   */
  private logImportSummary(result: ImportResult): void {
    const { totalProcessed, successfulImports, failures, duration } = result;
    const durationSeconds = (duration / 1000).toFixed(2);

    console.warn('\n📊 Import Summary:');
    console.warn(`   Total Processed: ${totalProcessed}`);
    console.warn(`   ✅ Successful: ${successfulImports}`);
    console.warn(`   ❌ Failed: ${failures}`);
    console.warn(`   ⏱️  Duration: ${durationSeconds}s`);
    console.warn(`   📈 Success Rate: ${totalProcessed > 0 ? ((successfulImports / totalProcessed) * 100).toFixed(1) : 0}%`);

    if (result.errors.length > 0) {
      console.warn('\n❌ Errors:');
      result.errors.forEach(error => console.warn(`   - ${error}`));
    }

    if (result.warnings.length > 0) {
      console.warn('\n⚠️  Warnings:');
      result.warnings.forEach(warning => console.warn(`   - ${warning}`));
    }
  }

  /**
   * Sleep utility for rate limiting
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Test connection to import source
   */
  public async testConnection(): Promise<{ success: boolean; message: string; responseTime?: number }> {
    try {
      const startTime = Date.now();
      const isReachable = await this.scraperService.testConnection();
      const responseTime = Date.now() - startTime;

      return {
        success: isReachable,
        message: isReachable ? 'Connection successful' : 'Connection failed',
        responseTime: isReachable ? responseTime : undefined,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown connection error',
      };
    }
  }

  /**
   * Get import statistics
   */
  public getImportStats(): {
    isEnabled: boolean;
    isRunning: boolean;
    lastImportTime: Date | null;
    configuration: {
      sourceUrl: string;
      batchSize: number;
      rateLimitMs: number;
      maxRetries: number;
      scheduleEnabled: boolean;
    };
  } {
    return {
      isEnabled: this.isEnabled(),
      isRunning: this.isRunning,
      lastImportTime: this.lastImportTime,
      configuration: {
        sourceUrl: env.IMPORT_SOURCE_URL,
        batchSize: env.IMPORT_BATCH_SIZE,
        rateLimitMs: env.IMPORT_RATE_LIMIT_MS,
        maxRetries: env.IMPORT_MAX_RETRIES,
        scheduleEnabled: env.IMPORT_SCHEDULE_ENABLED,
      },
    };
  }
}