
import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface PullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number;
  enabled?: boolean;
}

export function usePullToRefresh({ onRefresh, threshold = 100, enabled = true }: PullToRefreshOptions) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const currentY = useRef(0);
  const isPulling = useRef(false);
  const hasStartedPull = useRef(false);
  const containerElement = useRef<HTMLElement | null>(null);
  const { toast } = useToast();

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled || isRefreshing) return;
    
    const touch = e.touches[0];
    startY.current = touch.clientY;
    hasStartedPull.current = false;
    
    // Find the scroll container
    const scrollContainer = document.querySelector('[data-scroll-container]') as HTMLElement;
    containerElement.current = scrollContainer;
    
    // Only consider this a potential pull if we're at the very top of the scroll container
    const isAtTop = scrollContainer ? scrollContainer.scrollTop <= 2 : window.scrollY <= 2;
    isPulling.current = isAtTop;
  }, [enabled, isRefreshing]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!enabled || isRefreshing || !isPulling.current) return;

    const touch = e.touches[0];
    currentY.current = touch.clientY;
    const diff = currentY.current - startY.current;

    // Check if we're still at the top
    const scrollContainer = containerElement.current;
    const isStillAtTop = scrollContainer ? scrollContainer.scrollTop <= 2 : window.scrollY <= 2;

    // Only activate pull-to-refresh if:
    // 1. We're scrolling down significantly (diff > 30px)
    // 2. We're still at the top of the scroll container
    // 3. The movement is a clear downward pull
    if (diff > 30 && isStillAtTop) {
      hasStartedPull.current = true;
      e.preventDefault(); // Only prevent default when we're actually pulling for refresh
      setPullDistance(Math.min(diff - 30, threshold * 1.5)); // Start counting after 30px
    } else if (diff <= 10 || !isStillAtTop) {
      // If scrolling up or not at top, stop pull-to-refresh
      isPulling.current = false;
      hasStartedPull.current = false;
      setPullDistance(0);
    }
  }, [enabled, isRefreshing, threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (!enabled || isRefreshing || !isPulling.current || !hasStartedPull.current) {
      setPullDistance(0);
      isPulling.current = false;
      hasStartedPull.current = false;
      return;
    }

    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      try {
        await onRefresh();
        toast({
          title: "Refreshed",
          description: "Data has been updated",
        });
      } catch (error) {
        console.error('Refresh failed:', error);
        toast({
          title: "Refresh Failed",
          description: "Please try again",
          variant: "destructive",
        });
      } finally {
        setIsRefreshing(false);
      }
    }

    setPullDistance(0);
    isPulling.current = false;
    hasStartedPull.current = false;
  }, [enabled, isRefreshing, pullDistance, threshold, onRefresh, toast]);

  const manualRefresh = useCallback(async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh();
      toast({
        title: "Refreshed",
        description: "Data has been updated",
      });
    } catch (error) {
      console.error('Manual refresh failed:', error);
      toast({
        title: "Refresh Failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, onRefresh, toast]);

  return {
    isRefreshing,
    pullDistance,
    shouldTrigger: pullDistance >= threshold,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    manualRefresh,
  };
}
