import {Cell, Text} from '@telegram-apps/telegram-ui';

import { FileSignature } from 'lucide-react';
import type { FC } from 'react';

import type { Act } from '@/types/act';
import { formatAmount, formatDate } from '@/utils/formatters';

interface ActItemProps {
  act: Act;
  onClick: (actId: string) => void;
}

// Status color mapping
const getStatusColor = (status: Act['state']): 'primary' | 'secondary' | 'green' | 'red' => {
  switch (status) {
    case 'completed':
      return 'green';
    case 'error':
      return 'red';
    case 'draft':
      return 'secondary';
    case 'sending':
      return 'primary';
    default:
      return 'secondary';
  }
};

// Status text mapping
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

export const ActItem: FC<ActItemProps> = ({ act, onClick }) => {
  // Build subtitle with seller name, TIN, and optional note
  const subtitle = [
    `${act.seller.name} (ИНН ${act.seller.tin})`,
    act.note && `— ${act.note}`
  ].filter(Boolean).join(' ');

  const rightContent = (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '4px',
      minWidth: 'fit-content'
    }}>
      <Text
        style={{
          fontSize: '16px',
          fontWeight: 600,
          color: 'var(--tg-theme-text-color, #000000)'
        }}
      >
        {formatAmount(act.payable_total)}
      </Text>

      <div
        style={{
          fontSize: '12px',
          padding: '2px 6px',
          borderRadius: '8px',
          backgroundColor: getStatusColor(act.state) === 'green'
            ? 'var(--tg-theme-link-color, #007AFF)'
            : getStatusColor(act.state) === 'red'
            ? 'var(--tg-theme-destructive-text-color, #ff0000)'
            : 'var(--tg-theme-hint-color, #999999)',
          color: '#ffffff',
          fontWeight: 500,
          textAlign: 'center' as const,
          minWidth: '60px'
        }}
      >
        {getStatusText(act.state)}
      </div>
    </div>
  );

  return (
    <Cell
      before={<FileSignature size={20} strokeWidth={1.5} />}
      after={rightContent}
      onClick={() => onClick(act.id)}
      interactiveAnimation="opacity"
      style={{
        minHeight: '64px',
        padding: '12px 16px'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <Text
          style={{
            fontSize: '16px',
            fontWeight: 500,
            color: 'var(--tg-theme-text-color, #000000)',
            lineHeight: '20px'
          }}
        >
          № {act.no}
        </Text>
        <Text
          style={{
            fontSize: '14px',
            color: 'var(--tg-theme-hint-color, #999999)',
            lineHeight: '18px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '200px'
          }}
        >
          {subtitle}
        </Text>
        <Text
          style={{
            fontSize: '12px',
            color: 'var(--tg-theme-hint-color, #999999)',
            lineHeight: '16px'
          }}
        >
          {formatDate(act.date)}
        </Text>
      </div>
    </Cell>
  );
};
