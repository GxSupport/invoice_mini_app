import { List, Section, Cell, Text } from '@telegram-apps/telegram-ui';
import { Building2, Hash } from 'lucide-react';
import type { FC } from 'react';

import type { ActSeller as ActSellerType } from '@/types/act';

interface ActSellerProps {
  seller: ActSellerType;
}

export const ActSeller: FC<ActSellerProps> = ({ seller }) => {
  return (
    <List>
      <Section header="Информация о продавце">
        {/* Company Name */}
        <Cell
          before={<Building2 size={20} strokeWidth={1.5} />}
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
              {seller.name}
            </Text>
            <Text
              style={{
                fontSize: '14px',
                color: 'var(--tg-theme-hint-color, #999999)',
                lineHeight: '18px'
              }}
            >
              Организация
            </Text>
          </div>
        </Cell>

        {/* TIN Number */}
        <Cell
          before={<Hash size={20} strokeWidth={1.5} />}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <Text
              style={{
                fontSize: '16px',
                fontWeight: 500,
                color: 'var(--tg-theme-text-color, #000000)',
                lineHeight: '20px',
                fontFamily: 'monospace'
              }}
            >
              {seller.tin}
            </Text>
            <Text
              style={{
                fontSize: '14px',
                color: 'var(--tg-theme-hint-color, #999999)',
                lineHeight: '18px'
              }}
            >
              ИНН
            </Text>
          </div>
        </Cell>
      </Section>
    </List>
  );
};