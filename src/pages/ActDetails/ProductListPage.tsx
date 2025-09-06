import { List, Section, Cell, Text } from '@telegram-apps/telegram-ui';
import { Package } from 'lucide-react';
import { useParams } from 'react-router-dom';
import type { FC } from 'react';

import { Page } from '@/components/Page';
import { ShimmerLoader } from '@/pages/ActList/components/ShimmerLoader';
import { useActDetails } from './hooks/useActDetails';
import { formatAmount } from '@/utils/formatters';

export const ProductListPage: FC = () => {
  const { actId } = useParams<{ actId: string }>();
  const { act, isLoading, error } = useActDetails(actId || '');

  if (isLoading) {
    return (
      <Page back={true}>
        <ShimmerLoader itemCount={5} />
      </Page>
    );
  }

  if (error || !act) {
    return (
      <Page back={true}>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <Text style={{ color: 'var(--tg-theme-destructive-text-color, #ff0000)' }}>
            {error || 'Не удалось загрузить позиции'}
          </Text>
        </div>
      </Page>
    );
  }

  const products = act.productlist?.products || [];

  return (
    <Page back={true}>
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--tg-theme-secondary-bg-color, #f5f5f5)'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px',
          backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
          borderBottom: '1px solid var(--tg-theme-separator-color, #e5e5e5)'
        }}>
          <Text
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color: 'var(--tg-theme-text-color, #000000)',
              lineHeight: '24px'
            }}
          >
            Позиции акта № {act.actdoc.actno}
          </Text>
          <Text
            style={{
              fontSize: '14px',
              color: 'var(--tg-theme-hint-color, #999999)',
              lineHeight: '18px',
              marginTop: '4px'
            }}
          >
            Всего позиций: {products.length}
          </Text>
        </div>

        {/* Products List */}
        <div style={{ backgroundColor: 'var(--tg-theme-bg-color, #ffffff)' }}>
          <List>
            <Section>
              {products.map((product) => (
                <Cell
                  key={product.ordno}
                  before={<Package size={20} strokeWidth={1.5} />}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {/* Product name with order number */}
                    <Text
                      style={{
                        fontSize: '16px',
                        fontWeight: 500,
                        color: 'var(--tg-theme-text-color, #000000)',
                        lineHeight: '20px'
                      }}
                    >
                      {product.ordno}. {product.name}
                    </Text>
                    
                    {/* Count × summa = totalsum */}
                    <Text
                      style={{
                        fontSize: '14px',
                        color: 'var(--tg-theme-hint-color, #999999)',
                        lineHeight: '18px'
                      }}
                    >
                      {formatAmount(product.count)} × {formatAmount(product.summa)} = {formatAmount(product.totalsum)}
                    </Text>
                    
                    {/* Package and catalog code */}
                    {(product.packagename || product.catalogcode) && (
                      <Text
                        style={{
                          fontSize: '12px',
                          color: 'var(--tg-theme-hint-color, #999999)',
                          lineHeight: '16px'
                        }}
                      >
                        {[
                          product.packagename,
                          product.catalogcode && `Код: ${product.catalogcode}`
                        ].filter(Boolean).join(' • ')}
                      </Text>
                    )}
                  </div>
                </Cell>
              ))}
            </Section>
          </List>
        </div>

        {/* Empty state */}
        {products.length === 0 && (
          <div style={{
            padding: '40px 16px',
            textAlign: 'center'
          }}>
            <Package size={48} color="var(--tg-theme-hint-color, #999999)" />
            <Text
              style={{
                fontSize: '16px',
                color: 'var(--tg-theme-hint-color, #999999)',
                marginTop: '12px'
              }}
            >
              Позиции не найдены
            </Text>
          </div>
        )}
      </div>
    </Page>
  );
};