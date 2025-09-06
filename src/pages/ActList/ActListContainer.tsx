import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FC } from 'react';

import { ActListPage } from './ActListPage';

export const ActListContainer: FC = () => {
  const navigate = useNavigate();
  
  const handleItemClick = useCallback((actId: string) => {
    console.log('Opening act details for:', actId);
    navigate(`/act/${actId}`);
  }, [navigate]);

  return <ActListPage onItemClick={handleItemClick} />;
};