
import React from 'react';
import { ArrowUp } from 'lucide-react';

interface SwipeActionOverlaysProps {
  showAction: 'up' | 'left' | null;
  canSwipeUp: boolean;
  getActionOpacity: () => number;
}

const SwipeActionOverlays = ({ 
  showAction, 
  canSwipeUp, 
  getActionOpacity 
}: SwipeActionOverlaysProps) => {
  return (
    <>
      {/* Swipe Up Action Overlay */}
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

      {/* Swipe Left Action Overlay */}
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
    </>
  );
};

export default SwipeActionOverlays;
