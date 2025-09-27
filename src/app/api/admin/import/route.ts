// Admin Import API - Manage data imports from official sources
import { NextRequest, NextResponse } from 'next/server';
import { DataImportService } from '@/lib/services/dataImportService';
import { ImportSchedulerService } from '@/lib/services/importSchedulerService';
import { env } from '@/lib/config/environment';

// GET /api/admin/import - Get import status and statistics
export async function GET() {
  try {
    // Check if data import is enabled
    if (!env.ENABLE_DATA_IMPORT) {
      return NextResponse.json(
        {
          error: 'Data import is disabled',
          message: 'Data import is not enabled in this environment',
        },
        { status: 403 }
      );
    }

    const importService = DataImportService.getInstance();
    const schedulerService = ImportSchedulerService.getInstance();

    // Get import status
    const importStats = importService.getImportStats();
    const schedulerStats = schedulerService.getImportStatistics();
    const scheduledImports = schedulerService.getScheduledImports();
    const recentHistory = schedulerService.getImportHistory(10);

    // Test connection to data source
    const connectionTest = await importService.testConnection();

    return NextResponse.json({
      status: {
        isEnabled: importStats.isEnabled,
        isRunning: importStats.isRunning,
        lastImportTime: importStats.lastImportTime,
        connection: connectionTest,
      },
      configuration: importStats.configuration,
      scheduler: {
        statistics: schedulerStats,
        scheduledImports,
        recentHistory,
      },
      metadata: {
        fetchedAt: new Date().toISOString(),
        environment: env.NODE_ENV,
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Import status API error:', error);

    return NextResponse.json(
      {
        error: 'Failed to get import status',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST /api/admin/import - Start a manual import
export async function POST(request: NextRequest) {
  try {
    // Check if data import is enabled
    if (!env.ENABLE_DATA_IMPORT) {
      return NextResponse.json(
        {
          error: 'Data import is disabled',
          message: 'Data import is not enabled in this environment',
        },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      type = 'full', // 'full', 'sets', 'cards'
      options = {},
      setIds,
      cardTypes,
      scheduledImportId,
    } = body;

    const schedulerService = ImportSchedulerService.getInstance();

    let result;

    if (scheduledImportId) {
      // Run a specific scheduled import
      result = await schedulerService.runScheduledImport(scheduledImportId);
    } else {
      // Run manual import based on type
      const importOptions = {
        forceUpdate: options.forceUpdate || false,
        dryRun: options.dryRun || false,
        batchSize: options.batchSize || env.IMPORT_BATCH_SIZE,
        maxRetries: options.maxRetries || env.IMPORT_MAX_RETRIES,
        skipExisting: options.skipExisting !== false, // Default to true
        setIds,
        cardTypes,
      };

      result = await schedulerService.runManualImport(importOptions);
    }

    return NextResponse.json({
      message: 'Import completed successfully',
      result,
      importedAt: new Date().toISOString(),
    }, { status: 200 });

  } catch (error) {
    console.error('Import API error:', error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('already running')) {
        return NextResponse.json(
          {
            error: 'Import already running',
            message: 'An import is already in progress. Please wait for it to complete.',
          },
          { status: 409 }
        );
      }

      if (error.message.includes('disabled')) {
        return NextResponse.json(
          {
            error: 'Import disabled',
            message: error.message,
          },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      {
        error: 'Import failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// PUT /api/admin/import - Update import configuration or scheduled imports
export async function PUT(request: NextRequest) {
  try {
    if (!env.ENABLE_DATA_IMPORT) {
      return NextResponse.json(
        {
          error: 'Data import is disabled',
          message: 'Data import is not enabled in this environment',
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action, ...data } = body;

    const schedulerService = ImportSchedulerService.getInstance();

    switch (action) {
      case 'enable_schedule':
        if (!data.id) {
          return NextResponse.json(
            { error: 'Schedule ID is required' },
            { status: 400 }
          );
        }

        const enableResult = schedulerService.setScheduledImportEnabled(data.id, true);
        if (!enableResult) {
          return NextResponse.json(
            { error: 'Scheduled import not found' },
            { status: 404 }
          );
        }

        return NextResponse.json({
          message: 'Scheduled import enabled successfully',
          scheduleId: data.id,
        });

      case 'disable_schedule':
        if (!data.id) {
          return NextResponse.json(
            { error: 'Schedule ID is required' },
            { status: 400 }
          );
        }

        const disableResult = schedulerService.setScheduledImportEnabled(data.id, false);
        if (!disableResult) {
          return NextResponse.json(
            { error: 'Scheduled import not found' },
            { status: 404 }
          );
        }

        return NextResponse.json({
          message: 'Scheduled import disabled successfully',
          scheduleId: data.id,
        });

      case 'add_schedule':
        if (!data.schedule) {
          return NextResponse.json(
            { error: 'Schedule configuration is required' },
            { status: 400 }
          );
        }

        schedulerService.addScheduledImport(data.schedule);

        return NextResponse.json({
          message: 'Scheduled import added successfully',
          schedule: data.schedule,
        });

      case 'remove_schedule':
        if (!data.id) {
          return NextResponse.json(
            { error: 'Schedule ID is required' },
            { status: 400 }
          );
        }

        const removeResult = schedulerService.removeScheduledImport(data.id);
        if (!removeResult) {
          return NextResponse.json(
            { error: 'Scheduled import not found' },
            { status: 404 }
          );
        }

        return NextResponse.json({
          message: 'Scheduled import removed successfully',
          scheduleId: data.id,
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Import configuration API error:', error);

    return NextResponse.json(
      {
        error: 'Failed to update import configuration',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/import - Clear import history or cancel running import
export async function DELETE(request: NextRequest) {
  try {
    if (!env.ENABLE_DATA_IMPORT) {
      return NextResponse.json(
        {
          error: 'Data import is disabled',
          message: 'Data import is not enabled in this environment',
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const daysToKeep = searchParams.get('days') ? parseInt(searchParams.get('days')!, 10) : 30;

    const schedulerService = ImportSchedulerService.getInstance();

    switch (action) {
      case 'clear_history':
        const clearedCount = schedulerService.clearOldHistory(daysToKeep);

        return NextResponse.json({
          message: 'Import history cleared successfully',
          clearedRecords: clearedCount,
          daysKept: daysToKeep,
        });

      case 'cancel_import':
        // Note: In a real implementation, you would need to implement cancellation logic
        return NextResponse.json(
          {
            error: 'Import cancellation not implemented',
            message: 'Import cancellation is not yet supported',
          },
          { status: 501 }
        );

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Import deletion API error:', error);

    return NextResponse.json(
      {
        error: 'Failed to process delete request',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}