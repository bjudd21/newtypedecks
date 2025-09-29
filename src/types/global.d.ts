/**
 * Global type definitions for monitoring and analytics
 */

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'set',
      targetId: string,
      config?: Record<string, any>
    ) => void;
    mixpanel?: {
      track: (eventName: string, properties?: Record<string, any>) => void;
      identify: (userId: string) => void;
      people?: {
        set: (properties: Record<string, any>) => void;
      };
    };
    dataLayer?: any[];
  }
}

// Monitoring log levels
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export {};