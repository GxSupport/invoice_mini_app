import { useState, useEffect, useCallback } from 'react';
import type { Act } from '@/types/act';

interface UseActDetailsResult {
  act: Act | null;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

// Import fake data generator from ActList
const generateFakeAct = (id: string): Act => {
  // Extract tab type and index from ID (format: "act-tabType-index")
  const parts = id.split('-');
  const tabType = parts[1] || 'incoming';
  const index = parseInt(parts[2] || '1', 10);
  
  const sellers = [
    'ООО "Алтын Тараqq"', 'АО "Узбекгидроэнерго"', 'ООО "Ташкент Текстиль"',
    'АО "Узметкомбинат"', 'ООО "Самарканд Буюм"', 'АО "Фарғона Нефть"',
    'ООО "Андижон Мева"', 'АО "Наманган Пахта"', 'ООО "Қарши Кимё"',
    'АО "Навоий ГМК"', 'ООО "Жиззах Мол"', 'АО "Сирдарё Электр"'
  ];

  const statuses = {
    incoming: ['received', 'completed'],
    outgoing: ['sent', 'completed'], 
    draft: ['draft'],
    sending: ['sending', 'error']
  };

  const statusOptions = statuses[tabType as keyof typeof statuses] || statuses.incoming;
  const status = statusOptions[index % statusOptions.length];
  
  const generateDate = () => {
    const start = new Date();
    start.setMonth(start.getMonth() - 6);
    const end = new Date();
    const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
    return new Date(randomTime).toISOString();
  };

  const notes = [
    'Дополнительные услуги включены',
    'Срочная поставка', 
    'Частичная отгрузка',
    'С НДС',
    'Предоплата получена',
    'Товар в пути',
    undefined
  ];

  return {
    id,
    no: `ACT-${1000 + index}`,
    date: generateDate(),
    seller: {
      name: sellers[index % sellers.length],
      tin: Math.floor(100000000 + Math.random() * 900000000).toString()
    },
    payable_total: Math.floor(1000000 + Math.random() * 49000000),
    note: notes[index % notes.length],
    state: status as any
  };
};

export const useActDetails = (actId: string): UseActDetailsResult => {
  const [act, setAct] = useState<Act | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadActDetails = useCallback(async (id: string) => {
    if (!id) {
      setError('Act ID is required');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Generate fake act data
      const actData = generateFakeAct(id);
      setAct(actData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load act details');
      setAct(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadActDetails(actId);
  }, [actId, loadActDetails]);

  const retry = useCallback(() => {
    loadActDetails(actId);
  }, [actId, loadActDetails]);

  return {
    act,
    isLoading,
    error,
    retry
  };
};