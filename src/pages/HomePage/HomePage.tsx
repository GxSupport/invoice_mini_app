import { useMemo } from 'react';
import { List, Section, Cell, Avatar } from '@telegram-apps/telegram-ui';
import {
  FileText,
  FileSignature,
  Truck,
  UserCheck,
  FileSpreadsheet,
  CreditCard,
  ExternalLink
} from 'lucide-react';
import type { FC } from 'react';

import { Page } from '@/components/Page';
import type { HomeProps, MenuSection } from '@/types/home';

// Menu sections configuration based on JSON design
const MENU_SECTIONS: MenuSection[] = [
  {
    title: 'Документы',
    items: [
      { id: 'invoice', title: 'Счет фактуры', icon: { library: 'lucide', name: 'FileText', size: 20 }, chevron: true },
      { id: 'act', title: 'Акты', icon: { library: 'lucide', name: 'FileSignature', size: 20 }, chevron: true },
      { id: 'ttn', title: 'ТТН 2', icon: { library: 'lucide', name: 'Truck', size: 20 }, chevron: true },
      { id: 'empowerment', title: 'Доверенность', icon: { library: 'lucide', name: 'UserCheck', size: 20 }, chevron: true },
      { id: 'contract', title: 'Договоры', icon: { library: 'lucide', name: 'FileSpreadsheet', size: 20 }, chevron: true },
    ],
  },
  {
    title: 'Другие',
    items: [
      { id: 'payments', title: 'Payments', icon: { library: 'lucide', name: 'CreditCard', size: 20 }, chevron: true },
    ],
  },
];

// Icon mapping
const iconMap = {
  FileText,
  FileSignature,
  Truck,
  UserCheck,
  FileSpreadsheet,
  CreditCard,
};

export const HomePage: FC<HomeProps> = ({ user, onOpen }) => {
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

  // Get icon component by name
  const getIconComponent = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent ? <IconComponent size={20} /> : null;
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
            after={<ExternalLink size={20} />}
          >
            {user.full_name}
          </Cell>
        </Section>

        {/* Menu Sections */}
        {MENU_SECTIONS.map((section) => (
          <Section key={section.title} header={section.title}>
            {section.items.map((item) => (
              <Cell
                key={item.id}
                before={getIconComponent(item.icon.name)}
                after={item.chevron ? '›' : undefined}
                onClick={() => onOpen(item.id)}
              >
                {item.title}
              </Cell>
            ))}
          </Section>
        ))}
      </List>
    </Page>
  );
};
