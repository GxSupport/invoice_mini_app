import { useState, useEffect, useCallback } from 'react';
import { getCloudStorageItem, setCloudStorageItem, deleteCloudStorageItem } from '@telegram-apps/sdk-react';
import type { AuthData, AuthState, VerificationResponse } from '@/types/auth';
import { verifyUser, getProfile } from '@/api/auth';

const AUTH_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user'
} as const;

export const useAuth = () => {
  const getStoredAuth = useCallback(async (): Promise<AuthState | null> => {
    try {
      let token: string | null = null;
      let user: any = null;

      // Use localStorage in development mode
      if (import.meta.env.DEV) {
        token = localStorage.getItem(AUTH_KEYS.TOKEN);
        const userStr = localStorage.getItem(AUTH_KEYS.USER);
        user = userStr ? JSON.parse(userStr) : null;
      } else {
        // Check if CloudStorage is available in production
        const telegram = (window as any).Telegram;
        if (!telegram?.WebApp) {
          token = localStorage.getItem(AUTH_KEYS.TOKEN);
          const userStr = localStorage.getItem(AUTH_KEYS.USER);
          user = userStr ? JSON.parse(userStr) : null;
        } else {
          token = await getCloudStorageItem(AUTH_KEYS.TOKEN);
          const userStr = await getCloudStorageItem(AUTH_KEYS.USER);
          user = userStr ? JSON.parse(userStr) : null;
        }
      }


      if (!token) {
        return { token: null, user: null, isAuthenticated: false };
      }

      // If token exists but user data is missing, fetch from API
      if (token && !user) {
        try {
          const profileResponse = await getProfile(token);
          user = profileResponse.data;

          // Save user data to storage
          if (import.meta.env.DEV) {
            localStorage.setItem(AUTH_KEYS.USER, JSON.stringify(user));
          } else {
            const telegram = (window as any).Telegram;
            if (telegram?.WebApp) {
              await setCloudStorageItem(AUTH_KEYS.USER, JSON.stringify(user));
            } else {
              localStorage.setItem(AUTH_KEYS.USER, JSON.stringify(user));
            }
          }

          return { token, user, isAuthenticated: true };
        } catch (error: any) {

          // If 401, token is invalid - clear it
          if (error.message?.includes('401') || error.response?.status === 401) {
            await clearAuth();
            return { token: null, user: null, isAuthenticated: false };
          }

          // For other errors, return with token but no user
          return { token, user: null, isAuthenticated: false };
        }
      }

      // Both token and user exist
      return { token, user, isAuthenticated: true };
    } catch (error) {
      // Fallback to localStorage if CloudStorage fails
      try {
        const token = localStorage.getItem(AUTH_KEYS.TOKEN);
        const userStr = localStorage.getItem(AUTH_KEYS.USER);
        const user = userStr ? JSON.parse(userStr) : null;

        if (token && !user) {
          // Try to fetch profile with localStorage token
          try {
            const profileResponse = await getProfile(token);
            const fetchedUser = profileResponse.data;
            localStorage.setItem(AUTH_KEYS.USER, JSON.stringify(fetchedUser));
            return { token, user: fetchedUser, isAuthenticated: true };
          } catch (profileError: any) {
            if (profileError.message?.includes('401') || profileError.response?.status === 401) {
              localStorage.removeItem(AUTH_KEYS.TOKEN);
              localStorage.removeItem(AUTH_KEYS.USER);
              return { token: null, user: null, isAuthenticated: false };
            }
            return { token, user: null, isAuthenticated: false };
          }
        }

        return { token, user, isAuthenticated: !!(token && user) };
      } catch {
        return { token: null, user: null, isAuthenticated: false };
      }
    }
  }, []);

  const setAuth = useCallback(async (authData: AuthData & { user?: any }): Promise<void> => {
    try {
      // Use localStorage in development mode
      if (import.meta.env.DEV) {
        localStorage.setItem(AUTH_KEYS.TOKEN, authData.token);
        if (authData.user) {
          localStorage.setItem(AUTH_KEYS.USER, JSON.stringify(authData.user));
        }
        return;
      }

      // Check if CloudStorage is available in production
      const telegram = (window as any).Telegram;
      if (!telegram?.WebApp) {
        localStorage.setItem(AUTH_KEYS.TOKEN, authData.token);
        if (authData.user) {
          localStorage.setItem(AUTH_KEYS.USER, JSON.stringify(authData.user));
        }
        return;
      }

      await setCloudStorageItem(AUTH_KEYS.TOKEN, authData.token);
      if (authData.user) {
        await setCloudStorageItem(AUTH_KEYS.USER, JSON.stringify(authData.user));
      }
    } catch (error) {
      // Fallback to localStorage
      try {
        localStorage.setItem(AUTH_KEYS.TOKEN, authData.token);
        if (authData.user) {
          localStorage.setItem(AUTH_KEYS.USER, JSON.stringify(authData.user));
        }
      } catch {
        throw error;
      }
    }
  }, []);

  const clearAuth = async (): Promise<void> => {
    try {
      // Use localStorage in development mode
      if (import.meta.env.DEV) {
        localStorage.removeItem(AUTH_KEYS.TOKEN);
        localStorage.removeItem(AUTH_KEYS.USER);
        return;
      }

      // Check if CloudStorage is available in production
      const telegram = (window as any).Telegram;
      if (!telegram?.WebApp) {
        localStorage.removeItem(AUTH_KEYS.TOKEN);
        localStorage.removeItem(AUTH_KEYS.USER);
        return;
      }

      await deleteCloudStorageItem(AUTH_KEYS.TOKEN);
      await deleteCloudStorageItem(AUTH_KEYS.USER);
    } catch (error) {
      // Fallback to localStorage
      localStorage.removeItem(AUTH_KEYS.TOKEN);
      localStorage.removeItem(AUTH_KEYS.USER);
    }
  };

  return {
    getStoredAuth,
    setAuth,
    clearAuth,
  };
};

export const useUserVerification = (initRawData: string | null) => {
  const { setAuth, getStoredAuth } = useAuth();
  const [data, setData] = useState<VerificationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    if (!initRawData || hasRun) return;

    const fetchVerification = async () => {
      setIsLoading(true);
      setIsError(false);
      setError(null);
      setHasRun(true);

      try {
        // Check if auth data already exists in storage
        const storedAuth = await getStoredAuth();

        if (storedAuth?.isAuthenticated && storedAuth.token && storedAuth.user) {
          // Create verification response from stored data
          setData({
            token: storedAuth.token,
            is_exist: true,
            user: storedAuth.user
          });
          setIsLoading(false);
          return;
        }

        const result = await verifyUser(initRawData);
        setData(result);

        // Only set auth if user exists and has token
        if (result.token && result.is_exist) {
          await setAuth(result);
        } else if (!result.is_exist) {
          // User does not exist, treat as unauthenticated
          console.log('User does not exist (is_exist: false), treating as unauthenticated');
          // Don't set data with null token, keep original result but don't authenticate
        }
      } catch (err) {
        setIsError(true);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVerification();
  }, [initRawData, hasRun, setAuth, getStoredAuth]);

  return {
    data,
    isLoading,
    isError,
    error,
  };
};
