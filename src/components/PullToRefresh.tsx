
import React, { useEffect } from 'react';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  enabled?: boolean;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({ 
  onRefresh, 
  children, 
  enabled = true 
}) => {
  const { 
    isRefreshing, 
    pullDistance, 
    shouldTrigger, 
    handlers, 
    manualRefresh 
  } = usePullToRefresh({ onRefresh, enabled });

  useEffect(() => {
    if (!enabled) return;

    // Only attach to the main content area, not the entire body
    const contentElement = document.querySelector('[data-scroll-container]') || document.body;
    
    const options = { passive: false };
    
    contentElement.addEventListener('touchstart', handlers.onTouchStart, options);
    contentElement.addEventListener('touchmove', handlers.onTouchMove, options);
    contentElement.addEventListener('touchend', handlers.onTouchEnd, options);

    return () => {
      contentElement.removeEventListener('touchstart', handlers.onTouchStart);
      contentElement.removeEventListener('touchmove', handlers.onTouchMove);
      contentElement.removeEventListener('touchend', handlers.onTouchEnd);
    };
  }, [handlers, enabled]);

  return (
    <div className="relative">
      {/* Pull indicator */}
      {pullDistance > 0 && (
        <div 
          className="fixed top-0 left-0 right-0 z-50 bg-blue-600 text-white text-center py-2 transition-all duration-200"
          style={{ 
            transform: `translateY(-${Math.max(0, 60 - pullDistance)}px)`,
            opacity: Math.min(1, pullDistance / 60)
          }}
        >
          <div className="flex items-center justify-center gap-2">
            <RefreshCw 
              className={`w-4 h-4 transition-transform duration-200 ${
                shouldTrigger ? 'rotate-180' : ''
              }`} 
            />
            {shouldTrigger ? 'Release to refresh' : 'Pull to refresh'}
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {isRefreshing && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-blue-600 text-white text-center py-2">
          <div className="flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Refreshing...
          </div>
        </div>
      )}

      {/* Manual refresh button for desktop */}
      <div className="hidden md:block fixed top-4 right-4 z-40">
        <Button
          onClick={manualRefresh}
          disabled={isRefreshing}
          size="sm"
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {children}
    </div>
  );
};

export default PullToRefresh;
