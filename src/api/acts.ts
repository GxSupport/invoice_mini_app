import { apiClient } from './config';
import type { ActListResponse, Act, ActTabType, ActFilter } from '@/types/act';

// API Request interface matching backend parameters
export interface ActApiRequest {
  actno?: string;
  actdate_start?: string;
  actdate_end?: string;
  stateid?: number | null;
  contractno?: string;
  contractdate_start?: string;
  contractdate_end?: string;
  tin?: number | null;
  branchcode?: string;
  limit: number;
  page: number;
  sellertin?: number | null;
  seller_branchcode?: string;
}

// Status mappings for each tab type
export const STATUS_MAPPINGS = {
  incoming: {
    15: { text: 'ожидает вашей подписи', class: 'info', color: '#007AFF' },
    17: { text: 'отменено отправителем', class: 'warning', color: '#FF9500' },
    20: { text: 'Вы отклонили', class: 'danger', color: '#FF3B30' },
    30: { text: 'Принято', class: 'success', color: '#34C759' },
    40: { text: 'Не действительный', class: 'warning', color: '#FF9500' }
  },
  outgoing: {
    7: { text: 'ожидает подписи доверенного лица', class: 'info', color: '#007AFF' },
    8: { text: 'принято доверенного лица', class: 'info', color: '#007AFF' },
    9: { text: 'отклонено доверенного лица', class: 'info', color: '#007AFF' },
    10: { text: 'Отправлено', class: 'info', color: '#007AFF' },
    15: { text: 'ожидает подписи получателя', class: 'info', color: '#007AFF' },
    17: { text: 'Вы отменили отправку', class: 'warning', color: '#FF9500' },
    20: { text: 'Получатель отклонил', class: 'danger', color: '#FF3B30' },
    30: { text: 'Принято', class: 'success', color: '#34C759' },
    40: { text: 'Не действительный', class: 'warning', color: '#FF9500' }
  },
  draft: {
    0: { text: 'Создано', class: 'primary', color: '#007AFF' },
    2: { text: 'ошибка при отправки', class: 'warning', color: '#FF9500' }
  },
  sending: {
    1: { text: 'в процесс отправки', class: 'info', color: '#007AFF' }
  }
} as const;

// Get status info by tab type and state ID
export const getStatusInfo = (tabType: ActTabType, stateId: number) => {
  const mapping = STATUS_MAPPINGS[tabType] as Record<number, any>;
  return mapping[stateId] || { text: `Status ${stateId}`, class: 'info', color: '#999999' };
};

// Status color mapping function
export const getStateColor = (stateId: number, stateStatus?: string): string => {
  // Use status text to determine color if available
  if (stateStatus) {
    const status = stateStatus.toLowerCase();
    if (status.includes('accepted') || status.includes('approved') || status.includes('received') || status.includes('принято')) {
      return 'var(--tg-theme-accent-text-color, #34C759)'; // success green
    }
    if (status.includes('processing') || status.includes('sent') || status.includes('отправлено') || status.includes('ожидает')) {
      return 'var(--tg-theme-link-color, #FF9500)'; // warning yellow
    }
    if (status.includes('draft') || status.includes('new') || status.includes('создано')) {
      return 'var(--tg-theme-hint-color, #999999)'; // neutral gray
    }
    if (status.includes('rejected') || status.includes('error') || status.includes('отклонено') || status.includes('ошибка')) {
      return 'var(--tg-theme-destructive-text-color, #FF3B30)'; // danger red
    }
  }

  // Fallback to state ID mapping
  if (stateId === 30) return 'var(--tg-theme-accent-text-color, #34C759)'; // success
  if (stateId === 10 || stateId === 15) return 'var(--tg-theme-link-color, #FF9500)'; // warning
  if (stateId === 0 || stateId === 7) return 'var(--tg-theme-hint-color, #999999)'; // neutral
  if (stateId === 17 || stateId === 20) return 'var(--tg-theme-destructive-text-color, #FF3B30)'; // danger

  return 'var(--tg-theme-hint-color, #999999)'; // default neutral
};

// API endpoint mapping for each tab type
const API_ENDPOINTS = {
  incoming: '/documents/act/receive',
  outgoing: '/documents/act/send',
  draft: '/documents/act/draft',
  sending: '/documents/act/queue'
} as const;

// Convert frontend filter to API request parameters
export const mapFiltersToApiRequest = (
  filters: ActFilter,
  pagination: { page: number; limit: number }
): ActApiRequest => {
  const params: ActApiRequest = {
    limit: pagination.limit,
    page: pagination.page
  };

  // Map search - detect if it's act number, TIN, or seller name
  if (filters.search) {
    const search = filters.search.trim();

    // Check if search looks like act number (contains ACT- or numbers/letters)
    if (search.match(/^(ACT-|\d)/i)) {
      params.actno = search;
    }
    // Check if search looks like TIN (9+ digits)
    else if (search.match(/^\d{9,}$/)) {
      params.sellertin = parseInt(search, 10);
    }
    // Otherwise treat as seller search (not directly supported by API)
    // We might need to handle this differently or add seller name search to API
  }

  // Map date filters
  if (filters.dateFrom) {
    params.actdate_start = filters.dateFrom;
  }

  if (filters.dateTo) {
    params.actdate_end = filters.dateTo;
  }

  // Status filter - for now, we don't use it since each endpoint has its own statuses
  // If needed, we can add stateid filter based on frontend status selection

  return params;
};

// Helper function to check if search is act number
// const isActNumber = (search: string): boolean => {
//   return search.match(/^(ACT-|\d)/i) !== null;
// };
//
// // Helper function to check if search is TIN
// const isTIN = (search: string): boolean => {
//   return search.match(/^\d{9,}$/) !== null;
// };

// Get acts for specific tab type
export const getActs = async (
  tabType: ActTabType,
  filters: ActFilter,
  pagination: { page: number; limit: number },
  token: string
): Promise<ActListResponse> => {
  const endpoint = API_ENDPOINTS[tabType];
  const params = mapFiltersToApiRequest(filters, pagination);

  const response = await apiClient.post(endpoint, params, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.data) {
    console.error('API response is null or undefined');
    return {
      items: [],
      hasMore: false,
      cursor: 1,
      total: 0
    };
  }

  // Check if response.data is directly an array (different API format)
  if (Array.isArray(response.data)) {
    return {
      items: response.data,
      hasMore: false, // No pagination info available
      cursor: 1,
      total: response.data.length
    };
  }

  // Check if response.data has pagination structure
  const apiData = response.data;
  return {
    items: apiData.data || [],
    hasMore: (apiData.current_page || 1) < (apiData.last_page || 1),
    cursor: apiData.current_page || 1,
    total: apiData.total || 0
  };
};

// Get single act details
export const getActById = async (actId: string, token: string): Promise<Act> => {
  // Assuming there's a details endpoint - adjust URL as needed
  const response = await apiClient.get(`/documents/act/${actId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return response.data || response;
};

// Individual API functions for each tab type
export const getIncomingActs = async (
  filters: ActFilter,
  pagination: { page: number; limit: number },
  token: string
): Promise<ActListResponse> => {
  return getActs('incoming', filters, pagination, token);
};

export const getOutgoingActs = async (
  filters: ActFilter,
  pagination: { page: number; limit: number },
  token: string
): Promise<ActListResponse> => {
  return getActs('outgoing', filters, pagination, token);
};

export const getDraftActs = async (
  filters: ActFilter,
  pagination: { page: number; limit: number },
  token: string
): Promise<ActListResponse> => {
  return getActs('draft', filters, pagination, token);
};

export const getSendingActs = async (
  filters: ActFilter,
  pagination: { page: number; limit: number },
  token: string
): Promise<ActListResponse> => {
  return getActs('sending', filters, pagination, token);
};
