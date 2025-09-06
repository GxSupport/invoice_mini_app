export type ActStatus = 'draft' | 'sending' | 'sent' | 'received' | 'completed' | 'error';

export type ActTabType = 'incoming' | 'outgoing' | 'draft' | 'sending';

export interface ActSeller {
  name: string;
  tin: string;
}

export interface Act {
  id: string;
  no: string;
  date: string; // ISO date string
  seller: ActSeller;
  payable_total: number;
  note?: string;
  state: ActStatus;
}

export interface ActFilter {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  statuses?: ActStatus[];
  amountMin?: number;
  amountMax?: number;
}

export interface ActListResponse {
  items: Act[];
  hasMore: boolean;
  cursor?: string;
  total: number;
}

export interface ActListProps {
  onItemClick: (actId: string) => void;
}