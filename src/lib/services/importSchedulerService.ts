/**
 * Import Scheduler Service
 *
 * Handles scheduled imports using cron jobs and manages import history
 */

import { env, isDevelopment } from '@/lib/config/environment';
import {
  DataImportService,
  type ImportResult,
  type ImportOptions,
} from './dataImportService';

export interface ScheduledImport {
  id: string;
  name: string;
  cron: string;
  options: ImportOptions;
  enabled: boolean;
  lastRun?: Date;
  nextRun?: Date;
  lastResult?: ImportResult;
}

export interface ImportHistory {
  id: string;
  scheduledImportId?: string;
  startTime: Date;
  endTime?: Date;
  result?: ImportResult;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  triggeredBy: 'schedule' | 'manual' | 'api';
}

export class ImportSchedulerService {
  private static instance: ImportSchedulerService | null = null;
  private scheduledImports: Map<string, ScheduledImport> = new Map();
  private importHistory: ImportHistory[] = [];
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private dataImportService: DataImportService;

  private constructor() {
    this.dataImportService = DataImportService.getInstance();
    this.initializeDefaultSchedules();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): ImportSchedulerService {
    if (!ImportSchedulerService.instance) {
      ImportSchedulerService.instance = new ImportSchedulerService();
    }
    return ImportSchedulerService.instance;
  }

  /**
   * Initialize default scheduled imports
   */
  private initializeDefaultSchedules(): void {
    if (env.IMPORT_SCHEDULE_ENABLED) {
      this.addScheduledImport({
        id: 'daily-full-import',
        name: 'Daily Full Card Import',
        cron: env.IMPORT_SCHEDULE_CRON,
        options: {
          skipExisting: true,
          batchSize: env.IMPORT_BATCH_SIZE,
        },
        enabled: true,
      });
    }
  }

  /**
   * Add a new scheduled import
   */
  public addScheduledImport(schedule: Omit<ScheduledImport, 'nextRun'>): void {
    const nextRun = this.getNextRunTime(schedule.cron) || undefined;
    const scheduledImport: ScheduledImport = {
      ...schedule,
      nextRun,
    };

    this.scheduledImports.set(schedule.id, scheduledImport);

    if (schedule.enabled) {
      this.scheduleNextRun(schedule.id);
    }

    console.warn(
      `📅 Scheduled import added: ${schedule.name} (${schedule.cron})`
    );
  }

  /**
   * Remove a scheduled import
   */
  public removeScheduledImport(id: string): boolean {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }

    return this.scheduledImports.delete(id);
  }

  /**
   * Enable/disable a scheduled import
   */
  public setScheduledImportEnabled(id: string, enabled: boolean): boolean {
    const schedule = this.scheduledImports.get(id);
    if (!schedule) return false;

    schedule.enabled = enabled;

    if (enabled) {
      this.scheduleNextRun(id);
    } else {
      const timer = this.timers.get(id);
      if (timer) {
        clearTimeout(timer);
        this.timers.delete(id);
      }
    }

    return true;
  }

  /**
   * Get all scheduled imports
   */
  public getScheduledImports(): ScheduledImport[] {
    return Array.from(this.scheduledImports.values());
  }

  /**
   * Get scheduled import by ID
   */
  public getScheduledImport(id: string): ScheduledImport | undefined {
    return this.scheduledImports.get(id);
  }

  /**
   * Run a scheduled import manually
   */
  public async runScheduledImport(id: string): Promise<ImportResult> {
    const schedule = this.scheduledImports.get(id);
    if (!schedule) {
      throw new Error(`Scheduled import ${id} not found`);
    }

    return this.executeImport(schedule, 'manual');
  }

  /**
   * Run import with custom options
   */
  public async runManualImport(
    options: ImportOptions = {}
  ): Promise<ImportResult> {
    const schedule: ScheduledImport = {
      id: 'manual-import',
      name: 'Manual Import',
      cron: '',
      options,
      enabled: false,
    };

    return this.executeImport(schedule, 'manual');
  }

  /**
   * Get import history
   */
  public getImportHistory(limit = 50): ImportHistory[] {
    return this.importHistory
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
      .slice(0, limit);
  }

  /**
   * Get import history for a specific scheduled import
   */
  public getScheduledImportHistory(
    scheduledImportId: string,
    limit = 20
  ): ImportHistory[] {
    return this.importHistory
      .filter((history) => history.scheduledImportId === scheduledImportId)
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
      .slice(0, limit);
  }

  /**
   * Clear old import history
   */
  public clearOldHistory(daysToKeep = 30): number {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const initialLength = this.importHistory.length;
    this.importHistory = this.importHistory.filter(
      (history) => history.startTime >= cutoffDate
    );

    return initialLength - this.importHistory.length;
  }

  /**
   * Execute an import
   */
  private async executeImport(
    schedule: ScheduledImport,
    triggeredBy: ImportHistory['triggeredBy']
  ): Promise<ImportResult> {
    const historyId = this.generateHistoryId();
    const history: ImportHistory = {
      id: historyId,
      scheduledImportId:
        schedule.id !== 'manual-import' ? schedule.id : undefined,
      startTime: new Date(),
      status: 'running',
      triggeredBy,
    };

    this.importHistory.push(history);

    try {
      console.warn(`🚀 Starting import: ${schedule.name}`);

      if (!this.dataImportService.isEnabled()) {
        throw new Error('Data import is disabled');
      }

      const result = await this.dataImportService.importAllCards(
        schedule.options
      );

      // Update history
      history.endTime = new Date();
      history.result = result;
      history.status = result.success ? 'completed' : 'failed';

      // Update scheduled import
      if (schedule.id !== 'manual-import') {
        const storedSchedule = this.scheduledImports.get(schedule.id);
        if (storedSchedule) {
          storedSchedule.lastRun = new Date();
          storedSchedule.lastResult = result;
          storedSchedule.nextRun =
            this.getNextRunTime(storedSchedule.cron) || undefined;

          // Schedule next run if still enabled
          if (storedSchedule.enabled) {
            this.scheduleNextRun(schedule.id);
          }
        }
      }

      console.warn(`✅ Import completed: ${schedule.name}`);
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      // Update history with error
      history.endTime = new Date();
      history.status = 'failed';
      history.result = {
        success: false,
        totalProcessed: 0,
        successfulImports: 0,
        failures: 1,
        errors: [errorMessage],
        warnings: [],
        duration: Date.now() - history.startTime.getTime(),
        metadata: {
          source: env.IMPORT_SOURCE_URL,
          importedAt: new Date(),
          batchSize: env.IMPORT_BATCH_SIZE,
          rateLimitMs: env.IMPORT_RATE_LIMIT_MS,
        },
      };

      console.error(`❌ Import failed: ${schedule.name}`, error);
      throw error;
    }
  }

  /**
   * Schedule the next run for an import
   */
  private scheduleNextRun(id: string): void {
    const schedule = this.scheduledImports.get(id);
    if (!schedule || !schedule.enabled) return;

    // Clear existing timer
    const existingTimer = this.timers.get(id);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    const nextRun = this.getNextRunTime(schedule.cron);
    if (!nextRun) return;

    schedule.nextRun = nextRun;
    const delay = nextRun.getTime() - Date.now();

    if (delay <= 0) {
      // Should run immediately
      this.executeImport(schedule, 'schedule').catch((error) => {
        console.error(`Scheduled import ${id} failed:`, error);
      });
      return;
    }

    const timer = setTimeout(() => {
      this.executeImport(schedule, 'schedule').catch((error) => {
        console.error(`Scheduled import ${id} failed:`, error);
      });
    }, delay);

    this.timers.set(id, timer);

    if (isDevelopment) {
      console.warn(
        `⏰ Next run for ${schedule.name}: ${nextRun.toLocaleString()}`
      );
    }
  }

  /**
   * Calculate next run time from cron expression
   * Simplified cron parser - supports basic patterns like "0 2 * * *"
   */
  private getNextRunTime(cron: string): Date | null {
    try {
      const parts = cron.trim().split(/\s+/);
      if (parts.length !== 5) {
        console.error(`Invalid cron expression: ${cron}`);
        return null;
      }

      const [minute, hour, _dayOfMonth, _month, _dayOfWeek] = parts;

      const now = new Date();
      const next = new Date(now);

      // Parse hour and minute
      const targetHour = parseInt(hour, 10);
      const targetMinute = parseInt(minute, 10);

      if (isNaN(targetHour) || isNaN(targetMinute)) {
        console.error(`Invalid time in cron expression: ${cron}`);
        return null;
      }

      // Set target time
      next.setHours(targetHour, targetMinute, 0, 0);

      // If the time has passed today, move to tomorrow
      if (next <= now) {
        next.setDate(next.getDate() + 1);
      }

      return next;
    } catch (error) {
      console.error(`Error parsing cron expression ${cron}:`, error);
      return null;
    }
  }

  /**
   * Generate unique history ID
   */
  private generateHistoryId(): string {
    return `import_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get import statistics
   */
  public getImportStatistics(): {
    scheduledImports: {
      total: number;
      enabled: number;
      disabled: number;
    };
    history: {
      total: number;
      successful: number;
      failed: number;
      running: number;
      lastRun?: Date;
    };
    nextScheduledRun?: Date;
  } {
    const schedules = Array.from(this.scheduledImports.values());
    const enabledSchedules = schedules.filter((s) => s.enabled);
    const nextRuns = enabledSchedules
      .map((s) => s.nextRun)
      .filter((date): date is Date => !!date)
      .sort((a, b) => a.getTime() - b.getTime());

    const history = this.importHistory;
    const successful = history.filter((h) => h.status === 'completed').length;
    const failed = history.filter((h) => h.status === 'failed').length;
    const running = history.filter((h) => h.status === 'running').length;

    const lastRun = history
      .filter((h) => h.status === 'completed')
      .sort(
        (a, b) => b.startTime.getTime() - a.startTime.getTime()
      )[0]?.startTime;

    return {
      scheduledImports: {
        total: schedules.length,
        enabled: enabledSchedules.length,
        disabled: schedules.length - enabledSchedules.length,
      },
      history: {
        total: history.length,
        successful,
        failed,
        running,
        lastRun,
      },
      nextScheduledRun: nextRuns[0],
    };
  }

  /**
   * Cleanup on shutdown
   */
  public shutdown(): void {
    // Clear all timers
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    this.timers.clear();

    console.warn('📄 Import scheduler shut down');
  }
}
