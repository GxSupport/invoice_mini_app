import { Text } from '@telegram-apps/telegram-ui';
import { FileSignature } from 'lucide-react';
import { useState } from 'react';
import type { FC } from 'react';

import type { ActDetail } from '@/types/act/detail';
import { formatDate, formatAmount } from '@/utils/formatters';
import { getStateColor } from '@/api/acts';

interface ActHeaderProps {
  act: ActDetail;
}

export const ActHeader: FC<ActHeaderProps> = ({ act }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  const stateColor = getStateColor(act.statetext?.state || 0, act.statetext?.status);
  const shouldTruncateDescription = act.actdoc?.acttext && act.actdoc.acttext.length > 100;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: '20px 16px',
      backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
      borderBottom: '1px solid var(--tg-theme-separator-color, #e5e5e5)'
    }}>
      {/* Act Number, Date and Status */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flex: 1
        }}>
          <FileSignature size={24} strokeWidth={1.5} color="var(--tg-theme-text-color, #000000)" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Text
              style={{
                fontSize: '20px',
                fontWeight: 600,
                color: 'var(--tg-theme-text-color, #000000)',
                lineHeight: '24px'
              }}
            >
              № {act.actdoc.actno}
            </Text>
            <Text
              style={{
                fontSize: '16px',
                color: 'var(--tg-theme-hint-color, #999999)',
                lineHeight: '20px'
              }}
            >
              📅 {formatDate(act.actdoc.actdate)}
            </Text>
          </div>
        </div>
        
        {/* Status Chip */}
        <div
          style={{
            fontSize: '14px',
            padding: '6px 12px',
            borderRadius: '12px',
            backgroundColor: stateColor,
            color: '#ffffff',
            fontWeight: 500,
            textAlign: 'center' as const,
            minWidth: 'fit-content',
            whiteSpace: 'nowrap' as const
          }}
        >
          {act.statetext?.text || 'Неизвестно'}
        </div>
      </div>

      {/* Payable Total */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        <Text
          style={{
            fontSize: '16px',
            color: 'var(--tg-theme-hint-color, #999999)',
            lineHeight: '20px'
          }}
        >
          Сумма к оплате
        </Text>
        <Text
          style={{
            fontSize: '24px',
            fontWeight: 600,
            color: 'var(--tg-theme-text-color, #000000)',
            lineHeight: '28px'
          }}
        >
          {formatAmount(act.payabletotal)}
        </Text>
      </div>

      {/* Act Description */}
      {act.actdoc?.acttext && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          paddingTop: '8px',
          borderTop: '1px solid var(--tg-theme-separator-color, #e5e5e5)'
        }}>
          <Text
            style={{
              fontSize: '16px',
              fontWeight: 500,
              color: 'var(--tg-theme-text-color, #000000)',
              lineHeight: '20px'
            }}
          >
            Краткое описание
          </Text>
          <Text
            style={{
              fontSize: '14px',
              color: 'var(--tg-theme-text-color, #000000)',
              lineHeight: '20px',
              ...(shouldTruncateDescription && !showFullDescription ? {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical'
              } : {})
            }}
          >
            {act.actdoc.acttext}
          </Text>
          {shouldTruncateDescription && (
            <Text
              onClick={() => setShowFullDescription(!showFullDescription)}
              style={{
                fontSize: '14px',
                color: 'var(--tg-theme-link-color, #007AFF)',
                cursor: 'pointer',
                lineHeight: '18px'
              }}
            >
              {showFullDescription ? 'Показать меньше' : 'Показать больше'}
            </Text>
          )}
        </div>
      )}
    </div>
  );
};