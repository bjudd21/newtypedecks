/**
 * Global type definitions for monitoring and analytics
 */

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'set',
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    mixpanel?: {
      track: (eventName: string, properties?: Record<string, unknown>) => void;
      identify: (userId: string) => void;
      people?: {
        set: (properties: Record<string, unknown>) => void;
      };
    };
    dataLayer?: unknown[];
  }
}

// Monitoring log levels
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export {};