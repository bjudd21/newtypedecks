/**
 * Monitoring error boundary component
 */

import React from 'react';
import { errorTracker } from '@/lib/monitoring/sentry';
import { analytics } from '@/lib/monitoring/analytics';
import { logger } from '@/lib/monitoring/logger';
import { ErrorBoundaryFallback } from './ErrorBoundaryFallback';
import type { ErrorBoundaryState, ErrorBoundaryProps } from '../types';

export class MonitoringErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });

    // Track error in monitoring systems
    errorTracker.captureException(error, {
      errorBoundary: {
        componentStack: errorInfo.componentStack,
        errorBoundary: 'MonitoringErrorBoundary',
      },
    });

    analytics.trackEvent({
      name: 'react_error_boundary',
      properties: {
        error_message: error.message,
        error_stack: error.stack,
        component_stack: errorInfo.componentStack,
      },
    });

    logger.error('React Error Boundary caught error', error, {
      context: {
        componentStack: errorInfo.componentStack,
      },
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} />;
      }

      return <ErrorBoundaryFallback error={this.state.error!} />;
    }

    return this.props.children;
  }
}
