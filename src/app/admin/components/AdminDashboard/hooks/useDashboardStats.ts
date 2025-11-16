/**
 * Custom hook for dashboard stats loading
 */

import { useState, useEffect } from 'react';
import { fetchDashboardStats } from '../api';
import type { DashboardStats } from '../types';

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } finally {
        setIsLoading(false);
      }
    }

    loadStats();
  }, []);

  return {
    stats,
    isLoading,
  };
}
