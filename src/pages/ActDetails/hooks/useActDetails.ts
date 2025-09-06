import { useState, useEffect, useCallback } from 'react';
import type { ActDetail } from '@/types/act/detail';
import { getActById } from '@/api/acts';
import { useAuth } from '@/hooks/useAuth';

interface UseActDetailsResult {
  act: ActDetail | null;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

export const useActDetails = (actId: string): UseActDetailsResult => {
  const [act, setAct] = useState<ActDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getStoredAuth } = useAuth();

  const loadActDetails = useCallback(async (id: string) => {
    if (!id) {
      setError('Act ID is required');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get auth token
      const authData = await getStoredAuth();
      if (!authData?.isAuthenticated || !authData.token) {
        throw new Error('User not authenticated');
      }

      // Call real API
      const actData = await getActById(id, authData.token);
      setAct(actData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки акта');
      setAct(null);
    } finally {
      setIsLoading(false);
    }
  }, [getStoredAuth]);

  useEffect(() => {
    loadActDetails(actId);
  }, [actId, loadActDetails]);

  const retry = useCallback(() => {
    loadActDetails(actId);
  }, [actId, loadActDetails]);

  return {
    act,
    isLoading,
    error,
    retry
  };
};