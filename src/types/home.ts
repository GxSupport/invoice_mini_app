import type { InvoiceUser } from './auth';

export type DocumentType = 'invoice' | 'act' | 'ttn' | 'empowerment' | 'contract';

export interface DocumentStats {
  count?: number;
  pending?: number;
}

export interface HomeProps {
  user: InvoiceUser;
  stats: Record<DocumentType, DocumentStats>;
  onOpen: (type: DocumentType) => void;
}

export interface DocumentCategory {
  type: DocumentType;
  title: string;
  icon: string;
}