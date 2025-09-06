import { List, Section, Cell, Text } from '@telegram-apps/telegram-ui';
import { DollarSign } from 'lucide-react';
import type { FC } from 'react';

import { formatAmount } from '@/utils/formatters';

interface ActAmountProps {
  amount: number;
}

export const ActAmount: FC<ActAmountProps> = ({ amount }) => {
  return (
    <List>
      <Section header="Сумма к оплате">
        <Cell
          before={<DollarSign size={20} strokeWidth={1.5} />}
        >
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            width: '100%'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <Text
                style={{
                  fontSize: '14px',
                  color: 'var(--tg-theme-hint-color, #999999)',
                  lineHeight: '18px'
                }}
              >
                Общая сумма
              </Text>
              <Text
                style={{
                  fontSize: '12px',
                  color: 'var(--tg-theme-hint-color, #999999)',
                  lineHeight: '16px'
                }}
              >
                включая все налоги
              </Text>
            </div>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'flex-end',
              gap: '2px'
            }}>
              <Text
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: 'var(--tg-theme-text-color, #000000)',
                  lineHeight: '24px',
                  fontFamily: 'monospace'
                }}
              >
                {formatAmount(amount)}
              </Text>
              <Text
                style={{
                  fontSize: '14px',
                  color: 'var(--tg-theme-hint-color, #999999)',
                  lineHeight: '18px',
                  fontWeight: 500
                }}
              >
                UZS
              </Text>
            </div>
          </div>
        </Cell>
      </Section>
    </List>
  );
};