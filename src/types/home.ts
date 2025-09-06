import type { InvoiceUser } from './auth';

export type MenuItemType = 'invoice' | 'act' | 'ttn' | 'empowerment' | 'contract' | 'payments';

export interface HomeProps {
  user: InvoiceUser;
  onOpen: (type: MenuItemType) => void;
}

export interface MenuItem {
  id: MenuItemType;
  title: string;
  icon: {
    library: 'lucide';
    name: string;
    size: number;
  };
  chevron: boolean;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}