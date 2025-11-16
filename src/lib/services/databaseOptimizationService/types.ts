/**
 * Type Definitions for Database Optimization
 */

export interface QueryPerformanceMetrics {
  queryId: string;
  sql: string;
  duration: number;
  timestamp: Date;
  resultCount: number;
  filters: Record<string, unknown>;
  options: Record<string, unknown>;
}

export interface DatabaseHealthMetrics {
  connectionCount: number;
  slowQueries: QueryPerformanceMetrics[];
  indexUsage: Array<{
    tableName: string;
    indexName: string;
    scans: number;
    lookups: number;
    efficiency: number;
  }>;
  tableStats: Array<{
    tableName: string;
    rowCount: number;
    size: string;
    lastAnalyzed: Date;
  }>;
}

export interface QueryAnalysisResult {
  averageTime: number;
  slowQueryCount: number;
  suggestions: string[];
}

export interface PerformanceSummary {
  totalQueries: number;
  averageTime: number;
  slowQueries: number;
  topSlowQueries: QueryPerformanceMetrics[];
}

export interface MaintenanceResult {
  success: boolean;
  tasksPerformed: string[];
  errors: string[];
}
