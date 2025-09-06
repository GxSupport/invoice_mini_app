import type { FC } from 'react';

interface StatusBadgeProps {
  type: 'dot' | 'chip';
  color: string;
  text?: string;
}

export const StatusBadge: FC<StatusBadgeProps> = ({ type, color, text }) => {
  if (type === 'dot') {
    return (
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: color,
          marginLeft: '6px',
          flexShrink: 0
        }}
      />
    );
  }

  // chip type
  return (
    <div
      style={{
        fontSize: '12px',
        padding: '2px 8px',
        borderRadius: '12px',
        backgroundColor: color,
        color: '#ffffff',
        fontWeight: 500,
        textAlign: 'center' as const,
        minWidth: '60px',
        whiteSpace: 'nowrap' as const
      }}
    >
      {text}
    </div>
  );
};