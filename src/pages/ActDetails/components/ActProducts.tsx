import { List, Section, Cell, Text } from '@telegram-apps/telegram-ui';
import { Package, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { FC } from 'react';

import type { ProductList } from '@/types/act/detail';
import { formatAmount } from '@/utils/formatters';

interface ActProductsProps {
  products: ProductList;
  payableTotal: number;
  actId: string;
}

export const ActProducts: FC<ActProductsProps> = ({ products, payableTotal, actId }) => {
  const navigate = useNavigate();

  const productsCount = products.products?.length || 0;
  const totalSum = products.products?.reduce((sum, product) => sum + product.totalsum, 0) || payableTotal;

  return (
    <>
      <List>
        <Section header="Содержимое">
          {/* Summary Cell */}
          <Cell
            before={<Package size={20} strokeWidth={1.5} />}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <Text
                style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  color: 'var(--tg-theme-text-color, #000000)',
                  lineHeight: '20px'
                }}
              >
                Позиций: {productsCount} • Сумма: {formatAmount(totalSum)}
              </Text>
              <Text
                style={{
                  fontSize: '14px',
                  color: 'var(--tg-theme-hint-color, #999999)',
                  lineHeight: '18px'
                }}
              >
                Товары и услуги
              </Text>
            </div>
          </Cell>

          {/* Show Products Button */}
          {productsCount > 0 && (
            <Cell
              after={<ChevronRight size={16} strokeWidth={1.5} />}
              onClick={() => navigate(`/act/${actId}/products`)}
              interactiveAnimation="opacity"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <Text
                  style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: 'var(--tg-theme-link-color, #007AFF)',
                    lineHeight: '20px'
                  }}
                >
                  Показать позиции
                </Text>
                <Text
                  style={{
                    fontSize: '14px',
                    color: 'var(--tg-theme-hint-color, #999999)',
                    lineHeight: '18px'
                  }}
                >
                  Подробный список товаров
                </Text>
              </div>
            </Cell>
          )}
        </Section>
      </List>
    </>
  );
};
