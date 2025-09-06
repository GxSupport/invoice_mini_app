import { useState, useMemo, useCallback } from 'react';
import type { Act, ActTabType, ActFilter, ActListResponse, ActStatus } from '@/types/act';

// Fake data generators
const SELLER_NAMES = [
  'ООО "Алтын Тараqq"', 'АО "Узбекгидроэнерго"', 'ООО "Ташкент Текстиль"',
  'АО "Узметкомбинат"', 'ООО "Самарканд Буюм"', 'АО "Фарғона Нефть"',
  'ООО "Андижон Мева"', 'АО "Наманган Пахта"', 'ООО "Қарши Кимё"',
  'АО "Навоий ГМК"', 'ООО "Жиззах Мол"', 'АО "Сирдарё Электр"',
  'ООО "Гулистон Машина"', 'АО "Термиз Энергия"', 'ООО "Нукус Қурилиш"'
];

const STATUSES: Record<ActTabType, ActStatus[]> = {
  incoming: ['received', 'completed'],
  outgoing: ['sent', 'completed'],
  draft: ['draft'],
  sending: ['sending', 'error']
};

const generateTIN = (): string => {
  return Math.floor(100000000 + Math.random() * 900000000).toString();
};

const generateActNumber = (): string => {
  return `ACT-${Math.floor(1000 + Math.random() * 9000)}`;
};

const generateDate = (): string => {
  const start = new Date();
  start.setMonth(start.getMonth() - 6);
  const end = new Date();
  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(randomTime).toISOString();
};

const generateAmount = (): number => {
  return Math.floor(1000000 + Math.random() * 49000000); // 1M to 50M UZS
};

const generateNote = (): string | undefined => {
  const notes = [
    'Дополнительные услуги включены',
    'Срочная поставка',
    'Частичная отгрузка',
    'С НДС',
    undefined, undefined, undefined // Make notes optional
  ];
  return notes[Math.floor(Math.random() * notes.length)];
};

const generateAct = (id: number, tabType: ActTabType): Act => {
  const statuses = STATUSES[tabType];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  return {
    id: `act-${tabType}-${id}`,
    no: generateActNumber(),
    date: generateDate(),
    seller: {
      name: SELLER_NAMES[Math.floor(Math.random() * SELLER_NAMES.length)],
      tin: generateTIN()
    },
    payable_total: generateAmount(),
    note: generateNote(),
    state: status
  };
};

const generateActsForTab = (tabType: ActTabType, count: number): Act[] => {
  return Array.from({ length: count }, (_, i) => generateAct(i + 1, tabType));
};

// Main hook
export const useActData = () => {
  const [currentTab, setCurrentTab] = useState<ActTabType>('incoming');
  const [filters, setFilters] = useState<ActFilter>({});
  const [loadingStates, setLoadingStates] = useState<Record<ActTabType, boolean>>({
    incoming: false,
    outgoing: false,
    draft: false,
    sending: false
  });

  // Generate fake data for all tabs
  const allTabsData = useMemo(() => ({
    incoming: generateActsForTab('incoming', 30),
    outgoing: generateActsForTab('outgoing', 30),
    draft: generateActsForTab('draft', 30),
    sending: generateActsForTab('sending', 30)
  }), []);

  // Filter and paginate data
  const getFilteredData = useCallback((tabType: ActTabType, page: number = 0, pageSize: number = 20): ActListResponse => {
    let data = allTabsData[tabType];

    // Apply filters
    if (filters.search) {
      const search = filters.search.toLowerCase();
      data = data.filter(act => 
        act.no.toLowerCase().includes(search) ||
        act.seller.name.toLowerCase().includes(search) ||
        act.seller.tin.includes(search)
      );
    }

    if (filters.dateFrom) {
      data = data.filter(act => act.date >= filters.dateFrom!);
    }

    if (filters.dateTo) {
      data = data.filter(act => act.date <= filters.dateTo!);
    }

    if (filters.statuses && filters.statuses.length > 0) {
      data = data.filter(act => filters.statuses!.includes(act.state));
    }

    if (filters.amountMin !== undefined) {
      data = data.filter(act => act.payable_total >= filters.amountMin!);
    }

    if (filters.amountMax !== undefined) {
      data = data.filter(act => act.payable_total <= filters.amountMax!);
    }

    // Sort by date DESC, then by no ASC
    data.sort((a, b) => {
      const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateComparison === 0) {
        return a.no.localeCompare(b.no);
      }
      return dateComparison;
    });

    // Paginate
    const start = page * pageSize;
    const end = start + pageSize;
    const paginatedData = data.slice(start, end);

    return {
      items: paginatedData,
      hasMore: end < data.length,
      cursor: end < data.length ? end.toString() : undefined,
      total: data.length
    };
  }, [allTabsData, filters]);

  const loadTabData = useCallback(async (tabType: ActTabType, page: number = 0): Promise<ActListResponse> => {
    setLoadingStates(prev => ({ ...prev, [tabType]: true }));
    
    // Simulate API call delay - reduced for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const result = getFilteredData(tabType, page);
    
    setLoadingStates(prev => ({ ...prev, [tabType]: false }));
    return result;
  }, [getFilteredData]);

  const applyFilters = useCallback((newFilters: ActFilter) => {
    setFilters(newFilters);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(value => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== '';
    });
  }, [filters]);

  return {
    currentTab,
    setCurrentTab,
    filters,
    applyFilters,
    clearFilters,
    hasActiveFilters,
    loadTabData,
    isLoading: loadingStates[currentTab]
  };
};