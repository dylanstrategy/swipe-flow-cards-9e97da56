
import React, { ReactNode, forwardRef, useImperativeHandle } from 'react';
import { useSwipeGestures } from '@/hooks/useSwipeGestures';
import { useViewportZoomPrevention } from '@/hooks/useViewportZoomPrevention';
import SwipeableScreenHeader from './SwipeableScreenHeader';
import SwipeActionOverlays from './SwipeActionOverlays';

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

export interface SwipeableScreenRef {
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: (e: React.TouchEvent) => void;
}

const SwipeableScreen = forwardRef<SwipeableScreenRef, SwipeableScreenProps>(({ 
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
}, ref) => {
  // Use custom hooks
  useViewportZoomPrevention();
  
  const {
    isDragging,
    dragOffset,
    showAction,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    getActionOpacity,
    getRotation
  } = useSwipeGestures({ onSwipeUp, onSwipeLeft, canSwipeUp });

  // Expose touch handlers via ref
  useImperativeHandle(ref, () => ({
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  }), [handleTouchStart, handleTouchMove, handleTouchEnd]);

  if (hideSwipeHandling) {
    return (
      <div className="fixed inset-0 bg-white z-[9999] flex flex-col h-screen" data-swipeable-screen>
        <SwipeableScreenHeader
          title={title}
          currentStep={currentStep}
          totalSteps={totalSteps}
          onClose={onClose}
          rightButton={rightButton}
        />

        {/* Content Area - Fixed for scrolling */}
        <div className="flex-1 overflow-y-auto relative z-10">
          <div className="p-4">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-white z-[9999] flex flex-col h-screen overflow-hidden select-none"
      data-swipeable-screen
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${getRotation()}deg)`,
        transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.2, 0, 0, 1)',
        transformOrigin: 'center center',
        touchAction: 'none'
      }}
    >
      <SwipeActionOverlays
        showAction={showAction}
        canSwipeUp={canSwipeUp}
        getActionOpacity={getActionOpacity}
      />

      <SwipeableScreenHeader
        title={title}
        currentStep={currentStep}
        totalSteps={totalSteps}
        onClose={onClose}
        rightButton={rightButton}
      />

      {/* Content Area */}
      <div className="flex-1 p-4 overflow-hidden relative z-10">
        {children}
      </div>
    </div>
  );
});

SwipeableScreen.displayName = 'SwipeableScreen';

export default SwipeableScreen;
