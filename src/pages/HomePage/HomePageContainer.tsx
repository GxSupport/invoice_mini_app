import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner, Placeholder } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { HomePage } from './HomePage';
import type { MenuItemType } from '@/types/home';
import type { InvoiceUser } from '@/types/auth';

export const HomePageContainer: FC = () => {
  const navigate = useNavigate();
  const { getStoredAuth } = useAuth();
  const [user, setUser] = useState<InvoiceUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const authData = await getStoredAuth();
        if (authData?.isAuthenticated && authData.user) {
          setUser(authData.user);
        } else {
          // Redirect to login if not authenticated
          navigate('/login');
        }
      } catch (error) {
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleMenuOpen = (type: MenuItemType) => {
    switch (type) {
      case 'act':
        navigate('/act');
        break;
      case 'payments':
        // navigate('/payments');
        break;
      default:
        // navigate(`/documents/${type}`);
        console.log(`Navigation for ${type} not implemented yet`);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Placeholder description="Yuklanmoqda...">
          <Spinner size="m" />
        </Placeholder>
      </div>
    );
  }

  if (!user) {
    return null; // This shouldn't happen as we redirect to login
  }

  return (
    <HomePage
      user={user}
      onOpen={handleMenuOpen}
    />
  );
};
