import { Button } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';

import type { ActTabType } from '@/types/act';

interface ActTabsProps {
  activeTab: ActTabType;
  onTabChange: (tab: ActTabType) => void;
}

const TAB_LABELS: Record<ActTabType, string> = {
  incoming: 'Входящие',
  outgoing: 'Исходящие',
  draft: 'Черновик',
  sending: 'В процессе отправки'
};

const TABS: ActTabType[] = ['incoming', 'outgoing', 'draft', 'sending'];

export const ActTabs: FC<ActTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div style={{ 
      display: 'flex',
      gap: '8px',
      padding: '12px 16px',
      backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
      borderBottom: '1px solid var(--tg-theme-separator-color, #e5e5e5)',
      overflowX: 'auto',
      WebkitOverflowScrolling: 'touch'
    }}>
      {TABS.map((tab) => (
        <Button
          key={tab}
          size="s"
          mode={activeTab === tab ? 'filled' : 'outline'}
          onClick={() => onTabChange(tab)}
          style={{
            minWidth: 'fit-content',
            whiteSpace: 'nowrap',
            fontSize: '14px',
            padding: '6px 12px'
          }}
        >
          {TAB_LABELS[tab]}
        </Button>
      ))}
    </div>
  );
};