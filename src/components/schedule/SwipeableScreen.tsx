import React, { useState, useRef, ReactNode, useEffect } from 'react';
import { ArrowUp, X } from 'lucide-react';

interface SwipeableScreenProps {
  children: ReactNode;
  onSwipeUp?: () => void;
  onSwipeLeft?: () => void;
  canSwipeUp?: boolean;
  title: string;
  currentStep: number;
  totalSteps: number;
  onClose: () => void;
  hideSwipeHandling?: boolean;
  rightButton?: ReactNode;
}

const SwipeableScreen = ({ 
  children, 
  onSwipeUp, 
  onSwipeLeft, 
  canSwipeUp = false,
  title,
  currentStep,
  totalSteps,
  onClose,
  hideSwipeHandling = false,
  rightButton
}: SwipeableScreenProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showAction, setShowAction] = useState<'up' | 'left' | null>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const startTime = useRef(0);

  useEffect(() => {
    // Prevent zoom completely - more aggressive approach
    const viewport = document.querySelector('meta[name=viewport]');
    
    // Set strict no-zoom viewport
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
    } else {
      // Create viewport meta tag if it doesn't exist
      const newViewport = document.createElement('meta');
      newViewport.name = 'viewport';
      newViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
      document.head.appendChild(newViewport);
    }

    // Prevent all zoom gestures
    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Prevent double-tap zoom
    const preventDoubleTapZoom = (e: TouchEvent) => {
      e.preventDefault();
    };

    // Prevent zoom on input focus with more aggressive handling
    const preventInputZoom = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        // Force viewport to stay at scale 1
        setTimeout(() => {
          if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
          }
          window.scrollTo(0, 0);
        }, 100);
      }
    };

    // Add all event listeners
    document.addEventListener('touchstart', preventZoom, { passive: false });
    document.addEventListener('touchmove', preventZoom, { passive: false });
    document.addEventListener('touchend', preventDoubleTapZoom, { passive: false });
    document.addEventListener('focusin', preventInputZoom);
    document.addEventListener('focusout', preventInputZoom);

    // Prevent gesturestart for older iOS devices
    document.addEventListener('gesturestart', (e) => e.preventDefault(), { passive: false });
    document.addEventListener('gesturechange', (e) => e.preventDefault(), { passive: false });
    document.addEventListener('gestureend', (e) => e.preventDefault(), { passive: false });

    return () => {
      document.removeEventListener('touchstart', preventZoom);
      document.removeEventListener('touchmove', preventZoom);
      document.removeEventListener('touchend', preventDoubleTapZoom);
      document.removeEventListener('focusin', preventInputZoom);
      document.removeEventListener('focusout', preventInputZoom);
      document.removeEventListener('gesturestart', (e) => e.preventDefault());
      document.removeEventListener('gesturechange', (e) => e.preventDefault());
      document.removeEventListener('gestureend', (e) => e.preventDefault());
    };
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    startPos.current = { x: touch.clientX, y: touch.clientY };
    startTime.current = Date.now();
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startPos.current.x;
    const deltaY = touch.clientY - startPos.current.y;
    
    setDragOffset({ x: deltaX * 0.8, y: deltaY * 0.8 });
    
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      if (deltaY < -30 && canSwipeUp) {
        setShowAction('up');
      } else {
        setShowAction(null);
      }
    } else {
      if (deltaX < -30) {
        setShowAction('left');
      } else {
        setShowAction(null);
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    const deltaX = dragOffset.x;
    const deltaY = dragOffset.y;
    const deltaTime = Date.now() - startTime.current;
    
    const velocityX = Math.abs(deltaX) / deltaTime;
    const velocityY = Math.abs(deltaY) / deltaTime;
    
    const distanceThreshold = 50;
    const velocityThreshold = 0.3;
    
    const shouldCompleteUp = (Math.abs(deltaY) > distanceThreshold || velocityY > velocityThreshold) && 
                            deltaY < -distanceThreshold && canSwipeUp;
    const shouldCompleteLeft = (Math.abs(deltaX) > distanceThreshold || velocityX > velocityThreshold) && 
                              deltaX < -distanceThreshold;
    
    if (shouldCompleteUp && onSwipeUp) {
      onSwipeUp();
    } else if (shouldCompleteLeft && onSwipeLeft) {
      onSwipeLeft();
    }
    
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    setShowAction(null);
  };

  const getActionOpacity = () => {
    if (!showAction) return 0;
    const distance = showAction === 'up' ? Math.abs(dragOffset.y) : Math.abs(dragOffset.x);
    const progress = Math.min(distance / 80, 1);
    return Math.max(0.2, progress * 0.8);
  };

  const getRotation = () => {
    if (!isDragging) return 0;
    return (dragOffset.x * 0.02);
  };

  if (hideSwipeHandling) {
    return (
      <div className="flex flex-col h-full">
        {/* Compact Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-2 border-b border-gray-200 relative z-10">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 leading-tight">{title}</h1>
            <span className="text-xs text-gray-500">Step {currentStep} of {totalSteps}</span>
          </div>
          <div className="flex items-center gap-2">
            {rightButton}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="text-gray-600" size={18} />
            </button>
          </div>
        </div>
        
        {/* Compact Progress Bar */}
        <div className="flex-shrink-0 px-4 py-1.5 relative z-10">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-blue-600 h-1 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative z-10">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-white z-[9999] flex flex-col h-screen overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${getRotation()}deg)`,
        transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.2, 0, 0, 1)',
        transformOrigin: 'center center',
        touchAction: 'pan-x pan-y'
      }}
    >
      {/* Swipe Action Overlays */}
      {showAction === 'up' && canSwipeUp && (
        <div 
          className="absolute inset-0 flex items-start justify-center pt-16 transition-all duration-200 pointer-events-none z-50"
          style={{ 
            backgroundColor: '#22C55E',
            opacity: getActionOpacity()
          }}
        >
          <div className="text-white font-bold text-2xl flex flex-col items-center gap-3">
            <ArrowUp size={40} />
            <span>Continue</span>
          </div>
        </div>
      )}

      {showAction === 'left' && (
        <div 
          className="absolute inset-0 flex items-center justify-start pl-12 transition-all duration-200 pointer-events-none z-50"
          style={{ 
            backgroundColor: '#EF4444',
            opacity: getActionOpacity()
          }}
        >
          <div className="text-white font-bold text-2xl flex items-center gap-4">
            <span className="text-3xl">←</span>
            <span>Back</span>
          </div>
        </div>
      )}

      {/* Compact Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-2 border-b border-gray-200 relative z-10">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 leading-tight">{title}</h1>
          <span className="text-xs text-gray-500">Step {currentStep} of {totalSteps}</span>
        </div>
        <div className="flex items-center gap-2">
          {rightButton}
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="text-gray-600" size={18} />
          </button>
        </div>
      </div>
      
      {/* Compact Progress Bar */}
      <div className="flex-shrink-0 px-4 py-1.5 relative z-10">
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div 
            className="bg-blue-600 h-1 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative z-10">
        {children}
      </div>
    </div>
  );
};

export default SwipeableScreen;
