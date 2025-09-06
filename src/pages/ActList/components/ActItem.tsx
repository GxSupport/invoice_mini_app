import { Cell, Text } from '@telegram-apps/telegram-ui';
import { FileSignature } from 'lucide-react';
import type { FC } from 'react';

import type { ActTabType } from '@/types/act';
import { formatAmount, formatDate } from '@/utils/formatters';
import { getStateColor } from '@/api/acts';
import { ActListResponseData } from '@/types/act/list';
import { StatusBadge } from './StatusBadge';

interface ActItemProps {
  act: ActListResponseData;
  tabType: ActTabType;
  onClick: (actId: string) => void;
}

export const ActItem: FC<ActItemProps> = ({ act, tabType, onClick }) => {
  // Determine counterpart based on tab type
  const getCounterpart = () => {
    switch (tabType) {
      case 'incoming':
        return {
          name: act.sellername,
          tin: act.sellertin
        };
      case 'outgoing':
        return {
          name: act.buyername,
          tin: act.buyertin
        };
      default:
        return {
          name: act.sellername,
          tin: act.sellertin
        };
    }
  };

  const counterpart = getCounterpart();
  const stateColor = getStateColor(act.stateid, act.statetext?.status);

  // Build description (contract + notes + date)
  const descriptionParts = [];

  if (act.contractdoc?.contractno) {
    descriptionParts.push(`Договор № ${act.contractdoc.contractno} от ${formatDate(act.contractdoc.contractdate)}`);
  }

  if (act.notes) {
    descriptionParts.push(`— ${act.notes}`);
  }

  // Add act date at the end
  descriptionParts.push(`· ${formatDate(act.actdoc.actdate)}`);

  const description = descriptionParts.join(' ');

  // Title with badge
  const titleContent = (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Text
        style={{
          fontSize: '16px',
          fontWeight: 600,
          color: 'var(--tg-theme-text-color, #000000)',
          lineHeight: '20px'
        }}
      >
        № {act.actdoc.actno}
      </Text>
      <StatusBadge type="dot" color={stateColor} />
    </div>
  );

  // After content (amount + status chip)
  const afterContent = (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '4px',
      minWidth: 'fit-content'
    }}>
      <Text
        style={{
          fontSize: '16px',
          fontWeight: 600,
          color: 'var(--tg-theme-text-color, #000000)'
        }}
      >
        {formatAmount(act.payabletotal)}
      </Text>
      <StatusBadge
        type="chip"
        color={stateColor}
        text={act.statetext?.text || `Status ${act.stateid}`}
      />
    </div>
  );

  return (
    <Cell
      title={titleContent}
      subhead={counterpart.name}
      subtitle={`ИНН ${counterpart.tin}`}
      description={description}
      after={afterContent}
      onClick={() => onClick(act.id)}
      interactiveAnimation="opacity"
      style={{
        minHeight: '56px',
        '--tg-cell-padding': '16px',
      } as any}
    >
    </Cell>
  );
};
