/**
 * Analytics and metrics type definitions
 */

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
  userId?: string;
  timestamp?: Date;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  tags?: Record<string, string>;
  timestamp?: Date;
}

export interface UserMetric {
  userId: string;
  action: string;
  resource?: string;
  metadata?: Record<string, unknown>;
  timestamp?: Date;
}
