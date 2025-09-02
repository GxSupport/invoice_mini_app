import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCloudStorageItem, setCloudStorageItem, deleteCloudStorageItem } from '@telegram-apps/sdk-react';
import type { AuthData, AuthState, VerificationResponse } from '@/types/auth';
import { verifyUser } from '@/api/auth';

const AUTH_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
} as const;

export const useAuth = () => {
  const queryClient = useQueryClient();

  const getStoredAuth = async (): Promise<AuthState | null> => {
    try {
      const token = await getCloudStorageItem(AUTH_KEYS.TOKEN).catch(() => null);
      const userStr = await getCloudStorageItem(AUTH_KEYS.USER).catch(() => null);

      if (token && userStr) {
        const user = JSON.parse(userStr);
        return { token, user, isAuthenticated: true };
      }

      return null;
    } catch (error) {
      console.error('Error in getStoredAuth:', error);
      return null;
    }
  };

  const setAuth = async (authData: AuthData): Promise<void> => {
    try {
      await setCloudStorageItem(AUTH_KEYS.TOKEN, authData.token);
      await setCloudStorageItem(AUTH_KEYS.USER, JSON.stringify(authData.user));
    } catch (error) {
      console.error('Error setting auth data:', error);
      throw error;
    }
  };

  const clearAuth = async (): Promise<void> => {
    try {
      await deleteCloudStorageItem(AUTH_KEYS.TOKEN).catch(() => {});
      await deleteCloudStorageItem(AUTH_KEYS.USER).catch(() => {});
      queryClient.clear();
    } catch (error) {
      console.error('Error clearing auth:', error);
    }
  };

  return {
    getStoredAuth,
    setAuth,
    clearAuth,
  };
};

export const useUserVerification = (initRawData: string | null) => {
  const { setAuth } = useAuth();

  return useQuery<VerificationResponse>({
    queryKey: ['userVerification', initRawData],
    queryFn: () => verifyUser(initRawData!),
    enabled: !!initRawData,
    retry: false,
    staleTime: 0,
    onSuccess: async (data: VerificationResponse) => {
      if (data.token && data.user) {
        await setAuth(data);
      }
    },
  });
};