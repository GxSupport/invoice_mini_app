import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner, Placeholder } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { HomePage } from './HomePage';
import type { DocumentType, DocumentStats } from '@/types/home';
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
        console.error('Failed to load user data:', error);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Mock stats data - in real app this would come from API
  const mockStats = useMemo(() => ({
    invoice: { count: 19, pending: 5 } as DocumentStats,
    act: { count: 12 } as DocumentStats,
    ttn: { count: 8, pending: 2 } as DocumentStats,
    empowerment: { count: 3 } as DocumentStats,
    contract: { count: 15, pending: 1 } as DocumentStats,
  }), []);

  const handleDocumentOpen = (type: DocumentType) => {
    console.log('Opening document type:', type);
    // TODO: Navigate to document list page
    // navigate(`/documents/${type}`);
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
      stats={mockStats}
      onOpen={handleDocumentOpen}
    />
  );
};