import { useState, useCallback, useRef, useEffect } from 'react';
import { List, Section, IconButton, Banner } from '@telegram-apps/telegram-ui';
import { Filter } from 'lucide-react';
import type { FC } from 'react';

import { Page } from '@/components/Page';
import type { ActListProps, ActTabType, ActFilter } from '@/types/act';
import { useActData } from './hooks/useActData';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';

import { ActTabs } from './components/ActTabs';
import { ActItem } from './components/ActItem';
import { FilterModal } from './components/FilterModal';
import { EmptyState } from './components/EmptyState';
import { ShimmerLoader } from './components/ShimmerLoader';



export const ActListPage: FC<ActListProps> = ({ onItemClick }) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const {
    currentTab,
    setCurrentTab,
    filters,
    applyFilters,
    clearFilters,
    hasActiveFilters,
    loadTabData
  } = useActData();

  // Memoize loadData function to prevent infinite re-renders
  const loadDataCallback = useCallback((page: number) => loadTabData(currentTab, page), [loadTabData, currentTab]);

  const {
    items,
    hasMore,
    isLoading,
    error,
    setScrollElement,
    retry
  } = useInfiniteScroll({
    loadData: loadDataCallback
  });

  // Set scroll element when component mounts
  useEffect(() => {
    if (scrollContainerRef.current) {
      setScrollElement(scrollContainerRef.current);
    }
  }, [setScrollElement]);

  // Handle tab change
  const handleTabChange = useCallback((tab: ActTabType) => {
    setCurrentTab(tab);
  }, [currentTab, setCurrentTab]);

  // Handle filter modal
  const handleFilterOpen = useCallback(() => {
    setIsFilterModalOpen(true);
  }, [currentTab, hasActiveFilters]);

  const handleFilterApply = useCallback((newFilters: ActFilter) => {
    applyFilters(newFilters);
  }, [applyFilters, currentTab]);

  const handleFilterClear = useCallback(() => {
    clearFilters();
  }, [clearFilters, currentTab]);

  // Handle item click
  const handleItemClick = useCallback((actId: string) => {
    onItemClick(actId);
  }, [onItemClick, currentTab]);

  // Handle retry
    useCallback(() => {
        retry();
    }, [retry, currentTab]);


  // @ts-ignore
    // @ts-ignore
    return (
    <Page back={true}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Header with Filter Button */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          borderBottom: '1px solid var(--tg-theme-separator-color, #e5e5e5)',
          backgroundColor: 'var(--tg-theme-bg-color, #ffffff)'
        }}>
          <h1 style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: 600,
            color: 'var(--tg-theme-text-color, #000000)'
          }}>
            Акты
          </h1>
          <IconButton
            onClick={handleFilterOpen}
            style={{
              color: hasActiveFilters
                ? 'var(--tg-theme-button-color, #007AFF)'
                : 'var(--tg-theme-hint-color, #999999)'
            }}
          >
            <Filter size={20} />
          </IconButton>
        </div>

        {/* Tabs */}
        <ActTabs activeTab={currentTab} onTabChange={handleTabChange} />

        {/* Content */}
        <div
          ref={scrollContainerRef}
          style={{
            flex: 1,
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
            position: 'relative',
            height: '0' // Flex container fix
          }}
        >
          {/* Error Banner */}
          {error && (
            <div style={{ padding: '8px 16px' }}>
              <Banner
                type="section"
                header="Ошибка загрузки"
                description={error}
                //onClose={handleRetry}
              />
            </div>
          )}

          {/* Initial Loading State */}
          {isLoading && items.length === 0 && !error && (
            <ShimmerLoader itemCount={5} />
          )}

          {/* Empty State */}
          {!isLoading && items.length === 0 && !error && (
            <EmptyState
              type="empty"
              hasFilters={hasActiveFilters}
              onClearFilters={handleFilterClear}
            />
          )}

          {/* Items List */}
          {items.length > 0 && (
            <List>
              <Section>
                {items.map((act) => (
                  <ActItem
                    key={act.id}
                    act={act}
                    tabType={currentTab}
                    onClick={handleItemClick}
                  />
                ))}

                {/* Loading More Indicator */}
                {isLoading && items.length > 0 && hasMore && (
                  <div style={{ padding: '16px' }}>
                    <ShimmerLoader itemCount={2} />
                  </div>
                )}
              </Section>
            </List>
          )}
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onApply={handleFilterApply}
        onClear={handleFilterClear}
      />
    </Page>
  );
};
