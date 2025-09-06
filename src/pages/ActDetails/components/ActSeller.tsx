import { List, Section, Cell, Text } from '@telegram-apps/telegram-ui';
import { Building2, Hash, FileText, ChevronRight } from 'lucide-react';
import type { FC } from 'react';

import type { ActDetail } from '@/types/act/detail';
import { formatDate } from '@/utils/formatters';

interface ActSellerProps {
  act: ActDetail;
}

export const ActSeller: FC<ActSellerProps> = ({ act }) => {
  const handleContractClick = () => {
    // Placeholder for contract opening functionality
    console.log('Open contract:', act.contractdoc);
  };

  return (
    <List>
      <Section header="Стороны">
        {/* Seller */}
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
              {act.sellername}
            </Text>
            <Text
              style={{
                fontSize: '14px',
                color: 'var(--tg-theme-hint-color, #999999)',
                lineHeight: '18px'
              }}
            >
              Продавец • ИНН {act.sellertin}
              {act.sellerbranchname && ` • ${act.sellerbranchname}`}
            </Text>
            {act.sellerbranchcode && (
              <Text
                style={{
                  fontSize: '12px',
                  color: 'var(--tg-theme-hint-color, #999999)',
                  lineHeight: '16px'
                }}
              >
                Филиал: {act.sellerbranchcode}
              </Text>
            )}
          </div>
        </Cell>

        {/* Buyer */}
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
              {act.buyername}
            </Text>
            <Text
              style={{
                fontSize: '14px',
                color: 'var(--tg-theme-hint-color, #999999)',
                lineHeight: '18px'
              }}
            >
              Покупатель • ИНН {act.buyertin}
              {act.buyerbranchname && ` • ${act.buyerbranchname}`}
            </Text>
            {act.buyerbranchcode && (
              <Text
                style={{
                  fontSize: '12px',
                  color: 'var(--tg-theme-hint-color, #999999)',
                  lineHeight: '16px'
                }}
              >
                Филиал: {act.buyerbranchcode}
              </Text>
            )}
          </div>
        </Cell>

        {/* Contract */}
        {act.contractdoc && (
          <Cell
            before={<FileText size={20} strokeWidth={1.5} />}
            after={<ChevronRight size={16} strokeWidth={1.5} />}
            onClick={handleContractClick}
            interactiveAnimation="opacity"
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
                Договор № {act.contractdoc.contractno}
              </Text>
              <Text
                style={{
                  fontSize: '14px',
                  color: 'var(--tg-theme-hint-color, #999999)',
                  lineHeight: '18px'
                }}
              >
                от {formatDate(act.contractdoc.contractdate)}
              </Text>
            </div>
          </Cell>
        )}
      </Section>
    </List>
  );
};