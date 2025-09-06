import { useState, useMemo, useCallback } from 'react';
import type { ActTabType, ActFilter, ActListResponse } from '@/types/act';
import { getActs } from '@/api/acts';
import { useAuth } from '@/hooks/useAuth';


// Main hook
export const useActData = () => {
  const [currentTab, setCurrentTab] = useState<ActTabType>('incoming');
  const [filters, setFilters] = useState<ActFilter>({});
  const [loadingStates, setLoadingStates] = useState<Record<ActTabType, boolean>>({
    incoming: false,
    outgoing: false,
    draft: false,
    sending: false
  });

  const { getStoredAuth } = useAuth();

  const loadTabData = useCallback(async (tabType: ActTabType, page: number = 0): Promise<ActListResponse> => {
    setLoadingStates(prev => ({ ...prev, [tabType]: true }));

    try {
      // Get auth token
      const authData = await getStoredAuth();
      if (!authData?.isAuthenticated || !authData.token) {
        throw new Error('User not authenticated');
      }

      // Call real API
      const result = await getActs(
        tabType,
        filters,
        { page: page + 1, limit: 20 }, // API uses 1-based pagination
        authData.token
      );

      setLoadingStates(prev => ({ ...prev, [tabType]: false }));
      return result;
    } catch (error) {
      setLoadingStates(prev => ({ ...prev, [tabType]: false }));
      console.error(`Failed to load ${tabType} acts:`, error);

      // Fallback to empty response on error
      return {
        items: [],
        hasMore: false,
        cursor: undefined,
        total: 0
      };
    }
  }, [filters, getStoredAuth]);

  const applyFilters = useCallback((newFilters: ActFilter) => {
    setFilters(newFilters);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(value => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== '';
    });
  }, [filters]);

  return {
    currentTab,
    setCurrentTab,
    filters,
    applyFilters,
    clearFilters,
    hasActiveFilters,
    loadTabData,
    isLoading: loadingStates[currentTab]
  };
};
