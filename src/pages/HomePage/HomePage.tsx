import { useEffect, useMemo } from 'react';
import { List, Section, Cell, Avatar, Badge } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';

import { Page } from '@/components/Page';
import type { HomeProps, DocumentCategory, DocumentType } from '@/types/home';

// Document categories configuration
const DOCUMENT_CATEGORIES: DocumentCategory[] = [
  { type: 'invoice', title: 'Invoice', icon: '📄' },
  { type: 'act', title: 'Act', icon: '📋' },
  { type: 'ttn', title: 'TTN', icon: '🚛' },
  { type: 'empowerment', title: 'Empowerment', icon: '✍️' },
  { type: 'contract', title: 'Contract', icon: '📝' },
];

export const HomePage: FC<HomeProps> = ({ user, stats, onOpen }) => {
  // Generate avatar initials from full_name
  const avatarInitials = useMemo(() => {
    if (!user.full_name) return 'U';

    const names = user.full_name.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }

    return names
      .slice(0, 2)
      .map(name => name.charAt(0).toUpperCase())
      .join('');
  }, [user.full_name]);

  // Format item count text
  const formatItemCount = (count?: number) => {
    if (!count) return undefined;
    return `${count} items`;
  };

  return (
    <Page back={false}>
      <List>
        {/* User Header Section */}
        <Section>
          <Cell
            before={
              <Avatar size={48} acronym={avatarInitials} />
            }
            subtitle={user.activeCompanyInfo.shortName}
            after="›"
          >
            {user.full_name}
          </Cell>
        </Section>

        {/* Documents List Section */}
        <Section header="Hujjatlar roʻyxati">
          {DOCUMENT_CATEGORIES.map((category) => {
            const categoryStats = stats[category.type];
            const hasItems = categoryStats?.count && categoryStats.count > 0;
            const hasPending = categoryStats?.pending && categoryStats.pending > 0;

            return (
              <Cell
                key={category.type}
                before={<span style={{ fontSize: '20px' }}>{category.icon}</span>}
                subtitle={hasItems ? formatItemCount(categoryStats.count) : undefined}
                after={
                  hasPending ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Badge type="number" mode="critical">
                        +{categoryStats.pending}
                      </Badge>
                      <span>›</span>
                    </div>
                  ) : (
                    '›'
                  )
                }
                onClick={() => onOpen(category.type)}
              >
                {category.title}
              </Cell>
            );
          })}
        </Section>
      </List>
    </Page>
  );
};
