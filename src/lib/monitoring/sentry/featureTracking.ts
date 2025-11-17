/**
 * Feature flag tracking
 */

import { errorTracker } from './errorTracker';

// Feature flag tracking
export function trackFeatureUsage(
  feature: string,
  enabled: boolean,
  userId?: string
) {
  errorTracker.addBreadcrumb(
    `Feature ${feature} ${enabled ? 'enabled' : 'disabled'}`,
    'feature',
    { feature, enabled, userId }
  );
}
