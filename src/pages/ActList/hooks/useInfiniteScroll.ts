import { useState, useEffect, useCallback, useRef } from 'react';
import type { Act, ActListResponse } from '@/types/act';

interface UseInfiniteScrollOptions {
  loadData: (page: number) => Promise<ActListResponse>;
  threshold?: number; // Percentage of scroll to trigger load (default: 0.8)
}

export const useInfiniteScroll = ({ loadData, threshold = 0.8 }: UseInfiniteScrollOptions) => {
  const [items, setItems] = useState<Act[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const scrollElementRef = useRef<HTMLElement | null>(null);
  const loadingRef = useRef(false);
  const loadDataRef = useRef(loadData);

  // Update ref when loadData changes
  useEffect(() => {
    loadDataRef.current = loadData;
  }, [loadData]);


  // Load more data
  const loadMoreData = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    
    setIsLoading(true);
    setError(null);
    loadingRef.current = true;
    
    try {
      const response = await loadDataRef.current(page);
      setItems(prev => [...prev, ...response.items]);
      setHasMore(response.hasMore);
      setPage(prev => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки данных');
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, [page, hasMore]);

  // Scroll handler with throttling
  const handleScroll = useCallback(() => {
    const scrollElement = scrollElementRef.current;
    if (!scrollElement || loadingRef.current || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollElement;
    
    // Add small buffer to prevent multiple triggers
    if (scrollHeight - (scrollTop + clientHeight) <= 100) {
      loadMoreData();
    }
  }, [loadMoreData, hasMore]);

  // Set up scroll listener with throttling
  const setScrollElement = useCallback((element: HTMLElement | null) => {
    // Remove previous listener
    if (scrollElementRef.current) {
      scrollElementRef.current.removeEventListener('scroll', handleScroll);
    }

    scrollElementRef.current = element;

    // Add new listener with throttling
    if (element) {
      let throttleTimer: NodeJS.Timeout | null = null;
      
      const throttledScroll = () => {
        if (throttleTimer) return;
        
        throttleTimer = setTimeout(() => {
          handleScroll();
          throttleTimer = null;
        }, 100); // 100ms throttle
      };
      
      element.addEventListener('scroll', throttledScroll, { passive: true });
    }
  }, [handleScroll]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scrollElementRef.current) {
        scrollElementRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  // Reset and load initial data when loadData changes
  useEffect(() => {
    // Add timeout to prevent too frequent updates
    const timeoutId = setTimeout(() => {
      // Reset state
      setItems([]);
      setPage(0);
      setHasMore(true);
      setError(null);
      loadingRef.current = false;
      
      // Load initial data
      const loadData = async () => {
        if (loadingRef.current) return;
        
        setIsLoading(true);
        setError(null);
        loadingRef.current = true;
        
        try {
          const response = await loadDataRef.current(0);
          setItems(response.items);
          setHasMore(response.hasMore);
          setPage(1);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Ошибка загрузки данных');
        } finally {
          setIsLoading(false);
          loadingRef.current = false;
        }
      };
      
      loadData();
    }, 50); // 50ms debounce
    
    return () => clearTimeout(timeoutId);
  }, [loadData]); // Only depend on loadData change

  // Retry function for error states
  const retry = useCallback(() => {
    if (items.length === 0) {
      // Reset and reload initial data
      setItems([]);
      setPage(0);
      setHasMore(true);
      setError(null);
      loadingRef.current = false;
      
      const loadData = async () => {
        if (loadingRef.current) return;
        
        setIsLoading(true);
        setError(null);
        loadingRef.current = true;
        
        try {
          const response = await loadDataRef.current(0);
          setItems(response.items);
          setHasMore(response.hasMore);
          setPage(1);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Ошибка загрузки данных');
        } finally {
          setIsLoading(false);
          loadingRef.current = false;
        }
      };
      
      loadData();
    } else {
      loadMoreData();
    }
  }, [items.length, loadMoreData]);

  return {
    items,
    hasMore,
    isLoading,
    error,
    setScrollElement,
    retry
  };
};