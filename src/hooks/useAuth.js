import { useQuery, useQueryClient } from '@tanstack/react-query';
import { verifyUser } from '@/api/auth.js';

export const useAuth = () => {
  const queryClient = useQueryClient();

  const getStoredAuth = () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      return token && user ? { token, user, isAuthenticated: true } : null;
    } catch {
      return null;
    }
  };

  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    queryClient.clear();
  };

  const setAuth = (authData) => {
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify(authData.user));
  };

  return {
    getStoredAuth,
    clearAuth,
    setAuth,
  };
};

export const useUserVerification = (initRawData) => {
  const { setAuth } = useAuth();

  return useQuery({
    queryKey: ['userVerification', initRawData],
    queryFn: () => verifyUser(initRawData),
    enabled: !!initRawData,
    retry: false,
    staleTime: 0,
    onSuccess: (data) => {
      if (data.token && data.user) {
        setAuth(data);
      }
    },
  });
};