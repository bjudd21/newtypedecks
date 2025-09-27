// Import Connection Test API - Test connection to data source
import { NextResponse } from 'next/server';
import { DataImportService } from '@/lib/services/dataImportService';
import { env } from '@/lib/config/environment';

// GET /api/admin/import/test - Test connection to import data source
export async function GET() {
  try {
    // Check if data import is enabled
    if (!env.ENABLE_DATA_IMPORT) {
      return NextResponse.json(
        {
          error: 'Data import is disabled',
          message: 'Data import is not enabled in this environment',
          canTest: false,
        },
        { status: 403 }
      );
    }

    const importService = DataImportService.getInstance();

    // Test the connection
    const startTime = Date.now();
    const connectionResult = await importService.testConnection();
    const totalTime = Date.now() - startTime;

    // Get additional diagnostic information
    const diagnostics = {
      sourceUrl: env.IMPORT_SOURCE_URL,
      hasApiKey: !!env.IMPORT_API_KEY,
      rateLimitMs: env.IMPORT_RATE_LIMIT_MS,
      batchSize: env.IMPORT_BATCH_SIZE,
      maxRetries: env.IMPORT_MAX_RETRIES,
      scheduleEnabled: env.IMPORT_SCHEDULE_ENABLED,
      testDuration: totalTime,
    };

    if (connectionResult.success) {
      return NextResponse.json({
        status: 'success',
        message: 'Connection to import source successful',
        connection: connectionResult,
        diagnostics,
        testedAt: new Date().toISOString(),
      }, { status: 200 });
    } else {
      return NextResponse.json({
        status: 'error',
        message: 'Failed to connect to import source',
        connection: connectionResult,
        diagnostics,
        testedAt: new Date().toISOString(),
      }, { status: 503 }); // Service Unavailable
    }

  } catch (error) {
    console.error('Import test API error:', error);

    return NextResponse.json(
      {
        status: 'error',
        message: 'Test failed with exception',
        error: error instanceof Error ? error.message : 'Unknown error',
        testedAt: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}