/**
 * Type definitions for performance monitoring
 */

export interface PerformanceEntry {
  name: string;
  startTime: number;
  endTime: number;
  duration: number;
  type: 'api' | 'database' | 'component' | 'page' | 'user-action';
  metadata?: Record<string, unknown>;
}

export interface ResourceUsage extends Record<string, unknown> {
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  cpu?: {
    usage: number;
    loadAverage?: number[];
  };
  network?: {
    bytesReceived: number;
    bytesSent: number;
  };
}

export interface PerformanceStats {
  count: number;
  min: number;
  max: number;
  avg: number;
  median: number;
  p95: number;
  p99: number;
  recent: PerformanceEntry[];
}

export interface PerformanceThresholds {
  api: number;
  database: number;
  component: number;
  page: number;
  'user-action': number;
}

// Extended Performance interface with memory property
export interface PerformanceWithMemory extends Performance {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}
