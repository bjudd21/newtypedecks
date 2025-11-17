/**
 * Form monitoring hook
 * Specialized hook for form interaction monitoring
 */

'use client';

import { useCallback } from 'react';
import { useMonitoring } from './useBaseMonitoring';

export function useFormMonitoring(formName: string) {
  const monitoring = useMonitoring({
    componentName: `Form:${formName}`,
    trackUserActions: true,
  });

  const trackFormStart = useCallback(() => {
    monitoring.trackUserAction('form_start', 'form', { formName });
  }, [monitoring, formName]);

  const trackFormSubmit = useCallback(
    (success: boolean, errors?: Record<string, unknown>) => {
      monitoring.trackUserAction('form_submit', 'form', {
        formName,
        success,
        errors,
      });
    },
    [monitoring, formName]
  );

  const trackFieldInteraction = useCallback(
    (fieldName: string, action: 'focus' | 'blur' | 'change') => {
      monitoring.trackUserAction(`field_${action}`, 'form_field', {
        formName,
        fieldName,
      });
    },
    [monitoring, formName]
  );

  return {
    ...monitoring,
    trackFormStart,
    trackFormSubmit,
    trackFieldInteraction,
  };
}
