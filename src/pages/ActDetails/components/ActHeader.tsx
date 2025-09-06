import { Text } from '@telegram-apps/telegram-ui';
import { FileSignature } from 'lucide-react';
import type { FC } from 'react';

import type { Act } from '@/types/act';
import { formatDate } from '@/utils/formatters';

interface ActHeaderProps {
  act: Act;
}

// Status color mapping (same as ActItem)
const getStatusColor = (status: Act['state']): string => {
  switch (status) {
    case 'completed':
      return 'var(--tg-theme-link-color, #007AFF)';
    case 'error':
      return 'var(--tg-theme-destructive-text-color, #ff0000)';
    case 'draft':
      return 'var(--tg-theme-hint-color, #999999)';
    case 'sending':
      return 'var(--tg-theme-button-color, #007AFF)';
    default:
      return 'var(--tg-theme-hint-color, #999999)';
  }
};

// Status text mapping (same as ActItem)  
const getStatusText = (status: Act['state']): string => {
  switch (status) {
    case 'draft':
      return 'Черновик';
    case 'sending':
      return 'Отправка';
    case 'sent':
      return 'Отправлен';
    case 'received':
      return 'Получен';
    case 'completed':
      return 'Завершен';
    case 'error':
      return 'Ошибка';
    default:
      return status;
  }
};

export const ActHeader: FC<ActHeaderProps> = ({ act }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      padding: '20px 16px',
      backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
      borderBottom: '1px solid var(--tg-theme-separator-color, #e5e5e5)'
    }}>
      {/* Act Number and Status */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <FileSignature size={24} strokeWidth={1.5} color="var(--tg-theme-text-color, #000000)" />
          <Text
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color: 'var(--tg-theme-text-color, #000000)',
              lineHeight: '24px'
            }}
          >
            № {act.no}
          </Text>
        </div>
        
        {/* Status Chip */}
        <div
          style={{
            fontSize: '14px',
            padding: '4px 12px',
            borderRadius: '12px',
            backgroundColor: getStatusColor(act.state),
            color: '#ffffff',
            fontWeight: 500,
            textAlign: 'center' as const,
            minWidth: 'fit-content',
            whiteSpace: 'nowrap' as const
          }}
        >
          {getStatusText(act.state)}
        </div>
      </div>

      {/* Date */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <Text
          style={{
            fontSize: '16px',
            color: 'var(--tg-theme-hint-color, #999999)',
            lineHeight: '20px'
          }}
        >
          📅 {formatDate(act.date)}
        </Text>
      </div>
    </div>
  );
};