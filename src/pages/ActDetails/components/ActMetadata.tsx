import { List, Section, Cell, Text } from '@telegram-apps/telegram-ui';
import { Calendar, FileText, Clock } from 'lucide-react';
import { useState } from 'react';
import type { FC } from 'react';

import type { ActDetail } from '@/types/act/detail';


interface ActMetadataProps {
  act: ActDetail;
}

const formatDateTime = (dateTime: string): string => {
  const date = new Date(dateTime);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const ActMetadata: FC<ActMetadataProps> = ({ act }) => {
  const [showFullNotes, setShowFullNotes] = useState(false);
  const shouldTruncateNotes = act.notes && act.notes.length > 100;

  return (
    <List>
      {/* Notes Section */}
      {act.notes && (
        <Section header="Примечание">
          <Cell
            before={<FileText size={20} strokeWidth={1.5} />}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Text
                style={{
                  fontSize: '16px',
                  fontWeight: 400,
                  color: 'var(--tg-theme-text-color, #000000)',
                  lineHeight: '22px',
                  ...(shouldTruncateNotes && !showFullNotes ? {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical'
                  } : {})
                }}
              >
                {act.notes}
              </Text>
              {shouldTruncateNotes && (
                <Text
                  onClick={() => setShowFullNotes(!showFullNotes)}
                  style={{
                    fontSize: '14px',
                    color: 'var(--tg-theme-link-color, #007AFF)',
                    cursor: 'pointer',
                    lineHeight: '18px'
                  }}
                >
                  {showFullNotes ? 'Показать меньше' : 'Показать больше'}
                </Text>
              )}
            </div>
          </Cell>
        </Section>
      )}
      {/* System Information */}
      <Section header="Системная информация">
        {/* Creation Date */}
        <Cell
          before={<Calendar size={20} strokeWidth={1.5} />}
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
              {formatDateTime(act.created_at)}
            </Text>
            <Text
              style={{
                fontSize: '14px',
                color: 'var(--tg-theme-hint-color, #999999)',
                lineHeight: '18px'
              }}
            >
              Дата создания
            </Text>
          </div>
        </Cell>

        {/* Update Date */}
        <Cell
          before={<Clock size={20} strokeWidth={1.5} />}
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
              {formatDateTime(act.updated_at)}
            </Text>
            <Text
              style={{
                fontSize: '14px',
                color: 'var(--tg-theme-hint-color, #999999)',
                lineHeight: '18px'
              }}
            >
              Последнее обновление
            </Text>
          </div>
        </Cell>

        {/* Act ID */}
        <Cell
          before={
            <div style={{
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: 'var(--tg-theme-hint-color, #999999)'
            }}>
              ID
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <Text
              style={{
                fontSize: '14px',
                fontWeight: 400,
                color: 'var(--tg-theme-hint-color, #999999)',
                lineHeight: '18px',
                fontFamily: 'monospace'
              }}
            >
              {act.id}
            </Text>
            <Text
              style={{
                fontSize: '12px',
                color: 'var(--tg-theme-hint-color, #999999)',
                lineHeight: '16px'
              }}
            >
              Системный идентификатор
            </Text>
          </div>
        </Cell>
      </Section>
    </List>
  );
};
