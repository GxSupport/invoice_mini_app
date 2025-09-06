import { Cell, List, Section } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';

interface ShimmerLoaderProps {
  itemCount?: number;
}

const ShimmerBox: FC<{ width?: string; height?: string }> = ({ 
  width = '100%', 
  height = '16px' 
}) => (
  <div
    style={{
      width,
      height,
      backgroundColor: 'var(--tg-theme-hint-color, #e0e0e0)',
      borderRadius: '4px',
      opacity: 0.3,
      animation: 'shimmer 1.2s ease-in-out infinite',
      background: `
        linear-gradient(
          90deg, 
          var(--tg-theme-hint-color, #e0e0e0) 25%, 
          var(--tg-theme-secondary-bg-color, #f0f0f0) 50%, 
          var(--tg-theme-hint-color, #e0e0e0) 75%
        )`,
      backgroundSize: '200% 100%'
    }}
  />
);

const ShimmerItem: FC = () => (
  <Cell
    before={
      <div style={{ width: '20px', height: '20px' }}>
        <ShimmerBox width="20px" height="20px" />
      </div>
    }
    after={
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'flex-end',
        gap: '4px',
        minWidth: '80px'
      }}>
        <ShimmerBox width="80px" height="16px" />
        <ShimmerBox width="60px" height="14px" />
      </div>
    }
    style={{
      minHeight: '64px',
      padding: '12px 16px'
    }}
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <ShimmerBox width="120px" height="16px" />
      <ShimmerBox width="200px" height="14px" />
      <ShimmerBox width="80px" height="12px" />
    </div>
  </Cell>
);

export const ShimmerLoader: FC<ShimmerLoaderProps> = ({ itemCount = 3 }) => {
  return (
    <>
      <style>
        {`
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
        `}
      </style>
      <List>
        <Section>
          {Array.from({ length: itemCount }, (_, index) => (
            <ShimmerItem key={index} />
          ))}
        </Section>
      </List>
    </>
  );
};