import { useState, useEffect } from 'react';
import { 
  Button, 
  Input,
  List,
  Section,
  Cell,
  Checkbox
} from '@telegram-apps/telegram-ui';
import type { FC } from 'react';

import type { ActFilter, ActStatus } from '@/types/act';
import { formatDateForInput, parseDateFromInput } from '@/utils/formatters';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ActFilter;
  onApply: (filters: ActFilter) => void;
  onClear: () => void;
}

const STATUS_OPTIONS: { value: ActStatus; label: string }[] = [
  { value: 'draft', label: 'Черновик' },
  { value: 'sending', label: 'В процессе отправки' },
  { value: 'sent', label: 'Отправлен' },
  { value: 'received', label: 'Получен' },
  { value: 'completed', label: 'Завершен' },
  { value: 'error', label: 'Ошибка' }
];

export const FilterModal: FC<FilterModalProps> = ({ 
  isOpen, 
  onClose, 
  filters, 
  onApply, 
  onClear 
}) => {
  const [localFilters, setLocalFilters] = useState<ActFilter>(filters);

  // Update local filters when modal opens or filters prop changes
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
    }
  }, [isOpen, filters]);

  const handleApply = () => {
    const cleanedFilters: ActFilter = {};
    
    if (localFilters.search?.trim()) {
      cleanedFilters.search = localFilters.search.trim();
    }
    
    if (localFilters.dateFrom) {
      cleanedFilters.dateFrom = localFilters.dateFrom;
    }
    
    if (localFilters.dateTo) {
      cleanedFilters.dateTo = localFilters.dateTo;
    }
    
    if (localFilters.statuses && localFilters.statuses.length > 0) {
      cleanedFilters.statuses = localFilters.statuses;
    }
    
    if (localFilters.amountMin !== undefined && localFilters.amountMin > 0) {
      cleanedFilters.amountMin = localFilters.amountMin;
    }
    
    if (localFilters.amountMax !== undefined && localFilters.amountMax > 0) {
      cleanedFilters.amountMax = localFilters.amountMax;
    }

    onApply(cleanedFilters);
    onClose();
  };

  const handleClear = () => {
    setLocalFilters({});
    onClear();
    onClose();
  };

  const handleStatusToggle = (status: ActStatus) => {
    const currentStatuses = localFilters.statuses || [];
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status];
    
    setLocalFilters(prev => ({ ...prev, statuses: newStatuses }));
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-end'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxHeight: '90vh',
          backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px',
          borderBottom: '1px solid var(--tg-theme-separator-color, #e5e5e5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--tg-theme-text-color, #000000)'
          }}>
            Фильтр
          </h2>
          <Button size="s" mode="plain" onClick={onClose}>
            ×
          </Button>
        </div>

        {/* Content */}
        <div style={{ maxHeight: 'calc(90vh - 120px)', overflowY: 'auto' }}>
      <List style={{ padding: '0' }}>
        {/* Search */}
        <Section header="Поиск">
          <Cell>
            <Input
              header="По номеру, названию или ИНН"
              placeholder="Введите текст для поиска"
              value={localFilters.search || ''}
              onChange={(e) => setLocalFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </Cell>
        </Section>

        {/* Date Range */}
        <Section header="Период">
          <Cell>
            <Input
              type="date"
              header="Дата с"
              value={localFilters.dateFrom ? formatDateForInput(localFilters.dateFrom) : ''}
              onChange={(e) => setLocalFilters(prev => ({ 
                ...prev, 
                dateFrom: e.target.value ? parseDateFromInput(e.target.value) : undefined 
              }))}
            />
          </Cell>
          <Cell>
            <Input
              type="date"
              header="Дата по"
              value={localFilters.dateTo ? formatDateForInput(localFilters.dateTo) : ''}
              onChange={(e) => setLocalFilters(prev => ({ 
                ...prev, 
                dateTo: e.target.value ? parseDateFromInput(e.target.value) : undefined 
              }))}
            />
          </Cell>
        </Section>

        {/* Status */}
        <Section header="Статус">
          {STATUS_OPTIONS.map((option) => (
            <Cell
              key={option.value}
              before={
                <Checkbox
                  checked={localFilters.statuses?.includes(option.value) || false}
                  onChange={() => handleStatusToggle(option.value)}
                />
              }
              onClick={() => handleStatusToggle(option.value)}
            >
              {option.label}
            </Cell>
          ))}
        </Section>

        {/* Amount Range */}
        <Section header="Сумма">
          <Cell>
            <Input
              type="number"
              header="Сумма от"
              placeholder="0"
              value={localFilters.amountMin?.toString() || ''}
              onChange={(e) => setLocalFilters(prev => ({ 
                ...prev, 
                amountMin: e.target.value ? Number(e.target.value) : undefined 
              }))}
            />
          </Cell>
          <Cell>
            <Input
              type="number"
              header="Сумма до"
              placeholder="999999999"
              value={localFilters.amountMax?.toString() || ''}
              onChange={(e) => setLocalFilters(prev => ({ 
                ...prev, 
                amountMax: e.target.value ? Number(e.target.value) : undefined 
              }))}
            />
          </Cell>
        </Section>
      </List>
        </div>

        {/* Footer Buttons */}
        <div style={{ 
          padding: '16px',
          display: 'flex',
          gap: '8px',
          backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
          borderTop: '1px solid var(--tg-theme-separator-color, #e5e5e5)'
        }}>
          <Button 
            size="l" 
            stretched 
            onClick={handleApply}
            style={{ 
              backgroundColor: 'var(--tg-theme-button-color, #007AFF)',
              color: 'var(--tg-theme-button-text-color, #ffffff)'
            }}
          >
            Применить
          </Button>
          <Button 
            size="l" 
            mode="outline" 
            onClick={handleClear}
            style={{ minWidth: '100px' }}
          >
            Сбросить
          </Button>
        </div>
      </div>
    </div>
  );
};