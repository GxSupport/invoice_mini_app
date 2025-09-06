import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { retrieveRawInitData } from '@telegram-apps/sdk-react';
import { Spinner, Placeholder } from '@telegram-apps/telegram-ui';
import { useUserVerification, useAuth } from '@/hooks/useAuth';
import type { AuthGuardProps } from '@/types/auth';

export function AuthGuard({ children }: AuthGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { getStoredAuth } = useAuth();
  const [initRawData, setInitRawData] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    try {
      const rawData = retrieveRawInitData();
      // @ts-ignore
        setInitRawData(rawData);
    } catch (error) {
      console.error('Failed to retrieve init data:', error);
    }
    setIsChecking(false);
  }, []);

  const { data: verificationData, isLoading, isError } = useUserVerification(initRawData);

  useEffect(() => {
    if (isChecking || isLoading) return;
    console.log('isChecking:', isChecking);
    console.log('isLoading:', isLoading);
    const checkAuth = async () => {
      console.log('Checking authentication status...');
      const storedAuth = await getStoredAuth();
      console.log('Stored Auth:', storedAuth);
      const isLoginPage = location.pathname === '/login';
      // Agar user verification muvaffaqiyatli bo'lsa va user mavjud bo'lsa
      if (verificationData?.token && verificationData?.is_exist) {
        if (isLoginPage) {
          navigate('/');
        }
        return;
      }


      // Agar SecureStorage'da auth bor bo'lsa
      if (storedAuth?.isAuthenticated) {
        if (isLoginPage) {
          navigate('/');
        }
        return;
      }

      // Agar verification failed bo'lsa, user mavjud emas bo'lsa, yoki auth yo'q bo'lsa, login sahifasiga yo'naltir
      if (isError || (verificationData && !verificationData.is_exist) || (!verificationData && !storedAuth)) {
        if (!isLoginPage) {
          console.log('Redirecting to login - reasons:', {
            isError,
            userNotExists: verificationData && !verificationData.is_exist,
            noAuthData: !verificationData && !storedAuth
          });
          navigate('/login');
        }
      }
    };

    checkAuth();
  }, [verificationData, isLoading, isError, isChecking, location.pathname, navigate, getStoredAuth]);

  if (isChecking || isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Placeholder
          description="Foydalanuvchi tekshirilmoqda..."
        >
          <Spinner size="m" />
        </Placeholder>
      </div>
    );
  }

  return children;
}
