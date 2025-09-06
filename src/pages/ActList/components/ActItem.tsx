import { Cell, Text } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';

import type { ActTabType } from '@/types/act';
import { formatAmount, formatDate } from '@/utils/formatters';
import {getStateColor, getStatusInfo} from '@/api/acts';
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
  const stateInfo = getStatusInfo(tabType, act.stateid);
  // Build description (contract + notes + date)
  const descriptionParts = [];
  if (act.contractdoc?.contractno) {
    descriptionParts.push(`Дог № ${act.contractdoc.contractno} от ${formatDate(act.contractdoc.contractdate)}`);
  }

  // if (act.notes) {
  //   descriptionParts.push(`— ${act.notes}`);
  // }

  // Add act date at the end
    descriptionParts.push(`Акт № ${formatDate(act.actdoc.actdate)}`);

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
        № {act.actdoc.actno} от {formatDate(act.actdoc.actdate)}
      </Text>
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
        {formatAmount(act.payabletotal)} cум
      </Text>
      <StatusBadge
        type="chip"
        color={stateColor}
        text={stateInfo.text || `Status ${act.stateid}`}
      />
    </div>
  );

  return (
    <Cell
        subhead={counterpart.name}

      description={description}
      after={afterContent}
      onClick={() => onClick(act.id)}
      interactiveAnimation="opacity"
      style={{
        minHeight: '56px',
        '--tg-cell-padding': '8px',
      } as any}
    >
        {titleContent}
    </Cell>
  );
};
