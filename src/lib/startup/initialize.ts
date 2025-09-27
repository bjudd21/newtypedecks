/**
 * Application initialization
 *
 * Runs startup tasks like directory creation and service initialization
 */

import { initializeUploadDirectories } from '@/lib/utils/initializeDirectories';
import { CleanupService } from '@/lib/services/cleanupService';
import { env } from '@/lib/config/environment';

export async function initializeApplication(): Promise<void> {
  console.log('Initializing application...');

  try {
    // Initialize upload directories
    await initializeUploadDirectories();
    console.log('✓ Upload directories initialized');

    // Start cleanup service in production
    if (env.NODE_ENV === 'production') {
      const cleanupService = CleanupService.getInstance();
      // Run cleanup every 6 hours in production
      cleanupService.startPeriodicCleanup(6 * 60 * 60 * 1000);
      console.log('✓ Cleanup service started');
    } else {
      console.log('ℹ Cleanup service not started (development mode)');
    }

    console.log('Application initialization completed');
  } catch (error) {
    console.error('Error during application initialization:', error);
    // Don't throw - allow app to continue even if initialization fails
  }
}

// Auto-initialize in Node.js environment (not in browser)
if (typeof window === 'undefined') {
  // Only run once per process
  let initialized = false;
  if (!initialized) {
    initialized = true;
    initializeApplication();
  }
}