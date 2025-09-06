import { List, Section, Cell, Text } from '@telegram-apps/telegram-ui';
import { Calendar, FileText } from 'lucide-react';
import type { FC } from 'react';

import type { Act } from '@/types/act';
import { formatDate } from '@/utils/formatters';

interface ActMetadataProps {
  act: Act;
}

export const ActMetadata: FC<ActMetadataProps> = ({ act }) => {
  return (
    <List>
      <Section header="Дополнительная информация">
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
              {formatDate(act.date)}
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

        {/* Note/Comment if exists */}
        {act.note && (
          <Cell
            before={<FileText size={20} strokeWidth={1.5} />}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <Text
                style={{
                  fontSize: '16px',
                  fontWeight: 400,
                  color: 'var(--tg-theme-text-color, #000000)',
                  lineHeight: '20px'
                }}
              >
                {act.note}
              </Text>
              <Text
                style={{
                  fontSize: '14px',
                  color: 'var(--tg-theme-hint-color, #999999)',
                  lineHeight: '18px'
                }}
              >
                Примечание
              </Text>
            </div>
          </Cell>
        )}

        {/* Act ID for reference */}
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