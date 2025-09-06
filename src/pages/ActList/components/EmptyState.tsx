import { Placeholder, Button } from '@telegram-apps/telegram-ui';
import { FileSignature, AlertCircle } from 'lucide-react';
import type { FC } from 'react';

interface EmptyStateProps {
  type: 'empty' | 'error';
  onRetry?: () => void;
  onClearFilters?: () => void;
  hasFilters?: boolean;
}

export const EmptyState: FC<EmptyStateProps> = ({ 
  type, 
  onRetry, 
  onClearFilters, 
  hasFilters 
}) => {
  if (type === 'error') {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        padding: '40px 16px',
        gap: '16px'
      }}>
        <AlertCircle size={48} color="var(--tg-theme-destructive-text-color, #ff0000)" />
        <Placeholder
          header="Ошибка загрузки"
          description="Не удалось загрузить данные. Проверьте подключение к интернету."
        >
          {onRetry && (
            <Button 
              size="s" 
              onClick={onRetry}
              style={{
                backgroundColor: 'var(--tg-theme-button-color, #007AFF)',
                color: 'var(--tg-theme-button-text-color, #ffffff)'
              }}
            >
              Повторить
            </Button>
          )}
        </Placeholder>
      </div>
    );
  }

  // Empty state
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '40px 16px',
      gap: '16px'
    }}>
      <FileSignature size={48} color="var(--tg-theme-hint-color, #999999)" />
      <Placeholder
        header="Нет документов"
        description={
          hasFilters 
            ? "По выбранным фильтрам документы не найдены. Попробуйте изменить условия поиска."
            : "В этом разделе пока нет документов."
        }
      >
        {hasFilters && onClearFilters && (
          <Button 
            size="s" 
            mode="outline"
            onClick={onClearFilters}
          >
            Сбросить фильтры
          </Button>
        )}
      </Placeholder>
    </div>
  );
};