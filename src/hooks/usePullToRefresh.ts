
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
  const { toast } = useToast();

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled || isRefreshing) return;
    
    const touch = e.touches[0];
    startY.current = touch.clientY;
    isPulling.current = window.scrollY === 0;
  }, [enabled, isRefreshing]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!enabled || isRefreshing || !isPulling.current) return;

    const touch = e.touches[0];
    currentY.current = touch.clientY;
    const diff = currentY.current - startY.current;

    if (diff > 0 && window.scrollY === 0) {
      e.preventDefault();
      setPullDistance(Math.min(diff, threshold * 1.5));
    }
  }, [enabled, isRefreshing, threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (!enabled || isRefreshing || !isPulling.current) return;

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
