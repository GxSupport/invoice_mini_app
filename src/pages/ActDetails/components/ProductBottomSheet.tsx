import { List, Section, Cell, Text, Modal } from '@telegram-apps/telegram-ui';
import { Package } from 'lucide-react';
import type { FC } from 'react';

import type { Product } from '@/types/act/detail';
import { formatAmount } from '@/utils/formatters';

interface ProductBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

export const ProductBottomSheet: FC<ProductBottomSheetProps> = ({
  isOpen,
  onClose,
  products
}) => {
  return (
    <Modal
      open={isOpen}
      onOpenChange={onClose}
      header="Позиции акта"
    >
      <div style={{
        maxHeight: '70vh',
        overflow: 'auto'
      }}>
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
    </Modal>
  );
};