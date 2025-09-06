import { useParams } from 'react-router-dom';
import type { FC } from 'react';

import { ActDetailsPage } from './ActDetailsPage';
import { useActDetails } from './hooks/useActDetails';

export const ActDetailsContainer: FC = () => {
  const { actId } = useParams<{ actId: string }>();
  
  const {
    act,
    isLoading,
    error,
    retry
  } = useActDetails(actId || '');

  return (
    <ActDetailsPage
      act={act}
      isLoading={isLoading}
      error={error}
      onRetry={retry}
      actId={actId || ''}
    />
  );
};